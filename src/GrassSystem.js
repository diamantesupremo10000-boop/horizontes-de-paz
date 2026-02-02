import * as THREE from 'three';
import { GrassVert, GrassFrag } from './GrassShaders.js';

export class GrassSystem {
    constructor(scene, count) {
        this.scene = scene;
        this.count = count;
        this.init();
    }
    init() {
        const geo = new THREE.PlaneGeometry(0.15, 1.5, 1, 4);
        geo.translate(0, 0.75, 0);
        
        this.material = new THREE.ShaderMaterial({
            vertexShader: GrassVert, fragmentShader: GrassFrag,
            uniforms: {
                uTime: { value: 0 }, uPlayerPos: { value: new THREE.Vector3() },
                uSunColor: { value: new THREE.Color(1,1,1) },
                uRestorationCenter: { value: new THREE.Vector3() }, uRestorationRadius: { value: 10.0 }
            },
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.InstancedMesh(geo, this.material, this.count);
        const offsets = new Float32Array(this.count * 3);
        const scales = new Float32Array(this.count);
        for(let i=0; i<this.count; i++) {
            offsets[i*3] = (Math.random()-0.5)*120; offsets[i*3+1] = 0; offsets[i*3+2] = (Math.random()-0.5)*120;
            scales[i] = 0.8 + Math.random()*0.7;
        }
        geo.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3));
        geo.setAttribute('scale', new THREE.InstancedBufferAttribute(scales, 1));
        this.scene.add(this.mesh);
    }
    update(time, pos) {
        this.material.uniforms.uTime.value = time;
        this.material.uniforms.uPlayerPos.value.copy(pos);
    }
}
