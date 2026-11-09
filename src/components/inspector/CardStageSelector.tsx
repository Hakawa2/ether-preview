import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, Search, X, Sparkles, Layers } from 'lucide-react'
import type { UnifiedCardData } from '../../lib/catalog'
import { matchesSearch } from '../../lib/search'
import { cn } from '../../lib/utils'

interface CardStageSelectorProps {
  cards: UnifiedCardData[]
  selectedCard: UnifiedCardData
  onSelectCard: (card: UnifiedCardData) => void
}

export function CardStageSelector({
  cards,
  selectedCard,
  onSelectCard,
}: CardStageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    setIsOpen((prev) => {
      if (prev) {
        setSearchQuery('')
      }
      return !prev
    })
  }

  // Foco no input ao abrir o dropdown
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Filtragem tolerante a maiúsculas e acentos
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) {
      return cards
    }
    return cards.filter((card) => matchesSearch(card.name, searchQuery))
  }, [cards, searchQuery])

  // Limite de renderização para garantir 60 FPS com 494 itens
  const displayedCards = useMemo(() => {
    return filteredCards.slice(0, 60)
  }, [filteredCards])

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Botão Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-container-high/90 hover:bg-surface-bright/70 active:scale-[0.99] border border-border shadow-md transition-all cursor-pointer backdrop-blur-md"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-surface-container flex items-center justify-center flex-shrink-0 border border-border/60 shadow-[0_0_10px_rgba(160,120,255,0.3)]">
            {selectedCard.thumbnail ? (
              <img
                src={selectedCard.thumbnail}
                alt={selectedCard.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <Sparkles className="w-4 h-4 text-secondary" />
            )}
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="font-display text-sm font-semibold text-foreground truncate tracking-tight">
              {selectedCard.name} <span className="text-muted-foreground font-normal">#{selectedCard.number}</span>
            </span>
            <span className="font-display text-[10px] sm:text-xs font-semibold text-secondary truncate uppercase tracking-wider">
              {selectedCard.type} • {selectedCard.collection || 'Éther TCG'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 text-muted-foreground ml-2">
          <ChevronDown
            className={cn(
              'w-5 h-5 transition-transform duration-200',
              isOpen && 'rotate-180 text-foreground'
            )}
          />
        </div>
      </button>

      {/* Dropdown Menu com Busca */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1.5 p-2 rounded-xl bg-surface-container-highest/98 backdrop-blur-2xl border border-border shadow-2xl z-50 flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Input de Busca */}
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome (ex: crianca, dragao)..."
              className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-surface-container/90 text-foreground placeholder:text-muted-foreground border border-border text-xs focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Contador de Resultados */}
          <div className="px-1 text-[10px] text-muted-foreground font-display flex items-center justify-between">
            <span>
              {filteredCards.length} {filteredCards.length === 1 ? 'carta encontrada' : 'cartas encontradas'}
            </span>
            {filteredCards.length > 60 && (
              <span className="text-[9px] text-secondary">Exibindo primeiras 60</span>
            )}
          </div>

          {/* Lista com Rolagem Otimizada */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 overscroll-contain">
            {displayedCards.length > 0 ? (
              displayedCards.map((card) => {
                const isSelected = card.id === selectedCard.id

                return (
                  <button
                    key={card.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelectCard(card)
                      setIsOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer group',
                      isSelected
                        ? 'bg-primary/20 border border-primary/40'
                        : 'hover:bg-surface-bright/70 border border-transparent'
                    )}
                  >
                    <div className="w-7 h-7 rounded-md overflow-hidden bg-surface-container flex items-center justify-center flex-shrink-0 border border-border/50">
                      {card.thumbnail ? (
                        <img
                          src={card.thumbnail}
                          alt={card.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display text-xs font-semibold text-foreground truncate">
                          {card.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          #{card.number}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {card.type} • {card.collection}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {card.hasTexturizada && (
                        <span className="font-display text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400">
                          Texturizada
                        </span>
                      )}
                      {card.level && (
                        <span className="font-display text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-surface-container border border-border/60 text-secondary">
                          {card.level}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground font-display">
                Nenhuma carta encontrada para "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
