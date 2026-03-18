// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Config } from "../synth/SynthConfig.js";


import { ChangeSetEnvelopeTarget, ChangeSetEnvelopeType, ChangeRemoveEnvelope } from "./changes.js";
import { HTML } from "imperative-html/dist/esm/elements-strict";

export class EnvelopeEditor {
	  __init() {this.container = HTML.div({class: "envelopeEditor"})}
	
	  __init2() {this._rows = []}
	  __init3() {this._targetSelects = []}
	  __init4() {this._envelopeSelects = []}
	  __init5() {this._deleteButtons = []}
	 __init6() {this._renderedEnvelopeCount = 0}
	 __init7() {this._renderedEqFilterCount = -1}
	 __init8() {this._renderedNoteFilterCount = -1}
	
	 __init9() {this._renderedEffects = 0}
	
	constructor( _doc) {;this._doc = _doc;EnvelopeEditor.prototype.__init.call(this);EnvelopeEditor.prototype.__init2.call(this);EnvelopeEditor.prototype.__init3.call(this);EnvelopeEditor.prototype.__init4.call(this);EnvelopeEditor.prototype.__init5.call(this);EnvelopeEditor.prototype.__init6.call(this);EnvelopeEditor.prototype.__init7.call(this);EnvelopeEditor.prototype.__init8.call(this);EnvelopeEditor.prototype.__init9.call(this);EnvelopeEditor.prototype.__init10.call(this);EnvelopeEditor.prototype.__init11.call(this);
		this.container.addEventListener("change", this._onChange);
		this.container.addEventListener("click", this._onClick);
	}
	
	 __init10() {this._onChange = (event) => {
		const targetSelectIndex = this._targetSelects.indexOf( event.target);
		const envelopeSelectIndex = this._envelopeSelects.indexOf( event.target);
		if (targetSelectIndex != -1) {
			const combinedValue = parseInt(this._targetSelects[targetSelectIndex].value);
			const target = combinedValue % Config.instrumentAutomationTargets.length;
			const index = (combinedValue / Config.instrumentAutomationTargets.length) >>> 0;
			this._doc.record(new ChangeSetEnvelopeTarget(this._doc, targetSelectIndex, target, index));
		} else if (envelopeSelectIndex != -1) {
			this._doc.record(new ChangeSetEnvelopeType(this._doc, envelopeSelectIndex, this._envelopeSelects[envelopeSelectIndex].selectedIndex));
		}
	}}
	
	 __init11() {this._onClick = (event) => {
		const index = this._deleteButtons.indexOf( event.target);
		if (index != -1) {
			this._doc.record(new ChangeRemoveEnvelope(this._doc, index));
		}
	}}
	
	 _makeOption(target, index) {
		let displayName = Config.instrumentAutomationTargets[target].displayName;
		if (Config.instrumentAutomationTargets[target].maxCount > 1) {
			if (displayName.indexOf("#") != -1) {
				displayName = displayName.replace("#", String(index+1));
			} else {
				displayName += " " + (index+1);
			}
		}
		return HTML.option({value: target + index * Config.instrumentAutomationTargets.length}, displayName);
	}
	
	 _updateTargetOptionVisibility(menu, instrument) {
		for (let optionIndex = 0; optionIndex < menu.childElementCount; optionIndex++) {
			const option =  menu.children[optionIndex];
			const combinedValue = parseInt(option.value);
			const target = combinedValue % Config.instrumentAutomationTargets.length;
			const index = (combinedValue / Config.instrumentAutomationTargets.length) >>> 0;
			option.hidden = !instrument.supportsEnvelopeTarget(target, index);
		}
	}
	
	 render() {
		const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
		
		for (let envelopeIndex = this._rows.length; envelopeIndex < instrument.envelopeCount; envelopeIndex++) {
			const targetSelect = HTML.select();
			for (let target = 0; target < Config.instrumentAutomationTargets.length; target++) {
				const interleaved = (Config.instrumentAutomationTargets[target].interleave);
				for (let index = 0; index < Config.instrumentAutomationTargets[target].maxCount; index++) {
					targetSelect.appendChild(this._makeOption(target, index));
					if (interleaved) {
						targetSelect.appendChild(this._makeOption(target + 1, index));
					}
				}
				if (interleaved) target++;
			}
			
			const envelopeSelect = HTML.select();
			for (let envelope = 0; envelope < Config.envelopes.length; envelope++) {
				envelopeSelect.appendChild(HTML.option({value: envelope}, Config.envelopes[envelope].name));
			} 
			
			const deleteButton = HTML.button({type: "button", class: "delete-envelope"});
			
			const row = HTML.div({class: "envelope-row"},
				HTML.div({class: "selectContainer", style: "width: 0; flex: 1;"}, targetSelect),
				HTML.div({class: "selectContainer", style: "width: 0; flex: 0.7;"}, envelopeSelect),
				deleteButton,
			);
			
			this.container.appendChild(row);
			this._rows[envelopeIndex] = row;
			this._targetSelects[envelopeIndex] = targetSelect;
			this._envelopeSelects[envelopeIndex] = envelopeSelect;
			this._deleteButtons[envelopeIndex] = deleteButton;
		}
		
		for (let envelopeIndex = this._renderedEnvelopeCount; envelopeIndex < instrument.envelopeCount; envelopeIndex++) {
			this._rows[envelopeIndex].style.display = "";
			// For newly visible rows, update target option visibiliy.
			this._updateTargetOptionVisibility(this._targetSelects[envelopeIndex], instrument);
		}
		
		for (let envelopeIndex = instrument.envelopeCount; envelopeIndex < this._renderedEnvelopeCount; envelopeIndex++) {
			this._rows[envelopeIndex].style.display = "none";
		}

		let useControlPointCount = instrument.noteFilter.controlPointCount;
		if (instrument.noteFilterType)
			useControlPointCount = 1;
		
		if (this._renderedEqFilterCount != instrument.eqFilter.controlPointCount ||
			this._renderedNoteFilterCount != useControlPointCount ||
			this._renderedInstrumentType != instrument.type ||
			this._renderedEffects != instrument.effects)
		{
			// Update target option visibility for previously visible rows.
			for (let envelopeIndex = 0; envelopeIndex < this._renderedEnvelopeCount; envelopeIndex++) {
				this._updateTargetOptionVisibility(this._targetSelects[envelopeIndex], instrument);
			}
		}
		
		for (let envelopeIndex = 0; envelopeIndex < instrument.envelopeCount; envelopeIndex++) {
			this._targetSelects[envelopeIndex].value = String(instrument.envelopes[envelopeIndex].target + instrument.envelopes[envelopeIndex].index * Config.instrumentAutomationTargets.length);
			this._envelopeSelects[envelopeIndex].selectedIndex = instrument.envelopes[envelopeIndex].envelope;
		}
		
		this._renderedEnvelopeCount = instrument.envelopeCount;
		this._renderedEqFilterCount = instrument.eqFilter.controlPointCount;
		this._renderedNoteFilterCount = useControlPointCount;
		this._renderedInstrumentType = instrument.type;
		this._renderedEffects = instrument.effects;
	}
}
