// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Config } from "../synth/SynthConfig.js";


import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig.js";
import { ChangeSpectrum } from "./changes.js";
import { prettyNumber } from "./EditorConfig.js";

export class SpectrumEditor {
	  __init() {this._editorWidth = 120}
	  __init2() {this._editorHeight = 26}
		  __init3() {this._fill = SVG.path({fill: ColorConfig.uiWidgetBackground, "pointer-events": "none"})}
		  __init4() {this._octaves = SVG.svg({"pointer-events": "none"})}
		  __init5() {this._fifths = SVG.svg({"pointer-events": "none"})}
		  __init6() {this._curve = SVG.path({fill: "none", stroke: "currentColor", "stroke-width": 2, "pointer-events": "none"})}
		  __init7() {this._arrow = SVG.path({fill: "currentColor", "pointer-events": "none"})}
		  __init8() {this._svg = SVG.svg({style: `background-color: ${ColorConfig.editorBackground}; touch-action: none; cursor: crosshair;`, width: "100%", height: "100%", viewBox: "0 0 "+this._editorWidth+" "+this._editorHeight, preserveAspectRatio: "none"},
		this._fill,
		this._octaves,
		this._fifths,
		this._curve,
		this._arrow,
	)}
		
	  __init9() {this.container = HTML.div({class: "spectrum", style: "height: 100%;"}, this._svg)}
		
	 __init10() {this._mouseX = 0}
	 __init11() {this._mouseY = 0}
	 __init12() {this._freqPrev = 0}
	 __init13() {this._ampPrev = 0}
	 __init14() {this._mouseDown = false}
	 __init15() {this._change = null}
	 __init16() {this._renderedPath = ""}
	 __init17() {this._renderedFifths = true}
		
	constructor( _doc,  _spectrumIndex) {;this._doc = _doc;this._spectrumIndex = _spectrumIndex;SpectrumEditor.prototype.__init.call(this);SpectrumEditor.prototype.__init2.call(this);SpectrumEditor.prototype.__init3.call(this);SpectrumEditor.prototype.__init4.call(this);SpectrumEditor.prototype.__init5.call(this);SpectrumEditor.prototype.__init6.call(this);SpectrumEditor.prototype.__init7.call(this);SpectrumEditor.prototype.__init8.call(this);SpectrumEditor.prototype.__init9.call(this);SpectrumEditor.prototype.__init10.call(this);SpectrumEditor.prototype.__init11.call(this);SpectrumEditor.prototype.__init12.call(this);SpectrumEditor.prototype.__init13.call(this);SpectrumEditor.prototype.__init14.call(this);SpectrumEditor.prototype.__init15.call(this);SpectrumEditor.prototype.__init16.call(this);SpectrumEditor.prototype.__init17.call(this);SpectrumEditor.prototype.__init18.call(this);SpectrumEditor.prototype.__init19.call(this);SpectrumEditor.prototype.__init20.call(this);SpectrumEditor.prototype.__init21.call(this);SpectrumEditor.prototype.__init22.call(this);
		for (let i = 0; i < Config.spectrumControlPoints; i += Config.spectrumControlPointsPerOctave) {
				this._octaves.appendChild(SVG.rect({fill: ColorConfig.tonic, x: (i+1) * this._editorWidth / (Config.spectrumControlPoints + 2) - 1, y: 0, width: 2, height: this._editorHeight}));
		}
		for (let i = 4; i <= Config.spectrumControlPoints; i += Config.spectrumControlPointsPerOctave) {
				this._fifths.appendChild(SVG.rect({fill: ColorConfig.fifthNote, x: (i+1) * this._editorWidth / (Config.spectrumControlPoints + 2) - 1, y: 0, width: 2, height: this._editorHeight}));
		}
			
		this.container.addEventListener("mousedown", this._whenMousePressed);
		document.addEventListener("mousemove", this._whenMouseMoved);
		document.addEventListener("mouseup", this._whenCursorReleased);
			
		this.container.addEventListener("touchstart", this._whenTouchPressed);
		this.container.addEventListener("touchmove", this._whenTouchMoved);
		this.container.addEventListener("touchend", this._whenCursorReleased);
		this.container.addEventListener("touchcancel", this._whenCursorReleased);
	}
		
	 _xToFreq(x) {
		return (Config.spectrumControlPoints + 2) * x / this._editorWidth - 1;
	}
		
	 _yToAmp(y) {
		return Config.spectrumMax * (1 - (y - 1) / (this._editorHeight - 2));
	}
		
