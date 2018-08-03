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
class RoboticGame {

  constructor() {
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
      input: fs.createReadStream(absolutePath),
      terminal: false
    });

    // event handler. is called when a line is read from a file
    rl.on('line', (line) => {
      stdout.write(line + EOL);
      this._doOutput(line);
    });

    // event handler. is called when all the lines in a file have been read
    // closes a stream and exit
    rl.on('close', () => {
      rl.close();
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
  _doAction(command) {
    let res;
    // PLACE X(,| )Y(,| )F(  *)
    if (command.match(/^\s*place\s+\w+(?:,?\s*|\s+)\w+(?:,?\s*|\s+)\w+\s*$/i)) {
      let args = command.trim().split(/(?:\s+|,\s*)/i).slice(1);
      res = this.robot.place(args[0], args[1], args[2]);
    } else if (command.match(/^move\s*$/i)) {
      res = this.robot.move();
    } else if (command.match(/^left\s*$/i)) {
      res = this.robot.left();
    } else if (command.match(/^right\s*$/i)) {
      res = this.robot.right();
    } else if (command.match(/^report\s*$/i)) {
      res = this.robot.report();
    } else {
      res = new Error(this.robot.getMessenger().getMessage({
        msg: 'unknownCommand'
      }));
    }
    return res;
  }

  /**
   * Sends a response from _doAction() to stdout or stderr
   * @private
   * @method
   * @param  {Error|String|Object} data either an Error instance, or a message string,
   * or robot instance.
   * @return {undefined} no return. the func only sends to stdout or stderr
   */
  _doOutput(data) {
    let res, _data = data.trim();

    if (_data.match(/(q|quit|exit)/i))
      process.exit();

    res = this._doAction(_data);
    if (res instanceof Error) {
      stdout.write(res.message + EOL + '> ');
    } else if (typeof res === 'string') {
      stdout.write(res + EOL + '> ');
    } else {
      stdout.write('> ');
    }
  }

  run() {
    if (argv.length) {
      this._readFromFile(argv[0]);
    }

    // read stdin
    // this piece of code is for reading user's input from CLI
    stdin.setEncoding('utf8');
    stdin.on('data', (data) => this._doOutput(data));
    stdout.write(this.robot.getMessenger().getMessage({
      msg: 'welcome',
      eol: EOL
    }) + EOL + '> ');
    stdin.resume();
  };
}

module.exports = RoboticGame;
