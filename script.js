const canvas = document.getElementById("canvas");
const winMessage = document.getElementById("win-message");
const selectLevel = document.getElementById("game-level");
const restartGame = document.getElementById("restart-game");

const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

const poleImage = new Image();
const block1 = new Image();
const block2 = new Image();
const block3 = new Image();
const block4 = new Image();
const block5 = new Image();
const block6 = new Image();
const block7 = new Image();
const block8 = new Image();
const block9 = new Image();

poleImage.src = "./tower_of_hanoi_assets/pole.png";
block1.src = "./tower_of_hanoi_assets/1.svg";
block2.src = "./tower_of_hanoi_assets/2.svg";
block3.src = "./tower_of_hanoi_assets/3.svg";
block4.src = "./tower_of_hanoi_assets/4.svg";
block5.src = "./tower_of_hanoi_assets/5.svg";
block6.src = "./tower_of_hanoi_assets/6.svg";
block7.src = "./tower_of_hanoi_assets/7.svg";
block8.src = "./tower_of_hanoi_assets/8.svg";
block9.src = "./tower_of_hanoi_assets/9.svg";

let gameLevel = 3;

const blocks = [block1, block2, block3, block4, block5, block6, block7, block8, block9];

const config = {};

let boxes, pole_occupants, poles;


function setGame(level=null) {
    if(level) gameLevel = level;

    config.boxes = gameLevel;
    config.box_height = 20;
    config.box_width_base = 30;
    config.width_increment = 18;

    boxes = [];
    pole_occupants = [gameLevel, 0, 0];
    poles = [[], [], []];

    for(let i=0; i<config.boxes; i++) {
        let box = {
            id: i,
            height: config.box_height,
            width: config.box_width_base + config.width_increment * i,
            size_id: i,
            pole: 0,
            isDragging: false,
        }
        setBoxPosition(box);
        boxes.push(box);
        poles[0].push(box.id);
    }
}


function gameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(poleImage, 0, 0, canvas.width/3, canvas.height);
    ctx.drawImage(poleImage, canvas.width/3, 0, canvas.width/3, canvas.height);
    ctx.drawImage(poleImage, 2*(canvas.width/3), 0, canvas.width/3, canvas.height);

    ctx.font = "20px Monospace";
    ctx.fillText("A", 92, canvas.height - 7);
    ctx.fillText("B", 292, canvas.height - 7);
    ctx.fillText("C", 492, canvas.height - 7);
    
    boxes.forEach((box) => {
        ctx.drawImage(blocks[box.id], box.x, box.y, box.width, box.height);
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.rect(box.x, box.y, box.width, box.height);
        ctx.stroke();
        ctx.closePath();
    })    

    checkWin();
}

canvas.addEventListener("mousedown", (e) => {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;
    
    boxes.forEach((box) => {
        if(mouseX > box.x && mouseX < box.x + box.width
            && mouseY > box.y && mouseY < box.y + box.height 
            && box.size_id + pole_occupants[box.pole] == boxes.length)
        {
            box.isDragging = true;
            poles[box.pole].shift();  
        }
    })
})

canvas.addEventListener("mousemove", (e) => {
    boxes.forEach((box) => {
        if(box.isDragging) {
            box.x = e.offsetX - box.width / 2;
            box.y = e.offsetY - box.height / 2;
        }
    })
})

canvas.addEventListener("mouseup", (e) => {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;

    let currentPole = 2;
    
    if(mouseX < canvas.width / 3) {
        currentPole = 0;
    }
    else if( mouseX < 2 * (canvas.width / 3) ) {
        currentPole = 1;
    }

    boxes.forEach((box) => {
        if(box.isDragging) {
            box.isDragging = false;

            if(poles[currentPole][0] != undefined && box.id > poles[currentPole][0]) {
                poles[box.pole].unshift(box.id);
                setBoxPosition(box);
                return;
            }

            pole_occupants[box.pole]--;
            box.pole = currentPole;
            box.size_id = boxes.length - 1 - pole_occupants[box.pole];
            pole_occupants[box.pole]++;
            poles[currentPole].unshift(box.id);
            setBoxPosition(box);
        }
    })
})

selectLevel.addEventListener("change", () => {
    let level = parseInt(selectLevel.value) + 2;
    
    setGame(level);
})

restartGame.addEventListener("click", () => {
    setGame();
})

function wonGame() {
    if(winMessage.style.display = "none") {
        winMessage.style.display = "block";
    }
}

function notWonYet() {
    if(winMessage.style.display = "block") {
        winMessage.style.display = "none";
    }
}

function checkWin() {
    if(poles[1].length == boxes.length || poles[2].length == boxes.length) {
        wonGame();
    }
    else {
        notWonYet();
    }
}

function setBoxPosition(box) {
    box.x = (box.pole * (canvas.width / 3)) + ((canvas.width/3) - box.width) / 2;
    box.y = canvas.height - gameLevel * box.height + (box.size_id * box.height) - 44.5;
}

function start() {
    gameloop();
    window.requestAnimationFrame(start);
}

setGame();
start();