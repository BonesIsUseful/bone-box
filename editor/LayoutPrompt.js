


import { Layout } from "./Layout.js";

import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";

const {button, label, div, form, h2, input} = HTML;

export class LayoutPrompt  {
	  __init() {this._fileInput = input({type: "file", accept: ".json,application/json,.mid,.midi,audio/midi,audio/x-midi"})}
	  __init2() {this._okayButton = button({class: "okayButton", style: "width:45%;"}, "Okay")}
	  __init3() {this._cancelButton = button({class: "cancelButton"})}
	  __init4() {this._form = form({style: "display: flex; flex-direction: column; gap: 16px;"},
			div({style: "display: flex; gap: 10px; flex-wrap: wrap;"},
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
			),
			div({style: "display: flex; flex-direction: column; gap: 8px;"},
				div({style: "font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.85;"}, "Tab position"),
				div({style: "display: flex; gap: 8px; flex-wrap: wrap;"},
					label({class: "layout-option"},
						input({type: "radio", name: "tabPosition", value: "top"}),
						SVG(`\
							<svg viewBox="-1 -1 28 22">
								<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
								<rect x="2" y="2" width="22" height="4" fill="currentColor"/>
								<rect x="2" y="8" width="22" height="10" fill="currentColor" opacity="0.35"/>
							</svg>
						`),
						div("Top"),
					),
					label({class: "layout-option"},
						input({type: "radio", name: "tabPosition", value: "bottom"}),
						SVG(`\
							<svg viewBox="-1 -1 28 22">
								<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
								<rect x="2" y="2" width="22" height="10" fill="currentColor" opacity="0.35"/>
								<rect x="2" y="14" width="22" height="4" fill="currentColor"/>
							</svg>
						`),
						div("Bottom"),
					),
					label({class: "layout-option"},
						input({type: "radio", name: "tabPosition", value: "left"}),
						SVG(`\
							<svg viewBox="-1 -1 28 22">
								<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
								<rect x="2" y="2" width="5" height="16" fill="currentColor"/>
								<rect x="9" y="2" width="15" height="16" fill="currentColor" opacity="0.35"/>
							</svg>
						`),
						div("Left"),
					),
					label({class: "layout-option"},
						input({type: "radio", name: "tabPosition", value: "right"}),
						SVG(`\
							<svg viewBox="-1 -1 28 22">
								<rect x="0" y="0" width="26" height="20" fill="none" stroke="currentColor" stroke-width="1"/>
								<rect x="2" y="2" width="15" height="16" fill="currentColor" opacity="0.35"/>
								<rect x="19" y="2" width="5" height="16" fill="currentColor"/>
							</svg>
						`),
						div("Right"),
					),
				),
			),
		)}
	
	  __init5() {this.container = div({class: "prompt noSelection", style: "width: 340px;"},
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
		const TabPosInit = this._doc.prefs.tabPosition || "top";
		const TabPosInitRadio = this._form.querySelector('input[name="tabPosition"][value="' + TabPosInit + '"]');
		if (TabPosInitRadio) TabPosInitRadio.checked = true;
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
		const TabPosChecked = this._form.querySelector('input[name="tabPosition"]:checked');
		let TabPosVal = TabPosChecked && TabPosChecked.value ? TabPosChecked.value : (this._doc.prefs.tabPosition || "top");
		const TabAllowed = ["top", "left", "right", "bottom"];
		if (TabAllowed.indexOf(TabPosVal) < 0) TabPosVal = "top";
		this._doc.prefs.tabPosition = TabPosVal;
		this._doc.prefs.save();
		Layout.setLayout(this._doc.prefs.layout);
		if (typeof window.tabManager !== "undefined" && window.tabManager != null) window.tabManager.applyTabPosition();
		this._doc.prompt = null;
		this._doc.undo();
	}}
}
