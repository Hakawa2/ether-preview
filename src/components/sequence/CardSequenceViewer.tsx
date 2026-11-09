import { useMemo, useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, GitBranch } from 'lucide-react'
import type { UnifiedCardData } from '../../lib/catalog'
import { getMultiSequenceGroup, type EvolutionLine } from '../../lib/sequence'
import { SequenceThumbnail } from './SequenceThumbnail'
import { cn } from '../../lib/utils'

interface CardSequenceViewerProps {
  allCards: UnifiedCardData[]
  selectedCard: UnifiedCardData
  onSelectCard: (card: UnifiedCardData) => void
}

/**
 * Componente principal da Sequência Evolutiva da Carta.
 *
 * Ajustado para resolver os problemas de layout:
 * 1. Ícone nativo SVG GitBranch (eliminando o texto bruto 'account_tree').
 * 2. Seletor de múltiplas linhas posicionado na LINHA DE BAIXO (sem esmagar o título).
 * 3. Proporção das thumbnails calibrada (min-w 70px) para exibir até 4 fases harmoniosamente.
 */
export function CardSequenceViewer({
  allCards,
  selectedCard,
  onSelectCard,
}: CardSequenceViewerProps) {
  // Calcula todas as linhas evolutivas válidas que passam pela carta selecionada
  const multiSequence = useMemo(
    () => getMultiSequenceGroup(allCards, selectedCard),
    [allCards, selectedCard]
  )

  // Linha ativa selecionada no seletor (quando houver mais de 1 linha)
  const [selectedLineId, setSelectedLineId] = useState<string>('')

  // Sempre sincroniza a linha ativa quando a carta ou as linhas mudarem
  useEffect(() => {
    if (!multiSequence || multiSequence.lines.length === 0) {
      setSelectedLineId('')
      return
    }

    // Se a linha atual ainda for válida, mantém; senão usa a primeira
    setSelectedLineId((prev) => {
      const stillExists = multiSequence.lines.some((l) => l.id === prev)
      return stillExists ? prev : multiSequence.lines[0].id
    })
  }, [multiSequence])

  // Sem sequência válida (menos de 2 cartas na cadeia) -> não renderiza nada
  if (!multiSequence || multiSequence.lines.length === 0) {
    return null
  }

  const activeLine: EvolutionLine =
    multiSequence.lines.find((l) => l.id === selectedLineId) ?? multiSequence.lines[0]

  const currentIndex = activeLine.cards.findIndex((c) => c.id === selectedCard.id)
  const progressLabel = `Fase ${activeLine.currentPhase} de ${activeLine.totalPhases}`
  const hasMultipleLines = multiSequence.lines.length > 1

  return (
    <section className="w-full flex flex-col gap-1.5 z-20 pointer-events-auto">
      {/* LINHA 1: Dock Header (Título + Badge de Fase) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <GitBranch className="w-4 h-4 text-secondary flex-shrink-0" />
          <span className="font-display text-xs sm:text-sm font-semibold text-on-surface tracking-tight truncate">
            Sequência Evolutiva da Carta
          </span>
        </div>

        {/* Progression Pill (Fase X de Y) */}
        <span
          id="evoProgressBadge"
          className="font-display text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary tracking-widest uppercase flex-shrink-0"
        >
          {progressLabel}
        </span>
      </div>

      {/* LINHA 2 (Sub-header): Seletor de Linha Evolutiva quando houver mais de 1 linha */}
      {hasMultipleLines && (
        <div className="flex items-center gap-2 px-1 py-0.5 overflow-x-auto no-scrollbar">
          <span className="font-display text-[10px] uppercase tracking-wider text-outline flex-shrink-0">
            Linha:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {multiSequence.lines.map((l, idx) => {
              const isActive = l.id === activeLine.id
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelectedLineId(l.id)}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-display font-medium transition-all flex-shrink-0 cursor-pointer',
                    isActive
                      ? 'bg-secondary/20 text-secondary border border-secondary/50 shadow-sm'
                      : 'bg-surface-container/70 text-outline hover:text-on-surface hover:bg-surface-container border border-transparent'
                  )}
                >
                  Linha {idx + 1} ({l.originName})
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* LINHA 3: Evolution Chain Horizontal Track */}
      <div
        className={cn(
          'w-full p-2 rounded-2xl bg-surface-container-high/70 backdrop-blur-xl shadow-lg border border-border/30',
          'flex items-center gap-1 overflow-x-auto [scrollbar-width:none] no-scrollbar',
          '[scroll-snap-type:x_mandatory]'
        )}
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        {activeLine.cards.map((card, cardIndex) => {
          const isPassedOrCurrent = cardIndex < currentIndex
          const isCurrent = card.id === selectedCard.id

          return (
            <div
              key={`${activeLine.id}-${card.id}`}
              className="contents [&>*]:[scroll-snap-align:start]"
            >
              <SequenceThumbnail
                card={card}
                isSelected={isCurrent}
                onClick={() => onSelectCard(card)}
              />

              {/* Energy Flow Connector Pulse entre as fases da evolução */}
              {cardIndex < activeLine.cards.length - 1 && (
                <div
                  className={cn(
                    'flex flex-col items-center justify-center flex-shrink-0 px-0.5 transition-opacity duration-300',
                    isPassedOrCurrent ? 'opacity-100' : 'opacity-40'
                  )}
                >
                  <ChevronRight
                    className={cn(
                      'w-3.5 h-3.5 transition-colors',
                      isPassedOrCurrent
                        ? 'text-secondary animate-pulse'
                        : 'text-outline'
                    )}
                  />
                  <span
                    className={cn(
                      'w-2 h-0.5 rounded-full transition-colors',
                      isPassedOrCurrent ? 'bg-secondary/40' : 'bg-outline/30'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
