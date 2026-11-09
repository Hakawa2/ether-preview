# Especificação de Requisitos do Produto (SDD - Fase 1)

**Projeto:** Éther TCG - Card Preview  
**Status:** Em Revisão (Aguardando Aprovação)  
**Versão:** 1.0.0  

---

## 1. Visão Geral e Propósito
O objetivo desta aplicação é servir como laboratório experimental para **Spec-Driven Development (SDD)** e desenvolvimento guiado por agentes autônomos. A entrega consiste em um visualizador 3D interativo de uma carta do **Éther TCG**.

---

## 2. Escopo Funcional

### 2.1. Experiência Visual e Interatividade
- **Viewport 3D**: Renderização da carta em espaço tridimensional utilizando React Three Fiber (R3F) e Three.js.
- **Interação**:
  - Capacidade de interagir com a carta no espaço 3D (rotação/inspeção via ponteiro/mouse, efeito tilt de inclinação ou flip entre frente e verso).
  - Iluminação que valorize a visualização 3D e o acabamento da carta.
- **Verso e Frente**: A carta deve possuir faces distintas para a frente (ilustração e dados) e o verso (cardback característico).

### 2.2. Anatomia Informativa da Carta
Conforme requisitos coletados, a carta deve conter os seguintes elementos informativos básicos:
1. **Nome da carta** (título/identificador da carta).
2. **Tipo / Categoria** (ex.: Criatura, Feitiço, Relíquia, etc.).
3. **Custo / Recurso** (valor numérico ou símbolo do recurso necessário para jogar).
4. **Arte / Ilustração da Carta**:
   - Imagem ou textura representativa na frente.
   - Design ou textura para o verso da carta.

*(Nota: atributos numéricos adicionais como ataque/defesa ou textos complexos de regras ficam expressamente fora do escopo inicial deste experimento até nova instrução).*

### 2.3. Fonte de Dados
- **Mock Estático**: Os dados da carta serão carregados a partir de uma estrutura TypeScript/JSON local estática no próprio repositório, garantindo previsibilidade, simplicidade e facilidade de teste sem dependência de serviços externos.

---

## 3. Critérios de Aceitação (DoD - Definition of Done)

- [ ] **CA-01**: A carta é renderizada em um canvas 3D ocupando a área de visualização.
- [ ] **CA-02**: A face frontal exibe claramente o Nome, Tipo/Categoria, Custo e Ilustração.
- [ ] **CA-03**: A face traseira exibe o verso da carta (cardback).
- [ ] **CA-04**: O usuário consegue rotacionar ou inclinar a carta interativamente com o ponteiro para inspecionar ambas as faces e profundidade.
- [ ] **CA-05**: Os dados são consumidos a partir de um mock estático tipado em TypeScript, sem chamadas externas.

---

## 4. O que NÃO está no escopo (Out of Scope)
- Regras de combate, fases de turno ou simulação de partida do Éther TCG.
- Conexão com banco de dados ou APIs backend.
- Construtor/editor dinâmico de cartas (nesta primeira fase).
