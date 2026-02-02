export const GrassVert = `
  precision highp float; uniform float uTime; uniform vec3 uPlayerPos;
  attribute vec3 offset; attribute float scale; varying vec2 vUv; varying float vHeight; varying vec3 vWorldPos;
  void main() {
    vUv = uv; vHeight = uv.y; vec3 pos = position; pos.y *= scale; 
    float wind = sin(uTime * 2.0 + offset.x * 0.5 + offset.z * 0.5) * 0.5 * uv.y;
    pos.x += wind;
    vec3 worldPos = offset + vec3(pos.x, 0.0, pos.z);
    
    // Infinite scrolling logic
    vec3 relPos = worldPos - uPlayerPos;
    if(relPos.x > 60.0) worldPos.x -= 120.0; if(relPos.x < -60.0) worldPos.x += 120.0;
    if(relPos.z > 60.0) worldPos.z -= 120.0; if(relPos.z < -60.0) worldPos.z += 120.0;
    vWorldPos = worldPos;

    float dist = distance(worldPos.xz, uPlayerPos.xz);
    if (dist < 2.0) {
        vec3 push = normalize(worldPos - uPlayerPos);
        float inf = (1.0 - dist / 2.0) * uv.y;
        pos.x += push.x * inf * 2.0; pos.z += push.z * inf * 2.0; pos.y -= inf * 0.5;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos + worldPos - offset, 1.0);
  }
`;
export const GrassFrag = `
  precision highp float; varying float vHeight; varying vec3 vWorldPos;
  uniform vec3 uSunColor; uniform vec3 uRestorationCenter; uniform float uRestorationRadius;
  void main() {
    vec3 alive = mix(vec3(0.1,0.4,0.1), vec3(0.6,0.9,0.4), vHeight);
    vec3 dead = mix(vec3(0.2,0.2,0.15), vec3(0.4,0.4,0.35), vHeight);
    float dist = distance(vWorldPos.xz, uRestorationCenter.xz);
    float factor = 1.0 - smoothstep(uRestorationRadius, uRestorationRadius + 5.0, dist);
    gl_FragColor = vec4(mix(dead, alive, factor) * uSunColor, 1.0);
  }
`;
