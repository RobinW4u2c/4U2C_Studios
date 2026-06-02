// ============================================================
//  TYPDEKLARATIONEN FÜR GLSL-IMPORTE
//  Erlaubt `import shader from '@/shaders/x.vert'` als string.
//  (Der webpack asset/source Loader liefert den Inhalt.)
// ============================================================
declare module '*.glsl' { const value: string; export default value; }
declare module '*.vert' { const value: string; export default value; }
declare module '*.frag' { const value: string; export default value; }
declare module '*.vs'   { const value: string; export default value; }
declare module '*.fs'   { const value: string; export default value; }
