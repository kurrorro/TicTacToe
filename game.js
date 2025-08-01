const params = new URLSearchParams(window.location.search);
const player1 = params.get('player1') || 'Player X';
const player2 = params.get('player2') || 'Player O';

document.getElementById('playerNames').innerHTML = `
  <span id="nameX">${player1} (X)</span> vs
  <span id="nameO">${player2} (O)</span>
`;

const board = document.getElementById('board');
const gameOverDialog = document.getElementById('gameOverDialog');
const resultText = document.getElementById('resultText');
const continueBtn = document.getElementById('continueBtn');
const exitBtn = document.getElementById('exitBtn');
const finalResultDialog = document.getElementById('finalResultDialog');
const finalText = document.getElementById('finalText');

let cells = Array(9).fill(null);
let turn = 'X';
let score = {
  X: parseInt(localStorage.getItem('scoreX')) || 0,
  O: parseInt(localStorage.getItem('scoreO')) || 0,
};

function renderBoard(highlight = []) {
  updateTurnHighlight();
  board.innerHTML = '';
  cells.forEach((value, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    if (highlight.includes(i)) {
      cell.classList.add('win');
    }
    cell.textContent = value || '';
    cell.tabIndex = 0;
    cell.onclick = () => handleClick(i);
    board.appendChild(cell);
  });
  updateScore();
}

function handleClick(i) {
  if (cells[i] || checkWinner()) return;
  cells[i] = turn;

  const result = checkWinner();
  renderBoard(result?.winningIndices || []);

  if (result) {
    const winner = result.winner === 'X' ? player1 : player2;
    score[result.winner]++;
    showGameOverDialog(`${winner} wins this round!`);
  } else if (!cells.includes(null)) {
    showGameOverDialog("It's a draw!");
  } else {
    turn = turn === 'X' ? 'O' : 'X';     // ✅ ubah turn dulu
    updateTurnHighlight();               // ✅ lalu update highlight
  }
}


function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of winPatterns) {
    if (cells[a] && cells[a] === cells[b] && cells[b] === cells[c]) {
      return { winner: cells[a], winningIndices: [a, b, c] };
    }
  }
  return null;
}

resetBtn.onclick = () => {
  cells = Array(9).fill(null);
  turn = 'X';
  renderBoard();
};

continueBtn.onclick = () => {
  cells = Array(9).fill(null);
  turn = 'X';
  gameOverDialog.close();
  renderBoard();
};

exitBtn.onclick = () => {
  const winner =
    score.X > score.O ? `${player1} wins!` :
    score.O > score.X ? `${player2} wins!` : 'Draw!';
  finalText.textContent = `${winner} (Score: X=${score.X}, O=${score.O})`;
  finalResultDialog.showModal();
  localStorage.clear();
};

function updateScore() {
  document.getElementById('scoreX').textContent = `X: ${score.X}`;
  document.getElementById('scoreO').textContent = `O: ${score.O}`;
}

function updateTurnHighlight() {
  const nameX = document.getElementById("nameX");
  const nameO = document.getElementById("nameO");

  nameX.classList.toggle("active", turn === "X");
  nameO.classList.toggle("active", turn === "O");

  console.log("Highlighting:", turn);
  console.log("X active?", nameX.classList.contains("active"));
  console.log("O active?", nameO.classList.contains("active"));
}

function highlightWinningCells(indices) {
  const cellElements = document.querySelectorAll('.cell');
  indices.forEach(i => {
    cellElements[i].classList.add('win');
  });
}

function showGameOverDialog(message) {
  resultText.textContent = message;
  gameOverDialog.showModal(); // ini yang menampilkan dialog-nya
}

renderBoard();