# Especificação Técnica de Design System: Tema, Tokens e Variáveis (SDD)

**Projeto:** Éther TCG - Card Preview  
**Status:** Aprovado / Pronto para Implementação  
**Versão:** 2.0.0 (Baseado no Brand & Style Guide: Cyber-Ethereal)  
**Data:** 2026-10-20  

---

## 1. Visão Geral e Identidade da Marca

O tema do **Éther TCG** personifica uma estética **Cyber-Ethereal** concebida para jogos de cartas colecionáveis digitais de alto prestígio. Ele mescla misticismo arcano com tecnologia holográfica hiperavançada. A interação deve transmitir a sensação tátil de manipular uma relíquia física através de um campo de contenção holográfico.

### Pilares Visuais:
- **Glassmorphism & Holografia:** Camadas translúcidas com `backdrop-filter: blur()`, bordas iridescentes com reflexos luminosos (*rim lighting*) e dispersão cromática.
- **Substrato de Obsidiana Profunda:** Fundos escuros abissais de fadiga zero como base de alto contraste para acentos elétricos luminosos.
- **Micro-feedback Tátil:** Respostas táteis precisas, brilhos em néon e snapping mecânico no padrão de ferramentas para desenvolvedores e telemetria de jogos AAA (estética inspirada no ecossistema shadcn).
- **Tipografia Dual:** `Space Grotesk` para títulos geométricos/técnicos e badges; `Inter` para legibilidade máxima em dados e textos de lore.

---

## 2. Sistema de Tokens e Paleta de Cores

O tema opera sobre uma base primária escura (Obsidian/Dark Mode), com suporte invertido/light espelhado de forma coerente.

### 2.1. Tokens Fundamentais da Marca (M3 / Cyber-Ethereal)

```yaml
Colors:
  # Superfícies Obsidiana
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393f'
  surface-container-lowest: '#0d0e13'
  surface-container-low: '#1a1b21'
  surface-container: '#1e1f25'
  surface-container-high: '#292a2f'
  surface-container-highest: '#34343a'
  surface-variant: '#34343a'
  
  # Textos e Contraste
  on-surface: '#e3e1e9'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e3e1e9'
  inverse-on-surface: '#2f3036'
  
  # Bordas e Contornos
  outline: '#958ea0'
  outline-variant: '#494454'
  
  # Acentos de Energia
  primary: '#d0bcff'                # Mystical Violet
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  
  secondary: '#4cd7f6'              # Electric Cyan (Mana / Psíquico)
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  
  tertiary: '#ffb95f'               # Prismatic Gold (Raridade Lendária)
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  
  error: '#ffb4ab'                  # Void Crimson (Ataque / Destrutivo)
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
```

### 2.2. Mapeamento Semântico e Compatibilidade Shadcn/ui

Mapeamento dos tokens de design para as variáveis padrão consumidas por Tailwind v4 e componentes shadcn/ui:

| Token Semântico | Propósito | Dark Mode (Padrão Cyber-Ethereal) | Light Mode (Invertido) |
|---|---|---|---|
| `--background` | Fundo principal da página | `#0d0e13` (container-lowest) | `#f5f4f8` |
| `--foreground` | Texto principal de leitura | `#e3e1e9` (on-surface) | `#121318` |
| `--card` | Painel de vidro / Card 3D HUD | `rgba(18, 20, 30, 0.75)` | `rgba(255, 255, 255, 0.85)` |
| `--card-foreground` | Texto sobre o card | `#e3e1e9` | `#121318` |
| `--popover` | Menus flutuantes, tooltips | `#1e1f25` (surface-container) | `#ffffff` |
| `--popover-foreground` | Texto de popovers | `#e3e1e9` | `#121318` |
| `--primary` | Violeta Místico (Ação Principal) | `#a078ff` | `#6d3bd7` |
| `--primary-foreground` | Texto sobre botão primário | `#ffffff` | `#ffffff` |
| `--secondary` | Ciano Elétrico (Mana / Telemetria) | `#06b6d4` (`#4cd7f6`) | `#0284c7` |
| `--secondary-foreground` | Texto sobre secundário | `#003640` | `#ffffff` |
| `--muted` | Substratos discretos / inativos | `#292a2f` | `#eceaf1` |
| `--muted-foreground` | Rótulos secundários, metadados | `#958ea0` (outline) | `#6b6375` |
| `--accent` | Realce de seleção e foco ativo | `rgba(160, 120, 255, 0.15)` | `rgba(109, 59, 215, 0.1)` |
| `--accent-foreground` | Texto em destaque | `#d0bcff` | `#6d3bd7` |
| `--destructive` | Dano / Destrutivo (Void Crimson) | `#f43f5e` | `#e11d48` |
| `--destructive-foreground` | Texto sobre destrutivo | `#ffffff` | `#ffffff` |
| `--border` | Bordas translúcidas | `rgba(255, 255, 255, 0.08)` (`#494454`) | `rgba(0, 0, 0, 0.12)` |
| `--input` | Bordas e caixas de input | `#292a2f` | `#d8d5df` |
| `--ring` | Anel de foco (Glow) | `#d0bcff` | `#6d3bd7` |

### 2.3. Efeitos de Profundidade e Atmosfera (Atmospheric Tiers)

