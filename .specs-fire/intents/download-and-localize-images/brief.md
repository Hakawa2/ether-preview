# Intent Brief: Download e Localização de Imagens do Card Dataset

**ID:** `download-and-localize-images`  
**Status:** In Progress  
**Data:** 2026-11-09  

---

## 1. Visão Geral
Construir um pipeline de scripts em Node.js para baixar todas as imagens das cartas do `src/cards.raw.json` para o diretório local `public/cards/`, permitindo que o app sirva as artes estaticamente e nunca mais dependa de requisições externas para as APIs de terceiros.

---

## 2. Work Items Decompostos
1. **WI-12 (Autopilot):** Criação do script de download concorrente seguro `scripts/download-images.mjs` com controle de lotes, retry e idempotência.
2. **WI-13 (Autopilot):** Criação do script de atualização do dataset `scripts/localize-card-paths.mjs` para apontar `cards.json` para `/cards/...`.
3. **WI-14 (Confirm):** Execução do download (ou execução de lote inicial para validação) e testes no app.

