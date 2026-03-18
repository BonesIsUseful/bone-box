// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Config } from "../synth/SynthConfig.js";
import { clamp, Synth } from "../synth/synth.js";

import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig.js";
import { ChangeSequence } from "./Change.js";
import { ChangeFadeInOut } from "./changes.js";

export class FadeInOutEditor {
	  __init() {this._editorWidth = 120}
	  __init2() {this._editorHeight = 26}
	  __init3() {this._fadeCurve = SVG.path({fill: ColorConfig.uiWidgetBackground, "pointer-events": "none"})}
	  __init4() {this._dottedLinePath = SVG.path({fill: "none", stroke: "currentColor", "stroke-width": 1, "stroke-dasharray": "3, 2", "pointer-events": "none"})}
	  __init5() {this._controlCurve = SVG.path({fill: "none", stroke: "currentColor", "stroke-width": 2, "pointer-events": "none"})}
	  __init6() {this._svg = SVG.svg({style: `background-color: ${ColorConfig.editorBackground}; touch-action: none; cursor: crosshair;`, width: "100%", height: "100%", viewBox: "0 0 "+this._editorWidth+" "+this._editorHeight, preserveAspectRatio: "none"},
		this._fadeCurve,
		this._dottedLinePath,
		this._controlCurve,
	)}
	  __init7() {this.container = HTML.div({class: "fadeInOut", style: "height: 100%;"}, this._svg)}
	
	 __init8() {this._mouseX = 0}
	 __init9() {this._mouseXStart = 0}
	 __init10() {this._mouseDown = false}
	 __init11() {this._mouseDragging = false}
	 __init12() {this._draggingFadeIn = false}
	 __init13() {this._dragChange = null}
	 __init14() {this._renderedFadeIn = -1}
	 __init15() {this._renderedFadeOut = -1}
	
	constructor( _doc) {;this._doc = _doc;FadeInOutEditor.prototype.__init.call(this);FadeInOutEditor.prototype.__init2.call(this);FadeInOutEditor.prototype.__init3.call(this);FadeInOutEditor.prototype.__init4.call(this);FadeInOutEditor.prototype.__init5.call(this);FadeInOutEditor.prototype.__init6.call(this);FadeInOutEditor.prototype.__init7.call(this);FadeInOutEditor.prototype.__init8.call(this);FadeInOutEditor.prototype.__init9.call(this);FadeInOutEditor.prototype.__init10.call(this);FadeInOutEditor.prototype.__init11.call(this);FadeInOutEditor.prototype.__init12.call(this);FadeInOutEditor.prototype.__init13.call(this);FadeInOutEditor.prototype.__init14.call(this);FadeInOutEditor.prototype.__init15.call(this);FadeInOutEditor.prototype.__init16.call(this);FadeInOutEditor.prototype.__init17.call(this);FadeInOutEditor.prototype.__init18.call(this);FadeInOutEditor.prototype.__init19.call(this);FadeInOutEditor.prototype.__init20.call(this);
		const dottedLineX = this._fadeOutToX(Config.fadeOutNeutral);
		this._dottedLinePath.setAttribute("d", `M ${dottedLineX} 0 L ${dottedLineX} ${this._editorHeight}`);
		
		this.container.addEventListener("mousedown", this._whenMousePressed);
		document.addEventListener("mousemove", this._whenMouseMoved);
		document.addEventListener("mouseup", this._whenCursorReleased);
		this.container.addEventListener("touchstart", this._whenTouchPressed);
		this.container.addEventListener("touchmove", this._whenTouchMoved);
		this.container.addEventListener("touchend", this._whenCursorReleased);
		this.container.addEventListener("touchcancel", this._whenCursorReleased);
	}
	
	 _fadeInToX(fadeIn) {
		return 1.0 + (this._editorWidth - 2.0) * 0.4 * fadeIn / (Config.fadeInRange - 1);
	}
	 _xToFadeIn(x) {
		return clamp(0, Config.fadeInRange, Math.round((x - 1.0) * (Config.fadeInRange - 1) / (0.4 * this._editorWidth - 2.0)));
	}
	 _fadeOutToX(fadeOut) {
		return 1.0 + (this._editorWidth - 2.0) * (0.5 + 0.5 * fadeOut / (Config.fadeOutTicks.length - 1));
	}
	 _xToFadeOut(x) {
		return clamp(0, Config.fadeOutTicks.length, Math.round((Config.fadeOutTicks.length - 1) * ((x - 1.0) / (this._editorWidth - 2.0) - 0.5) / 0.5));
	}
	
