'use strict';

/**
 * Lets test a Robot.
 */

const Table = require('./../app/table');
const Messenger = require('./../app/messenger');
const config = require('./../app/config');
const Robot = require('./../app/robot');

describe('The Toy Robot Game', () => {
  let robot;
  let messenger;

  beforeAll(() => messenger = new Messenger(config.messenger));

  beforeEach(() => robot = new Robot(config.robot, new Table(config.table), messenger));

  it('should have undefined coordinates at the beginning', () => {
    let position = robot._getPosition();

    expect(position.x === undefined &&
      position.y === undefined &&
      position.f === undefined).toBe(true);
  });

  it('should report its position', () => {
    let x = 2,
      y = 3,
      f = 'south';

    robot.place(x, y, f);

    expect(robot.report()).toEqual(messenger.getMessage({
      msg: 'position',
      x: x,
      y: y,
      f: f.toUpperCase()
    }));
  });

  it('should say "place me first to begin" at start', () =>
    expect(robot.report()).toEqual(messenger.getMessage({
      msg: 'placeMeFirst'
    }))
  );

  it('should not accept nonInt X or Y', () => {
    let x = "foo";
    let y = "1,4";
    let f = "south";

    expect(robot.place(x, y, f)).toEqual(new TypeError(
      messenger.getMessage({
        msg: 'nonIntCoordinates'
      })
    ));
  });

  it('should not accept undefined FACE', () => {
    let x = "foo";
    let y = "1,4";
    let f;

    expect(robot.place(x, y, f)).toEqual(new TypeError(
      messenger.getMessage({
        msg: 'noFace'
      })
    ));
  });

  it('should not accept non-string FACE', () => {
    let x = "foo";
    let y = "1,4";
    let f = 100;

    expect(robot.place(x, y, f)).toEqual(new TypeError(
      messenger.getMessage({
        msg: 'faceNotString'
      })
    ));
  });

  it('should not accept negative Y in PLACE', () => {
    let x = 0;
    let y = -1;
    let f = 'south';

    expect(robot.place(x, y, f)).toEqual(new TypeError(
      messenger.getMessage({
        msg: 'noNegativeCoordinates'
      })
    ));
  });

  it('should not accept negative X in PLACE', () => {
    let x = -1;
    let y = 0;
    let f = 'south';

    expect(robot.place(x, y, f)).toEqual(new TypeError(
      messenger.getMessage({
        msg: 'noNegativeCoordinates'
      })
    ));
  });

  it('should not accept invalid FACING words', () => {
    let x = 2;
    let y = 3;
    let f = 'foo';

    expect(robot.place(x, y, f)).toEqual(new TypeError(
      messenger.getMessage({
        msg: 'wrongDirection'
      })
    ));
  });

  it('should not be placed outside the table', () => {
    let x = 0;
    let y = 6;
    let f = 'north';

    expect(robot.place(x, y, f)).toEqual(new Error(
      messenger.getMessage({
        msg: 'wrongPlace'
      })
    ));
  });

  it('should have "_isFirstStepMade = false" before initial PLACE', () =>
    expect(robot._getIsFirstStepMade()).toBe(false)
  );

  it('should set "_isFirstStepMade = true" upon successful initial PLACE', () => {
    let x = 3;
    let y = 3;
    let f = 'south';

    robot.place(x, y, f);
    expect(robot._getIsFirstStepMade()).toBe(true);
  });

  it('should update X, Y upon successful place', () => {
    let x = 3;
    let y = 3;
    let f = 'south';
    let positionEnd;

    robot.place(x, y, f);

    positionEnd = robot._getPosition();

    expect(positionEnd.x === x &&
      positionEnd.y === y &&
      positionEnd.f === f.toUpperCase()).toBe(true);
  });

  it('should return itself if PLACE was successful', () => {
    let x = 1;
    let y = 1;
    let f = 'south';

    expect(robot.place(x, y, f)).toEqual(robot);
  });

  it('should not accept MOVE command before initial PLACE command', () =>
    expect(robot.move()).toEqual(new Error(
      messenger.getMessage({
        msg: 'noInitialCommand'
      })
    ))
  );


  it('should not be able to step out of the table', () => {
    let x = 4;
    let y = 0;
    let f = 'east';

    robot.place(x, y, f);
    expect(robot.move()).toEqual(new Error(
      messenger.getMessage({
        msg: 'wrongMove'
      })
    ));
  });

  it('should successfully make a correct MOVE', () => {
    let x = 1;
    let y = 1;
    let f = 'east';
    let pos;

    robot.place(x, y, f);
    robot.move();
    pos = robot._getPosition();
    expect(pos.x === x + 1 && pos.y === y && pos.f === f.toUpperCase())
      .toBe(true);
  });


  it('should not turn RIGHT before initial PLACE was made', () =>
    expect(robot.right()).toEqual(new Error(
      messenger.getMessage({
        msg: 'noInitialCommand'
      })
    ))
  );

  it('should not turn LEFT before initial PLACE was made', () =>
    expect(robot.left()).toEqual(new Error(
      messenger.getMessage({
        msg: 'noInitialCommand'
      })
    ))
  );

  it('should turn LEFT (change face)', () => {
    let x = 1;
    let y = 1;
    let f = 'north';

    robot.place(x, y, f);
    robot.left();
    expect(robot._getPosition().f).toEqual('WEST');
  });

  it('should turn RIGHT (change face)', () => {
    let x = 1;
    let y = 1;
    let f = 'north';

    robot.place(x, y, f);
    robot.right();
    expect(robot._getPosition().f).toEqual('EAST');
  });
});
