# Work Item: WI-04 - Proporção de Thumbnails e Exibição Completa das 4 Fases

**Intent:** `evolution-dock-refinement`  
**Modo:** Confirm  
**Complexidade:** Baixa  
**Arquivos Alvo:**
- `src/components/sequence/SequenceThumbnail.tsx`
- `src/components/sequence/CardSequenceViewer.tsx`

## Escopo
1. Em `SequenceThumbnail.tsx`:
   - Reduzir `min-w-[96px]` para `min-w-[72px] sm:min-w-[80px]` e padding `p-1`.
   - Ajustar o tamanho da fonte do título para `text-[10px]` com `leading-tight` e tratamento de quebra/truncamento suave (`line-clamp-1` ou truncate refinado).
   - Ajustar o rótulo de nível para `text-[9px]`.
2. Em `CardSequenceViewer.tsx`:
   - Reduzir o espaçamento entre itens (`gap-1`) e conectores para `w-3 h-3`, permitindo que as 4 cartas caibam harmoniosamente na esteira.
   - Garantir que a 4ª carta (`Kov, Rei do Vazio`) apareça perfeitamente renderizada no final da esteira.

