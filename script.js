"use strict";
const WIN_LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const cells=[...document.querySelectorAll(".cell")];
const statusEl=document.getElementById("status"), historyEl=document.getElementById("historyList");
const scoreEls={X:document.getElementById("scoreX"),O:document.getElementById("scoreO"),ties:document.getElementById("scoreTies")};
const modeEl=document.getElementById("gameMode"), diffEl=document.getElementById("difficulty"), undoBtn=document.getElementById("undoBtn");
let board=Array(9).fill(""), currentPlayer="X", gameActive=true, history=[], scores={X:0,O:0,ties:0}, lastResult=null, soundOn=true, audioCtx=null;
function ensureAudio(){ if(!soundOn) return null; try{ audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==="suspended") audioCtx.resume(); return audioCtx; }catch{ return null; } }
function tone(f0,f1,duration=.12,type="sine",delay=0,vol=.18){ const ctx=ensureAudio(); if(!ctx) return; const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain(); o.type=type; o.frequency.setValueAtTime(f0,t); o.frequency.exponentialRampToValueAtTime(Math.max(f1,1),t+duration); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+duration); o.connect(g).connect(ctx.destination); o.start(t); o.stop(t+duration); }
const playClick=p=>tone(p==="X"?620:420,p==="X"?220:170,.09,"sine",0,.2);
const playWin=()=>[523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,f,.18,"sine",i*.11,.2));
const playTie=()=>tone(320,140,.35,"triangle",0,.18);
function winnerOf(b){ for(const line of WIN_LINES){ const [a,c,d]=line; if(b[a]&&b[a]===b[c]&&b[a]===b[d]) return {winner:b[a],line}; } return b.every(Boolean)?{winner:"tie",line:[]}:null; }
function render(winLine=[]){ cells.forEach((cell,i)=>{ cell.innerHTML=board[i]?`<span>${board[i]}</span>`:""; cell.className=`cell ${board[i]?board[i].toLowerCase():""} ${winLine.includes(i)?"win":""}`; cell.disabled=!gameActive||!!board[i]||(modeEl.value==="ai"&&currentPlayer==="O"); cell.setAttribute("aria-label",`Cell ${i+1}, ${board[i]||"empty"}`); }); scoreEls.X.textContent=scores.X; scoreEls.O.textContent=scores.O; scoreEls.ties.textContent=scores.ties; diffEl.disabled=modeEl.value!=="ai"; undoBtn.disabled=!history.length; historyEl.innerHTML=history.length?history.map((h,i)=>`<li>Move ${i+1}: ${h.player} → cell ${h.index+1}</li>`).join(""):"<li>No moves yet</li>"; if(gameActive) statusEl.textContent=modeEl.value==="ai"?(currentPlayer==="X"?"X's Turn!":"AI (O) is thinking…"):`${currentPlayer}'s Turn!`; }
function finish(result){ gameActive=false; lastResult=result.winner; if(result.winner==="tie"){ scores.ties++; statusEl.textContent="It's a Draw!"; playTie(); render([]); } else { scores[result.winner]++; statusEl.textContent=modeEl.value==="ai"?(result.winner==="X"?"🎉 X Wins! You beat the AI!":"🤖 O Wins! AI takes this round."):`🎉 ${result.winner} Wins!`; playWin(); render(result.line); } }
function makeMove(index,player){ board[index]=player; history.push({index,player}); playClick(player); const r=winnerOf(board); if(r) finish(r); else { currentPlayer=player==="X"?"O":"X"; render(); if(modeEl.value==="ai"&&currentPlayer==="O"&&gameActive) setTimeout(aiMove,350); } }
function randomMove(b){ const e=b.map((v,i)=>v?null:i).filter(v=>v!==null); return e[Math.floor(Math.random()*e.length)]; }
function findWinningMove(b,player){ for(const i of b.map((v,i)=>v?null:i).filter(v=>v!==null)){ const t=[...b]; t[i]=player; if(winnerOf(t)?.winner===player) return i; } return undefined; }
function minimax(b,isMax){ const r=winnerOf(b); if(r) return r.winner==="O"?1:r.winner==="X"?-1:0; let best=isMax?-Infinity:Infinity; b.forEach((v,i)=>{ if(!v){ b[i]=isMax?"O":"X"; const s=minimax(b,!isMax); b[i]=""; best=isMax?Math.max(best,s):Math.min(best,s); } }); return best; }
function bestMove(){ let bestScore=-Infinity,move; board.forEach((v,i)=>{ if(!v){ board[i]="O"; const s=minimax(board,false); board[i]=""; if(s>bestScore){bestScore=s;move=i;} } }); return move; }
function mediumMove(){ if(Math.random()<0.5){ return findWinningMove(board,"O") ?? findWinningMove(board,"X") ?? (board[4]===""?4:randomMove(board)); } return randomMove(board); }
function aiMove(){ if(!gameActive) return; const d=diffEl.value; const move=d==="easy"?randomMove(board):d==="medium"?mediumMove():bestMove(); if(move!==undefined) makeMove(move,"O"); }
function restart(){ board=Array(9).fill(""); currentPlayer="X"; gameActive=true; history=[]; lastResult=null; render(); }
cells.forEach(cell=>cell.addEventListener("click",()=>{ const i=Number(cell.dataset.index); if(!gameActive||board[i]) return; if(modeEl.value==="ai"&&currentPlayer!=="X") return; makeMove(i,currentPlayer); }));
document.getElementById("restartBtn").addEventListener("click",restart);
document.getElementById("resetScoreBtn").addEventListener("click",()=>{ scores={X:0,O:0,ties:0}; restart(); });
modeEl.addEventListener("change",restart); diffEl.addEventListener("change",restart);
undoBtn.addEventListener("click",()=>{ if(!history.length) return; if(lastResult){ if(lastResult==="tie")scores.ties--; else scores[lastResult]--; lastResult=null; } const steps=modeEl.value==="ai"?Math.min(2,history.length):1; for(let s=0;s<steps;s++){ const last=history.pop(); if(last) board[last.index]=""; } currentPlayer="X"; if(modeEl.value!=="ai"&&history.length) currentPlayer=history[history.length-1].player==="X"?"O":"X"; gameActive=true; render(); });
const modal=document.getElementById("prdModal");
document.getElementById("prdBtn").addEventListener("click",()=>{ modal.classList.remove("hidden"); modal.classList.add("flex"); });
const closePrd=()=>{ modal.classList.add("hidden"); modal.classList.remove("flex"); };
document.getElementById("closePrdBtn").addEventListener("click",closePrd);
modal.addEventListener("click",e=>{ if(e.target===modal) closePrd(); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closePrd(); });
document.getElementById("themeBtn").addEventListener("click",e=>{ const dark=document.documentElement.classList.toggle("dark"); e.currentTarget.setAttribute("aria-pressed",String(dark)); try{localStorage.setItem("ttt-theme",dark?"dark":"light");}catch{} });
try{ if(localStorage.getItem("ttt-theme")==="dark") document.documentElement.classList.add("dark"); }catch{}
document.getElementById("soundBtn").addEventListener("click",e=>{ soundOn=!soundOn; e.currentTarget.textContent=`Sound: ${soundOn?"On":"Off"}`; e.currentTarget.setAttribute("aria-pressed",String(soundOn)); if(soundOn) playClick("X"); });
render();
