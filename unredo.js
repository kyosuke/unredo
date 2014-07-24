(function() {
  "use strict";

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  var slice = Array.prototype.slice;

  function isUndefined(obj) {
    return obj === void 0;
  }

  function partial(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  }

  function command(execFunc, undoFunc) {
    var f = function() {
      return execFunc.apply(execFunc, arguments);
    };
    f.undo = undoFunc;
    return f;
  }

  function execute(undoCommands, redoCommands, command) {
    command();
    undoCommands.push(command);
    redoCommands = [];
  }

  function undo(undoCommands, redoCommands) {
    var command = undoCommands.pop();
    if (isUndefined(command)) return;
    command.undo();
    redoCommands.push(command);
  }

  function redo(undoCommands, redoCommands) {
    var command = redoCommands.pop();
    if (isUndefined(command)) return;
    command();
    undoCommands.push(command);
  }

  function unredo() {
    var obj = {
      undoCommands: [],
      redoCommands: []
    };
    obj.command = command;
    obj.execute = partial(execute, obj.undoCommands, obj.redoCommands);
    obj.undo = partial(undo, obj.undoCommands, obj.redoCommands);
    obj.redo = partial(redo, obj.undoCommands, obj.redoCommands);
    return obj;
  }

  unredo.command = command;
  root.unredo = unredo;

}.call(this));
