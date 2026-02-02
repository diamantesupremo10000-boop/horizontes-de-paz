import * as THREE from 'three';
import { ToonShader } from './ToonShader.js';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.container = new THREE.Group();
        this.scene.add(this.container);
        this.createCharacterModel();
        
        this.velocity = new THREE.Vector3();
        this.speed = 0;
        this.isGrounded = true;
        this.isGliding = false;
    }

    createCharacterModel() {
        const geo = new THREE.CapsuleGeometry(0.4, 1, 4, 8);
        const mat = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(ToonShader.uniforms),
            vertexShader: ToonShader.vertexShader,
            fragmentShader: ToonShader.fragmentShader
        });
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.position.y = 0.9;
        this.mesh.castShadow = true;

        // Outline (Borde negro anime)
        const outlineMat = new THREE.ShaderMaterial({
            uniforms: { uBorderWidth: { value: 0.015 } },
            vertexShader: ToonShader.outlineVertex,
            fragmentShader: ToonShader.outlineFragment,
            side: THREE.BackSide
        });
        this.mesh.add(new THREE.Mesh(geo, outlineMat));

        // Halo
        const halo = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 8, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        halo.position.y = 0.8; halo.rotation.x = Math.PI / 2;
        this.mesh.add(halo);
        this.container.add(this.mesh);
    }

    update(dt, input, cameraController) {
        const camForward = cameraController.getForwardVector();
        const camRight = new THREE.Vector3().crossVectors(camForward, new THREE.Vector3(0, 1, 0));
        
        let ix = input.joystick.x, iz = input.joystick.y;
        if (ix === 0 && iz === 0) {
            if (input.keys.forward) iz = -1; if (input.keys.backward) iz = 1;
            if (input.keys.right) ix = 1; if (input.keys.left) ix = -1;
        }
        
        const dir = new THREE.Vector3().addScaledVector(camForward, -iz).addScaledVector(camRight, ix);
        if (dir.length() > 1) dir.normalize();

        const targetSpeed = (input.keys.shift ? 12 : 6) * dir.length();
        this.speed = THREE.MathUtils.lerp(this.speed, targetSpeed, dt * 8);

        if (dir.lengthSq() > 0.01) {
            const angle = Math.atan2(dir.x, dir.z);
            this.mesh.quaternion.slerp(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), angle), 0.15);
        }

        this.velocity.x = dir.x * this.speed;
        this.velocity.z = dir.z * this.speed;

        // Salto y Planeo
        if (this.isGrounded) {
            this.isGliding = false;
            if (input.keys.space) { 
                this.velocity.y = 15; 
                this.isGrounded = false; 
                input.jumpPressedCount = 0; 
            }
        } else {
            if (input.jumpPressedCount > 1 && this.velocity.y < 0) this.isGliding = true;
            if (!input.keys.space) this.isGliding = false;
        }

        if (this.isGliding) {
            this.velocity.y = -2.5; // Caída lenta
            this.mesh.rotation.x = 0.4;
        } else {
            this.velocity.y -= 35 * dt; // Gravedad
            this.mesh.rotation.x = 0;
        }

        this.container.position.addScaledVector(this.velocity, dt);

        // Suelo Simple
        if (this.container.position.y <= 0) {
            this.container.position.y = 0;
            this.velocity.y = 0;
            this.isGrounded = true;
        }
    }

    triggerRestoration() { /* Lógica visual de onda expansiva */ }
    getPosition() { return this.container.position; }
}
