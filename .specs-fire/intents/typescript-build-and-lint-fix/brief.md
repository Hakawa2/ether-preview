# Intent Brief: Correção Definitiva de Erros de Build e Tipagem (tsc -b)

**ID:** `typescript-build-and-lint-fix`  
**Status:** In Progress  
**Data:** 2026-11-09  

---

## 1. Visão Geral
Resolver a falha catastrófica de 88 erros de tipagem desencadeada por um erro de import em `src/lib/catalog.ts`, garantindo que o comando de build `tsc -b` e o linter `oxlint` passem com 100% de sucesso para o deploy contínuo.

---

## 2. Work Items Planejados
1. **WI-08 (Autopilot):** Corrigir import de `CardData` em `src/lib/catalog.ts` (`../types/card`).
2. **WI-09 (Autopilot):** Remover import obsoleto `ChevronDown` em `CardSequenceViewer.tsx`.
3. **WI-10 (Autopilot):** Ajustar mutação de `texture.colorSpace` em `src/components/card/index.tsx`.
4. **WI-11 (Autopilot):** Validar execução completa de `tsc -b` e `oxlint`.

