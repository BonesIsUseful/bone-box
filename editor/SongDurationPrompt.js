// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Config } from "../synth/SynthConfig.js";
import { HTML } from "imperative-html/dist/esm/elements-strict";


import { ChangeGroup } from "./Change.js";
import { ChangeBarCount } from "./changes.js";
import { ColorConfig } from "./ColorConfig.js";

	const {button, div, span, h2, input, br, select, option} = HTML;

export class SongDurationPrompt  {
		  __init() {this._barsStepper = input({style: "width: 3em; margin-left: 1em;", type: "number", step: "1"})}
		  __init2() {this._positionSelect = select({style: "width: 100%;"},
			option({value: "end"},       "Apply change at end of song."),
			option({value: "beginning"}, "Apply change at beginning of song."),
	)}
		  __init3() {this._cancelButton = button({class: "cancelButton"})}
		  __init4() {this._okayButton = button({class: "okayButton", style: "width:45%;"}, "Okay")}
		
		  __init5() {this.container = div({class: "prompt noSelection", style: "width: 250px;"},
		h2("Song Length"),
			div({style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;"},
				div({style: "display: inline-block; text-align: right;"},
				"Bars per song:",
				br(),
					span({style: `font-size: smaller; color: ${ColorConfig.secondaryText};`}, "(Multiples of 4 are recommended)"),

			),
			this._barsStepper,
		),
			div({style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;"},
				div({class: "selectContainer", style: "width: 100%;"}, this._positionSelect),
		),
			div({style: "display: flex; flex-direction: row-reverse; justify-content: space-between;"},
			this._okayButton,
		),
		this._cancelButton,
	)}
		
	constructor( _doc) {;this._doc = _doc;SongDurationPrompt.prototype.__init.call(this);SongDurationPrompt.prototype.__init2.call(this);SongDurationPrompt.prototype.__init3.call(this);SongDurationPrompt.prototype.__init4.call(this);SongDurationPrompt.prototype.__init5.call(this);SongDurationPrompt.prototype.__init6.call(this);SongDurationPrompt.prototype.__init7.call(this);SongDurationPrompt.prototype.__init8.call(this);SongDurationPrompt.prototype.__init9.call(this);

		this._barsStepper.value = this._doc.song.barCount + "";
		this._barsStepper.min = Config.barCountMin + "";
		this._barsStepper.max = Config.barCountMax + "";
			
		const lastPosition = window.localStorage.getItem("barCountPosition");
		if (lastPosition != null) {
			this._positionSelect.value = lastPosition;
		}
			
		this._barsStepper.select();
			setTimeout(()=>this._barsStepper.focus());
			
		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
		this._barsStepper.addEventListener("keypress", SongDurationPrompt._validateKey);
		this._barsStepper.addEventListener("blur", SongDurationPrompt._validateNumber);
		this.container.addEventListener("keydown", this._whenKeyPressed);
	}
		
		 __init6() {this._close = () => { 
		this._doc.undo();
	}}
		
	 __init7() {this.cleanUp = () => {
		this._okayButton.removeEventListener("click", this._saveChanges);
		this._cancelButton.removeEventListener("click", this._close);
		this._barsStepper.removeEventListener("keypress", SongDurationPrompt._validateKey);
		this._barsStepper.removeEventListener("blur", SongDurationPrompt._validateNumber);
		this.container.removeEventListener("keydown", this._whenKeyPressed);
	}}
		
	 __init8() {this._whenKeyPressed = (event) => {
			if (( event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
			this._saveChanges();
		}
	}}
		
	 static _validateKey(event) {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
			event.preventDefault();
			return true;
		}
		return false;
	}
		
	 static _validateNumber(event) {
		const input = event.target;
		input.value = String(SongDurationPrompt._validate(input));
	}
		
	 static _validate(input) {
		return Math.floor(Math.max(Number(input.min), Math.min(Number(input.max), Number(input.value))));
	}
		
	 __init9() {this._saveChanges = () => {
		window.localStorage.setItem("barCountPosition", this._positionSelect.value);
		const group = new ChangeGroup();
		group.append(new ChangeBarCount(this._doc, SongDurationPrompt._validate(this._barsStepper), this._positionSelect.value == "beginning"));
		this._doc.prompt = null;
		this._doc.record(group, true);
	}}
}
