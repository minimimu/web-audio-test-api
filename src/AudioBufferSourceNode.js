"use strict";

var _ = require("./utils");
var AudioNode = require("./AudioNode");
var AudioParam = require("./AudioParam");
var AudioBuffer = require("./AudioBuffer");

function AudioBufferSourceNode(context) {
  AudioNode.call(this, {
    context: context,
    name: "AudioBufferSourceNode",
    jsonAttrs: [ "buffer", "playbackRate", "loop", "loopStart", "loopEnd" ],
    numberOfInputs  : 0,
    numberOfOutputs : 1,
    channelCount    : 2,
    channelCountMode: "max",
    channelInterpretation: "speakers"
  });
  _.$type(this, "buffer", AudioBuffer, null);
  _.$read(this, "playbackRate", new AudioParam(this, "playbackRate", 1, 0, 1024));
  _.$type(this, "loop", "boolean", false);
  _.$type(this, "loopStart", "number", 0);
  _.$type(this, "loopEnd", "number", 0);
  _.$type(this, "onended", "function", null);

  Object.defineProperties(this, {
    $state: {
      get: function() {
        return this.$stateAtTime(this.context.currentTime);
      }
    }
  });

  this._startTime = Infinity;
  this._stopTime  = Infinity;
  this._firedOnEnded = false;
}
_.inherits(AudioBufferSourceNode, global.AudioBufferSourceNode);

AudioBufferSourceNode.prototype.$stateAtTime = function(t) {
  var state = "";
  if (this._startTime === Infinity) {
    state = "UNSCHEDULED";
  } else if (t < this._startTime && this._stopTime <= t) {
    state = "FINISHED";
  } else if (t < this._startTime) {
    state = "SCHEDULED";
  } else if (t < this._stopTime) {
    state = "PLAYING";
  }
  return state ? state : "FINISHED";
};

AudioBufferSourceNode.prototype._process = function(currentTime, nextCurrentTime) {
  if (!this._firedOnEnded) {
    if (!this.loop && this.buffer && nextCurrentTime <= currentTime + this.buffer.duration) {
      this._stopTime = Math.min(currentTime + this.buffer.duration, this._stopTime);
    }

    if (this.$stateAtTime(currentTime) === "FINISHED" && this.onended) {
      this.onended({ target: this });
      this._firedOnEnded = true;
    }
  }
};

AudioBufferSourceNode.prototype.start = function(when, offset, duration) {
  var caption = _.caption(this, "start(when, offset, duration)");
  _.check(caption, {
    when    : { type: "number", given: _.defaults(when    , 0) },
    offset  : { type: "number", given: _.defaults(offset  , 0) },
    duration: { type: "number", given: _.defaults(duration, 0) },
  });
  if (this._startTime !== Infinity) {
    throw new Error(_.format(
      "#{caption} cannot start more than once", {
        caption: caption
      }
    ));
  }
  this._startTime = when;
};

AudioBufferSourceNode.prototype.stop = function(when) {
  var caption = _.caption(this, "stop(when)");
  _.check(caption, {
    when: { type: "number", given: _.defaults(when, 0) }
  });
  if (this._startTime === Infinity) {
    throw new Error(_.format(
      "#{caption} cannot call stop without calling start first", {
      caption: caption
      }
    ));
  }
  if (this._stopTime !== Infinity) {
    throw new Error(_.format(
      "#{caption} cannot stop more than once", {
        caption: caption
      }
    ));
  }
  this._stopTime = when;
};

module.exports = AudioBufferSourceNode;
