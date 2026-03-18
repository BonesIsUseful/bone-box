// Copyright (C) 2020 John Nesky, distributed under the MIT license.

import { HTML } from "imperative-html/dist/esm/elements-strict";


import { ColorConfig } from "./ColorConfig.js";

//namespace beepbox {
const { button, div, h2, select, option } = HTML;

export class ThemePrompt  {
	  __init() {this._themeSelect = select({ style: "width: 100%;" },
		option({ value: "dark classic" }, "BeepBox Dark"),
		option({ value: "light classic" }, "BeepBox Light"),
		option({ value: "dark competition" }, "BeepBox Competition Dark"),
		option({ value: "bonebox classic" }, "BoneBox Dark"),
		// option({ value: "bonebox light" }, "BoneBox Light"), // It's not ready to see the world yet...
		option({ value: "forest" }, "Forest"),
		option({ value: "canyon" }, "Canyon"),
		option({ value: "midnight" }, "Midnight"),
		option({ value: "beachcombing" }, "Beachcombing"),
		option({ value: "violet verdant" }, "Violet Verdant"),
		option({ value: "sunset" }, "Sunset"),
		option({ value: "autumn" }, "Autumn"),
		option({ value: "fruit" }, "Shadowfruit"),
		option({ value: "toxic" }, "Toxic"),
		option({ value: "roe" }, "Roe"),
		option({ value: "moonlight" }, "Moonlight"),
		option({ value: "portal" }, "Portal"),
		option({ value: "fusion" }, "Fusion"),
		option({ value: "inverse" }, "Inverse"),
		option({ value: "nebula" }, "Nebula"),
		option({ value: "roe light" }, "Roe Light"),
		option({ value: "energized" }, "Energized"),
		option({ value: "neapolitan" }, "Neapolitan"),
		option({ value: "poly" }, "Poly"),
		option({ value: "blutonium" }, "Blutonium"),
	)}
	  __init2() {this._cancelButton = button({ class: "cancelButton" })}
	  __init3() {this._okayButton = button({ class: "okayButton", style: "width:45%;" }, "Okay")}

	  __init4() {this.container = div({ class: "prompt noSelection", style: "width: 220px;" },
		h2("Set Theme"),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ class: "selectContainer", style: "width: 100%;" }, this._themeSelect),
		),
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
		),
		this._cancelButton,
	)}
	  __init5() {this.lastTheme = window.localStorage.getItem("colorTheme")}

	constructor( _doc) {;this._doc = _doc;ThemePrompt.prototype.__init.call(this);ThemePrompt.prototype.__init2.call(this);ThemePrompt.prototype.__init3.call(this);ThemePrompt.prototype.__init4.call(this);ThemePrompt.prototype.__init5.call(this);ThemePrompt.prototype.__init6.call(this);ThemePrompt.prototype.__init7.call(this);ThemePrompt.prototype.__init8.call(this);ThemePrompt.prototype.__init9.call(this);ThemePrompt.prototype.__init10.call(this);
		if (this.lastTheme != null) {
			this._themeSelect.value = this.lastTheme;
		}
		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);
		this.container.addEventListener("keydown", this._whenKeyPressed);
		this._themeSelect.addEventListener("change", this._previewTheme);
	}

	 __init6() {this._close = () => {
		if (this.lastTheme != null) {
			ColorConfig.setTheme(this.lastTheme);
		} else {
			ColorConfig.setTheme("bonebox classic");
		}
		this._doc.undo();
	}}

	 __init7() {this.cleanUp = () => {
		this._okayButton.removeEventListener("click", this._saveChanges);
		this._cancelButton.removeEventListener("click", this._close);
		this.container.removeEventListener("keydown", this._whenKeyPressed);
	}}

	 __init8() {this._whenKeyPressed = (event) => {
		if ((event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
			this._saveChanges();
		}
	}}

	 __init9() {this._saveChanges = () => {
		window.localStorage.setItem("colorTheme", this._themeSelect.value);
		this._doc.prompt = null;
		this._doc.prefs.colorTheme = this._themeSelect.value;
		this._doc.undo();
	}}

	 __init10() {this._previewTheme = () => {
		ColorConfig.setTheme(this._themeSelect.value);
		this._doc.notifier.changed();
	}}
}
//}
