"use strict";

var _ = require("./utils");
var AudioNode = require("./AudioNode");
var AudioParam = require("./AudioParam");

function BiquadFilterNode(context) {
  AudioNode.call(this, {
    context: context,
    name: "BiquadFilterNode",
    jsonAttrs: [ "type", "frequency", "detune", "Q", "gain" ],
    numberOfInputs  : 1,
    numberOfOutputs : 1,
    channelCount    : 2,
    channelCountMode: "max",
    channelInterpretation: "speakers"
  });
  _.$enum(this, "type", [
    "lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"
  ], "lowpass");
  _.$read(this, "frequency", new AudioParam(this, "frequency", 350, 10, _.SAMPLERATE / 2));
  _.$read(this, "detune", new AudioParam(this, "detune", 0, -4800, 4800));
  _.$read(this, "Q", new AudioParam(this, "Q", 1, 0.0001, 1000));
  _.$read(this, "gain", new AudioParam(this, "gain", 0, -40, 40));
}
_.inherits(BiquadFilterNode, global.BiquadFilterNode);

BiquadFilterNode.prototype.getFrequencyResponse = function(frequencyHz, magResponse, phaseResponse) {
  _.check(_.caption(this, "getFrequencyResponse(frequencyHz, magResponse, phaseResponse)"), {
    frequencyHz  : { type: "Float32Array", given: frequencyHz },
    magResponse  : { type: "Float32Array", given: magResponse },
    phaseResponse: { type: "Float32Array", given: phaseResponse },
  });
};

module.exports = BiquadFilterNode;
