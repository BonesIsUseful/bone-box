// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Config } from "../synth/SynthConfig.js";
import { isMobile } from "./EditorConfig.js";
import { Song, Synth } from "../synth/synth.js";
import { SongRecovery, generateUid, errorAlert } from "./SongRecovery.js";
import { ColorConfig } from "./ColorConfig.js";
import { Layout } from "./Layout.js";
import { SongPerformance } from "./SongPerformance.js";
import { Selection } from "./Selection.js";
import { Preferences } from "./Preferences.js";

import { ChangeNotifier } from "./ChangeNotifier.js";
import { ChangeSong, setDefaultInstruments, discardInvalidPatternInstruments } from "./changes.js";












export class SongDocument {
	
	
	
	  __init() {this.notifier = new ChangeNotifier()}
	  __init2() {this.selection = new Selection(this)}
	  __init3() {this.prefs = new Preferences()}
	 __init4() {this.channel = 0}
	 __init5() {this.muteEditorChannel = 0}
	 __init6() {this.bar = 0}
	
	 __init7() {this.recentPatternInstruments = []}
	 __init8() {this.viewedInstrument = []}
	 __init9() {this.recordingModulators = false}
	 __init10() {this.continuingModRecordingChange = null}
	
	 __init11() {this.trackVisibleBars = 16}
	 __init12() {this.trackVisibleChannels = 4}
	 __init13() {this.barScrollPos = 0}
	 __init14() {this.channelScrollPos = 0}
	 __init15() {this.prompt = null}
	
	 __init16() {this.addedEffect = false}
	 __init17() {this.addedEnvelope = false}
	 __init18() {this.currentPatternIsDirty = false}
	
	
	 static  __initStatic() {this._maximumUndoHistory = 300}
	 __init19() {this._recovery = new SongRecovery()}
	
	 __init20() {this._recentChange = null}
	 __init21() {this._sequenceNumber = 0}
	 __init22() {this._lastSequenceNumber = 0}
	 __init23() {this._stateShouldBePushed = false}
	 __init24() {this._recordedNewSong = false}
	 __init25() {this._waitingToUpdateState = false}
		
