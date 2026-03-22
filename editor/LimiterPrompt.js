// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";


import { ColorConfig } from "./ColorConfig.js";
import { bindRangeSliderFill } from "./HTMLWrapper.js";
import { ChangeLimiterSettings } from "./changes.js";

import { prettyNumber } from "./EditorConfig.js";

//namespace beepbox {
const { button, div, h2, input } = HTML;

export class LimiterCanvas {
	  __init() {this._editorWidth = 200} // 112
	  __init2() {this._editorHeight = 52} // 26
	  __init3() {this._fill = SVG.path({ fill: ColorConfig.uiWidgetBackground, "pointer-events": "none" })}
	  __init4() {this._ticks = SVG.svg({ "pointer-events": "none" })}
	  __init5() {this._subticks = SVG.svg({ "pointer-events": "none" })}
	  __init6() {this._boostCurve = SVG.path({ fill: "none", stroke: ColorConfig.textSelection, "stroke-width": 2, "pointer-events": "none" })}
	  __init7() {this._boostDot = SVG.circle({ fill: ColorConfig.textSelection, stroke: "none", r: "3" })}
	  __init8() {this._midCurve = SVG.path({ fill: "none", stroke: ColorConfig.primaryText, "stroke-width": 2, "pointer-events": "none" })}
	  __init9() {this._limitCurve = SVG.path({ fill: "none", stroke: ColorConfig.linkAccent, "stroke-width": 2, "pointer-events": "none" })}
	  __init10() {this._limitDot = SVG.circle({ fill: ColorConfig.linkAccent, stroke: "none", r: "3" })}
	  __init11() {this._label0 = SVG.text({ x: "-1.5%", y: "148.5%", "pointer-events": "none", "font-size": "7pt", fill: "var(--secondary-text)" }, "0")}
	  __init12() {this._label1 = SVG.text({ x: "48.2%", y: "148.5%", "pointer-events": "none", "font-size": "7pt", fill: "var(--secondary-text)" }, "1")}
	  __init13() {this._label2 = SVG.text({ x: "98.2%", y: "148.5%", "pointer-events": "none", "font-size": "7pt", fill: "var(--secondary-text)" }, "2")}
	  __init14() {this._inLabel = SVG.text({ x: "-5%", y: "113.5%", "pointer-events": "none", "font-size": "6pt", fill: "var(--secondary-text)" }, "In")}
	  __init15() {this._outLabel = SVG.text({ x: "-9%", y: "131%", "pointer-events": "none", "font-size": "6pt", fill: "var(--secondary-text)" }, "Out")}
	  __init16() {this._xAxisLabel = SVG.text({ x: "42%", y: "172%", "pointer-events": "none", "font-size": "7pt", fill: "var(--primary-text)" }, "Volume")}
	  __init17() {this._yAxisLabel = SVG.text({ x: "55.2%", y: "160%", "pointer-events": "none", "font-size": "7pt", transform: "rotate(-90 30,120)", fill: "var(--primary-text)" }, "Gain")}
	  __init18() {this._inVolumeBg = SVG.rect({ "pointer-events": "none", width: "100%", height: "6px", x: "0%", y: "105%", fill: ColorConfig.uiWidgetBackground })}
	  __init19() {this._outVolumeBg = SVG.rect({ "pointer-events": "none", width: "100%", height: "6px", x: "0%", y: "120%", fill: ColorConfig.uiWidgetBackground })}
	  __init20() {this._inVolumeBar = SVG.rect({ "pointer-events": "none", height: "6px", x: "0%", y: "105%", fill: "url('#volumeGrad')" })}
	  __init21() {this._inVolumeCap = SVG.rect({ "pointer-events": "none", width: "2px", height: "6px", y: "105%", fill: ColorConfig.uiWidgetFocus })}
	  __init22() {this._outVolumeBar = SVG.rect({ "pointer-events": "none", height: "6px", x: "0%", y: "120%", fill: "url('#volumeGrad')" })}
	  __init23() {this._outVolumeCap = SVG.rect({ "pointer-events": "none", width: "2px", height: "6px", y: "120%", fill: ColorConfig.uiWidgetFocus })}
	  __init24() {this._stop1 = SVG.stop({ "stop-color": "lime", offset: "30%" })}
	  __init25() {this._stop2 = SVG.stop({ "stop-color": "orange", offset: "45%" })}
	  __init26() {this._stop3 = SVG.stop({ "stop-color": "red", offset: "50%" })}
	  __init27() {this._gradient = SVG.linearGradient({ id: "volumeGrad", gradientUnits: "userSpaceOnUse" }, this._stop1, this._stop2, this._stop3)}
	  __init28() {this._defs = SVG.defs({}, this._gradient)}
	  __init29() {this._svg = SVG.svg({ style: `background-color: ${ColorConfig.editorBackground}; touch-action: none; overflow: visible;`, width: "100%", height: "100%", viewBox: "0 0 " + this._editorWidth + " " + this._editorHeight, preserveAspectRatio: "none" },
		this._defs,
		this._fill,
		this._ticks,
		this._subticks,
		this._boostCurve,
		this._midCurve,
		this._limitCurve,
		this._boostDot,
		this._limitDot,
		this._label0,
		this._label1,
		this._label2,
		this._inLabel,
		this._outLabel,
		this._xAxisLabel,
		this._yAxisLabel,
		this._inVolumeBg,
		this._outVolumeBg,
		this._inVolumeBar,
		this._outVolumeBar,
		this._inVolumeCap,
		this._outVolumeCap,
	)}

