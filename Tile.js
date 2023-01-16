export default class Tile {
  #tileElement;
  #row;
  #col;
  #value;
  constructor(gridElement, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement('div');
    this.#tileElement.classList.add('tile');
    this.value = value;

    gridElement.append(this.#tileElement);
  }

  /**
   * getter to get the tile value
   * @returns {number}
   */
  get value() {
    return this.#value;
  }

  /**
   * getter to get the row number
   * @param {number} row
   */
  set row(row) {
    this.#row = row;
    this.#tileElement.style.setProperty('--row', row);
  }

  /**
   * getter to get the column number
   * @param {number} col
   */
  set col(col) {
    this.#col = col;
    this.#tileElement.style.setProperty('--col', col);
  }

  /**
   * setter to set the tile value
   * @param {number} v
   */
  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;
    const power = Math.log2(v);
    const backgroundLightness = 100 - 9 * power;
    this.#tileElement.style.setProperty(
      '--background-lightness',
      `${backgroundLightness}%`
    );
    this.#tileElement.style.setProperty(
      '--text-lightness',
      `${backgroundLightness <= 50 ? 90 : 10}%`
    );
  }

  /**
   * function to remove tile from DOM
   * @returns {void}
   */
  remove() {
    this.#tileElement.remove();
  }

  /**
   * function to check whether the animation is in progress or not
   */
  waitForTransition(isAnimation = false) {
    return new Promise((resolve) =>
      this.#tileElement.addEventListener(
        isAnimation ? 'animationend' : 'transitionend',
        resolve,
        {
          once: true,
        }
      )
    );
  }
}
