# Toy Robot Game

#### Table Of Contents
[Description](#description)  
[Environments](#environments)   
[System Dependencies & Configuration](#system-dependencies--configuration)   
[Application Installation Instructions](#application-installation-instructions)   
[Operating Instructions](#operating-instructions)   
[Testing Instructions](#testing-instructions)   
[Code Coverage](#code-coverage)   
[Plumbing](#plumbing)


### Description

- Toy Robot Game is an interactive CLI application.
- The application is a simulation of a toy robot moving on a square tabletop, of dimensions 5 units x 5 units.    
- There are no other obstructions on the table surface.   
- The robot is free to roam around the surface of the table, but must be prevented from falling to destruction. Any movement that would result in the robot falling from the table must be prevented, however further valid movement commands must still be allowed.   

### Environments

Cross-platform. The application can be directly run on  OS X, Microsoft Windows, Linux platforms without special preparation.

### System Dependencies & Configuration

To run the app, you'll need:

* [Node.js](https://nodejs.org/en/download/), an open-source, cross-platform runtime environment for developing server-side web applications.     
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/en/), package managers for the Node.js server platform. Node.js comes with npm installed.

```
$ npm i
```
or
```
$ yarn
```

The application uses no any third-party modules or packages that should be installed with it.

### Application Installation Instructions

No installation needed. No changes will be made to your system.
To get the application, just clone a repo, then `cd` its directory and you are ready to run the app:

```
$ git clone git@github.com:maysam-tayyeb/toy-robot.git
$ cd toy-robot
```

### Operating Instructions

You have two options to send commands to the robot.   
The first option is to type in commands in command prompt.   
The second option is to provide a file with commands.   

To operate the robot by typing commands, start the app from the command prompt with no arguments provided and begin type in commands:

```
$ npm start

Welcome to my robotic world!

I will take your orders within the constraints.
Feel free to begin by placing me on the table - PLACE X, Y, F (case insensitive, spaces are acceptable instead of commas). 'q' to exit.
> PLACE 1 1 SOUTH
> REPORT
I am at: 1, 1 towards SOUTH
```
or
```
$ yarn start

Welcome to my robotic world!

I will take your orders within the constraints.
Feel free to begin by placing me on the table - PLACE X, Y, F (case insensitive, spaces are acceptable instead of commas). 'q' to exit.
> PLACE 1 1 SOUTH
> REPORT
I am at: 1, 1 towards SOUTH
```

To operate the robot using a file, create a file with commands within files directory, e.g. `game1.txt`, with the following contents:

```
PLACE 0,0,NORTH
MOVE
REPORT
LEFT
MOVE
REPORT
```

Then run the application providing it the file as the first argument:

```
$ npm start game1

Welcome to my robotic world!

I will take your orders within the constraints.
Feel free to begin by placing me on the table - PLACE X, Y, F (case insensitive, spaces are acceptable instead of commas). 'q' to exit.
> PLACE 0,0,NORTH
> MOVE
> REPORT
I am at: 0, 1 towards NORTH
> LEFT
> MOVE
Uh oh! No more moves in that direction, else I fall :(.
> REPORT
I am at: 0, 1 towards WEST
```
or
```
$ yarn start game1

Welcome to my robotic world!

I will take your orders within the constraints.
Feel free to begin by placing me on the table - PLACE X, Y, F (case insensitive, spaces are acceptable instead of commas). 'q' to exit.
> PLACE 0,0,NORTH
> MOVE
> REPORT
I am at: 0, 1 towards NORTH
> LEFT
> MOVE
Uh oh! No more moves in that direction, else I fall :(.
> REPORT
I am at: 0, 1 towards WEST
```

Bellow is a full explanation on how to operate the robot.

The Robot can read in commands of the following form (case insensitive):    
- PLACE X,Y,F or PLACE X Y F (spaces are acceptable instead of commas)
- MOVE
- LEFT
- RIGHT
- REPORT   

**PLACE X Y F** will put the toy robot on the table in position X,Y and facing NORTH, SOUTH, EAST or WEST.

The origin (0,0) can be considered to be the SOUTH WEST most corner.

The first valid command to the robot is a **PLACE** command, afer that, any sequence of commands may be entered, in any order, including another **PLACE** command. The application should discard all commands in the sequence until a valid **PLACE** command has been executed.

**MOVE** will move the toy robot one unit forward in the direction it is currently facing.

**LEFT** and **RIGHT** will rotate the robot 90 degrees in the specified direction without changing the position of the robot.

**REPORT** will announce the X,Y and F of the robot. This can be in any form, but standard output is sufficient.

A robot that is not on the table can choose the ignore the MOVE, LEFT, RIGHT and REPORT commands.

Input can be from a file, or from command line.

#### Constraints

The toy robot must not fall off the table during movement. This also includes the initial placement of the toy robot.

Any move that would cause the robot to fall must be ignored.

### Testing Instructions

All application components have specs and are tested. You can see their specs here https://github.com/maysam-tayyeb/toy-robot/tree/master/spec

Run `npm test` or `yarn test` to run all the tests. Or specify the name of the spec against which to run tests:

```
$ npm test // test all components. runs all possible specs
$ npm test spec/roboticGameSpec.js // test the game functionality only, runs roboticGameSpec
$ npm test spec/robotSpec.js // test robot functionality only, runs robotSpec
$ npm test spec/messengerSpec.js // test messenger functionality only, runs messengerSpec
$ npm test spec/tableSpec.js // test table functionality only, runs tableSpec
```
or
```
$ yarn test // test all components. runs all possible specs
$ yarn test spec/roboticGameSpec.js // test the game functionality only, runs roboticGameSpec
$ yarn test spec/robotSpec.js // test robot functionality only, runs robotSpec
$ yarn test spec/messengerSpec.js // test messenger functionality only, runs messengerSpec
$ yarn test spec/tableSpec.js // test table functionality only, runs tableSpec
```

### Code Coverage

To assess the comprehensiveness of the tests run:

```
npm run coverage
```
or
```
yarn coverage
```

and then browse path/to/toy-robot/coverage/lcov-report/index.html.

Green lines shows they are fully tested and red ones demostrates lack of testing on them

### Plumbing

The application consists of 5 (five) components:

- Robot   
- Messenger   
- Table
- RoboticGame

**Robot** is a class that represents a robot and defines its functionality. I has five public methods to control the robot:

- place(x, y, f)   
- move()    
- left()    
- right()   
- report()   
- getMessenger()  

The robot's dependencies are: the Messenger instance and the Table instance. It uses those. The Robot's configuration data is stored in `config.js` file.

**Messenger** is a class that incapsulates all the behaviour of preparing any messages a robot can send to a user. It is the robot's dependency. It has only one public method that the robot calls when it has some message to a user:    

- getMessage(messageConfig)

The Messenger's configuration data is stored in `config.js` file.   

**Table** is a class that represents a table where the robot walks. It is the robot's dependency. It has only one public method that the robot calls when it needs to determine the boundaries of the table:

- isOutOfTable(x, y)

The Table's configuration data is stored in `config.js` file.

**RoboticGame** is the main class that combines all components together into a one usable application. It is also the starting point of the game running the app:

- run()

The entry point of the application is  `start.js` file. It requres **RoboticGame** and runs the app:

```javascropt
const Game = require('./app/roboticGame');

new Game().run();
```
