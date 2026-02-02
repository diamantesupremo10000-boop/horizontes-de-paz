import * as THREE from 'three';
export class CameraController {
    constructor(camera) {
        this.camera = camera;
        this.target = new THREE.Vector3();
        this.radius = 8; this.theta = Math.PI; this.phi = Math.PI / 3;
    }
    update(targetPosition, inputDelta) {
        this.theta -= inputDelta.x * 0.002;
        this.phi = Math.max(0.1, Math.min(Math.PI/2 - 0.1, this.phi - inputDelta.y * 0.002));
        this.target.lerp(targetPosition, 0.1);
        this.camera.position.set(
            this.target.x + this.radius * Math.sin(this.phi) * Math.sin(this.theta),
            this.target.y + this.radius * Math.cos(this.phi),
            this.target.z + this.radius * Math.sin(this.phi) * Math.cos(this.theta)
        );
        this.camera.lookAt(this.target);
    }
    getForwardVector() {
        const f = new THREE.Vector3(); this.camera.getWorldDirection(f); f.y = 0; return f.normalize();
    }
}
