/* global describe, it, expect, beforeEach */
"use strict";

require("../web-audio-mock");

describe("AudioBufferSourceNode", function() {
  var ctx = null;
  var node = null;

  beforeEach(function() {
    ctx = new AudioContext();
    node = ctx.createBufferSource();
  });

  describe("#buffer", function() {
    it("should be exist", function() {
      expect(node).to.have.property("buffer");
    });
  });

  describe("#playbackRate", function() {
    it("should be exist", function() {
      expect(node).to.have.property("playbackRate");
    });
    it("should be readonly", function() {
      expect(function() {
        node.playbackRate = 0;
      }).to.throw(Error, "readonly");
    });
    it("should be an instance of AudioParam", function() {
      expect(node.playbackRate).to.be.instanceOf(AudioParam);
    });
  });

  describe("#loop", function() {
    it("should be exist", function() {
      expect(node).to.have.property("loop");
    });
    it("should be a boolean", function() {
      expect(function() {
        node.loop = true;
      }).to.not.throw();
      expect(function() {
        node.loop = "INVALID";
      }).to.throw(TypeError);
    });
  });

  describe("#loopStart", function() {
    it("should be exist", function() {
      expect(node).to.have.property("loopStart");
    });
    it("should be a number", function() {
      expect(function() {
        node.loopStart = 0;
      }).to.not.throw();
      expect(function() {
        node.loopStart = "INVALID";
      }).to.throw(TypeError);
    });
  });

  describe("#loopEnd", function() {
    it("should be exist", function() {
      expect(node).to.have.property("loopEnd");
    });
    it("should be a number", function() {
      expect(function() {
        node.loopEnd = 0;
      }).to.not.throw();
      expect(function() {
        node.loopEnd = "INVALID";
      }).to.throw(TypeError);
    });
  });

  describe("#onended", function() {
    it("should be exist", function() {
      expect(node).to.have.property("onended");
    });
    it("should be a function", function() {
      expect(function() {
        node.onended = function() {};
      }).to.not.throw();
      expect(function() {
        node.onended = "INVALID";
      }).to.throw(TypeError);
    });
  });

  describe("#start(when, offset, duration)", function() {
    it("should work", function() {
      expect(function() {
        node.start();
      }).to.not.throw();
    });
    it("throw error", function() {
      expect(function() {
        node.start("INVALID");
      }).throw(Error, "AudioBufferSourceNode#start: 'when' should be a number");
    });
    it("throw error", function() {
      expect(function() {
        node.start(0, "INVALID");
      }).throw(Error, "AudioBufferSourceNode#start: 'offset' should be a number");
    });
    it("throw error", function() {
      expect(function() {
        node.start(0, 0, "INVALID");
      }).throw(Error, "AudioBufferSourceNode#start: 'duration' should be a number");
    });
  });

  describe("#stop(when)", function() {
    it("should work", function() {
      expect(function() {
        node.stop();
      }).to.not.throw();
    });
    it("throw error", function() {
      expect(function() {
        node.stop("INVALID");
      }).throw(Error, "AudioBufferSourceNode#stop: 'when' should be a number");
    });
  });

});