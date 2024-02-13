const canvas = document.getElementById("gameField");
const newGameButton = document.querySelector("#newGameButton");

const ctx = canvas.getContext("2d");

const gridSize = 20;
const snakeSpeed = 10
const fieldHeight = canvas.clientHeight;
const fieldWidth = canvas.clientWidth;
const tileCount = fieldWidth / gridSize;

let isGameOver = false;

let foodPosition = {
  x: Math.floor(Math.random() * (tileCount - 1)),
  y: Math.floor(Math.random() * (tileCount - 1)),
}

let snake = [{
  x: tileCount / 2, // start position
  y: tileCount / 2  // start position
}]

let gameTimer;

newGameButton.addEventListener("click", newGame);
document.addEventListener("keydown", userControl);

let dx = 0;
let dy = 0;

function draw() {
  ctx.clearRect(0, 0, fieldWidth, fieldHeight); // clear field before new frame

  drawSnake();
  drawFood();
  collisionHandler();
}

function drawSnake() {
  ctx.fillStyle = "#111";

  for (let el of snake) {
    ctx.fillRect(el.x * gridSize, el.y  * gridSize, gridSize, gridSize);
  }
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy,
  }
  snake.unshift(head);
}

function collisionHandler() {
  if (snake[0].x >= tileCount || snake[0].x < 0 || snake[0].y >= tileCount || snake[0].y < 0) {
    gameOver();
    return;
  }

  if (snake[0].x === foodPosition.x && snake[0].y === foodPosition.y) {
    foodPosition = {
      x: Math.floor(Math.random() * (tileCount - 1)),
      y: Math.floor(Math.random() * (tileCount - 1)),
    };
    return;
  }

  snake.pop();

  let snakeClone = snake.slice(1, snake.length);
  if (snakeClone.find(el => el.x === snake[0].x && el.y === snake[0].y)) {
    gameOver();
  }
}

function gameOver() {
  isGameOver = true;
  dy = 0;
  dx = 0;
  document.body.classList.add("_gameOver");
  clearInterval(gameTimer);
}

function newGame() {
  isGameOver = false;
  snake = [{
    x: tileCount / 2, // start position
    y: tileCount / 2,  // start position
  }];
  foodPosition = {
    x: Math.floor(Math.random() * (tileCount - 1)),
    y: Math.floor(Math.random() * (tileCount - 1)),
  };
  dy = 0;
  dx = 0;
  document.body.classList.remove("_gameOver");
  gameTimer = setInterval(draw, 1000 / snakeSpeed);
}

function drawFood() {

  const radius = gridSize / 2;

  ctx.fillStyle = "red"
  ctx.beginPath();
  ctx.arc(foodPosition.x * gridSize + radius, foodPosition.y * gridSize + radius, radius, 0, Math.PI * 2);
  ctx.fill();
}

function userControl(event) {
  if (event.key === "ArrowLeft" && dx !== 1) {
    dx = -1;
    dy = 0;
  } else if (event.key === "ArrowRight" && dx !== -1) {
    dx = 1;
    dy = 0;
  } else if (event.key === "ArrowDown" && dy !== -1) {
    dx = 0;
    dy = 1;
  } else if (event.key === "ArrowUp" && dy !== 1) {
    dx = 0;
    dy = -1;
  }

  if (event.key === "Enter" && isGameOver) {
    newGame();
  }
}

newGame();
