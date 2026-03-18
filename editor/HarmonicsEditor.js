// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Config } from "../synth/SynthConfig.js";


import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig.js";
import { ChangeHarmonics } from "./changes.js";
import { prettyNumber } from "./EditorConfig.js";

export class HarmonicsEditor {
	  __init() {this._editorWidth = 120}
	  __init2() {this._editorHeight = 26}
		  __init3() {this._octaves = SVG.svg({"pointer-events": "none"})}
		  __init4() {this._fifths = SVG.svg({"pointer-events": "none"})}
		  __init5() {this._curve = SVG.path({fill: "none", stroke: "currentColor", "stroke-width": 2, "pointer-events": "none"})}
	  __init6() {this._lastControlPoints = []}
		  __init7() {this._lastControlPointContainer = SVG.svg({"pointer-events": "none"})}
	  __init8() {this._svg = SVG.svg({ style: "background-color: ${ColorConfig.editorBackground}; touch-action: none; cursor: crosshair;", width: "100%", height: "100%", viewBox: "0 0 " + this._editorWidth + " " + this._editorHeight, preserveAspectRatio: "none" },
		this._octaves,
		this._fifths,
		this._curve,
		this._lastControlPointContainer,
	)}
		
	  __init9() {this.container = HTML.div({class: "harmonics", style: "height: 100%;"}, this._svg)}
		
	 __init10() {this._mouseX = 0}
	 __init11() {this._mouseY = 0}
	 __init12() {this._freqPrev = 0}
	 __init13() {this._ampPrev = 0}
	 __init14() {this._mouseDown = false}
	 __init15() {this._change = null}
	 __init16() {this._renderedPath = ""}
	 __init17() {this._renderedFifths = true}
		
	constructor( _doc) {;this._doc = _doc;HarmonicsEditor.prototype.__init.call(this);HarmonicsEditor.prototype.__init2.call(this);HarmonicsEditor.prototype.__init3.call(this);HarmonicsEditor.prototype.__init4.call(this);HarmonicsEditor.prototype.__init5.call(this);HarmonicsEditor.prototype.__init6.call(this);HarmonicsEditor.prototype.__init7.call(this);HarmonicsEditor.prototype.__init8.call(this);HarmonicsEditor.prototype.__init9.call(this);HarmonicsEditor.prototype.__init10.call(this);HarmonicsEditor.prototype.__init11.call(this);HarmonicsEditor.prototype.__init12.call(this);HarmonicsEditor.prototype.__init13.call(this);HarmonicsEditor.prototype.__init14.call(this);HarmonicsEditor.prototype.__init15.call(this);HarmonicsEditor.prototype.__init16.call(this);HarmonicsEditor.prototype.__init17.call(this);HarmonicsEditor.prototype.__init18.call(this);HarmonicsEditor.prototype.__init19.call(this);HarmonicsEditor.prototype.__init20.call(this);HarmonicsEditor.prototype.__init21.call(this);HarmonicsEditor.prototype.__init22.call(this);
		for (let i = 1; i <= Config.harmonicsControlPoints; i = i * 2) {
				this._octaves.appendChild(SVG.rect({fill: ColorConfig.tonic, x: (i-0.5) * (this._editorWidth - 8) / (Config.harmonicsControlPoints - 1) - 1, y: 0, width: 2, height: this._editorHeight}));
		}
		for (let i = 3; i <= Config.harmonicsControlPoints; i = i * 2) {
				this._fifths.appendChild(SVG.rect({fill: ColorConfig.fifthNote, x: (i-0.5) * (this._editorWidth - 8) / (Config.harmonicsControlPoints - 1) - 1, y: 0, width: 2, height: this._editorHeight}));
		}
		for (let i = 0; i < 4; i++) {
				const rect = SVG.rect({fill: "currentColor", x: (this._editorWidth - i * 2 - 1), y: 0, width: 1, height: this._editorHeight});
			this._lastControlPoints.push(rect);
			this._lastControlPointContainer.appendChild(rect);
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
		return (Config.harmonicsControlPoints - 1) * x / (this._editorWidth - 8) - 0.5;
	}
		
	 _yToAmp(y) {
		return Config.harmonicsMax * (1 - y / this._editorHeight);
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
			const harmonicsWave = instrument.harmonicsWave; //(this._harmonicsIndex == null) ? instrument.harmonicsWave : instrument.drumsetSpectrumWaves[this._harmonicsIndex];
				
			if (freq != this._freqPrev) {
				const slope = (amp - this._ampPrev) / (freq - this._freqPrev);
				const offset = this._ampPrev - this._freqPrev * slope;
				const lowerFreq = Math.ceil(Math.min(this._freqPrev, freq));
				const upperFreq = Math.floor(Math.max(this._freqPrev, freq));
				for (let i = lowerFreq; i <= upperFreq; i++) {
					if (i < 0 || i >= Config.harmonicsControlPoints) continue;
					harmonicsWave.harmonics[i] = Math.max(0, Math.min(Config.harmonicsMax, Math.round(i * slope + offset)));
				}
			}
				
			harmonicsWave.harmonics[Math.max(0, Math.min(Config.harmonicsControlPoints - 1, Math.round(freq)))] = Math.max(0, Math.min(Config.harmonicsMax, Math.round(amp)));
				
			this._freqPrev = freq;
			this._ampPrev = amp;
				
			this._change = new ChangeHarmonics(this._doc, instrument, harmonicsWave);
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
		const harmonicsWave = instrument.harmonicsWave; //(this._harmonicsIndex == null) ? instrument.harmonicsWave : instrument.drumsetSpectrumWaves[this._harmonicsIndex];
		const controlPointToHeight = (point) => {
			return (1 - (point / Config.harmonicsMax)) * this._editorHeight;
		}
			
		let bottom = prettyNumber(this._editorHeight);
		let path = "";
		for (let i = 0; i < Config.harmonicsControlPoints - 1; i++) {
			if (harmonicsWave.harmonics[i] == 0) continue;
			let xPos = prettyNumber((i + 0.5) * (this._editorWidth - 8) / (Config.harmonicsControlPoints - 1));
			path += "M " + xPos + " " + bottom + " ";
			path += "L " + xPos + " " + prettyNumber(controlPointToHeight(harmonicsWave.harmonics[i])) + " ";
		}
			
		const lastHeight = controlPointToHeight(harmonicsWave.harmonics[Config.harmonicsControlPoints - 1]);
		for (let i = 0; i < 4; i++) {
			const rect = this._lastControlPoints[i];
			rect.setAttribute("y", prettyNumber(lastHeight));
			rect.setAttribute("height", prettyNumber(this._editorHeight - lastHeight));
		}
			
		if (this._renderedPath != path) {
			this._renderedPath = path;
			this._curve.setAttribute("d", path);
		}
		if (this._renderedFifths != this._doc.prefs.showFifth) {
			this._renderedFifths = this._doc.prefs.showFifth;
			this._fifths.style.display = this._doc.prefs.showFifth ? "" : "none";
		}
	}
}