	  __init30() {this.container = HTML.div({ class: "", style: "height: 4em; width: 80%; padding-bottom: 1.5em;" }, this._svg)}

	

	constructor(lim) {;LimiterCanvas.prototype.__init.call(this);LimiterCanvas.prototype.__init2.call(this);LimiterCanvas.prototype.__init3.call(this);LimiterCanvas.prototype.__init4.call(this);LimiterCanvas.prototype.__init5.call(this);LimiterCanvas.prototype.__init6.call(this);LimiterCanvas.prototype.__init7.call(this);LimiterCanvas.prototype.__init8.call(this);LimiterCanvas.prototype.__init9.call(this);LimiterCanvas.prototype.__init10.call(this);LimiterCanvas.prototype.__init11.call(this);LimiterCanvas.prototype.__init12.call(this);LimiterCanvas.prototype.__init13.call(this);LimiterCanvas.prototype.__init14.call(this);LimiterCanvas.prototype.__init15.call(this);LimiterCanvas.prototype.__init16.call(this);LimiterCanvas.prototype.__init17.call(this);LimiterCanvas.prototype.__init18.call(this);LimiterCanvas.prototype.__init19.call(this);LimiterCanvas.prototype.__init20.call(this);LimiterCanvas.prototype.__init21.call(this);LimiterCanvas.prototype.__init22.call(this);LimiterCanvas.prototype.__init23.call(this);LimiterCanvas.prototype.__init24.call(this);LimiterCanvas.prototype.__init25.call(this);LimiterCanvas.prototype.__init26.call(this);LimiterCanvas.prototype.__init27.call(this);LimiterCanvas.prototype.__init28.call(this);LimiterCanvas.prototype.__init29.call(this);LimiterCanvas.prototype.__init30.call(this);
		for (let i = 0; i <= 2; i++) {
			this._ticks.appendChild(SVG.rect({ fill: ColorConfig.tonic, x: (i * this._editorWidth / 2) - 1, y: 0, width: 2, height: this._editorHeight }));
		}
		for (let i = 1; i <= 3; i += 2) {
			this._subticks.appendChild(SVG.rect({ fill: ColorConfig.fifthNote, x: (i * this._editorWidth / 4) - 1, y: 0, width: 1, height: this._editorHeight }));
		}

		this._limiterPrompt = lim;

	}

