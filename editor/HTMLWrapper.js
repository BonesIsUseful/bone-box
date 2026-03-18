




import { HTML } from "imperative-html/dist/esm/elements-strict";

const { span } = HTML;

export class InputBox {
	 __init() {this._change = null}
	 __init2() {this._value = ""}
	 __init3() {this._oldValue = ""}

	constructor(  input,   _doc,   _getChange) {;this.input = input;this._doc = _doc;this._getChange = _getChange;InputBox.prototype.__init.call(this);InputBox.prototype.__init2.call(this);InputBox.prototype.__init3.call(this);InputBox.prototype.__init4.call(this);InputBox.prototype.__init5.call(this);
		input.addEventListener("input", this._whenInput);
		input.addEventListener("change", this._whenChange);
	}

	 updateValue(value) {
		this._value = value;
		this.input.value = String(value);
	}

	 __init4() {this._whenInput = () => {
		const continuingProspectiveChange = this._doc.lastChangeWas(this._change);
		if (!continuingProspectiveChange) this._oldValue = this._value;
		this._change = this._getChange(this._oldValue, this.input.value);
		this._doc.setProspectiveChange(this._change);
	}}

	 __init5() {this._whenChange = () => {
		this._doc.record(this._change);
		this._change = null;
	}}
}

export class Slider {
	 __init6() {this._change = null}
	 __init7() {this._value = 0}
	 __init8() {this._oldValue = 0}
	

	constructor(  input,   _doc,   _getChange, midTick) {;this.input = input;this._doc = _doc;this._getChange = _getChange;Slider.prototype.__init6.call(this);Slider.prototype.__init7.call(this);Slider.prototype.__init8.call(this);Slider.prototype.__init9.call(this);Slider.prototype.__init10.call(this);
		// A container is created around the input to allow for spec-compliant pseudo css classes (e.g ::before and ::after, which must be added to containers, not the input itself)
		this.container = (midTick) ? span({ class: "midTick", style: "position: sticky; width: 61.5%;" }, input) : span({ style: "position: sticky;" }, input);
		input.addEventListener("input", this._whenInput);
		input.addEventListener("change", this._whenChange);
	}

	 updateValue(value) {
		this._value = value;
		this.input.value = String(value);
	}

	 __init9() {this._whenInput = () => {
		const continuingProspectiveChange = this._doc.lastChangeWas(this._change);
		if (!continuingProspectiveChange) this._oldValue = this._value;
		if (this._getChange != null) {
			this._change = this._getChange(this._oldValue, parseInt(this.input.value));
			this._doc.setProspectiveChange(this._change);
		}
	}}

	 getValueBeforeProspectiveChange() {
		return this._oldValue;
	}

	 __init10() {this._whenChange = () => {
		if (this._getChange != null) {
			this._doc.record(this._change);
			this._change = null;
		}
	}}
}