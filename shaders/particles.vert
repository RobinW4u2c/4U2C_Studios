// ============================================================
//  PARTIKEL VERTEX SHADER
//  Bewegt Partikel sanft (Nebel/Staub-Effekt) über die Zeit.
//  uTime kommt aus dem Material-Uniform, jeder Punkt bekommt
//  eine eigene Phase über das aPhase Attribut.
// ============================================================
uniform float uTime;
uniform float uSize;

attribute float aPhase;
attribute float aScale;

varying float vAlpha;

void main() {
  vec3 pos = position;

  // langsames vertikales Schweben + leichtes seitliches Driften
  pos.y += sin(uTime * 0.3 + aPhase) * 0.6;
  pos.x += cos(uTime * 0.2 + aPhase * 1.7) * 0.4;
  pos.z += sin(uTime * 0.15 + aPhase * 0.9) * 0.4;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  // Punktgröße abhängig von Distanz (perspektivisch korrekt)
  gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  // Partikel pulsiert leicht in der Helligkeit
  vAlpha = 0.35 + 0.35 * sin(uTime * 0.8 + aPhase);
}
