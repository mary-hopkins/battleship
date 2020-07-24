import { Game } from "./ships.js";

/////////////////////////////Prebuilt stuff
let newGame = Game();
let humanPlayer = newGame.getPlayer(1);
let computerPlayer = newGame.getPlayer(2);

let humanGB = humanPlayer.getGameBoard();
let computerGB = computerPlayer.getGameBoard();

// functions to create human-fleet
function createHumanFleet() {
    let humanZone = document.querySelector('#left');
    humanZone.innerHTML = "";

    let humanTitle = document.createElement('p');
    humanTitle.innerHTML = "Your Fleet";
    
    let humanFleet = document.createElement('div');
    humanFleet.classList.add('gameboard');
    humanFleet.setAttribute("id", "human-fleet");

    let humanCoordinates = humanGB.getCoords();
    for(let i = 0; i < humanCoordinates.length; i++) {
        let newTile = document.createElement('div');
        newTile.classList.add("square", "human");
        let index = humanCoordinates[i].squareId;
        newTile.setAttribute("data-num", index)
        if(humanCoordinates[i].hasShip == true) {
            newTile.classList.add("ship");
        }
        if (humanCoordinates[i].hasShip == false) {
            newTile.classList.add("water");
        }
        if (humanCoordinates[i].struck == true) {
            newTile.classList.add("struck");
        }
        humanFleet.appendChild(newTile);
    }
    humanZone.appendChild(humanFleet);
    humanZone.appendChild(humanTitle); 
}

// functions to create enemy-ocean
function createEnemyOcean() {
    let enemyZone = document.querySelector('#right');
    enemyZone.innerHTML = "";

    let enemyTitle = document.createElement('p');
    enemyTitle.innerHTML = "Enemy Ocean";
    
    
    let enemyOcean = document.createElement('div');
    enemyOcean.classList.add('gameboard');
    enemyOcean.setAttribute("id", "enemy-ocean");
   
    let computerCoordinates = computerGB.getCoords();
    for(let i = 0; i < computerCoordinates.length; i++) {
        let newTile = document.createElement('div');
        newTile.classList.add("square", "computer");
        let index = computerCoordinates[i].squareId;
        newTile.setAttribute("data-num", index)
        
        newTile.classList.add("water"); //all looks like water

        if (computerCoordinates[i].struck == true) {
            newTile.classList.add("struck");
        }
        if (computerCoordinates[i].struck == true && computerCoordinates[i].hasShip == true) {
            newTile.classList.add("ship");
        }
        enemyOcean.appendChild(newTile);
    }
    enemyZone.appendChild(enemyOcean);
    enemyZone.appendChild(enemyTitle); 
}

// function to declare a winner and end the game
function declareWinner(victor) {
    notAPageReload();
    removeEventListeners();
    if(victor == 'human') {
        alert('You have defeated your enemy!');
    } else if (victor == 'computer') {
        alert('You have lost to the computer');
    }
}

function removeEventListeners() {
    let computerSquares = document.querySelectorAll('.computer');
    for(let i = 0; i < computerSquares.length; i++) {
        let currentSquare = computerSquares[i];
        currentSquare.removeEventListener('click', mainGameLoop, false);
    }
}

// function to check for victory
function checkVictory() {
    if(humanGB.getDefeated()) {
        declareWinner('computer');
        return true;
    } else if (computerGB.getDefeated()) {
        console.log('human wins');
        declareWinner('human');
        return true;
    }
    return false; 
} 

/// will do many things :(
function mainGameLoop(e) {
    let targetSquareId = parseInt((e.target.dataset.num));
    computerGB = computerPlayer.getGameBoard();
    humanGB = humanPlayer.getGameBoard();
    humanPlayer.humanShootsComputer(computerGB, targetSquareId);
    if(!checkVictory()) {
        computerPlayer.computerShootsHuman(humanGB);
        if(!checkVictory()) {
            notAPageReload();
        }
    }
    
}

function addCompSquareListeners() {
    let computerSquares = document.querySelectorAll('.computer');
    for(let i = 0; i < computerSquares.length; i++) {
        let currentSquare = computerSquares[i];
        let classes = currentSquare.classList;
        let result = classes.contains("struck");
        if(!result) {
            currentSquare.addEventListener('click', mainGameLoop, false);
        }   
    }
}

// Not a page reload
function notAPageReload() {
    let humanFleet = document.querySelector('#human-fleet');
    humanFleet.innerHTML = "";
    let computerOcean = document.querySelector('#enemy-ocean');
    computerOcean.innerHTML= "";

    createHumanFleet();
    createEnemyOcean();
    addCompSquareListeners();
}

///////////////////////// DRAG AND DROP  

