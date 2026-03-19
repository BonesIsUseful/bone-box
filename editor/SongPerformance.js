// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { Config } from "../synth/SynthConfig.js";
import { Note } from "../synth/synth.js";

import { ChangeGroup } from "./Change.js";
import { ChangeChannelBar, ChangePinTime, ChangeEnsurePatternExists, ChangeNoteAdded, ChangeInsertBars, ChangeDeleteBars, ChangeNoteLength } from "./changes.js";
import { Piano } from "./Piano.js";

export class SongPerformance {
	 __init() {this._channelIsDrum = false}
	 __init2() {this._channelOctave = -1}
	 __init3() {this._songKey = -1}
	 __init4() {this._pitchesAreTemporary = false}
	 __init5() {this._bassPitchesAreTemporary = false}
	  __init6() {this._recentlyAddedPitches = []} // Pitches that are rapidly added then removed within a minimum rhythm duration wouldn't get recorded until I explicitly track recently added notes and check if any are no longer held.
	  __init7() {this._recentlyAddedBassPitches = []} // Pitches that are rapidly added then removed within a minimum rhythm duration wouldn't get recorded until I explicitly track recently added notes and check if any are no longer held.

	 __init8() {this._songLengthWhenRecordingStarted = -1}
	 __init9() {this._playheadPart = -1}
	 __init10() {this._bassPlayheadPart = -1}
	 __init11() {this._playheadPattern = null}
	 __init12() {this._bassPlayheadPattern = null}
	 __init13() {this._pitchesChanged = false}
	 __init14() {this._bassPitchesChanged = false}
	 __init15() {this._lastNote = null}
	 __init16() {this._lastBassNote = null}
	 __init17() {this._recordingChange = null}
	
	constructor( _doc) {;this._doc = _doc;SongPerformance.prototype.__init.call(this);SongPerformance.prototype.__init2.call(this);SongPerformance.prototype.__init3.call(this);SongPerformance.prototype.__init4.call(this);SongPerformance.prototype.__init5.call(this);SongPerformance.prototype.__init6.call(this);SongPerformance.prototype.__init7.call(this);SongPerformance.prototype.__init8.call(this);SongPerformance.prototype.__init9.call(this);SongPerformance.prototype.__init10.call(this);SongPerformance.prototype.__init11.call(this);SongPerformance.prototype.__init12.call(this);SongPerformance.prototype.__init13.call(this);SongPerformance.prototype.__init14.call(this);SongPerformance.prototype.__init15.call(this);SongPerformance.prototype.__init16.call(this);SongPerformance.prototype.__init17.call(this);SongPerformance.prototype.__init18.call(this);SongPerformance.prototype.__init19.call(this);
		this._doc.notifier.watch(this._documentChanged);
		this._documentChanged();
		window.requestAnimationFrame(this._onAnimationFrame);
	}
	
	 play() {
		this._doc.synth.play();
		this._doc.synth.enableMetronome = false;
		this._doc.synth.countInMetronome = false
		this._doc.synth.maintainLiveInput();
	}
	
	 pause() {
		this.clearAllPitches();
		this.clearAllBassPitches();
		if (this._recordingChange != null) {
			if (this._doc.song.barCount > this._songLengthWhenRecordingStarted && !this._lastBarHasPatterns()) {
				// If an extra empty bar was added in case it was needed for recording, but it didn't end up getting used, delete it now.
				new ChangeDeleteBars(this._doc, this._doc.song.barCount - 1, 1);
				new ChangeChannelBar(this._doc, this._doc.channel, this._doc.song.barCount - 1);
			}
			if (!this._recordingChange.isNoop()) {
				this._doc.record(this._recordingChange);
				this._recordingChange = null;
			}
			this._lastNote = null;
		}
		this._doc.synth.pause();
		this._doc.synth.resetEffects();
		this._doc.synth.enableMetronome = false;
		this._doc.synth.countInMetronome = false
		if (this._doc.prefs.autoFollow) {
			this._doc.synth.goToBar(this._doc.bar);
		}
		this._doc.synth.snapToBar();
	}
	
