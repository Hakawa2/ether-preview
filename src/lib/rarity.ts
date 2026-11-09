import { type CardData } from '../types/card'

/**
 * Verifica se a carta é elegível para acabamento Foil Holo.
 * Apenas cartas com a propriedade rarity contendo 'texturizada' (insensível a caixa) são elegíveis.
 */
export function isFoilEligible(card?: CardData | null): boolean {
  if (!card || !card.rarity) return false
  return card.rarity.trim().toLowerCase().includes('texturizada')
}
