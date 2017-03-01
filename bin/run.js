#!/usr/bin/env node

var fs = require('fs');
var Interpreter = require('../src/interpreter');

// add native console object to global interpreter scope
function initConsole(interpreter, scope) {
  var myConsole = interpreter.createObject(interpreter.OBJECT);
  interpreter.setProperty(
    scope,
    'console',
    myConsole
  );

  // add log function to console object
  function myLog() {
    for (var j = 0; j < arguments.length; j++) {
      arguments[j] = interpreter.pseudoToNative(arguments[j]);
    }
    return interpreter.createPrimitive(console.log.apply(console, arguments));
  }
  interpreter.setProperty(
    myConsole,
    'log',
    interpreter.createNativeFunction(myLog),
    Interpreter.NONENUMERABLE_DESCRIPTOR
  );
}

var code = fs.readFileSync(process.argv[process.argv.length - 1], 'utf-8');
new Interpreter(code, initConsole).run();
