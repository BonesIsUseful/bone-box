// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

export const defaultMidiExpression = 0x7F;
export const defaultMidiPitchBend = 0x2000;

export var MidiChunkType; (function (MidiChunkType) {
	const header = 0x4D546864; MidiChunkType[MidiChunkType["header"] = header] = "header"; // "MThd" as bytes, big endian
	const track = 0x4D54726B; MidiChunkType[MidiChunkType["track"] = track] = "track"; // "MTrk" as bytes, big endian
})(MidiChunkType || (MidiChunkType = {}));

export var MidiFileFormat; (function (MidiFileFormat) {
	const singleTrack = 0x0000; MidiFileFormat[MidiFileFormat["singleTrack"] = singleTrack] = "singleTrack";
	const simultaneousTracks = 0x0001; MidiFileFormat[MidiFileFormat["simultaneousTracks"] = simultaneousTracks] = "simultaneousTracks";
	const independentTracks = 0x0002; MidiFileFormat[MidiFileFormat["independentTracks"] = independentTracks] = "independentTracks";
})(MidiFileFormat || (MidiFileFormat = {}));

// Lower 4 bits indicate channel, except for meta and sysex events.
export var MidiEventType; (function (MidiEventType) {
	//channelMode = 0x70,
	const noteOff = 0x80; MidiEventType[MidiEventType["noteOff"] = noteOff] = "noteOff";
	const noteOn = 0x90; MidiEventType[MidiEventType["noteOn"] = noteOn] = "noteOn";
	const keyPressure = 0xA0; MidiEventType[MidiEventType["keyPressure"] = keyPressure] = "keyPressure";
	const controlChange = 0xB0; MidiEventType[MidiEventType["controlChange"] = controlChange] = "controlChange";
	const programChange = 0xC0; MidiEventType[MidiEventType["programChange"] = programChange] = "programChange";
	const channelPressure = 0xD0; MidiEventType[MidiEventType["channelPressure"] = channelPressure] = "channelPressure";
	const pitchBend = 0xE0; MidiEventType[MidiEventType["pitchBend"] = pitchBend] = "pitchBend";
	const metaAndSysex = 0xF0; MidiEventType[MidiEventType["metaAndSysex"] = metaAndSysex] = "metaAndSysex";
		
	// These events are identified by all 8 bits.
	const meta = 0xFF; MidiEventType[MidiEventType["meta"] = meta] = "meta";
	// sysexStart = 0xF0,
	// sysexEscape = 0xF7,
})(MidiEventType || (MidiEventType = {}));

export var MidiControlEventMessage; (function (MidiControlEventMessage) {
		
	const setParameterMSB = 0x06; MidiControlEventMessage[MidiControlEventMessage["setParameterMSB"] = setParameterMSB] = "setParameterMSB";
	const volumeMSB = 0x07; MidiControlEventMessage[MidiControlEventMessage["volumeMSB"] = volumeMSB] = "volumeMSB";
	const panMSB = 0x0A; MidiControlEventMessage[MidiControlEventMessage["panMSB"] = panMSB] = "panMSB";
	const expressionMSB = 0x0B; MidiControlEventMessage[MidiControlEventMessage["expressionMSB"] = expressionMSB] = "expressionMSB";
		
	const setParameterLSB = 0x26; MidiControlEventMessage[MidiControlEventMessage["setParameterLSB"] = setParameterLSB] = "setParameterLSB";
	//volumeLSB = 0x27,
	//expressionLSB = 0x2B,
		
	//nonRegisteredParameterNumberLSB = 0x62,
	//nonRegisteredParameterNumberMSB = 0x63,
	const registeredParameterNumberLSB = 0x64; MidiControlEventMessage[MidiControlEventMessage["registeredParameterNumberLSB"] = registeredParameterNumberLSB] = "registeredParameterNumberLSB";
	const registeredParameterNumberMSB = 0x65; MidiControlEventMessage[MidiControlEventMessage["registeredParameterNumberMSB"] = registeredParameterNumberMSB] = "registeredParameterNumberMSB";
		
	// Channel mode messages:
	/*
	allSoundOff = 0x78,
	resetControllers = 0x79,
	localControl = 0x7A,
	allNotesOff = 0x7B,
	omniModeOff = 0x7C,
	omniModeOn = 0x7D,
	monoMode = 0x7E,
	polyphonicMode = 0x7F,
	*/
})(MidiControlEventMessage || (MidiControlEventMessage = {}));

