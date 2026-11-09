# Especificação Técnica: Card Sequence Viewer — Galeria de Sequência da Carta

**Projeto:** Éther TCG - Card Preview  
**Status:** Proposto / Em Revisão  
**Versão:** 1.0.0  
**Data:** 2026-10-20  

---

## 1. Visão Geral

Adicionar um **container de sequência** posicionado abaixo da toolbar de inspeção que exibe thumbnails de todas as cartas que pertencem à mesma sequência/família do personagem selecionado. Clicar em qualquer thumbnail da sequência deve atualizar o preview 3D principal para a carta clicada, atualizando todas as informações.

### Exemplo Prático

Ao selecionar **"Muskkys, Kokedama" (NV1)**, o viewer de sequência mostra:
- Muskkys, Kokedama (NV1) — *selecionada*
- Muskkys, Velhote (NV1)
- Muskkys, Guardião Arsênio (NV2)
- Muskkys, O Guia (NV3)
- Muskkys, Esuriente (NVE)

Ao clicar em **"Muskkys, O Guia"**, o preview 3D muda para essa carta e todas as pills/informações do inspetor são atualizadas.

---

## 2. Lógica de Agrupamento de Sequências

### 2.1 Identificação de Sequência (Sequence Group)

A lógica de agrupamento deve ser implementada como uma função utilitária em `src/lib/sequence.ts`.

**Regras para definir o "nome base" (sequenceKey):**

```typescript
/**
 * Extrai a chave de sequência do nome de uma carta.
 * A chave é a primeira palavra significativa antes de qualquer sufixo de subtítulo.
 * 
 * Exemplos:
 * - "Muskkys, Kokedama"    → "muskkys"
 * - "Muskkys, O Guia"      → "muskkys"
 * - "Gata das Poesias"     → "gata"
 * - "Gato dos Truques"     → "gato"
 * - "Lyria, Transformada"  → "lyria"
 * - "Boitatá, Vigia das Chamas" → "boitatá"
 */
function extractSequenceKey(name: string): string {
  const beforeComma = name.split(',')[0].trim()
  return normalizeForSearch(beforeComma) // remove acentos e lowercase
}
```

**Condições para exibir o Sequence Viewer:**
- A sequência deve conter **2 ou mais cartas** diferentes (após deduplicação de texturizadas).
- Cartas da mesma sequência devem ter a mesma `collection` OU o mesmo `sequenceKey` extraído do nome.

> **Nota:** O campo `level` (NV1, NV2, NV3, NVE) serve como indicador de ordenação dentro da sequência, não como critério de agrupamento.

### 2.2 Múltiplas "Séries" de um Mesmo Personagem

Alguns personagens possuem cartas em **múltiplas coleções** (ex: "Sangue", "Livro", "Maré" aparecem em coleções diferentes). Nesses casos, o **Select de Série** deve ser exibido.

**Exemplo:**
```
Personagem: "Sangue"
├── Série 1: Coleção "Eras Místicas" (numbers: 002, 21, 59...)
├── Série 2: Coleção "Primórdios" (numbers: 20, 58...)
└── Série 3: Coleção "Abissal" (numbers: 68, 69...)
```

O Select de Série filtra qual subset de cartas da mesma família é exibido na galeria.

---

## 3. Componentes a Criar

### 3.1 `src/lib/sequence.ts` — Utilitário de Sequências

```typescript
export interface SequenceSeries {
  seriesKey: string       // ex: "Eras Místicas" ou "Série 1"
  label: string           // label para exibição no Select
  cards: UnifiedCardData[]
}

export interface SequenceGroup {
  sequenceKey: string
  totalCards: number
  series: SequenceSeries[]
}

/**
 * Dado o catálogo completo e uma carta selecionada,
 * retorna o grupo de sequência com suas séries.
 * Retorna null se a carta estiver sozinha (sem sequência).
 */
export function getSequenceGroup(
  allCards: UnifiedCardData[],
  selectedCard: UnifiedCardData
): SequenceGroup | null
```

**Algoritmo:**
1. Extrai `sequenceKey` da carta selecionada.
2. Filtra `allCards` onde `extractSequenceKey(card.name) === sequenceKey`.
3. Se o resultado tiver apenas 1 carta → retorna `null` (sem sequência).
4. Agrupa as cartas por `collection`:
   - Se houver apenas 1 collection → cria 1 série sem label (sem Select).
   - Se houver 2+ collections → cria N séries, cada uma com label = nome da coleção.
5. Dentro de cada série, ordena as cartas por nível: `NV1 → NV2 → NV3 → NVE → sem nível`.

### 3.2 `src/components/sequence/CardSequenceViewer.tsx`

Componente principal do viewer, renderizado logo **abaixo** da `InspectorToolbar` no `App.tsx`.

**Props:**
```typescript
interface CardSequenceViewerProps {
  allCards: UnifiedCardData[]
  selectedCard: UnifiedCardData
  onSelectCard: (card: UnifiedCardData) => void
}
```

**Layout Visual:**

```
┌──────────────────────────────────────────────┐
│ ✦ Sequência · Muskkys            [Select ▼]  │  ← Header com nome base e Select (se necessário)
├──────────────────────────────────────────────┤
│ [thumb] [thumb*] [thumb] [thumb] [thumb]     │  ← Scroll horizontal de thumbnails
│  NV1     NV1•     NV2     NV3     NVE        │    * = selecionada (destacada)
└──────────────────────────────────────────────┘
```

**Comportamento:**
- Apenas aparece quando `getSequenceGroup()` retorna um grupo válido (≥ 2 cartas).
- **Scroll horizontal** suave com `overflow-x: auto` e `scroll-snap`.
- Cada thumbnail é um botão clicável.
- A carta atualmente selecionada no preview 3D é destacada visualmente (borda brilhante + escala levemente aumentada).
- Animação de entrada: `animate-in slide-in-from-bottom-2 fade-in duration-300`.

