import * as THREE from 'three';
export class Companion {
    constructor(scene, parent) {
        this.parent = parent;
        this.container = new THREE.Group();
        this.container.position.copy(parent.position).add(new THREE.Vector3(-1,1.5,1));
        scene.add(this.container);
        
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.2,0), new THREE.MeshStandardMaterial({color:0x00ffff, emissive:0x00ffff, emissiveIntensity:0.8}));
        this.container.add(core); this.core = core;
        
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.35,0.02,8,24), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.6}));
        ring.rotation.x = Math.PI/4; this.container.add(ring); this.ring = ring;
    }
    update(time, dt) {
        const target = new THREE.Vector3(-0.8, 1.4 + Math.sin(time*3)*0.1, 0.3).applyQuaternion(this.parent.quaternion).add(this.parent.position);
        this.container.position.lerp(target, 5*dt);
        this.core.rotation.y += dt; this.ring.rotation.z -= 2*dt;
    }
}
