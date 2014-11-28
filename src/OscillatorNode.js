"use strict";

var _ = require("./utils");
var AudioNode = require("./AudioNode");
var AudioParam = require("./AudioParam");

function OscillatorNode(context) {
  AudioNode.call(this, {
    context: context,
    name: "OscillatorNode",
    jsonAttrs:  [ "type", "frequency", "detune" ],
    numberOfInputs  : 0,
    numberOfOutputs : 1,
    channelCount    : 2,
    channelCountMode: "max",
    channelInterpretation: "speakers"
  });

  _.$enum(this, "type", [ "sine", "square", "sawtooth", "triangle" ], "sine");
  _.$read(this, "frequency", new AudioParam(this, "frequency", 440, 0, 100000));
  _.$read(this, "detune", new AudioParam(this, "detune", 0, -4800, 4800));
  _.$type(this, "onended", "function", null);

  Object.defineProperties(this, {
    $state: {
      get: function() {
        return this.$stateAtTime(this.context.currentTime);
      }
    },
    $custom: {
      get: function() {
        return this._custom;
      }
    }
  });

  this._custom = null;
  this._startTime = Infinity;
  this._stopTime  = Infinity;
  this._firedOnEnded = false;
}
_.inherits(OscillatorNode, global.OscillatorNode);

OscillatorNode.prototype.$stateAtTime = function(t) {
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

OscillatorNode.prototype._process = function(currentTime) {
  if (!this._firedOnEnded && this.$stateAtTime(currentTime) === "FINISHED" && this.onended) {
    this.onended({ target: this });
    this._firedOnEnded = true;
  }
};

OscillatorNode.prototype.start = function(when) {
  var caption = _.caption(this, "start(when)");
  _.check(caption, {
    when: { type: "number", given: _.defaults(when, 0) }
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

OscillatorNode.prototype.stop = function(when) {
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
  if (this.$state === "FINISHED") {
    throw new Error(_.format(
      "#{caption} cannot stop after finished", {
        caption: caption
      }
    ));
  }
  this._stopTime = when;
};

OscillatorNode.prototype.setPeriodicWave = function(periodicWave) {
  _.check(_.caption(this, "setPeriodicWave(periodicWave)"), {
    periodicWave: { type: "PeriodicWave", given: periodicWave }
  });
  this._type = "custom";
  this._custom = periodicWave;
};

module.exports = OscillatorNode;
