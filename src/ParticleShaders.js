export const DustVert = `
  uniform float uTime; uniform float uPixelRatio; uniform vec3 uPlayerPos;
  attribute float aScale; attribute vec3 aVelocity; varying float vAlpha;
  vec3 wrap(vec3 v, vec3 minV, vec3 maxV) { return minV + mod(v - minV, maxV - minV); }
  void main() {
    vec3 p = position; p.y += uTime * aVelocity.y;
    vec3 world = wrap(uPlayerPos + p, uPlayerPos - vec3(30,10,30), uPlayerPos + vec3(30,10,30));
    float dist = distance(world, uPlayerPos);
    vAlpha = 1.0 - smoothstep(20.0, 30.0, dist);
    gl_PointSize = aScale * uPixelRatio * (50.0 / - (modelViewMatrix * vec4(world,1.0)).z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`;
export const DustFrag = `
  uniform vec3 uColor; varying float vAlpha;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if(d > 0.5) discard;
    gl_FragColor = vec4(uColor, vAlpha * pow(1.0 - d*2.0, 3.0));
  }
`;
