export interface CardData {
  id: string
  name: string
  type: string
  number: string
  collection: string
  revisao: string
  description: string
  effect: string
  special: string
  synergy: string
  where_to_find: string
  turns: number | null
  image_url: string
  img_url_webp: string
  thumbnail: string
  level?: string
  rarity?: string

  // Campos de Sequência Evolutiva
  evolution_line?: string | null
  evolution?: string | null
}

export interface CardsDataset {
  cards: CardData[]
}
