const canvas = document.getElementById("gameField");
const ctx = canvas.getContext("2d");

const fieldWidth = canvas.clientWidth;
const fieldHeight = canvas.clientHeight;
const cellSize = 20;
const frameRate = 34; // ~30fps (should not be more than 1000)

const snakeSpeed = 150; // pixels per second

let foodPos;
let snake = [{
  direction: "",
  x: 400, // start position
  y: 400  // start position
}]
let turnHistory= [];

document.addEventListener("keydown", userControl);

function draw() {
  const cellSizeHalf = cellSize / 2;
  ctx.clearRect(0, 0, fieldWidth, fieldHeight);
  ctx.fillStyle = "#111"
  for (let el of snake) {
    ctx.fillRect(el.x - cellSizeHalf, el.y - cellSizeHalf, cellSize, cellSize);
  }

  if (!foodPos) {
    foodPos = drawFood({});
  }else {
    drawFood(foodPos);
  }

  const foodBorders = {
    x1: foodPos.x - cellSize,
    x2: foodPos.x + cellSize,
    y1: foodPos.y - cellSize,
    y2: foodPos.y + cellSize,
  }

  const snakeSpeedLocal = snakeSpeed / (1000 / frameRate);

  if (
    (snake[0].y > foodBorders.y1) &&
    (snake[0].y < foodBorders.y2) &&
    (foodBorders.x1 < snake[0].x) &&
    (foodBorders.x2 > snake[0].x)
  ) {
    switch (snake[0].direction) {
      case "left":
        collisionHandler("food", +cellSize, 0);
        break;

      case "up":
        collisionHandler("food", 0, +cellSize);
        break;

      case "right":
        collisionHandler("food", -cellSize, 0);
        break;

      case "down":
        collisionHandler("food", 0, -cellSize);
        break;
    }
  }

  for (let snakeEl of snake) {
    // if (turnHistory[snakeEl.nextTurn].x )
    switch (snakeEl.direction) {
      case "left":
        if (snakeEl.x - snakeSpeedLocal < 0) {
          snakeEl.x = fieldWidth;
          break;
        }
        snakeEl.x -= snakeSpeedLocal;
        break;

      case "up":
        if (snakeEl.y - snakeSpeedLocal < 0) {
          snakeEl.y = fieldHeight;
          break;
        }
        snakeEl.y -= snakeSpeedLocal
        break;

      case "right":
        if (snakeEl.x + snakeSpeedLocal > fieldWidth) {
          snakeEl.x = 0;
          break;
        }
        snakeEl.x += snakeSpeedLocal
        break;

      case "down":
        if (snakeEl.y + snakeSpeedLocal > fieldHeight) {
          snakeEl.y = 0;
          break;
        }
        snakeEl.y += snakeSpeedLocal
        break;
    }
  }
}

function collisionHandler(target, x, y) {
  if (target === "food") {
    foodPos = drawFood({});
    setTimeout(() => {
      snake[snake.length] = {
        nextTurn: 0,
        direction: snake[snake.length-1].direction,
        x: snake[snake.length-1].x + x,
        y: snake[snake.length-1].y + y,
      }
    }, 0);
  }else if (target === "snake") {
    console.log("Game over!");
  }
}

function drawFood({x = undefined, y = undefined}) {
  ctx.fillStyle = "red"
  const foodPosition = {
    x: Math.floor(Math.random() * (fieldWidth - cellSize * 2) + cellSize),
    y: Math.floor(Math.random() * (fieldHeight - cellSize * 2) + cellSize),
  }

  if ( (x !== undefined) && (y !== undefined) ) {
    foodPosition.x = x
    foodPosition.y = y
  }

  const radius = cellSize / 2;

  ctx.beginPath();
  ctx.arc(foodPosition.x, foodPosition.y, radius, 0, Math.PI * 2);
  ctx.fill();

  return foodPosition;
}

function userControl(event) {
  const directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  }

  const direction = directions[event.keyCode];

  turnHistory.push({
    x: snake[0].x,
    y: snake[0].y,
  })

  if ( (direction === "left") && (snake[0].direction !== "right") ) {
    snake[0].direction = "left";
  }else if ( (direction === "right") && (snake[0].direction !== "left") ) {
    snake[0].direction = "right";
  }else if ( (direction === "down") && (snake[0].direction !== "up") ) {
    snake[0].direction = "down";
  }else if ( (direction === "up") && (snake[0].direction !== "down") ) {
    snake[0].direction = "up";
  }
}

setInterval(draw, frameRate);
