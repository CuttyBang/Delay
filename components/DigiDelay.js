import { context } from './Context.js'
import Bitcrusher from './Bitcrusher.js'
import Dynamics from './Dynamics.js'

export default function DigiDelay(rate) {
  const delay = context.createDelay(3);
  const spread = context.createDelay(0.04);
  const highShelf = context.createBiquadFilter();
  const lowShelf = context.createBiquadFilter();
  const split= context.createChannelSplitter(2);
  const merge = context.createChannelMerger();
  const bitcrusher = Bitcrusher();
  const dynamics = Dynamics();
  const fb = context.createGain();
  const input = context.createGain();
  const output = context.createGain();

  input.gain.value = 1;
  output.gain.value = 0.8;
  fb.gain.value = 0.7;

  if (rate) {
    let dRate = rate / 1000;
    delay.delayTime.value = dRate
  } else {
    delay.delayTime.value = 0.3;
  }

  highShelf.type = 'highshelf';
  highShelf.frequency.value = 6000;
  highShelf.gain.value = 0;
  lowShelf.type = 'lowshelf';
  lowShelf.frequency.value = 1000;
  lowShelf.gain.value = 0;


  function bitcrush(c) {
    let crush = (16 - c * 4).toFixed(2);
    let div = Math.min((1 - c + 0.01).toFixed(2), 1);
    bitcrusher.depth(crush);
    bitcrusher.divide(div);
  }

  function color(c) {
    let amt = Math.abs(c);
    if (c < 0) {
      lowShelf.gain.value = 0 + amt;
      highShelf.gain.value = 0 - amt;
    }
    if (c > 0) {
      lowShelf.gain.value = 0 - amt;
      highShelf.gain.value = 0 + amt;
    }
  }

  function width(w) {
    if (w > 40) {
      spread.delayTime.value = 0.040;
    } else {
      let wVal = w / 1000;
      spread.delayTime.value = wVal;
    }
  }

  function time(t) {
    let dTime = t / 1000;
    delay.delayTime.value = dTime;
  }


  function feedback(amt) {
    let fbLev = amt / 10;
    fb.gain.value = fbLev;
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  input.connect(highShelf);
  highShelf.connect(lowShelf);
  lowShelf.connect(delay);
  delay.connect(fb);
  fb.connect(bitcrusher.input);
  bitcrusher.to(delay);
  delay.connect(split);
  split.connect(spread);
  spread.connect(merge, 0, 0);
  split.connect(merge, 0, 1);
  merge.connect(output);

  return {delay, input, output, bitcrush, color, width, time, feedback, to};

}
