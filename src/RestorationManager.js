import * as THREE from 'three';
export class RestorationManager {
    constructor(player, world) {
        this.player = player; this.world = world;
        this.rad = parseFloat(localStorage.getItem('hz_rad')) || 10;
        this.max = 150; this.center = new THREE.Vector3();
    }
    triggerRestoration() {
        this.center.copy(this.player.getPosition());
        const expand = () => {
            if(this.rad < this.max) { this.rad += 0.5; this.updateUniforms(); requestAnimationFrame(expand); }
            else localStorage.setItem('hz_rad', this.rad);
        };
        expand();
    }
    updateUniforms() {
        if(this.world.grass) {
            this.world.grass.material.uniforms.uRestorationRadius.value = this.rad;
            this.world.grass.material.uniforms.uRestorationCenter.value.copy(this.center);
        }
        document.getElementById('progress-bar-fill').style.width = (this.rad/this.max)*100 + '%';
    }
}
