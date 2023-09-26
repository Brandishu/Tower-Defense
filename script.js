import Game from './game.js';
import Tower from './tower.js';

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
const SW = canvas.width;
const SH = canvas.height;
const TILE_W = 25;
var bgcolor = "green";
var isPlacingTower = false;
var towerStartX, towerStartY, towerEndX, towerEndY;
var towerPlacement = document.getElementById("tower-placement");
var enemyImage = new Image();
enemyImage.src = "enemy.png";
var commands = {
    help: "Type 'build' to place a tower, 'upgrade' to upgrade a tower, or 'sell' to sell a tower.",
    build: function() {
      toggleTowerPlacementMode();
      displayResponse("Click on the canvas to place the tower.");
    },
    upgrade: function() {
      displayResponse("To upgrade a tower, modify its properties using CSS.");
    },
    sell: function() {
      displayResponse("To sell a tower, remove the <div> element representing the tower.");
    },
    default: function() {
      displayResponse("Invalid command. Type 'help' for a list of available commands.");
    }
  };
  
  function processCommand(command) {
    var action = commands[command] || commands.default;
    if (typeof action === "function") {
      action();
    } else {
      displayResponse(action);
    }
    commandInput.value = "";
  }
  
  function startGame() {
    var game = new Game();
    game.update(0);
  }
  
  class Tower {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.range = 100;
      this.damage = 10;
      this.fireRate = 1;
      this.lastFired = 0;
    }
  }
  class Bullet {
    constructor(pos, target) {
      this.pos = pos;
      this.target = target;
      this.speed = 5;
      this.radius = 5;
    }
    update() {
      let dir = new Vector(this.target.x - this.pos.x, this.target.y - this.pos.y);
      let distance = Math.sqrt(dir.x ** 2 + dir.y ** 2);
      if (distance == 0) return;
      dir.x /= distance;
      dir.y /= distance;
      this.pos.x += dir.x * this.speed;
      this.pos.y += dir.y * this.speed;
    }
    render() {
      context.beginPath();
      context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
    }
  }