//function to rotate 
function rotateShipShape() {
    doTheSwitcheroo(this);
 
    let oldTileCoords = this.dataset.coords;
        if(oldTileCoords === undefined) {
        return true;
    } else {
        let oldTileCoords = this.dataset.coords.split(',');
        let tileID = parseInt(oldTileCoords[0]);
        let shipShapeLength = this.dataset.num;
        let shipDirection = findDirection(this);
        let newCoords = findCoords(tileID, shipShapeLength, shipDirection);
        console.log(`should be tall or long: ${shipDirection}`);
        let validStatus = validateCoords(newCoords, shipDirection);
        console.log(`should be true: ${validStatus}`);
        if(validStatus) {
            console.log('please fire');
            if(oldTileCoords != undefined) {
                clearOldTiles(oldTileCoords);
            }
            this.setAttribute('data-coords', newCoords);
            changeTileColors(newCoords);
        } else {return false}
    }
}

// actual rotate funciton
function doTheSwitcheroo(ship) {
    // if long, change to tall
    let currentShipShape = ship;
    let classes = currentShipShape.className.split(' ');
    if(classes.includes('long')) {
        currentShipShape.classList.remove('long');
        currentShipShape.classList.add('tall');
    } else if(classes.includes('tall')) {
        currentShipShape.classList.remove('tall');
        currentShipShape.classList.add('long');
    }
}

// Function that creates a bank of ship shapes
function createShipBank() {
    let shipZone = document.querySelector('#right');
    shipZone.innerHTML = "";

    let shipTitle = document.createElement('p');
    shipTitle.innerHTML = "";
    
    let shipBank = document.createElement('div');
    shipBank.classList.add('gameboard');
    shipBank.setAttribute("id", "enemy-ocean");
    
    let carrierShip = document.createElement('div');
    carrierShip.classList.add('shipShape', 'carriership', 'long');
    carrierShip.setAttribute("draggable", "true");
    carrierShip.setAttribute("data-num", 5);
    shipBank.appendChild(carrierShip);

    let battleShip = document.createElement('div');
    battleShip.classList.add('shipShape', 'battleship', 'long');
    battleShip.setAttribute("draggable", "true");
    battleShip.setAttribute("data-num", 4);
    shipBank.appendChild(battleShip);

    let destroyerShip = document.createElement('div');
    destroyerShip.classList.add('shipShape', 'destroyership', 'long');
    destroyerShip.setAttribute("draggable", "true");
    destroyerShip.setAttribute("data-num", 3);
    shipBank.appendChild(destroyerShip);
    
    let submarineShip = document.createElement('div');
    submarineShip.classList.add('shipShape', 'submarineship', 'long');
    submarineShip.setAttribute("draggable", "true");
    submarineShip.setAttribute("data-num", 3);
    shipBank.appendChild(submarineShip);

    let patrolShip = document.createElement('div');
    patrolShip.classList.add('shipShape', 'patrolship', 'long');
    patrolShip.setAttribute("draggable", "true");
    patrolShip.setAttribute("data-num", 2);
    shipBank.appendChild(patrolShip);

    let lockInBtn = document.createElement('button');
    lockInBtn.innerHTML = "Lock In My Board";
    lockInBtn.addEventListener('click', lockInBoard);
    shipTitle.appendChild(lockInBtn);

    let randomBtn = document.createElement('button');
    randomBtn.innerHTML = "Randomly Place My Ships";
    //randomBtn.addEventListener('click', randomHumanFleet);

    shipZone.appendChild(shipBank);
    shipZone.appendChild(shipTitle);
}
// Function to add Event Listeners to the ships
function addShipShapeEventListeners() {
    let shipShapes = document.querySelectorAll('.shipShape');
    for(let i = 0; i < shipShapes.length; i++) {
        let currentShipShape = shipShapes[i];
        currentShipShape.addEventListener('dragstart', dragStart);
        currentShipShape.addEventListener('dragend', dragEnd);
        currentShipShape.addEventListener('dblclick', rotateShipShape);
    }
}
// drag functions
function dragStart() {
    this.classList.add('hold');
    setTimeout(() => (this.classList.add('invisible')), 0);
    this.classList.add('fill');
    if(this.dataset.coords != undefined) {
        console.log('has coords');
    }
}
function dragEnd() {
    this.classList.remove('hold', 'invisible', 'fill');
   
}
// Listeners for DRAG AND DROP
function addDragAndDropCompSquareListeners() {
    let computerSquares = document.querySelectorAll('.square');
    for(let i = 0; i < computerSquares.length; i++) {
        let currentSquare = computerSquares[i];
        currentSquare.addEventListener('dragover', dragOver);
        currentSquare.addEventListener('dragenter', dragEnter);
        currentSquare.addEventListener('dragleave', dragLeave);
        currentSquare.addEventListener('drop', dragDrop);   
    }
}
function dragOver(e) {
    //console.log('over')
    e.preventDefault();
}

function dragEnter(e) {
    //console.log('enter');
    e.preventDefault();
    this.classList.add('hovered');
    this.classList.add('blue');
}

function dragLeave() {
    //console.log('leave');
    this.classList.remove('hovered', 'blue');
    
}

