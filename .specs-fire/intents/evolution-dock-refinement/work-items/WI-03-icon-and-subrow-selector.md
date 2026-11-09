# Work Item: WI-03 - Correção do Ícone SVG e Sub-header para Seletor de Linha

**Intent:** `evolution-dock-refinement`  
**Modo:** Confirm  
**Complexidade:** Baixa  
**Arquivos Alvo:**
- `src/components/sequence/CardSequenceViewer.tsx`

## Escopo
1. Substituir a tag `<span className="material-symbols-outlined">account_tree</span>` por `<GitBranch className="w-4 h-4 text-secondary flex-shrink-0" />` do `lucide-react`, eliminando o vazamento de texto bruto.
2. Mover o seletor de linhas para a **linha de baixo** do cabeçalho quando `hasMultipleLines` for verdadeiro:
   - Linha 1 (Header principal): Título à esquerda e Badge `Fase X de Y` à direita.
   - Linha 2 (Sub-header): Seletor de linhas em pills horizontais ou select estilizado com label "Linha Evolutiva:" para alternância sem conflito visual.

