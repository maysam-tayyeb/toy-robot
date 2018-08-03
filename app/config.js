'use strict';

/**
 * Config object
 * It consists of configs for:
 *   Robot class
 *   Messenger class
 *   Table class
 */

const config = {};

config.table = {
  startPointX: 0,
  startPointY: 0,
  rows: 5,
  columns: 5
};
config.robot = {
  commands: ['PLACE', 'MOVE', 'LEFT', 'RIGHT', 'REPORT'],
  directions: ['NORTH', 'EAST', 'SOUTH', 'WEST']
};
config.messenger = {
  messages: {
    default: 'Welcome to my robotic game. Start with placing me typing PLACE X, Y, F {caseInsensitive}.',
    welcome: '{eol}Welcome to my robotic world!{eol}{eol}I will take your orders within the constraints.{eol}Feel free to begin by placing me on the table - PLACE X, Y, F {caseInsensitive}. \'q\' to exit.',
    noInitialCommand: 'Uh oh! You haven\'t placed me on the table yet. Enter "PLACE X, Y, F" {caseInsensitive} to put me on the table.',
    placeMeFirst: 'Nothing to report - I am not yet on the table. Place me first to begin - PLACE X, Y, F {caseInsensitive}.',
    wrongPlace: 'Uh oh! That spot is out of the table.',
    wrongDirection: 'Oops! Unknown direction. Available directions are: {availableDirections}',
    noFace: 'Oops! No FACE was provided. Correct form is: PLACE X, Y, FACE {caseInsensitive}.',
    faceNotString: 'Oops! FACE is not a string.',
    unknownCommand: 'Oops! I can\'t take that order. Available commands are: {availableCommands}',
    position: 'I am at: {x}, {y} towards {f}',
    noNegativeCoordinates: 'Oops! No negative X or Y allowed. Try again.',
    nonIntCoordinates: 'Uh oh! X and Y must be integers.',
    wrongMove: 'Uh oh! No more moves in that direction, else I fall :(.',
    fileNotFound: 'Oops! File \'{fileName}\' was not found. Make sure you specified its path correctly.',
    needMessageConfig: 'Need a message config to generate a proper message',
    messageKeyNotFound: 'Message key {key} could not be found'
  },
  subMessages: {
    availableDirections: config.robot.directions.join(', '),
    availableCommands: [config.robot.commands.reduce((prev, cur) => {
      if (prev === 'PLACE') {
        prev = [prev, 'X, Y, F'].join(' ');
      }

      return prev + ' | ' + cur;
    }), '.'].join(''),
    caseInsensitive: '(case insensitive, spaces are acceptable instead of commas)',
    country: 'Dreamland'
  }
};

module.exports = config;
