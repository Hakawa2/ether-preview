import { Layers } from 'lucide-react'
import type { UnifiedCardData } from '../../lib/catalog'
import { cn } from '../../lib/utils'

interface SequenceThumbnailProps {
  card: UnifiedCardData
  isSelected: boolean
  onClick: () => void
}

/**
 * Converte o level ("NV1", "NV2", "NV3", "NVE") para um rótulo amigável:
 * "Nível 1", "Nível 2", "Nível 3", "Nível Épico"
 */
function formatLevelLabel(level?: string | null): string {
  if (!level) return 'Nível ?'
  const trimmed = level.trim().toUpperCase()
  if (trimmed === 'NV1') return 'Nível 1'
  if (trimmed === 'NV2') return 'Nível 2'
  if (trimmed === 'NV3') return 'Nível 3'
  if (trimmed === 'NVE') return 'Nível Épico'
  return level
}

export function SequenceThumbnail({ card, isSelected, onClick }: SequenceThumbnailProps) {
  const levelLabel = formatLevelLabel(card.level)
  const numberLabel = `#${card.number.padStart(3, '0')}`

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${card.name} — ${levelLabel}`}
      className={cn(
        'group relative flex-1 min-w-[72px] sm:min-w-[82px] max-w-[102px] p-1.5 rounded-xl transition-all duration-200 cursor-pointer text-left select-none flex flex-col',
        isSelected
          ? 'bg-surface-variant/95 ring-1 ring-secondary/60 shadow-[0_0_12px_rgba(76,215,246,0.3)]'
          : 'bg-surface-container/60 hover:bg-surface-variant/50 hover:shadow-sm'
      )}
    >
      {/* Moldura da miniatura da carta (aspect ratio 3/3.8 do Stitch) */}
      <div
        className={cn(
          'relative w-full aspect-[3/3.8] rounded-md overflow-hidden bg-surface-container-lowest',
          'transition-transform duration-200 group-hover:scale-[1.02]'
        )}
      >
        {card.thumbnail ? (
          <img
            src={card.thumbnail}
            alt={card.name}
            className="w-full h-full object-cover select-none pointer-events-none"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center">
            <Layers className="w-4 h-4 text-muted-foreground" />
          </div>
        )}

        {/* Badge de número no canto superior esquerdo (#042) */}
        <span
          className={cn(
            'absolute top-0.5 left-0.5 font-display text-[9px] font-bold px-1 rounded backdrop-blur-sm',
            'bg-surface-container-lowest/90',
            isSelected ? 'text-secondary shadow-sm' : 'text-outline'
          )}
        >
          {numberLabel}
        </span>

        {/* Indicador de variante texturizada */}
        {card.hasTexturizada && (
          <div
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.9)]"
            title="Possui versão texturizada"
          />
        )}
      </div>

      {/* Identificação textual da carta abaixo da foto com padding interno adequado */}
      <div className="mt-1 flex flex-col min-w-0 px-1 pb-0.5">
        <span
          className={cn(
            'font-display text-[10px] font-semibold tracking-tight truncate',
            isSelected ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'
          )}
        >
          {card.name.split(',')[0].trim()}
        </span>
        <span
          className={cn(
            'font-body text-[9px] truncate',
            isSelected ? 'text-secondary font-medium' : 'text-outline'
          )}
        >
          {levelLabel}
        </span>
      </div>
    </button>
  )
}
