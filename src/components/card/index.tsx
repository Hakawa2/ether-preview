import * as THREE from 'three'
import { useTexture } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { GoldSparklesOverlay } from './GoldSparklesOverlay'

interface CardProps {
  isFlipped?: boolean
  isFoilActive?: boolean
  textureUrl?: string
}

export const Card = ({
  isFlipped = false,
  isFoilActive = false,
  textureUrl = '/guardiao.jpg',
}: CardProps) => {
  const texture = useTexture(textureUrl || '/guardiao.jpg')
  const meshRef = useRef<THREE.Group>(null)

  // Assegura fidelidade de cor sRGB da textura
  texture.colorSpace = THREE.SRGBColorSpace

  useFrame((_, delta) => {
    if (meshRef.current) {
      const targetRotationY = isFlipped ? Math.PI : 0
      meshRef.current.rotation.y = THREE.MathUtils.damp(
        meshRef.current.rotation.y,
        targetRotationY,
        8,
        delta
      )
    }
  })

  return (
    <group ref={meshRef}>
      {/* Carta Base: Face frontal usa material básico para ter 100% de brilho, saturação e fidelidade da imagem original */}
      <mesh>
        <boxGeometry args={[3.25, 4.5, 0.05]} />
        {/* Laterais (0, 1, 2, 3) */}
        <meshStandardMaterial attach="material-0" color="#1a1b21" roughness={0.5} />
        <meshStandardMaterial attach="material-1" color="#1a1b21" roughness={0.5} />
        <meshStandardMaterial attach="material-2" color="#1a1b21" roughness={0.5} />
        <meshStandardMaterial attach="material-3" color="#1a1b21" roughness={0.5} />
        {/* Face Frontal (4): Imagem pura 1:1 sem perda de iluminação */}
        <meshBasicMaterial attach="material-4" map={texture} toneMapped={false} />
        {/* Face Traseira (5): Cardback ou verso */}
        <meshStandardMaterial attach="material-5" color="#16171d" roughness={0.6} />
      </mesh>

      {/* Brilho das Estrelas Douradas da Carta Texturizada */}
      <GoldSparklesOverlay active={isFoilActive} width={3.24} height={4.49} />
    </group>
  )
}