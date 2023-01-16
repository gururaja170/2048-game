import Tile from './Tile.js';

export default class Cell {
  #cellElement;
  #row;
  #col;
  #tile;
  #mergeTile;
  constructor(cellElement, row, col) {
    this.#cellElement = cellElement;
    this.#row = row;
    this.#col = col;
  }

  /**
   * getter to return the tile element
   * @returns {Tile}
   */
  get tile() {
    return this.#tile;
  }

  /**
   * getter to return the merge tile element
   * @returns {Tile}
   */
  get mergeTile() {
    return this.#mergeTile;
  }

  /**
   * getter to return the row number
   * @returns {number}
   */
  get row() {
    return this.#row;
  }

  /**
   * getter to return the column number
   * @returns {number}
   */
  get col() {
    return this.#col;
  }

  /**
   * setter to set the tile element
   * @param {Tile} value;
   */
  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.row = this.row;
    this.#tile.col = this.col;
  }

  /**
   * setter to set the merge tile element
   * @param {Tile} tile
   */
  set mergeTile(tile) {
    this.#mergeTile = tile;
    if (tile == null) {
      return;
    }
    this.#mergeTile.row = this.row;
    this.#mergeTile.col = this.col;
  }

  /**
   * function to know whether the tile can accept any other tile
   * @param {Cell} cell;
   * @returns {boolean}
   */
  canAccept(cell) {
    return (
      this.tile == null ||
      (this.#mergeTile == null && cell.tile.value === this.tile.value)
    );
  }

  /**
   * funtion to merge tiles
   * @param {HTMLSpanElement} scoreDisplay
   * @returns {Void}
   */
  merge(scoreDisplay) {
    if (this.tile == null || this.mergeTile == null) {
      return;
    }

    this.tile.value = this.mergeTile.value + this.tile.value;

    // Updating score in score display
    const score = parseInt(scoreDisplay.textContent);
    scoreDisplay.textContent = score + this.tile.value;

    // Removing tile from DOM after merging
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}