	 animateVolume(inVolumeCap, historicInCap, outVolumeCap, historicOutCap) {
		this._inVolumeBar.setAttribute("width", "" + Math.min(this._editorWidth, inVolumeCap * (this._editorWidth / 2.0)));
		this._inVolumeCap.setAttribute("x", "" + Math.min(this._editorWidth, historicInCap * (this._editorWidth / 2.0)));
		this._outVolumeBar.setAttribute("width", "" + Math.min(this._editorWidth, outVolumeCap * (this._editorWidth / 2.0)));
		this._outVolumeCap.setAttribute("x", "" + Math.min(this._editorWidth, historicOutCap * (this._editorWidth / 2.0)));
	}

	 render() {
		const controlPointToHeight = (point) => {
			return Math.max(0, (1 - (point / 5)) * (this._editorHeight - 1) + 1);
		}

		let lastValue = 0;
		let currentSubpathIdx = 0;
		let lastSubpathIdx = -1;
		let path = "";
		let subPaths = ["", "", ""];
		for (let i = 0; i < 64; i++) {
			// Calculate next value based on limiter settings
			let limiterRatio = +this._limiterPrompt.limitRatioSlider.value;
			limiterRatio = (limiterRatio < 10 ? limiterRatio / 10 : (limiterRatio - 9));
			let compressorRatio = +this._limiterPrompt.compressionRatioSlider.value;
			compressorRatio = (compressorRatio < 10 ? compressorRatio / 10 : (1 + (compressorRatio - 10) / 60));
			let limiterThreshold = +this._limiterPrompt.limitThresholdSlider.value;
			let compressorThreshold = +this._limiterPrompt.compressionThresholdSlider.value;
			let useVol = i * 2.0 / 64.0; // Scale from 0~2
			let nextValue = 1 / 1.05;
			if (useVol >= limiterThreshold) {
				// Limiter falloff
				nextValue = 1 / (1.05 * (useVol + 1 - limiterThreshold) * limiterRatio + (1 - limiterRatio));
			}
			else if (useVol < compressorThreshold) {
				// Compressor boost
				nextValue = 1 / (((useVol + 1 - compressorThreshold) * 0.8 + 0.25) * compressorRatio + 1.05 * (1 - compressorRatio));
			}

			// first point in entire path
			if (i == 0) {
				path += "M 0 " + prettyNumber(controlPointToHeight(nextValue)) + " ";
			}

			// first point in a specific subpath
			if (currentSubpathIdx > lastSubpathIdx) {
				if (lastSubpathIdx >= 0) {
					subPaths[lastSubpathIdx] += "L " + prettyNumber(i * this._editorWidth / 64) + " " + prettyNumber(controlPointToHeight(nextValue)) + " ";
				}
				subPaths[currentSubpathIdx] += "M " + prettyNumber(i * this._editorWidth / 64) + " " + prettyNumber(controlPointToHeight(nextValue)) + " ";

				if (currentSubpathIdx == 1 || (lastSubpathIdx == 0 && currentSubpathIdx == 2)) {
					this._boostDot.setAttribute("cx", prettyNumber(i * this._editorWidth / 64));
					this._boostDot.setAttribute("cy", prettyNumber(controlPointToHeight(nextValue)));
				}
				if (currentSubpathIdx == 2) {
					this._limitDot.setAttribute("cx", prettyNumber(i * this._editorWidth / 64));
					this._limitDot.setAttribute("cy", prettyNumber(controlPointToHeight(nextValue)));
				}

				lastSubpathIdx = currentSubpathIdx;
			}

			if (lastValue != 0 || nextValue != 0) {
				path += "L ";
				subPaths[currentSubpathIdx] += "L ";
			} else {
				path += "M ";
				subPaths[currentSubpathIdx] += "M ";
			}
			path += prettyNumber(i * this._editorWidth / 64) + " " + prettyNumber(controlPointToHeight(nextValue)) + " ";
			subPaths[currentSubpathIdx] += prettyNumber(i * this._editorWidth / 64) + " " + prettyNumber(controlPointToHeight(nextValue)) + " ";
			lastValue = nextValue;

			// Move to next subpath
			if (currentSubpathIdx == 0 && (i >= compressorThreshold * 32 - 2)) {
				currentSubpathIdx++;
			}
			if (currentSubpathIdx == 1 && (i >= limiterThreshold * 32 - 2)) {
				currentSubpathIdx++;
			}
		}

		const lastHeight = controlPointToHeight(lastValue);
		if (lastValue > 0) {
			path += "L " + (this._editorWidth - 1) + " " + prettyNumber(lastHeight) + " ";
			subPaths[currentSubpathIdx] += "L " + (this._editorWidth - 1) + " " + prettyNumber(lastHeight) + " ";
		}

		this._boostCurve.setAttribute("d", subPaths[0]);
		this._midCurve.setAttribute("d", subPaths[1]);
		this._limitCurve.setAttribute("d", subPaths[2]);
		this._fill.setAttribute("d", path + "L " + this._editorWidth + " " + prettyNumber(lastHeight) + " L " + this._editorWidth + " " + prettyNumber(this._editorHeight) + " L 0 " + prettyNumber(this._editorHeight) + " z ");
	}
}