class Soldier {
    constructor(pos, health, attack) {
        this.pos = pos;
        this.health = health;
        this.attack = attack;
        this.targets = [];
        this.targets[0] = new Vector(startPos.x + pathData[0].x - 20, startPos.y + pathData[0].y -25);
        for (let i = 1; i < pathData.length; i++) {
            let prevTarget = this.targets[i - 1];
            let path = pathData[i];
            let newTarget = new Vector(prevTarget.x + path.x, prevTarget.y + path.y);
            this.targets[i] = newTarget;
        }
        this.currentTargetIndex = 0;
        this.dir = new Vector(0, 0);
        this.speed = 1;
        this.minTargetDist = 5;
        this.isAlive = true;
    }
    update() {
        if (!this.isAlive) return;
        let dir = new Vector(this.targets[this.currentTargetIndex].x - this.pos.x, this.targets[this.currentTargetIndex].y - this.pos.y);
        let distance = Math.sqrt(dir.x ** 2 + dir.y ** 2);
        if (distance == 0) return;
        dir.x /= distance;
        dir.y /= distance;
        this.pos.x += dir.x * this.speed;
        this.pos.y += dir.y * this.speed;
        let xDist = Math.abs(this.pos.x - this.targets[this.currentTargetIndex].x);
        let yDist = Math.abs(this.pos.y - this.targets[this.currentTargetIndex].y);
        if (xDist <= this.minTargetDist && yDist <= this.minTargetDist) {
            this.currentTargetIndex++;
            if (this.currentTargetIndex >= this.targets.length) {
                this.isAlive = false;
            }
        }
    }
    render() {
        context.drawImage(enemyImage, this.pos.x, this.pos.y, 40, 40);
    }
}
class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    add(other) {
      return new Vector(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
      return new Vector(this.x - other.x, this.y - other.y);
    }
    multiply(scalar) {
      return new Vector(this.x * scalar, this.y * scalar);
    }
    divide(scalar) {
      return new Vector(this.x / scalar, this.y / scalar);
    }
    distance(other) {
      let dx = this.x - other.x;
      let dy = this.y - other.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    normalize() {
      let length = this.distance(new Vector(0, 0));
      return new Vector(this.x / length, this.y / length);
    }
  }
var startPos = new Vector(50, 0);
var pathData = [
    new Vector(0, 200),
    new Vector(100, 0),
    new Vector(0, -100),
    new Vector(100, 0),
    new Vector(0, 300),
    new Vector(100, 0),
    new Vector(0, -100),
    new Vector(200, 0),
    new Vector(0, -100),
    new Vector(-100, 0),
    new Vector(0, -100),
    new Vector(200, 0),
    new Vector(0, 300),
    new Vector(-100, 0),
    new Vector(0, 100),
    new Vector(-400, 0),
];
var soldiers = [];
const NUM_SOLDIERS = 100;
var soldierStart = new Vector(0, 50);
for (let i = 0; i < NUM_SOLDIERS; i++) {
    let newSoldier = new Soldier(new Vector(soldierStart.x, soldierStart.y), "blue", 20, 100, 10);
    soldiers.push(newSoldier);
    soldierStart.y -= 60;
}
function update() {
    soldiers.forEach(function (s) {
        s.update();
    });
}
function renderPath(){
	let drawPos = new Vector(startPos.x,startPos.y);
	context.fillStyle = "gray";
	pathData.forEach(function(path){
		if (path.x == 0){
			let x = drawPos.x - TILE_W; 
			let y = drawPos.y - TILE_W; 
			let w = TILE_W * 2;
			let h = path.y + TILE_W * 2;
			console.log(path.y);
			context.fillRect(x,y,w,h);
		}
		else{
			let x = drawPos.x - TILE_W;
			let y = drawPos.y - TILE_W;
			let w = path.x + TILE_W * 2;
			let h = TILE_W * 2;
			context.fillRect(x,y,w,h);
		}
		drawPos.x += path.x; 
		drawPos.y += path.y; 
        context.fillStyle = "gray";
        if (path.y !== 0 ) {
            context.fillRect(
                drawPos.x - TILE_W ,
                drawPos.y - TILE_W ,
                TILE_W*2,
                TILE_W*2
            );
        }
        if (path.x !== 0 && prevPath.y !== 0) {
            context.fillRect(
                drawPos.x - TILE_W ,
                drawPos.y - TILE_W ,
                TILE_W*2,
                TILE_W*2
            );
        }
		prevPath = path;
	});
}
function renderGrid() {
    context.fillStyle = "black";
    let x = 0;
    for (let i = 0; i < SW / TILE_W; i++) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, SH);
        context.stroke();
        x += TILE_W;
    }
    let y = 0;
    for (let i = 0; i < SH / TILE_W; i++) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(SW, y);
        context.stroke();
        y += TILE_W;
    }
}
function render() {
    context.fillStyle = bgcolor;
    context.fillRect(0, 0, SW, SH);
    renderPath();
    renderGrid();
    soldiers.forEach(function (s) {
        s.render();
    });
}
function play() {
    update();
    render();
}
function calculateTowerPosition(x, y) {
    var gridSize = 50;
    var towerX = Math.round(x / gridSize) * gridSize;
    var towerY = Math.round(y / gridSize) * gridSize;
    return { x: towerX, y: towerY };
  }