	 record() {
		this._doc.synth.snapToBar();
		const playheadBar = Math.floor(this._doc.synth.playhead);
		if (playheadBar != this._doc.bar) {
			new ChangeChannelBar(this._doc, this._doc.channel, playheadBar);
		}
		if (this._pitchesAreTemporary) {
			this.clearAllPitches();
			this._pitchesAreTemporary = false;
		}
		if (this._bassPitchesAreTemporary) {
			this.clearAllBassPitches();
			this._bassPitchesAreTemporary = false;
		}
		this._doc.synth.enableMetronome = this._doc.prefs.metronomeWhileRecording;
		this._doc.synth.countInMetronome = this._doc.prefs.metronomeCountIn;
		this._doc.synth.startRecording();
		this._doc.synth.maintainLiveInput();
		this._songLengthWhenRecordingStarted = this._doc.song.barCount;
		this._playheadPart = this._getCurrentPlayheadPart();
		this._bassPlayheadPart = this._getCurrentPlayheadPart();
		this._playheadPattern = null;
		this._bassPlayheadPattern = null;
		this._pitchesChanged = false;
		this._bassPitchesChanged = false;
		this._lastNote = null;
		this._lastBassNote = null;
		this._recentlyAddedPitches.length = 0;
		this._recentlyAddedBassPitches.length = 0;
		this._recordingChange = new ChangeGroup();
		this._doc.setProspectiveChange(this._recordingChange);
	}
	
	 abortRecording() {
		this._recordingChange = null;
		this.pause();
	}
	
	 pitchesAreTemporary() {
		return this._pitchesAreTemporary;
	}

	 bassPitchesAreTemporary() {
		return this._bassPitchesAreTemporary;
	}

	 _getBassOffsetChannel() {
		if ( this._doc.channel >= this._doc.song.pitchChannelCount )
			return this._doc.channel;
		return Math.max( 0, Math.min( this._doc.song.pitchChannelCount - 1, this._doc.channel + this._doc.prefs.bassOffset ));
	}
	
	 _getMinDivision() {
		if (this._doc.prefs.snapRecordedNotesToRhythm) {
			return Config.partsPerBeat / Config.rhythms[this._doc.song.rhythm].stepsPerBeat;
		} else {
			return 1;
		}
	}
	
	 _getCurrentPlayheadPart() {
		const currentPart = this._doc.synth.playhead * this._doc.song.beatsPerBar * Config.partsPerBeat;
		if (this._doc.prefs.snapRecordedNotesToRhythm) {
			const minDivision = this._getMinDivision();
			return Math.round(currentPart / minDivision) * minDivision;
		}
		return Math.round(currentPart);
	}
	
	 _lastBarHasPatterns() {
		for (let channelIndex = 0; channelIndex < this._doc.song.getChannelCount(); channelIndex++) {
			if (this._doc.song.channels[channelIndex].bars[this._doc.song.barCount - 1] != 0) return true;
		}
		return false;
	}
	
	 __init18() {this._onAnimationFrame = () => {
		window.requestAnimationFrame(this._onAnimationFrame);
		if (this._doc.prefs.followPlayhead && this._doc.synth.playing && !this._doc.synth.recording) {
			const pos = this._doc.synth.playhead;
			const N = this._doc.song.barCount;
			const targetBar = Math.floor(Math.max(0, Math.min(N - 1, pos)));
			if (targetBar != this._doc.bar) {
				this._doc.selection.setChannelBar(this._doc.channel, targetBar);
				this._doc.selection.scrollToSelectedPattern();
				this._doc.notifier.notifyWatchers();
			}
		}
		if (this._doc.synth.recording) {
			let dirty = this._updateRecordedNotes();
			dirty = this._updateRecordedBassNotes() ? true : dirty;
			if (dirty) {
				// The full interface is usually only rerendered in response to user input events, not animation events, but in this case go ahead and rerender everything.
				this._doc.notifier.notifyWatchers();
			}
		}
	}}
	
