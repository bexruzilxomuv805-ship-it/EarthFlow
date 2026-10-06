// Sayyora sirtlari rasmsiz, shovqin (noise) orqali chiziladi. Haqiqiy rasm qo'shilsa, "Rasm" bo'limida ko'rinadi.
export const vert = /* glsl */ `
  varying vec3 vObj; varying vec3 vN;
  void main() {
    vObj = position;
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`

// 3D shovqin (value noise + fbm)
export const noise = /* glsl */ `
  float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vnoise(vec3 x) {
    vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; } return s; }
`

export const lighting = /* glsl */ `
  vec3 N = normalize(vN);
  vec3 L = normalize(vec3(-0.55, 0.35, 0.75));
  float diff = max(dot(N, L), 0.0);
  float rim = pow(1.0 - max(N.z, 0.0), 3.0);
`

export const marsFrag = /* glsl */ `
  varying vec3 vObj; varying vec3 vN;
  ${noise}
  void main() {
    ${lighting}
    vec3 p = normalize(vObj);
    float big = fbm(p * 2.2);
    float small = fbm(p * 7.0);
    vec3 rust = vec3(0.80, 0.36, 0.19), dust = vec3(0.93, 0.62, 0.38), dark = vec3(0.33, 0.14, 0.09);
    vec3 col = mix(rust, dust, smoothstep(0.45, 0.7, big));
    col = mix(col, dark, smoothstep(0.52, 0.72, fbm(p * 1.6 + 4.0)) * 0.75);
    col *= 0.85 + 0.3 * small;
    float cap = smoothstep(0.86, 0.93, abs(p.y) + (small - 0.5) * 0.12);
    col = mix(col, vec3(0.95, 0.95, 0.97), cap);
    vec3 lit = col * (0.10 + diff * 1.05) + vec3(0.9, 0.5, 0.35) * rim * 0.18;
    gl_FragColor = vec4(lit, 1.0);
    #include <colorspace_fragment>
  }`

export const venusFrag = /* glsl */ `
  uniform float uTime; varying vec3 vObj; varying vec3 vN;
  ${noise}
  void main() {
    ${lighting}
    vec3 p = normalize(vObj);
    vec3 q = vec3(p.x * 1.4, p.y * 3.2, p.z * 1.4);
    float t = uTime * 0.05;
    float w = fbm(q * 1.6 + vec3(t, 0.0, -t));
    float c = fbm(q * 2.4 + w * 2.2 + vec3(0.0, t * 2.0, 0.0));
    vec3 pale = vec3(0.97, 0.86, 0.55), gold = vec3(0.86, 0.60, 0.26), deep = vec3(0.62, 0.38, 0.17);
    vec3 col = mix(gold, pale, smoothstep(0.3, 0.75, c));
    col = mix(col, deep, smoothstep(0.55, 0.85, w) * 0.5);
    vec3 lit = col * (0.16 + diff * 1.0) + vec3(1.0, 0.8, 0.4) * rim * 0.45;
    gl_FragColor = vec4(lit, 1.0);
    #include <colorspace_fragment>
  }`

// Merkuriy: kulrang, kraterlar (chuqurchalar) va yorqin "nur" izlari
export const mercuryFrag = /* glsl */ `
  varying vec3 vObj; varying vec3 vN;
  ${noise}
  void main() {
    ${lighting}
    vec3 p = normalize(vObj);
    float base = fbm(p * 3.0);
    float cr = fbm(p * 11.0);
    float rimC = smoothstep(0.02, 0.0, abs(cr - 0.5) - 0.012) * 0.35;
    float pit = smoothstep(0.38, 0.30, cr) * 0.35;
    vec3 col = mix(vec3(0.33, 0.31, 0.30), vec3(0.66, 0.63, 0.60), smoothstep(0.25, 0.75, base));
    col = col * (1.0 - pit) + rimC;
    vec3 lit = col * (0.08 + diff * 1.1) + vec3(0.8, 0.75, 0.7) * rim * 0.08;
    gl_FragColor = vec4(lit, 1.0);
    #include <colorspace_fragment>
  }`

// Yupiter: gorizontal yo'llar va Katta Qizil Dog'
export const jupiterFrag = /* glsl */ `
  uniform float uTime; varying vec3 vObj; varying vec3 vN;
  ${noise}
  void main() {
    ${lighting}
    vec3 p = normalize(vObj);
    float warp = fbm(vec3(p.x * 3.0 + uTime * 0.02, p.y * 9.0, p.z * 3.0)) - 0.5;
    float band = sin((p.y + warp * 0.16) * 24.0) * 0.5 + 0.5;
    float fine = fbm(vec3(p.x * 6.0, p.y * 40.0, p.z * 6.0));
    vec3 cream = vec3(0.93, 0.85, 0.70), orange = vec3(0.80, 0.50, 0.30), brown = vec3(0.45, 0.28, 0.20);
    vec3 col = mix(mix(brown, orange, smoothstep(0.2, 0.7, band)), cream, smoothstep(0.55, 0.95, band));
    col *= 0.88 + 0.24 * fine;
    // Katta Qizil Dog'
    vec3 c = normalize(vec3(0.62, -0.33, 0.71));
    vec3 d = p - c;
    float e = length(vec3(d.x * 1.0, d.y * 2.2, d.z * 1.0));
    float spot = smoothstep(0.30, 0.10, e);
    float swirl = fbm(p * 12.0 + vec3(e * 6.0));
    col = mix(col, vec3(0.72, 0.28, 0.17) * (0.8 + 0.4 * swirl), spot);
    vec3 lit = col * (0.12 + diff * 1.0) + vec3(1.0, 0.85, 0.65) * rim * 0.12;
    gl_FragColor = vec4(lit, 1.0);
    #include <colorspace_fragment>
  }`

