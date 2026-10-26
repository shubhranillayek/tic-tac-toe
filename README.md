# Tic-Tac-Toe

A small tic-tac-toe game that runs entirely in the browser. Play against the computer at three difficulty levels, or with a second player on the same device. There is no build step and there are no dependencies — the game is three plain files.

**Play it:** https://shubhranillayek.github.io/tic-tac-toe/

## Features

- Two modes: against the computer, or two players sharing one device
- Three difficulty levels, from random moves to perfect play
- Score kept for the session, with a record of every move played
- Undo — against the computer this takes back your move and its reply
- Sound effects generated with the Web Audio API; nothing to download
- Light and dark themes, and a layout that works on a phone or a desktop

## How to play

You are X and you move first. Choose an empty square; three in a row — across, down, or diagonally — wins. In two-player mode the same device is passed between X and O.

| Difficulty | How it plays |
| --- | --- |
| Easy | Chooses a square at random. |
| Medium | Takes a win and blocks a loss when it sees one, but plays at random often enough to make mistakes. |
| Hard | Searches every remaining line of play with minimax and picks the best square. It cannot be beaten; a draw is the best result available. |

## Running locally

Clone the repository and open the page. No install step is required.

```sh
git clone https://github.com/shubhranillayek/tic-tac-toe.git
cd tic-tac-toe
open index.html
```

If you prefer serving it over HTTP:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

The site is static, so any static host will do. On GitHub Pages it is served from the `main` branch at the repository root (**Settings → Pages → Deploy from a branch → `main` / `/ (root)`**).

## Project structure

```
.
├── index.html   Page structure: header, controls, scoreboard, board
├── style.css    All styling, including the dark theme
├── script.js    Game rules, computer player, sound and theme handling
└── LICENSE
```

## Implementation notes

Game state is a single array of nine squares. After each move the eight winning lines are checked; if none is complete and no squares remain, the game is a draw.

The Hard computer player evaluates the rest of the game with minimax: a computer win scores +1, a human win −1, and a draw 0. It maximises on its own turns and assumes the other player minimises on theirs, then takes the square with the highest score. The search is small enough to run instantly without pruning.

Sounds are short oscillator tones created with the Web Audio API when a move is made, so the game needs no audio assets and nothing can fail to load.

Scores are kept in memory for the session only. Refreshing the page starts the scoreboard again.

## Browser support

Any current version of Chrome, Firefox, Safari, or Edge. JavaScript must be enabled.

## Licence

Released under the [MIT Licence](LICENSE).
