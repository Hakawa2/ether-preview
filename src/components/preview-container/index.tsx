import { OrbitControls } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { forwardRef } from 'react'

interface PreviewContainerProps {
  children: React.ReactNode
  autoRotate?: boolean
}

export const PreviewContainer = forwardRef<OrbitControlsImpl, PreviewContainerProps>(
  ({ children, autoRotate = false }, ref) => {
    return (
      <>
        {/* Luz ambiente clara para garantir que os tons brancos e médios da imagem fiquem vivos */}
        <ambientLight intensity={1.05} />

        {/* Luz direcional frontal suave sem sombras duras para iluminar a arte por inteiro */}
        <directionalLight position={[0, 0, 5]} intensity={0.45} />

        {/* Back light para iluminar o verso da carta quando virada */}
        <directionalLight position={[0, 0, -4]} intensity={0.9} />

        {/* Rim lights temáticas para contorno de profundidade tridimensional nas bordas */}
        <directionalLight position={[4, 2, -1]} intensity={0.5} color="#4cd7f6" />
        <directionalLight position={[-4, -2, -1]} intensity={0.4} color="#a078ff" />

        {/* Grupo elevado para a carta não colidir com o dock inferior */}
        <group position={[0, 0.45, 0]}>
          {children}
        </group>

        {/* OrbitControls: drag to rotate, scroll to zoom com limites seguros para não cobrir o dock */}
        <OrbitControls
          ref={ref}
          autoRotate={autoRotate}
          autoRotateSpeed={2.5}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.08}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
          target={[0, 0.45, 0]}
          minDistance={4.8}
          maxDistance={11}
        />
      </>
    )
  }
)

PreviewContainer.displayName = 'PreviewContainer'
