import Cell from './Cell.js';
import Grid from './Grid.js';
import Tile from './Tile.js';
import Touch from './Touch.js';
import { keyboardPanel, touchPanel } from './config.js';

const gameboard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');

const grid = new Grid(gameboard);
const touchControls = new Touch();
const isTouchDevice = touchControls.isTouchDevice;

// Creating 2 random tiles
grid.randomEmptyCell().tile = new Tile(gameboard);
grid.randomEmptyCell().tile = new Tile(gameboard);

setupInput();

/**
 * Function to Setup the Input Handler
 * @returns {void}
 */
function setupInput() {
  // For Desktop
  window.addEventListener('keydown', handleInput, { once: true });

  // For Mobile
  touchControls.setupTouch();
  window.addEventListener('swipe', handleInput, { once: true });
}

/**
 * Function to handle the Input
 * @param {Event} e
 * @returns {Void}
 */
async function handleInput(e) {
  let switchParam = e.key;
  let switchPanel = keyboardPanel;

  if (isTouchDevice) {
    switchParam = e.detail.direction;
    switchPanel = touchPanel;
  }
  // Move the tiles around
  switch (switchParam) {
    case switchPanel['up']:
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case switchPanel['down']:
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case switchPanel['left']:
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case switchPanel['right']:
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }

  // Merge the tiles
  grid.cells.forEach((cell) => cell.merge(scoreDisplay));

  // generate new random tile
  const newTile = new Tile(gameboard);
  grid.randomEmptyCell().tile = newTile;

  //   Check if any move is possible
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForTransition(true);
    alert('Game Over - You Lose !!');
    if (confirm('Restart the game ?')) {
      window.location.reload();
    }
  }

  //   setup the input handler again for accepting next input
  setupInput();
}

/**
 * FUNCTIONS TO CHECK WHETHER THE TILES CAN MOVE
 */

/**
 * Function to move the tiles up
 * @returns {boolean}
 */
function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

/**
 * Function to move the tiles down
 * @returns {boolean}
 */
function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

/**
 * Function to move the tiles left
 * @returns {boolean}
 */
function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

/**
 * Function to move the tiles right
 * @returns {boolean}
 */
function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

/**
 * common function to check if the tiles can be moved
 * @param {[[Cell]]} cells
 * @returns {boolean}
 */
function canMove(cells) {
  return cells.some((cellGroup) => {
    return cellGroup.some((cell, index) => {
      if (index == 0) {
        return false;
      }
      if (cell.tile == null) {
        return false;
      }
      const moveToCell = cellGroup[index - 1];
      return moveToCell.canAccept(cell);
    });
  });
}

/**
 * FUNCTIONS TO HANDLE MOVEMENTS OF TILES
 */

/**
 * Function to move the tiles up
 * @returns {Promise}
 */
function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

/**
 * Function to move the tiles down
 * @returns {Promise}
 */
function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

/**
 * Function to move the tiles left
 * @returns {Promise}
 */
function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

/**
 * Function to move the tiles right
 * @returns {Promise}
 */
function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

/**
 * common function to slide the tiles
 * @param {[[Cell]]} cells
 * @returns {Promise}
 */
function slideTiles(cells) {
  const promises = [];

  //   Identify the cells whether they can be moved
  cells.forEach((cellGroup) => {
    for (let i = 1; i < cellGroup.length; i++) {
      const cell = cellGroup[i];
      if (cell.tile == null) continue;
      let lastValidCell;
      for (let j = i - 1; j >= 0; j--) {
        const moveToCell = cellGroup[j];
        if (!moveToCell.canAccept(cell)) {
          break;
        }
        lastValidCell = moveToCell;
      }

      //   Moving the tiles
      if (lastValidCell != null) {
        promises.push(cell.tile.waitForTransition());
        if (lastValidCell.tile != null) {
          lastValidCell.mergeTile = cell.tile;
        } else {
          lastValidCell.tile = cell.tile;
        }
        cell.tile = null;
      }
    }
  });

  return Promise.all(promises);
}