	// Returns true if the full interface needs to be rerendered.
	 _updateRecordedNotes() {
		if (this._recordingChange == null) return false;
		if (!this._doc.lastChangeWas(this._recordingChange)) {
			this.abortRecording();
			return false;
		}
		if (this._doc.synth.countInMetronome) {
			// If the synth is still counting in before recording, discard any recently added pitches.
			this._recentlyAddedPitches.length = 0;
			this._pitchesChanged = false;
			return false;
		}
		
		const partsPerBar = this._doc.song.beatsPerBar * Config.partsPerBeat;
		const oldPart = this._playheadPart % partsPerBar;
		const oldBar = Math.floor(this._playheadPart / partsPerBar);
		const oldPlayheadPart = this._playheadPart;
		this._playheadPart = this._getCurrentPlayheadPart();
		const newPart = this._playheadPart % partsPerBar;
		const newBar = Math.floor(this._playheadPart / partsPerBar);
		if (oldPart == newPart && oldBar == newBar) return false;
		if (this._playheadPart < oldPlayheadPart) {
			this._lastNote = null;
			this._playheadPattern = null;
			return false;
		}
		
		let dirty = false;
		for (let bar = oldBar; bar <= newBar; bar++) {
			if (bar != oldBar) {
				this._playheadPattern = null;
			}
			const startPart = (bar == oldBar) ? oldPart : 0;
			const endPart = (bar == newBar) ? newPart : partsPerBar;
			if (startPart == endPart) break;
			if (this._lastNote != null && !this._pitchesChanged && startPart > 0 && this._doc.synth.liveInputPitches.length > 0) {
				this._recordingChange.append(new ChangePinTime(this._doc, this._lastNote, 1, endPart, this._lastNote.continuesLastPattern));
				// Instead of updating the entire interface when extending the last note, just update the current pattern as a special case to avoid doing too much work every frame since performance is important while recording.
				this._doc.currentPatternIsDirty = true;
			} else {
				if (this._lastNote != null) {
					// End the last note.
					this._lastNote = null;
				}
				// All current pitches will usually fill the time span from startPart to endPart, but
				// if any recent pitches were released before being recorded, they'll get recorded here
				// as short as possible and then any remaining time will be dedicated to pitches that
				// haven't been released yet.
				let noteStartPart = startPart;
				let noteEndPart = endPart;
				while (noteStartPart < endPart) {
					let addedAlreadyReleasedPitch = false;
					if (this._recentlyAddedPitches.length > 0 || this._doc.synth.liveInputPitches.length > 0) {
						if (this._playheadPattern == null) {
							this._doc.selection.erasePatternInBar(this._recordingChange, this._doc.synth.liveInputChannel, bar);
							this._recordingChange.append(new ChangeEnsurePatternExists(this._doc, this._doc.synth.liveInputChannel, bar));
							this._playheadPattern = this._doc.song.getPattern(this._doc.synth.liveInputChannel, bar);
						}

						if (this._playheadPattern == null) throw new Error();
						this._lastNote = new Note(-1, noteStartPart, noteEndPart, Config.noteSizeMax, this._doc.song.getChannelIsNoise(this._doc.synth.liveInputChannel));
						this._lastNote.continuesLastPattern = (noteStartPart == 0 && !this._pitchesChanged);
						this._lastNote.pitches.length = 0;
						while (this._recentlyAddedPitches.length > 0) {
							if (this._lastNote.pitches.length >= Config.maxChordSize) break;
							const recentPitch = this._recentlyAddedPitches.shift();
							if (this._doc.synth.liveInputPitches.indexOf(recentPitch) == -1) {
								this._lastNote.pitches.push(recentPitch);
								addedAlreadyReleasedPitch = true;
							}
						}
						for (let i = 0; i < this._doc.synth.liveInputPitches.length; i++) {
							if (this._lastNote.pitches.length >= Config.maxChordSize) break;
							this._lastNote.pitches.push(this._doc.synth.liveInputPitches[i]);
						}
						this._recordingChange.append(new ChangeNoteAdded(this._doc, this._playheadPattern, this._lastNote, this._playheadPattern.notes.length));
						if (addedAlreadyReleasedPitch) {
							// If this note contains pitches that were already released, shorten it and start a new note.
							noteEndPart = noteStartPart + this._getMinDivision();
							new ChangeNoteLength(this._doc, this._lastNote, this._lastNote.start, noteEndPart);
							this._lastNote = null;
						}
						dirty = true;
					}
					this._pitchesChanged = addedAlreadyReleasedPitch;
					noteStartPart = noteEndPart;
					noteEndPart = endPart;
				}
			}
			
			if (bar == this._doc.song.barCount - 1) {
				if (this._lastBarHasPatterns()) {
					new ChangeInsertBars(this._doc, this._doc.song.barCount, 1);
					this._doc.bar--; // To counteract it increasing in ChangeInsertBars.
					dirty = true;
				}
			}
		}
		return dirty;
	}

