// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Config } from "../synth/SynthConfig.js";

export class Preferences {
	 static  __initStatic() {this.defaultVisibleOctaves = 3}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	 __init() {this.volume = 75}
	 __init2() {this.visibleOctaves = Preferences.defaultVisibleOctaves}
	
	
	
	
	
	
	
	 __init3() {this.chordStamp = 0}
	
	
	
	constructor() {;Preferences.prototype.__init.call(this);Preferences.prototype.__init2.call(this);Preferences.prototype.__init3.call(this);
		this.reload();
	}
	
	 reload() {
		this.autoPlay = window.localStorage.getItem("autoPlay") == "true";
		this.autoFollow = window.localStorage.getItem("autoFollow") != "false";
		this.enableNotePreview = window.localStorage.getItem("enableNotePreview") != "false";
		this.showFifth = window.localStorage.getItem("showFifth") != "false";
		this.notesOutsideScale = window.localStorage.getItem("notesOutsideScale") == "true";
		this.showLetters = window.localStorage.getItem("showLetters") != "false";
		this.showChannels = window.localStorage.getItem("showChannels") == "true";
		this.showScrollBar = window.localStorage.getItem("showScrollBar") != "false";
		this.alwaysFineNoteVol = window.localStorage.getItem("alwaysFineNoteVol") == "true";
		this.displayVolumeBar = window.localStorage.getItem("displayVolumeBar") != "false";
		this.instrumentCopyPaste = window.localStorage.getItem("instrumentCopyPaste") == "true";
		this.enableChannelMuting = window.localStorage.getItem("enableChannelMuting") != "false";
		this.displayBrowserUrl = window.localStorage.getItem("displayBrowserUrl") != "false";
		this.pressControlForShortcuts = window.localStorage.getItem("pressControlForShortcuts") == "true";
		this.enableMidi = window.localStorage.getItem("enableMidi") != "false";
		this.showRecordButton = window.localStorage.getItem("showRecordButton") == "true";
		this.snapRecordedNotesToRhythm = window.localStorage.getItem("snapRecordedNotesToRhythm") == "true";
		this.ignorePerformedNotesNotInScale = window.localStorage.getItem("ignorePerformedNotesNotInScale") == "true";
		this.metronomeCountIn = window.localStorage.getItem("metronomeCountIn") != "false";
		this.metronomeWhileRecording = window.localStorage.getItem("metronomeWhileRecording") != "false";
		this.keyboardLayout = window.localStorage.getItem("keyboardLayout") || "wickiHayden";
		this.bassOffset = (+(window.localStorage.getItem("bassOffset"))) || 0;
		this.layout = window.localStorage.getItem("layout") || "long";
		const tabPositionRaw = window.localStorage.getItem("tabPosition") || "top";
		const tabPositionAllowed = ["top", "left", "right", "bottom"];
		this.tabPosition = tabPositionAllowed.indexOf(tabPositionRaw) >= 0 ? tabPositionRaw : "top";
		this.colorTheme = window.localStorage.getItem("colorTheme") || "bonebox classic";
		this.followPlayhead = window.localStorage.getItem("followPlayhead") == "true";
		this.visibleOctaves = ((window.localStorage.getItem("visibleOctaves")) >>> 0) || Preferences.defaultVisibleOctaves;
		this.chordStamp = ((window.localStorage.getItem("chordStamp")) >>> 0) || 0;
		
		const defaultScale = Config.scales.dictionary[window.localStorage.getItem("defaultScale")];
		this.defaultScale = (defaultScale != undefined) ? defaultScale.index : 0;
		
		if (window.localStorage.getItem("volume") != null) {
			this.volume = Math.min(window.localStorage.getItem("volume") >>> 0, 75);
		}
		
		if (window.localStorage.getItem("fullScreen") != null) {
			if (window.localStorage.getItem("fullScreen") == "true") this.layout = "long";
			window.localStorage.removeItem("fullScreen");
		}
	}
	
	 save() {
		window.localStorage.setItem("autoPlay", this.autoPlay ? "true" : "false");
		window.localStorage.setItem("autoFollow", this.autoFollow ? "true" : "false");
		window.localStorage.setItem("enableNotePreview", this.enableNotePreview ? "true" : "false");
		window.localStorage.setItem("showFifth", this.showFifth ? "true" : "false");
		window.localStorage.setItem("notesOutsideScale", this.notesOutsideScale ? "true" : "false");
		window.localStorage.setItem("defaultScale", Config.scales[this.defaultScale].name);
		window.localStorage.setItem("showLetters", this.showLetters ? "true" : "false");
		window.localStorage.setItem("showChannels", this.showChannels ? "true" : "false");
		window.localStorage.setItem("showScrollBar", this.showScrollBar ? "true" : "false");
		window.localStorage.setItem("alwaysFineNoteVol", this.alwaysFineNoteVol ? "true" : "false");
		window.localStorage.setItem("displayVolumeBar", this.displayVolumeBar ? "true" : "false");
		window.localStorage.setItem("enableChannelMuting", this.enableChannelMuting ? "true" : "false");
		window.localStorage.setItem("instrumentCopyPaste", this.instrumentCopyPaste ? "true" : "false");
		window.localStorage.setItem("displayBrowserUrl", this.displayBrowserUrl ? "true" : "false");
		window.localStorage.setItem("pressControlForShortcuts", this.pressControlForShortcuts ? "true" : "false");
		window.localStorage.setItem("enableMidi", this.enableMidi ? "true" : "false");
		window.localStorage.setItem("showRecordButton", this.showRecordButton ? "true" : "false");
		window.localStorage.setItem("snapRecordedNotesToRhythm", this.snapRecordedNotesToRhythm ? "true" : "false");
		window.localStorage.setItem("ignorePerformedNotesNotInScale", this.ignorePerformedNotesNotInScale ? "true" : "false");
		window.localStorage.setItem("metronomeCountIn", this.metronomeCountIn ? "true" : "false");
		window.localStorage.setItem("metronomeWhileRecording", this.metronomeWhileRecording ? "true" : "false");
		window.localStorage.setItem("keyboardLayout", this.keyboardLayout);
		window.localStorage.setItem("bassOffset", String(this.bassOffset));
		window.localStorage.setItem("layout", this.layout);
		window.localStorage.setItem("tabPosition", this.tabPosition);
		window.localStorage.setItem("colorTheme", this.colorTheme);
		window.localStorage.setItem("volume", String(this.volume));
		window.localStorage.setItem("followPlayhead", this.followPlayhead ? "true" : "false");
		window.localStorage.setItem("visibleOctaves", String(this.visibleOctaves));
		window.localStorage.setItem("chordStamp", String(this.chordStamp));
	}
} Preferences.__initStatic();
