# Intent Brief: Refinamento de UI/UX do Dock de Evolução

**ID:** `evolution-dock-refinement`  
**Status:** In Progress  
**Data:** 2026-11-09  

---

## 1. Visão Geral e Contexto
Após o reposicionamento do componente no rodapé, foram identificados 3 problemas pontuais de usabilidade e acabamento visual na tela real:
1. **Texto "account_tree" vazando como texto literal:** A fonte `Material Symbols Outlined` não está importada no `index.html`, renderizando o ligamento como texto bruto `"account_tree"` em ciano antes de "Sequência Evolutiva da Carta". Solução: usar o componente React `<GitBranch className="w-4 h-4 text-secondary flex-shrink-0" />` da biblioteca `lucide-react`, já em uso no projeto.
2. **Botão de seleção de linha cobrindo o título:** O select de linhas múltiplas estava na mesma linha horizontal com `truncate` apertado, sobrepondo ou esmagando o título da seção. Solução: colocar o seletor de linha em uma **segunda linha dedicada (sub-header)**, com visual de tabs/pills (`Linha 1 (Fragmento Vivo)`, `Linha 2...`), permitindo alternar com clareza sem colidir com o título nem com o badge de fase.
3. **Thumbnails grandes demais e nome cortado:** O `min-w-[96px]` somado ao gap de 4 cartas faz a 4ª carta (`Kov, Rei do Vazio`) ficar escondida no scroll overflow, além do texto do nome sofrer corte feio. Solução: calibrar para `min-w-[76px] sm:min-w-[84px]`, com padding `p-1`, tipografia ajustada (`text-[10px]` com line-clamp sutil) e conectores compactos (`w-3.5 h-3.5`), garantindo que até 4 cartas caibam com folga na largura mobile sem cortar o final da esteira.

---

## 2. Critérios de Sucesso
- [ ] Ícone de ramificação renderizado perfeitamente como SVG límpido sem texto `"account_tree"`.
- [ ] Seletor de múltiplas linhas exibido em linha própria abaixo do cabeçalho principal, sem sobrepor o título nem o badge de fase.
- [ ] Miniaturas calibradas para tamanho proporcional e elegante, exibindo as 4 fases com clareza e sem corte abrupto de nomes.
- [ ] A 4ª fase (`Kov, Rei do Vazio` no caso de Kov) fica totalmente visível e destacada como ativa.
- [ ] Zero erros de TypeScript (`tsc --noEmit`).

