import * as THREE from 'three';
import { GrassSystem } from './GrassSystem.js';
import { SkyDome } from './SkyDome.js';
import { WaterVert, WaterFrag } from './WaterShader.js';
import { ParticleSystem } from './ParticleSystem.js';

export class World {
    constructor(scene, ecoSystem, soundManager) {
        this.scene = scene;
        this.ecoSystem = ecoSystem;
        this.soundManager = soundManager;
        
        this.setupGround();
        this.setupWater();
        this.setupTrees();
        
        this.skyDome = new SkyDome(this.scene);
        this.grass = new GrassSystem(this.scene, 25000);
        this.particles = new ParticleSystem(this.scene, 2000);
    }

    setupGround() {
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200), 
            new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1 })
        );
        ground.rotation.x = -Math.PI / 2;
        
        // --- CORRECCIÓN DE Z-FIGHTING (SUELO) ---
        // Antes: -0.1
        // Ahora: -0.15 (Lo bajamos un poco más para separarlo claramente de otros elementos)
        ground.position.y = -0.15;
        // ----------------------------------------
        
        this.scene.add(ground);
    }

    setupWater() {
        const water = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500, 64, 64), 
            new THREE.ShaderMaterial({
                vertexShader: WaterVert, 
                fragmentShader: WaterFrag,
                uniforms: { 
                    uTime: { value: 0 }, 
                    uColorShallow: { value: new THREE.Color(0x4fc3f7) }, 
                    uColorDeep: { value: new THREE.Color(0x0277bd) } 
                },
                transparent: true, 
                side: THREE.DoubleSide
            })
        );
        water.rotation.x = -Math.PI / 2;
        
        // --- CORRECCIÓN DE Z-FIGHTING (AGUA) ---
        // Antes: -0.5
        // Ahora: -0.55 (Aseguramos que no toque planos cercanos al 0.5)
        water.position.y = -0.55; 
        // ---------------------------------------
        
        this.scene.add(water); 
        this.water = water;
    }

    setupTrees() {
        // Árboles simples pero efectivos
        const trunkGeo = new THREE.CylinderGeometry(0.5, 0.8, 2, 7);
        const leavesGeo = new THREE.ConeGeometry(3, 6, 7);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20 });

        for (let i = 0; i < 20; i++) {
            const x = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            const t = new THREE.Group();
            t.position.set(x, 0, z);
            
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = 1; 
            t.add(trunk);
            
            const leaves = new THREE.Mesh(leavesGeo, leavesMat);
            leaves.position.y = 4; 
            t.add(leaves);
            
            this.scene.add(t);
        }
    }

    update(dt, time, playerPos) {
        if (this.grass) this.grass.update(time, playerPos);
        if (this.water) this.water.material.uniforms.uTime.value = time;
        
        let isRestored = false;
        if (this.grass) {
            const center = this.grass.material.uniforms.uRestorationCenter.value;
            const radius = this.grass.material.uniforms.uRestorationRadius.value;
            if (playerPos.distanceTo(center) < radius) isRestored = true;
        }
        
        if (this.particles) this.particles.update(time, playerPos, isRestored);
    }
}
