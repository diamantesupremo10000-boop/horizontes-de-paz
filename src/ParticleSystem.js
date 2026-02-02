import * as THREE from 'three';
import { DustVert, DustFrag } from './ParticleShaders.js';
export class ParticleSystem {
    constructor(scene, count) {
        this.scene = scene; this.count = count; this.init();
    }
    init() {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(this.count*3), vel = new Float32Array(this.count*3), sc = new Float32Array(this.count);
        for(let i=0;i<this.count;i++) {
            pos[i*3]=(Math.random()-0.5)*60; pos[i*3+1]=(Math.random()-0.5)*20; pos[i*3+2]=(Math.random()-0.5)*60;
            vel[i*3]=Math.random()*0.5; vel[i*3+1]=0.2+Math.random()*0.5; vel[i*3+2]=Math.random()*0.5;
            sc[i]=Math.random();
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
        geo.setAttribute('aVelocity', new THREE.BufferAttribute(vel,3));
        geo.setAttribute('aScale', new THREE.BufferAttribute(sc,1));
        this.material = new THREE.ShaderMaterial({
            vertexShader: DustVert, fragmentShader: DustFrag,
            uniforms: { uTime:{value:0}, uPixelRatio:{value:window.devicePixelRatio}, uPlayerPos:{value:new THREE.Vector3()}, uColor:{value:new THREE.Color(0x888888)} },
            transparent:true, depthWrite:false, blending:THREE.AdditiveBlending
        });
        this.scene.add(new THREE.Points(geo, this.material));
    }
    update(time, pos, isRestored) {
        this.material.uniforms.uTime.value = time;
        this.material.uniforms.uPlayerPos.value.copy(pos);
        this.material.uniforms.uColor.value.lerp(isRestored ? new THREE.Color(0xffd700) : new THREE.Color(0x888888), 0.05);
    }
}
