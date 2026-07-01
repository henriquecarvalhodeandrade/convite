# convite 🤠

Convite interativo em formato de jogo de laço. O usuário laça um envelope com chapéu de caubói, aperta o laço três vezes e um ingresso de rodeio é revelado com confetti.

> **Evento:** Henrique & Juliano na Expo Agro — 17/07 às 19h, Jacareí/SP

## Stack

- React 18 + Vite
- GSAP (animações SVG)
- Framer Motion (transições de tela)
- tsParticles (estrelas do céu)
- canvas-confetti (revelação do ingresso)

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173/convite/` no navegador.

## Deploy (GitHub Pages)

```bash
npm run deploy
```

O comando faz o build e publica o branch `gh-pages` automaticamente via [`gh-pages`](https://github.com/tschaub/gh-pages).

## Fluxo do jogo

1. **Idle** — arraste o dedo/mouse para começar a mirar
2. **Aiming** — solte sobre o envelope para laçar (HIT_RADIUS = 88px SVG)
3. **Caught** — aperte o botão 3× para apertar o laço
4. **Reveal** — o ingresso é revelado com confetti 🎉
