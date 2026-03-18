


import { Layout } from "./Layout.js";

import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";

const {button, label, div, form, h2, input} = HTML;

export class LayoutPrompt  {
	  __init() {this._fileInput = input({type: "file", accept: ".json,application/json,.mid,.midi,audio/midi,audio/x-midi"})}
	  __init2() {this._okayButton = button({class: "okayButton", style: "width:45%;"}, "Okay")}
	  __init3() {this._cancelButton = button({class: "cancelButton"})}
	  __init4() {this._form = form({style: "display: flex; gap: 10px;"},
			label({class: "layout-option"},
				input({type: "radio", name: "layout", value: "small"}),
				SVG(`\
					<svg viewBox="-4 -1 28 22">
						<rect x="0" y="0" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="2" y="2" width="11" height="10" fill="currentColor"/>
						<rect x="14" y="2" width="4" height="16" fill="currentColor"/>
						<rect x="2" y="13" width="11" height="5" fill="currentColor"/>
					</svg>
				`),
				div("Small"),
			),
			label({class: "layout-option"},
				input({type: "radio", name: "layout", value: "long"}),
				SVG(`\
					<svg viewBox="-1 -1 28 22">
						<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="2" y="2" width="12" height="10" fill="currentColor"/>
						<rect x="15" y="2" width="4" height="10" fill="currentColor"/>
						<rect x="20" y="2" width="4" height="10" fill="currentColor"/>
						<rect x="2" y="13" width="22" height="5" fill="currentColor"/>
					</svg>
				`),
				div("Long"),
			),
			label({class: "layout-option"},
				input({type: "radio", name: "layout", value: "tall"}),
				SVG(`\
					<svg viewBox="-1 -1 28 22">
						<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="11" y="2" width="8" height="16" fill="currentColor"/>
						<rect x="20" y="2" width="4" height="16" fill="currentColor"/>
						<rect x="2" y="2" width="8" height="16" fill="currentColor"/>
					</svg>
				`),
				div("Tall"),
			),
			label({class: "layout-option"},
				input({type: "radio", name: "layout", value: "wide"}),
				SVG(`\
					<svg viewBox="-1 -1 28 22">
						<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
						<rect x="2" y="2" width="4" height="16" fill="currentColor"/>
						<rect x="18" y="2" width="2.5" height="16" fill="currentColor"/>
						<rect x="21.5" y="2" width="2.5" height="16" fill="currentColor"/>
						<rect x="7" y="2" width="10" height="16" fill="currentColor"/>
					</svg>
				`),
				div("Wide (JB)"),
			),
		)}
	
	  __init5() {this.container = div({class: "prompt noSelection", style: "width: 300px;"},
		h2("Layout"),
		this._form,
		div({style: "display: flex; flex-direction: row-reverse; justify-content: space-between;"},
			this._okayButton,
		),
		this._cancelButton,
	)}
	
	constructor( _doc) {;this._doc = _doc;LayoutPrompt.prototype.__init.call(this);LayoutPrompt.prototype.__init2.call(this);LayoutPrompt.prototype.__init3.call(this);LayoutPrompt.prototype.__init4.call(this);LayoutPrompt.prototype.__init5.call(this);LayoutPrompt.prototype.__init6.call(this);LayoutPrompt.prototype.__init7.call(this);LayoutPrompt.prototype.__init8.call(this);LayoutPrompt.prototype.__init9.call(this);
		this._fileInput.select();
		setTimeout(()=>this._fileInput.focus());
		
		this._okayButton.addEventListener("click", this._confirm);
		this._cancelButton.addEventListener("click", this._close);
		this.container.addEventListener("keydown", this._whenKeyPressed);
		
		( this._form.elements)["layout"].value = this._doc.prefs.layout;
	}
	
	 __init6() {this._close = () => { 
		this._doc.undo();
	}}
	
	 __init7() {this.cleanUp = () => { 
		this._okayButton.removeEventListener("click", this._confirm);
		this._cancelButton.removeEventListener("click", this._close);
		this.container.removeEventListener("keydown", this._whenKeyPressed);
	}}
	
	 __init8() {this._whenKeyPressed = (event) => {
		if (( event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
			this._confirm();
		}
	}}
	
	 __init9() {this._confirm = () => { 
		this._doc.prefs.layout = ( this._form.elements)["layout"].value;
		this._doc.prefs.save();
		Layout.setLayout(this._doc.prefs.layout);
		this._close();
	}}
}