function dragDrop(e) {
    
    let tileID = Number(this.dataset.num);
    let currentShipShape = document.querySelector('.fill');
    this.classList.remove('hovered', 'blue');
    
    let shipShapeLength = currentShipShape.dataset.num;
    let shipDirection = findDirection(currentShipShape);
    let newCoords = findCoords(tileID, shipShapeLength, shipDirection);
    let validStatus = validateCoords(newCoords, shipDirection);
    if(validStatus) {
        let oldCoords = currentShipShape.dataset.coords;
        this.append(currentShipShape);
        if(oldCoords != undefined) {
            console.log('about ot fire clean up');
            clearOldTiles(oldCoords);
        }
        currentShipShape.setAttribute('data-coords', newCoords);
        changeTileColors(newCoords);
    } else {
        e.preventDefault()
    }
    
}

// function to change tile classes for ship placement
function findCoords(start, length, direction) {
 let finalCoords = [start];
 if(direction == 'long') {
    for(let i = 1; i < length; i++) {
        finalCoords.push((start + i));
    }
    return finalCoords;
 } else if(direction == 'tall') {
    for(let i = 1; i < length; i++) {
        finalCoords.push((start + (i * 10)));
    }
    return finalCoords;
 }
    
}

// function to clear old ships after reposition
function clearOldTiles(coordinates) {
    let coords = coordinates.split(',');
    let squares = document.querySelectorAll('.square');
    for(let i = 0; i < squares.length; i++) {
        let currentSquare = squares[i];
        let currentSquareID = parseInt(currentSquare.dataset.num);
        for(let j = 0; j < coords.length; j++) {
            if(currentSquareID == coords[j]) {
                let classes = currentSquare.className.split(' ');
                if(classes.includes('ship')) {
                    currentSquare.classList.remove('ship');
                    currentSquare.classList.add('water');
                }
            }
            
        }
    }

}

//function to change tile classes after drop
function changeTileColors(coords) {
    //console.log(`should be array ${typeof coords}`);
    let squares = document.querySelectorAll('.square');
    for(let i = 0; i < squares.length; i++) {
        let currentSquare = squares[i];
        let currentSquareID = parseInt(currentSquare.dataset.num);
        for(let j = 0; j < coords.length; j++) {
            if(currentSquareID == coords[j]) {
                let classes = currentSquare.className.split(' ');
                if(classes.includes('water')) {
                    currentSquare.classList.remove('water');
                    currentSquare.classList.add('ship');
                }
            }
            
        }
    }
}

function validateCoords(coords, dir) {
    // if tall - check for negatives and #s > 100
    if(dir == 'tall') {
        console.log(`1 is tall`);
        for(let i = 0; i < coords.length; i++) {
            if(coords[i] < 0 || coords[i] > 99) {
                return false;
            }
        }
    }
    // if long -  check for new line
    if(dir == 'long') {
        for(let i = 0; i < coords.length; i++) {
            let number = coords[i];
            if(number % 10 == 0) {
                let theNine = number - 1;
                if(coords.includes(theNine)) {
                    return false;
                  }
            }
        }
    }

    // checking for ships
    for(let j = 0; j < coords.length; j++) {
        let squares = document.querySelectorAll('.square');
        for(let p = 0; p < squares.length; p++) {
            let currentSquare = squares[p];
            let squareID = parseInt(currentSquare.dataset.num);
            if(coords[j] == squareID) {
                let classes = squares[p].className.split(' ');
                if(classes.includes('ship')) {
                    console.log('shold fire');
                    return false;
                } 
            } 
        }
    }
    return true
}
// function to get current shipShape direction
function findDirection(shipShape) {
    let classes = shipShape.className.split(' ');
    if(classes.includes('long')) {
        return 'long';
    } else if(classes.includes('tall')) {
        return 'tall';
    }
}

//function to create a lockin block that starts the game
function lockInBoard() {
    //check shipBank for unplaced Ships
    let shipBank = document.querySelector('#enemy-ocean');
    if(shipBank.childNodes.length > 1) {
        alert('Please Place the Rest of Your Fleet!');
        return false;
    }
    let shipShapes = document.querySelectorAll('.shipShape');
    for(let i = 0; i < shipShapes.length; i++) {
        let currentShipShape = shipShapes[i];
        let currentCoords = currentShipShape.dataset.coords.split(',');
        let shipCoords = [];
        
        for(let p = 0; p < currentCoords.length; p++) {
            shipCoords.push(parseInt(currentCoords[p]));
        }
        let shipLength = shipCoords.length;
        let newShip = humanGB.createShip(shipLength, shipCoords);
    }
    
    notAPageReload()
}


// function for ship placer loading
function shipPlacer() {
    createHumanFleet();
    createShipBank();
    addShipShapeEventListeners();
    addDragAndDropCompSquareListeners();
}

///////////////////////////// functions for loading the page
document.addEventListener('DOMContentLoaded', function() {
    shipPlacer();
}, false);




