import { normalizeSearchTerm } from './search'
import type { UnifiedCardData } from './catalog'

export interface EvolutionLine {
  /** Identificador único da linha evolutiva */
  id: string
  /** Rótulo da linha para exibição visual (ex: "Linha Evolutiva 1") */
  label: string
  /** Nome do ancestral raiz (NV1) desta ramificação */
  originName: string
  /** Cartas estritamente ordenadas no fluxo NV1 -> NV2 -> NV3 -> NVE */
  cards: UnifiedCardData[]
  /** Posição (1-based) da carta selecionada nesta linha específica */
  currentPhase: number
  /** Quantidade total de fases da linha */
  totalPhases: number
}

export interface MultiSequenceGroup {
  /** Chave normalizada do personagem */
  sequenceKey: string
  /** Nome de exibição base da seleção */
  displayName: string
  /** Lista de linhas evolutivas válidas que passam pela carta */
  lines: EvolutionLine[]
  /** Indicador se há 2 ou mais linhas evolutivas */
  hasMultipleLines: boolean
}

// ---------------------------------------------------------------------------
// Hierarquia Canônica de Níveis do Éther TCG
// ---------------------------------------------------------------------------

const LEVEL_RANK: Record<string, number> = {
  NV1: 1,
  NV2: 2,
  NV3: 3,
  NVE: 4,
}

export function getLevelRank(level?: string | null): number {
  if (!level) return 0
  const upper = level.trim().toUpperCase()
  return LEVEL_RANK[upper] ?? 0
}

/**
 * Normaliza o nome de uma carta para comparação interna no grafo.
 */
function normalizeName(name: string): string {
  return normalizeSearchTerm(name)
}

/**
 * Extrai a chave de sequência de um nome de carta (fallback por prefixo).
 * Usa o nome antes da vírgula normalizado.
 *
 * "Muskkys, Kokedama" → "muskkys"
 * "Goblin Sucateiro"  → "goblin sucateiro"
 */
export function extractSequenceKey(name: string): string {
  const beforeComma = name.split(',')[0].trim()
  return normalizeSearchTerm(beforeComma)
}

/**
 * Extrai o nome de exibição limpo do personagem.
 * "Muskkys, Kokedama" → "Muskkys"
 * "Goblin Sucateiro"  → "Goblin Sucateiro"
 */
export function extractDisplayName(name: string): string {
  const parts = name.split(',')
  return parts[0].trim()
}

// ---------------------------------------------------------------------------
// Resolução Direcionada de Caminhos Evolutivos (DAG Traversal)
// ---------------------------------------------------------------------------

/**
 * Encontra todos os caminhos direcionados e lineares (NV1 -> NV2 -> NV3 -> NVE)
 * que passam pela carta selecionada.
 *
 * Cada caminho representa uma linha evolutiva estrita. Cartas em ramificações
 * paralelas ou irmãs não são misturadas no mesmo caminho.
 */
export function resolveDirectedEvolutionLines(
  selectedCard: UnifiedCardData,
  allCards: UnifiedCardData[]
): UnifiedCardData[][] {
  // 1. Índice por nome normalizado
  const byNormName = new Map<string, UnifiedCardData[]>()
  for (const card of allCards) {
    const k = normalizeName(card.name)
    if (!byNormName.has(k)) byNormName.set(k, [])
    byNormName.get(k)!.push(card)
  }

  // 2. Construção de arestas direcionadas válidas com restrição de nível crescente
  const outgoing = new Map<string, UnifiedCardData[]>()
  const incoming = new Map<string, UnifiedCardData[]>()

  for (const card of allCards) {
    outgoing.set(card.id, [])
    incoming.set(card.id, [])
  }

  for (const card of allCards) {
    if (!card.evolution_line) continue
    const targets = byNormName.get(normalizeName(card.evolution_line)) || []
    for (const target of targets) {
      // Protege contra auto-loops (ex: Vampiro Sicário) e exige nível estritamente superior
      if (target.id === card.id) continue

      const fromRank = getLevelRank(card.level)
      const toRank = getLevelRank(target.level)
      if (toRank > fromRank || (fromRank === 0 && toRank > 0)) {
        outgoing.get(card.id)!.push(target)
        incoming.get(target.id)!.push(card)
      }
    }
  }

  // 3. Caminhos retroativos até raízes (predecessores com nível menor)
  function getBackPaths(
    curr: UnifiedCardData,
    visited = new Set<string>()
  ): UnifiedCardData[][] {
    if (visited.has(curr.id)) return [[curr]]
    visited.add(curr.id)

    const currRank = getLevelRank(curr.level)
    const preds = (incoming.get(curr.id) || []).filter(
      (p) => !visited.has(p.id) && getLevelRank(p.level) < currRank
    )

    if (preds.length === 0) return [[curr]]

    const res: UnifiedCardData[][] = []
    for (const p of preds) {
      const sub = getBackPaths(p, new Set(visited))
      for (const s of sub) {
        res.push([...s, curr])
      }
    }
    return res
  }

  // 4. Caminhos prospectivos até folhas (sucessores com nível maior)
  function getFwdPaths(
    curr: UnifiedCardData,
    visited = new Set<string>()
  ): UnifiedCardData[][] {
    if (visited.has(curr.id)) return [[curr]]
    visited.add(curr.id)

    const currRank = getLevelRank(curr.level)
    const succs = (outgoing.get(curr.id) || []).filter(
      (s) => !visited.has(s.id) && getLevelRank(s.level) > currRank
    )

    if (succs.length === 0) return [[curr]]

    const res: UnifiedCardData[][] = []
    for (const s of succs) {
      const sub = getFwdPaths(s, new Set(visited))
      for (const sb of sub) {
        res.push([curr, ...sb])
      }
    }
    return res
  }

  const backPaths = getBackPaths(selectedCard)
  const fwdPaths = getFwdPaths(selectedCard)

  // 5. Produto cartesiano dos caminhos retroativos e prospectivos
  const rawPaths: UnifiedCardData[][] = []
  for (const b of backPaths) {
    for (const f of fwdPaths) {
      const full = [...b.slice(0, -1), ...f]
      // Sequência válida requer pelo menos 2 cartas
      if (full.length >= 2) {
        rawPaths.push(full)
      }
    }
  }

  // 6. Deduplicação de caminhos idênticos por chave de IDs
  const uniqueKeyMap = new Map<string, UnifiedCardData[]>()
  for (const path of rawPaths) {
    const key = path.map((c) => c.id).join('->')
    if (!uniqueKeyMap.has(key)) {
      uniqueKeyMap.set(key, path)
    }
  }

  return Array.from(uniqueKeyMap.values())
}

