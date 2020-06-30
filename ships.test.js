const functions = require('./ships');
const { Gameboard } = require('./ships');

/// SHIPS //////
test('setup works', () => {
    let playerOne = functions.Gameboard(1);
    let jollyRoger = playerOne.createShip(3, [71, 72, 73]);
    expect(jollyRoger).toBeDefined();
});

test('ships should have correct Length', () => {
    let playerOne = functions.Gameboard(1);
    let jollyRoger = playerOne.createShip(3, [71, 72, 73]);
    expect(jollyRoger.getshipLength()).toBe(3);
});

test('ships have a sunk boolean', () => {
    let playerOne = functions.Gameboard(1);
    let jollyRoger = playerOne.createShip(3, [71, 72, 73]);
    expect(jollyRoger.getSunk()).toBe(false);
})

test('ships have a health bar the size of their length', () => {
    let playerOne = functions.Gameboard(1);
    let jollyRoger = playerOne.createShip(3, [71, 72, 73]);
    expect(jollyRoger.getHealthBar()).toEqual([71, 72, 73]);
});

test('ships can be hit at a certain point', () => {
    let playerOne = functions.Gameboard(1);
    let jollyRoger = playerOne.createShip(3, [71, 72, 73]);
    jollyRoger.hit(72);
    expect(jollyRoger.getHealthBar()).toEqual([71, "X", 73]);
});

test('ships that have been hit in all slots will be marked sunk', () => {
    let playerOne = functions.Gameboard(1);
    let jollyRoger = playerOne.createShip(3, [71, 72, 73]);
    jollyRoger.hit(72);
    jollyRoger.hit(71);
    jollyRoger.hit(73);
    expect(jollyRoger.getSunk()).toBe(true);
});

/////// Gameboard /////// GB == Gameboard
test('coordinates array should be 100', () => {
    let playerOne = functions.Gameboard(1);
    let coords = playerOne.getCoords();
    expect(coords).toHaveLength(100);
});

test('ships will be placed at specific locations', () => {
    let playerOne = functions.Gameboard(1);
    let jollyRoger = playerOne.createShip(3, [71, 72, 73]);
    expect(jollyRoger.getHealthBar()).toEqual([71, 72, 73])
});

test('receive attack should hit the correct ship', () => {
    let playerOne = functions.Gameboard(1);
    let jollyRoger = playerOne.createShip(3, [71, 72, 73]);
    let dingy = playerOne.createShip(1, [32]);
    let destroyer = playerOne.createShip(5, [17, 27, 37, 47, 57]);
    playerOne.receiveAttack(37);
    expect(destroyer.getHealthBar()).toEqual([17, 27, "X", 47, 57]);
});

test('ship squares should also be marked as struck', () => {
    let playerOne = functions.Gameboard(1);
    let destroyer = playerOne.createShip(5, [17, 27, 37, 47, 57]);
    playerOne.receiveAttack(37);
    let targetSquare = playerOne.getCoord(37);
    expect(targetSquare.struck).toBe(true);
});

test('reveive attack marks a coord as struck', () => {
    let playerOne = functions.Gameboard(1);
    playerOne.receiveAttack(25);
    let targetSquare = playerOne.getCoord(25);
    expect(targetSquare.struck).toBe(true);

});


test('GB should know when all ships have been lost', () => {
    let playerOne = functions.Gameboard(1);
    let jollyRoger = playerOne.createShip(3, [71, 72, 73]);
    let dingy = playerOne.createShip(1, [32]);
    let destroyer = playerOne.createShip(5, [17, 27, 37, 47, 57]);
    playerOne.receiveAttack(71);
    playerOne.receiveAttack(72);
    playerOne.receiveAttack(73);
    playerOne.receiveAttack(32);
    playerOne.receiveAttack(17);
    playerOne.receiveAttack(27);
    playerOne.receiveAttack(37);
    playerOne.receiveAttack(47);
    playerOne.receiveAttack(57);
    expect(playerOne.getDefeated()).toBe(true);
});

test('Human Player attacks the Computers gameboard', () => {
    let newGame = functions.Game();
    let playerOne = newGame.getPlayer(1);
    let playerTwo = newGame.getPlayer(2);
    let computerGB = playerTwo.getGameBoard();
    let jollyRoger = computerGB.createShip(3, [71, 72, 73]);
    playerOne.humanShootsComputer(computerGB, 72);
    expect(jollyRoger.getHealthBar()).toEqual([71, "X", 73]);
});

test('Computer attacks human randomly, but never a struck square', () => {
    let newGame = functions.Game();
    let playerOne = newGame.getPlayer(1);
    let playerTwo = newGame.getPlayer(2);
    let humanGB = playerOne.getGameBoard();
    playerOne.testHitAllSquares(12);
    playerTwo.computerShootsHuman(humanGB);
    let targetSquare = humanGB.getCoord(12);
    expect(targetSquare.struck).toBe(true);
});

test('find legal move finds a legal move', () => {
    let newGame = functions.Game();
    let playerOne = newGame.getPlayer(1);
    let humanGB = playerOne.getGameBoard();
    playerOne.testHitAllSquares(12);
    let moveSquare = playerOne.findLegalMove(humanGB);
    expect(moveSquare).toEqual(12);
});

test('test hits all squares execpt exemption', () => {
    let newGame = functions.Game();
    let playerOne = newGame.getPlayer(1);
    playerOne.testHitAllSquares(12);
    let playerGB = playerOne.getGameBoard();
    let targetSquare = playerGB.getCoord(12);
    expect(targetSquare.struck).toBe(false);
});

test('test  hits all squares', () => {
    let newGame = functions.Game();
    let playerOne = newGame.getPlayer(1);
    playerOne.testHitAllSquares(12);
    let playerGB = playerOne.getGameBoard();
    let targetSquare = playerGB.getCoord(74);
    expect(targetSquare.struck).toBe(true);
});