export class LimiterPrompt  {

	 __init31() {this.limiterCanvas = new LimiterCanvas(this)}

	  __init32() {this._playButton = button({ style: "width: 55%;", type: "button" })}

	  __init33() {this.limitDecaySlider = input({ title: "limit decay", style: `width: 5em; flex-grow: 1; margin: 0;`, type: "range", min: "1", max: "30", value: "4", step: "1" })}
	  __init34() {this.limitRiseSlider = input({ title: "limit rise", style: `width: 5em; flex-grow: 1; margin: 0;`, type: "range", min: "2000", max: "10000", value: "4000", step: "250" })}
	  __init35() {this.compressionThresholdSlider = input({ title: "compressor threshold", style: `width: 100%; flex-grow: 1; margin: 0;`, type: "range", min: "0", max: "1.1", value: "1", step: "0.05" })}
	  __init36() {this.limitThresholdSlider = input({ title: "limiter threshold", style: `width: 100%; flex-grow: 1; margin: 0;`, type: "range", min: "0", max: "2", value: "1", step: "0.05" })}
	  __init37() {this.compressionRatioSlider = input({ title: "compressor ratio", style: `width: 100%; flex-grow: 1; margin: 0;`, type: "range", min: "0", max: "20", value: "10", step: "1" })}
	  __init38() {this.limitRatioSlider = input({ title: "limiter ratio", style: `width: 100%; flex-grow: 1; margin: 0;`, type: "range", min: "0", max: "20", value: "10", step: "1" })}
	  __init39() {this.masterGainSlider = input({ title: "master gain", style: `width: 5em; flex-grow: 1; margin: 0;`, type: "range", min: "0", max: "5", value: "1", step: "0.02" })}

	
	
	
	
	
	
	

	 __init40() {this.inVolumeHistoricTimer = 0.0}
	 __init41() {this.inVolumeHistoricCap = 0.0}
	 __init42() {this.outVolumeHistoricTimer = 0.0}
	 __init43() {this.outVolumeHistoricCap = 0.0}

	  __init44() {this._cancelButton = button({ class: "cancelButton" })}
	  __init45() {this._okayButton = button({ class: "okayButton", style: "width:45%;" }, "Okay")}
	  __init46() {this._resetButton = button({ style: "width:45%;" }, "Reset")}

