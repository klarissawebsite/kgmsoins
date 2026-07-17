"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useLowPower } from "@/lib/hooks";
import { heroScroll } from "@/lib/heroScroll";

const BASE_SCALE = 1.18;

/**
 * Custom-GLSL "plasma orb" hero centerpiece.
 *   - multi-octave simplex-noise vertex displacement (churning liquid surface)
 *   - sharp fresnel rim + a hot near-white edge + energy glow where it bulges
 *   - reactive: ripples hard with SCROLL VELOCITY, lunges toward the CURSOR.
 * The bright rim/energy feed the existing Bloom pass.
 */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uScroll;
  uniform float uProgress;
  varying vec3  vNormal;
  varying vec3  vView;
  varying float vDisp;

  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
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
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main(){
    float t = uTime * 0.5;
    float n1 = snoise(position * 1.3 + vec3(0.0, 0.0, t));
    float n2 = snoise(position * 3.0 + vec3(t * 0.9));
    float n3 = snoise(position * 6.5 - vec3(t * 1.4));
    float disp = n1 * 0.26 + n2 * 0.11 + n3 * 0.045;
    disp += uScroll * 0.32 * (n1 + 0.5);                  // scroll velocity ripple
    vec3 mdir = normalize(vec3(uMouse * 1.4, 0.85));
    float bulge = smoothstep(-0.1, 1.0, dot(normalize(position), mdir));
    disp += 0.20 * bulge;                                 // cursor lunge
    disp += uProgress * 0.16 * (n2 + n3 + 0.5);           // sustained "energize" as the pinned hero is scrubbed

    vec3 displaced = position + normal * disp;
    vDisp = disp;
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uTime;
  uniform float uProgress;
  varying vec3  vNormal;
  varying vec3  vView;
  varying float vDisp;

  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    vec3 L = normalize(vec3(0.35, 0.65, 0.7));            // key light, upper-right-front

    float diff = clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0);  // soft wrapped diffuse
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.6);
    vec3  H    = normalize(L + V);
    float spec = pow(clamp(dot(N, H), 0.0, 1.0), 60.0);

    // Iridescent shimmer riding the churning crests.
    float irid = 0.5 + 0.5 * sin(vDisp * 10.0 + uTime * 0.8 + vNormal.x * 3.0);
    vec3  surface = mix(uColorA, uColorB, irid);

    // Glossy violet liquid bead, lit to read against the near-white page:
    // deep violet in shade -> lilac in light, never white, so it stays solid.
    vec3 col = mix(uColorA * 0.45, surface, diff);
    // Darker violet silhouette so the edge separates cleanly from the light bg.
    col = mix(col, uColorA * 0.5, fres * 0.55);
    // Crisp specular gloss + energy along the crests.
    col += vec3(1.0) * spec * 0.55;
    col += (uColorB - uColorA) * max(vDisp, 0.0) * 0.7;

    // uProgress (hero scroll-scrub): deepen/saturate the violet and sharpen the
    // highlight as the pinned hero is scrolled through.
    col = mix(col, uColorA * 0.8, uProgress * 0.18);
    col += spec * uProgress * 0.4;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function PlasmaOrb() {
  const mesh = useRef<THREE.Mesh>(null);
  const lowPower = useLowPower();
  const detail = lowPower ? 14 : 28;

  const pointerTarget = useRef(new THREE.Vector2(0, 0));
  const lastScrollY = useRef(0);
  const scrollVel = useRef(0);
  const heroProg = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uProgress: { value: 0 },
      uColorA: { value: new THREE.Color("#2F7688") },
      uColorB: { value: new THREE.Color("#BFD8B9") },
    }),
    [],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerTarget.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    lastScrollY.current = window.scrollY;
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    uniforms.uTime.value += d;

    const y = window.scrollY;
    const target = Math.min(Math.abs(y - lastScrollY.current) / 70, 2.2);
    lastScrollY.current = y;
    scrollVel.current += (target - scrollVel.current) * Math.min(1, d * 3.5);
    uniforms.uScroll.value = scrollVel.current;

    uniforms.uMouse.value.lerp(pointerTarget.current, Math.min(1, d * 3.5));

    // Hero scroll-scrub progress (0→1), written by the pinned hero's
    // ScrollTrigger. Stays 0 on mobile/reduced-motion → identical to before.
    heroProg.current += (heroScroll.progress - heroProg.current) * Math.min(1, d * 4);
    uniforms.uProgress.value = heroProg.current;

    if (mesh.current) {
      mesh.current.rotation.y += d * 0.12;
      mesh.current.rotation.x = uniforms.uMouse.value.y * 0.25;
      mesh.current.rotation.z = uniforms.uMouse.value.x * 0.18;
      mesh.current.scale.setScalar(BASE_SCALE * (1 + heroProg.current * 0.06));
    }
  });

  return (
    <mesh ref={mesh} scale={BASE_SCALE}>
      <icosahedronGeometry args={[1.25, detail]} />
      <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
    </mesh>
  );
}
