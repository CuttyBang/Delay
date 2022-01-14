/*

import VUMeterNode from './components/VU.js';

context.audioWorklet.addModule('./components/process/vumeter-processor.js').then(()=>{
  const vuMeterNode = new VUMeterNode(context, 25);
  function drawMeter () {
    meter.value = vuMeterNode.draw();
    requestAnimationFrame(drawMeter);
  }
  wetGain.connect(vuMeterNode);
  drawMeter();
})

*/


/*-----vumeter-processor.js (make separate file)

const SMOOTHING_FACTOR = 0.9;
const MINIMUM_VALUE = 0.00001;
registerProcessor('vumeter', class extends AudioWorkletProcessor {
  constructor (options) {
    super();
    this._volume = 0;
    this._updateIntervalInMS = options.processorOptions.updateIntervalInMS;
    this._nextUpdateFrame = this._updateIntervalInMS;
    this.port.onmessage = event => {
      if (event.data.updateIntervalInMS)
        this._updateIntervalInMS = event.data.updateIntervalInMS;
    }
  }
  get intervalInFrames () {
    return this._updateIntervalInMS / 1000 * sampleRate;
  }
  process (inputs, outputs, parameters) {
    const input = inputs[0];

    if (input.length > 0) {
      const samples = input[0];
      let sum = 0;
      let rms = 0;

      for (let i = 0; i < samples.length; ++i)
        sum += samples[i] * samples[i];

      rms = Math.sqrt(sum / samples.length);
      this._volume = Math.max(rms, this._volume * SMOOTHING_FACTOR);

      this._nextUpdateFrame -= samples.length;
      if (this._nextUpdateFrame < 0) {
        this._nextUpdateFrame += this.intervalInFrames;
        this.port.postMessage({volume: this._volume});
      }
    }
    return this._volume >= MINIMUM_VALUE;
  }
});

*/

export default class VUMeterNode extends AudioWorkletNode {
  constructor (context, updateIntervalInMS) {
    super(context, 'vumeter', {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 1,
      processorOptions: {
        updateIntervalInMS: updateIntervalInMS || 16.67
      }
    });

    this._updateIntervalInMS = updateIntervalInMS;
    this._volume = 0;

    this.port.onmessage = event => {
      if (event.data.volume)
        this._volume = event.data.volume;
    }
    this.port.start();
  }
  get updateInterval() {
    return this._updateIntervalInMS;
  }
  set updateInterval(updateIntervalInMS) {
    this._updateIntervalInMS = updateIntervalInMS;
    this.port.postMessage({updateIntervalInMS: updateIntervalInMS});
  }
  draw () {
    return (this._volume + this._volume) / 1.25;
    // Draws the VU meter based on the volume value
    // every |this._updateIntervalInMS| milliseconds.
  }
};
