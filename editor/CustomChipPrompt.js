// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";


import { ColorConfig } from "./ColorConfig.js";
import { ChangeCustomWave } from "./changes.js";


//namespace beepbox {
const { button, div, h2 } = HTML;

export class CustomChipPromptCanvas {
	
	 __init() {this._mouseX = 0}
	 __init2() {this._mouseY = 0}
	 __init3() {this._lastIndex = 0}
	 __init4() {this._lastAmp = 0}
	 __init5() {this._mouseDown = false}
	 __init6() {this.chipData = new Float32Array(64)}
	 __init7() {this.startingChipData = new Float32Array(64)}
	 __init8() {this._undoHistoryState = 0}
	 __init9() {this._changeQueue = []}
	  __init10() {this._editorWidth = 768} // 64*12
	  __init11() {this._editorHeight = 294} // 49*6
	  __init12() {this._fill = SVG.path({ fill: ColorConfig.uiWidgetBackground, "pointer-events": "none" })}
	  __init13() {this._ticks = SVG.svg({ "pointer-events": "none" })}
	  __init14() {this._subticks = SVG.svg({ "pointer-events": "none" })}
	  __init15() {this._blocks = SVG.svg({ "pointer-events": "none" })}
	  __init16() {this._svg = SVG.svg({ style: `background-color: ${ColorConfig.editorBackground}; touch-action: none; overflow: visible;`, width: "100%", height: "100%", viewBox: "0 0 " + this._editorWidth + " " + this._editorHeight, preserveAspectRatio: "none" },
		this._fill,
		this._ticks,
		this._subticks,
		this._blocks,
	)}

	  __init17() {this.container = HTML.div({ class: "", style: "height: 294px; width: 768px; padding-bottom: 1.5em;" }, this._svg)}

	constructor(doc) {;CustomChipPromptCanvas.prototype.__init.call(this);CustomChipPromptCanvas.prototype.__init2.call(this);CustomChipPromptCanvas.prototype.__init3.call(this);CustomChipPromptCanvas.prototype.__init4.call(this);CustomChipPromptCanvas.prototype.__init5.call(this);CustomChipPromptCanvas.prototype.__init6.call(this);CustomChipPromptCanvas.prototype.__init7.call(this);CustomChipPromptCanvas.prototype.__init8.call(this);CustomChipPromptCanvas.prototype.__init9.call(this);CustomChipPromptCanvas.prototype.__init10.call(this);CustomChipPromptCanvas.prototype.__init11.call(this);CustomChipPromptCanvas.prototype.__init12.call(this);CustomChipPromptCanvas.prototype.__init13.call(this);CustomChipPromptCanvas.prototype.__init14.call(this);CustomChipPromptCanvas.prototype.__init15.call(this);CustomChipPromptCanvas.prototype.__init16.call(this);CustomChipPromptCanvas.prototype.__init17.call(this);CustomChipPromptCanvas.prototype.__init18.call(this);CustomChipPromptCanvas.prototype.__init19.call(this);CustomChipPromptCanvas.prototype.__init20.call(this);CustomChipPromptCanvas.prototype.__init21.call(this);CustomChipPromptCanvas.prototype.__init22.call(this);CustomChipPromptCanvas.prototype.__init23.call(this);CustomChipPromptCanvas.prototype.__init24.call(this);CustomChipPromptCanvas.prototype.__init25.call(this);CustomChipPromptCanvas.prototype.__init26.call(this);

		this._doc = doc;

		for (let i = 0; i <= 4; i += 2) {
			this._ticks.appendChild(SVG.rect({ fill: ColorConfig.tonic, x: (i * this._editorWidth / 4) - 1, y: 0, width: 2, height: this._editorHeight }));
		}
		for (let i = 1; i <= 8; i++) {
			this._subticks.appendChild(SVG.rect({ fill: ColorConfig.fifthNote, x: (i * this._editorWidth / 8) - 1, y: 0, width: 1, height: this._editorHeight }));
		}

		// Horiz. ticks
		this._ticks.appendChild(SVG.rect({ fill: ColorConfig.tonic, x: 0, y: (this._editorHeight / 2) - 1, width: this._editorWidth, height: 2 }));
		for (let i = 0; i < 3; i++) {
			this._subticks.appendChild(SVG.rect({ fill: ColorConfig.fifthNote, x: 0, y: i * 8 * (this._editorHeight / 49), width: this._editorWidth, height: 1 }));
			this._subticks.appendChild(SVG.rect({ fill: ColorConfig.fifthNote, x: 0, y: this._editorHeight - 1 - i * 8 * (this._editorHeight / 49), width: this._editorWidth, height: 1 }));
		}


		let col = ColorConfig.getChannelColor(this._doc.song, this._doc.channel).primaryNote;

		for (let i = 0; i <= 64; i++) {
			let val = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].customChipWave[i];
			this.chipData[i] = val;
			this.startingChipData[i] = val;
			this._blocks.appendChild(SVG.rect({ fill: col, x: (i * this._editorWidth / 64), y: (val + 24) * (this._editorHeight / 49), width: this._editorWidth / 64, height: this._editorHeight / 49 }));
		}

