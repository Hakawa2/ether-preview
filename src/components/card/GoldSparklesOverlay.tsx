import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

interface SparklesProps {
  active: boolean
  width?: number
  height?: number
}

// Shader GLSL com estrelas de 4 pontas douradas bem definidas (✦ diamond stars) distribuídas por toda a carta
const SparklesShader = {
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

    // Função precisa de estrela de 4 pontas afiada (✦ Four-Point Star)
    // d.x e d.y cruzados formam os 4 raios côncavos característicos de estrelas de anime/TCG
    float drawStar(vec2 uv, vec2 center, float size, float rotation, float flare) {
      vec2 p = uv - center;
      
      // Matriz de rotação sutil
      float c = cos(rotation);
      float s = sin(rotation);
      p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);

      // Distâncias absolutas nos eixos X e Y
      vec2 a = abs(p);

      // Equação matemática de estrela astroidal / 4-pointed sparkle
      // Raio vertical longo + horizontal longo com curvatura hiperbólica
      float rayVertical = max(a.x * 5.0 + a.y * 0.9, a.y);
      float rayHorizontal = max(a.y * 5.0 + a.x * 0.9, a.x);
      float rayCross = min(rayVertical, rayHorizontal);

      float starShape = smoothstep(size, 0.0, rayCross);

      // Núcleo central luminoso
      float core = smoothstep(size * 0.45, 0.0, length(p));

      // Brilho difuso em volta (glow)
      float glow = smoothstep(size * 1.8, 0.0, length(p)) * 0.5;

      return (starShape * 1.5 + core * 1.2 + glow) * flare;
    }

    void main() {
      if (uIntensity <= 0.001) {
        discard;
      }

      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vWorldNormal);
      float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);

      float t = uTime;
      float total = 0.0;

      // 18 estrelas de quatro pontas espalhadas harmoniosamente por toda a extensão da carta
      // Topo & Cabeça
      total += drawStar(vUv, vec2(0.22, 0.88), 0.055, 0.0, 0.7 + 0.4 * sin(t * 3.4 + 0.2));
      total += drawStar(vUv, vec2(0.50, 0.92), 0.045, 0.1, 0.6 + 0.5 * sin(t * 2.9 + 1.8));
      total += drawStar(vUv, vec2(0.78, 0.86), 0.065, -0.05, 0.8 + 0.3 * sin(t * 3.8 + 3.1));

      // Terço Superior (Rosto, Ombros e Selo)
      total += drawStar(vUv, vec2(0.15, 0.76), 0.070, 0.0, 0.9 + 0.3 * sin(t * 2.7 + 0.8));
      total += drawStar(vUv, vec2(0.38, 0.79), 0.040, 0.15, 0.5 + 0.5 * sin(t * 4.1 + 2.4));
      total += drawStar(vUv, vec2(0.64, 0.73), 0.075, 0.0, 0.9 + 0.4 * sin(t * 3.1 + 4.5));
      total += drawStar(vUv, vec2(0.85, 0.71), 0.050, -0.1, 0.7 + 0.3 * sin(t * 2.6 + 1.1));

      // Meio da Carta (Corpo, Tronco e Borda Central)
      total += drawStar(vUv, vec2(0.28, 0.62), 0.045, 0.05, 0.6 + 0.4 * sin(t * 3.3 + 5.0));
      total += drawStar(vUv, vec2(0.50, 0.59), 0.085, 0.0, 1.0 + 0.3 * sin(t * 2.5 + 0.0));
      total += drawStar(vUv, vec2(0.74, 0.56), 0.055, -0.08, 0.7 + 0.4 * sin(t * 3.6 + 2.9));

      // Área de Lore / Caixa de Regras Superior
      total += drawStar(vUv, vec2(0.12, 0.46), 0.060, 0.0, 0.8 + 0.3 * sin(t * 3.0 + 1.4));
      total += drawStar(vUv, vec2(0.35, 0.42), 0.048, 0.1, 0.6 + 0.4 * sin(t * 3.9 + 4.0));
      total += drawStar(vUv, vec2(0.88, 0.44), 0.065, 0.0, 0.8 + 0.4 * sin(t * 2.8 + 2.2));

      // Caixa de Texto Inferior & Habilidades
      total += drawStar(vUv, vec2(0.18, 0.31), 0.075, 0.0, 0.9 + 0.3 * sin(t * 3.2 + 3.7));
      total += drawStar(vUv, vec2(0.58, 0.34), 0.050, 0.05, 0.7 + 0.3 * sin(t * 4.0 + 0.9));
      total += drawStar(vUv, vec2(0.82, 0.28), 0.070, -0.05, 0.8 + 0.4 * sin(t * 2.9 + 5.5));

      // Rodapé da Carta
      total += drawStar(vUv, vec2(0.30, 0.15), 0.055, 0.0, 0.7 + 0.4 * sin(t * 3.5 + 1.7));
      total += drawStar(vUv, vec2(0.70, 0.14), 0.060, 0.0, 0.8 + 0.3 * sin(t * 3.1 + 4.3));

      // Cores: Ouro vívido (#fcd34d / #f59e0b) com transição para núcleo branco incandescente
      vec3 starGold = vec3(1.0, 0.78, 0.22);
      vec3 starAmber = vec3(1.0, 0.58, 0.10);
      vec3 coreWhite = vec3(1.0, 0.98, 0.90);

      vec3 starColor = mix(starAmber, starGold, 0.6);
      vec3 finalColor = mix(starColor, coreWhite, smoothstep(0.6, 1.4, total));

      // Sutil reflexo de borda holográfica dourada
      vec3 rimGold = starGold * fresnel * 0.25;

      float alpha = clamp(total * 1.6 + fresnel * 0.15, 0.0, 1.0) * uIntensity;

      gl_FragColor = vec4(finalColor * total * 1.3 + rimGold, alpha);
    }
  `,
}

export function GoldSparklesOverlay({
  active,
  width = 3.25,
  height = 4.5,
}: SparklesProps) {
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
        7,
        delta
      )
    }
  })

  return (
    <mesh position={[0, 0, 0.028]}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={SparklesShader.vertexShader}
        fragmentShader={SparklesShader.fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
