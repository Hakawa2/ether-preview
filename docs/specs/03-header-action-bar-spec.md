# Especificação Técnica: Header e Tactical Action Bar (SDD - Fase 1)

**Projeto:** Éther TCG - Card Preview  
**Status:** Proposto / Em Revisão  
**Versão:** 1.0.0  
**Data:** 2026-10-20  
**Referência Visual:** Tela Stitch `18439878295509406051` ([screenshot](file:///c:/Users/Hakawa/workspace/ether-preview/stitch/screen_18439878295509406051.png))

---

## 1. Visão Geral e Propósito

Esta especificação define os requisitos, anatomia, contratos de dados e comportamento interativo para a primeira implementação da camada superior de interface do **Card Inspector** do Éther TCG:
1. **Header Principal (Status Bar / Brand Header)**: Identificação da marca com logotipo, título do módulo e gatilho de notificações / tema.
2. **Card Selector & Stage Pill Bar**: Seletor da carta ativa com dropdown de estágios evolutivos e pílulas de afinidade/nível/efeito holográfico (Foil ✨).
3. **Tactical Action Bar (Toolbar 3D)**: Barra de controle tátil flutuante conectada ao viewport 3D (R3F) para rotação automática 360°, flip frente/verso, telemetria e controles de zoom/reset de câmera.

---

## 2. Anatomia dos Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo] ÉTHER TCG / Card Inspector                      [Theme/Notif 🔔]│ <-- Header Principal
├────────────────────────────────────────────────────────────────────────┤
│ [🔮 Aetherling — Estágio 1 (Celestial / Dragão Menor)              ▼] │ <-- Card Selector
│                                                                        │
│ (🌀 Ascensão Cósmica)  (💎 Nv1)  (✨ Foil Holo)                          │ <-- Status Pill Bar
├────────────────────────────────────────────────────────────────────────┤
│ [🔄 360°] [🎴 Flip]      ● R3F CANVAS      [−] [+] [⟲ Reset]           │ <-- Tactical Action Bar
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Especificação Detalhada por Módulo

### 3.1. Header Principal (`BrandHeader`)

- **Posicionamento**: Fixo ou relativo no topo da aplicação, com `z-index: 50`.
- **Aparência**:
  - Fundo translúcido com `bg-surface/80` e `backdrop-blur-xl`.
  - Borda inferior sutil `border-b border-border` e sombra suave.
- **Elementos**:
  - **Identidade à Esquerda**:
    - Ícone/Avatar místico do Éther TCG com brilho etéreo.
    - Tag de categoria: `font-display text-[10px] uppercase tracking-widest text-secondary` ("ETHER TCG").
    - Título da tela: `font-display text-base font-semibold text-on-surface` ("Card Inspector").
  - **Ações à Direita**:
    - Botão de Notificações com indicador pulsante de novidade (`ping` ciano).
    - Botão compacto de alternância de tema (`ThemeToggle`).

### 3.2. Seletor de Carta e Estágios (`CardStageSelector`)

- **Seletor Trigger (Dropdown Trigger)**:
  - Container tipo card em `bg-surface-container-high/90` com cantos arredondados (`rounded-xl`), borda `border border-border` e feedback tátil ao clicar (`active:scale-[0.99]`).
  - **Ícone**: Quadrado 24x24px com gradiente `from-primary-container to-secondary` e ícone de brilho arcano (`Sparkles` / `auto_awesome`).
  - **Tipografia**:
    - Título da carta: `Space Grotesk` 14px / peso 600 ("Aetherling — Estágio 1").
    - Subtítulo / Rótulo: `Inter` 10px em `uppercase tracking-wider text-secondary` ("Celestial / Dragão Menor • Rara Prismática").
    - Ícone indicador de expansão (`ChevronDown`) com animação de rotação `rotate-180` no estado aberto.
- **Menu Suspenso (Dropdown Panel)**:
  - Lista flutuante em `bg-surface-container-highest/95 backdrop-blur-2xl` com borda e sombra profunda.
  - Opções com identificadores visuais de estágio (ex: Estágio 1 - Aetherling, Nv1, Custo 2 Éter vs Estágio 2 - Aether Sovereign, Nv10, Custo 6 Éter).
  - Chip indicativo do estágio atualmente ativo.

### 3.3. Barra de Tags e Afinidades (`CardPillsBar`)

- **Container**: Linha com rolagem horizontal livre (`overflow-x-auto no-scrollbar`), flexível para mobile e desktop.
- **Chips**:
  1. **Tag de Coleção/Afinidade**: Ícone de vórtice/ciclone + "Ascensão Cósmica" em `bg-surface-container/70 text-secondary`.
  2. **Tag de Nível**: Ícone de diamante/gema + "Nv1" em `bg-surface-container/70 text-primary-fixed`.
  3. **Botão Foil Holo (Toggle Interativo)**:
     - Botão interativo que ativa/desativa o efeito holográfico prismático na carta 3D.
     - Estado ativo: fundo em `bg-secondary/15 text-secondary border border-secondary/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]` + "Foil Holo ✨".
     - Feedback: clique tátil com `active:scale-95`.

### 3.4. Tactical Action Bar (`TacticalActionBar`)

Barra de ferramentas táticas conectada diretamente ao estado da câmera e da cena 3D:
- **Container**: `bg-surface-container-high/60 backdrop-blur-md border border-border rounded-xl px-3 py-2 flex items-center justify-between`.
- **Grupo Esquerdo (Comportamento de Visualização)**:
  - **Botão 360° (Auto-Rotate)**:
    - Alterna a rotação automática contínua da carta.
    - Estado ativo com destaque néon ciano (`text-secondary bg-secondary/20`).
  - **Botão Flip (Frente / Verso)**:
    - Aciona transição suave de 180° no eixo Y para inspecionar o cardback.
- **Centro (Telemetria & Status)**:
  - Badge em pílula `bg-surface-container-lowest/80 border border-border px-2.5 py-1 rounded-full`.
  - Ponto de luz animado (`bg-secondary animate-ping`) + texto `"R3F CANVAS"` em `font-display text-[10px] tracking-wider uppercase text-on-surface-variant`.
- **Grupo Direito (Controles de Câmera & Zoom)**:
  - **Zoom Out (−)**: Diminui a aproximação da câmera.
  - **Zoom In (+)**: Aumenta a aproximação da câmera dentro dos limites definidos.
  - **Reset (⟲)**: Restaura posição inicial, rotação e escala da câmera.

---

## 4. Modelagem de Dados e Tipagens (TypeScript)

```typescript
export interface CardStageOption {
  id: string
  stageNumber: number
  name: string
  category: string
  rarity: string
  cost: number
  level: number
  affinity: string
  isActive: boolean
}

export interface TacticalActionState {
  isAutoRotating: boolean
  isFlipped: boolean
  isFoilActive: boolean
  zoomLevel: number // Valor normalizado (ex: 0.8 a 1.5)
}

export interface ActionBarEvents {
  onToggleAutoRotate: () => void
  onFlipCard: () => void
  onToggleFoil: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetCamera: () => void
  onSelectStage: (stage: CardStageOption) => void
}
```

---

## 5. Estrutura Proposta de Componentes

```
src/
├── components/
│   ├── layout/
│   │   ├── BrandHeader.tsx           <-- Header com logo, título e notificações
│   │   └── CardTacticalHeader.tsx    <-- Wrapper dos seletores e action bar
│   ├── inspector/
│   │   ├── CardStageSelector.tsx     <-- Dropdown tátil de cartas/estágios
│   │   ├── CardPillsBar.tsx          <-- Chips de afinidade, nível e botão Foil
│   │   └── TacticalActionBar.tsx     <-- Toolbar de rotação, flip, zoom e reset
│   └── ui/
│       └── theme-toggle.tsx          <-- Componente existente
```

---

## 6. Critérios de Aceitação (DoD - Definition of Done)

- [ ] **CA-01 (Fidelidade Visual)**: O layout do header e da action bar reproduz com precisão o design da tela Stitch, utilizando tokens do Tailwind v4 (`bg-surface`, `bg-surface-container-high`, `text-secondary`, `Space Grotesk`).
- [ ] **CA-02 (Acessibilidade e Toque)**: Todos os botões interativos respeitam a área mínima de toque de 40x40px (ou 44px em mobile) com transições visuais claras (`active:scale-95`).
- [ ] **CA-03 (Dropdown Interativo)**: O seletor de cartas abre e fecha com animação suave, permitindo selecionar entre a Fase 1 e a Fase 2.
- [ ] **CA-04 (Comunicação de Estado)**: Os botões da Action Bar (360°, Flip, Foil, Zoom) disparam eventos callback para que a cena 3D (R3F) reaja em tempo real.
- [ ] **CA-05 (Responsividade)**: O layout adapta-se fluidamente em telas mobile (360px a 430px) e desktop sem sobreposição de elementos ou quebra de linha indesejada.
- [ ] **CA-06 (Light e Dark Mode)**: A barra de ferramentas preserva legibilidade e contraste adequado tanto no Dark Mode padrão quanto no Light Mode.

---

## 7. Próximos Passos
1. Aprovação desta especificação.
2. Implementação dos componentes `BrandHeader`, `CardStageSelector`, `CardPillsBar` e `TacticalActionBar`.
3. Conexão dos eventos da Action Bar com os nós do React Three Fiber no `PreviewContainer`/`Card`.
