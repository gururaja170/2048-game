import Cell from './Cell.js';
import config from './config.js';

const { GRID_SIZE, CELL_SIZE, CELL_GAP } = config;

export default class Grid {
  #cells;
  constructor(gridElement) {
    gridElement.style.setProperty('--grid-size', GRID_SIZE);
    gridElement.style.setProperty('--cell-size', `${CELL_SIZE}vmin`);
    gridElement.style.setProperty('--cell-gap', `${CELL_GAP}vmin`);
    this.#cells = createCellElements(gridElement);
  }

  /**
   * getter to return cells
   * @returns {[Cell]}
   */
  get cells() {
    return this.#cells;
  }

  /**
   * getter to return empty cells
   * @returns {[Cell]}
   */
  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  /**
   * getter to return cells by column
   * @returns {[[Cell]]}
   */
  get cellsByColumn() {
    return this.#cells.reduce((cellsGroup, cell) => {
      cellsGroup[cell.col] = cellsGroup[cell.col] || [];
      cellsGroup[cell.col][cell.row] = cell;
      return cellsGroup;
    }, []);
  }

  /**
   * getter to return cells by row
   * @returns {[[Cell]]}
   */
  get cellsByRow() {
    return this.#cells.reduce((cellsGroup, cell) => {
      cellsGroup[cell.row] = cellsGroup[cell.row] || [];
      cellsGroup[cell.row][cell.col] = cell;
      return cellsGroup;
    }, []);
  }

  /**
   * function to return random empty cell
   * @returns {Cell}
   */
  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[randomIndex];
  }
}

/**
 * function to create cell elements in the DOM
 * @param {HTMLDivElement} gridElement
 * @returns {[Cell]}
 */
function createCellElements(gridElement) {
  const cells = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; ++i) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gridElement.append(cell);
    const cellElement = new Cell(
      cell,
      Math.floor(i / GRID_SIZE),
      i % GRID_SIZE
    );
    cells.push(cellElement);
  }
  return cells;
}
