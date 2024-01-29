const canvas = document.getElementById("gameField");
const ctx = canvas.getContext("2d");

const fieldWidth = canvas.offsetWidth;
const fieldHeight = canvas.offsetHeight;
const cellSize = 20;

const snakeSpeed = 20

let snakeDirection = "up";
let foodPos;
let snakePosition = {
  x: 400, // start position
  y: 400  // start position
}

document.addEventListener("keydown", userControl);

function draw() {
  ctx.clearRect(0, 0, fieldWidth, fieldHeight);
  ctx.fillStyle = "#111"
  ctx.fillRect(snakePosition.x, snakePosition.y, cellSize, cellSize);

  if (!foodPos) {
    foodPos = drawFood({undefined});
  }else {
    drawFood(foodPos);
  }

  switch (snakeDirection) {
    case "left":
      if (snakePosition.x - snakeSpeed < 0) {
        snakePosition.x = fieldWidth;
        break;
      }
      snakePosition.x -= snakeSpeed;
      break;

    case "up":
      if (snakePosition.y - snakeSpeed < 0) {
        snakePosition.y = fieldHeight;
        break;
      }
      snakePosition.y -= snakeSpeed;
      break;

    case "right":
      if (snakePosition.x + snakeSpeed > fieldWidth) {
        snakePosition.x = 0;
        break;
      }
      snakePosition.x += snakeSpeed;
      break;

    case "down":
      if (snakePosition.y + snakeSpeed > fieldHeight) {
        snakePosition.y = 0;
        break;
      }
      snakePosition.y += snakeSpeed;
      break;
  }
}

function drawFood({x, y}) {
  ctx.fillStyle = "red"
  const foodPosition = {
    x: Math.floor(Math.random() * (fieldWidth - 40) / cellSize) * cellSize,
    y: Math.floor(Math.random() * (fieldHeight - 40) / cellSize) * cellSize
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

  if ( (direction === "left") && (snakeDirection !== "right") ) {
    snakeDirection = "left";
  }else if ( (direction === "right") && (snakeDirection !== "left") ) {
    snakeDirection = "right";
  }else if ( (direction === "down") && (snakeDirection !== "up") ) {
    snakeDirection = "down";
  }else if ( (direction === "up") && (snakeDirection !== "down") ) {
    snakeDirection = "up";
  }
}

setInterval(draw, 100);
