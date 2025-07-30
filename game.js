const params = new URLSearchParams(window.location.search);
const player1 = params.get('player1') || 'Player X';
const player2 = params.get('player2') || 'Player O';

document.getElementById('playerNames').textContent = `${player1} (X) vs ${player2} (O)`;

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

function renderBoard() {
  board.innerHTML = '';
  cells.forEach((value, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = value || '';
    cell.onclick = () => handleClick(i);
    board.appendChild(cell);
  });
  updateScore();
}

function handleClick(i) {
  if (cells[i] || gameOverDialog.open) return;
  cells[i] = turn;
  renderBoard();

  const winner = checkWinner();
  if (winner) {
    score[winner]++;
    localStorage.setItem(`score${winner}`, score[winner]);
    resultText.textContent = `${winner} wins this round!`;
    gameOverDialog.showModal();
  } else if (cells.every(cell => cell)) {
    resultText.textContent = 'Draw!';
    gameOverDialog.showModal();
  } else {
    turn = turn === 'X' ? 'O' : 'X';
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
      return cells[a];
    }
  }
  return null;
}

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
  finalText.textContent = `${winner} (Skor: X=${score.X}, O=${score.O})`;
  finalResultDialog.showModal();
  localStorage.clear();
};

function updateScore() {
  document.getElementById('scoreX').textContent = `X: ${score.X}`;
  document.getElementById('scoreO').textContent = `O: ${score.O}`;
}

renderBoard();