	// Returns true if the full interface needs to be rerendered.
	 _updateRecordedBassNotes() {
		if (this._recordingChange == null) return false;
		if (!this._doc.lastChangeWas(this._recordingChange)) {
			this.abortRecording();
			return false;
		}
		if (this._doc.synth.countInMetronome) {
			// If the synth is still counting in before recording, discard any recently added pitches.
			this._recentlyAddedBassPitches.length = 0;
			this._bassPitchesChanged = false;
			return false;
		}
		
		const partsPerBar = this._doc.song.beatsPerBar * Config.partsPerBeat;
		const oldPart = this._bassPlayheadPart % partsPerBar;
		const oldBar = Math.floor(this._bassPlayheadPart / partsPerBar);
		const oldPlayheadPart = this._bassPlayheadPart;
		this._bassPlayheadPart = this._getCurrentPlayheadPart();
		const newPart = this._bassPlayheadPart % partsPerBar;
		const newBar = Math.floor(this._bassPlayheadPart / partsPerBar);
		if (oldPart == newPart && oldBar == newBar) return false;
		if (this._bassPlayheadPart < oldPlayheadPart) {
			this._lastBassNote = null;
			this._bassPlayheadPattern = null;
			return false;
		}
		
		let dirty = false;
		for (let bar = oldBar; bar <= newBar; bar++) {
			if (bar != oldBar) {
				this._bassPlayheadPattern = null;
			}
			const startPart = (bar == oldBar) ? oldPart : 0;
			const endPart = (bar == newBar) ? newPart : partsPerBar;
			if (startPart == endPart) break;
			if (this._lastBassNote != null && !this._bassPitchesChanged && startPart > 0 && this._doc.synth.liveBassInputPitches.length > 0) {
				this._recordingChange.append(new ChangePinTime(this._doc, this._lastBassNote, 1, endPart, this._lastBassNote.continuesLastPattern));
				// Instead of updating the entire interface when extending the last note, just update the current pattern as a special case to avoid doing too much work every frame since performance is important while recording.
				this._doc.currentPatternIsDirty = true;
			} else {
				if (this._lastBassNote != null) {
					// End the last note.
					this._lastBassNote = null;
				}
				// All current pitches will usually fill the time span from startPart to endPart, but
				// if any recent pitches were released before being recorded, they'll get recorded here
				// as short as possible and then any remaining time will be dedicated to pitches that
				// haven't been released yet.
				let noteStartPart = startPart;
				let noteEndPart = endPart;
				while (noteStartPart < endPart) {
					let addedAlreadyReleasedPitch = false;
					if (this._recentlyAddedBassPitches.length > 0 || this._doc.synth.liveBassInputPitches.length > 0) {
						if (this._bassPlayheadPattern == null) {
							this._doc.selection.erasePatternInBar(this._recordingChange, this._doc.synth.liveBassInputChannel, bar);
							this._recordingChange.append(new ChangeEnsurePatternExists(this._doc, this._doc.synth.liveBassInputChannel, bar));
							this._bassPlayheadPattern = this._doc.song.getPattern(this._doc.synth.liveBassInputChannel, bar);
						}

						if (this._bassPlayheadPattern == null) throw new Error();
						this._lastBassNote = new Note(-1, noteStartPart, noteEndPart, Config.noteSizeMax, this._doc.song.getChannelIsNoise(this._doc.synth.liveBassInputChannel));
						this._lastBassNote.continuesLastPattern = (noteStartPart == 0 && !this._bassPitchesChanged);
						this._lastBassNote.pitches.length = 0;
						while (this._recentlyAddedBassPitches.length > 0) {
							if (this._lastBassNote.pitches.length >= Config.maxChordSize) break;
							const recentPitch = this._recentlyAddedBassPitches.shift();
							if (this._doc.synth.liveBassInputPitches.indexOf(recentPitch) == -1) {
								this._lastBassNote.pitches.push(recentPitch);
								addedAlreadyReleasedPitch = true;
							}
						}
						for (let i = 0; i < this._doc.synth.liveBassInputPitches.length; i++) {
							if (this._lastBassNote.pitches.length >= Config.maxChordSize) break;
							this._lastBassNote.pitches.push(this._doc.synth.liveBassInputPitches[i]);
						}
						this._recordingChange.append(new ChangeNoteAdded(this._doc, this._bassPlayheadPattern, this._lastBassNote, this._bassPlayheadPattern.notes.length));
						if (addedAlreadyReleasedPitch) {
							// If this note contains pitches that were already released, shorten it and start a new note.
							noteEndPart = noteStartPart + this._getMinDivision();
							new ChangeNoteLength(this._doc, this._lastBassNote, this._lastBassNote.start, noteEndPart);
							this._lastBassNote = null;
						}
						dirty = true;
					}
					this._bassPitchesChanged = addedAlreadyReleasedPitch;
					noteStartPart = noteEndPart;
					noteEndPart = endPart;
				}
			}
			
			if (bar == this._doc.song.barCount - 1) {
				if (this._lastBarHasPatterns()) {
					new ChangeInsertBars(this._doc, this._doc.song.barCount, 1);
					this._doc.bar--; // To counteract it increasing in ChangeInsertBars.
					dirty = true;
				}
			}
		}
		return dirty;
	}
	
