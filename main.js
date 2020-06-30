import { Game } from "./ships.js";

let newGame = Game();
let humanPlayer = newGame.getPlayer(1);
let computerPlayer = newGame.getPlayer(2);

let humanGB = humanPlayer.getGameBoard();
let computerGB = computerPlayer.getGameBoard();

let humanCoordinates = humanGB.getCoords();
let computerCoordinates = computerGB.getCords();

let jollyRoger = humanGB.createShip(3, [71, 72, 73]);
let dingy = humanGB.createShip(1, [32]);
let destroyer = humanGB.createShip(5, [17, 27, 37, 47, 57]);
// functions for loading the page

// functions to create human-fleet
function createHumanFleet() {
    let humanFleet = document.querySelector('#human-fleet');
    let humanCoordinates = humanGB.getCoords();
    for(let i = 0; i < humanCoordinates.length; i++) {
        let newTile = document.createElement('div');
        if(humanCoordinates[i].hasShip == true) {
            newTile.classList.add("ship");
        } else if (humanCoordinates[i].hasShip == false) {
            newTile.classList.add("water");
        }
        humanFleet.appendChild(newTile);
    } 
}


document.addEventListener('DOMContentLoaded', function() {
    createHumanFleet();
}, false);
// functions to create enemy-ocean

// restart settings
