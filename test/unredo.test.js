if (typeof require !== 'undefined'){
  var expect = require('expect.js');
  var unredo = require('../unredo.js').unredo;
}

describe('init', function() {
  it('unredo() is Object', function() {
    var hist = unredo();
    expect(hist).to.be.a('object');
  });
});

describe('command', function() {
  var hist = unredo();
  var noop = function () {};

  it('should create a command from unredo object', function () {
    var command = unredo.command(noop, noop);
    expect(command).to.be.a('function');
    expect(command).to.have.property('undo');
    expect(command.undo).to.be.a('function');
  });

  it('should create a command from hist object', function () {
    var command = hist.command(noop, noop);
    expect(command).to.be.a('function');
    expect(command).to.have.property('undo');
    expect(command.undo).to.be.a('function');
  });

});


describe('execute, undo, redo', function() {
  var value = 0;
  var plus1 = function() {
    value += 1;
  };
  var minus1 = function() {
    value -= 1;
  };
  var plus10 = function() {
    value += 10;
  };
  var minus10 = function() {
    value -= 10;
  };
  var plus1Command = unredo.command(plus1, minus1);
  var plus10Command = unredo.command(plus10, minus10);
  var hist;

  beforeEach(function(done) {
    hist = unredo();
    value = 0;
    done();
  });

  it('should execute command', function () {
    expect(value).to.be(0);
    hist.execute(plus1Command);
    expect(value).to.be(1);
  });

  it('should have undoCommands', function() {
    hist.execute(plus1Command);
    expect(hist.undoCommands).to.have.length(1);
    hist.execute(plus1Command);
    expect(hist.undoCommands).to.have.length(2);
  });

  it('should undo command', function () {
    expect(value).to.be(0);
    hist.execute(plus1Command);
    expect(value).to.be(1);
    hist.undo();
    expect(value).to.be(0);
  });

  it('should undo command 2', function () {
    expect(value).to.be(0);
    hist.execute(plus1Command);
    expect(value).to.be(1);
    hist.execute(plus10Command);
    expect(value).to.be(11);
    hist.undo();
    expect(value).to.be(1);
    hist.undo();
    expect(value).to.be(0);
  });

  it('should not undo when undoCommands is Empty', function () {
    expect(value).to.be(0);
    hist.undo();
    expect(value).to.be(0);
  });

  it('should redo command', function () {
    expect(value).to.be(0);
    hist.execute(plus1Command);
    expect(value).to.be(1);
    hist.undo();
    expect(value).to.be(0);
    hist.redo();
    expect(value).to.be(1);
  });

  it('should not redo when redoCommands is Empty', function () {
    expect(value).to.be(0);
    hist.redo();
    expect(value).to.be(0);
  });

});