	constructor() {;SongDocument.prototype.__init.call(this);SongDocument.prototype.__init2.call(this);SongDocument.prototype.__init3.call(this);SongDocument.prototype.__init4.call(this);SongDocument.prototype.__init5.call(this);SongDocument.prototype.__init6.call(this);SongDocument.prototype.__init7.call(this);SongDocument.prototype.__init8.call(this);SongDocument.prototype.__init9.call(this);SongDocument.prototype.__init10.call(this);SongDocument.prototype.__init11.call(this);SongDocument.prototype.__init12.call(this);SongDocument.prototype.__init13.call(this);SongDocument.prototype.__init14.call(this);SongDocument.prototype.__init15.call(this);SongDocument.prototype.__init16.call(this);SongDocument.prototype.__init17.call(this);SongDocument.prototype.__init18.call(this);SongDocument.prototype.__init19.call(this);SongDocument.prototype.__init20.call(this);SongDocument.prototype.__init21.call(this);SongDocument.prototype.__init22.call(this);SongDocument.prototype.__init23.call(this);SongDocument.prototype.__init24.call(this);SongDocument.prototype.__init25.call(this);SongDocument.prototype.__init26.call(this);SongDocument.prototype.__init27.call(this);SongDocument.prototype.__init28.call(this);SongDocument.prototype.__init29.call(this);SongDocument.prototype.__init30.call(this);
		this.notifier.watch(this._validateDocState);
		
		ColorConfig.setTheme(this.prefs.colorTheme);
		Layout.setLayout(this.prefs.layout);
		
		if (window.sessionStorage.getItem("currentUndoIndex") == null) {
			window.sessionStorage.setItem("currentUndoIndex", "0");
			window.sessionStorage.setItem("oldestUndoIndex", "0");
			window.sessionStorage.setItem("newestUndoIndex", "0");
		}
			
		let songString = window.location.hash;
		if (songString == "") {
			songString = this._getHash();
		}
		try {
			this.song = new Song(songString);
			if (songString == "" || songString == undefined) {
				setDefaultInstruments(this.song);
				this.song.scale = this.prefs.defaultScale;
			}
		} catch (error) {
			errorAlert(error);
		}
		songString = this.song.toBase64String();
		this.synth = new Synth(this.song);
		this.synth.volume = this._calcVolume();
		this.synth.anticipatePoorPerformance = isMobile;
		
		let state = this._getHistoryState();
		if (state == null) {
			// When the page is first loaded, indicate that undo is NOT possible.
			state = {canUndo: false, sequenceNumber: 0, bar: 0, channel: 0, instrument: 0, recoveryUid: generateUid(), prompt: null, selection: this.selection.toJSON()};
		}
		if (state.recoveryUid == undefined) state.recoveryUid = generateUid();
		this._replaceState(state, songString);
		window.addEventListener("hashchange", this._whenHistoryStateChanged);
		window.addEventListener("popstate", this._whenHistoryStateChanged);
			
		this.bar = state.bar | 0;
		this.channel = state.channel | 0;
		for (let i = 0; i <= this.channel; i++) this.viewedInstrument[i] = 0;
		this.viewedInstrument[this.channel] = state.instrument | 0;
		this._recoveryUid = state.recoveryUid;
		//this.barScrollPos = Math.max(0, this.bar - (this.trackVisibleBars - 6));
		this.prompt = state.prompt;
		this.selection.fromJSON(state.selection);
		this.selection.scrollToSelectedPattern();
			
		// For all input events, catch them when they are about to finish bubbling,
		// presumably after all handlers are done updating the model, then update the
		// view before the screen renders. mouseenter and mouseleave do not bubble,
		// but they are immediately followed by mousemove which does. 
		for (const eventName of ["change", "click", "keyup", "mousedown", "mouseup", "touchstart", "touchmove", "touchend", "touchcancel"]) {
			window.addEventListener(eventName, this._cleanDocument);
		}
		for (const eventName of ["keydown", "input", "mousemove"]) {
			window.addEventListener(eventName, this._cleanDocumentIfNotRecordingMods);
		}
		
		this._validateDocState();
		this.performance = new SongPerformance(this);
	}
		
	 toggleDisplayBrowserUrl() {
		const state = this._getHistoryState();
		if (state == null) return;
		this.prefs.displayBrowserUrl = !this.prefs.displayBrowserUrl;
		this._replaceState(state, this.song.toBase64String());
	}
		
	 _getHistoryState() {
		if (this.prefs.displayBrowserUrl) {
			return window.history.state;
		} else {
			const json = JSON.parse(window.sessionStorage.getItem(window.sessionStorage.getItem("currentUndoIndex")));
			return json == null ? null : json.state;
		}
	}
		
	 _getHash() {
		if (this.prefs.displayBrowserUrl) {
			return window.location.hash;
		} else {
			const json = JSON.parse(window.sessionStorage.getItem(window.sessionStorage.getItem("currentUndoIndex")));
			return json == null ? "" : json.hash;
		}
	}
		
	 _replaceState(state, hash) {
		if (this.prefs.displayBrowserUrl) {
			window.history.replaceState(state, "", "#" + hash);
		} else {
			window.sessionStorage.setItem(window.sessionStorage.getItem("currentUndoIndex") || "0", JSON.stringify({state, hash}));
			window.history.replaceState(null, "", location.pathname);
		}
	}
		
	 _pushState(state, hash) {
		if (this.prefs.displayBrowserUrl) {
			window.history.pushState(state, "", "#" + hash);
		} else {
			let currentIndex = Number(window.sessionStorage.getItem("currentUndoIndex"));
			let oldestIndex = Number(window.sessionStorage.getItem("oldestUndoIndex"));
			currentIndex = (currentIndex + 1) % SongDocument._maximumUndoHistory;
			window.sessionStorage.setItem("currentUndoIndex", String(currentIndex));
			window.sessionStorage.setItem("newestUndoIndex", String(currentIndex));
			if (currentIndex == oldestIndex) {
				oldestIndex = (oldestIndex + 1) % SongDocument._maximumUndoHistory;
				window.sessionStorage.setItem("oldestUndoIndex", String(oldestIndex));
			}
				window.sessionStorage.setItem(String(currentIndex), JSON.stringify({state, hash}));
			window.history.replaceState(null, "", location.pathname);
		}
		this._lastSequenceNumber = state.sequenceNumber;
	}

