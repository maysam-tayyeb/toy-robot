'use strict';

/**
 * Let's test Messenger.
 * We have to make sure that it returns correct messages to Robot.
 * We take messages from config.js file.
 */
const config = require('./../app/config');
const Messenger = require('./../app/messenger');


describe('The Messenger', () => {
  let messenger, x, y, f;
  let { messages } = config.messenger;

  beforeAll(() => {
    messenger = new Messenger(config.messenger);
    x = 1;
    y = 2;
    f = 'south';
  });

  /**
   * To test each message separatly is not a good solution - it makes us to
   * manually create a new it('...') everytime we have a new message.
   */
  it('== should output correct noInitialCommand message ==', () =>
    expect(messenger.getMessage({
      msg: 'noInitialCommand'
    })).toEqual(messenger._generateMessage({
      msg: 'noInitialCommand',
      x: x,
      y: y,
      f: f,
      ci: '(case insensitive, spaces are acceptable instead of commas)'
    }))
  );

  it('should output correct default welcome message', () =>
    expect(messenger.getMessage()).toEqual(new TypeError(
      messenger.getMessage({
        msg: 'needMessageConfig'
      })
    ))
  );

  let key = 'FooBlaBla';

  it('should output correct default welcome message', () =>
    expect(messenger.getMessage({
      msg: key
    })).toEqual(new TypeError(
      messenger.getMessage({
        msg: 'messageKeyNotFound',
        key,
      })
    ))
  );

  /**
   * It is much better to test ALL messages in a loop. So that, no need to
   * manually create a new it('...') every time we decide to have a new
   * message. All is needed is to type a new message in a config file. It will
   * be tested here automatically.
   */
  function testItsInLoop(key) {
    it(['should output correct', key, 'message'].join(' '),
      () => expect(messenger.getMessage({
        msg: key,
        x: x,
        y: y,
        f: f
      })).toEqual(messenger._generateMessage({
        msg: key,
        x: x,
        y: y,
        f: f
      }))
    );
  }

  /**
   * A loop by itself
   */
  Object.keys(messages).forEach((key) => testItsInLoop(key));
});
