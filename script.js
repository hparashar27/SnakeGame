const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const startBtn = document.querySelector("#startBtn");
const resetBtn = document.querySelector("#resetBtn");
const leaderboardTable = document.querySelector("#leaderboardTable");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "#60f542";
const snakeBorder = "black";
const foodcolor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

let tickDelay = 350;

const urlParams = new URLSearchParams(window.location.search);
const playerName = urlParams.get("name");

const players = [];
const gameHistory = [];
const leaderboard = [];

window.addEventListener("keydown", changeDirection);
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

function startGame() {
  if (!running) {
    if (playerName && !players.includes(playerName)) {
      players.push(playerName);
      gameHistory.push({ name: playerName, score: 0 });
    }
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
  }
}

function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, tickDelay);
  } else {
    displayGameOver();
  }
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
  function randomFood(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  foodX = randomFood(0, gameWidth / unitSize) * unitSize;
  foodY = randomFood(0, gameHeight / unitSize) * unitSize;
}

function drawFood() {
  ctx.fillStyle = foodcolor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);
  if (snake[0].x === foodX && snake[0].y === foodY) {
    score += 1;
    scoreText.textContent = score;
    createFood();
    increaseSpeed();
  } else {
    snake.pop();
  }
}

function increaseSpeed() {
  tickDelay = Math.max(10, tickDelay - 2);
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

function changeDirection(event) {
  const keypressed = event.keyCode;
  const left = 37;
  const right = 39;
  const up = 38;
  const down = 40;

  const goingup = yVelocity === -unitSize;
  const goingdown = yVelocity === unitSize;
  const goingright = xVelocity === unitSize;
  const goingleft = xVelocity === -unitSize;

  switch (true) {
    case keypressed === left && !goingright:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keypressed === up && !goingdown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keypressed === right && !goingleft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keypressed === down && !goingup:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}
function checkGameOver() {
  if (snake[0].x < 0) {
    snake[0].x = gameWidth - unitSize;
  } else if (snake[0].x >= gameWidth) {
    snake[0].x = 0;
  }

  if (snake[0].y < 0) {
    snake[0].y = gameHeight - unitSize;
  } else if (snake[0].y >= gameHeight) {
    snake[0].y = 0;
  }
  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      running = false;
      break;
    }
  }
  if (!running) {
    const playerData = gameHistory.find((item) => item.name === playerName);
    playerData.score = score;
    addToLeaderboard(playerName, score);
  }
}

function displayGameOver() {
  ctx.font = "50px MV Boli";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", gameWidth / 2, gameHeight / 2);
  running = flase;
  startBtn.disabled = false;

  updateLeaderboardTable();
}

function addToLeaderboard(playerName, playerScore) {
  leaderboard.push({ name: playerName, score: playerScore });
  leaderboard.sort((a, b) => b.score - a.score);
  updateLeaderboardTable();
}

function updateLeaderboardTable() {
  leaderboardTable.innerHTML = `
    <tr>
      <th>Rank</th>
      <th>Player</th>
      <th>Score</th>
    </tr>
  `;
  leaderboard.forEach((entry, index) => {
    leaderboardTable.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${entry.name}</td>
        <td>${entry.score}</td>
      </tr>
    `;
  });
}

function resetGame() {
  running = false;
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  clearBoard();
  scoreText.textContent = score;
}

clearBoard();