export var MidiRegisteredParameterNumberMSB; (function (MidiRegisteredParameterNumberMSB) {
	const pitchBendRange = 0x00; MidiRegisteredParameterNumberMSB[MidiRegisteredParameterNumberMSB["pitchBendRange"] = pitchBendRange] = "pitchBendRange"; // semitones
	const fineTuning = 0x00; MidiRegisteredParameterNumberMSB[MidiRegisteredParameterNumberMSB["fineTuning"] = fineTuning] = "fineTuning";
	const coarseTuning = 0x00; MidiRegisteredParameterNumberMSB[MidiRegisteredParameterNumberMSB["coarseTuning"] = coarseTuning] = "coarseTuning";
	const tuningProgramSelect = 0x00; MidiRegisteredParameterNumberMSB[MidiRegisteredParameterNumberMSB["tuningProgramSelect"] = tuningProgramSelect] = "tuningProgramSelect";
	const tuningBankSelect = 0x00; MidiRegisteredParameterNumberMSB[MidiRegisteredParameterNumberMSB["tuningBankSelect"] = tuningBankSelect] = "tuningBankSelect";
	const reset = 0x7f; MidiRegisteredParameterNumberMSB[MidiRegisteredParameterNumberMSB["reset"] = reset] = "reset";
})(MidiRegisteredParameterNumberMSB || (MidiRegisteredParameterNumberMSB = {}));

export var MidiRegisteredParameterNumberLSB; (function (MidiRegisteredParameterNumberLSB) {
	const pitchBendRange = 0x00; MidiRegisteredParameterNumberLSB[MidiRegisteredParameterNumberLSB["pitchBendRange"] = pitchBendRange] = "pitchBendRange"; // cents
	const fineTuning = 0x01; MidiRegisteredParameterNumberLSB[MidiRegisteredParameterNumberLSB["fineTuning"] = fineTuning] = "fineTuning";
	const coarseTuning = 0x02; MidiRegisteredParameterNumberLSB[MidiRegisteredParameterNumberLSB["coarseTuning"] = coarseTuning] = "coarseTuning";
	const tuningProgramSelect = 0x03; MidiRegisteredParameterNumberLSB[MidiRegisteredParameterNumberLSB["tuningProgramSelect"] = tuningProgramSelect] = "tuningProgramSelect";
	const tuningBankSelect = 0x04; MidiRegisteredParameterNumberLSB[MidiRegisteredParameterNumberLSB["tuningBankSelect"] = tuningBankSelect] = "tuningBankSelect";
	const reset = 0x7f; MidiRegisteredParameterNumberLSB[MidiRegisteredParameterNumberLSB["reset"] = reset] = "reset";
})(MidiRegisteredParameterNumberLSB || (MidiRegisteredParameterNumberLSB = {}));

export var MidiMetaEventMessage; (function (MidiMetaEventMessage) {
	const sequenceNumber = 0x00; MidiMetaEventMessage[MidiMetaEventMessage["sequenceNumber"] = sequenceNumber] = "sequenceNumber";
	const text = 0x01; MidiMetaEventMessage[MidiMetaEventMessage["text"] = text] = "text";
	const copyrightNotice = 0x02; MidiMetaEventMessage[MidiMetaEventMessage["copyrightNotice"] = copyrightNotice] = "copyrightNotice";
	const trackName = 0x03; MidiMetaEventMessage[MidiMetaEventMessage["trackName"] = trackName] = "trackName";
	const instrumentName = 0x04; MidiMetaEventMessage[MidiMetaEventMessage["instrumentName"] = instrumentName] = "instrumentName";
	const lyricText = 0x05; MidiMetaEventMessage[MidiMetaEventMessage["lyricText"] = lyricText] = "lyricText";
	const marker = 0x06; MidiMetaEventMessage[MidiMetaEventMessage["marker"] = marker] = "marker";
	const cuePoint = 0x07; MidiMetaEventMessage[MidiMetaEventMessage["cuePoint"] = cuePoint] = "cuePoint";
	const channelPrefix = 0x20; MidiMetaEventMessage[MidiMetaEventMessage["channelPrefix"] = channelPrefix] = "channelPrefix";
	const endOfTrack = 0x2F; MidiMetaEventMessage[MidiMetaEventMessage["endOfTrack"] = endOfTrack] = "endOfTrack";
	const tempo = 0x51; MidiMetaEventMessage[MidiMetaEventMessage["tempo"] = tempo] = "tempo";
	const smpteOffset = 0x54; MidiMetaEventMessage[MidiMetaEventMessage["smpteOffset"] = smpteOffset] = "smpteOffset";
	const timeSignature = 0x58; MidiMetaEventMessage[MidiMetaEventMessage["timeSignature"] = timeSignature] = "timeSignature";
	const keySignature = 0x59; MidiMetaEventMessage[MidiMetaEventMessage["keySignature"] = keySignature] = "keySignature";
	const sequencerSpecificEvent = 0x7F; MidiMetaEventMessage[MidiMetaEventMessage["sequencerSpecificEvent"] = sequencerSpecificEvent] = "sequencerSpecificEvent";
})(MidiMetaEventMessage || (MidiMetaEventMessage = {}));

