var expect = require('expect.js');
var unredo = require('../unredo.js').unredo;

describe('main', function() {
  it('unredo() is Object', function() {
    var hist = unredo();
    expect(hist).to.be.a('object');
  });
});

describe('command', function() {
  var noop, hist;

  before(function(done) {
    noop = function () {};
    hist = unredo();
    done();
  });

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


describe('execute', function() {
  var noop = function () {};
  var noopCommand = unredo.command(noop, noop);
  var value = 0;
  var plus1 = function() {
    value += 1;
  };
  var minus1 = function() {
    value -= 1;
  };
  var plus1Command = unredo.command(plus1, minus1);
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
    hist.execute(noopCommand);
    expect(hist.undoCommands).to.have.length(1);
    hist.execute(noopCommand);
    expect(hist.undoCommands).to.have.length(2);
  });

});

describe('undo', function() {
  var value = 0;
  var plus1 = function() {
    value += 1;
  };
  var minus1 = function() {
    value -= 1;
  };
  var plus1Command = unredo.command(plus1, minus1);
  var hist;

  beforeEach(function(done) {
    hist = unredo();
    value = 0;
    done();
  });

  it('should undo command', function () {
    expect(value).to.be(0);
    hist.execute(plus1Command);
    expect(value).to.be(1);
    hist.undo();
    expect(value).to.be(0);
  });

});


