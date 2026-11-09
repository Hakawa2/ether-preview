# Work Item: WI-07 - Padding Interno e Tipografia das Thumbnails

**Intent:** `evolution-dock-zoom-and-padding-fix`  
**Modo:** Confirm  
**Complexidade:** Baixa  
**Arquivos Alvo:**
- `src/components/sequence/SequenceThumbnail.tsx`

## Escopo
1. Em `src/components/sequence/SequenceThumbnail.tsx`:
   - Adicionar `px-1.5 pt-1 pb-1` na div de identificação textual abaixo da imagem.
   - Ajustar o padding geral do botão e o raio de curvatura (`p-1.5 rounded-xl`), garantindo que tanto o nome da carta quanto a etiqueta de nível não encostem nas bordas do anel ciano quando o card estiver ativo (`isSelected`).