		// Record initial state of the chip data queue
		this._storeChange();

		this.container.addEventListener("mousedown", this._whenMousePressed);
		document.addEventListener("mousemove", this._whenMouseMoved);
		document.addEventListener("mouseup", this._whenCursorReleased);

		this.container.addEventListener("touchstart", this._whenTouchPressed);
		this.container.addEventListener("touchmove", this._whenTouchMoved);
		this.container.addEventListener("touchend", this._whenCursorReleased);
		this.container.addEventListener("touchcancel", this._whenCursorReleased);

		this._svg.addEventListener("keydown", this._whenKeyPressed);
		this.container.addEventListener("keydown", this._whenKeyPressed);

	}

	 __init18() {this._storeChange = () => {
		// Check if change is unique compared to the current history state
		var sameCheck = true;
		if (this._changeQueue.length > 0) {
			for (var i = 0; i < 64; i++) {
				if (this._changeQueue[this._undoHistoryState][i] != this.chipData[i]) {
					sameCheck = false; i = 64;
				}
			}
		}

		if (sameCheck == false || this._changeQueue.length == 0) {

			// Create new branch in history, removing all after this in time
			this._changeQueue.splice(0, this._undoHistoryState);

			this._undoHistoryState = 0;

			this._changeQueue.unshift(this.chipData.slice());

			// 32 undo max
			if (this._changeQueue.length > 32) {
				this._changeQueue.pop();
			}

		}

	}}

	 __init19() {this.undo = () => {
		// Go backward, if there is a change to go back to
		if (this._undoHistoryState < this._changeQueue.length - 1) {
			this._undoHistoryState++;
			this.chipData = this._changeQueue[this._undoHistoryState].slice();
			new ChangeCustomWave(this._doc, this.chipData);
			this.render();
		}

	}}

	 __init20() {this.redo = () => {
		// Go forward, if there is a change to go to
		if (this._undoHistoryState > 0) {
			this._undoHistoryState--;
			this.chipData = this._changeQueue[this._undoHistoryState].slice();
			new ChangeCustomWave(this._doc, this.chipData);
			this.render();
		}

	}}

	 __init21() {this._whenKeyPressed = (event) => {
		if (event.keyCode == 90) { // z
			this.undo();
			event.stopPropagation();
		}
		else if (event.keyCode == 89) { // y
			this.redo();
			event.stopPropagation();
		}
	}}

	 __init22() {this._whenMousePressed = (event) => {
		event.preventDefault();
		this._mouseDown = true;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = ((event.clientX || event.pageX) - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
		this._mouseY = ((event.clientY || event.pageY) - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;
		this._lastIndex = -1;

		this._whenCursorMoved();
	}}

	 __init23() {this._whenTouchPressed = (event) => {
		event.preventDefault();
		this._mouseDown = true;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.touches[0].clientX - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
		this._mouseY = (event.touches[0].clientY - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;
		this._lastIndex = -1;

		this._whenCursorMoved();
	}}

	 __init24() {this._whenMouseMoved = (event) => {
		if (this.container.offsetParent == null) return;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = ((event.clientX || event.pageX) - boundingRect.left) * this._editorWidth / (boundingRect.right - boundingRect.left);
		this._mouseY = ((event.clientY || event.pageY) - boundingRect.top) * this._editorHeight / (boundingRect.bottom - boundingRect.top);
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;
		this._whenCursorMoved();
	}}

	 __init25() {this._whenTouchMoved = (event) => {
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
			const index = Math.min(63, Math.max(0, Math.floor(this._mouseX * 64 / this._editorWidth)));
			const amp = Math.min(48, Math.max(0, Math.floor(this._mouseY * 49 / this._editorHeight)));

			// Paint between mouse drag indices unless a click just happened.
			if (this._lastIndex != -1 && this._lastIndex != index) {
				var lowest = index;
				var highest = this._lastIndex;
				var startingAmp = amp;
				var endingAmp = this._lastAmp;
				if (this._lastIndex < index) {
					lowest = this._lastIndex;
					highest = index;
					startingAmp = this._lastAmp;
					endingAmp = amp;
				}
				for (var i = lowest; i <= highest; i++) {
					const medAmp = Math.round(startingAmp + (endingAmp - startingAmp) * ((i - lowest) / (highest - lowest)));
					this.chipData[i] = medAmp - 24;
					this._blocks.children[i].setAttribute("y", "" + (medAmp * (this._editorHeight / 49)));

				}
			}
			else {
				this.chipData[index] = amp - 24;
				this._blocks.children[index].setAttribute("y", "" + (amp * (this._editorHeight / 49)));

			}


			// Make a change to the data but don't record it, since this prompt uses its own undo/redo queue
			new ChangeCustomWave(this._doc, this.chipData);

			this._lastIndex = index;
			this._lastAmp = amp;

		}
	}

	 __init26() {this._whenCursorReleased = (event) => {
		// Add current data into queue, if it is unique from last data
		this._storeChange();
		this._mouseDown = false;
	}}

	 render() {
		for (var i = 0; i < 64; i++) {
			this._blocks.children[i].setAttribute("y", "" + ((this.chipData[i] + 24) * (this._editorHeight / 49)));
		}
	}
}

export class CustomChipPrompt  {

	 __init27() {this.customChipCanvas = new CustomChipPromptCanvas(this._doc)}

	  __init28() {this._playButton = button({ style: "width: 55%;", type: "button" })}

	  __init29() {this._cancelButton = button({ class: "cancelButton" })}
	  __init30() {this._okayButton = button({ class: "okayButton", style: "width:45%;" }, "Okay")}

	  __init31() {this.container = div({ class: "prompt noSelection", style: "width: 600px;" },
		h2("Edit Custom Chip Instrument"),
		div({ style: "display: flex; width: 55%; align-self: center; flex-direction: row; align-items: center; justify-content: center;" },
			this._playButton,
		),
		div({ style: "display: flex; flex-direction: row; align-items: center; justify-content: center;" },
			this.customChipCanvas.container,
		),
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
		),
		this._cancelButton,
	)}

	constructor( _doc,  _songEditor) {;this._doc = _doc;this._songEditor = _songEditor;CustomChipPrompt.prototype.__init27.call(this);CustomChipPrompt.prototype.__init28.call(this);CustomChipPrompt.prototype.__init29.call(this);CustomChipPrompt.prototype.__init30.call(this);CustomChipPrompt.prototype.__init31.call(this);CustomChipPrompt.prototype.__init32.call(this);CustomChipPrompt.prototype.__init33.call(this);CustomChipPrompt.prototype.__init34.call(this);CustomChipPrompt.prototype.__init35.call(this);CustomChipPrompt.prototype.__init36.call(this);

		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
		this.container.addEventListener("keydown", this.whenKeyPressed);
		this._playButton.addEventListener("click", this._togglePlay);
		this.updatePlayButton();

		setTimeout(() => this._playButton.focus());


		this.customChipCanvas.render();
	}

	 __init32() {this._togglePlay = () => {
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

	 __init33() {this._close = () => {
		this._doc.prompt = null;
		this._doc.undo();
	}}

	 __init34() {this.cleanUp = () => {
		this._okayButton.removeEventListener("click", this._saveChanges);
		this._cancelButton.removeEventListener("click", this._close);
		this.container.removeEventListener("keydown", this.whenKeyPressed);

		this._playButton.removeEventListener("click", this._togglePlay);
	}}

	 __init35() {this.whenKeyPressed = (event) => {
		if ((event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
			this._saveChanges();
		}
		else if (event.keyCode == 32) {
			this._togglePlay();
			event.preventDefault();
		}
		else if (event.keyCode == 90) { // z
			this.customChipCanvas.undo();
			event.stopPropagation();
		}
		else if (event.keyCode == 89) { // y
			this.customChipCanvas.redo();
			event.stopPropagation();
		}
		else if (event.keyCode == 219) { // [
			this._doc.synth.goToPrevBar();
		}
		else if (event.keyCode == 221) { // ]
			this._doc.synth.goToNextBar();
		}
	}}

	 __init36() {this._saveChanges = () => {
		this._doc.prompt = null;
		// Restore custom chip to starting values
		new ChangeCustomWave(this._doc, this.customChipCanvas.startingChipData);
		this._doc.record(new ChangeCustomWave(this._doc, this.customChipCanvas.chipData), true);
	}}
}
//}
