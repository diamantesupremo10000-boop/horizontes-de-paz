import * as THREE from 'three';
export class SkyDome {
    constructor(scene) {
        const uniforms = { topColor:{value:new THREE.Color(0x0077ff)}, bottomColor:{value:new THREE.Color(0xffffff)}, offset:{value:33}, exponent:{value:0.6} };
        const mat = new THREE.ShaderMaterial({
            uniforms, side:THREE.BackSide,
            vertexShader:`varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
            fragmentShader:`uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vW; void main(){ float h=normalize(vW+offset).y; gl_FragColor=vec4(mix(bottomColor,topColor,max(pow(max(h,0.0),exponent),0.0)),1.0); }`
        });
        scene.add(new THREE.Mesh(new THREE.SphereGeometry(400,32,15), mat));
        this.uniforms = uniforms;
    }
    updateColors(t, b) { this.uniforms.topColor.value.copy(t); this.uniforms.bottomColor.value.copy(b); }
}
