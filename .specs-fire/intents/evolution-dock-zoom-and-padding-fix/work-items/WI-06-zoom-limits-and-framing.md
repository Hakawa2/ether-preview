# Work Item: WI-06 - Limites de Zoom e Enquadramento Seguro da Câmera 3D

**Intent:** `evolution-dock-zoom-and-padding-fix`  
**Modo:** Confirm  
**Complexidade:** Média  
**Arquivos Alvo:**
- `src/App.tsx`
- `src/components/preview-container/index.tsx`

## Escopo
1. Em `src/components/preview-container/index.tsx`:
   - Aumentar `minDistance` de `3` para `4.6` no `<OrbitControls>`, impedindo que o scroll do mouse aproxime a carta a ponto de cobrir a barra inferior.
   - Ajustar o target do OrbitControls ou a posição Y da carta (`target={[0, 0.45, 0]}` ou card com `position={[0, 0.35, 0]}`) para manter o centro visual da carta bem acima da área do dock flutuante.
2. Em `src/App.tsx`:
   - Atualizar a função de zoom da toolbar para respeitar o novo clamp: `clamp(camera.position.z + delta, 4.6, 9.0)`.

