'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// Simplex Noise 3D — GLSL (inlined, compact)
// ─────────────────────────────────────────────────────────────────────────────
const SIMPLEX_NOISE_GLSL = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

// ─────────────────────────────────────────────────────────────────────────────
// Vertex Shader — billboard instanced particles with noise & mouse warp
// ─────────────────────────────────────────────────────────────────────────────
const vertexShader = `
  ${SIMPLEX_NOISE_GLSL}

  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uMouseRadius;
  uniform float uMouseStrength;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  attribute float aScale;
  attribute float aPhase;
  attribute float aSpeed;

  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // Extract base position from instance matrix
    vec3 basePos = instanceMatrix[3].xyz;

    // Organic noise movement
    float n1 = snoise(vec3(basePos.xy * 0.35, uTime * aSpeed + aPhase));
    float n2 = snoise(vec3(basePos.yx * 0.35 + 200.0, uTime * aSpeed * 0.8 + aPhase));
    float n3 = snoise(vec3(basePos.xy * 0.15, uTime * 0.04 + aPhase));

    vec3 pos = basePos;
    pos.x += n1 * 0.9;
    pos.y += n2 * 0.9;
    pos.z += n3 * 0.6;

    // Mouse interaction — lens + swirl
    vec2 toMouse = uMouse.xy - pos.xy;
    float distMouse = length(toMouse);
    float mouseFactor = smoothstep(uMouseRadius, 0.0, distMouse);

    // Push away
    vec2 pushDir = normalize(toMouse + 0.0001);
    pos.xy -= pushDir * mouseFactor * uMouseStrength * 2.5;

    // Swirl around mouse
    float angle = mouseFactor * 2.5;
    float cs = cos(angle);
    float sn = sin(angle);
    vec2 rel = pos.xy - uMouse.xy;
    pos.xy = uMouse.xy + vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs);

    // Z displacement near mouse
    pos.z += mouseFactor * 1.5;

    // Color
    float colorMix = snoise(vec3(basePos.xy * 0.25, uTime * 0.06)) * 0.5 + 0.5;
    vColor = mix(uColorA, uColorB, colorMix);
    vColor += vec3(0.25, 0.2, 0.15) * mouseFactor;

    // Alpha
    vAlpha = 0.45 + mouseFactor * 0.55 + n3 * 0.15;

    // Scale pulse near mouse
    float finalScale = aScale * (1.0 + mouseFactor * 2.0 + n3 * 0.4);

    // Billboard to camera
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec3 right = vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]);
    vec3 up    = vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]);

    vec3 worldPos = mvPos.xyz
      + right * position.x * finalScale
      + up    * position.y * finalScale;

    gl_Position = projectionMatrix * vec4(worldPos, 1.0);
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// Fragment Shader — soft circular particles with inner glow
// ─────────────────────────────────────────────────────────────────────────────
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vUv;

  void main() {
    // Centered UV (-0.5..0.5)
    vec2 cUv = vUv - 0.5;
    float dist = length(cUv * 2.0);

    float mask = smoothstep(1.0, 0.2, dist);
    float glow = exp(-dist * dist * 4.0);

    vec3 finalColor = vColor * (glow * 0.9 + 0.1);
    float finalAlpha = mask * vAlpha;

    if (finalAlpha < 0.01) discard;

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// Core scene component
// ─────────────────────────────────────────────────────────────────────────────
function SingularityField() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const mouseRef = useRef(new THREE.Vector3(999, 999, 0))
  const { viewport, camera } = useThree()

  const PARTICLE_COUNT =
    typeof window !== 'undefined' && window.innerWidth < 768 ? 500 : 2500

  // Geometry: small centered plane
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.08, 0.08)
    return geo
  }, [])

  // Attributes for each instance
  const { positions, scales, phases, speeds } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const s = new Float32Array(PARTICLE_COUNT)
    const p = new Float32Array(PARTICLE_COUNT)
    const sp = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 12 + 1
      const layer = (Math.random() - 0.5) * 4

      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = layer

      s[i] = 0.5 + Math.random() * 1.5
      p[i] = Math.random() * Math.PI * 2
      sp[i] = 0.08 + Math.random() * 0.25
    }
    return { positions: pos, scales: s, phases: p, speeds: sp }
  }, [PARTICLE_COUNT])

  // Set instance matrices + attach custom attributes to geometry
  useEffect(() => {
    if (!meshRef.current) return
    const mesh = meshRef.current
    const dummy = new THREE.Object3D()

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true

    // Attach attributes to geometry (not to instanced mesh directly)
    // Three.js expects InstancedBufferAttribute on geometry for per-instance shader attributes
    const geo = mesh.geometry

    geo.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1))
    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    geo.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(speeds, 1))
  }, [PARTICLE_COUNT, positions, scales, phases, speeds])

  // Uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(999, 999, 0) },
      uMouseRadius: { value: 3.8 },
      uMouseStrength: { value: 1.0 },
      uColorA: { value: new THREE.Color('#00ff9d') },
      uColorB: { value: new THREE.Color('#00f0ff') },
    }),
    []
  )

  // Mouse → world space on z=0 plane
  useEffect(() => {
    const raycaster = new THREE.Raycaster()
    const mouseNDC = new THREE.Vector2()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const target = new THREE.Vector3()

    const onMove = (e: MouseEvent) => {
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1
      raycaster.setFromCamera(mouseNDC, camera)
      raycaster.ray.intersectPlane(plane, target)
      if (target) mouseRef.current.copy(target)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [camera])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t
      materialRef.current.uniforms.uMouse.value.lerp(mouseRef.current, 0.08)
    }
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, PARTICLE_COUNT]}
      frustumCulled={false}
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Public export
// ─────────────────────────────────────────────────────────────────────────────
export default function DataSingularity() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 50 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      frameloop="always"
      dpr={[1, 1.5]}
    >
      <SingularityField />
      <EffectComposer>
        <Bloom
          intensity={2.2}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