	  __init47() {this.container = div({ class: "prompt noSelection", style: "width: 250px;" },
		h2("Limiter Options"),
		div({ style: "display: flex; width: 55%; align-self: center; flex-direction: row; align-items: center; justify-content: center;" },
			this._playButton,
		),
		div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: center;" },
			this.limiterCanvas.container,
		),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; margin-top: 1.5em; justify-content: flex-end;" },
			div({ style: `text-align: right; width: 25%; margin-right: 4.5%; color: ${ColorConfig.primaryText};` },
				""
			),
			div({ style: `text-align: center; width: 33%; margin-right: 4.5%; color: ${ColorConfig.textSelection};` },
				"Boost"
			),
			div({ style: `text-align: center; width: 33%; margin-right: 0%; color: ${ColorConfig.linkAccent};` },
				"Cutoff"
			),
		),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; margin-top: 0.5em; justify-content: flex-end;" },
			div({ style: `text-align: right; width: 25%; margin-right: 4.5%; color: ${ColorConfig.primaryText};` },
				"Threshold:"
			),
			div({ style: `width: 33%; margin-right: 4.5%;` },
				this.compressionThresholdSlider,
			),
			div({ style: `width: 33%; margin-right: 0%;` },
				this.limitThresholdSlider,
			),

		),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ style: `text-align: right; width: 25%; margin-right: 4.5%; color: ${ColorConfig.primaryText};` },
				"Ratio:"
			),
			div({ style: `width: 33%; margin-right: 4.5%;` },
				this.compressionRatioSlider,
			),
			div({ style: `width: 33%; margin-right: 0%;` },
				this.limitRatioSlider,
			),
		),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ style: `text-align: right; width: 8.5em; margin-right: 1em; color: ${ColorConfig.primaryText};` },
				"Limit Decay:"
			),
			this.limitDecaySlider,
		),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ style: `text-align: right; width: 8.5em; margin-right: 1em; color: ${ColorConfig.primaryText};` },
				"Limit Rise:"
			),
			this.limitRiseSlider,
		),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ style: `text-align: right; width: 8.5em; margin-right: 1em; color: ${ColorConfig.primaryText};` },
				"Master Gain:"
			),
			this.masterGainSlider,
		),
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
			this._resetButton,
		),
		this._cancelButton,
	)}

	constructor( _doc,  _songEditor) {;this._doc = _doc;this._songEditor = _songEditor;LimiterPrompt.prototype.__init31.call(this);LimiterPrompt.prototype.__init32.call(this);LimiterPrompt.prototype.__init33.call(this);LimiterPrompt.prototype.__init34.call(this);LimiterPrompt.prototype.__init35.call(this);LimiterPrompt.prototype.__init36.call(this);LimiterPrompt.prototype.__init37.call(this);LimiterPrompt.prototype.__init38.call(this);LimiterPrompt.prototype.__init39.call(this);LimiterPrompt.prototype.__init40.call(this);LimiterPrompt.prototype.__init41.call(this);LimiterPrompt.prototype.__init42.call(this);LimiterPrompt.prototype.__init43.call(this);LimiterPrompt.prototype.__init44.call(this);LimiterPrompt.prototype.__init45.call(this);LimiterPrompt.prototype.__init46.call(this);LimiterPrompt.prototype.__init47.call(this);LimiterPrompt.prototype.__init48.call(this);LimiterPrompt.prototype.__init49.call(this);LimiterPrompt.prototype.__init50.call(this);LimiterPrompt.prototype.__init51.call(this);LimiterPrompt.prototype.__init52.call(this);LimiterPrompt.prototype.__init53.call(this);LimiterPrompt.prototype.__init54.call(this);LimiterPrompt.prototype.__init55.call(this);LimiterPrompt.prototype.__init56.call(this);LimiterPrompt.prototype.__init57.call(this);

		this._okayButton.addEventListener("click", this._saveChanges);
		this._resetButton.addEventListener("click", this._resetDefaults);
		this._cancelButton.addEventListener("click", this._close);
		this.container.addEventListener("keydown", this.whenKeyPressed);

		this.limitRatioSlider.value = "" + (this._doc.song.limitRatio < 1 ? this._doc.song.limitRatio * 10 : 9 + this._doc.song.limitRatio);
		this.compressionRatioSlider.value = "" + (this._doc.song.compressionRatio < 1 ? this._doc.song.compressionRatio * 10 : 10 + (this._doc.song.compressionRatio - 1) * 60);
		this.limitThresholdSlider.value = "" + this._doc.song.limitThreshold;
		this.compressionThresholdSlider.value = "" + this._doc.song.compressionThreshold;
		this.limitDecaySlider.value = "" + this._doc.song.limitDecay;
		this.limitRiseSlider.value = "" + this._doc.song.limitRise;
		this.masterGainSlider.value = "" + this._doc.song.masterGain;

		this.startingLimitRatio = +this.limitRatioSlider.value;
		this.startingCompressionRatio = +this.compressionRatioSlider.value;
		this.startingLimitThreshold = +this.limitThresholdSlider.value;
		this.startingCompressionThreshold = +this.compressionThresholdSlider.value;
		this.startingLimitDecay = +this.limitDecaySlider.value;
		this.startingLimitRise = +this.limitRiseSlider.value;
		this.startingMasterGain = +this.masterGainSlider.value;

		this.limitDecaySlider.addEventListener("input", this._whenInput);
		this.limitRiseSlider.addEventListener("input", this._whenInput);
		this.limitRatioSlider.addEventListener("input", this._whenInput);
		this.limitThresholdSlider.addEventListener("input", this._whenInputFavorLimitThreshold);
		this.compressionRatioSlider.addEventListener("input", this._whenInput);
		this.compressionThresholdSlider.addEventListener("input", this._whenInput);
		this.masterGainSlider.addEventListener("input", this._whenInput);

		bindRangeSliderFill(this.limitDecaySlider);
		bindRangeSliderFill(this.limitRiseSlider);
		bindRangeSliderFill(this.compressionThresholdSlider);
		bindRangeSliderFill(this.limitThresholdSlider);
		bindRangeSliderFill(this.compressionRatioSlider);
		bindRangeSliderFill(this.limitRatioSlider);
		bindRangeSliderFill(this.masterGainSlider);

		this._playButton.addEventListener("click", this._togglePlay);

		window.requestAnimationFrame(this._volumeUpdate);

		this.updatePlayButton();

		setTimeout(() => this._playButton.focus());

		this.limiterCanvas.render();
	}

	 __init48() {this._volumeUpdate = () => {
		this.inVolumeHistoricTimer--;
		if (this.inVolumeHistoricTimer <= 0) {
			this.inVolumeHistoricCap -= 0.03;
		}
		if (this._doc.song.inVolumeCap > this.inVolumeHistoricCap) {
			this.inVolumeHistoricCap = this._doc.song.inVolumeCap;
			this.inVolumeHistoricTimer = 50;
		}

		this.outVolumeHistoricTimer--;
		if (this.outVolumeHistoricTimer <= 0) {
			this.outVolumeHistoricCap -= 0.03;
		}
		if (this._doc.song.outVolumeCap > this.outVolumeHistoricCap) {
			this.outVolumeHistoricCap = this._doc.song.outVolumeCap;
			this.outVolumeHistoricTimer = 50;
		}

		this.limiterCanvas.animateVolume(this._doc.song.inVolumeCap, this.inVolumeHistoricCap, this._doc.song.outVolumeCap, this.outVolumeHistoricCap);
		//console.log(this._doc.song.volumeCap);
		window.requestAnimationFrame(this._volumeUpdate);
	}}

	 __init49() {this._togglePlay = () => {
		this._songEditor.togglePlay();
		this.updatePlayButton();
	}}

	 updatePlayButton() {
		if (this._doc.synth.playing) {
			this._playButton.classList.remove("playButton");
			this._playButton.classList.add("pauseButton");
			this._playButton.title = "Pause (Space)";
			this._playButton.innerText = "Pause";
		} else {
			this._playButton.classList.remove("pauseButton");
			this._playButton.classList.add("playButton");
			this._playButton.title = "Play (Space)";
			this._playButton.innerText = "Play";
		}
	}

	 __init50() {this._whenInput = () => {
		if (+this.limitThresholdSlider.value < +this.compressionThresholdSlider.value) {
			this.limitThresholdSlider.removeEventListener("input", this._whenInputFavorLimitThreshold);
			this.limitThresholdSlider.value = this.compressionThresholdSlider.value;
			this.limitThresholdSlider.addEventListener("input", this._whenInputFavorLimitThreshold);
		}
		this.limiterCanvas.render();
		this._updateLimiter();
	}}

	// Same as above, but for conflicts between limiter threshold and compressor threshold, favor the limiter
	 __init51() {this._whenInputFavorLimitThreshold = () => {
		if (+this.limitThresholdSlider.value < +this.compressionThresholdSlider.value) {
			this.compressionThresholdSlider.removeEventListener("input", this._whenInput);
			this.compressionThresholdSlider.value = this.limitThresholdSlider.value;
			this.compressionThresholdSlider.addEventListener("input", this._whenInput);
		}
		this.limiterCanvas.render();
		this._updateLimiter();
	}}

	 __init52() {this._close = () => {
		// Reset all sliders to starting values
		this.limitRatioSlider.value = "" + this.startingLimitRatio;
		this.compressionRatioSlider.value = "" + this.startingCompressionRatio;
		this.limitThresholdSlider.value = "" + this.startingLimitThreshold;
		this.compressionThresholdSlider.value = "" + this.startingCompressionThreshold;
		this.limitDecaySlider.value = "" + this.startingLimitDecay;
		this.limitRiseSlider.value = "" + this.startingLimitRise;
		this.masterGainSlider.value = "" + this.startingMasterGain;

		this._updateLimiter();
		this._doc.prompt = null;
	}}

	 __init53() {this.cleanUp = () => {
		this._okayButton.removeEventListener("click", this._saveChanges);
		this._resetButton.removeEventListener("click", this._resetDefaults);
		this._cancelButton.removeEventListener("click", this._close);
		this.container.removeEventListener("keydown", this.whenKeyPressed);
		this.limitDecaySlider.removeEventListener("input", this._whenInput);
		this.limitRiseSlider.removeEventListener("input", this._whenInput);
		this.limitThresholdSlider.removeEventListener("input", this._whenInputFavorLimitThreshold);
		this.limitRatioSlider.removeEventListener("input", this._whenInput);
		this.compressionRatioSlider.removeEventListener("input", this._whenInput);
		this.compressionThresholdSlider.removeEventListener("input", this._whenInput);
		this.masterGainSlider.removeEventListener("input", this._whenInput);

		this._playButton.removeEventListener("click", this._togglePlay);
	}}

	 __init54() {this.whenKeyPressed = (event) => {
		if ((event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
			this._saveChanges();
		}
		if (event.keyCode == 32) {
			this._togglePlay();
			event.preventDefault();
		}
	}}

	 __init55() {this._resetDefaults = () => {
		// Set song limiter settings to their default
		if (this.limitRatioSlider.value != "10" || this.limitRiseSlider.value != "4000" || this.limitDecaySlider.value != "4" || this.limitThresholdSlider.value != "1" || this.compressionRatioSlider.value != "10" || this.compressionThresholdSlider.value != "1" || this.masterGainSlider.value != "1") {

			this.limitRatioSlider.value = "10";
			this.limitRiseSlider.value = "4000";
			this.limitDecaySlider.value = "4";
			this.limitThresholdSlider.value = "1";
			this.compressionRatioSlider.value = "10";
			this.compressionThresholdSlider.value = "1";
			this.masterGainSlider.value = "1";

			this._whenInput();
		}
	}}

	 __init56() {this._updateLimiter = () => {
		// Save slider values to song
		this._doc.record(new ChangeLimiterSettings(this._doc,
			(+this.limitRatioSlider.value < 10 ? +this.limitRatioSlider.value / 10 : (+this.limitRatioSlider.value - 9)),
			(+this.compressionRatioSlider.value < 10 ? +this.compressionRatioSlider.value / 10 : (1 + (+this.compressionRatioSlider.value - 10) / 60)),
			+this.limitThresholdSlider.value,
			+this.compressionThresholdSlider.value,
			+this.limitRiseSlider.value,
			+this.limitDecaySlider.value,
			+this.masterGainSlider.value,
		), true);
	}}

	 __init57() {this._saveChanges = () => {
		this._updateLimiter();
		this._doc.prompt = null;

	}}
}
//}
