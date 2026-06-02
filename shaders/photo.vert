// ============================================================
//  FOTO-PLANE VERTEX SHADER
//  Leichte organische Wellenbewegung + Übergabe der UVs.
// ============================================================
uniform float uTime;
uniform float uHover;   // 0..1 Hover-Intensität

varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  // sanfte Welle über die Fläche, verstärkt bei Hover
  float wave = sin(pos.x * 2.0 + uTime) * 0.02 * (0.4 + uHover);
  pos.z += wave;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