	 hasRedoHistory() {
		return this._lastSequenceNumber > this._sequenceNumber;
	}	
		
	 _forward() {
		if (this.prefs.displayBrowserUrl) {
			window.history.forward();
		} else {
			let currentIndex = Number(window.sessionStorage.getItem("currentUndoIndex"));
			let newestIndex = Number(window.sessionStorage.getItem("newestUndoIndex"));
			if (currentIndex != newestIndex) {
				currentIndex = (currentIndex + 1) % SongDocument._maximumUndoHistory;
				window.sessionStorage.setItem("currentUndoIndex", String(currentIndex));
				setTimeout(this._whenHistoryStateChanged);
			}
		}
	}
		
	 _back() {
		if (this.prefs.displayBrowserUrl) {
			window.history.back();
		} else {
			let currentIndex = Number(window.sessionStorage.getItem("currentUndoIndex"));
			let oldestIndex = Number(window.sessionStorage.getItem("oldestUndoIndex"));
			if (currentIndex != oldestIndex) {
				currentIndex = (currentIndex + SongDocument._maximumUndoHistory - 1) % SongDocument._maximumUndoHistory;
				window.sessionStorage.setItem("currentUndoIndex", String(currentIndex));
				setTimeout(this._whenHistoryStateChanged);
			}
		}
	}
		
	 __init26() {this._whenHistoryStateChanged = () => {
		if (this.synth.recording) {
			// Changes to the song while it's recording to could mess up the recording so just abort the recording.
			this.performance.abortRecording();
		}
		
		if (window.history.state == null && window.location.hash != "") {
			// The user changed the hash directly.
			this._sequenceNumber++;
			this._resetSongRecoveryUid();
			const state = {canUndo: true, sequenceNumber: this._sequenceNumber, bar: this.bar, channel: this.channel, instrument: this.viewedInstrument[this.channel], recoveryUid: this._recoveryUid, prompt: null, selection: this.selection.toJSON()};
			try {
				new ChangeSong(this, window.location.hash);
			} catch (error) {
				errorAlert(error);
			}
			this.prompt = state.prompt;
			if (this.prefs.displayBrowserUrl) {
				this._replaceState(state, this.song.toBase64String());
			} else {
				this._pushState(state, this.song.toBase64String());
			}
			this.forgetLastChange();
			this.notifier.notifyWatchers();
			// Stop playing, and go to start when pasting new song in.
			this.synth.pause();
			this.synth.goToBar(0);
			return;
		}
			
		const state = this._getHistoryState();
		if (state == null) return;
			
		// Abort if we've already handled the current state. 
		if (state.sequenceNumber == this._sequenceNumber) return;
			
		this.bar = state.bar;
		this.channel = state.channel;
		this.viewedInstrument[this.channel] = state.instrument;
		this._sequenceNumber = state.sequenceNumber;
		this.prompt = state.prompt;
		try {
			new ChangeSong(this, this._getHash());
		} catch (error) {
			errorAlert(error);
		}
			
		this._recoveryUid = state.recoveryUid;
		this.selection.fromJSON(state.selection);
			
		//this.barScrollPos = Math.min(this.bar, Math.max(this.bar - (this.trackVisibleBars - 1), this.barScrollPos));
			
		this.forgetLastChange();
		this.notifier.notifyWatchers();
	}}
		
	 __init27() {this._cleanDocument = () => {
		this.notifier.notifyWatchers();
	}}

	 __init28() {this._cleanDocumentIfNotRecordingMods = () => {
		if (!this.recordingModulators)
			this.notifier.notifyWatchers();
		else {
			this.modRecordingHandler();
        }

    }}
	
