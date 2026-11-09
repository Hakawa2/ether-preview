export interface CardStageOption {
  id: string
  stageNumber: number
  name: string
  category: string
  rarity: string
  cost: number
  level: number
  affinity: string
  stageLabel: string
}

export interface TacticalState {
  isAutoRotating: boolean
  isFlipped: boolean
  isFoilActive: boolean
  zoom: number
}
