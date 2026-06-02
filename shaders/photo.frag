// ============================================================
//  FOTO-PLANE FRAGMENT SHADER
//  Zeigt die Textur mit cinematic Vignette und Hover-Glow.
// ============================================================
uniform sampler2D uTexture;
uniform float uHover;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uTexture, vUv);

  // Vignette: Ränder leicht abdunkeln (Kino-Look)
  vec2 center = vUv - 0.5;
  float vign = smoothstep(0.85, 0.2, length(center));

  // Hover hebt das Bild leicht an
  vec3 color = tex.rgb * mix(0.82, 1.12, uHover);
  color *= mix(0.7, 1.0, vign);

  gl_FragColor = vec4(color, tex.a * uOpacity);
}
