import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

interface HoloFoilProps {
  active: boolean
  width?: number
  height?: number
}

// Shader GLSL que calcula refração espectral (arco-íris holográfico) dependente do ângulo de visão
const HoloShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vViewPosition = cameraPosition - worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vViewPosition;

    // Função de gradiente arco-íris cósmico
    vec3 rainbow(float t) {
      return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
    }

    void main() {
      if (uIntensity <= 0.001) {
        discard;
      }

      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vWorldNormal);

      // Efeito Fresnel: intensidade de reflexo de borda
      float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
      float angleTerm = dot(viewDir, normal);

      // Coordenadas angulares prismáticas moduladas por UV
      float wave1 = sin((vUv.x * 3.5 + vUv.y * 2.0) * 3.14159 + angleTerm * 4.0 + uTime * 0.4);
      float wave2 = cos((vUv.x * 2.0 - vUv.y * 3.0) * 3.14159 - angleTerm * 3.0 + uTime * 0.3);
      float spectrumCoord = (wave1 + wave2) * 0.25 + (vUv.x + vUv.y) * 0.5 + fresnel * 0.8;

      vec3 spectralColor = rainbow(spectrumCoord);

      // Cintilação suave / glint estelar
      float glitter = sin(vUv.x * 120.0) * sin(vUv.y * 120.0);
      glitter = smoothstep(0.75, 1.0, glitter) * 0.35;

      // Cor final combinada com brilho néon Éther
      vec3 finalColor = spectralColor + vec3(glitter);
      float alpha = (0.35 + fresnel * 0.45) * uIntensity;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
}

export function HoloFoilOverlay({
  active,
  width = 3.25,
  height = 4.5,
}: HoloFoilProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0.0 },
    }),
    []
  )

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
      const targetIntensity = active ? 1.0 : 0.0
      materialRef.current.uniforms.uIntensity.value = THREE.MathUtils.damp(
        materialRef.current.uniforms.uIntensity.value,
        targetIntensity,
        6,
        delta
      )
    }
  })

  return (
    <mesh position={[0, 0, 0.027]}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={HoloShader.vertexShader}
        fragmentShader={HoloShader.fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
