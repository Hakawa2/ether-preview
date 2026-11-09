# Especificação Técnica: Foil Holo Condicional e Shader de Brilho Holográfico / Iridescência 3D

**Projeto:** Éther TCG - Card Preview  
**Status:** Proposto / Em Revisão  
**Versão:** 1.0.0  
**Data:** 2026-10-20  
**Arquivos de Referência:**
- [`src/cards.json`](file:///c:/Users/Hakawa/workspace/ether-preview/src/cards.json)
- [`src/components/card/index.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/card/index.tsx)
- [`src/components/inspector/CardPillsBar.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/inspector/CardPillsBar.tsx)
- [`src/App.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/App.tsx)

---

## 1. Visão Geral e Propósito

No universo do **Éther TCG**, o acabamento **Foil Holo** (holográfico texturizado) é uma característica exclusiva de cartas de alta raridade denominadas **"Texturizada"** (ex: *Mirélia, Olhos de Cristal*, *Kamilla, Dama do Fim*, *Vorth, Deusa da Alvorada*, *Riveli, Rei dos Mares*). 

Atualmente:
1. O botão **Foil Holo ✨** é exibido para todas as cartas indiscriminadamente.
2. O efeito de Foil limita-se a alterar parâmetros estáticos de iluminação global e propriedades básicas do material (`roughness`/`metalness`), resultando em uma iluminação esbranquiçada e sem sensação real de prisma ou laminação colecionável.

### Objetivos Principais:
1. **Exibição Condicional Estrita**: O botão `Foil Holo ✨` só deve ser renderizado quando a carta possuir `rarity === "Texturizada"` (insensível a maiúsculas/minúsculas).
2. **Ativação Automática Padrão**: Cartas texturizadas devem carregar por padrão com o modo `isFoilActive = true`.
3. **Shader de Efeito Holográfico Realista (Iridescência Prismática)**: Em vez de apenas clarear o material com luz, implementar uma camada de reflexo arco-íris dinâmico (holográfico) que se desloca dinamicamente conforme a carta rotaciona ou o ponteiro/câmera se movimenta.

---

## 2. Regras de Negócio e Comportamento na UI

### 2.1. Regra de Elegibilidade ao Foil
```typescript
export function isFoilEligible(rarity?: string): boolean {
  if (!rarity) return false
  return rarity.trim().toLowerCase() === 'texturizada'
}
```

- **Se `isFoilEligible(card.rarity) === true`**:
  - O botão `Foil Holo ✨` é renderizado na barra de status ([CardPillsBar](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/inspector/CardPillsBar.tsx)).
  - Ao selecionar a carta no seletor, o estado `isFoilActive` é automaticamente setado para `true`.
  - O usuário pode clicar no botão para ligar/desligar o efeito holográfico manualmente.
- **Se `isFoilEligible(card.rarity) === false`**:
  - O botão `Foil Holo ✨` **NÃO** é renderizado.
  - O estado `isFoilActive` é forçado para `false`, garantindo que cartas comuns ou sem textura renderizem com material padrão limpo.

---

## 3. Especificação do Efeito Visual Holográfico (Shader / Material 3D)

### 3.1. O que NÃO deve ser feito:
- Aumentar a intensidade de luzes brancas (pois "lava" a arte e estoura o brilho).
- Usar apenas `metalness` puro no `MeshStandardMaterial` (pois apenas espelha o ambiente sem criar reflexo prismático).

### 3.2. Efeito Holográfico Esperado (Cyber-Ethereal Rainbow / Iridescence Sheen):
Cartas colecionáveis foil do mundo real (como Pokémon Ultra Rare, Magic Foil ou Yu-Gi-Oh Starlight Rare) exibem:
1. **Reflexão Arco-íris Baseada no Ângulo de Visão (Fresnel + Coordenadas UV)**:
   - Conforme a carta se inclina no espaço 3D, linhas de luz em gradiente de espectro visível (ciano, violeta, magenta, dourado) varrem suavemente a superfície da ilustração.
2. **Efeito Glint / Glitter / Ruído Estelar**:
   - Micropartículas cintilantes que reagem ao ângulo da luz.
3. **Preservação da Legibilidade da Arte**:
   - A ilustração e a caixa de texto continuam legíveis, pois o efeito é aplicado em modo de blend de sobreposição aditiva (`Screen` ou `Color Dodge` / `opacity ~ 0.4 a 0.7`).

### 3.3. Abordagens Técnicas no React Three Fiber:

#### Abordagem Recomendada: Custom ShaderMaterial ou OnBeforeCompile com Textura Holográfica
Para garantir performance máxima e fluidez a 60 FPS:
- **Plano Overlay de Foil**:
  - Uma malha fina (`planeGeometry`) posicionada milimetricamente à frente da face da carta (`z = +0.026`).
  - Ou injeção via `onBeforeCompile` no `MeshStandardMaterial` calculando o vetor de visão `dot(viewDirection, normal)` modulado por um espectro de cores cíclico:
  ```glsl
  // Vetor de incidência angular
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float angle = dot(viewDir, vNormal);
  
  // Gradiente espectral holográfico (Foil Rainbow)
  vec3 rainbow = 0.5 + 0.5 * cos(6.28318 * (angle * 2.0 + vUv.x + vUv.y * 0.5 + vec3(0.0, 0.33, 0.67)));
  
  // Blend aditivo com a textura original
  gl_FragColor.rgb += rainbow * 0.45 * foilIntensity;
  ```
- **Foil Desativado**: A intensidade é interpolada suavemente para `0.0`.

---

## 4. Atualização de Contratos e Componentes

### 4.1. [`CardPillsBar.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/inspector/CardPillsBar.tsx)
- O botão só é renderizado com base na condição:
```tsx
{isFoilEligible(card.rarity) && (
  <button
    type="button"
    onClick={onToggleFoil}
    aria-pressed={isFoilActive}
    className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-display text-[11px] font-semibold tracking-wide flex-shrink-0 active:scale-95 transition-all cursor-pointer border',
      isFoilActive
        ? 'bg-secondary/20 border-secondary/50 text-secondary shadow-[0_0_12px_rgba(6,182,212,0.35)] animate-pulse'
        : 'bg-surface-container/60 border-border text-muted-foreground hover:text-foreground'
    )}
  >
    <Sparkles className="w-3.5 h-3.5 text-secondary" />
    <span>Foil Holo ✨</span>
  </button>
)}
```

### 4.2. [`App.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/App.tsx)
- Ao trocar a carta via `handleSelectCard(newCard)`:
```typescript
const handleSelectCard = (newCard: CardData) => {
  setSelectedCard(newCard)
  // Ativa automaticamente o foil caso a carta seja Texturizada, senão desativa
  setIsFoilActive(isFoilEligible(newCard.rarity))
}
```

### 4.3. [`Card/index.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/card/index.tsx)
- Recebe `isFoilActive` e aplica a camada / shader com o brilho prismático iridescente, respondendo aos movimentos do ponteiro e da rotação da carta.

---

## 5. Critérios de Aceitação (DoD - Definition of Done)

- [ ] **CA-01 (Ocultação para Cartas Comuns)**: O botão `Foil Holo ✨` não aparece para cartas onde `rarity` não é "Texturizada" (ex: "Comum", vazio, etc.).
- [ ] **CA-02 (Exibição para Cartas Texturizadas)**: O botão `Foil Holo ✨` aparece imediatamente quando uma das 10 cartas texturizadas do dataset for selecionada.
- [ ] **CA-03 (Ativação Automática Padrão)**: Ao selecionar uma carta texturizada, o foil já inicia ativado (`isFoilActive = true`).
- [ ] **CA-04 (Brilho Holográfico Realista)**: O efeito visual quando ativo apresenta uma ondulação de cores iridescentes / prismáticas (arco-íris holográfico) sincronizada com o ângulo da carta, sem estourar em luz branca nem clarear excessivamente a cena.
- [ ] **CA-05 (Alternância Fluida)**: O usuário pode desligar e ligar o efeito pelo botão com transição suave.
- [ ] **CA-06 (Performance)**: O efeito mantém 60 FPS estáveis tanto em mobile quanto em desktop.

---

## 6. Próximos Passos
1. Aprovação da especificação.
2. Implementação do shader/efeito holográfico iridescente em `src/components/card/index.tsx` (ou componente dedicado `HoloFoilLayer`).
3. Atualização condicional em `CardPillsBar.tsx` e lógica de ativação automática no `App.tsx`.
