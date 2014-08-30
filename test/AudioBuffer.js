/* global describe, it, expect, beforeEach */
"use strict";

require("../web-audio-mock");

describe("AudioBuffer", function() {
  var ctx = null;
  var buf = null;

  beforeEach(function() {
    ctx = new AudioContext();
    buf = ctx.createBuffer(1, 16, 44100);
  });

  describe("#sampleRate", function() {
    it("should be exist", function() {
      expect(buf).to.have.property("sampleRate", 44100);
    });
    it("should be readonly", function() {
      expect(function() {
        buf.sampleRate = 0;
      }).to.throw(Error, "readonly");
    });
  });

  describe("#length", function() {
    it("should be exist", function() {
      expect(buf).to.have.property("length", 16);
    });
    it("should be readonly", function() {
      expect(function() {
        buf.length = 0;
      }).to.throw(Error, "readonly");
    });
  });

  describe("#duration", function() {
    it("should be exist", function() {
      expect(buf).to.have.property("duration", 0.00036281179138321996);
    });
    it("should be readonly", function() {
      expect(function() {
        buf.duration = 0;
      }).to.throw(Error, "readonly");
    });
  });

  describe("#numberOfChannels", function() {
    it("should be exist", function() {
      expect(buf).to.have.property("numberOfChannels", 1);
    });
    it("should be readonly", function() {
      expect(function() {
        buf.numberOfChannels = 0;
      }).to.throw(Error, "readonly");
    });
  });

  describe("#getChannelData(channel)", function() {
    it("should work", function() {
      expect(buf.getChannelData(0)).to.be.instanceOf(Float32Array);
    });
    it("throw error", function() {
      expect(function() {
        buf.getChannelData(2);
      }).to.throw(Error, "channel index (2) exceeds number of channels (1)");
    });
  });

});