"use strict";
/* Board: flat array, row by row. 0|1|2 / 3|4|5 / 6|7|8 */
const WIN_LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const POSITIONS=["top left","top centre","top right","middle left","centre","middle right","bottom left","bottom centre","bottom right"];
const NOTES={easy:"Random moves. A gentle first game.",medium:"Usually sensible, but it will occasionally miss something.",hard:"Perfect play. It will not make a mistake."};
const cells=[...document.querySelectorAll(".cell")];
const statusEl=document.getElementById("status"),statusMeta=document.getElementById("statusMeta"),turnDot=document.getElementById("turnDot"),historyEl=document.getElementById("historyList"),difficultyGroup=document.getElementById("difficultyGroup"),difficultyNote=document.getElementById("difficultyNote"),scoreOLabel=document.getElementById("scoreOLabel"),undoBtn=document.getElementById("undoBtn");
const scoreEls={X:document.getElementById("scoreX"),O:document.getElementById("scoreO"),ties:document.getElementById("scoreTies")};
let board,current,active,moves,lastResult;
let mode="ai",difficulty="hard",scores={X:0,O:0,ties:0},soundOn=true,audioCtx=null;
function audio(){if(!soundOn)return null;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==="suspended")audioCtx.resume();return audioCtx;}catch{return null;}}
function tone(from,to,seconds,{type="sine",delay=0,gain=0.15}={}){const ctx=audio();if(!ctx)return;const t=ctx.currentTime+delay,osc=ctx.createOscillator(),vol=ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(from,t);osc.frequency.exponentialRampToValueAtTime(Math.max(to,1),t+seconds);vol.gain.setValueAtTime(gain,t);vol.gain.exponentialRampToValueAtTime(0.001,t+seconds);osc.connect(vol).connect(ctx.destination);osc.start(t);osc.stop(t+seconds);}
const playMove=p=>tone(p==="X"?540:360,p==="X"?210:160,0.08);
const playWin=()=>[440,554.37,659.25].forEach((f,i)=>tone(f,f,0.16,{delay:i*0.09}));
const playDraw=()=>tone(280,190,0.28,{type:"triangle",gain:0.12});
function resultOf(b){for(const line of WIN_LINES){const[a,c,d]=line;if(b[a]&&b[a]===b[c]&&b[a]===b[d])return{winner:b[a],line};}return b.every(Boolean)?{winner:"draw",line:[]}:null;}
function emptySquares(b){return b.flatMap((v,i)=>(v?[]:[i]));}
function randomSquare(b){const e=emptySquares(b);return e[Math.floor(Math.random()*e.length)];}
function winningSquare(b,player){for(const i of emptySquares(b)){const next=b.slice();next[i]=player;if(resultOf(next)?.winner===player)return i;}return undefined;}
function minimax(b,computersTurn){const r=resultOf(b);if(r)return r.winner==="O"?1:r.winner==="X"?-1:0;let best=computersTurn?-Infinity:Infinity;for(const i of emptySquares(b)){b[i]=computersTurn?"O":"X";const score=minimax(b,!computersTurn);b[i]="";best=computersTurn?Math.max(best,score):Math.min(best,score);}return best;}
function bestSquare(){let bestScore=-Infinity,choice;for(const i of emptySquares(board)){board[i]="O";const score=minimax(board,false);board[i]="";if(score>bestScore){bestScore=score;choice=i;}}return choice;}
function sensibleSquare(){if(Math.random()<0.5)return randomSquare(board);return winningSquare(board,"O")??winningSquare(board,"X")??(board[4]===""?4:randomSquare(board));}
function computerMove(){if(!active)return;const i=difficulty==="easy"?randomSquare(board):difficulty==="medium"?sensibleSquare():bestSquare();if(i!==undefined)play(i);}
function setStatus(text,meta,dotClass){statusEl.textContent=text;statusMeta.textContent=meta;turnDot.className="dot"+(dotClass?" "+dotClass:"");}
function render(winLine=[]){cells.forEach((cell,i)=>{const v=board[i];cell.innerHTML=v?`<span class="glyph">${v}</span>`:"";cell.className="cell"+(v?" "+v.toLowerCase():"")+(winLine.includes(i)?" win":"");cell.disabled=!active||Boolean(v)||(mode==="ai"&&current==="O");cell.setAttribute("aria-label",`${POSITIONS[i]}, ${v||"empty"}`);});scoreEls.X.textContent=scores.X;scoreEls.O.textContent=scores.O;scoreEls.ties.textContent=scores.ties;scoreOLabel.textContent=mode==="ai"?"Computer (O)":"Player O";difficultyGroup.querySelector(".segmented").classList.toggle("is-disabled",mode!=="ai");difficultyNote.textContent=mode==="ai"?NOTES[difficulty]:"Difficulty applies against the computer.";undoBtn.disabled=moves.length===0;historyEl.innerHTML=moves.length?moves.map(m=>`<li>${m.player} — ${POSITIONS[m.index]}</li>`).join(""):`<li class="empty">No moves yet.</li>`;if(!active)return;if(mode==="ai"){if(current==="X")setStatus("Your turn","You are X","");else setStatus("Computer is thinking","Computer is O","o thinking");}else{setStatus(`${current} to move`,"Two players, one device",current==="O"?"o":"");}}
function finish(result){active=false;lastResult=result.winner;if(result.winner==="draw"){scores.ties+=1;render();setStatus("A draw","No winner this time","");playDraw();return;}scores[result.winner]+=1;render(result.line);setStatus(mode==="ai"?(result.winner==="X"?"You win":"Computer wins"):`${result.winner} wins`,"Start a new game to play again",result.winner==="O"?"o":"");playWin();}
function play(i){board[i]=current;moves.push({index:i,player:current});playMove(current);const result=resultOf(board);if(result){finish(result);return;}current=current==="X"?"O":"X";render();if(mode==="ai"&&current==="O")window.setTimeout(computerMove,420);}
function newGame(){board=Array(9).fill("");moves=[];current="X";active=true;lastResult=null;render();}
function selectGroup(selector,attr,value){document.querySelectorAll(selector).forEach(btn=>{const on=btn.dataset[attr]===value;btn.classList.toggle("is-active",on);btn.setAttribute("aria-pressed",String(on));});}
document.querySelectorAll("[data-mode]").forEach(btn=>btn.addEventListener("click",()=>{mode=btn.dataset.mode;selectGroup("[data-mode]","mode",mode);newGame();}));
document.querySelectorAll("[data-difficulty]").forEach(btn=>btn.addEventListener("click",()=>{difficulty=btn.dataset.difficulty;selectGroup("[data-difficulty]","difficulty",difficulty);newGame();}));
cells.forEach(cell=>cell.addEventListener("click",()=>{const i=Number(cell.dataset.index);if(active&&!board[i]&&!(mode==="ai"&&current!=="X"))play(i);}));
document.getElementById("restartBtn").addEventListener("click",newGame);
document.getElementById("resetScoreBtn").addEventListener("click",()=>{scores={X:0,O:0,ties:0};newGame();});
undoBtn.addEventListener("click",()=>{if(!moves.length)return;if(lastResult){if(lastResult==="draw")scores.ties-=1;else scores[lastResult]-=1;lastResult=null;}const count=mode==="ai"?Math.min(2,moves.length):1;for(let n=0;n<count;n+=1){const m=moves.pop();if(m)board[m.index]="";}current=mode==="ai"||!moves.length?"X":(moves[moves.length-1].player==="X"?"O":"X");active=true;render();});
const soundBtn=document.getElementById("soundBtn");
soundBtn.addEventListener("click",()=>{soundOn=!soundOn;soundBtn.textContent=soundOn?"Sound on":"Sound off";soundBtn.setAttribute("aria-pressed",String(soundOn));if(soundOn)playMove("X");});
const themeBtn=document.getElementById("themeBtn");
function applyTheme(dark){document.documentElement.classList.toggle("dark",dark);themeBtn.textContent=dark?"Light mode":"Dark mode";themeBtn.setAttribute("aria-pressed",String(dark));try{localStorage.setItem("tic-tac-toe-theme",dark?"dark":"light");}catch{}}
themeBtn.addEventListener("click",()=>applyTheme(!document.documentElement.classList.contains("dark")));
try{applyTheme(localStorage.getItem("tic-tac-toe-theme")==="dark");}catch{applyTheme(false);}
newGame();
