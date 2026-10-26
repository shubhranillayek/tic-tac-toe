# 🎮 Tic-Tac-Toe — Web Game

Modern, responsive, feature-rich browser Tic-Tac-Toe built from the PRD in [`PRD.md`](./PRD.md). Play it live via GitHub Pages (enable: **Settings → Pages → Deploy from branch → `main` / root**), then open `index.html` — no build step.

**Live / Repo:** https://github.com/shubhranillayek/tic-tac-toe

## ✨ Features
- **Player vs AI** and **Player vs Player (Local, pass-and-play)**
- **AI Difficulty:** Easy (random) · Medium (heuristic win/block + random blunders) · Hard (unbeatable **Minimax**, +1 AI / −1 human / 0 tie)
- Responsive 3×3 board, turn/status banner, winning-line highlight animation
- **Sound effects via Web Audio API** (no external files): click = sine drop, win = ascending arpeggio, tie = descending tone + Sound On/Off
- Score tracker (X / Ties / O), move history, **Undo** (Vs AI undoes player+AI), Restart & Reset Scores
- **Integrated PRD viewer** (View PRD button / modal, Esc to close), Dark/Light theme toggle
- Accessibility: semantic HTML, `aria-live` status, labelled cells, high contrast

## 🕹️ How to Play
Open `index.html` (or the GitHub Pages URL), choose Mode/Difficulty, click a cell. X goes first; in Vs AI you are X and the AI is O.

## 🛠️ Tech Stack
Vanilla HTML5 · CSS3 (Tailwind CSS via CDN + `style.css`) · Modern JavaScript ES6+ (`script.js`) · Zero frameworks / build tools

## 📁 Files
| File | Purpose |
|---|---|
| `index.html` | Layout, controls, board, PRD modal |
| `style.css` | Cells, win/pop animations, modal & prose |
| `script.js` | Game logic, Minimax/Medium/Easy AI, Web Audio, undo/theme |
| `PRD.md` | Full Product Requirements Document |

## 🚀 GitHub Pages Deployment
1. Push to `main` (already done). 2. Repo **Settings → Pages**. 3. Source: *Deploy from a branch*, Branch: `main`, Folder: `/ (root)`. 4. Visit `https://shubhranillayek.github.io/tic-tac-toe/`

## 🗺️ Roadmap v2.0
localStorage all-time scores · custom player names · online multiplayer via WebSockets (P2P)

## 📄 License
MIT
