const DOMElements = {
  canvas:               document.getElementById("gameField"),
  newGameButton:        document.querySelector("#newGameButton"),
  gameSettingsThumb:    document.querySelectorAll("[class^='settings-menu__']"),
  snakeSizeField:       document.querySelector(".settings-menu__gridSize .toggle__field"),
  gameSpeedField:       document.querySelector(".settings-menu__gameSpeed .toggle__field"),
  gameScoreCounter:     document.querySelector("#scoreCounter"),
  gameRecordScore:      document.querySelector("#recordScore"),
};

const preferences = {
  gridSize: 20,
  snakeSpeed: 20,
  fieldWidth: DOMElements.canvas.clientWidth,
  fieldHeight: DOMElements.canvas.clientHeight,
  tileCount() {
    return this.fieldWidth / this.gridSize
  },
  isTransparentBorders: false,
};

const game = {
  score: 0,
  recordScore: getCookie("score"),
  isOver: false,
  dx: 0,
  dy: 0,
};

const ctx = DOMElements.canvas.getContext("2d");

const settingFieldsList = {
  "settings-menu__gameBorders": () => {
    preferences.isTransparentBorders = !preferences.isTransparentBorders;
  },
  "settings-menu__gameSpeed": (e) => {
    preferences.snakeSpeed = e.target.value;
    gameOver();
    newGame();
  },
  "settings-menu__gridSize": (e) => {
    preferences.gridSize = e.target.value * 10;
    gameOver();
    newGame();
  }
};

let gameTimer;
let foodPosition = {
  x: Math.floor(Math.random() * (preferences.tileCount() - 1)),
  y: Math.floor(Math.random() * (preferences.tileCount() - 1)),
};

let snake = [{
  x: preferences.tileCount() / 2, // start position
  y: preferences.tileCount() / 2  // start position
}];

DOMElements.newGameButton.addEventListener("click", newGame);
document.addEventListener("keydown", userControl);

for (let el of DOMElements.gameSettingsThumb) {
  el.addEventListener("change", updateSettings);
}

if (!game.recordScore) {
  game.recordScore = 0;
}

DOMElements.snakeSizeField.value = preferences.gridSize / 10;
DOMElements.gameSpeedField.value = preferences.snakeSpeed;

DOMElements.gameScoreCounter.innerHTML = game.score;
DOMElements.gameRecordScore.innerHTML = game.recordScore;

function draw() {
  ctx.clearRect(0, 0, preferences.fieldWidth, preferences.fieldHeight); // clear field before new frame

  drawSnake();
  drawFood();
  collisionHandler();
}

function drawSnake() {
  ctx.fillStyle = "#fff";

  for (let el of snake) {
    ctx.fillRect(el.x * preferences.gridSize, el.y  * preferences.gridSize, preferences.gridSize, preferences.gridSize);
  }
  const head = {
    x: snake[0].x + game.dx,
    y: snake[0].y + game.dy,
  }
  snake.unshift(head);
}

function collisionHandler() {
  if (snake[0].x >= preferences.tileCount() || snake[0].x < 0 || snake[0].y >= preferences.tileCount() || snake[0].y < 0) {
    if (!preferences.isTransparentBorders) {
      gameOver();
      return;
    }else {
      if (snake[0].x >= preferences.tileCount()) {
        snake[0].x = 0;
      } else if (snake[0].y >= preferences.tileCount()) {
        snake[0].y = 0;
      } else if (snake[0].x <= 0) {
        snake[0].x = preferences.tileCount();
      } else if (snake[0].y <= 0) {
        snake[0].y = preferences.tileCount();
      }
    }
  }

  if (snake[0].x === foodPosition.x && snake[0].y === foodPosition.y) {
    drawFood();
    game.score++;
    DOMElements.gameScoreCounter.innerHTML = game.score;
    return;
  }

  snake.pop();

  let snakeClone = snake.slice(1, snake.length);
  if (snakeClone.find(el => el.x === snake[0].x && el.y === snake[0].y)) {
    gameOver();
  }
}

function gameOver() {
  if (game.score > game.recordScore) {
    document.cookie = `score=${game.score}`;
    game.recordScore = getCookie("score");
    DOMElements.gameRecordScore.innerHTML = game.recordScore;
  }
  game.isOver = true;
  game.dy = 0;
  game.dx = 0;
  document.body.classList.add("_gameOver");
  clearInterval(gameTimer);
}

function newGame() {
  game.isOver = false;
  game.score = 0;
  DOMElements.gameScoreCounter.innerHTML = game.score;

  snake = [{
    x: preferences.tileCount() / 2, // start position
    y: preferences.tileCount() / 2,  // start position
  }];

  generateNewFoodPosition();

  game.dy = 0;
  game.dx = 0;

  document.body.classList.remove("_gameOver");
  gameTimer = setInterval(draw, 1000 / preferences.snakeSpeed);
}

function drawFood() {

  const radius = preferences.gridSize / 2;

  let snakeClone = snake.slice(1, snake.length);
  if (snakeClone.find(el => el.x === foodPosition.x && el.y === foodPosition.y)) {
    generateNewFoodPosition();
    return;
  }

  ctx.fillStyle = "red"
  ctx.beginPath();
  ctx.arc(foodPosition.x * preferences.gridSize + radius, foodPosition.y * preferences.gridSize + radius, radius, 0, Math.PI * 2);
  ctx.fill();
}

function generateNewFoodPosition() {
  foodPosition = {
    x: Math.floor(Math.random() * (preferences.tileCount() - 1)),
    y: Math.floor(Math.random() * (preferences.tileCount() - 1)),
  };
}

function userControl(event) {
  if (event.key === "ArrowLeft" && game.dx !== 1) {
    game.dx = -1;
    game.dy = 0;
  } else if (event.key === "ArrowRight" && game.dx !== -1) {
    game.dx = 1;
    game.dy = 0;
  } else if (event.key === "ArrowDown" && game.dy !== -1) {
    game.dx = 0;
    game.dy = 1;
  } else if (event.key === "ArrowUp" && game.dy !== 1) {
    game.dx = 0;
    game.dy = -1;
  }

  if (event.key === "Enter" && game.isOver) {
    newGame();
  }
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function updateSettings (e) {
  settingFieldsList[e.currentTarget.classList](e);
}

newGame();
