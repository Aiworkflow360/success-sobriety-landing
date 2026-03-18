import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function createNoise() {
  const perm = new Uint8Array(512)
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]

  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10) }
  function lerp(a, b, t) { return a + t * (b - a) }
  function grad(hash, x, y, z) {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  return function noise3D(x, y, z) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z)
    const u = fade(x), v = fade(y), w = fade(z)
    const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z
    const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z
    return lerp(
      lerp(lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
        lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u), v),
      lerp(lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
        lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v), w)
  }
}

export default function ParticleSphere({ className, style }) {
  const mountRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const noise = createNoise()
    const width = container.clientWidth
    const height = container.clientHeight
    if (width === 0 || height === 0) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 5.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const COUNT = 12000
    const basePositions = new Float32Array(COUNT * 3)
    const positions = new Float32Array(COUNT * 3)

    const golden = (1 + Math.sqrt(5)) / 2
    const radius = 1.2

    for (let i = 0; i < COUNT; i++) {
      const theta = (2 * Math.PI * i) / golden
      const phi = Math.acos(1 - (2 * (i + 0.5)) / COUNT)

      basePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      basePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      basePositions[i * 3 + 2] = radius * Math.cos(phi)
      positions[i * 3] = basePositions[i * 3]
      positions[i * 3 + 1] = basePositions[i * 3 + 1]
      positions[i * 3 + 2] = basePositions[i * 3 + 2]
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        uniform float uPixelRatio;
        varying float vDepth;
        varying vec3 vWorldPos;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vDepth = -mvPos.z;
          vWorldPos = position;
          gl_PointSize = uPixelRatio * (7.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying float vDepth;
        varying vec3 vWorldPos;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.3, 0.5, d);

          // Use world position to fake normal for lighting
          vec3 fakeNormal = normalize(vWorldPos);
          vec3 lightDir = normalize(vec3(0.2, 0.3, 1.0));
          float NdotL = dot(fakeNormal, lightDir);
          float lighting = smoothstep(-0.4, 0.6, NdotL);
          lighting = mix(0.04, 0.8, lighting);
          alpha *= lighting;

          float depthFade = smoothstep(3.5, 7.0, vDepth);
          alpha *= mix(1.0, 0.3, depthFade);

          vec3 color = vec3(0.72, 0.82, 1.0);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const clock = new THREE.Clock()
    let time = 0

    function animate() {
      animRef.current = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      time += delta * 0.25

      const posAttr = geometry.getAttribute('position')

      for (let i = 0; i < COUNT; i++) {
        const bx = basePositions[i * 3]
        const by = basePositions[i * 3 + 1]
        const bz = basePositions[i * 3 + 2]

        const len = Math.sqrt(bx * bx + by * by + bz * bz)
        const nx = bx / len
        const ny = by / len
        const nz = bz / len

        // Dot-product waves — seamless, no discontinuities
        // Each wave travels in a different direction across the surface
        // Wave 1: vertical sweep (pole to pole)
        const wave1 = Math.sin(nz * 3.14 + time * 1.8) * 0.22
        // Wave 2: horizontal sweep
        const wave2 = Math.sin(nx * 3.14 - time * 1.4) * 0.16
        // Wave 3: diagonal
        const wave3 = Math.sin((nx * 0.7 + ny * 0.7) * 3.14 + time * 1.0) * 0.14
        // Wave 4: counter-diagonal — creates inversions
        const wave4 = Math.sin((ny * 0.6 - nz * 0.8) * 3.14 + time * 0.7) * 0.18

        const breathe = 1.0 + Math.sin(time * 0.25) * 0.03

        const displacement = radius * (1.0 + wave1 + wave2 + wave3 + wave4) * breathe

        posAttr.array[i * 3] = nx * displacement
        posAttr.array[i * 3 + 1] = ny * displacement
        posAttr.array[i * 3 + 2] = nz * displacement
      }

      posAttr.needsUpdate = true

      // Very slow thoughtful drift
      points.rotation.x = Math.sin(time * 0.08) * 0.06
      points.rotation.y = time * 0.008 + Math.sin(time * 0.11) * 0.04
      points.rotation.z = Math.cos(time * 0.07) * 0.025

      renderer.render(scene, camera)
    }

    animate()

    function handleResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  )
}
