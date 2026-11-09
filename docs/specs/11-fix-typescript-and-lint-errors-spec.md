# Especificação Técnica: Resolução Definitiva de Erros de Tipagem TypeScript (`tsc -b`) e Linting

**Projeto:** Éther TCG - Card Preview  
**Status:** Proposto / Pronto para Execução  
**Versão:** 1.0.0  
**Data:** 2026-11-09  
**Origem do Chamado:** Falha na pipeline de build (`pnpm run build` / `tsc -b && vite build`) no GitHub Actions (`.github/workflows/deploy.yml`).

---

## 1. Diagnóstico e Causa Raiz

### 1.1. O Efeito Cascata do Erro `TS2307`
Ao executar o comando de build do projeto (`pnpm run build` ou `npx tsc -b`), o TypeScript reportou **88 erros** em cascata:
```
src/lib/catalog.ts(1,31): error TS2307: Cannot find module './card' or its corresponding type declarations.
```

**Por que todos os erros aconteceram?**
1. O arquivo [`src/lib/catalog.ts`](file:///c:/Users/Hakawa/workspace/ether-preview/src/lib/catalog.ts) importava `CardData` de um caminho inexistente:
   ```typescript
   // LINHA COM BUG EM src/lib/catalog.ts:
   import type { CardData } from './card' // ❌ Não existe src/lib/card.ts
   ```
2. O arquivo correto é [`src/types/card.ts`](file:///c:/Users/Hakawa/workspace/ether-preview/src/types/card.ts):
   ```typescript
   // CAMINHO CORRETO:
   import type { CardData } from '../types/card' // ✅
   ```
3. Como `CardData` foi inferido como `any/error`, a interface:
   ```typescript
   export interface UnifiedCardData extends CardData { ... }
   ```
   **perdeu todas as propriedades herdadas** (`id`, `name`, `level`, `number`, `collection`, `type`, `turns`, `rarity`, `evolution_line`).
4. Consequentemente, **todos os arquivos do projeto** (`App.tsx`, `CardPillsBar.tsx`, `CardStageSelector.tsx`, `SequenceThumbnail.tsx`, `CardSequenceViewer.tsx`, `sequence.ts`) passaram a falhar com dezenas de erros `Property 'X' does not exist on type 'UnifiedCardData'`.

---

### 1.2. Alertas de Linting e Qualidade (`oxlint`)
Ao rodar `npx oxlint src`, foram detectados 4 avisos:
1. **Import não utilizado:** `ChevronDown` importado em [`CardSequenceViewer.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/sequence/CardSequenceViewer.tsx) mas não utilizado após o refactor de pills.
2. **Mutação de estado do React Three Fiber:** Modificação direta de `texture.colorSpace` dentro de renderização no [`src/components/card/index.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/card/index.tsx).
3. **Padrão de exportação rápida (Fast Refresh):** Exportação de hook e componente no mesmo arquivo [`src/context/ThemeContext.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/context/ThemeContext.tsx).

---

## 2. Escopo das Correções

### 2.1. Arquivos Alvo
- [`src/lib/catalog.ts`](file:///c:/Users/Hakawa/workspace/ether-preview/src/lib/catalog.ts)
- [`src/components/sequence/CardSequenceViewer.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/sequence/CardSequenceViewer.tsx)
- [`src/components/card/index.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/card/index.tsx)

---

## 3. Plano de Ação Passo a Passo

### Passo 1: Correção do Import Base em `src/lib/catalog.ts`
Substituir:
```typescript
import type { CardData } from './card'
```
Por:
```typescript
import type { CardData } from '../types/card'
```

### Passo 2: Remoção do Import Não Utilizado em `CardSequenceViewer.tsx`
Remover `ChevronDown` dos imports de `lucide-react`:
```typescript
import { ChevronRight, GitBranch } from 'lucide-react'
```

### Passo 3: Limpeza de Mutação em `src/components/card/index.tsx`
Garantir que a atribuição de `texture.colorSpace = THREE.SRGBColorSpace` ocorra de forma segura via `useMemo` ou `useEffect` sem gerar alerta de immutabilidade do compilador React.

### Passo 4: Validação Rigorosa
1. Executar `npx tsc -b` para assegurar que **100% dos 88 erros de compilação desapareceram** e o exit code seja 0.
2. Executar `npx oxlint src` para garantir que as advertências foram sanadas.

---

## 4. Critérios de Aceitação (DoD)
- [ ] `npx tsc -b` executa com saída limpa e código de saída `0`.
- [ ] `UnifiedCardData` herda corretamente todos os campos de `CardData` em tempo de compilação.
- [ ] Pipeline do GitHub Actions (`pnpm run build`) pode executar `tsc -b && vite build` com sucesso.
- [ ] Zero regressões funcionais na exibição e navegação dos cards 3D e da sequência evolutiva.

