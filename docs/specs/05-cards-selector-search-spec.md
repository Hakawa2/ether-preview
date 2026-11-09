# Especificação Técnica: Consumo do Dataset de Cartas e Seletor com Busca Difusa (Insensível a Maiúsculas e Acentos)

**Projeto:** Éther TCG - Card Preview  
**Status:** Proposto / Em Revisão  
**Versão:** 1.0.0  
**Data:** 2026-10-20  
**Arquivos de Referência:**
- [`src/cards.json`](file:///c:/Users/Hakawa/workspace/ether-preview/src/cards.json)
- [`src/types/card.ts`](file:///c:/Users/Hakawa/workspace/ether-preview/src/types/card.ts)
- [`src/components/inspector/CardStageSelector.tsx`](file:///c:/Users/Hakawa/workspace/ether-preview/src/components/inspector/CardStageSelector.tsx)

---

## 1. Visão Geral e Propósito

Esta especificação define a integração do catálogo completo de cartas (`src/cards.json` com suas 494 cartas saneadas) no componente de seleção e inspeção de cartas da interface do **Card Preview**. 

O seletor atual (baseado em um mock estático de apenas 2 cartas) deve evoluir para um **Command/Combobox Dropdown** de alta performance com campo de busca integrado, tolerante a:
1. **Case-insensitive**: Ignora diferenças entre maiúsculas e minúsculas (`dragão` == `DRAGÃO`).
2. **Accent-insensitive / Diacritics-insensitive**: Remove marcas diacríticas e acentos (`criança` == `crianca`, `dragão` == `dragao`, `éther` == `ether`, `flamejante` == `FLAMEJANTE`).

---

## 2. Requisitos Funcionais

### 2.1. Consumo do Dataset
- A aplicação deve importar diretamente o arquivo `src/cards.json` ou expor um hook/utilitário `useCards()` para fornecer a lista completa das 494 cartas tipadas com a interface `CardData`.
- Deve existir uma carta inicial selecionada por padrão (ex: *Guardião Flamejante* ou a primeira carta da lista com arte válida).

### 2.2. Campo de Entrada de Busca (Search Input)
- Ao abrir o dropdown do seletor de cartas, o topo da lista deve conter um campo de input com:
  - Ícone de lupa (`Search` de `lucide-react`).
  - Placeholder contextual: `"Buscar carta por nome..."`.
  - Botão de limpar busca (`X`) quando houver texto digitado.
  - Autofoco ou facilidade de digitação sem perder o estado de abertura do dropdown.

### 2.3. Algoritmo de Normalização de Texto (Tolerância a Acentos e Caixa)
A filtragem deve utilizar uma função pura de normalização baseada em decomposição canônica Unicode (`NFD`) combinada com remoção de diacríticos por regex:

```typescript
/**
 * Normaliza uma string removendo diacríticos (acentos) e convertendo para minúsculas.
 * Exemplo: "Criança Cósmica" -> "crianca cosmica"
 */
export function normalizeSearchTerm(term: string): string {
  return term
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
```

#### Regras de Equivalência:
- Entrada `"crianca"` encontra `"Criança Cósmica"`.
- Entrada `"CRIAÇÃO"` encontra `"Criacao de Eter"`.
- Entrada `"dragao"` encontra `"Dragão Guardião"`.
- Entrada `"protetora"` encontra `"Protetora de Kaim"`.

### 2.4. Performance e Lista de 494 Cartas
- **Virtualização / Limitação de Renderização**: Como o dataset possui 494 itens, renderizar todos de uma só vez no DOM pode causar gargalos. O dropdown deve implementar:
  - Scroll infinito / paginação visual (ex: renderizar os primeiros 50 itens encontrados e carregar mais conforme a rolagem).
  - Altura máxima com barra de rolagem estilizada (`max-h-72 overflow-y-auto`).
  - Feedback visual de "Nenhuma carta encontrada" caso a pesquisa não retorne resultados.
  - Contador sutil de resultados encontrados (ex: `Exibindo 12 de 494 cartas`).

### 2.5. Seleção e Atualização da Cena 3D
Ao selecionar uma carta no dropdown:
1. O estado `selectedCard` é atualizado no `App.tsx`.
2. O botão trigger do seletor passa a exibir o nome da nova carta, número, tipo e coleção.
3. A textura da face frontal da carta 3D é atualizada para `card.img_url_webp` ou `card.image_url`.
4. As pílulas de status (`CardPillsBar`) passam a refletir o tipo, número e coleção da carta selecionada.

---

## 3. Arquitetura de Componentes

```
src/
├── lib/
│   └── search.ts                <-- Função pura normalizeSearchTerm() e filterCards()
├── hooks/
│   └── useCardsCatalog.ts       <-- Hook para carregamento, busca e seleção de cartas
├── components/
│   └── inspector/
│       ├── CardStageSelector.tsx <-- Evoluído com Input de busca e scroll otimizado
│       └── CardSearchItem.tsx    <-- Item individual com thumbnail e metadados
```

---

## 4. Estrutura do Novo Componente `CardStageSelector`

```tsx
// Exemplo conceitual da estrutura JSX
<div className="relative w-full">
  {/* Trigger Button com Nome da Carta Ativa */}
  <button onClick={toggleOpen}>
    <span>{currentCard.name} — #{currentCard.number}</span>
    <ChevronDown />
  </button>

  {/* Dropdown com Campo de Busca */}
  {isOpen && (
    <div className="absolute top-full left-0 right-0 mt-1.5 p-2 rounded-xl bg-surface-container-highest/95 backdrop-blur-2xl border border-border shadow-2xl z-50">
      {/* Search Input Box */}
      <div className="relative mb-2">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar carta por nome (ex: crianca, dragao)..."
          className="w-full pl-9 pr-8 py-2 rounded-lg bg-surface-container/80 text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-secondary text-xs"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5">
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Resultados da Busca */}
      <div className="max-h-72 overflow-y-auto space-y-1">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <CardOptionRow key={card.id} card={card} onSelect={handleSelect} />
          ))
        ) : (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Nenhuma carta encontrada para "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  )}
</div>
```

---

## 5. Critérios de Aceitação (DoD - Definition of Done)

- [ ] **CA-01 (Consumo do Dataset)**: O seletor consome dinamicamente as cartas de `src/cards.json` com tipagem TypeScript de `CardData`.
- [ ] **CA-02 (Input de Busca)**: O dropdown possui campo de input dedicado no topo com ícone de pesquisa e botão de limpar.
- [ ] **CA-03 (Tolerância a Acentos e Caixa)**:
  - Digitar `"crianca"` localiza cartas que contenham `"Criança"`.
  - Digitar `"DRAGAO"` localiza cartas que contenham `"dragão"`.
  - Digitar `"mago"` localiza `"Mago"`, `"mágico"`, etc.
- [ ] **CA-04 (Performance com 494 itens)**: A digitação no input responde instantaneamente sem travamento de UI ou lag na digitação.
- [ ] **CA-05 (Conexão com a Cena 3D)**: Ao clicar em uma carta da lista filtrada, a carta ativa é atualizada e a nova textura é transmitida para o componente 3D.
- [ ] **CA-06 (Estado Vazio)**: Mensagem amigável informando que não foram encontrados resultados para termos sem correspondência.
- [ ] **CA-07 (Acessibilidade)**: Navegação por teclado básica (ESC fecha o dropdown, Enter ou clique seleciona a carta).

---

## 6. Próximos Passos
1. Validar e aprovar esta especificação.
2. Implementar `src/lib/search.ts` com testes/validação da normalização diacrítica.
3. Atualizar `src/components/inspector/CardStageSelector.tsx` com o input de busca e renderização dos dados reais.
4. Conectar a seleção da carta ao `App.tsx` e à textura 3D da carta.
