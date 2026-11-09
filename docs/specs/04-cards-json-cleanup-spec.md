# Especificação Técnica: Saneamento e Limpeza do Dataset de Cartas (`cards.json`)

**Projeto:** Éther TCG - Card Preview  
**Status:** Proposto / Em Revisão  
**Versão:** 1.0.0  
**Data:** 2026-10-20  
**Arquivo Alvo:** [`src/cards.json`](file:///c:/Users/Hakawa/workspace/ether-preview/src/cards.json)  

---

## 1. Contexto e Motivação

O arquivo [`src/cards.json`](file:///c:/Users/Hakawa/workspace/ether-preview/src/cards.json) atual possui **494 cartas** e ocupa cerca de **1.35 MB (28.363 linhas)**. A análise estrutural revelou que cada registro carrega **35 campos**, muitos dos quais são metadados internos de auditoria de CMS/banco de dados (ex: e-mails de editores, IDs de criação, campos de erro e timestamps) que:
1. **Sobrecarregam o bundle inicial** do cliente web desnecessariamente (aumento do consumo de memória e tempo de parsing).
2. **Expõem dados sensíveis/pessoais** de editores (`created_by: "ketsumaru.lacerda@gmail.com"`).
3. **Poluem a tipagem TypeScript** com campos nulos ou irrelevantes para a experiência do usuário final.

O objetivo desta especificação é definir a limpeza de dados e padronização do schema da carta para o **Card Preview 3D**.

---

## 2. Diagnóstico Completo dos Campos

Foram identificadas 35 propriedades presentes nas 494 cartas do JSON original:

```
[Total de Propriedades no JSON Bruto: 35]
├── Informações de Jogo e UI: 15 propriedades
└── Metadados / Auditoria / CMS Interno: 20 propriedades
```

### 2.1. Propriedades Mantidas (Escopo do Preview)

Conforme os requisitos do Card Preview e dados de renderização visual:

| Campo | Tipo | Descrição e Propósito no Preview |
|---|---|---|
| `id` | `string` | Identificador único da carta para chaveamento React e rotas. |
| `name` | `string` | Nome da carta exibido no cabeçalho e na face frontal 3D. |
| `type` | `string` | Tipo/categoria da carta (Criatura, Magia, Feitiço, etc.). |
| `number` | `string` | Número de catálogo da carta (ex: "297", "188"). |
| `collection` | `string` | Nome da coleção (ex: "Eras Místicas", "Ascensão Cósmica"). |
| `revisao` | `string` | Status de aprovação editorial da carta (ex: "Finalizada"). |
| `description` | `string` | Descrição completa / lore / texto combinado. |
| `effect` | `string` | Texto das regras de efeito ativo da carta. |
| `special` | `string` | Habilidade especial da carta. |
| `synergy` | `string` | Sinergia com arquétipos ou classes aliadas no campo. |
| `turns` | `number \| null` | Duração de turnos para efeitos temporários. |
| `where_to_find` | `string` | Origem da carta (ex: "Booster Eras Místicas", "Lançamento Futuro"). |

> [!NOTE]
> **Campos de Mídia Essenciais para o 3D:**
> Para permitir a renderização da textura 3D da carta e exibição de thumbnails nos seletores/árvores evolutivas, os campos `image_url`, `img_url_webp` e `thumbnail` devem ser preservados (ou mapeados em um sub-objeto de assets).

---

### 2.2. Propriedades a Serem Removidas (Lixo / Auditoria / Redundâncias)

As seguintes propriedades serão expurgadas do arquivo:

| Propriedade Removida | Justificativa da Remoção |
|---|---|
| `created_by` | Exposição de PII (e-mails pessoais de autores/editores). |
| `created_by_id` | ID interno de usuário do CMS/Base44, sem utilidade no client. |
| `created_date` | Timestamp ISO de criação do registro no banco. |
| `updated_date` | Timestamp ISO de atualização no banco. |
| `lastUpdatedWhen` | Data redundante de atualização (formato YYYY-MM-DD). |
| `updatedField` | Log descritivo da última alteração feita por editores ("Carta nova", "Linha Evolutiva"). |
| `image_processing_error`| Campo de telemetria de processamento de imagem (`null` em quase todos os itens). |
| `is_sample` | Booleano legado de banco de dados (`false`). |
| `creation` | String vazia em quase todas as cartas. |
| `additional_info` | Campo textual vazio / legado. |
| `year` | Metadado redundante de publicação de lote. |
| `class` | Redundante com `type` ou já contido no texto descritivo. |
| `effect_data` | Campo nulo de integrações antigas. |
| `evolution_data` | Campo nulo de integrações antigas. |
| `evolution` | Instrução de evolução redundante (pode ser inferida ou mantida caso a árvore evolutiva a utilize). |
| `evolution_line` | Nome redundante da linha caso o sistema use IDs relacionais. |
| `power_life` | Atributo fora do escopo da Fase 1 do SDD (ou mantido apenas se necessário para stats). |
| `rarity` | Opcional: mantido caso os badges de raridade precisem do valor "Comum", "Rara", etc. |
| `illustrator` | Metadado de crédito visual (pode ser mantido se desejado em rodapés de carta). |

---

## 3. Estimativa de Redução de Payload

Com a remoção das propriedades irrelevantes e dados de auditoria:

| Métrica | Antes (Original) | Depois (Saneado) | Redução |
|---|---|---|---|
| **Tamanho do Arquivo** | ~1.35 MB | ~450 KB | **-67%** |
| **Linhas de Código** | 28.363 linhas | ~9.000 linhas | **-68%** |
| **Campos por Carta** | 35 campos | 12 a 15 campos | **-60%** |
| **Parsing JSON (CPU)** | ~18ms | ~5ms | **3.6x mais rápido** |

---

## 4. Novo Schema TypeScript Proposto (`src/types/card.ts`)

```typescript
export interface CardData {
  id: string
  name: string
  type: string
  number: string
  collection: string
  revisao: string
  description: string
  effect: string
  special: string
  synergy: string
  turns: number | null
  where_to_find: string

  // Texturas e Imagens (Necessárias para a renderização 3D)
  image_url: string
  img_url_webp: string
  thumbnail: string

  // Opcionais de UI (se requeridos para badges)
  rarity?: string
  level?: string
}
```

---

## 5. Estratégia de Execução

1. **Script de Migração Não Destrutivo**:
   - Criação de um utilitário em `scripts/clean-cards.mjs` que lê `src/cards.json`, filtra os campos solicitados e gera `src/cards.cleaned.json`.
2. **Validação de Integridade**:
   - Comparação dos 494 registros para garantir que nenhuma carta foi descartada ou corrompida.
3. **Substituição Segura**:
   - Backup do original para `src/cards.raw.json` (ou `.gitignore`) e sobrescrita de `src/cards.json` com o dataset otimizado.

---

## 6. Critérios de Aceitação (DoD)

- [ ] **CA-01 (Campos Mantidos)**: Todas as cartas contêm estritamente `name`, `description`, `effect`, `id`, `revisao`, `special`, `collection`, `synergy`, `where_to_find`, `number`, `type`, `turns`, além dos links de imagem necessários para a textura 3D.
- [ ] **CA-02 (Expurgo de PII e Auditoria)**: Nenhum registro contém `created_by`, `created_by_id`, `created_date`, `updated_date` ou `lastUpdatedWhen`.
- [ ] **CA-03 (Total de Cartas Intacto)**: O arquivo resultante preserva exatamente os 494 registros originais.
- [ ] **CA-04 (Economia de Espaço)**: O tamanho total do arquivo final é reduzido em pelo menos 60% em relação ao original de 1.35 MB.
- [ ] **CA-05 (Tipagem Estrita)**: Criada a interface TypeScript correspondente para consumo em toda a aplicação.
