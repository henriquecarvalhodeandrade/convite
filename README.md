# Convite Interativo 🤠

Um convite web interativo e animado, criado com React, para um evento sertanejo (Henrique & Juliano na Expo Agro). 

O projeto apresenta uma interface imersiva noturna com um céu estrelado animado, fogueira, e uma mecânica física onde o usuário precisa arrastar e soltar um "laço" para capturar a carta-convite no centro da tela. 

**🌟 Acesse a versão ao vivo aqui:**  
👉 [**henriquecarvalhodeandrade.github.io/convite/**](https://henriquecarvalhodeandrade.github.io/convite/)

---

## 🎨 Destaques do Projeto

- **Mecânica de Laço Interativa:** Um motor de física customizado (`useLasso.js`) usando animações via `requestAnimationFrame` que simula gravidade, tensão e atrito quando o usuário puxa o laço.
- **Gráficos em SVG:** Todo o cenário (montanhas, árvores, casa, fogueira) é desenhado vetorialmente via SVG, garantindo leveza e nitidez absoluta em qualquer tela, usando gradientes intrincados para simular a iluminação da lua e da fogueira.
- **Animações Fluidas:** Transições de tela orquestradas através do `framer-motion` (inclusive respeitando `prefers-reduced-motion` para acessibilidade).
- **Céu Estrelado:** Sistema de partículas utilizando `tsParticles` para gerar estrelas que cintilam e se movem lentamente pelo céu noturno.
- **PWA Ready:** O convite possui um `manifest.json` configurado, permitindo ser salvo na tela inicial do celular como um aplicativo nativo (`standalone`).
- **Otimização de Performance:** Uso estratégico de `React.memo` para evitar re-renderizações desnecessárias das camadas visuais de fundo enquanto o laço (a única parte mutável) roda a 60fps usando mutações diretas no DOM (bypass do React state na física).

## 🛠️ Tecnologias Utilizadas

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/) (Animações de UI)
- [tsParticles](https://particles.js.org/) (Partículas do céu)
- Vanilla CSS + SVGs inline
- ESLint (Linting rigoroso e regras de React Hooks)

## 🚀 Como rodar localmente

Se você quiser clonar e rodar na sua máquina:

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse `http://localhost:5173/convite/` no seu navegador.

Para compilar para produção:
```bash
npm run build
```

## 📦 Deploy

O deploy é feito automaticamente para o GitHub Pages através do pacote `gh-pages`. Para publicar uma nova versão, basta rodar:

```bash
npm run deploy
```
