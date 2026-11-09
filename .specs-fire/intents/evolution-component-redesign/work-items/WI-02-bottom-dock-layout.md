# Work Item: WI-02 - Reposicionamento do Dock no Rodapé e Tratamento de Múltiplas Linhas

**Intent:** `evolution-component-redesign`  
**Modo:** Confirm  
**Complexidade:** Média  
**Arquivos Alvo:**
- `src/App.tsx`
- `src/components/sequence/CardSequenceViewer.tsx`

## Escopo
1. Mover `CardSequenceViewer` no `App.tsx` da seção superior para o **rodapé inferior** (dock flutuante com `fixed bottom-4 inset-x-0 z-30`), mantendo espaço para a dica tátil de drag e integrando-se harmonicamente sobre o Canvas 3D.
2. Em `CardSequenceViewer.tsx`:
   - Se houver 1 linha: renderizar o dock elegante com header ("Sequência Evolutiva da Carta" + badge "Fase X de Y") e esteira de cards.
   - Se houver 2 linhas: renderizar seletor de linha compacto (Tabs/Pill toggle "Linha 1" / "Linha 2" ou layout empilhado de baixo impacto) para que o usuário alterne e veja as 2 linhas evolutivas de forma limpa sem poluir a tela.
3. Garantir interatividade completa (ao clicar, o 3D atualiza e o dock reflete a fase atual).

