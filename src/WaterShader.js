export const WaterVert = `
  uniform float uTime; varying vec2 vUv; varying float vEl;
  void main() {
    vUv = uv; vec3 p = position;
    p.y += sin(p.x*2.0+uTime)*0.1 + cos(p.z*1.5+uTime*0.8)*0.1;
    vEl = p.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
export const WaterFrag = `
  uniform vec3 uColorShallow; uniform vec3 uColorDeep; varying float vEl;
  void main() {
    vec3 c = mix(uColorDeep, uColorShallow, (vEl+0.2)*2.0);
    if(vEl > 0.15) c = mix(c, vec3(1.0), 0.8);
    gl_FragColor = vec4(c, 0.85);
  }
`;
