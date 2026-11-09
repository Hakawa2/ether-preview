# Intent Brief: Ajuste do Componente de Evolução ao Layout Stitch

**ID:** `evolution-component-redesign`  
**Status:** In Progress  
**Data:** 2026-11-09  

---

## 1. Visão Geral e Objetivo
Ajustar o componente de sequência evolutiva (`CardSequenceViewer` e `SequenceThumbnail`) para seguir rigorosamente as diretrizes e estética do layout de referência Stitch (`stitch/screen_18439878295509406051.html`), posicionando-o como um **dock inferior flutuante**, corrigindo bugs de renderização/layout e aperfeiçoando a experiência de visualização quando houver 1 ou 2 linhas evolutivas.

---

## 2. Problemas Identificados
1. **Posicionamento incorreto:** O componente estava no topo da tela, disputando espaço com a toolbar e obstruindo a visualização da carta 3D.
2. **Estética destoante do Stitch:** As miniaturas de sequência e conectores de energia precisavam dos tokens e layout fiéis do Stitch (aspect ratio `3/3.8`, badge `#number`, conectores sutis com pulso, estado ativo iluminado com glow).
3. **Múltiplas Linhas Evolutivas no Dock Inferior:** Apresentar 2 linhas evolutivas de forma limpa, compacta e acessível (ex: tabs discretas ou tracks com proporções refinadas) sem cobrir o canvas 3D nem ultrapassar a altura máxima.

---

## 3. Critérios de Sucesso
- [ ] O `CardSequenceViewer` é renderizado no **rodapé flutuante inferior** (bottom dock) sobre o canvas 3D.
- [ ] As miniaturas refletem o design do Stitch (aspect `3/3.8`, bordas arredondadas, badge de número no canto, indicação clara de fase/nível).
- [ ] Conectores visuais entre fases exibem pulso energético conforme status de progressão.
- [ ] Quando a carta tiver 2 linhas evolutivas, ambas podem ser visualizadas e navegadas de forma elegante sem quebrar o layout.
- [ ] O clique em qualquer miniatura atualiza o preview 3D e todos os dados associados.
- [ ] Verificação de tipos TypeScript aprovada sem erros.

