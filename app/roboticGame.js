'use strict';

/**
 * The Toy Robot Simulator game. It is a module. The main goal of this module is
 * to start the game. It requires the robot instance and uses its methods to
 * operate it.
 */

/**
 * Declare and initialize variables
 */
const os = require("os"); // to have platform independent EOL
const fs = require('fs'); // to check if a file exists and is readable and to create a stream
const path = require('path');
const readline = require('readline'); // Readline class. To read commands from a file
const EventEmitter = require('events').EventEmitter;

let config = require('./config');
let Table = require('./table');
let Messenger = require('./messenger');
let Robot = require('./robot');

let stdin = process.stdin;
let stdout = process.stdout;
let stderr = process.stderr;
let argv = process.argv.slice(2); // get only the name of the file from user prompt
let EOL = os.EOL; // cross-platform EOL
let rl; // readline instance


/**
 * Game class
 * It has only one static method .run() to start the app
 */
class RoboticGame extends EventEmitter {

  constructor() {
    super();

    this.robot = new Robot(config.robot,
      new Table(config.table),
      new Messenger(config.messenger));
  }

  /**
   * Attempt to read the commends from given file
   * @private
   * @method
   * @param {String} fileName path to file
   */
  _readFromFile(fileName) {
    let absolutePath = fileName;

    try {
      fs.accessSync(absolutePath, fs.F_OK | fs.R_OK)
    } catch (e) {
      try {
        let filesFolder = path.resolve(__dirname).replace('/app', '/files/');

        absolutePath = `${filesFolder}${fileName}.txt`;
        fs.accessSync(absolutePath, fs.F_OK | fs.R_OK)
      } catch (e) {
        stderr.write(this.robot.getMessenger().getMessage({
          msg: 'fileNotFound',
          fileName
        }) + EOL + EOL);

        return;
      }
    }


    rl = readline.createInterface({
      input: fs.createReadStream(absolutePath, 'utf-8'),
      terminal: false
    });

    // event handler. is called when a line is read from a file
    rl.on('line', (line) => {
      stdout.write(line.trim() + EOL);
      this._processInput(line);
    });

    // event handler. is called when all the lines in a file have been read
    // closes a stream and exit
    rl.on('close', () => {
      rl.close();
      this.emit('fileClosed', fileName);
    });
  }

  /**
   * This parser encapsulates the task of reading a user's input, either form CLI
   * or from a file.
   *
   * @private
   * @method
   * @param  {String} command A command from a user, like "PLACE, MOVE, etc."
   * @return {Error|String|Object} Returns either an Error instance, or a message
   * string, or the robot instance. A successful action returns robot's instance.
   */
  _actionCommand(command) {
    let res;

    command = command.trim();
    if (command.match(/^place\s+\w+(?:,\s*|\s+)\w+(?:,\s*|\s+)\w+$/i)) {
      let args = command.split(/(?:\s+|,\s*)/).slice(1);
      res = this.robot.place(args[0], args[1], args[2]);
    } else if (command.match(/^move$/i)) {
      res = this.robot.move();
    } else if (command.match(/^left$/i)) {
      res = this.robot.left();
    } else if (command.match(/^right$/i)) {
      res = this.robot.right();
    } else if (command.match(/^report$/i)) {
      res = this.robot.report();
    } else {
      res = new Error(this.robot.getMessenger().getMessage({
        msg: 'unknownCommand'
      }));
    }
    return res;
  }

  /**
   * Sends a response from _actionCommand() to stdout or stderr
   * @private
   * @method
   * @param  {Error|String|Object} command either an Error instance, or a message string,
   * or robot instance.
   * @return {undefined} no return. the func only sends to stdout or stderr
   */
  _processInput(command) {
    let response;
    let output = '> ';

    if (command.trim().match(/(q|quit|exit)/i)) {
      process.exit();
    }

    response = this._actionCommand(command);
    if (response instanceof Error) {
      output = `${response.message}${EOL}${output}`;
    } else if (typeof response === 'string') {
      output = `${response}${EOL}${output}`;
    }

    stdout.write(output);
  }

  _welcomePlayer() {
    stdout.write(this.robot.getMessenger().getMessage({
      msg: 'welcome',
      eol: EOL
    }) + EOL + '> ');
  }

  _initializeStdIn() {
    // read stdin
    // this piece of code is for reading user's input from CLI
    stdin.setEncoding('utf8');
    stdin.on('data', (data) => this._processInput(data));

    stdin.resume();
  }

  run() {
    if (argv.length) {
      this._readFromFile(argv[0]);
    }

    this._welcomePlayer();
    this._initializeStdIn();
  };
}

module.exports = RoboticGame;
