/**
 * Normaliza um texto removendo acentos/diacríticos e convertendo para minúsculas.
 * Exemplo: "Criança Cósmica" -> "crianca cosmica"
 */
export function normalizeSearchTerm(term: string): string {
  if (!term) return ''
  return term
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Verifica se um texto alvo contém o termo de busca, tolerando maiúsculas e acentos.
 */
export function matchesSearch(target: string, query: string): boolean {
  if (!query) return true
  if (!target) return false
  const normalizedTarget = normalizeSearchTerm(target)
  const normalizedQuery = normalizeSearchTerm(query)
  return normalizedTarget.includes(normalizedQuery)
}