	 __init18() {this._whenMousePressed = (event) => {
		event.preventDefault();
		this._mouseDown = true;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = ((event.clientX || event.pageX) - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
		this._mouseY = ((event.clientY || event.pageY) - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;
		    
		this._freqPrev = this._xToFreq(this._mouseX);
		this._ampPrev = this._yToAmp(this._mouseY);
		this._whenCursorMoved();
	}}
		
	 __init19() {this._whenTouchPressed = (event) => {
		event.preventDefault();
		this._mouseDown = true;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.touches[0].clientX - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
		this._mouseY = (event.touches[0].clientY - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;
		    
		this._freqPrev = this._xToFreq(this._mouseX);
		this._ampPrev = this._yToAmp(this._mouseY);
		this._whenCursorMoved();
	}}
		
	 __init20() {this._whenMouseMoved = (event) => {
		if (this.container.offsetParent == null) return;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = ((event.clientX || event.pageX) - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
		this._mouseY = ((event.clientY || event.pageY) - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;
		this._whenCursorMoved();
	}}
		
	 __init21() {this._whenTouchMoved = (event) => {
		if (this.container.offsetParent == null) return;
		if (!this._mouseDown) return;
		event.preventDefault();
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.touches[0].clientX - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
		this._mouseY = (event.touches[0].clientY - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;
		this._whenCursorMoved();
	}}
		
	 _whenCursorMoved() {
		if (this._mouseDown) {
			const freq = this._xToFreq(this._mouseX);
			const amp = this._yToAmp(this._mouseY);
				
			const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
			const spectrumWave = (this._spectrumIndex == null) ? instrument.spectrumWave : instrument.drumsetSpectrumWaves[this._spectrumIndex];
				
			if (freq != this._freqPrev) {
				const slope = (amp - this._ampPrev) / (freq - this._freqPrev);
				const offset = this._ampPrev - this._freqPrev * slope;
				const lowerFreq = Math.ceil(Math.min(this._freqPrev, freq));
				const upperFreq = Math.floor(Math.max(this._freqPrev, freq));
				for (let i = lowerFreq; i <= upperFreq; i++) {
					if (i < 0 || i >= Config.spectrumControlPoints) continue;
					spectrumWave.spectrum[i] = Math.max(0, Math.min(Config.spectrumMax, Math.round(i * slope + offset)));
				}
			}
				
			spectrumWave.spectrum[Math.max(0, Math.min(Config.spectrumControlPoints - 1, Math.round(freq)))] = Math.max(0, Math.min(Config.spectrumMax, Math.round(amp)));
				
			this._freqPrev = freq;
			this._ampPrev = amp;
				
			this._change = new ChangeSpectrum(this._doc, instrument, spectrumWave);
			this._doc.setProspectiveChange(this._change);
		}
	}
		
	 __init22() {this._whenCursorReleased = (event) => {
		if (this._mouseDown) {
			this._doc.record(this._change);
			this._change = null;
		}
		this._mouseDown = false;
	}}
		
	 render() {
		const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
		const spectrumWave = (this._spectrumIndex == null) ? instrument.spectrumWave : instrument.drumsetSpectrumWaves[this._spectrumIndex];
		const controlPointToHeight = (point) => {
			return (1 - (point / Config.spectrumMax)) * (this._editorHeight - 1) + 1;
		}
			
		let lastValue = 0;
		let path = "M 0 " + prettyNumber(this._editorHeight) + " ";
		for (let i = 0; i < Config.spectrumControlPoints; i++) {
			let nextValue = spectrumWave.spectrum[i];
			if (lastValue != 0 || nextValue != 0) {
				path += "L ";
			} else {
				path += "M ";
			}
			path += prettyNumber((i + 1) * this._editorWidth / (Config.spectrumControlPoints + 2)) + " " + prettyNumber(controlPointToHeight(nextValue)) + " ";
			lastValue = nextValue;
		}
			
		const lastHeight = controlPointToHeight(lastValue);
		if (lastValue > 0) {
			path += "L " + (this._editorWidth - 1) + " " + prettyNumber(lastHeight) + " ";
		}
			
		if (this._renderedPath != path) {
			this._renderedPath = path;
			this._curve.setAttribute("d", path);
			this._fill.setAttribute("d", path + "L " + this._editorWidth + " " + prettyNumber(lastHeight) + " L " + this._editorWidth + " " + prettyNumber(this._editorHeight) + " L 0 " + prettyNumber(this._editorHeight) + " z ");
				
			this._arrow.setAttribute("d", "M " + this._editorWidth + " " + prettyNumber(lastHeight) + " L " + (this._editorWidth - 4) + " " + prettyNumber(lastHeight - 4) + " L " + (this._editorWidth - 4) + " " + prettyNumber(lastHeight + 4) + " z");
			this._arrow.style.display = (lastValue > 0) ? "" : "none";
		}
		if (this._renderedFifths != this._doc.prefs.showFifth) {
			this._renderedFifths = this._doc.prefs.showFifth;
			this._fifths.style.display = this._doc.prefs.showFifth ? "" : "none";
		}
	}
}