// Saturn: yumshoq oltin yo'llar
export const saturnFrag = /* glsl */ `
  varying vec3 vObj; varying vec3 vN;
  ${noise}
  void main() {
    ${lighting}
    vec3 p = normalize(vObj);
    float warp = fbm(vec3(p.x * 2.0, p.y * 6.0, p.z * 2.0)) - 0.5;
    float band = sin((p.y + warp * 0.08) * 30.0) * 0.5 + 0.5;
    vec3 a = vec3(0.89, 0.78, 0.55), b = vec3(0.76, 0.62, 0.40), c = vec3(0.95, 0.88, 0.70);
    vec3 col = mix(mix(b, a, smoothstep(0.2, 0.7, band)), c, smoothstep(0.7, 1.0, band) * 0.6);
    col *= 0.94 + 0.12 * fbm(p * 14.0);
    float hex = smoothstep(0.88, 0.96, p.y);
    col = mix(col, vec3(0.62, 0.55, 0.42), hex * 0.5);
    vec3 lit = col * (0.12 + diff * 1.0) + vec3(1.0, 0.9, 0.7) * rim * 0.12;
    gl_FragColor = vec4(lit, 1.0);
    #include <colorspace_fragment>
  }`

// Uran: silliq havorang-yashil
export const uranusFrag = /* glsl */ `
  varying vec3 vObj; varying vec3 vN;
  ${noise}
  void main() {
    ${lighting}
    vec3 p = normalize(vObj);
    float band = sin(p.y * 16.0 + fbm(p * 3.0) * 2.0) * 0.5 + 0.5;
    vec3 col = mix(vec3(0.46, 0.80, 0.84), vec3(0.64, 0.90, 0.92), band * 0.5 + 0.2 * fbm(p * 8.0));
    float cap = smoothstep(0.55, 0.95, p.y) * 0.15;
    col += cap;
    vec3 lit = col * (0.16 + diff * 1.0) + vec3(0.5, 0.95, 1.0) * rim * 0.35;
    gl_FragColor = vec4(lit, 1.0);
    #include <colorspace_fragment>
  }`

// Neptun: chuqur ko'k, oq bulutlar va Qorong'i Dog'
export const neptuneFrag = /* glsl */ `
  varying vec3 vObj; varying vec3 vN;
  ${noise}
  void main() {
    ${lighting}
    vec3 p = normalize(vObj);
    float w = fbm(vec3(p.x * 2.5, p.y * 7.0, p.z * 2.5));
    float band = sin((p.y + (w - 0.5) * 0.2) * 14.0) * 0.5 + 0.5;
    vec3 col = mix(vec3(0.08, 0.20, 0.72), vec3(0.20, 0.38, 0.92), band);
    float cirrus = smoothstep(0.62, 0.8, fbm(vec3(p.x * 9.0, p.y * 22.0, p.z * 9.0)));
    col = mix(col, vec3(0.88, 0.94, 1.0), cirrus * 0.55);
    vec3 c = normalize(vec3(-0.5, -0.35, 0.79));
    float spot = smoothstep(0.22, 0.06, length(vec3((p - c).x, (p - c).y * 2.0, (p - c).z)));
    col = mix(col, vec3(0.03, 0.07, 0.35), spot * 0.8);
    vec3 lit = col * (0.14 + diff * 1.0) + vec3(0.4, 0.6, 1.0) * rim * 0.4;
    gl_FragColor = vec4(lit, 1.0);
    #include <colorspace_fragment>
  }`

export const ringVert = /* glsl */ `
  varying float vR; varying vec3 vN;
  void main() { vR = length(position.xy); vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`

// Saturn halqalari: radius bo'yicha yo'llar va Kassini bo'shlig'i
export const ringFrag = /* glsl */ `
  uniform float uIn; uniform float uOut; varying float vR; varying vec3 vN;
  float h(float x) { return fract(sin(x * 91.3458) * 47453.5453); }
  void main() {
    float r = (vR - uIn) / (uOut - uIn);
    float bands = 0.55 + 0.35 * sin(r * 70.0) + 0.1 * (h(floor(r * 120.0)) - 0.5);
    float gap = smoothstep(0.60, 0.615, r) * (1.0 - smoothstep(0.645, 0.66, r));
    float a = smoothstep(0.0, 0.05, r) * (1.0 - smoothstep(0.93, 1.0, r));
    a *= mix(0.15, 0.9, smoothstep(0.18, 0.3, r)) * (1.0 - gap * 0.92) * bands;
    vec3 col = mix(vec3(0.62, 0.55, 0.45), vec3(0.93, 0.84, 0.66), smoothstep(0.25, 0.7, r));
    gl_FragColor = vec4(col, clamp(a, 0.0, 0.95));
    #include <colorspace_fragment>
  }`
