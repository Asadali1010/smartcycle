/**
 * GLSL for BrainField's single Points draw call. All assemble/hold/
 * disassemble motion is computed here from one uTime uniform (seconds,
 * wrapped to the 12s loop before being set) so nothing touches CPU-side
 * position buffers per frame. The simplex noise below is the standard
 * Ashima/McEwan public-domain 3D implementation, used only for the HOLD
 * phase's idle jitter.
 */

const SIMPLEX_NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

export const BRAIN_VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uReduced;
uniform vec3 uPointer;
uniform float uRepelRadius;
uniform float uRepelStrength;
uniform float uPixelRatio;
uniform float uBaseSize;
uniform vec3 uColorA;
uniform vec3 uColorB;

attribute vec3 aOrigin;
attribute vec3 aCurl;
attribute vec4 aParams;
attribute float aGradient;

varying float vAlpha;
varying vec3 vColor;

${SIMPLEX_NOISE_GLSL}

vec3 quadBezier(vec3 p0, vec3 p1, vec3 p2, float t) {
  vec3 a = mix(p0, p1, t);
  vec3 b = mix(p1, p2, t);
  return mix(a, b, t);
}

const float HOLD_START = 4.0;
const float HOLD_END = 8.0;
const float LOOP = 12.0;

void main() {
  float delay = aParams.x;
  float seed = aParams.y;
  float side = aParams.z;
  float surface = aParams.w;

  vec3 target = position;
  vec3 pos;
  float alpha;

  if (uReduced > 0.5) {
    pos = target;
    alpha = 0.85 + 0.15 * sin(uTime * 1.2 + seed * 6.2831);
  } else {
    float t = uTime;
    if (t < HOLD_START) {
      float local = clamp((t - delay) / max(0.001, HOLD_START - delay), 0.0, 1.0);
      float eased = 1.0 - pow(1.0 - local, 3.0);
      vec3 ctrl = mix(aOrigin, target, 0.5) + aCurl;
      pos = quadBezier(aOrigin, ctrl, target, eased);
      alpha = eased;
    } else if (t < HOLD_END) {
      float holdT = (t - HOLD_START) / (HOLD_END - HOLD_START);
      float jitterEnvelope = smoothstep(0.0, 0.12, holdT) * (1.0 - smoothstep(0.88, 1.0, holdT));
      vec3 jitter = vec3(
        snoise(target * 3.0 + uTime * 0.6 + seed),
        snoise(target * 3.0 + uTime * 0.6 + seed + 17.0),
        snoise(target * 3.0 + uTime * 0.6 + seed + 41.0)
      ) * 0.015 * jitterEnvelope;
      pos = target + jitter;
      alpha = 0.75 + 0.25 * sin(uTime * 2.0 + seed * 6.2831);
    } else {
      float dissolveStart = HOLD_END + side * 1.4;
      float local = clamp((t - dissolveStart) / max(0.001, LOOP - dissolveStart), 0.0, 1.0);
      float eased = local * local;
      vec3 ctrl = mix(target, aOrigin, 0.5) - aCurl;
      pos = quadBezier(target, ctrl, aOrigin, eased);
      float pulse = 0.75 + 0.25 * sin(uTime * 2.0 + seed * 6.2831);
      alpha = pulse * (1.0 - eased);
    }

    vec3 toPoint = pos - uPointer;
    float d = length(toPoint);
    float repel = smoothstep(uRepelRadius, 0.0, d) * uRepelStrength;
    pos += normalize(toPoint + 0.0001) * repel;
  }

  vAlpha = alpha * (0.55 + 0.45 * surface);
  vColor = mix(uColorA, uColorB, aGradient);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  float depthFade = clamp(1.0 - (-mvPosition.z - 2.0) / 10.0, 0.35, 1.0);
  vAlpha *= depthFade;
  gl_PointSize = uBaseSize * uPixelRatio * (0.6 + 0.4 * surface) * depthFade * (2.2 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const BRAIN_FRAGMENT_SHADER = /* glsl */ `
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float mask = smoothstep(0.5, 0.0, d);
  if (mask <= 0.001) discard;
  gl_FragColor = vec4(vColor, vAlpha * mask);
}
`;

/** Synapse lines only render during HOLD, static endpoints — the vertex
 * shader is a pass-through, all timing/flicker logic lives in the fragment
 * shader keyed off the shared uTime uniform. */
export const SYNAPSE_VERTEX_SHADER = /* glsl */ `
attribute float aPhase;
varying float vPhase;

void main() {
  vPhase = aPhase;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const SYNAPSE_FRAGMENT_SHADER = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
varying float vPhase;

const float HOLD_START = 4.0;
const float HOLD_END = 8.0;

void main() {
  float holdMask = smoothstep(HOLD_START, HOLD_START + 0.4, uTime)
    * (1.0 - smoothstep(HOLD_END - 0.4, HOLD_END, uTime));
  float flickerSeed = fract(sin(vPhase * 91.7 + floor(uTime * 3.0)) * 43758.5453);
  float flicker = step(0.62, flickerSeed);
  gl_FragColor = vec4(uColor, holdMask * flicker * 0.5);
}
`;
