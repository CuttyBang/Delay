import { context } from './Context.js'

export default function ModDelay(speed) {
  const delay = context.createDelay(3);
  const chrs = context.createDelay(0.06);
  const osc = context.createOscillator();
  const incoming = context.createGain();
  const out = context.createGain();
  const fb = context.createGain();
  const chrsGain = context.createGain();

  delay.delayTime.value = 0.15;
  fb.gain.value = 0.5;
  chrs.delayTime.value = 0.03;
  chrsGain.gain.value = 0.002;
  osc.frequency.value = 3.5;
  osc.type = 'sine';

  //let time = delay.delayTime.value;
  //let feedback = fb.gain.value;
  //let chorus = chrs.delayTime.value;
  //let rate = osc.frequency.value;
  //let depth = chrsGain.gain.value;
  let input = incoming;
  let output = out;

  if (speed) {
    let dRate = speed/ 1000;
    delay.delayTime.value = dRate
  } else {
    delay.delayTime.value = 0.3;
  }

  function time(t) {
    let dTime = t / 1000;
    delay.delayTime.value = dTime;
  }

  function rate(r) {
    let dRate = r / 10;
    osc.frequency.value = dRate;
  }

  function feedback(amt) {
    let fbLev = amt / 10;
    fb.gain.value = fbLev;
  }

  function depth(d) {
    let crs = d / 1000;
    chrsGain.gain.value = crs;
  }

  function chorus(c) {
    let mod = c / 100;
    chrs.delayTime.value = mod;
  }

  let to = (node) => {
    let out = output;
    out.connect(node.input || node);
  }

  osc.connect(chrsGain);
  chrsGain.connect(chrs.delayTime);

  incoming.connect(delay);
  delay.connect(chrs);
  delay.connect(fb);
  chrs.connect(fb);
  fb.connect(delay);
  fb.connect(out);

  osc.start();

  return { time, feedback, rate, depth, input, output, to };
}