	 __init29() {this._validateDocState = () => {
		const channelCount = this.song.getChannelCount();
		for (let i = this.recentPatternInstruments.length; i < channelCount; i++) {
			this.recentPatternInstruments[i] = [0];
	}
		this.recentPatternInstruments.length = channelCount;
		for (let i = 0; i < channelCount; i++) {
			if (i == this.channel) {
				if (this.song.patternInstruments) {
					const pattern = this.song.getPattern(this.channel, this.bar);
					if (pattern != null) {
						this.recentPatternInstruments[i] = pattern.instruments.concat();
					}
				} else {
					const channel = this.song.channels[this.channel];
					for (let j = 0; j < channel.instruments.length; j++) {
						this.recentPatternInstruments[i][j] = j;
					}
					this.recentPatternInstruments[i].length = channel.instruments.length;
				}
			}
			discardInvalidPatternInstruments(this.recentPatternInstruments[i], this.song, i);
		}

		for (let i = this.viewedInstrument.length; i < channelCount; i++) {
			this.viewedInstrument[i] = 0;
		}
		this.viewedInstrument.length = channelCount;
		for (let i = 0; i < channelCount; i++) {
			if (this.song.patternInstruments && !this.song.layeredInstruments && i == this.channel) {
				const pattern = this.song.getPattern(this.channel, this.bar);
				if (pattern != null) {
					this.viewedInstrument[i] = pattern.instruments[0];
				}
			}
			this.viewedInstrument[i] = Math.min(this.viewedInstrument[i] | 0, this.song.channels[i].instruments.length - 1);
		}
		
		const highlightedPattern = this.getCurrentPattern();
		if (highlightedPattern != null && this.song.patternInstruments) {
			this.recentPatternInstruments[this.channel] = highlightedPattern.instruments.concat();
		}
		
		// Normalize selection.
		// I'm allowing the doc.bar to drift outside the box selection while playing
		// because it may auto-follow the playhead outside the selection but it would
		// be annoying to lose your selection just because the song is playing.
		if ((!this.synth.playing && (this.bar < this.selection.boxSelectionBar || this.selection.boxSelectionBar + this.selection.boxSelectionWidth <= this.bar)) ||
			this.channel < this.selection.boxSelectionChannel ||
			this.selection.boxSelectionChannel + this.selection.boxSelectionHeight <= this.channel ||
			this.song.barCount < this.selection.boxSelectionBar + this.selection.boxSelectionWidth ||
			channelCount < this.selection.boxSelectionChannel + this.selection.boxSelectionHeight ||
			(this.selection.boxSelectionWidth == 1 && this.selection.boxSelectionHeight == 1)) {
			this.selection.resetBoxSelection();
		}

		this.barScrollPos     = Math.max(0, Math.min(this.song.barCount          - this.trackVisibleBars,     this.barScrollPos));
		this.channelScrollPos = Math.max(0, Math.min(this.song.getChannelCount() - this.trackVisibleChannels, this.channelScrollPos));

	}}
		
	 __init30() {this._updateHistoryState = () => {
		this._waitingToUpdateState = false;
		let hash;
		try {
			// Ensure that the song is not corrupted before saving it.
			hash = this.song.toBase64String();
		} catch (error) {
			errorAlert(error);
			return;
		}
		if (this._stateShouldBePushed) this._sequenceNumber++;
		if (this._recordedNewSong) {
			this._resetSongRecoveryUid();
		} else {
			this._recovery.saveVersion(this._recoveryUid, this.song.title, hash);
		}
		let state = {canUndo: true, sequenceNumber: this._sequenceNumber, bar: this.bar, channel: this.channel, instrument: this.viewedInstrument[this.channel], recoveryUid: this._recoveryUid, prompt: this.prompt, selection: this.selection.toJSON()};
		if (this._stateShouldBePushed) {
			this._pushState(state, hash);
		} else {
			this._replaceState(state, hash);
		}
		this._stateShouldBePushed = false;
		this._recordedNewSong = false;
	}}
		
	 record(change, replace = false, newSong = false) {
		if (change.isNoop()) {
			this._recentChange = null;
			if (replace) this._back();
		} else {
			change.commit();
			this._recentChange = change;
			this._stateShouldBePushed = this._stateShouldBePushed || !replace;
			this._recordedNewSong = this._recordedNewSong || newSong;
			if (!this._waitingToUpdateState) {
				// Defer updating the url/history until all sequenced changes have
				// committed and the interface has rendered the latest changes to
				// improve perceived responsiveness.
				window.requestAnimationFrame(this._updateHistoryState);
				this._waitingToUpdateState = true;
			}
		}
	}
		