	 setTemporaryPitches(pitches, duration) {
		this._updateRecordedNotes();
		for (let i = 0; i < pitches.length; i++) {
			this._doc.synth.liveInputPitches[i] = pitches[i];
		}
		this._doc.synth.liveInputPitches.length = Math.min(pitches.length, Config.maxChordSize);
		this._doc.synth.liveInputDuration = duration;
		this._doc.synth.liveInputStarted = true;
		this._pitchesAreTemporary = true;
		this._pitchesChanged = true;
	}

	 setTemporaryBassPitches(pitches, duration) {
		this._updateRecordedBassNotes();
		for (let i = 0; i < pitches.length; i++) {
			this._doc.synth.liveBassInputPitches[i] = pitches[i];
		}
		this._doc.synth.liveBassInputPitches.length = Math.min(pitches.length, Config.maxChordSize);
		this._doc.synth.liveBassInputDuration = duration;
		this._doc.synth.liveBassInputStarted = true;
		this._bassPitchesAreTemporary = true;
		this._bassPitchesChanged = true;
	}
	
	 addPerformedPitch(pitch) {
		this._doc.synth.maintainLiveInput();

		if (pitch > Piano.getBassCutoffPitch(this._doc) || this._getBassOffsetChannel() == this._doc.channel) {
			this._updateRecordedNotes();
			if (this._pitchesAreTemporary) {
				this.clearAllPitches();
				this._pitchesAreTemporary = false;
			}
			if (this._doc.prefs.ignorePerformedNotesNotInScale && !Config.scales[this._doc.song.scale].flags[pitch % Config.pitchesPerOctave]) {
				return;
			}
			if (this._doc.synth.liveInputPitches.indexOf(pitch) == -1) {
				this._doc.synth.liveInputPitches.push(pitch);
				this._pitchesChanged = true;
				while (this._doc.synth.liveInputPitches.length > Config.maxChordSize) {
					this._doc.synth.liveInputPitches.shift();
				}
				this._doc.synth.liveInputDuration = Number.MAX_SAFE_INTEGER;
			
				if (this._recordingChange != null) {
					const recentIndex = this._recentlyAddedPitches.indexOf(pitch);
					if (recentIndex != -1) {
						// If the latest pitch is already in _recentlyAddedPitches, remove it before adding it back at the end.
						this._recentlyAddedPitches.splice(recentIndex, 1);
					}
					this._recentlyAddedPitches.push(pitch);
					while (this._recentlyAddedPitches.length > Config.maxChordSize * 4) {
						this._recentlyAddedPitches.shift();
					}
				}
			}
		}
		else {
			this._updateRecordedBassNotes();
			if (this._bassPitchesAreTemporary) {
				this.clearAllBassPitches();
				this._bassPitchesAreTemporary = false;
			}
			if (this._doc.prefs.ignorePerformedNotesNotInScale && !Config.scales[this._doc.song.scale].flags[pitch % Config.pitchesPerOctave]) {
				return;
			}
			if (this._doc.synth.liveBassInputPitches.indexOf(pitch) == -1) {
				this._doc.synth.liveBassInputPitches.push(pitch);
				this._bassPitchesChanged = true;
				while (this._doc.synth.liveBassInputPitches.length > Config.maxChordSize) {
					this._doc.synth.liveBassInputPitches.shift();
				}
				this._doc.synth.liveBassInputDuration = Number.MAX_SAFE_INTEGER;
			
				if (this._recordingChange != null) {
					const recentIndex = this._recentlyAddedPitches.indexOf(pitch);
					if (recentIndex != -1) {
						// If the latest pitch is already in _recentlyAddedPitches, remove it before adding it back at the end.
						this._recentlyAddedBassPitches.splice(recentIndex, 1);
					}
					this._recentlyAddedBassPitches.push(pitch);
					while (this._recentlyAddedBassPitches.length > Config.maxChordSize * 4) {
						this._recentlyAddedBassPitches.shift();
					}
				}
			}
		}
	}
	
