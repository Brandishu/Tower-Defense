var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
const SW = canvas.width;
const SH = canvas.height;
const TILE_W = 25;
var bgcolor = "green";

const buildings = []

var isPlacingTower = false;
var towerStartX, towerStartY, towerEndX, towerEndY;
var towerPlacement = document.getElementById("tower-placement");

var enemyImage = new Image();
enemyImage.src = "enemy.png";

class Soldier {
    constructor(pos, health, attack) {
        this.pos = pos;
        this.health = health;
        this.attack = attack;

        this.width = 50;

        this.targets = [];
        this.targets[0] = new Vector(startPos.x + pathData[0].x - 30, startPos.y + pathData[0].y -50);// enemy auf weg zentrieren

        for (let i = 1; i < pathData.length; i++) {
            let prevTarget = this.targets[i - 1];
            let path = pathData[i];

            let newTarget = new Vector(prevTarget.x + path.x, prevTarget.y + path.y);
            this.targets[i] = newTarget;
        }

        this.currentTargetIndex = 0;
        this.dir = new Vector(0, 0);
        this.speed = 1; //geschwindigkeit
        this.minTargetDist = 5;
        this.isAlive = true;
    }

    healthBar() {
        //super.draw()
    
        // health bar
        c.fillStyle = 'red'
        c.fillRect(this.pos.x, this.pos.y - 15, this.width, 10)
    
        c.fillStyle = 'green'
        c.fillRect(
          this.pos.x,
          this.pos.y - 15,
          (this.width * this.health) / 100,
          10
        )
      }

    update() {
        //this.healthBar()
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
        // Zeichne das Gegnerbild anstelle eines Punktes
        context.drawImage(enemyImage, this.pos.x, this.pos.y, 70, 70);// Größe Gegner
    }
}


class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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
var soldierStart = new Vector(20, 0);

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

		// Zeichne Verknüpfungen zwischen den Pfadsegmenten
        context.fillStyle = "gray"; // Graue Farbe für die Verknüpfungen
        if (path.y !== 0 ) {
            context.fillRect(
                drawPos.x - TILE_W ,
                drawPos.y - TILE_W ,
                TILE_W*2,
                TILE_W*2
            );
        }

        // Verhindere, dass der Weg in den Ecken fehlt
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


//


/*function printMousePos() { // mouse position
    var cursorX;
    var cursorY;
    document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}
    document.getElementById('test').innerHTML = "x: " + cursorX + ", y: " + cursorY;
}

canvas.addEventListener ('click', (event) => {
buildings.push(new Building, {
    position:{
        x: cursorX,
        y: cursorY
    }
 })
})
*/
buildings.forEach(building =>{
    building.draw();
})

class Sprite {
    constructor({
      position = { x: 0, y: 0 },
      imageSrc,
      frames = { max: 1 },
      offset = { x: 0, y: 0 }
    }) {
      this.position = position
      this.image = new Image()
      this.image.src = imageSrc
      this.frames = {
        max: frames.max,
        current: 0,
        elapsed: 0,
        hold: 3
      }
      this.offset = offset
    }
  
    draw() {
      const cropWidth = this.image.width / this.frames.max
      const crop = {
        position: {
          x: cropWidth * this.frames.current,
          y: 0
        },
        width: cropWidth,
        height: this.image.height
      }
      c.drawImage(
        this.image,
       /* crop.position.x,
        crop.position.y,
        crop.width,
        crop.height,
        this.position.x + this.offset.x,
        this.position.y + this.offset.y,
        crop.width,
        crop.height*/
      )
    }
  
