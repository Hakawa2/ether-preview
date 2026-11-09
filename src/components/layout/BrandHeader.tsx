import { Bell, Sparkles } from 'lucide-react'
import { ThemeToggle } from '../ui/theme-toggle'

interface BrandHeaderProps {
  onNotificationClick?: () => void
}

export function BrandHeader({ onNotificationClick }: BrandHeaderProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border shadow-[0_1px_12px_rgba(0,0,0,0.3)]">
      <div className="h-14 px-4 sm:px-6 max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Identidade Éther TCG */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(139,92,246,0.5)]">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="absolute -inset-0.5 rounded-lg border border-white/30 pointer-events-none" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display text-[10px] sm:text-xs font-bold tracking-widest uppercase text-secondary truncate">
              Éther TCG
            </span>
            <span className="font-display text-sm sm:text-base font-semibold text-foreground truncate tracking-tight">
              Card Inspector
            </span>
          </div>
        </div>

        {/* Controles de Ação (Notificação e Alternância de Tema) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />

          <button
            type="button"
            onClick={onNotificationClick}
            aria-label="Notificações"
            className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container/60 hover:bg-surface-bright/70 text-muted-foreground hover:text-foreground border border-border transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  )
}
