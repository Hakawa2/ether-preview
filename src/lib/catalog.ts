import type { CardData } from './card'

export interface UnifiedCardData extends CardData {
  hasTexturizada: boolean
  normalImageUrl: string
  texturizadaImageUrl?: string
  texturizadaCard?: CardData
}

/**
 * Agrupa o dataset unificando as versões normais e texturizadas.
 * Remove duplicatas na lista de busca e anexa a variante texturizada à carta base.
 */
export function buildUnifiedCatalog(rawCards: CardData[]): UnifiedCardData[] {
  const mapByName = new Map<string, CardData[]>()

  for (const card of rawCards) {
    const key = card.name.trim().toLowerCase()
    if (!mapByName.has(key)) {
      mapByName.set(key, [])
    }
    mapByName.get(key)!.push(card)
  }

  const unifiedList: UnifiedCardData[] = []

  for (const cardsWithSameName of mapByName.values()) {
    const texturizada = cardsWithSameName.find(
      (c) => c.rarity && c.rarity.trim().toLowerCase().includes('texturizada')
    )

    // A carta base é a versão normal (ou a primeira disponível)
    const baseCard =
      cardsWithSameName.find(
        (c) => !c.rarity || !c.rarity.trim().toLowerCase().includes('texturizada')
      ) || cardsWithSameName[0]

    const normalImg = baseCard.img_url_webp || baseCard.image_url
    const texturizadaImg = texturizada
      ? texturizada.img_url_webp || texturizada.image_url
      : undefined

    unifiedList.push({
      ...baseCard,
      hasTexturizada: Boolean(texturizada),
      normalImageUrl: normalImg,
      texturizadaImageUrl: texturizadaImg,
      texturizadaCard: texturizada,
    })
  }

  // Ordena por nome
  return unifiedList.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}