    /*update() {
      // responsible for animation
      this.frames.elapsed++
      if (this.frames.elapsed % this.frames.hold === 0) {
        this.frames.current++
        if (this.frames.current >= this.frames.max) {
          this.frames.current = 0
        }
      }
    }*/
  }

  class Building extends Sprite {
    constructor({ position = { x: 0, y: 0 } }) {
      super({
        position,
        imageSrc: 'tower.png',
        /*frames: {
          max: 19
        },
        offset: {
          x: 0,
          y: -80
        }*/
      })
  
      this.width = 50 * 2
      this.height = 50 * 2
      this.center = {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height / 2
      }
      this.projectiles = []
      this.radius = 250
      this.target
    }
  
    draw() {
      //super.draw()
  
       c.beginPath()
       c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
       c.fillStyle = 'rgba(0, 0, 255, 0.2)'
       c.fill()
    }
  
    update() {
     /* this.draw()
      if (this.target || (!this.target && this.frames.current !== 0))
        super.update()
  */
      //if (
        this.target &&
        //this.frames.current === 6 &&
        //this.frames.elapsed % this.frames.hold === 0
      //)
        this.shoot()
    }
  
    shoot() {
      this.projectiles.push(
        new Projectile({
          position: {
            x: this.center.x - 20,
            y: this.center.y - 110
          },
          enemy: this.target
        })
      )
    }
  }




//





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
    //renderGrid();

    soldiers.forEach(function (s) {
        s.render();
    });
}

function play() {
    update();
    render();
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

// ...

// Füge Event-Listener für die Buttons hinzu
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



function startTowerPlacement() {
    isPlacingTower = true;
    towerPlacement.style.display = "block";

    /*
    buildings.push(new Building, {
        position:{
            x: 500,//towerEndX
            y: 500 //towerEndY
        }
     })
    
    
    buildings.forEach(building =>{
        building.draw();
    })
*/

}

function endTowerPlacement() {
    if (isPlacingTower) {
        var gridSize = 25;
        var towerX = Math.round(towerEndX / gridSize) * gridSize;
        var towerY = Math.round(towerEndY / gridSize) * gridSize;
//
        buildings.push(new Building, {
            position:{
                x: 500,//towerEndX
                y: 500 //towerEndY
            }
         })
        
        
        buildings.forEach(building =>{
            building.draw();
        })
//
        /*var towerElement = document.createElement("div");
        towerElement.className = "tower";
        towerElement.style.backgroundImage = "url('tower.png')";
        towerElement.style.width = "40px";
        towerElement.style.height = "40px";
        towerElement.style.top = towerY + "px";
        towerElement.style.left = towerX + "px";
        towerElement.style.zIndex = "100";
        */
        var gameContainer = document.getElementById("game");
        gameContainer.appendChild(Building); //towerelement

        //towerElement.style.visibility = "visible";
    }
} 

//var towerImage = new Image();
//towerImage.src = "tower.png";

isPlacingTower = false;
towerPlacement.style.display = "none";

if (isPlacingTower) {
    var gridSize = 25;
    var towerX = Math.round(towerEndX / gridSize) * gridSize;
    var towerY = Math.round(towerEndY / gridSize) * gridSize;
//
    buildings.push(new Building, {
        position:{
            x: towerEndX,
            y: towerEndY
        }
     })
    
    
    buildings.forEach(building =>{
        building.draw();
    })
//
    /*var towerElement = document.createElement("div");
    towerElement.className = "tower";
    towerElement.style.backgroundImage = "url('tower.png')";
    towerElement.style.width = "40px";
    towerElement.style.height = "40px";
    towerElement.style.top = towerY + "px";
    towerElement.style.left = towerX + "px";
    towerElement.style.zIndex = "100";
    */
    var gameContainer = document.getElementById("game");
    gameContainer.appendChild(Building); //towerElement
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

/*canvas.addEventListener("mousemove", function (event) {
    if (isPlacingTower) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        var width = 25; // Breite des Turm-Bilds
        var height = 25; // Höhe des Turm-Bilds
        var left = Math.min(mouseX, towerStartX);
        var top = Math.min(mouseY, towerStartY);

        towerPlacement.style.width = width + "px";
        towerPlacement.style.height = height + "px";
        towerPlacement.style.left = left + "px";
        towerPlacement.style.top = top + "px";
    }
});*/

function displayResponse(response) {
    var chatbox = document.getElementById("chatbox");
    var responseElement = document.createElement("p");
    responseElement.textContent = response;
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
