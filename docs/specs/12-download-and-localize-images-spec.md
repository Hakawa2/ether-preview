# Especificação Técnica: Script de Download e Localização de Imagens do Éther TCG

**Projeto:** Éther TCG - Card Preview  
**Status:** Proposto / Pronto para Decomposição FIRE  
**Versão:** 1.0.0  
**Data:** 2026-11-09  
**Motivação:** Como projeto educacional e de estudo de boas práticas de IA, não sobrecarregar as APIs e CDNs de terceiros (base44.app / Supabase) com requisições repetidas em runtime.

---

## 1. Visão Geral e Objetivos

Atualmente, o dataset (`src/cards.json` e `src/cards.raw.json`) faz referência direta a **1.475 imagens únicas** hospedadas em domínios externos:
- `base44.app`
- `qtrypzzcjebvfcihiynt.supabase.co`
- `ethertcgoficial.vercel.app`

### Metas:
1. **Criar um script resiliente e ético de download (`scripts/download-images.mjs`)**:
   - Baixar em lote as artes completas (`img_url_webp` / `image_url`) e as miniaturas (`thumbnail`).
   - Salvar os arquivos em `public/cards/` estruturados de forma padronizada:
     - `public/cards/images/{id}.webp` (ou extensão correspondente).
     - `public/cards/thumbnails/{id}.webp`.
2. **Políticas de Resiliência e Concorrência**:
   - Concorrência controlada (ex: `concurrency: 5`) com delay entre lotes para não disparar proteções de rate-limit nem onerar a infraestrutura da API do jogo.
   - Pular arquivos que já foram baixados (idempotência: permite pausar e retomar a qualquer momento).
   - Retry automático (3 tentativas) com fallback gracioso em caso de timeout de rede.
3. **Atualização do Dataset (`cards.json`)**:
   - Opção para apontar os caminhos das imagens para arquivos locais estáticos (`/cards/images/{id}.webp` e `/cards/thumbnails/{id}.webp`).
   - Manter fallback transparente: se o arquivo local não existir, manter a URL remota.
4. **Git e Armazenamento**:
   - Adicionar diretrizes sobre se as imagens locais devem ser versionadas no git ou mantidas via cache/LFS ou script de setup.

---

## 2. Estrutura de Diretórios de Destino

```
public/
├── cards/
│   ├── images/       # 494 artes completas (alta resolução)
│   │   ├── {id}.webp
│   │   └── ...
│   └── thumbnails/   # 494 miniaturas para a sequência e o seletor
│       ├── {id}.webp
│       └── ...
```

---

## 3. Especificação do Script (`scripts/download-images.mjs`)

### 3.1. Algoritmo
1. Lê `src/cards.raw.json` (494 cartas).
2. Garante a existência das pastas `public/cards/images` e `public/cards/thumbnails`.
3. Para cada carta:
   - Se `c.img_url_webp` ou `c.image_url` existir:
     - Nome local: `{id}.webp` (ou extensão extraída da URL).
     - Verifica se `fs.existsSync(...)`. Se sim, pula (`[SKIP]`).
     - Se não, adiciona na fila de download com prioridade para `webp`.
   - Se `c.thumbnail` existir:
     - Nome local: `{id}_thumb.webp`.
     - Verifica existência antes de baixar.
4. Executa fila com pool assíncrono (ex: `p-limit` simplificado ou loop de lotes `p-all` de 5 downloads simultâneos).
5. Gera log de progresso: `[142/494] Baixando: Gata das Poesias...`.
6. Gera relatório final com total de imagens baixadas, puladas e eventuais falhas.

### 3.2. Script Complementar (`scripts/localize-card-paths.mjs`)
- Atualiza `src/cards.json` trocando as URLs remotas pelas rotas relativas `/cards/images/...` para as imagens existentes no disco.

---

## 4. Critérios de Aceitação (DoD)
- [ ] Script `scripts/download-images.mjs` funcional e testado com flags de lotes (`--limit`, `--concurrency`).
- [ ] Download idempotente (não rebaixa o que já está salvo).
- [ ] Taxa de requisição amigável sem sobrecarga na API de origem.
- [ ] O app funciona em modo offline/local servindo as imagens diretamente de `public/cards/`.

