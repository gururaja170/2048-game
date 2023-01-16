import config from './config.js';

const { THRESHOLD_DISTANCE } = config;

export default class Touch {
  #touchStartX;
  #touchStartY;
  #touchEndX;
  #touchEndY;
  #isTouchDevice;

  constructor(
    isTouch = 'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
  ) {
    this.#touchStartX = 0;
    this.#touchStartY = 0;
    this.#touchEndX = 0;
    this.#touchEndY = 0;
    this.#isTouchDevice = isTouch;
  }

  get isTouchDevice() {
    return this.#isTouchDevice;
  }

  /**
   * Function to intialise the touch Input
   * @returns {void}
   */
  setupTouch() {
    window.addEventListener(
      'touchstart',
      (e) => {
        this.#touchStartX = e.changedTouches[0].screenX;
        this.#touchStartY = e.changedTouches[0].screenY;
      },
      { once: true }
    );
    window.addEventListener(
      'touchend',
      (e) => {
        this.#touchEndX = e.changedTouches[0].screenX;
        this.#touchEndY = e.changedTouches[0].screenY;
        this.#getSwipeDirection();
      },
      { once: true }
    );
  }

  /**
   * function to determine swipe direction
   * @returns {string}
   */
  #getSwipeDirection() {
    let direction = 'NoSwipe';

    if (this.#isTresholdReached(this.#touchStartX, this.#touchEndX)) {
      direction = 'SwipeLeft';
    } else if (this.#isTresholdReached(this.#touchEndX, this.#touchStartX)) {
      direction = 'SwipeRight';
    } else if (this.#isTresholdReached(this.#touchStartY, this.#touchEndY)) {
      direction = 'SwipeUp';
    } else if (this.#isTresholdReached(this.#touchEndY, this.#touchStartY)) {
      direction = 'SwipeDown';
    }

    const event = new CustomEvent('swipe', { detail: { direction } });
    window.dispatchEvent(event);
  }

  /**
   * Function to determine the correct swipe direction based on the threshold
   * @param {number} largerValue
   * @param {number} smallerValue
   * @returns {boolean}
   */

  #isTresholdReached(largerValue, smallerValue) {
    return (
      largerValue > smallerValue &&
      largerValue - smallerValue >= THRESHOLD_DISTANCE
    );
  }
}
