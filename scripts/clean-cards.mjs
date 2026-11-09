import fs from 'node:fs'
import path from 'node:path'

const cardsFilePath = path.resolve('src/cards.json')
const backupFilePath = path.resolve('src/cards.raw.json')

// Lê sempre do arquivo bruto (fonte de verdade)
console.log('Lendo src/cards.raw.json...')
const rawData = fs.readFileSync(backupFilePath, 'utf8')
const parsed = JSON.parse(rawData)

if (!parsed.cards || !Array.isArray(parsed.cards)) {
  console.error('Formato inválido: propriedade "cards" não encontrada ou não é array.')
  process.exit(1)
}

// Cria backup do arquivo original se ainda não existir
if (!fs.existsSync(backupFilePath)) {
  console.log('Criando backup em src/cards.raw.json...')
  fs.writeFileSync(backupFilePath, rawData, 'utf8')
}

// Lista ordenada de propriedades solicitadas na especificação
const allowedFields = [
  'id',
  'name',
  'type',
  'number',
  'collection',
  'revisao',
  'description',
  'effect',
  'special',
  'synergy',
  'where_to_find',
  'turns',
  'image_url',
  'img_url_webp',
  'thumbnail',
  'level',
  'rarity',
  // Sequência e evolução
  'evolution_line',
  'evolution',
]

const initialCount = parsed.cards.length
console.log(`Processando ${initialCount} cartas...`)

const cleanedCards = parsed.cards.map((card) => {
  const cleanedCard = {}

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(card, field)) {
      cleanedCard[field] = card[field]
    }
  }

  return cleanedCard
})

const outputData = JSON.stringify({ cards: cleanedCards }, null, 2)
fs.writeFileSync(cardsFilePath, outputData, 'utf8')

const originalSize = Buffer.byteLength(rawData, 'utf8')
const newSize = Buffer.byteLength(outputData, 'utf8')
const percentReduction = Math.round((1 - newSize / originalSize) * 100)

console.log('--- Limpeza Concluída com Sucesso ---')
console.log(`Cartas processadas: ${cleanedCards.length} (esperado: ${initialCount})`)
console.log(`Tamanho original: ${(originalSize / 1024).toFixed(1)} KB`)
console.log(`Novo tamanho: ${(newSize / 1024).toFixed(1)} KB`)
console.log(`Redução alcançada: -${percentReduction}%`)
