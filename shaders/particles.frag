// ============================================================
//  PARTIKEL FRAGMENT SHADER
//  Weiche, runde Glow-Partikel. uColor steuert die Farbe.
// ============================================================
uniform vec3 uColor;
varying float vAlpha;

void main() {
  // runde Form aus dem quadratischen Point berechnen
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;

  // weicher radialer Abfall (Glow)
  float glow = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor, glow * vAlpha);
}
