'use strict';

/**
 * Lets test Table
 * The Playgroung has only one method to test
 */
const Table = require('./../app/table');
const config = require('./../app/config');


describe('The Table', () => {
  let table;
  let xOuts = [config.table.startPointX - 1, config.table.rows];
  let yOuts = [config.table.startPointY - 1, config.table.columns];
  let yIns = [config.table.startPointY, config.table.columns - 1];
  let xIns = [config.table.startPointX, config.table.rows - 1];

  beforeAll(() => table = new Table(config.table));

  let loopInvalidY = (x, y) => {
    it('should return TRUE if Ys are OUTSIDE it', () => {
      expect(table.isOutOfTable(x, y)).toBe(true);
    });
  };

  let loopValidY = (x, y) => {
    it('should return FALSE if Ys are INSIDE it', () => {
      expect(table.isOutOfTable(x, y)).toBe(false);
    });
  };


  let loopInvalidX = (x, y) => {
    it('should return TRUE if Xs are OUTSIDE it', () => {
      expect(table.isOutOfTable(x, y)).toBe(true);
    });
  };

  let loopValidX = (x, y) => {
    it('should return FALSE if Xs are INSIDE it', () => {
      expect(table.isOutOfTable(x, y)).toBe(false);
    });
  };

  /**
   * Y is outside
   */
  for (let x = config.table.startPointX; x < config.table.rows; ++x) {
    for (let i = 0; i < yOuts.length; ++i) {
      loopInvalidY(x, yOuts[i]);
    }
  }

  /**
   * Y is inside
   */
  for (let x = config.table.startPointX; x < config.table.rows; ++x) {
    for (let i = 0; i < yIns.length; ++i) {
      loopValidY(x, yIns[i]);
    }
  }

  /**
   * X is outside
   */
  for (let y = config.table.startPointY; y < config.table.columns; ++y) {
    for (let i = 0; i < xOuts.length; ++i) {
      loopInvalidX(xOuts[i], y);
    }
  }

  /**
   * X is inside
   */
  for (let y = config.table.startPointY; y < config.table.columns; ++y) {
    for (let i = 0; i < xIns.length; ++i) {
      loopValidX(xIns[i], y);
    }
  }
});
