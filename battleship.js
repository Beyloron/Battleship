const { generateBoard, generateShips } = require('./board');
const rs = require('readline-sync');

const playGame = (gameBoard) => {
  let allShipsSunk = false;
  while (!allShipsSunk) {
    printBoard(gameBoard, false);
    const userHit = rs.question(`Where would you like to strike (a1, b2...)?  `);
    const splitStr = userHit.split('');
    const row = (splitStr[0].toLowerCase().charCodeAt()) - 97;
    const col = parseInt(splitStr[1]) - 1;

    if (row < 0 || row >= gameBoard.length || col < 0 || col >= gameBoard.length) {
      console.log(`You have to hit the board!`);
    } else if (gameBoard[row][col].hit === true) {
      console.clear();
      console.log(`You already hit that spot!`);
    } else {
      gameBoard[row][col].hit = true;
      if (gameBoard[row][col].id === undefined) {
        console.clear();
        console.log(`Miss! Try again!`)
      } else {
        console.clear();
        console.log(`GOOD HIT! GIVE 'EM ANOTHER ADMIRAL!`)
      }
      if (checkShipSunk(gameBoard, row, col)) {
        console.log(`You sunk my battleship!`);
      }
      allShipsSunk = checkAllShipsSunk(gameBoard);
      if(allShipsSunk) {
        printBoard(gameBoard);
        console.log(`Great job Admiral, you did it!`);
        console.log(String.raw`
========
__   _______ _   _   _    _ _____ _   _
\ \ / /  _  | | | | | |  | |_   _| \ | |
 \ V /| | | | | | | | |  | | | | |  \| |
  \ / | | | | | | | | |/\| | | | | . ' |
  | | \ \_/ / |_| | \  /\  /_| |_| |\  |
  \_/  \___/ \___/   \/  \/ \___/\_| \_/
========
          `)
        break;
      }
    }
  }
};

const checkShipSunk = (gameBoard, row, col) => {
  const shipID = gameBoard[row][col].id;
  const shipCells = gameBoard.flat().filter(cell => cell.id === shipID);
  return shipCells.every(cell => cell.hit);
};

const checkAllShipsSunk = gameBoard => {
  const allShipCells = gameBoard.flat().filter(cell => cell.type !== 'empty');
  return allShipCells.every(cell => cell.hit);
};

const startGame = () => {
  console.log(`Welcome to Battleship!`);
  const boardSize = rs.question(`What board size would you like? (4, 5, 6): `);
  generateBoard(boardSize);
};

startGame();

module.exports = { startGame, playGame }