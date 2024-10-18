const rs = require('readline-sync');

// Build a renderer

// printBoard function
// takes two arguments: board and debug
// debug will just help us determine if our board is set up correctly, by showing the ships or not

const board = [
  [
    { type: "large", hit: false }, // A0
    { type: "small", hit: true }, // A1
    { type: "small", hit: false }, // A2
  ],
  [
    { type: "large", hit: false }, // B0
    { type: "empty", marker: '❗', hit: false }, // B1
    { type: "empty", marker: '❗', hit: true }, // B2
  ],
  [
    { type: "large", hit: false }, // C0
    { type: "empty", marker: '❗', hit: false }, // C1
    { type: "empty", marker: '❗', hit: false }, // C2
  ],
];



const gameBoard = [];



// debug false = normal; true = show ships
const printBoard = (board, debug) => {
  for (let i = 0; i < board.length; i++) { // iterate over the rows of the board
    let row = ''; // create a row variable for this
    for (let j = 0; j < board[i].length; j++) { // iterate over each element in the row
      const cell = board[i][j]; // create a variable for each cell in the row
      let cellStr; // create a variable for the string in the cell, so we can use padEnd for spacing
      if (debug) { // test if debug is true or false
        cellStr = cell.marker.padEnd(2); // if debug is true, just print the marker. padEnd() just helps with the spacing
      } else { 
        cellStr = (cell.hit ? cell.marker : '-').padEnd(2); // otherwise print marker only if cell has been hit
      }
      row += cellStr + ' ';
    }
    console.log(row); // log out each row after the iterations
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

// pick a random number between 0 and gameBoard.length (rows), then another between 0 and gameBoard[i].length (columns)
// generate the bow of the ship at this point. Then place the other points in a straight line (vert or horizontal) from the bow

// board size determines the amount of ships. 4x4 has 1la 1sm, 5x5 has 1la 2sm, 6x6 has 2la 2sm
// small ships = Math.floor((boardSize + 1) / 2) - 1
// Large ships = Math.floor(boardSize / 2) - 1



// This is terribly inefficient. Could loop theoretically infinitely if it does not find a spot for a ship
const generateShips = (gameBoard) => {
  const smallShipCount = Math.floor((gameBoard.length + 1) / 2) - 1; // Determines the number of small ships to generate
  let smallCounter = 0;
  const smallShipLength = 2;
  const largeShipCount = Math.floor(gameBoard.length / 2) - 1; // Determines the number of large ships to generate
  let largeCounter = 0;
  const largeShipLength = 3;
  let idCounter = 1;

  while (largeCounter < largeShipCount) {
    const randomRow = Math.floor(Math.random() * gameBoard.length); // pick a random row in the game gameBoard
    const randomCol = Math.floor(Math.random() * gameBoard.length);
    const direction = Math.floor(Math.random() * 2); // 0 for vertical, 1 for horizontal
    if (canPlaceShip(gameBoard, randomRow, randomCol, direction, largeShipLength)) {
      placeShip(gameBoard, randomRow, randomCol, direction, largeShipLength, idCounter)
      idCounter++;
      largeCounter++;
    }
  }
  while (smallCounter < smallShipCount) {
    const randomRow = Math.floor(Math.random() * gameBoard.length); // pick a random row in the game gameBoard
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



// check if the ship can be placed
const canPlaceShip = (board, row, col, direction, length) => {
  for (let i = 0; i < length; i++) {
    const r = direction === 0 ? row + i : row; // vertical
    const c = direction === 0 ? col : col + i; // horizontal
    // check if OoB or not empty
    if (r >= board.length || c >= board[r].length || board[r][c].type !== 'empty') {
      return false;
    }
  }
  return true;
};



// place the ship
const placeShip = (board, row, col, direction, length, id) => {
  for (let i = 0; i < length; i++) {
    const r = direction === 0 ? row + i : row; // vertical
    const c = direction === 0 ? col : col + i; // horizontal
    if (length === 3) {
      board[r][c] = { type: 'large', hit: false, id: id, marker: '🟠' };
    }
    if (length === 2) {
      board[r][c] = { type: 'small', hit: false, id: id, marker: '🔵' };
    }
  }
};


// time to play the game!
// import the game board, now with generated ships
// didn't think i'd make it this far in the project
// but here we are, playing the game
// get the player's input (a1, b2, etc...)
// check if the input is valid (in bounds, not already hit)
// if valid, mark the cell as hit and check if the ship is sunk

const playGame = (gameBoard) => {
  let allShipsSunk = false;
  while (!allShipsSunk) {
    // print the current game state
    printBoard(gameBoard, false);

    // Get the user's input on where they would like to hit
    const userHit = rs.question(`Where would you like to strike (a1, b2...)?  `);

    // check if input is valid
    const splitStr = userHit.split('');
    const row = (splitStr[0].toLowerCase().charCodeAt()) - 97;
    const col = parseInt(splitStr[1]) - 1;

    if (row < 0 || row >= gameBoard.length || col < 0 || col >= gameBoard.length) {
      console.log(`You have to hit the board!`);
    } else if (gameBoard[row][col].hit === true) {
      console.clear();
      console.log(`You already hit that spot!`);
    } else {
      // if valid, mark the cell as hit
      gameBoard[row][col].hit = true;
      if (gameBoard[row][col].id === undefined) {
        console.clear();
        console.log(`Miss! Try again!`)
      } else {
        console.clear();
        console.log(`GOOD HIT! GIVE 'EM ANOTHER ADMIRAL!`)
      }
      // check if ship is sunk
      if (checkShipSunk(gameBoard, row, col)) {
        console.log(`You sunk my battleship!`);
      }
      // check if ALL ships are sunk. If so, end the game
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


// playGame(generateShips(generateBoard(4)));

// playGame(generateShips(generateBoard(4)));

// printBoard((generateShips(generateBoard(6))), false);
// console.log(gameBoard);


// console.log(`---------------------`)
// printBoard((generateShips(generateBoard(6))), true);
// console.log(`---------------------`)
// printBoard((generateShips(generateBoard(6))), true);
// console.log(`---------------------`)
// printBoard((generateShips(generateBoard(6))), true);
// console.log(`---------------------`)
// printBoard((generateShips(generateBoard(6))), true);
// console.log(`---------------------`)
