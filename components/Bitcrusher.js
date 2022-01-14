import { context } from './Context.js'

export default function Bitcrusher() {
  const processor = context.createScriptProcessor(4096, 1, 1);
  const input = context.createGain();
  const output = context.createGain();
  const buffer = 4096;
  let step, bits = 16, stepFreq = 1, phaser = 0, last = 0;

  input.gain.value = 1;
  output.gain.value = 1;

  processor.onaudioprocess = function(e){
    step = Math.pow(1/2, bits);
    for (let channel=0; channel<e.inputBuffer.numberOfChannels; channel++) {
      let input = e.inputBuffer.getChannelData(channel);
      let output = e.outputBuffer.getChannelData(channel);
      for (let i = 0; i < buffer; i++) {
        phaser += stepFreq;
        if (phaser >= 1.0) {
          phaser -= 1.0;
          last = step * Math.floor(input[i] / step + 0.5);
        }
        output[i] = last;
      }
    }
  };

  function depth(d) {
    if (d > 16) {
      bits = 16;
    }else if (d < 1) {
      bits = 1;
    } else { bits = d }
  };

  function divide(v) {
    if (v > 1) {
      stepFreq = 1;
    }else if (v < 0.01) {
      stepFreq = 0.01;
    } else { stepFreq = v * 2 }
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(processor);
  processor.connect(output);

  return {processor, input, output, depth, divide, to};
}
