'use strict';

const RoboticGame = require('../app/roboticGame');
const Messenger = require('./../app/messenger');
const config = require('./../app/config');

describe('Game on', function() {
  let game;
  let messenger;

  beforeAll(() => messenger = new Messenger(config.messenger));

  beforeEach(() => game = new RoboticGame());

  it('should throw an error if the command in not known', () => {
    expect(game._doAction('blah')).toEqual(new Error(messenger.getMessage({
      msg: 'unknownCommand'
    })));
  });

  it('should throw an error if the command in not known', () => {
    expect(game._doAction('place')).toEqual(new Error(messenger.getMessage({
      msg: 'unknownCommand'
    })));
  });

  it('should throw an error if the command in not known', () => {
    expect(game._doAction('place 1')).toEqual(new Error(messenger.getMessage({
      msg: 'unknownCommand'
    })));
  });

  it('should throw an error if the command in not known', () => {
    expect(game._doAction('place 1 1')).toEqual(new Error(messenger.getMessage({
      msg: 'unknownCommand'
    })));
  });

  it('should throw an error if the direction is wrong', () => {
    expect(game._doAction('place 1 1 n')).toEqual(new TypeError(messenger.getMessage({
      msg: 'wrongDirection'
    })));
  });

  it('should throw an error if the direction is wrong', () => {
    expect(game._doAction('place 1 1 north')).toBe(game.robot);
  });

  it('should throw an error if the place is out of table', () => {
    expect(game._doAction('place 1 6 north')).toEqual(new Error(messenger.getMessage({
      msg: 'wrongPlace'
    })));
  });

  it('should throw an error if the place is out of table', () => {
    expect(game._doAction('place 6 1 north')).toEqual(new Error(messenger.getMessage({
      msg: 'wrongPlace'
    })));
  });

  it('should throw an error if it is asked to move without being placed', () => {
    expect(game._doAction('move')).toEqual(new TypeError(messenger.getMessage({
      msg: 'noInitialCommand'
    })));
  });

  it('should throw an error if it is asked to turn without being placed', () => {
    expect(game._doAction('left')).toEqual(new TypeError(messenger.getMessage({
      msg: 'noInitialCommand'
    })));
  });

  it('should throw an error if it is asked to turn without being placed', () => {
    expect(game._doAction('right')).toEqual(new TypeError(messenger.getMessage({
      msg: 'noInitialCommand'
    })));
  });

  it('should not be able to report before being placed', () => {
    expect(game._doAction('report')).toEqual(messenger.getMessage({
      msg: 'placeMeFirst'
    }));
  });
});