import * as THREE from 'three'
import { Canvas } from "@react-three/fiber"
import { useRef, useState } from "react"
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

import cardsData from './cards.json'
import { Card } from './components/card'
import { PreviewContainer } from './components/preview-container'
import { BrandHeader } from './components/layout/BrandHeader'
import { InspectorToolbar } from './components/inspector/InspectorToolbar'
import type { CardData } from './types/card'
import { CardSequenceViewer } from './components/sequence/CardSequenceViewer'
import { buildUnifiedCatalog, type UnifiedCardData } from './lib/catalog'

// Catálogo unificado sem duplicatas de Texturizada
const UNIFIED_CARDS: UnifiedCardData[] = buildUnifiedCatalog(cardsData.cards as CardData[])

export const App = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  // Carta ativa inicial (Suzana II, Riveli ou a primeira da lista)
  const [selectedCard, setSelectedCard] = useState<UnifiedCardData>(() => {
    return UNIFIED_CARDS.find((c) => c.name.includes('Suzana II')) || UNIFIED_CARDS[0]
  })

  // Se a carta tiver versão Texturizada, já inicia com ela ativada
  const [isFoilActive, setIsFoilActive] = useState<boolean>(() => {
    const initial = UNIFIED_CARDS.find((c) => c.name.includes('Suzana II')) || UNIFIED_CARDS[0]
    return initial.hasTexturizada
  })

  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false)
  const [isFlipped, setIsFlipped] = useState<boolean>(false)

  // Atualiza carta e ajusta o estado do foil/texturizada conforme disponibilidade
  const handleSelectCard = (newCard: UnifiedCardData) => {
    setSelectedCard(newCard)
    setIsFoilActive(newCard.hasTexturizada)
  }

  // Define a textura frontal: se texturizada estiver ativa e disponível, usa a arte texturizada
  const activeTextureUrl =
    isFoilActive && selectedCard.hasTexturizada && selectedCard.texturizadaImageUrl
      ? selectedCard.texturizadaImageUrl
      : selectedCard.normalImageUrl

  // Funções da câmera do OrbitControls com limite seguro de aproximação
  const handleZoom = (delta: number) => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object
      const newZ = THREE.MathUtils.clamp(camera.position.z + delta, 4.8, 9.5)
      camera.position.set(0, 0.45, newZ)
      controlsRef.current.update()
    }
  }

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
      controlsRef.current.target.set(0, 0.45, 0)
      controlsRef.current.object.position.set(0, 0.45, 6.2)
      controlsRef.current.update()
      setIsFlipped(false)
      setIsAutoRotating(false)
    }
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background select-none flex flex-col">
      {/* Luz ambiente etérea de fundo */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.22),rgba(10,11,16,0))]" />

      {/* 1. Header Principal com Logo, Título e Tema */}
      <BrandHeader />

      {/* 2. Top Tactical Section (Card Selector com Busca, Tags & Action Bar) */}
      <section className="relative z-30 pt-16 px-4 sm:px-6 w-full max-w-lg mx-auto pointer-events-auto">
        <InspectorToolbar
          cards={UNIFIED_CARDS}
          selectedCard={selectedCard}
          isFoilActive={isFoilActive}
          isAutoRotating={isAutoRotating}
          isFlipped={isFlipped}
          onSelectCard={handleSelectCard}
          onToggleFoil={() => setIsFoilActive((prev) => !prev)}
          onToggleAutoRotate={() => setIsAutoRotating((prev) => !prev)}
          onFlipCard={() => setIsFlipped((prev) => !prev)}
          onZoomIn={() => handleZoom(-0.6)}
          onZoomOut={() => handleZoom(0.6)}
          onReset={handleResetCamera}
        />
      </section>

      {/* 3. 3D Viewport com Canvas R3F — área central totalmente livre para o card */}
      <div className="absolute inset-0 z-10 w-full h-full pt-16 pb-40">
        <Canvas
          camera={{ position: [0, 0.45, 6.2], fov: 45 }}
          gl={{
            antialias: true,
            toneMapping: THREE.LinearToneMapping,
            toneMappingExposure: 1.0,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <PreviewContainer ref={controlsRef} autoRotate={isAutoRotating}>
            <Card
              key={`${selectedCard.id}-${isFoilActive ? 'tex' : 'norm'}`}
              isFlipped={isFlipped}
              isFoilActive={isFoilActive}
              textureUrl={activeTextureUrl}
            />
          </PreviewContainer>
        </Canvas>
      </div>

      {/* 4. BOTTOM FLOATING CONTAINER: Evolution Sequence Dock (Fiel ao Stitch) */}
      <div className="fixed bottom-3 inset-x-0 z-30 px-4 sm:px-6 w-full max-w-lg mx-auto pointer-events-none">
        <CardSequenceViewer
          allCards={UNIFIED_CARDS}
          selectedCard={selectedCard}
          onSelectCard={handleSelectCard}
        />
      </div>
    </main>
  )
}
