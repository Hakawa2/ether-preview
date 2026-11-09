# Intent Brief: Refinamento de Posição, Zoom e Padding das Thumbnails

**ID:** `evolution-dock-zoom-and-padding-fix`  
**Status:** In Progress  
**Data:** 2026-11-09  

---

## 1. Problemas Identificados a partir dos Prints
1. **Mensagem vazando por baixo da linha evolutiva ("touch_app TOUCH & DRAG PARA GIRAR 3D"):**
   - No `App.tsx`, havia um elemento absoluto com texto "Touch & Drag para Girar 3D" fixado no `bottom-[148px]`, que colidia exatamente com a área do dock e das pills de linhas, causando sobreposição ilegível de textos.
2. **Zoom máximo permitindo a carta 3D invadir o dock inferior:**
   - No `PreviewContainer`, o OrbitControls tinha `minDistance={3}`, e nos botões de zoom `clamp(..., 3.5, 9.0)`. Em telas menores ou em ângulo frontal, um zoom tão próximo faz a carta 3D tocar e cobrir o dock de evolução.
   - O offset do Canvas precisa de padding inferior (`pb-48`) ou centrar o target da câmera mais alto (ex: `target={[0, 0.4, 0]}`), e o zoom mínimo deve ser ajustado para um limite seguro (ex: `minDistance={4.8}`).
3. **Falta de padding interno para nome e nível na miniatura:**
   - No `SequenceThumbnail.tsx`, o texto do nome e do nível não possuía padding lateral (`px-1`), fazendo a letra inicial colar na borda do anel/glow ciano (`ring-1 ring-secondary/60`).

---

## 2. Critérios de Sucesso
- [ ] O texto "Touch & Drag para Girar 3D" não colide mais com a barra de evolução nem vaza por trás.
- [ ] O zoom e o enquadramento do Canvas 3D garantem que a carta fique contida no viewport sem encavalar no dock inferior.
- [ ] As thumbnails possuem espaçamento/padding interno elegante (`px-1.5 pt-0.5 pb-1`), sem texto colando na borda ou no anel ativo.
- [ ] Tipagem e testes validados sem erros.

