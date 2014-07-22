(function() {

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // from underscore.js
  function isUndefined(obj) {
    return obj === void 0;
  }

  function command(execFunc, undoFunc){
    var f = function(){
      return execFunc.apply(execFunc, arguments);
    };
    f.undo = undoFunc;
    return f;
  }

  function execute(command) {
    command();
    this.undoCommands.push(command);
    this.redoCommands = [];
  }

  function undo() {
    var command = this.undoCommands.pop();
    if (isUndefined(command)) return;
    command.undo();
    this.redoCommands.push(command);
  }

  function redo() {
    var command = this.redoCommands.pop();
    if (isUndefined(command)) return;
    command();
    this.undoCommands.push(command);
  }

  function unredo() {
    return {
      undoCommands: [],
      redoCommands: [],
      command: command,
      execute: execute,
      undo: undo,
      redo: redo
    };
  }

  unredo.command = command;

  root.unredo = unredo;

}.call(this));
