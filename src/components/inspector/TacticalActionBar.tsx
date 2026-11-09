import { RotateCw, FlipHorizontal2, Plus, Minus, RotateCcw } from 'lucide-react'
import { cn } from '../../lib/utils'

interface TacticalActionBarProps {
  isAutoRotating: boolean
  isFlipped: boolean
  onToggleAutoRotate: () => void
  onFlipCard: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export function TacticalActionBar({
  isAutoRotating,
  isFlipped,
  onToggleAutoRotate,
  onFlipCard,
  onZoomIn,
  onZoomOut,
  onReset,
}: TacticalActionBarProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container-high/70 backdrop-blur-md border border-border shadow-lg">
      {/* Grupo Esquerdo: Rotação e Flip */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onToggleAutoRotate}
          title={isAutoRotating ? 'Parar Giro Automático' : 'Giro Automático 360°'}
          className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center border transition-all cursor-pointer active:scale-90',
            isAutoRotating
              ? 'bg-secondary/25 border-secondary/60 text-secondary shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              : 'bg-surface-container/80 border-border text-muted-foreground hover:text-foreground hover:bg-surface-bright/80'
          )}
        >
          <RotateCw className={cn('w-4 h-4', isAutoRotating && 'animate-spin')} />
        </button>

        <button
          type="button"
          onClick={onFlipCard}
          title="Ver Frente / Verso da Carta"
          className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center border transition-all cursor-pointer active:scale-90',
            isFlipped
              ? 'bg-primary/25 border-primary/60 text-primary shadow-[0_0_10px_rgba(139,92,246,0.4)]'
              : 'bg-surface-container/80 border-border text-muted-foreground hover:text-foreground hover:bg-surface-bright/80'
          )}
        >
          <FlipHorizontal2 className="w-4 h-4" />
        </button>
      </div>

      {/* Centro: Telemetria da Cena */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/80 border border-border">
        <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
        <span className="font-display text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          R3F Canvas
        </span>
      </div>

      {/* Grupo Direito: Zoom e Reset */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onZoomOut}
          title="Diminuir Zoom"
          className="w-9 h-9 rounded-lg bg-surface-container/80 border border-border text-muted-foreground hover:text-foreground hover:bg-surface-bright/80 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onZoomIn}
          title="Aumentar Zoom"
          className="w-9 h-9 rounded-lg bg-surface-container/80 border border-border text-muted-foreground hover:text-foreground hover:bg-surface-bright/80 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onReset}
          title="Resetar Câmera"
          className="w-9 h-9 rounded-lg bg-surface-container/80 border border-border text-muted-foreground hover:text-secondary hover:bg-surface-bright/80 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
