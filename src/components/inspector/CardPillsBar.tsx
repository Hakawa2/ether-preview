import { Orbit, Sparkles, Gem, Clock } from 'lucide-react'
import type { UnifiedCardData } from '../../lib/catalog'
import { cn } from '../../lib/utils'

interface CardPillsBarProps {
  card: UnifiedCardData
  isFoilActive: boolean
  onToggleFoil: () => void
}

export function CardPillsBar({
  card,
  isFoilActive,
  onToggleFoil,
}: CardPillsBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 select-none">
      {/* Coleção */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container/70 border border-border text-secondary font-display text-[11px] font-semibold tracking-wider uppercase flex-shrink-0">
        <Orbit className="w-3.5 h-3.5" />
        {card.collection || 'Coleção Éther'}
      </span>

      {/* Nível da Carta ou Número */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container/70 border border-border text-foreground font-display text-[11px] font-semibold tracking-wider flex-shrink-0">
        <Gem className="w-3.5 h-3.5 text-primary" />
        {card.level || `#${card.number}`}
      </span>

      {/* Raridade */}
      {card.rarity && (
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-display text-[11px] font-semibold tracking-wider flex-shrink-0 border',
            card.hasTexturizada
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
              : 'bg-surface-container/70 border-border text-muted-foreground'
          )}
        >
          {card.rarity}
        </span>
      )}

      {/* Turnos (se houver) */}
      {card.turns !== null && card.turns !== undefined && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container/70 border border-border text-muted-foreground font-display text-[11px] font-semibold tracking-wider flex-shrink-0">
          <Clock className="w-3 h-3 text-secondary" />
          {card.turns}T
        </span>
      )}

      {/* Botão Texturizada (Exclusivo para Cartas com versão Texturizada) */}
      {card.hasTexturizada && (
        <button
          type="button"
          onClick={onToggleFoil}
          aria-pressed={isFoilActive}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-display text-[11px] font-bold tracking-wide flex-shrink-0 active:scale-95 transition-all cursor-pointer border',
            isFoilActive
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-white shadow-[0_0_14px_rgba(245,158,11,0.5)]'
              : 'bg-surface-container/60 border-border text-muted-foreground hover:text-foreground'
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Texturizada ✨</span>
        </button>
      )}
    </div>
  )
}

