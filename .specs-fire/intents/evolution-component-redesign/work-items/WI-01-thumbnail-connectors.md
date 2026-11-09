# Work Item: WI-01 - Redesign Visual das Miniaturas e Conectores de Sequência

**Intent:** `evolution-component-redesign`  
**Modo:** Confirm  
**Complexidade:** Média  
**Arquivos Alvo:**
- `src/components/sequence/SequenceThumbnail.tsx`
- `src/components/sequence/CardSequenceViewer.tsx`

## Escopo
1. Atualizar `SequenceThumbnail.tsx` com as proporções exatas do Stitch:
   - Aspect ratio `aspect-[3/3.8]`, `rounded-lg`, fundo `bg-surface-container-lowest`.
   - Badge `#number` posicionado no canto superior esquerdo com fundo translúcido e cor de destaque.
   - Indicador de variante texturizada se aplicável.
   - Label do personagem e Nível com tipografia nítida (`font-display` e `font-body`).
   - Estado ativo (`isSelected`) com anel/borda de glow e fundo `bg-surface-variant/70`.
2. Estilizar os conectores de fluxo de energia (`ChevronRight` + barra com `animate-pulse` e cores de status).

