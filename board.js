const { startGame, playGame } = require('./battleship')

const gameBoard = [];

const printBoard = (board, debug) => {
  for (let i = 0; i < board.length; i++) {
    let row = ''; // create a row variable for this
    for (let j = 0; j < board[i].length; j++) {
      const cell = board[i][j];
      let cellStr;
      if (debug) {
        cellStr = cell.marker.padEnd(2);
      } else { 
        cellStr = (cell.hit ? cell.marker : '-').padEnd(2);
      }
      row += cellStr + ' ';
    }
    console.log(row);
  }
};

const generateBoard = num => {
  for (let i = 0; i < num; i++) {
    gameBoard.push([]);
    for (let j = 0; j < num; j++) {
      gameBoard[i].push({type: 'empty', hit: false, marker: '❗'});
    }
  }
  generateShips(gameBoard);
};

const generateShips = (gameBoard) => {
  const smallShipCount = Math.floor((gameBoard.length + 1) / 2) - 1;
  let smallCounter = 0;
  const smallShipLength = 2;
  const largeShipCount = Math.floor(gameBoard.length / 2) - 1;
  let largeCounter = 0;
  const largeShipLength = 3;
  let idCounter = 1;

  while (largeCounter < largeShipCount) {
    const randomRow = Math.floor(Math.random() * gameBoard.length);
    const randomCol = Math.floor(Math.random() * gameBoard.length);
    const direction = Math.floor(Math.random() * 2);
    if (canPlaceShip(gameBoard, randomRow, randomCol, direction, largeShipLength)) {
      placeShip(gameBoard, randomRow, randomCol, direction, largeShipLength, idCounter)
      idCounter++;
      largeCounter++;
    }
  }
  while (smallCounter < smallShipCount) {
    const randomRow = Math.floor(Math.random() * gameBoard.length);
    const randomCol = Math.floor(Math.random() * gameBoard.length);
    const direction = Math.floor(Math.random() * 2);
    if (canPlaceShip(gameBoard, randomRow, randomCol, direction, smallShipLength)) {
      placeShip(gameBoard, randomRow, randomCol, direction, smallShipLength, idCounter)
      idCounter++;
      smallCounter++;
    }
  }
  playGame(gameBoard);
};

const canPlaceShip = (board, row, col, direction, length) => {
  for (let i = 0; i < length; i++) {
    const r = direction === 0 ? row + i : row;
    const c = direction === 0 ? col : col + i;
    if (r >= board.length || c >= board[r].length || board[r][c].type !== 'empty') {
      return false;
    }
  }
  return true;
};

const placeShip = (board, row, col, direction, length, id) => {
  for (let i = 0; i < length; i++) {
    const r = direction === 0 ? row + i : row; 
    const c = direction === 0 ? col : col + i;
    if (length === 3) {
      board[r][c] = { type: 'large', hit: false, id: id, marker: '🟠' };
    }
    if (length === 2) {
      board[r][c] = { type: 'small', hit: false, id: id, marker: '🔵' };
    }
  }
};

module.exports = { generateBoard, generateShips };