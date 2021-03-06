"use strict";

var _ = require("./utils");
var AudioNode = require("./AudioNode");

function ChannelSplitterNode(context, numberOfOutputs) {
  _.check("ChannelSplitterNode(numberOfOutputs)", {
    numberOfOutputs: { type: "number", given: numberOfOutputs }
  });
  AudioNode.call(this, {
    context: context,
    name: "ChannelSplitterNode",
    jsonAttrs: [],
    numberOfInputs  : 1,
    numberOfOutputs : numberOfOutputs,
    channelCount    : 2,
    channelCountMode: "max",
    channelInterpretation: "speakers"
  });
}
_.inherits(ChannelSplitterNode, global.ChannelSplitterNode);

module.exports = ChannelSplitterNode;
