
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
  let fleetCreated = createFleet();


  function createShip(size, coords) {
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

  // Function to set ComputerShips
  function createFleet() {
    if(playerNumber == 1) {return false;}
    let fleetArray = [5, 4, 3, 3, 2];
    while(!fleetArray.length == 0) {
      for(let i = 0; i < fleetArray.length; i++) {
        let coords = findAvailableCoords(fleetArray[i]);
        if(coords.length == fleetArray[i]) {
          let hmsTest = createShip(fleetArray[i], coords);
          fleetArray.splice(i, 1);
        }
      }
    }
    return true;
  }

  function findAvailableCoords(length) {
    let finalArray = [];
    let startPoint = (Math.floor(Math.random() * Math.floor(99)));
    if(startPoint % 2 == 0) {
      finalArray = tryLeftRight(length, startPoint);
      if(finalArray) {
        return finalArray;
      } else {return false}
    } else {
      finalArray = tryUpDown(length, startPoint);
      if(finalArray) {
        return finalArray;
      } else {return false}
    }
  }

  function tryUpDown(length, start) {
    let result = [start];
    let bigCount = start;
    for(let i = 0; i < 5; i++) {
      let biggerNumber = bigCount + 10;
      result.push(biggerNumber);
      bigCount += 10;
    }
    let smallCount = start;
    for(let j = 1; j < 5; j++) {
      let smallerNumber = smallCount - 10;
      result.push(smallerNumber);
      smallCount -= 10;
    }
    let verdict = validateResults(result, length);
    if(!verdict) {
      return false;
    } else {
      return verdict;
    }
  }

  function tryLeftRight(length, startPoint) {
    let result = [startPoint];
    let bigCounter = startPoint;
    let smallCounter = startPoint;
    for(let i = 0; i < 10; i++) {
      let biggerNumber = bigCounter + 1;
      result.push(biggerNumber)
      bigCounter += 1;
    }
    for(let j = 0; j < 10; j++) {
      let smallerNumber = smallCounter - 1;
      result.push(smallerNumber);
      smallCounter -= 1;
    }
    let verdict = validateResults(result, length);
    if(!verdict) {
      return false;
    } else {
      let trueVerdict = testForNewLine(verdict);
      if(!trueVerdict) {
        return false;
      } else {
        return trueVerdict
      }
    }
  }

  function testForNewLine(array) {
    for(let i = 0; i < array.length; i++) {
      let number = array[i];
      if(number % 10 == 0) {
        let theNine = number - 1;
        if(array.includes(theNine)) {
          return false;
        }
      }
    }
    return array;
  }

  function validateResults(array, length) {
    let filterBigs = array.filter(array => array >= 0);
    let filterSmalls = filterBigs.filter(filterBigs => filterBigs < 100);
    let optionsArray = filterSmalls.sort((a, b) => a - b);
    let finalResults = [];
    while(finalResults.length < length) {
      for(let j = 0; j < optionsArray.length; j++) {
        if(isSquareOpen(optionsArray[j])) {
          finalResults.push(optionsArray[j]);
        } else {
          finalResults = [];
        }
        
      }
      if(finalResults.length < length) {
      return false;
      }
    }
    finalResults = finalResults.splice(0, length);
    return finalResults;
  }

  function isSquareOpen(coord) {
    for(let i = 0; i < coordinates.length; i++) {
      if(coordinates[i].squareId == coord) {
        if(coordinates[i].hasShip == false) {
          return true;
        } else {return false}
      }
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
    let hasAShip = false;
    if(targetSquare.hasShip) {
      let targetShip = findShip(coord);
      targetShip.hit(coord); // hit message to ship
      hasAShip = true;
    }
    checkDefeat();
    return hasAShip;
  }

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
    getDefeated,
    findSquare,
    findAvailableCoords
  };

}

// factory function to create Players
const Player = (
  playerNumber
) => {

  let possibleShips = [];

  const createGameBoard = () => {
    let newBoard = Gameboard(playerNumber);
    return newBoard;
  }
  let gameBoard = createGameBoard();


  // Sends attack from Human Player to Computer GameBoard
  function humanShootsComputer(compGB, coord) {
    let computerGameBoard = compGB;
    computerGameBoard.receiveAttack(coord);  
  }
  

// Function to handle AI options array
  function getOptionsArray(legalMove) {
    let optionsArray = [];
    optionsArray.push(legalMove + 10);
    optionsArray.push(legalMove - 10);
    optionsArray.push(legalMove - 1);
    optionsArray.push(legalMove + 1);
    return optionsArray;
  }

  //function to remove negative numbers from the options array
  function removeNegatives(array) {
    let holderArray = [];
    for(let i = 0; i < array.length; i++) {
      if(array[i] <= 99) {
        if(array[i] >=0 ) {
          holderArray.push(array[i]);
        }
      }
    }
    return holderArray;
  }

  //function to remove struck squares from options array
  function removeStruckSquares(array, coordinates) {
    for(let i = 0; i < array.length; i++) {
      let theMove = array[i];
      for(let j = 0; j < 100; j++) {
        let currentCoord = coordinates[j];
        if(theMove == currentCoord.squareId) {
          if(currentCoord.struck == true) {
            array.splice(i, 1);
          }
        }
      }
    }
    return array
  }

  function cleanPossibleShips(GB) {
    let coordinates = GB.getCoords();
    for(let i = 0; i < possibleShips.length; i++) {
      let theMove = possibleShips[i];
      for(let j = 0; j < 100; j++) {
        let currentCoord = coordinates[j];
        if(theMove == currentCoord.squareId) {
          if(currentCoord.struck == true) {
            possibleShips.splice(i, 1);
            if(possibleShips.length == 1) {
              possibleShips = [];
            }
          }
        }
      }
    }
    return possibleShips;
  }

  //Sends attack from Computer Player to Human GameBoard
  function computerShootsHuman(humanGB) {
    let legalMove = findLegalMove(humanGB);
    let hitBoolean = false;
    possibleShips = cleanPossibleShips(humanGB);
    if(possibleShips.length == 0) { 
      hitBoolean = humanGB.receiveAttack(legalMove);
      if(hitBoolean) {
        let coordinates = humanGB.getCoords();
        let optionsArray = getOptionsArray(legalMove);
        optionsArray = removeNegatives(optionsArray);
        optionsArray = removeStruckSquares(optionsArray, coordinates);
        possibleShips = optionsArray;
      }
    } else {
      hitBoolean = humanGB.receiveAttack(possibleShips[0]);
      possibleShips.splice(0, 1);
    }
  }

  function findLegalMove(humanGB) {
    let coordinates = humanGB.getCoords();
    let failSafe = true;
    while(failSafe) {
      let randoNumber = Math.floor(Math.random() * Math.floor(99));
      for(let i = 0; i < coordinates.length; i++) {
        if(coordinates[i].squareId == randoNumber) {
          if(coordinates[i].struck == false) {
            failSafe = false;
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
    computerShootsHuman,
    getOptionsArray,
    removeNegatives
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
  Ship,
  Gameboard,
  Player,
  Game
};