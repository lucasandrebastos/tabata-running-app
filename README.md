# 🏃‍♂️ Running Zones Timer

Um app mobile para **treinos de corrida intervalados por zonas de esforço**, inspirado em timers Tabata, mas adaptado para a lógica real de corrida.

O app permite criar treinos personalizados (aquecimento, intervalos e desaquecimento) e executá-los com **alertas sonoros e por voz no fone**, indicando exatamente quando correr forte ou reduzir o ritmo.

> Ideal para quem treina por zonas (Z1, Z2, Z3…) e quer foco total na corrida, sem precisar olhar o celular.

---

## ✨ Funcionalidades

- ⏱️ Timer intervalado inteligente
- 🧩 Treinos customizáveis por blocos
- 🔁 Suporte a rounds (ex: 14x 1min forte / 1min leve)
- 🎧 Alertas sonoros e por voz (Text-to-Speech)
- 🌗 Dark mode (foco outdoor)
- 📱 Funciona com tela bloqueada
- 💾 Salvamento local de treinos
- 🧠 Interface minimalista e legível durante a corrida

---

## 🏗️ Arquitetura

O app foi projetado com **separação clara de responsabilidades**, facilitando manutenção e evolução.

src/
├── screens/ # Telas do app
├── components/ # Componentes reutilizáveis
├── domain/ # Regras de negócio (Workout, Timer)
│ ├── models/
│ ├── parser/
│ └── timer/
├── state/ # Contexts e controllers
├── services/ # Áudio, TTS, background tasks
├── storage/ # Persistência local
└── utils/

yaml
Copiar código

- **UI Layer** → React Native
- **Domain Layer** → Lógica pura (agnóstica de UI)
- **Services** → Expo APIs (áudio, speech, background)
- **State** → Context + Hooks

---

## 🧠 Conceito de Treino

Exemplo de treino suportado:

- Aquecimento: 5 min — Zona 1
- Intervalado:
  - 14 rounds
  - 1 min — Zona 3
  - 1 min — Zona 1
- Desaquecimento: 5 min — Zona 1

O app converte essa estrutura em uma **fila linear de etapas**, executadas automaticamente com avisos no fone.

---

## 🛠️ Stack Tecnológica

- **React Native**
- **Expo (Managed Workflow)**
- **TypeScript**
- **Expo AV** (áudio)
- **Expo Speech** (voz)
- **AsyncStorage** (persistência local)

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js (LTS)
- Expo CLI
- Emulador ou celular físico

### Instalação

```bash
git clone https://github.com/seu-usuario/running-zones-timer.git
cd running-zones-timer
npm install
Rodando o app
bash
Copiar código
npx expo start
Depois:

a → Android

i → iOS

Ou escaneie o QR Code com o Expo Go

🗺️ Roadmap
 MVP do timer funcional

 Persistência de treinos

 Histórico de treinos

 Integração com frequência cardíaca

 Integração com smartwatch

 Exportar / compartilhar treinos

🧩 Metodologia
O desenvolvimento segue um modelo Scrumban, com:

Backlog organizado por épicos

Board Kanban no Notion

Tarefas pequenas e iterativas

📄 Licença
Este projeto está sob a licença MIT.
Sinta-se livre para usar, modificar e contribuir.

👤 Autor
Lucas Bastos
Desenvolvedor Fullstack • Produtor Musical • DJ
São Paulo — Brasil
```