1. **Floor 0 (Cosmic Void):** Fundo base `#0a0b10` com gradiente atmosférico radial em `rgba(139, 92, 246, 0.08)` no topo e `rgba(6, 182, 212, 0.06)` na base.
2. **Floor 1 (Sub-Dock Glass):** Controles flutuantes em `rgba(18, 20, 30, 0.65)` com `backdrop-filter: blur(16px)` e borda `rgba(255, 255, 255, 0.08)`.
3. **Floor 2 (Card Stage Glass & Overlays):** Painéis de estatísticas e drawers com `rgba(22, 26, 42, 0.82)`, `backdrop-filter: blur(24px)` e borda `rgba(139, 92, 246, 0.3)`.
4. **Floor 3 (Prismatic Active Elements):** Elementos ativos com brilho etéreo:
   - `box-shadow: 0 0 24px -4px rgba(139, 92, 246, 0.4), inset 0 0 12px 0 rgba(6, 182, 212, 0.2)`
   - Gradiente de borda holográfica: `linear-gradient(135deg, #8b5cf6, #06b6d4)`

---

## 3. Tipografia e Escala

### 3.1. Famílias Tipográficas
- **Display / Títulos / Badges:** `'Space Grotesk', sans-serif` (Futurista, geométrico, numerais tabulares `tabular-nums`).
- **Corpo / UI / Descrições:** `'Inter', sans-serif` (Clareza e legibilidade máxima sobre vidros foscos).

### 3.2. Escala Tipográfica
- `headline-xl`: `40px` / line-height `48px` / weight `700` (`Space Grotesk`) [Mobile: `30px` / `38px`]
- `headline-lg`: `32px` / line-height `40px` / weight `700` (`Space Grotesk`) [Mobile: `24px` / `32px`]
- `headline-md`: `24px` / line-height `32px` / weight `600` (`Space Grotesk`)
- `headline-sm`: `20px` / line-height `28px` / weight `600` (`Space Grotesk`)
- `body-lg`: `16px` / line-height `24px` / weight `400` (`Inter`)
- `body-md`: `14px` / line-height `20px` / weight `400` (`Inter`)
- `body-sm`: `12px` / line-height `16px` / weight `400` (`Inter`)
- `label-lg`: `14px` / line-height `20px` / weight `600` (`Space Grotesk`)
- `label-md`: `12px` / line-height `16px` / weight `600` (`Space Grotesk`)
- `label-sm`: `10px` / line-height `14px` / weight `700` (`Space Grotesk`)

---

## 4. Raios de Arredondamento (Shape Tokens)

- `--radius-sm`: `0.25rem` (4px)
- `--radius-md`: `0.5rem` (8px - padrão para botões, inputs e badges)
- `--radius-lg`: `0.75rem` (12px)
- `--radius-card`: `1rem` (16px - padrão para cartas e modais)
- `--radius-xl`: `1.5rem` (24px - gavetas de inspeção e painéis externos)
- `--radius-full`: `9999px` (pills e chips de raridade)

---

## 5. Implementação Técnica no Tailwind CSS v4

### 5.1. `@theme` no `src/index.css`
A declaração segue a nova convenção de tokens em Tailwind v4:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Fontes */
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;

  /* Cores Base do Sistema */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Tokens Cyber-Ethereal Específicos */
  --color-surface-dim: var(--surface-dim);
  --color-surface-bright: var(--surface-bright);
  --color-ether-cyan: #06b6d4;
  --color-ether-violet: #8b5cf6;
  --color-ether-gold: #f59e0b;
  --color-ether-crimson: #f43f5e;
  --color-ether-emerald: #10b981;

  /* Arredondamento */
  --radius-card: 1rem;
}

:root {
  /* Modo Padrão: Cyber-Ethereal Dark */
  --background: #0a0b10;
  --foreground: #f8fafc;
  --card: rgba(18, 20, 30, 0.75);
  --card-foreground: #f8fafc;
  --popover: #1e1f25;
  --popover-foreground: #e3e1e9;
  --primary: #8b5cf6;
  --primary-foreground: #ffffff;
  --secondary: #06b6d4;
  --secondary-foreground: #003640;
  --muted: #1e2235;
  --muted-foreground: #94a3b8;
  --accent: rgba(139, 92, 246, 0.15);
  --accent-foreground: #d0bcff;
  --destructive: #f43f5e;
  --destructive-foreground: #ffffff;
  --border: rgba(255, 255, 255, 0.08);
  --input: #1f2333;
  --ring: #8b5cf6;

  --surface-dim: #0d0e13;
  --surface-bright: #38393f;
}

.light {
  /* Modo Claro Opcional (Espelho Invertido) */
  --background: #f5f4f8;
  --foreground: #121318;
  --card: rgba(255, 255, 255, 0.85);
  --card-foreground: #121318;
  --popover: #ffffff;
  --popover-foreground: #121318;
  --primary: #6d3bd7;
  --primary-foreground: #ffffff;
  --secondary: #0284c7;
  --secondary-foreground: #ffffff;
  --muted: #eceaf1;
  --muted-foreground: #6b6375;
  --accent: rgba(109, 59, 215, 0.1);
  --accent-foreground: #6d3bd7;
  --destructive: #e11d48;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.12);
  --input: #d8d5df;
  --ring: #6d3bd7;

  --surface-dim: #e4e2eb;
  --surface-bright: #ffffff;
}
```

---

## 6. Critérios de Aceitação (DoD)

- [ ] **CA-01**: Tailwind CSS v4 configurado com plugin Vite sem erros.
- [ ] **CA-02**: Variáveis e tokens de cores, superfícies e tipografia integrados via `@theme` no `src/index.css`.
- [ ] **CA-03**: Carregamento das fontes `Space Grotesk` e `Inter` via Google Fonts no `index.html`.
- [ ] **CA-04**: Suporte nativo aos modos Dark e Light via seletor de classe e persistência.
- [ ] **CA-05**: Utilitários para Glassmorphism (`backdrop-blur-md`, bordas com opacidade) prontos para compor o HUD da carta 3D.
