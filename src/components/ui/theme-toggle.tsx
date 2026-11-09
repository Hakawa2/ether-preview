import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full p-1 bg-muted/60 backdrop-blur-md border border-border shadow-inner',
        className
      )}
      role="radiogroup"
      aria-label="Seletor de Tema"
    >
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-checked={theme === 'dark'}
        role="radio"
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer',
          theme === 'dark'
            ? 'bg-primary text-white shadow-sm shadow-primary/30'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Moon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Dark</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-checked={theme === 'light'}
        role="radio"
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer',
          theme === 'light'
            ? 'bg-primary text-white shadow-sm shadow-primary/30'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Sun className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme('system')}
        aria-checked={theme === 'system'}
        role="radio"
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer',
          theme === 'system'
            ? 'bg-primary text-white shadow-sm shadow-primary/30'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Monitor className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Sistema</span>
      </button>
    </div>
  )
}
