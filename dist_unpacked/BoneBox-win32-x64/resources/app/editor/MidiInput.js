// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Config } from "../synth/SynthConfig.js";

import { analogousDrumMap, MidiEventType } from "./Midi.js";






















// A unique id for this tab.
const id = ((Math.random() * 0xffffffff) >>> 0).toString(16);

export class MidiInputHandler {
	constructor( _doc) {;this._doc = _doc;MidiInputHandler.prototype.__init.call(this);MidiInputHandler.prototype.__init2.call(this);MidiInputHandler.prototype.__init3.call(this);MidiInputHandler.prototype.__init4.call(this);MidiInputHandler.prototype.__init5.call(this);
		this.registerMidiAccessHandler();
	}
	
	 async registerMidiAccessHandler() {
		if (navigator.requestMIDIAccess == null) return;
		
		try {
			const midiAccess = await navigator.requestMIDIAccess();
			
			midiAccess.inputs.forEach(this._registerMidiInput);
			midiAccess.addEventListener("statechange", this._handleStateChange);
			
			this._takeMidiHandlerFocus();
			window.addEventListener("focus", this._takeMidiHandlerFocus);
		} catch (e) {
			console.error("Failed to get MIDI access", e);
		}
	}
	
	 __init() {this._takeMidiHandlerFocus = (event) => {
		// Record that this browser tab is the one that should handle midi
		// events and any other open tabs should ignore midi events for now.
		localStorage.setItem("midiHandlerId", id);
	}}
	
	 __init2() {this._handleStateChange = (event) => {
		if (event.port.type !== "input") return;
		
		switch (event.port.state) {
			case "connected":
				this._registerMidiInput(event.port);
				break;
			case "disconnected":
				this._unregisterMidiInput(event.port);
				break;
		}
	}}
	
	 __init3() {this._registerMidiInput = (midiInput) => {
		midiInput.addEventListener("midimessage", this._onMidiMessage );
	}}
	
	 __init4() {this._unregisterMidiInput = (midiInput) => {
		midiInput.removeEventListener("midimessage", this._onMidiMessage );
		this._doc.performance.clearAllPitches();
	}}
	
	 __init5() {this._onMidiMessage = (event) => {
		// Ignore midi events if disabled or a different tab is handling them.
		if (!this._doc.prefs.enableMidi || localStorage.getItem("midiHandlerId") != id) return;
		
		const isDrum = this._doc.song.getChannelIsNoise(this._doc.channel);
		let [eventType, key, velocity] = event.data;
		eventType &= 0xF0;
		
		if (isDrum) {
			const drum = analogousDrumMap[key];
			if (drum != undefined) {
				key = drum.frequency;
			} else {
				return;
			}
		} else {
			key -= Config.keys[this._doc.song.key].basePitch; // The basePitch of the song key is implicit so don't include it.
			if (key < 0 || key > Config.maxPitch) return;
		}
		
		if (eventType == MidiEventType.noteOn && velocity == 0) {
			eventType = MidiEventType.noteOff;
		}
		
		switch (eventType) {
			case MidiEventType.noteOn:
				this._doc.synth.preferLowerLatency = true;
				this._doc.performance.addPerformedPitch(key);
				break;
			case MidiEventType.noteOff:
				this._doc.performance.removePerformedPitch(key);
				break;
		}
	}}
}
