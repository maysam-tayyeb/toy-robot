'use strict';

class Table {

  /**
   * The Table class, constructor
   * @param {object} config playgroung's config
   * @constructor
   */
  constructor(config) {
    this._config = config;
  }

  /**
   * @method isOutOfTable Check is X, Y are inside of the table
   * @param  {INT}  x x-coordinate
   * @param  {INT}  y y-coordinate
   * @return {Boolean}
   */
  isOutOfTable(x, y) {
    return (x > (this._config.startPointX + (this._config.rows - 1))) ||
      (x < this._config.startPointX) ||
      (y > (this._config.startPointY + (this._config.columns - 1))) ||
      (y < this._config.startPointY);
  }
}

module.exports = Table;
