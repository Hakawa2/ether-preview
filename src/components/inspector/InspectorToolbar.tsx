import type { UnifiedCardData } from '../../lib/catalog'
import { CardStageSelector } from './CardStageSelector'
import { CardPillsBar } from './CardPillsBar'
import { TacticalActionBar } from './TacticalActionBar'

interface InspectorToolbarProps {
  cards: UnifiedCardData[]
  selectedCard: UnifiedCardData
  isFoilActive: boolean
  isAutoRotating: boolean
  isFlipped: boolean
  onSelectCard: (card: UnifiedCardData) => void
  onToggleFoil: () => void
  onToggleAutoRotate: () => void
  onFlipCard: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export function InspectorToolbar({
  cards,
  selectedCard,
  isFoilActive,
  isAutoRotating,
  isFlipped,
  onSelectCard,
  onToggleFoil,
  onToggleAutoRotate,
  onFlipCard,
  onZoomIn,
  onZoomOut,
  onReset,
}: InspectorToolbarProps) {
  return (
    <div className="flex flex-col gap-2.5 w-full max-w-md mx-auto">
      {/* 1. Seletor de Cartas com Busca */}
      <CardStageSelector
        cards={cards}
        selectedCard={selectedCard}
        onSelectCard={onSelectCard}
      />

      {/* 2. Pílulas de Status e Botão Foil */}
      <CardPillsBar
        card={selectedCard}
        isFoilActive={isFoilActive}
        onToggleFoil={onToggleFoil}
      />

      {/* 3. Tactical Action Bar para Controle do 3D */}
      <TacticalActionBar
        isAutoRotating={isAutoRotating}
        isFlipped={isFlipped}
        onToggleAutoRotate={onToggleAutoRotate}
        onFlipCard={onFlipCard}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onReset={onReset}
      />
    </div>
  )
}