	 _resetSongRecoveryUid() {
		this._recoveryUid = generateUid();
	}
		
	 openPrompt(prompt) {
		this.prompt = prompt;
		const hash = this.song.toBase64String();
		this._sequenceNumber++;
		const state = {canUndo: true, sequenceNumber: this._sequenceNumber, bar: this.bar, channel: this.channel, instrument: this.viewedInstrument[this.channel], recoveryUid: this._recoveryUid, prompt: this.prompt, selection: this.selection.toJSON()};
		this._pushState(state, hash);
		this.notifier.changed();
	}
		
	 undo() {
		const state = this._getHistoryState();
		if (state == null || state.canUndo) this._back();
	}
		
	 redo() {
		this._forward();
	}
		
	 setProspectiveChange(change) {
		this._recentChange = change;
	}
		
	 forgetLastChange() {
		this._recentChange = null;
	}

	 checkLastChange() {
		return this._recentChange;
	}
		
	 lastChangeWas(change) {
		return change != null && change == this._recentChange;
	}
		
	 goBackToStart() {
		this.bar = 0;
		this.channel = 0;
		this.barScrollPos = 0;
		this.channelScrollPos = 0;
		this.synth.snapToStart();
		this.notifier.changed();
	}
	
	 setVolume(val) {
		this.prefs.volume = val;
		this.prefs.save();
		this.synth.volume = this._calcVolume();
	}
		
	 _calcVolume() {
		return Math.min(1.0, Math.pow(this.prefs.volume / 50.0, 0.5)) * Math.pow(2.0, (this.prefs.volume - 75.0) / 25.0);
	}
		
	 getCurrentPattern(barOffset = 0) {
		return this.song.getPattern(this.channel, this.bar + barOffset);
	}
		
	 getCurrentInstrument(barOffset = 0) {
		if (barOffset == 0) {
			return this.viewedInstrument[this.channel];
		} else {
			const pattern = this.getCurrentPattern(barOffset);
			return pattern == null ? 0 : pattern.instruments[0];
        }
	}
		
	 getMobileLayout() {
		return (this.prefs.layout == "wide") ? window.innerWidth <= 1000 : window.innerWidth <= 710;
	}
		
	 getBarWidth() {
		// Bugfix: In wide fullscreen, the 32 pixel display doesn't work as the trackEditor is still horizontally constrained
		return (!this.getMobileLayout() && this.prefs.enableChannelMuting && (!this.getFullScreen() || this.prefs.layout == "wide")) ? 30 : 32;
	}
	
	 getChannelHeight() {
		const squashed = this.getMobileLayout() || this.song.getChannelCount() > 4 || (this.song.barCount > this.trackVisibleBars && this.song.getChannelCount() > 3);
		// TODO: BoneBox widescreen should allow more channels before squashing or megasquashing
		const megaSquashed = !this.getMobileLayout() && (((this.prefs.layout != "wide") && this.song.getChannelCount() > 11) || this.song.getChannelCount() > 22);
		return megaSquashed ? 23 : (squashed ? 27 : 32);
	}
		
	 getFullScreen() {
		return !this.getMobileLayout() && (this.prefs.layout != "small");
	}
	
	 getVisibleOctaveCount() {
		return this.getFullScreen() ? this.prefs.visibleOctaves : Preferences.defaultVisibleOctaves;
}
	
	 getVisiblePitchCount() {
		 return this.getVisibleOctaveCount() * Config.pitchesPerOctave + 1;
	}
	
	 getBaseVisibleOctave(channel) {
		const visibleOctaveCount = this.getVisibleOctaveCount();
		return Math.max(0, Math.min(Config.pitchOctaves - visibleOctaveCount, Math.ceil(this.song.channels[channel].octave - visibleOctaveCount * 0.5)));
	}
} SongDocument.__initStatic();
