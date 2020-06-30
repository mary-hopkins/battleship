
// factory function to create ships
const Ship = (
    shipLength,
    sunk,
    healthBar,
    coordinates = healthBar
  ) => {
  
    const getshipLength = () => shipLength;
    const getSunk = () => sunk;
    const getHealthBar = () => healthBar;
    const getCoords = () => coordinates;
  
    const checkSunk = function () {
      let hitCounter = 0;
      for(let i = 0; i < shipLength; i++) {
        if(healthBar[i] == "X") {
          hitCounter = hitCounter + 1;
        }
      }
      if(hitCounter == shipLength) {
        sunk = true;
      }
    }

    const hit = function (number) {
      let index = healthBar.indexOf(number);
      healthBar[index] = "X";
      checkSunk();
    }

    return {
      getshipLength,
      getSunk,
      getCoords,
      getHealthBar,
      hit,
      
    };
  };
  
const Gameboard = (
  playerNumber,
  defeated = false
    
) => {

  const makeCoordinates = () => {
    let coordinates = [];
    for(let i = 0; i < 100; i++) {
      let newSquare = {struck: false, hasShip: false, squareId: i};
      coordinates.push(newSquare);
    }
    return coordinates;
  }

  let coordinates = makeCoordinates();
  let shipsArray = [];


  const createShip = (size, coords) => {
    let newShip = Ship(size, false, coords);
    placeShip(coords); // mark square as hasShip true
    shipsArray.push(newShip) // Save ship in array
    return newShip;
  }

  function placeShip(coords) {
    for(let i = 0; i < coords.length; i++) {
      let currentCoordinates = coords[i];
      let currentSquare = findSquare(currentCoordinates);
      currentSquare.hasShip = true;
    }
  }

  function findShip(coord) {
    for(let i = 0; i < shipsArray.length; i++) {
      let currentShipCoords = shipsArray[i].getCoords();
      if(currentShipCoords.includes(coord)) {
        return shipsArray[i];
      }
    }
  }

  function findSquare(coord) {
    for(let i = 0; i < coordinates.length; i++) {
      let currentSquare = coordinates[i];
      if(currentSquare.squareId == coord) {
        return currentSquare;
      }
    }
  }

  const receiveAttack = (coord) => {
    let targetSquare = findSquare(coord);
    targetSquare.struck = true;
    if(targetSquare.hasShip) {
      let targetShip = findShip(coord);
      targetShip.hit(coord); // hit message to ship
    }
    checkDefeat();
  }
/* 

1 ship of 5
2 ship of 4
3 ship of 3
4 ship of 2

*/

const checkDefeat = () => {
  let fleet = shipsArray.length;
  for(let i = 0; i < shipsArray.length; i++) {
    if(shipsArray[i].getSunk()) {
      fleet--;
    }
  }
  if(fleet == 0) {
    defeated = true;  
    return true;
  } else {return false}
}

  const getPlayerNumber = () => playerNumber;
  const getCoord = (num) => coordinates[num];
  const getCoords = () => coordinates;
  const getDefeated = () => defeated;
  

  return {
    
    getPlayerNumber,
    getCoords,
    getCoord,
    createShip,
    receiveAttack,
    getDefeated
  };

}

// factory function to create Players
const Player = (
  playerNumber
) => {

  const createGameBoard = () => {
    let newBoard = Gameboard(playerNumber);
    return newBoard;
  }
  let gameBoard = createGameBoard();

   
  // Sends attack from Human Player to Computer GameBoard
  //// Will be called from DOM on click
  function humanShootsComputer(compGB, coord) {
    let computerGameBoard = compGB;
    computerGameBoard.receiveAttack(coord);  
  }

  //Sends attack from Computer Player to Human GameBoard
  //// Will be called as part of the game loop
  function computerShootsHuman(humanGB) {
    let legalMove = findLegalMove(humanGB);
    humanGB.receiveAttack(legalMove);
  }


  function findLegalMove(humanGB) {
    let coordinates = humanGB.getCoords();
    for(let i = 0; i < 100; i++) {
      let randoNumber = Math.floor(Math.random() * Math.floor(100));
      for(let i = 0; i < coordinates.length; i++) {
        if(coordinates[i].squareId == randoNumber) {
          if(coordinates[i].struck == false) {
            
            return randoNumber;
          }
        }
      } 
    }
  }

  function testHitAllSquares(exemption) {
    let coordinates = gameBoard.getCoords();
    for(let i = 0; i < coordinates.length; i++) {
      let currentSquare = coordinates[i];
      if(currentSquare.squareId != exemption) {
        currentSquare.struck = true;
      } else if (currentSquare.squareId == exemption) {
        currentSquare.struck = false;
      }
    }
  }

const getPlayerNumber = () => playerNumber;
const getGameBoard = () => gameBoard;


  return {
    getPlayerNumber,
    getGameBoard,
    humanShootsComputer,
    findLegalMove,
    testHitAllSquares,
    computerShootsHuman
  };
};

const Game = (

) => {

  let playersArray = [];
  const createPlayer = (num) => {
    let newPlayer = Player(num);
    playersArray.push(newPlayer);
    return newPlayer;
  }
  let playerOne = createPlayer(1);
  let playerTwo = createPlayer(2);

  function getPlayer(num) {
    for(let i = 0; i < playersArray.length; i++) {
      if(playersArray[i].getPlayerNumber() == num) {
        return playersArray[i];
      }
    }
  } 

  return {
    getPlayer,
    
  };
};



export {
  Game
};
//////////////////// Exports
// module.exports = {
//     Ship,
//     Gameboard,
//     Player,
//     Game
// };