// ---------------------------------------------------------------------------
// Fallback: Resolução por Prefixo de Nome
// ---------------------------------------------------------------------------

/**
 * Fallback para personagens sem `evolution_line` ou com evoluções ainda não
 * presentes no catálogo (ex: Muskkys). Agrupa cartas com o mesmo prefixo
 * de nome e ordena pelos níveis NV1 -> NV2 -> NV3 -> NVE.
 */
function resolveByPrefix(
  selectedCard: UnifiedCardData,
  allCards: UnifiedCardData[]
): UnifiedCardData[][] {
  const prefix = extractSequenceKey(selectedCard.name)
  if (!prefix) return []

  const matches = allCards.filter(
    (c) => extractSequenceKey(c.name) === prefix
  )
  if (matches.length < 2) return []

  // Agrupa por coleção para manter consistência de set
  const byCol = new Map<string, UnifiedCardData[]>()
  for (const card of matches) {
    const col = card.collection || 'Éther TCG'
    if (!byCol.has(col)) byCol.set(col, [])
    byCol.get(col)!.push(card)
  }

  const lines: UnifiedCardData[][] = []
  for (const list of byCol.values()) {
    if (list.length >= 2) {
      const sorted = [...list].sort(
        (a, b) => getLevelRank(a.level) - getLevelRank(b.level)
      )
      // Inclui apenas a série que contém a carta selecionada
      if (sorted.some((c) => c.id === selectedCard.id)) {
        lines.push(sorted)
      }
    }
  }

  return lines
}

// ---------------------------------------------------------------------------
// API Pública: getMultiSequenceGroup
// ---------------------------------------------------------------------------

/**
 * Dado o catálogo unificado e a carta selecionada, calcula todas as linhas
 * evolutivas válidas que passam por ela.
 *
 * - Se a carta pertencer a 1 linha evolutiva, retorna 1 linha.
 * - Se a carta pertencer a 2 linhas evolutivas (ex: Mograk, Gato dos Truques),
 *   retorna 2 linhas distintas.
 * - Se a carta não tiver sequência, retorna null.
 */
export function getMultiSequenceGroup(
  allCards: UnifiedCardData[],
  selectedCard: UnifiedCardData
): MultiSequenceGroup | null {
  // 1. Tenta resolução direcionada por grafo de linhagem
  let paths = resolveDirectedEvolutionLines(selectedCard, allCards)

  // 2. Fallback: agrupamento por prefixo de nome (ex: Muskkys)
  if (paths.length === 0) {
    paths = resolveByPrefix(selectedCard, allCards)
  }

  if (paths.length === 0) return null

  const hasMultipleLines = paths.length > 1
  const lines: EvolutionLine[] = paths.map((path, idx) => {
    const originCard = path[0]
    const originName = originCard.name.split(',')[0].trim()
    const currIdx = path.findIndex((c) => c.id === selectedCard.id)

    const label = hasMultipleLines
      ? `Linha Evolutiva ${idx + 1}`
      : 'Sequência Evolutiva da Carta'

    return {
      id: `line-${idx}-${path.map((c) => c.id).join('-')}`,
      label,
      originName,
      cards: path,
      currentPhase: currIdx >= 0 ? currIdx + 1 : 1,
      totalPhases: path.length,
    }
  })

  return {
    sequenceKey: extractSequenceKey(selectedCard.name),
    displayName: extractDisplayName(selectedCard.name),
    lines,
    hasMultipleLines,
  }
}

// ---------------------------------------------------------------------------
// Compatibilidade Retroativa (Legacy API)
// ---------------------------------------------------------------------------

export interface SequenceSeries {
  seriesKey: string
  label: string
  cards: UnifiedCardData[]
}

export interface SequenceGroup {
  sequenceKey: string
  displayName: string
  totalCards: number
  series: SequenceSeries[]
}

export function getSequenceGroup(
  allCards: UnifiedCardData[],
  selectedCard: UnifiedCardData
): SequenceGroup | null {
  const multi = getMultiSequenceGroup(allCards, selectedCard)
  if (!multi || multi.lines.length === 0) return null

  const primaryLine = multi.lines[0]
  return {
    sequenceKey: multi.sequenceKey,
    displayName: multi.displayName,
    totalCards: primaryLine.totalPhases,
    series: [
      {
        seriesKey: primaryLine.id,
        label: primaryLine.label,
        cards: primaryLine.cards,
      },
    ],
  }
}

export function getActiveSeries(
  group: SequenceGroup,
  selectedCard: UnifiedCardData
): string {
  const match = group.series.find((s) =>
    s.cards.some((c) => c.id === selectedCard.id)
  )
  return match?.seriesKey ?? group.series[0]?.seriesKey ?? ''
}
