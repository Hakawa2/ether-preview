# Work Item: WI-05 - Remoção de Colisão da Mensagem Touch & Drag

**Intent:** `evolution-dock-zoom-and-padding-fix`  
**Modo:** Confirm  
**Complexidade:** Baixa  
**Arquivos Alvo:**
- `src/App.tsx`

## Escopo
1. Remover a div duplicada `fixed bottom-[148px]` com o texto `Touch & Drag para Girar 3D` que ficava por trás do cabeçalho da linha evolutiva.
2. Posicionar a dica de forma limpa como um pill compacto centralizado ou integrá-la no Canvas/Header sem invadir a área interativa do dock.