// BeepBox noise channels are very different from Midi drumsets, but here's my attempt at a conversion from Midi to BeepBox.





export const analogousDrumMap = {
		35: { frequency:  0, duration: 2, volume: 3 }, // Acoustic Bass Drum
		36: { frequency:  0, duration: 2, volume: 3 }, // Bass Drum 1
		37: { frequency:  5, duration: 1, volume: 3 }, // Side Stick
		38: { frequency:  4, duration: 2, volume: 3 }, // Acoustic Snare
		39: { frequency:  5, duration: 2, volume: 3 }, // Hand Clap
		40: { frequency:  4, duration: 2, volume: 3 }, // Electric Snare
		41: { frequency:  1, duration: 2, volume: 3 }, // Low Floor Tom
		42: { frequency:  8, duration: 1, volume: 3 }, // Closed Hi Hat
		43: { frequency:  1, duration: 2, volume: 3 }, // High Floor Tom
		44: { frequency:  8, duration: 1, volume: 2 }, // Pedal Hi-Hat
		45: { frequency:  2, duration: 2, volume: 3 }, // Low Tom
		46: { frequency:  8, duration: 4, volume: 3 }, // Open Hi-Hat
		47: { frequency:  2, duration: 2, volume: 3 }, // Low-Mid Tom
		48: { frequency:  3, duration: 2, volume: 3 }, // Hi-Mid Tom
		49: { frequency:  7, duration: 4, volume: 3 }, // Crash Cymbal 1
		50: { frequency:  3, duration: 2, volume: 3 }, // High Tom
		51: { frequency:  6, duration: 4, volume: 2 }, // Ride Cymbal 1
		52: { frequency:  7, duration: 4, volume: 3 }, // Chinese Cymbal
		53: { frequency:  6, duration: 2, volume: 3 }, // Ride Bell
	54: { frequency: 11, duration: 2, volume: 3 }, // Tambourine
		55: { frequency:  9, duration: 4, volume: 3 }, // Splash Cymbal
		56: { frequency:  7, duration: 1, volume: 2 }, // Cowbell
		57: { frequency:  7, duration: 4, volume: 3 }, // Crash Cymbal 2
	58: { frequency: 10, duration: 2, volume: 2 }, // Vibraslap
		59: { frequency:  6, duration: 4, volume: 3 }, // Ride Cymbal 2
	//60: { frequency:  7, duration: 1, volume: 3 }, // Hi Bongo
	//61: { frequency:  5, duration: 1, volume: 3 }, // Low Bongo
	//62: { frequency:  6, duration: 1, volume: 3 }, // Mute Hi Conga
	//63: { frequency:  5, duration: 1, volume: 3 }, // Open Hi Conga
	//64: { frequency:  4, duration: 1, volume: 3 }, // Low Conga
	//65: { frequency:  6, duration: 2, volume: 3 }, // High Timbale
	//66: { frequency:  4, duration: 2, volume: 3 }, // Low Timbale
	//67: { frequency: 10, duration: 1, volume: 2 }, // High Agogo
	//68: { frequency:  9, duration: 1, volume: 2 }, // Low Agogo
	69: { frequency: 10, duration: 2, volume: 3 }, // Cabasa
	70: { frequency: 10, duration: 2, volume: 3 }, // Maracas
	//71: { frequency: 10, duration: 2, volume: 3 }, // Short Whistle
	//72: { frequency:  9, duration: 2, volume: 3 }, // Long Whistle
	73: { frequency: 10, duration: 1, volume: 2 }, // Short Guiro
	74: { frequency: 10, duration: 2, volume: 2 }, // Long Guiro
	//75: { frequency: 10, duration: 1, volume: 2 }, // Claves
	//76: { frequency:  6, duration: 1, volume: 2 }, // Hi Wood Block
	//77: { frequency:  5, duration: 1, volume: 2 }, // Low Wood Block
	//78: { frequency:  6, duration: 2, volume: 3 }, // Mute Cuica
	//79: { frequency:  4, duration: 2, volume: 3 }, // Open Cuica
	//80: { frequency:  7, duration: 1, volume: 2 }, // Mute Triangle
	//81: { frequency:  7, duration: 4, volume: 2 }, // Open Triangle
};

export function midiVolumeToVolumeMult(volume) {
	// default midi volume is 100, pow(100/127,4)≈0.384 so I'm considering that the baseline volume.
	return Math.pow(volume / 127, 4.0) / 0.3844015376046128;
}
export function volumeMultToMidiVolume(volumeMult) {
	return Math.pow(volumeMult * 0.3844015376046128, 0.25) * 127;
}
export function midiExpressionToVolumeMult(expression) {
	return Math.pow(expression / 127, 4.0);
}
export function volumeMultToMidiExpression(volumeMult) {
	return Math.pow(volumeMult, 0.25) * 127;
}