### 3.3 `src/components/sequence/SequenceThumbnail.tsx`

Componente individual de thumbnail dentro da galeria.

**Props:**
```typescript
interface SequenceThumbnailProps {
  card: UnifiedCardData
  isSelected: boolean
  onClick: () => void
}
```

**Visual:**
- Tamanho: `w-14 h-20` (proporção de carta TCG ~1:1.4)
- Borda arredondada: `rounded-lg`
- **Estado selecionado:**
  - Borda: `border-2 border-primary` com glow colorido
  - Escala: `scale-105`
  - Badge de nível destacado
- **Estado padrão:**
  - Borda: `border border-border/50`
  - Hover: leve glow + scale
- **Badge de nível** (tag abaixo da thumbnail):
  - Exibir o `level` da carta (NV1, NV2, NV3, NVE) ou `#número` se não houver level
  - Texto: `text-[9px] font-bold font-display`

---

## 4. Integração no App.tsx

**Posicionamento:** Entre a seção da `InspectorToolbar` e o Canvas 3D.

```tsx
{/* 2. Top Tactical Section */}
<section className="relative z-30 pt-16 px-4 sm:px-6 w-full max-w-lg mx-auto pointer-events-auto">
  <InspectorToolbar ... />
</section>

{/* 3. Sequence Viewer (novo) */}
<section className="relative z-30 px-4 sm:px-6 w-full max-w-lg mx-auto pointer-events-auto mt-2">
  <CardSequenceViewer
    allCards={UNIFIED_CARDS}
    selectedCard={selectedCard}
    onSelectCard={handleSelectCard}
  />
</section>

{/* 4. 3D Viewport com Canvas R3F */}
<div className="absolute inset-0 z-10 ...">
  ...
</div>
```

> **Importante:** O Sequence Viewer deve ser posicionado **absolutamente sobre** o canvas, sem deslocar o viewport 3D. Usar `relative z-30` com `pointer-events-auto` para garantir interação.

---

## 5. Select de Série (Multi-Série)

Quando um personagem tem cartas em **múltiplas coleções**, exibir um Select compacto no header do viewer:

```tsx
// Aparece apenas quando series.length > 1
<select
  value={activeSeries}
  onChange={(e) => setActiveSeries(e.target.value)}
  className="bg-surface-container text-xs text-foreground border border-border rounded-md px-2 py-1 font-display cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
>
  {sequenceGroup.series.map((s) => (
    <option key={s.seriesKey} value={s.seriesKey}>{s.label}</option>
  ))}
</select>
```

**Comportamento do Select:**
- Ao mudar a série, a galeria de thumbnails é atualizada imediatamente.
- O preview principal **não** é alterado automaticamente ao trocar de série — apenas ao clicar em um thumbnail.
- A série ativa é inicializada como a que contém a `selectedCard`.

---

## 6. Design Visual e Tokens

```
Container:
  - bg: surface-container-high/85 + backdrop-blur-2xl
  - border: border/60
  - border-radius: radius-xl (12px)
  - padding: 10px 12px

Header:
  - font: display, 10px, uppercase, tracking-widest
  - color: muted-foreground
  - ícone ✦ em secondary/amber antes do nome base

Galeria:
  - scroll horizontal, sem scrollbar visível
  - gap: 8px entre thumbnails
  - scroll-snap: x mandatory

Thumbnail Selecionada:
  - border: 2px primary
  - box-shadow: 0 0 12px oklch(primary / 0.5)
  - transform: scale(1.08)
  - badge level: bg-primary/30 text-primary

Thumbnail Normal:
  - border: 1px border/50
  - hover: scale(1.04) + glow sutil
  - badge level: bg-surface-container/70 text-muted-foreground
```

---

## 7. Critérios de Aceitação (DoD)

- [ ] **CA-01 (Visibilidade Condicional)**: O Sequence Viewer **só aparece** quando a carta selecionada pertence a uma sequência com 2+ cartas do mesmo personagem.
- [ ] **CA-02 (Thumbnails Corretas)**: Cada thumbnail exibe a imagem `thumbnail` da carta, com fallback para ícone caso a imagem não carregue.
- [ ] **CA-03 (Destaque da Selecionada)**: A carta atualmente exibida no preview 3D é destacada com borda colorida e escala ampliada na galeria de sequência.
- [ ] **CA-04 (Navegação por Clique)**: Clicar em qualquer thumbnail da galeria atualiza o preview 3D e todas as informações do inspetor (nome, tipo, coleção, rarity, foil toggle etc.).
- [ ] **CA-05 (Select de Série)**: O Select de Série só é exibido quando o personagem possui cartas em 2 ou mais coleções distintas. Ao trocar a série, a galeria é atualizada sem alterar o preview atual.
- [ ] **CA-06 (Ordem por Nível)**: As cartas na galeria são ordenadas por progressão de nível: NV1 → NV2 → NV3 → NVE → sem nível.
- [ ] **CA-07 (Scroll Horizontal)**: A galeria tem scroll horizontal suave, sem barra de rolagem visível, com scroll-snap para encaixe por thumbnail.
- [ ] **CA-08 (Animação de Entrada)**: O container exibe animação de entrada (fade-in + slide-in-from-bottom) ao aparecer.
- [ ] **CA-09 (Responsividade)**: O viewer funciona corretamente em mobile e desktop, respeitando o max-w-lg da seção de inspeção.
- [ ] **CA-10 (Sem Texturizadas Duplicadas)**: Cartas texturizadas (já mescladas no UnifiedCardData) não aparecem como thumbnails separadas na sequência.
