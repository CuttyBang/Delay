const stereoLayout = `<div id="stereoLayout">
                        <div class="top_middle stereo time flexible column middle center">
                          <div class="row stereo flexible middle center">
                            <div class="knob flexible center middle">
                              <webaudio-knob src="./images/metal2.png" id="timeKnob" class="control" sensitivity="0.1" enable="1"  diameter="150"  sprites="100" value="250" min="0" max="2000" step="20"></webaudio-knob>
                            </div>
                          </div>
                          <div class="row stereo offset flexible middle between">
                            <div class="knob flexible center middle">
                              <webaudio-knob src="./images/metal2.png" id="leftTimeKnob" class="control" sensitivity="0.1" enable="1"  diameter="75"  sprites="100" value="0" min="-250" max="250" step="5"></webaudio-knob>
                            </div>
                            <div class="knob flexible center middle">
                              <webaudio-knob src="./images/metal2.png" id="rightTimeKnob" class="control" sensitivity="0.1" enable="1"  diameter="75"  sprites="100" value="0" min="-250" max="250" step="5"></webaudio-knob>
                            </div>
                          </div>
                        </div>
                        <div class="bottom_middle stereo flexible middle center">
                          <div class="row flexible middle center">
                            <div class="slider">
                              <webaudio-slider id="widthSlider" sensitivity="0.3" enable="1" src="./images/slider_ditch.png" knobsrc="./images/slider_knob.png" min="0" max="10" step="0.1" value="5" sprites="100" width="200" height="32" ditchlength="150" direction="vert" style="overflow: hidden"></webaudio-slider>
                            </div>
                          </div>
                        </div>
                        <div class="bottom stereo flexible middle center">
                          <div class="row flexible middle center">
                            <div class="knob flexible center middle">
                              <webaudio-knob src="./images/metal2.png" id="fbKnob" class="control" sensitivity="0.1" enable="1"  diameter="200"  sprites="100" value="7" min="0" max="10" step="0.1"></webaudio-knob>
                            </div>
                          </div>
                        </div>
                      </div>`;


const bbLayout = `<div id="bbLayout">
                    <div class="top_middle tape flexible middle center">
                      <div class="row flexible middle center">
                        <div class="knob flexible center middle">
                          <webaudio-knob src="./images/metal2.png" id="timeKnob" class="control" sensitivity="0.1" enable="1"  diameter="150"  sprites="100" value="400" min="0" max="600" step="6"></webaudio-knob>
                        </div>
                      </div>
                    </div>
                    <div class="bottom_middle tape flexible middle center ">
                      <div class="row flexible middle center">
                        <div class="knob flexible center middle">
                          <webaudio-knob src="./images/metal2.png" id="fbKnob" class="control" sensitivity="0.1" enable="1"  diameter="150"  sprites="100" value="7" min="0" max="10" step="0.1"></webaudio-knob>
                        </div>
                      </div>
                    </div>
                    <div  class="bottom tape flexible middle center">
                      <div class="row flexible middle center">
                        <div class="knob flexible center middle">
                          <webaudio-knob src="./images/metal2.png" id="chorusKnob" class="control" sensitivity="0.1" enable="1"  diameter="125"  sprites="100" value="0" min="0" max="1" step="0.01"></webaudio-knob>
                        </div>
                        <div class="knob flexible center middle">
                          <webaudio-knob src="./images/metal2.png" id="widthKnob" class="control" sensitivity="0.1" enable="1"  diameter="125"  sprites="100" value="0" min="0" max="20" step="1"></webaudio-knob>
                        </div>
                      </div>
                    </div>
                  </div>`;

const digiLayout = `<div id="digitalLayout">
                      <div class="top_middle digi flexible column middle center">
                        <div class="row stereo flexible middle center">
                          <div class="knob flexible center middle">
                            <webaudio-knob src="./images/metal2.png" id="bitKnob" class="control" sensitivity="0.1" enable="1"  diameter="125"  sprites="100" value="0" min="0" max="1" step="0.01"></webaudio-knob>
                          </div>
                          <div class="knob flexible center middle">
                            <webaudio-knob src="./images/metal2.png" id="widthKnob" class="control" sensitivity="0.1" enable="1"  diameter="125"  sprites="100" value="0" min="0" max="40" step="1"></webaudio-knob>
                          </div>
                        </div>
                      </div>
                      <div class="bottom_middle digi flexible middle center">
                        <div class="row flexible middle center">
                          <div class="slider">
                            <webaudio-slider id="colorSlider" sensitivity="0.3" enable="1" src="./images/slider_ditch.png" knobsrc="./images/slider_knob.png" min="-5" max="5" step="0.1" value="0" sprites="100" width="200" height="32" ditchlength="150" direction="vert" style="overflow: hidden"></webaudio-slider>
                          </div>
                        </div>
                      </div>
                      <div class="bottom digi flexible middle center column">
                        <div class="row flexible middle center time">
                          <div class="knob flexible center middle">
                            <webaudio-knob src="./images/metal2.png" id="timeKnob" class="control" sensitivity="0.1" enable="1"  diameter="150"  sprites="100" value="250" min="0" max="3000" step="10"></webaudio-knob>
                          </div>
                        </div>
                        <div class="row flexible middle center feedback">
                          <div class="knob flexible center middle">
                            <webaudio-knob src="./images/metal2.png" id="fbKnob" class="control" sensitivity="0.1" enable="1"  diameter="175"  sprites="100" value="5" min="0" max="10" step="0.01"></webaudio-knob>
                          </div>
                        </div>
                      </div>
                    </div>`;

const tapeLayout = `<div id="tapeLayout">
                      <div  class="top_middle flexible middle center">
                        <div class="row flexible middle center">
                          <div class="knob flexible center middle">
                            <webaudio-knob src="./images/metal2.png" id="warmthKnob" class="control" sensitivity="0.1" enable="1"  diameter="125"  sprites="100" value="12" min="0" max="50" step="0.5"></webaudio-knob>
                          </div>
                          <div class="knob flexible center middle">
                            <webaudio-knob src="./images/metal2.png" id="diffusionKnob" class="control" sensitivity="0.1" enable="1"  diameter="125"  sprites="100" value="0" min="0" max="1" step="0.01"></webaudio-knob>
                          </div>
                        </div>
                      </div>
                      <div class="bottom_middle tape flexible middle center">
                        <div class="row flexible middle center">
                          <div class="knob flexible center middle">
                            <webaudio-knob src="./images/metal2.png" id="timeKnob" class="control" sensitivity="0.1" enable="1"  diameter="150"  sprites="100" value="300" min="0" max="3000" step="1"></webaudio-knob>
                          </div>
                        </div>
                      </div>
                      <div class="bottom tape flexible middle center ">
                        <div class="row flexible middle center">
                          <div class="knob flexible center middle">
                            <webaudio-knob src="./images/metal2.png" id="fbKnob" class="control" sensitivity="0.1" enable="1"  diameter="150"  sprites="100" value="0" min="0" max="10" step="0.1"></webaudio-knob>
                          </div>
                        </div>
                      </div>
                    </div>`;

export { stereoLayout, bbLayout, digiLayout, tapeLayout };
