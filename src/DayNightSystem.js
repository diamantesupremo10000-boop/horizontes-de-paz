import * as THREE from 'three';
export class DayNightSystem {
    constructor(scene, world) {
        this.world = world; this.time = 12; this.speed = 1.0;
        this.sun = new THREE.DirectionalLight(0xffffff, 1.5);
        this.sun.position.set(50,100,50); this.sun.castShadow = true;
        this.sun.shadow.mapSize.set(2048,2048); this.sun.shadow.camera.far = 500;
        scene.add(this.sun); scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    }
    update(dt, sky) {
        this.time += dt * this.speed; if(this.time>=24) this.time=0;
        const ang = (this.time/24)*Math.PI*2 - Math.PI/2;
        this.sun.position.set(Math.cos(ang)*100, Math.sin(ang)*100, 50);
        
        // Ciclo simple
        const isDay = this.time > 6 && this.time < 18;
        const top = isDay ? new THREE.Color(0x0077ff) : new THREE.Color(0x000022);
        const bot = isDay ? new THREE.Color(0x87ceeb) : new THREE.Color(0x001133);
        sky.updateColors(sky.uniforms.topColor.value.lerp(top, 0.05), sky.uniforms.bottomColor.value.lerp(bot, 0.05));
        
        if(this.world.grass) {
             if(!this.world.grass.material.uniforms.uSunColor.value) this.world.grass.material.uniforms.uSunColor.value = new THREE.Color(1,1,1);
             this.world.grass.material.uniforms.uSunColor.value.lerp(isDay?new THREE.Color(1,1,1):new THREE.Color(0.2,0.2,0.5), 0.05);
        }
    }
}