	 __init16() {this._whenMousePressed = (event) => {
		event.preventDefault();
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = ((event.clientX || event.pageX) - boundingRect.left);
		this._whenCursorPressed();
	}}
	
	 __init17() {this._whenTouchPressed = (event) => {
		event.preventDefault();
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.touches[0].clientX - boundingRect.left);
		this._whenCursorPressed();
	}}
	
	 _whenCursorPressed() {
		if (isNaN(this._mouseX)) this._mouseX = 0;
		this._mouseXStart = this._mouseX;
		this._mouseDown = true;
		this._mouseDragging = false;
		const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
		const fadeInX = this._fadeInToX(instrument.fadeIn);
		const fadeOutX = this._fadeOutToX(instrument.fadeOut);
		this._draggingFadeIn = this._mouseXStart < (fadeInX + fadeOutX) / 2.0;
		this._dragChange = new ChangeSequence();
		this._doc.setProspectiveChange(this._dragChange);
	}
	
	 __init18() {this._whenMouseMoved = (event) => {
		if (this.container.offsetParent == null) return;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = ((event.clientX || event.pageX) - boundingRect.left);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		this._whenCursorMoved();
	}}
	
	 __init19() {this._whenTouchMoved = (event) => {
		if (this.container.offsetParent == null) return;
		if (!this._mouseDown) return;
		event.preventDefault();
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.touches[0].clientX - boundingRect.left);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		this._whenCursorMoved();
	}}
	
	 _whenCursorMoved() {
		if (this._dragChange != null && this._doc.lastChangeWas(this._dragChange)) {
			this._dragChange.undo();
		} else {
			this._mouseDown = false;
		}
		this._dragChange = null;
		
		if (this._mouseDown) {
			const sequence = new ChangeSequence();
			this._dragChange = sequence;
			this._doc.setProspectiveChange(this._dragChange);
			
			if (Math.abs(this._mouseX - this._mouseXStart) > 4.0) {
				this._mouseDragging = true;
			}
			
			if (this._mouseDragging) {
				const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
				if (this._draggingFadeIn) {
					sequence.append(new ChangeFadeInOut(this._doc, this._xToFadeIn(this._fadeInToX(instrument.fadeIn) + this._mouseX - this._mouseXStart), instrument.fadeOut));
				} else {
					sequence.append(new ChangeFadeInOut(this._doc, instrument.fadeIn, this._xToFadeOut(this._fadeOutToX(instrument.fadeOut) + this._mouseX - this._mouseXStart)));
				}
			}
		}
	}
	
	 __init20() {this._whenCursorReleased = (event) => {
		if (this.container.offsetParent == null) return;
		if (this._mouseDown && this._doc.lastChangeWas(this._dragChange) && this._dragChange != null) {
			if (!this._mouseDragging) {
				const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
				if (this._draggingFadeIn) {
					this._doc.record(new ChangeFadeInOut(this._doc, this._xToFadeIn(this._mouseX), instrument.fadeOut));
				} else {
					this._doc.record(new ChangeFadeInOut(this._doc, instrument.fadeIn, this._xToFadeOut(this._mouseX)));
				}
			} else {
				this._doc.record(this._dragChange);
			}
		}
		this._dragChange = null;
		this._mouseDragging = false;
		this._mouseDown = false;
	}}
	
	 render() {
		const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
		
		if (this._renderedFadeIn == instrument.fadeIn && this._renderedFadeOut == instrument.fadeOut) {
			return;
		}
		
		const fadeInX = this._fadeInToX(instrument.fadeIn);
		const fadeOutX = this._fadeOutToX(instrument.fadeOut);
		this._controlCurve.setAttribute("d", `M ${fadeInX} 0 L ${fadeInX} ${this._editorHeight} M ${fadeOutX} 0 L ${fadeOutX} ${this._editorHeight}`);
		
		const dottedLineX = this._fadeOutToX(Config.fadeOutNeutral);
		let fadePath = "";
		fadePath += `M 0 ${this._editorHeight} `;
		fadePath += `L ${fadeInX} 0 `;
		if (Synth.fadeOutSettingToTicks(instrument.fadeOut) > 0) {
			fadePath += `L ${dottedLineX} 0 `;
			fadePath += `L ${fadeOutX} ${this._editorHeight} `;
		} else {
			fadePath += `L ${fadeOutX} 0 `;
			fadePath += `L ${dottedLineX} ${this._editorHeight} `;
		}
		fadePath += "z";
		this._fadeCurve.setAttribute("d", fadePath);
	}
}