setInterval(play, 1000 / 60);
function toggleTowerPlacementMode() {
    if (isPlacingTower) {
        isPlacingTower = false;
        towerPlacement.style.display = "none";
        displayResponse("Tower placement mode deactivated.");
    } else {
        isPlacingTower = true;
        towerPlacement.style.display = "block";
    }
}
document.getElementById("submit-button").addEventListener("click", submitCommand);
document.getElementById("clear-button").addEventListener("click", clearChat);
function submitCommand() {
    var commandInput = document.getElementById("command-input");
    var command = commandInput.value.toLowerCase();
    var response = "";
    switch (command) {
        case "help":
            response = "Available commands: build, upgrade, sell";
            break;
        case "build":
            toggleTowerPlacementMode();
            response = "Click on the canvas to place the tower.";
            break;
        case "upgrade":
            response = "To upgrade a tower, modify its properties using CSS.";
            break;
        case "sell":
            response = "To sell a tower, remove the <div> element representing the tower.";
            break;
        default:
            response = "Invalid command. Type 'help' for a list of available commands.";
    }
    displayResponse(response);
    commandInput.value = "";
}
function clearChat() {
    var chatbox = document.getElementById("chatbox");
    while (chatbox.firstChild) {
        chatbox.removeChild(chatbox.firstChild);
    }
}
function placeTower(x, y) {
    var towerElement = document.createElement("div");
    towerElement.className = "tower";
    towerElement.style.backgroundImage = "url('tower.png')";
    towerElement.style.width = "40px";
    towerElement.style.height = "40px";
    towerElement.style.top = y + "px";
    towerElement.style.left = x + "px";
    towerElement.style.zIndex = "100";
    var gameContainer = document.getElementById("game");
    gameContainer.appendChild(towerElement);
    towerElement.style.visibility = "visible";
  }
function startTowerPlacement() {
    isPlacingTower = true;
    towerPlacement.style.display = "block";
}
function endTowerPlacement() {
    if (isPlacingTower) {
      var towerPosition = calculateTowerPosition(towerEndX, towerEndY);
      placeTower(towerPosition.x, towerPosition.y);
    }
  }
var towerImage = new Image();
towerImage.src = "tower.png";
isPlacingTower = false;
towerPlacement.style.display = "none";
if (isPlacingTower) {
    var gridSize = 50;
    var towerX = Math.round(towerEndX / gridSize) * gridSize;
    var towerY = Math.round(towerEndY / gridSize) * gridSize;
    var towerElement = document.createElement("div");
    towerElement.className = "tower";
    towerElement.style.backgroundImage = "url('tower.png')";
    towerElement.style.width = "40px";
    towerElement.style.height = "40px";
    towerElement.style.top = towerY + "px";
    towerElement.style.left = towerX + "px";
    towerElement.style.zIndex = "100";
    var gameContainer = document.getElementById("game");
    gameContainer.appendChild(towerElement);
}
canvas.addEventListener("mousedown", function (event) {
    if (isPlacingTower) {
        towerStartX = event.clientX;
        towerStartY = event.clientY;
    }
});
canvas.addEventListener("mouseup", function (event) {
    if (isPlacingTower) {
        towerEndX = event.clientX;
        towerEndY = event.clientY;
        endTowerPlacement();
    }
});
canvas.addEventListener("mousemove", function (event) {
    if (isPlacingTower) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        var width = 40;
        var height = 40;
        var left = Math.min(mouseX, towerStartX);
        var top = Math.min(mouseY, towerStartY);
        towerPlacement.style.width = width + "px";
        towerPlacement.style.height = height + "px";
        towerPlacement.style.left = left + "px";
        towerPlacement.style.top = top + "px";
    }
});
canvas.addEventListener("click", function(event) {
    if (isPlacingTower) {
      let rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      let tower = new Tower(x, y);
      game.towers.push(tower);
      isPlacingTower = false;
      towerStartX = null;
      towerStartY = null;
      towerEndX = null;
      towerEndY = null;
    }
  });
  function displayResponse(response) {
    var chatbox = document.getElementById("chatbox");
    var responseElement = document.createElement("div");
    responseElement.className = "response";
    responseElement.innerHTML = response;
    chatbox.appendChild(responseElement);
  }
function clearChat() {
    var chatbox = document.getElementById("chatbox");
    while (chatbox.firstChild) {
      chatbox.removeChild(chatbox.firstChild);
    }
  }
document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("mousemove", handleMouseMove);