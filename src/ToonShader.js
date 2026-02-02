import * as THREE from 'three';
export const ToonShader = {
    uniforms: { uColor: { value: new THREE.Color(0x4fc3f7) }, uLightDir: { value: new THREE.Vector3(1,1,1).normalize() }, uBorderWidth: { value: 0.02 } },
    vertexShader: `varying vec3 vN; void main() { vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
        uniform vec3 uColor; uniform vec3 uLightDir; varying vec3 vN;
        void main() {
            float i = dot(vN, uLightDir);
            i = i>0.95?1.0 : i>0.5?0.8 : i>0.25?0.5 : 0.3;
            gl_FragColor = vec4(uColor * i, 1.0);
        }
    `,
    outlineVertex: `uniform float uBorderWidth; void main() { vec3 p = position + normal * uBorderWidth; gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`,
    outlineFragment: `void main() { gl_FragColor = vec4(0.0,0.0,0.0,1.0); }`
};
