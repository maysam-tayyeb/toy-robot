'use strict';

const os = require("os"); // to have platform independent EOL
const stdout = require("test-console").stdout;
const stderr = require("test-console").stderr;

let EOL = os.EOL; // cross-platform EOL

const RoboticGame = require('../app/roboticGame');
const Messenger = require('./../app/messenger');
const config = require('./../app/config');

describe('Game on', function() {
  let game;
  let messenger;

  beforeAll(() => messenger = new Messenger(config.messenger));

  beforeEach(() => game = new RoboticGame());

  it('should throw an error if the command in not known', () => {
    expect(game._actionCommand('blah')).toEqual(new Error(messenger.getMessage({
      msg: 'unknownCommand'
    })));
  });

  it('should throw an error if the command in not known', () => {
    expect(game._actionCommand('place')).toEqual(new Error(messenger.getMessage({
      msg: 'unknownCommand'
    })));
  });

  it('should throw an error if the command in not known', () => {
    expect(game._actionCommand('place 1')).toEqual(new Error(messenger.getMessage({
      msg: 'unknownCommand'
    })));
  });

  it('should throw an error if the command in not known', () => {
    expect(game._actionCommand('place 1 1')).toEqual(new Error(messenger.getMessage({
      msg: 'unknownCommand'
    })));
  });

  it('should throw an error if the direction is wrong', () => {
    expect(game._actionCommand('place 1 1 n')).toEqual(new TypeError(messenger.getMessage({
      msg: 'wrongDirection'
    })));
  });

  it('should throw an error if the direction is wrong', () => {
    expect(game._actionCommand('place 1 1 north')).toBe(game.robot);
  });

  it('should throw an error if the place is out of table', () => {
    expect(game._actionCommand('place 1 6 north')).toEqual(new Error(messenger.getMessage({
      msg: 'wrongPlace'
    })));
  });

  it('should throw an error if the place is out of table', () => {
    expect(game._actionCommand('place 6 1 north')).toEqual(new Error(messenger.getMessage({
      msg: 'wrongPlace'
    })));
  });

  it('should throw an error if it is asked to move without being placed', () => {
    expect(game._actionCommand('move')).toEqual(new TypeError(messenger.getMessage({
      msg: 'noInitialCommand'
    })));
  });

  it('should throw an error if it is asked to turn without being placed', () => {
    expect(game._actionCommand('left')).toEqual(new TypeError(messenger.getMessage({
      msg: 'noInitialCommand'
    })));
  });

  it('should throw an error if it is asked to turn without being placed', () => {
    expect(game._actionCommand('right')).toEqual(new TypeError(messenger.getMessage({
      msg: 'noInitialCommand'
    })));
  });

  it('should not be able to report before being placed', () => {
    expect(game._actionCommand('report')).toEqual(messenger.getMessage({
      msg: 'placeMeFirst'
    }));
  });

  it('should output unknownCommand error message', () => {
    let data = 'unknownOrder';
    let inspect = stdout.inspect();
    let expectedOutput = messenger.getMessage({
      msg: 'unknownCommand'
    }) + EOL + '> ';

    game._processInput(data);
    inspect.restore();

    expect(inspect.output.join('')).toEqual(expectedOutput);
  });

  it('should exit the game', (done) => {
    let data = 'q';
    let exit = process.exit;

    process.exit = () => done();
    game._processInput(data);

    process.exit = exit;
  });

  it('should exit the game', (done) => {
    let data = 'quit';
    let exit = process.exit;

    process.exit = () => done();
    game._processInput(data);

    process.exit = exit;
  });

  it('should exit the game', (done) => {
    let data = 'exit';
    let exit = process.exit;

    process.exit = () => done();
    game._processInput(data);

    process.exit = exit;
  });

  it('should output no robot to report', () => {
    let data = 'report';
    let inspect = stdout.inspect();
    let expectedOutput = game.robot.report() + EOL + '> ';

    game._processInput(data);
    inspect.restore();

    expect(inspect.output.join('')).toEqual(expectedOutput);
  });

  it('should output ready to take order twice', () => {
    let data1 = 'place 1 1 north';
    let data2 = 'move';
    let inspect = stdout.inspect();
    let expectedOutput = '> > ';

    game._processInput(data1);
    game._processInput(data2);
    inspect.restore();

    expect(inspect.output.join('')).toEqual(expectedOutput);
  });

  it('should say wrong filename', () => {
    let wrongFilename = 'Blah';
    let inspect = stderr.inspect();
    let expectedOutput = messenger.getMessage({
      msg: 'fileNotFound',
      fileName: wrongFilename
    }) + EOL + EOL;

    game._readFromFile(wrongFilename);
    inspect.restore();

    expect(inspect.output.join('')).toEqual(expectedOutput);
  });

  it('should output the game actions and results', () => {
    let fileName = 'testGame';
    let inspect = stdout.inspect();
    let expectedOutput = 'PLACE 0,0,NORTH' + EOL +
      '> MOVE' + EOL +
      '> REPORT' + EOL +
      'I am at: 0, 1 towards NORTH' + EOL +
      '> LEFT' + EOL +
      '> MOVE' + EOL +
      'Uh oh! No more moves in that direction, else I fall :(.' + EOL +
      '> REPORT' + EOL +
      'I am at: 0, 1 towards WEST' + EOL +
      '> PLACE 1 1 EAST' + EOL +
      '> LEFT' + EOL +
      '> MOVE' + EOL +
      '> RIGHT' + EOL +
      '> MOVE' + EOL +
      '> REPORT' + EOL +
      'I am at: 2, 2 towards EAST' + EOL +
      '> RIGHT' + EOL +
      '> MOVE' + EOL +
      '> REPORT' + EOL +
      'I am at: 2, 1 towards SOUTH' + EOL +
      '> RIGHT' + EOL +
      '> RIGHT' + EOL +
      '> RIGHT' + EOL +
      '> RIGHT' + EOL +
      '> REPORT' + EOL +
      'I am at: 2, 1 towards SOUTH' + EOL +
      '> ';
    let fileClosedHandler;

    fileClosedHandler = () => {
      inspect.restore();

      expect(inspect.output.slice(1, 41).join('')).toEqual(expectedOutput);
    };

    game._readFromFile(fileName);
    game.on('fileClosed', fileClosedHandler);
  });

  it('should say welcome', () => {
    let inspect = stdout.inspect();
    let expectedOutput = messenger.getMessage({
      msg: 'welcome',
      eol: EOL
    }) + EOL + '> ';

    game._welcomePlayer();
    inspect.restore();

    expect(inspect.output.join('')).toEqual(expectedOutput);
  });
});