	 removePerformedPitch(pitch) {
		if (pitch > Piano.getBassCutoffPitch(this._doc) || this._getBassOffsetChannel() == this._doc.channel) {
			this._updateRecordedNotes();
			for (let i = 0; i < this._doc.synth.liveInputPitches.length; i++) {
				if (this._doc.synth.liveInputPitches[i] == pitch) {
					this._doc.synth.liveInputPitches.splice(i, 1);
					this._pitchesChanged = true;
					i--;
				}
			}
		}
		else {
			this._updateRecordedBassNotes();
			for (let i = 0; i < this._doc.synth.liveBassInputPitches.length; i++) {
				if (this._doc.synth.liveBassInputPitches[i] == pitch) {
					this._doc.synth.liveBassInputPitches.splice(i, 1);
					this._bassPitchesChanged = true;
					i--;
				}
			}
		}
	}
	
	 clearAllPitches() {
		this._updateRecordedNotes();
		this._doc.synth.liveInputPitches.length = 0;
		this._pitchesChanged = true;
	}

	 clearAllBassPitches() {
		this._updateRecordedBassNotes();
		this._doc.synth.liveBassInputPitches.length = 0;
		this._bassPitchesChanged = true;
	}
	
	 __init19() {this._documentChanged = () => {
		const isDrum = this._doc.song.getChannelIsNoise(this._doc.channel);
		const octave = this._doc.song.channels[this._doc.channel].octave;
		if (this._doc.synth.liveInputChannel != this._doc.channel || this._doc.synth.liveBassInputChannel != this._getBassOffsetChannel() || this._channelIsDrum != isDrum || this._channelOctave != octave || this._songKey != this._doc.song.key) {
			this._doc.synth.liveInputChannel = this._doc.channel;
			this._doc.synth.liveBassInputChannel = this._getBassOffsetChannel();
			this._channelIsDrum = isDrum;
			this._channelOctave = octave;
			this._songKey = this._doc.song.key;
			this.clearAllPitches();
			this.clearAllBassPitches();
		}
		this._doc.synth.liveInputInstruments = this._doc.recentPatternInstruments[this._doc.channel];
		this._doc.synth.liveBassInputInstruments = this._doc.recentPatternInstruments[this._doc.synth.liveBassInputChannel];
	}}
}
