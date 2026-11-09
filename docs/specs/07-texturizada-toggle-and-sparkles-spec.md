# Especificação Técnica: Unificação de Cartas e Toggle "Texturizada" com Brilho Cósmico (Foil Stars / Sparkles)

**Projeto:** Éther TCG - Card Preview  
**Status:** Proposto / Em Revisão  
**Versão:** 1.0.0  
**Data:** 2026-10-20  
**Arquivos de Referência:**
- [`src/cards.json`](file:///c:/Users/Hakawa/workspace/ether-preview/src/cards.json)
- [`src/components/inspector/CardPillsBar.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/inspector/CardPillsBar.tsx)
- [`src/components/inspector/CardStageSelector.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/inspector/CardStageSelector.tsx)
- [`src/components/card/HoloFoilOverlay.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/card/HoloFoilOverlay.tsx)
- [`src/App.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/App.tsx)

---

## 1. Diagnóstico do Problema Atual

Atualmente, o dataset contém cartas duplicadas para o mesmo personagem, sendo uma versão normal (ex: `rarity: "Comum"` ou `"Rara"`) e outra versão `rarity: "Texturizada"`.
- Exemplo: *Suzana II, A Matriarca*, *Riveli, Rei dos Mares*, *Mirélia, Olhos de Cristal*, etc.
- **Problema na UI**: O usuário vê duas entradas separadas na lista de busca para a mesma carta, causando redundância e confusão.
- **Comportamento Esperado**:
  1. A lista do seletor/busca **NÃO** deve listar a carta texturizada como um item duplicado separado. Cada carta aparece uma única vez.
  2. Cartas que possuem versão texturizada (ou que têm `rarity: "Texturizada"`) exibem o botão de alternância **"Texturizada"** (substituindo o antigo "Foil Holo").
  3. Quando a carta tiver versão texturizada disponível, o botão **"Texturizada"** é exibido.
  4. Quando o toggle "Texturizada" está ativo:
     - A textura exibida na carta 3D troca para a arte da versão texturizada.
     - É aplicado um **efeito de estrelas brilhantes cintilantes douradas / sparkles de quatro pontas (✦)** espalhadas sobre a carta (exatamente como ilustrado na arte de *Suzana II, A Matriarca* com selo e brilhos de raridade), além de suave cintilação, sem estourar a cena em luz branca.

---

## 2. Estrutura de Dados e Deduplicação no Catálogo

### 2.1. Unificação das Cartas
No processamento dos dados (`useCardsCatalog` ou preparação de `ALL_CARDS`):
1. Cartas com o mesmo nome base são agrupadas.
2. Se uma das versões possuir `rarity === "Texturizada"`, o objeto principal da carta recebe a referência:
   - `hasTexturizada: true`
   - `texturizadaVariant`: dados da textura texturizada (`img_url_webp`, `image_url`, `thumbnail`).
3. As 10 cartas texturizadas duplicadas são mescladas na carta base e **removidas da listagem de busca**, evitando poluição visual.

```typescript
export interface UnifiedCardData extends CardData {
  hasTexturizada: boolean
  texturizadaImageUrl?: string
  normalImageUrl: string
}
```

---

## 3. Botão Toggle "Texturizada"

### 3.1. Posicionamento e Comportamento
- Localizado na [CardPillsBar.tsx](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/inspector/CardPillsBar.tsx).
- **Condição de Exibição**: Somente quando `card.hasTexturizada === true`.
- **Estado Inicial**: Ativo por padrão (`isTexturizadaActive = true`) sempre que uma carta com versão texturizada for carregada/selecionada.
- **Rótulo e Estilo Visual**:
  - Pílula gradiente laranja/dourada com violeta: `bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)]`
  - Texto: `Texturizada ✨` (ou `Texturizada` com badge ativo).
  - Feedback de clique tátil: `active:scale-95`.

---

## 4. Efeito Visual de Brilho Cósmico (Sparkles de Estrelas Douradas)

Conforme a referência do print enviado:
1. **Estrelas de Quatro Pontas (✦ Sparkles)**:
   - Em vez de um arco-íris genérico em toda a tela, o efeito projeta estrelas douradas de 4 pontas (*diamond glints / 4-point sparkles*) em posições estratégicas na superfície da carta.
   - As estrelas pulsam suavemente com rotação lenta e variação de brilho (cintilação mágica).
2. **Selo de Autenticidade / Rake Holográfico**:
   - Acabamento dourado místico nas bordas e reflexo perolado sem lavagem de cor.
3. **Desativação**:
   - Ao desativar o toggle "Texturizada", a carta volta imediatamente para a textura original normal e as partículas de brilho desaparecem suavemente.

---

## 5. Critérios de Aceitação (DoD)

- [ ] **CA-01 (Sem Duplicatas no Seletor)**: Cartas com versão normal e texturizada (como *Riveli*, *Suzana II*, *Mirélia*, *Vorth*, etc.) aparecem apenas **uma única vez** no dropdown de busca.
- [ ] **CA-02 (Exibição do Toggle Texturizada)**: O botão "Texturizada" só é exibido se a carta possuir versão texturizada disponível.
- [ ] **CA-03 (Ativação Automática)**: Ao selecionar uma carta elegível, o modo "Texturizada" já inicia ativado com a arte texturizada aplicada.
- [ ] **CA-04 (Troca Dinâmica de Textura)**: Alternar o botão alterna entre a arte padrão e a arte texturizada em tempo real.
- [ ] **CA-05 (Brilho Estelar Fiel ao Print)**: Quando o modo texturizado estiver ativo, são exibidos brilhos estelares cintilantes (sparkles dourados ✦) sobre a carta, simulando o acabamento físico colecionável.
