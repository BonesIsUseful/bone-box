/*!
Copyright (c) 2012-2022 John Nesky and contributing authors

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
of the Software, and to permit persons to whom the Software is furnished to do 
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
*/









export var FilterType; (function (FilterType) {
    const lowPass = 0; FilterType[FilterType["lowPass"] = lowPass] = "lowPass";
    const highPass = lowPass + 1; FilterType[FilterType["highPass"] = highPass] = "highPass";
    const peak = highPass + 1; FilterType[FilterType["peak"] = peak] = "peak";
    const length = peak + 1; FilterType[FilterType["length"] = length] = "length";
})(FilterType || (FilterType = {}));

export var SustainType; (function (SustainType) {
	const bright = 0; SustainType[SustainType["bright"] = bright] = "bright";
	const acoustic = bright + 1; SustainType[SustainType["acoustic"] = acoustic] = "acoustic";
	const length = acoustic + 1; SustainType[SustainType["length"] = length] = "length";
})(SustainType || (SustainType = {}));

export var EnvelopeType; (function (EnvelopeType) {
    const noteSize = 0; EnvelopeType[EnvelopeType["noteSize"] = noteSize] = "noteSize";
    const none = noteSize + 1; EnvelopeType[EnvelopeType["none"] = none] = "none";
    const punch = none + 1; EnvelopeType[EnvelopeType["punch"] = punch] = "punch";
    const flare = punch + 1; EnvelopeType[EnvelopeType["flare"] = flare] = "flare";
    const twang = flare + 1; EnvelopeType[EnvelopeType["twang"] = twang] = "twang";
    const swell = twang + 1; EnvelopeType[EnvelopeType["swell"] = swell] = "swell";
    const tremolo = swell + 1; EnvelopeType[EnvelopeType["tremolo"] = tremolo] = "tremolo";
    const tremolo2 = tremolo + 1; EnvelopeType[EnvelopeType["tremolo2"] = tremolo2] = "tremolo2";
    const decay = tremolo2 + 1; EnvelopeType[EnvelopeType["decay"] = decay] = "decay";
    const blip = decay + 1; EnvelopeType[EnvelopeType["blip"] = blip] = "blip";
})(EnvelopeType || (EnvelopeType = {}));

export var InstrumentType; (function (InstrumentType) {
    const chip = 0; InstrumentType[InstrumentType["chip"] = chip] = "chip";
    const fm = chip + 1; InstrumentType[InstrumentType["fm"] = fm] = "fm";
    const noise = fm + 1; InstrumentType[InstrumentType["noise"] = noise] = "noise";
    const spectrum = noise + 1; InstrumentType[InstrumentType["spectrum"] = spectrum] = "spectrum";
    const drumset = spectrum + 1; InstrumentType[InstrumentType["drumset"] = drumset] = "drumset";
    const harmonics = drumset + 1; InstrumentType[InstrumentType["harmonics"] = harmonics] = "harmonics";
    const pwm = harmonics + 1; InstrumentType[InstrumentType["pwm"] = pwm] = "pwm";
    const pickedString = pwm + 1; InstrumentType[InstrumentType["pickedString"] = pickedString] = "pickedString";
    const supersaw = pickedString + 1; InstrumentType[InstrumentType["supersaw"] = supersaw] = "supersaw";
    const customChipWave = supersaw + 1; InstrumentType[InstrumentType["customChipWave"] = customChipWave] = "customChipWave";
    const mod = customChipWave + 1; InstrumentType[InstrumentType["mod"] = mod] = "mod";
    const length = mod + 1; InstrumentType[InstrumentType["length"] = length] = "length";
})(InstrumentType || (InstrumentType = {}));

export var DropdownID; (function (DropdownID) {
    const Vibrato = 0; DropdownID[DropdownID["Vibrato"] = Vibrato] = "Vibrato";
    const Pan = 1; DropdownID[DropdownID["Pan"] = Pan] = "Pan";
    const Chord = 2; DropdownID[DropdownID["Chord"] = Chord] = "Chord";
    const Transition = 3; DropdownID[DropdownID["Transition"] = Transition] = "Transition";
    const FM = 4; DropdownID[DropdownID["FM"] = FM] = "FM";
    const Envelope = 5; DropdownID[DropdownID["Envelope"] = Envelope] = "Envelope";

})(DropdownID || (DropdownID = {}));

export var EffectType; (function (EffectType) {
    const reverb = 0; EffectType[EffectType["reverb"] = reverb] = "reverb";
    const chorus = reverb + 1; EffectType[EffectType["chorus"] = chorus] = "chorus";
    const panning = chorus + 1; EffectType[EffectType["panning"] = panning] = "panning";
    const distortion = panning + 1; EffectType[EffectType["distortion"] = distortion] = "distortion";
    const bitcrusher = distortion + 1; EffectType[EffectType["bitcrusher"] = bitcrusher] = "bitcrusher";
    const noteFilter = bitcrusher + 1; EffectType[EffectType["noteFilter"] = noteFilter] = "noteFilter";
    const echo = noteFilter + 1; EffectType[EffectType["echo"] = echo] = "echo";
    const pitchShift = echo + 1; EffectType[EffectType["pitchShift"] = pitchShift] = "pitchShift";
    const detune = pitchShift + 1; EffectType[EffectType["detune"] = detune] = "detune";
    const vibrato = detune + 1; EffectType[EffectType["vibrato"] = vibrato] = "vibrato";
    const transition = vibrato + 1; EffectType[EffectType["transition"] = transition] = "transition";
    const chord = transition + 1; EffectType[EffectType["chord"] = chord] = "chord";
    // If you add more, you'll also have to extend the bitfield used in Base64 which currently uses two six-bit characters.
    const length = chord + 1; EffectType[EffectType["length"] = length] = "length";
})(EffectType || (EffectType = {}));

export var EnvelopeComputeIndex; (function (EnvelopeComputeIndex) {
    const noteVolume = 0; EnvelopeComputeIndex[EnvelopeComputeIndex["noteVolume"] = noteVolume] = "noteVolume";
    const noteFilterAllFreqs = noteVolume + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterAllFreqs"] = noteFilterAllFreqs] = "noteFilterAllFreqs";
    const pulseWidth = noteFilterAllFreqs + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["pulseWidth"] = pulseWidth] = "pulseWidth";
    const stringSustain = pulseWidth + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["stringSustain"] = stringSustain] = "stringSustain";
    const unison = stringSustain + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["unison"] = unison] = "unison";
    const operatorFrequency0 = unison + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["operatorFrequency0"] = operatorFrequency0] = "operatorFrequency0"; const operatorFrequency1 = operatorFrequency0 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["operatorFrequency1"] = operatorFrequency1] = "operatorFrequency1"; const operatorFrequency2 = operatorFrequency1 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["operatorFrequency2"] = operatorFrequency2] = "operatorFrequency2"; const operatorFrequency3 = operatorFrequency2 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["operatorFrequency3"] = operatorFrequency3] = "operatorFrequency3";
    const operatorAmplitude0 = operatorFrequency3 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["operatorAmplitude0"] = operatorAmplitude0] = "operatorAmplitude0"; const operatorAmplitude1 = operatorAmplitude0 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["operatorAmplitude1"] = operatorAmplitude1] = "operatorAmplitude1"; const operatorAmplitude2 = operatorAmplitude1 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["operatorAmplitude2"] = operatorAmplitude2] = "operatorAmplitude2"; const operatorAmplitude3 = operatorAmplitude2 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["operatorAmplitude3"] = operatorAmplitude3] = "operatorAmplitude3";
    const feedbackAmplitude = operatorAmplitude3 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["feedbackAmplitude"] = feedbackAmplitude] = "feedbackAmplitude";
    const pitchShift = feedbackAmplitude + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["pitchShift"] = pitchShift] = "pitchShift";
    const detune = pitchShift + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["detune"] = detune] = "detune";
    const vibratoDepth = detune + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["vibratoDepth"] = vibratoDepth] = "vibratoDepth";
    const noteFilterFreq0 = vibratoDepth + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterFreq0"] = noteFilterFreq0] = "noteFilterFreq0"; const noteFilterFreq1 = noteFilterFreq0 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterFreq1"] = noteFilterFreq1] = "noteFilterFreq1"; const noteFilterFreq2 = noteFilterFreq1 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterFreq2"] = noteFilterFreq2] = "noteFilterFreq2"; const noteFilterFreq3 = noteFilterFreq2 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterFreq3"] = noteFilterFreq3] = "noteFilterFreq3"; const noteFilterFreq4 = noteFilterFreq3 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterFreq4"] = noteFilterFreq4] = "noteFilterFreq4"; const noteFilterFreq5 = noteFilterFreq4 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterFreq5"] = noteFilterFreq5] = "noteFilterFreq5"; const noteFilterFreq6 = noteFilterFreq5 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterFreq6"] = noteFilterFreq6] = "noteFilterFreq6"; const noteFilterFreq7 = noteFilterFreq6 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterFreq7"] = noteFilterFreq7] = "noteFilterFreq7";
    const noteFilterGain0 = noteFilterFreq7 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterGain0"] = noteFilterGain0] = "noteFilterGain0"; const noteFilterGain1 = noteFilterGain0 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterGain1"] = noteFilterGain1] = "noteFilterGain1"; const noteFilterGain2 = noteFilterGain1 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterGain2"] = noteFilterGain2] = "noteFilterGain2"; const noteFilterGain3 = noteFilterGain2 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterGain3"] = noteFilterGain3] = "noteFilterGain3"; const noteFilterGain4 = noteFilterGain3 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterGain4"] = noteFilterGain4] = "noteFilterGain4"; const noteFilterGain5 = noteFilterGain4 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterGain5"] = noteFilterGain5] = "noteFilterGain5"; const noteFilterGain6 = noteFilterGain5 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterGain6"] = noteFilterGain6] = "noteFilterGain6"; const noteFilterGain7 = noteFilterGain6 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["noteFilterGain7"] = noteFilterGain7] = "noteFilterGain7";
    const supersawDynamism = noteFilterGain7 + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["supersawDynamism"] = supersawDynamism] = "supersawDynamism";
	const supersawSpread = supersawDynamism + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["supersawSpread"] = supersawSpread] = "supersawSpread";
	const supersawShape = supersawSpread + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["supersawShape"] = supersawShape] = "supersawShape";
    const length = supersawShape + 1; EnvelopeComputeIndex[EnvelopeComputeIndex["length"] = length] = "length";
})(EnvelopeComputeIndex || (EnvelopeComputeIndex = {}));

/*
export const enum InstrumentAutomationIndex {
    mixVolume,
    eqFilterAllFreqs,
    eqFilterFreq0, eqFilterFreq1, eqFilterFreq2, eqFilterFreq3, eqFilterFreq4, eqFilterFreq5, eqFilterFreq6, eqFilterFreq7,
    eqFilterGain0, eqFilterGain1, eqFilterGain2, eqFilterGain3, eqFilterGain4, eqFilterGain5, eqFilterGain6, eqFilterGain7,
    distortion,
    bitcrusherQuantization,
    bitcrusherFrequency,
    panning,
    chorus,
    echoSustain,
    //echoDelay, // Wait until tick settings can be computed once for multiple run lengths.
    reverb,
    length,
}
*/






















































































































export class Config {
    // Params for post-processing compressor
     static __initStatic() {this.thresholdVal = -10}
     static __initStatic2() {this.kneeVal = 40}
     static __initStatic3() {this.ratioVal = 12}
     static __initStatic4() {this.attackVal = 0}
     static __initStatic5() {this.releaseVal = 0.25}

     static  __initStatic6() {this.scales = toNameMap([

        //   C     Db      D     Eb      E      F     F#      G     Ab      A     Bb      B      C
        { name: "Free", realName: "chromatic", flags: [true, true, true, true, true, true, true, true, true, true, true, true] }, // Free
        { name: "Major", realName: "ionian", flags: [true, false, true, false, true, true, false, true, false, true, false, true] }, // Major
        { name: "Minor", realName: "aeolian", flags: [true, false, true, true, false, true, false, true, true, false, true, false] }, // Minor
        { name: "Mixolydian", realName: "mixolydian", flags: [true, false, true, false, true, true, false, true, false, true, true, false] }, // Mixolydian
        { name: "Lydian", realName: "lydian", flags: [true, false, true, false, true, false, true, true, false, true, false, true] }, // Lydian
        { name: "Dorian", realName: "dorian", flags: [true, false, true, true, false, true, false, true, false, true, true, false] }, // Dorian
        { name: "Phrygian", realName: "phrygian", flags: [true, true, false, true, false, true, false, true, true, false, true, false] }, // Phrygian
        { name: "Locrian", realName: "locrian", flags: [true, true, false, true, false, true, true, false, true, false, true, false] }, // Locrian
        { name: "Lydian Dominant", realName: "lydian dominant", flags: [true, false, true, false, true, false, true, true, false, true, true, false] }, // Lydian Dominant
        { name: "Phrygian Dominant", realName: "phrygian dominant", flags: [true, true, false, false, true, true, false, true, true, false, true, false] }, // Phrygian Dominant
        { name: "Harmonic Major", realName: "harmonic major", flags: [true, false, true, false, true, true, false, true, true, false, false, true] }, // Harmonic Major
        { name: "Harmonic Minor", realName: "harmonic minor", flags: [true, false, true, true, false, true, false, true, true, false, false, true] }, // Harmonic Minor
        { name: "Melodic Minor", realName: "melodic minor", flags: [true, false, true, true, false, true, false, true, false, true, false, true] }, // Melodic Minor
        { name: "Blues", realName: "blues", flags: [true, false, false, true, false, true, true, true, false, false, true, false] }, // Blues
        { name: "Altered", realName: "altered", flags: [true, true, false, true, true, false, true, false, true, false, true, false] }, // Altered
        { name: "Major Pentatonic", realName: "major pentatonic", flags: [true, false, true, false, true, false, false, true, false, true, false, false] }, // Major Pentatonic
        { name: "Minor Pentatonic", realName: "minor pentatonic", flags: [true, false, false, true, false, true, false, true, false, false, true, false] }, // Minor Pentatonic
        { name: "Whole Tone", realName: "whole tone", flags: [true, false, true, false, true, false, true, false, true, false, true, false] }, // Whole Tone
        { name: "Octatonic", realName: "octatonic", flags: [true, false, true, true, false, true, true, false, true, true, false, true] }, // Octatonic
        { name: "Hexatonic", realName: "hexatonic", flags: [true, false, false, true, true, false, false, true, true, false, false, true] }, // Hexatonic


    ])}
     static  __initStatic7() {this.keys = toNameMap([
        { name: "C", isWhiteKey: true, basePitch: 12 }, // C0 has index 12 on the MIDI scale. C7 is 96, and C9 is 120. C10 is barely in the audible range.
        { name: "C♯", isWhiteKey: false, basePitch: 13 },
        { name: "D", isWhiteKey: true, basePitch: 14 },
        { name: "D♯", isWhiteKey: false, basePitch: 15 },
        { name: "E", isWhiteKey: true, basePitch: 16 },
        { name: "F", isWhiteKey: true, basePitch: 17 },
        { name: "F♯", isWhiteKey: false, basePitch: 18 },
        { name: "G", isWhiteKey: true, basePitch: 19 },
        { name: "G♯", isWhiteKey: false, basePitch: 20 },
        { name: "A", isWhiteKey: true, basePitch: 21 },
        { name: "A♯", isWhiteKey: false, basePitch: 22 },
        { name: "B", isWhiteKey: true, basePitch: 23 },
    ])}
     static  __initStatic8() {this.blackKeyNameParents = [-1, 1, -1, 1, -1, 1, -1, -1, 1, -1, 1, -1]}
     static  __initStatic9() {this.tempoMin = 30}
     static  __initStatic10() {this.tempoMax = 320}
     static  __initStatic11() {this.echoDelayRange = 24}
     static  __initStatic12() {this.echoDelayStepTicks = 4}
     static  __initStatic13() {this.echoSustainRange = 8}
     static  __initStatic14() {this.echoShelfHz = 4000.0} // The cutoff freq of the shelf filter that is used to decay echoes.
     static  __initStatic15() {this.echoShelfGain = Math.pow(2.0, -0.5)}
     static  __initStatic16() {this.reverbShelfHz = 8000.0} // The cutoff freq of the shelf filter that is used to decay reverb.
     static  __initStatic17() {this.reverbShelfGain = Math.pow(2.0, -1.5)}
     static  __initStatic18() {this.reverbRange = 32}
     static  __initStatic19() {this.reverbDelayBufferSize = 16384} // TODO: Compute a buffer size based on sample rate.
     static  __initStatic20() {this.reverbDelayBufferMask = Config.reverbDelayBufferSize - 1} // TODO: Compute a buffer size based on sample rate.
     static  __initStatic21() {this.beatsPerBarMin = 3}
     static  __initStatic22() {this.beatsPerBarMax = 16}
     static  __initStatic23() {this.barCountMin = 1}
     static  __initStatic24() {this.barCountMax = 256}
     static  __initStatic25() {this.instrumentCountMin = 1}
     static  __initStatic26() {this.layeredInstrumentCountMax = 4}
     static  __initStatic27() {this.patternInstrumentCountMax = 10}
     static  __initStatic28() {this.partsPerBeat = 24}
     static  __initStatic29() {this.ticksPerPart = 2}
     static  __initStatic30() {this.ticksPerArpeggio = 3}
     static  __initStatic31() {this.arpeggioPatterns = [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6, 7]]}
     static  __initStatic32() {this.rhythms = toNameMap([
        { name: "÷3 (triplets)", stepsPerBeat: 3, /*ticksPerArpeggio: 4, arpeggioPatterns: [[0], [0, 0, 1, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: [/*0*/ 5, /*8*/ 12, /*16*/ 18 /*24*/] },
        { name: "÷4 (standard)", stepsPerBeat: 4, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 0, 1, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: [/*0*/ 3, /*6*/ 9, /*12*/ 17, /*18*/ 21 /*24*/] },
        { name: "÷6", stepsPerBeat: 6, /*ticksPerArpeggio: 4, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
        { name: "÷8", stepsPerBeat: 8, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
        { name: "freehand", stepsPerBeat: 24, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
    ])}

     static  __initStatic33() {this.instrumentTypeNames = ["chip", "FM", "noise", "spectrum", "drumset", "harmonics", "PWM", "Picked String", "supersaw", "custom chip", "mod"]}
     static  __initStatic34() {this.instrumentTypeHasSpecialInterval = [true, true, false, false, false, true, false, false, false, false]}
     static  __initStatic35() {this.chipBaseExpression = 0.03375} // Doubled by unison feature, but affected by expression adjustments per unison setting and wave shape.
     static  __initStatic36() {this.fmBaseExpression = 0.03}
     static  __initStatic37() {this.noiseBaseExpression = 0.19}
     static  __initStatic38() {this.spectrumBaseExpression = 0.3} // Spectrum can be in pitch or noise channels, the expression is doubled for noise.
     static  __initStatic39() {this.drumsetBaseExpression = 0.45} // Drums tend to be loud but brief!
     static  __initStatic40() {this.harmonicsBaseExpression = 0.025}
     static  __initStatic41() {this.pwmBaseExpression = 0.04725} // It's actually closer to half of this, the synthesized pulse amplitude range is only .5 to -.5, but also note that the fundamental sine partial amplitude of a square wave is 4/π times the measured square wave amplitude.
     static  __initStatic42() {this.supersawBaseExpression = 0.061425} // It's actually closer to half of this, the synthesized sawtooth amplitude range is only .5 to -.5.
     static  __initStatic43() {this.pickedStringBaseExpression = 0.025} // Same as harmonics.
     static  __initStatic44() {this.distortionBaseVolume = 0.011} // Distortion is not affected by pitchDamping, which otherwise approximately halves expression for notes around the middle of the range.
     static  __initStatic45() {this.bitcrusherBaseVolume = 0.010} // Also not affected by pitchDamping, used when bit crushing is maxed out (aka "1-bit" output).

     static  __initStatic46() {this.rawChipWaves = toNameMap([
        { name: "rounded", expression: 0.94, samples: centerWave([0.0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.2, 0.0, -0.2, -0.4, -0.5, -0.6, -0.7, -0.8, -0.85, -0.9, -0.95, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -0.95, -0.9, -0.85, -0.8, -0.7, -0.6, -0.5, -0.4, -0.2]) },
        { name: "triangle", expression: 1.0, samples: centerWave([1.0 / 15.0, 3.0 / 15.0, 5.0 / 15.0, 7.0 / 15.0, 9.0 / 15.0, 11.0 / 15.0, 13.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 13.0 / 15.0, 11.0 / 15.0, 9.0 / 15.0, 7.0 / 15.0, 5.0 / 15.0, 3.0 / 15.0, 1.0 / 15.0, -1.0 / 15.0, -3.0 / 15.0, -5.0 / 15.0, -7.0 / 15.0, -9.0 / 15.0, -11.0 / 15.0, -13.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -13.0 / 15.0, -11.0 / 15.0, -9.0 / 15.0, -7.0 / 15.0, -5.0 / 15.0, -3.0 / 15.0, -1.0 / 15.0]) },
        { name: "square", expression: 0.5, samples: centerWave([1.0, -1.0]) },
        { name: "1/4 pulse", expression: 0.5, samples: centerWave([1.0, -1.0, -1.0, -1.0]) },
        { name: "1/8 pulse", expression: 0.5, samples: centerWave([1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0]) },
        { name: "sawtooth", expression: 0.65, samples: centerWave([1.0 / 31.0, 3.0 / 31.0, 5.0 / 31.0, 7.0 / 31.0, 9.0 / 31.0, 11.0 / 31.0, 13.0 / 31.0, 15.0 / 31.0, 17.0 / 31.0, 19.0 / 31.0, 21.0 / 31.0, 23.0 / 31.0, 25.0 / 31.0, 27.0 / 31.0, 29.0 / 31.0, 31.0 / 31.0, -31.0 / 31.0, -29.0 / 31.0, -27.0 / 31.0, -25.0 / 31.0, -23.0 / 31.0, -21.0 / 31.0, -19.0 / 31.0, -17.0 / 31.0, -15.0 / 31.0, -13.0 / 31.0, -11.0 / 31.0, -9.0 / 31.0, -7.0 / 31.0, -5.0 / 31.0, -3.0 / 31.0, -1.0 / 31.0]) },
        { name: "double saw", expression: 0.5, samples: centerWave([0.0, -0.2, -0.4, -0.6, -0.8, -1.0, 1.0, -0.8, -0.6, -0.4, -0.2, 1.0, 0.8, 0.6, 0.4, 0.2]) },
        { name: "double pulse", expression: 0.4, samples: centerWave([1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0]) },
        { name: "spiky", expression: 0.4, samples: centerWave([1.0, -1.0, 1.0, -1.0, 1.0, 0.0]) },
        { name: "sine", expression: 0.88, samples: centerAndNormalizeWave([8.0, 9.0, 11.0, 12.0, 13.0, 14.0, 15.0, 15.0, 15.0, 15.0, 14.0, 14.0, 13.0, 11.0, 10.0, 9.0, 7.0, 6.0, 4.0, 3.0, 2.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 2.0, 4.0, 5.0, 6.0]) },
        { name: "flute", expression: 0.8, samples: centerAndNormalizeWave([3.0, 4.0, 6.0, 8.0, 10.0, 11.0, 13.0, 14.0, 15.0, 15.0, 14.0, 13.0, 11.0, 8.0, 5.0, 3.0]) },
        { name: "harp", expression: 0.8, samples: centerAndNormalizeWave([0.0, 3.0, 3.0, 3.0, 4.0, 5.0, 5.0, 6.0, 7.0, 8.0, 9.0, 11.0, 11.0, 13.0, 13.0, 15.0, 15.0, 14.0, 12.0, 11.0, 10.0, 9.0, 8.0, 7.0, 7.0, 5.0, 4.0, 3.0, 2.0, 1.0, 0.0, 0.0]) },
        { name: "sharp clarinet", expression: 0.38, samples: centerAndNormalizeWave([0.0, 0.0, 0.0, 1.0, 1.0, 8.0, 8.0, 9.0, 9.0, 9.0, 8.0, 8.0, 8.0, 8.0, 8.0, 9.0, 9.0, 7.0, 9.0, 9.0, 10.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]) },
        { name: "soft clarinet", expression: 0.45, samples: centerAndNormalizeWave([0.0, 1.0, 5.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 11.0, 11.0, 12.0, 13.0, 12.0, 10.0, 9.0, 7.0, 6.0, 4.0, 3.0, 3.0, 3.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]) },
        { name: "alto sax", expression: 0.3, samples: centerAndNormalizeWave([5.0, 5.0, 6.0, 4.0, 3.0, 6.0, 8.0, 7.0, 2.0, 1.0, 5.0, 6.0, 5.0, 4.0, 5.0, 7.0, 9.0, 11.0, 13.0, 14.0, 14.0, 14.0, 14.0, 13.0, 10.0, 8.0, 7.0, 7.0, 4.0, 3.0, 4.0, 2.0]) },
        { name: "bassoon", expression: 0.35, samples: centerAndNormalizeWave([9.0, 9.0, 7.0, 6.0, 5.0, 4.0, 4.0, 4.0, 4.0, 5.0, 7.0, 8.0, 9.0, 10.0, 11.0, 13.0, 13.0, 11.0, 10.0, 9.0, 7.0, 6.0, 4.0, 2.0, 1.0, 1.0, 1.0, 2.0, 2.0, 5.0, 11.0, 14.0]) },
        { name: "trumpet", expression: 0.22, samples: centerAndNormalizeWave([10.0, 11.0, 8.0, 6.0, 5.0, 5.0, 5.0, 6.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 7.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 7.0, 8.0, 9.0, 11.0, 14.0]) },
        { name: "electric guitar", expression: 0.2, samples: centerAndNormalizeWave([11.0, 12.0, 12.0, 10.0, 6.0, 6.0, 8.0, 0.0, 2.0, 4.0, 8.0, 10.0, 9.0, 10.0, 1.0, 7.0, 11.0, 3.0, 6.0, 6.0, 8.0, 13.0, 14.0, 2.0, 0.0, 12.0, 8.0, 4.0, 13.0, 11.0, 10.0, 13.0]) },
        { name: "organ", expression: 0.2, samples: centerAndNormalizeWave([11.0, 10.0, 12.0, 11.0, 14.0, 7.0, 5.0, 5.0, 12.0, 10.0, 10.0, 9.0, 12.0, 6.0, 4.0, 5.0, 13.0, 12.0, 12.0, 10.0, 12.0, 5.0, 2.0, 2.0, 8.0, 6.0, 6.0, 5.0, 8.0, 3.0, 2.0, 1.0]) },
        { name: "pan flute", expression: 0.35, samples: centerAndNormalizeWave([1.0, 4.0, 7.0, 6.0, 7.0, 9.0, 7.0, 7.0, 11.0, 12.0, 13.0, 15.0, 13.0, 11.0, 11.0, 12.0, 13.0, 10.0, 7.0, 5.0, 3.0, 6.0, 10.0, 7.0, 3.0, 3.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0]) },
        { name: "glitch", expression: 0.5, samples: centerWave([1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0]) },
    ])}
     static  __initStatic47() {this.chipWaves = rawChipToIntegrated(Config.rawChipWaves)}
    // Noise waves have too many samples to write by hand, they're generated on-demand by getDrumWave instead.
     static  __initStatic48() {this.chipNoises = toNameMap([
        { name: "retro", expression: 0.25, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "white", expression: 1.0, basePitch: 69, pitchFilterMult: 8.0, isSoft: true, samples: null },
        // The "clang" and "buzz" noises are based on similar noises in the modded beepbox! :D
        { name: "clang", expression: 0.4, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "buzz", expression: 0.3, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "hollow", expression: 1.5, basePitch: 96, pitchFilterMult: 1.0, isSoft: true, samples: null },
        { name: "shine", expression: 1.0, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "deep", expression: 1.5, basePitch: 120, pitchFilterMult: 1024.0, isSoft: true, samples: null },
        { name: "cutter", expression: 0.005, basePitch: 96, pitchFilterMult: 1024.0, isSoft: false, samples: null },
        { name: "metallic", expression: 1.0, basePitch: 96, pitchFilterMult: 1024.0, isSoft: false, samples: null },
    ])}

     static  __initStatic49() {this.filterFreqStep = 1.0 / 4.0}
     static  __initStatic50() {this.filterFreqRange = 34}
     static  __initStatic51() {this.filterFreqReferenceSetting = 28}
     static  __initStatic52() {this.filterFreqReferenceHz = 8000.0}
     static  __initStatic53() {this.filterFreqMaxHz = Config.filterFreqReferenceHz * Math.pow(2.0, Config.filterFreqStep * (Config.filterFreqRange - 1 - Config.filterFreqReferenceSetting))} // ~19khz
     static  __initStatic54() {this.filterFreqMinHz = 8.0}
     static  __initStatic55() {this.filterGainRange = 15}
     static  __initStatic56() {this.filterGainCenter = 7}
     static  __initStatic57() {this.filterGainStep = 1.0 / 2.0}
     static  __initStatic58() {this.filterMaxPoints = 8}
     static  __initStatic59() {this.filterTypeNames = ["low-pass", "high-pass", "peak"]} // See FilterType enum above.
     static  __initStatic60() {this.filterMorphCount = 10} // Number of filter shapes allowed for modulating between. Counts the 0/default position.

     static  __initStatic61() {this.filterSimpleCutRange = 11}
     static  __initStatic62() {this.filterSimplePeakRange = 8}

     static  __initStatic63() {this.fadeInRange = 10}
     static  __initStatic64() {this.fadeOutTicks = [-24, -12, -6, -3, -1, 6, 12, 24, 48, 72, 96]}
     static  __initStatic65() {this.fadeOutNeutral = 4}
     static  __initStatic66() {this.drumsetFadeOutTicks = 48}
     static  __initStatic67() {this.transitions = toNameMap([
        { name: "normal", isSeamless: false, continues: false, slides: false, slideTicks: 3, includeAdjacentPatterns: false },
        { name: "interrupt", isSeamless: true, continues: false, slides: false, slideTicks: 3, includeAdjacentPatterns: true },
        { name: "continue", isSeamless: true, continues: true, slides: false, slideTicks: 3, includeAdjacentPatterns: true },
        { name: "slide", isSeamless: true, continues: false, slides: true, slideTicks: 3, includeAdjacentPatterns: true },
        { name: "slide in pattern", isSeamless: true, continues: false, slides: true, slideTicks: 3, includeAdjacentPatterns: false },
    ])}
     static  __initStatic68() {this.vibratos = toNameMap([
        { name: "none", amplitude: 0.0, type: 0, delayTicks: 0 },
        { name: "light", amplitude: 0.15, type: 0, delayTicks: 0 },
        { name: "delayed", amplitude: 0.3, type: 0, delayTicks: 37 }, // It will fade in over the previous two ticks.
        { name: "heavy", amplitude: 0.45, type: 0, delayTicks: 0 },
        { name: "shaky", amplitude: 0.1, type: 1, delayTicks: 0 },
    ])}
     static  __initStatic69() {this.vibratoTypes = toNameMap([
        { name: "normal", periodsSeconds: [0.14], period: 0.14 },
        { name: "shaky", periodsSeconds: [0.11, 1.618 * 0.11, 3 * 0.11], period: 266.97 }, // LCM of all periods
    ])}
    // This array is more or less a linear step by 0.1 but there's a bit of range added at the start to hit specific ratios, and the end starts to grow faster.
    //                                                             0       1      2    3     4      5    6    7      8     9   10   11 12   13   14   15   16   17   18   19   20   21 22   23   24   25   26   27   28   29   30   31 32   33   34   35   36   37   38    39  40   41 42    43   44   45   46 47   48 49 50
     static  __initStatic70() {this.arpSpeedScale = [0, 0.0625, 0.125, 0.2, 0.25, 1 / 3, 0.4, 0.5, 2 / 3, 0.75, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4, 4.15, 4.3, 4.5, 4.8, 5, 5.5, 6, 8]}

     static  __initStatic71() {this.unisons = toNameMap([
        { name: "none", voices: 1, spread: 0.0, offset: 0.0, expression: 1.4, sign: 1.0 },
        { name: "shimmer", voices: 2, spread: 0.018, offset: 0.0, expression: 0.8, sign: 1.0 },
        { name: "hum", voices: 2, spread: 0.045, offset: 0.0, expression: 1.0, sign: 1.0 },
        { name: "honky tonk", voices: 2, spread: 0.09, offset: 0.0, expression: 1.0, sign: 1.0 },
        { name: "dissonant", voices: 2, spread: 0.25, offset: 0.0, expression: 0.9, sign: 1.0 },
        { name: "fifth", voices: 2, spread: 3.5, offset: 3.5, expression: 0.9, sign: 1.0 },
        { name: "octave", voices: 2, spread: 6.0, offset: 6.0, expression: 0.8, sign: 1.0 },
        { name: "bowed", voices: 2, spread: 0.02, offset: 0.0, expression: 1.0, sign: -1.0 },
        { name: "piano", voices: 2, spread: 0.01, offset: 0.0, expression: 1.0, sign: 0.7 },
        { name: "warbled", voices: 2, spread: 0.25, offset: 0.05, expression: 0.9, sign: -0.8 },
    ])}
     static  __initStatic72() {this.effectNames = ["reverb", "chorus", "panning", "distortion", "bitcrusher", "note filter", "echo", "pitch shift", "detune", "vibrato", "transition type", "chord type"]}
     static  __initStatic73() {this.effectOrder = [EffectType.panning, EffectType.transition, EffectType.chord, EffectType.pitchShift, EffectType.detune, EffectType.vibrato, EffectType.noteFilter, EffectType.distortion, EffectType.bitcrusher, EffectType.chorus, EffectType.echo, EffectType.reverb]}
     static  __initStatic74() {this.noteSizeMax = 6}
     static  __initStatic75() {this.volumeRange = 50}
    // Beepbox's old volume scale used factor -0.5 and was [0~7] had roughly value 6 = 0.125 power. This new value is chosen to have -21 be the same,
    // given that the new scale is [-25~25]. This is such that conversion between the scales is roughly equivalent by satisfying (0.5*6 = 0.1428*21)	
     static  __initStatic76() {this.volumeLogScale = 0.1428}
     static  __initStatic77() {this.panCenter = 50}
     static  __initStatic78() {this.panMax = Config.panCenter * 2}
     static  __initStatic79() {this.panDelaySecondsMax = 0.001}
     static  __initStatic80() {this.chorusRange = 8}
     static  __initStatic81() {this.chorusPeriodSeconds = 2.0}
     static  __initStatic82() {this.chorusDelayRange = 0.0034}
     static  __initStatic83() {this.chorusDelayOffsets = [[1.51, 2.10, 3.35], [1.47, 2.15, 3.25]]}
     static  __initStatic84() {this.chorusPhaseOffsets = [[0.0, 2.1, 4.2], [3.2, 5.3, 1.0]]}
     static  __initStatic85() {this.chorusMaxDelay = Config.chorusDelayRange * (1.0 + Config.chorusDelayOffsets[0].concat(Config.chorusDelayOffsets[1]).reduce((x, y) => Math.max(x, y)))}
     static  __initStatic86() {this.chords = toNameMap([
        { name: "simultaneous", customInterval: false, arpeggiates: false, strumParts: 0, singleTone: false },
        { name: "strum", customInterval: false, arpeggiates: false, strumParts: 1, singleTone: false },
        { name: "arpeggio", customInterval: false, arpeggiates: true, strumParts: 0, singleTone: true },
        { name: "custom interval", customInterval: true, arpeggiates: false, strumParts: 0, singleTone: true },
    ])}
     static  __initStatic87() {this.maxChordSize = 9}
     static  __initStatic88() {this.operatorCount = 4}
	 static  __initStatic89() {this.maxPitchOrOperatorCount = Math.max(Config.maxChordSize, Config.operatorCount)}
     static  __initStatic90() {this.algorithms = toNameMap([
        { name: "1←(2 3 4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3, 4], [], [], []] },
        { name: "1←(2 3←4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3], [], [4], []] },
        { name: "1←2←(3 4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2], [3, 4], [], []] },
        { name: "1←(2 3)←4", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3], [4], [4], []] },
        { name: "1←2←3←4", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2], [3], [4], []] },
        { name: "1←3 2←4", carrierCount: 2, associatedCarrier: [1, 2, 1, 2], modulatedBy: [[3], [4], [], []] },
        { name: "1 2←(3 4)", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[], [3, 4], [], []] },
        { name: "1 2←3←4", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[], [3], [4], []] },
        { name: "(1 2)←3←4", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[3], [3], [4], []] },
        { name: "(1 2)←(3 4)", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[3, 4], [3, 4], [], []] },
        { name: "1 2 3←4", carrierCount: 3, associatedCarrier: [1, 2, 3, 3], modulatedBy: [[], [], [4], []] },
        { name: "(1 2 3)←4", carrierCount: 3, associatedCarrier: [1, 2, 3, 3], modulatedBy: [[4], [4], [4], []] },
        { name: "1 2 3 4", carrierCount: 4, associatedCarrier: [1, 2, 3, 4], modulatedBy: [[], [], [], []] },
    ])}
     static  __initStatic91() {this.operatorCarrierInterval = [0.0, 0.04, -0.073, 0.091]}
     static  __initStatic92() {this.operatorAmplitudeMax = 15}
     static  __initStatic93() {this.operatorFrequencies = toNameMap([
        { name: "1×", mult: 1.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "~1×", mult: 1.0, hzOffset: 1.5, amplitudeSign: -1.0 },
        { name: "2×", mult: 2.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "~2×", mult: 2.0, hzOffset: -1.3, amplitudeSign: -1.0 },
        { name: "3×", mult: 3.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "4×", mult: 4.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "5×", mult: 5.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "6×", mult: 6.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "7×", mult: 7.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "8×", mult: 8.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "9×", mult: 9.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "11×", mult: 11.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "13×", mult: 13.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "16×", mult: 16.0, hzOffset: 0.0, amplitudeSign: 1.0 },
        { name: "20×", mult: 20.0, hzOffset: 0.0, amplitudeSign: 1.0 },
    ])}
     static  __initStatic94() {this.envelopes = toNameMap([
        { name: "none", type: EnvelopeType.none, speed: 0.0 },
        { name: "note size", type: EnvelopeType.noteSize, speed: 0.0 },
        { name: "punch", type: EnvelopeType.punch, speed: 0.0 },
        { name: "flare 1", type: EnvelopeType.flare, speed: 32.0 },
        { name: "flare 2", type: EnvelopeType.flare, speed: 8.0 },
        { name: "flare 3", type: EnvelopeType.flare, speed: 2.0 },
        { name: "twang 1", type: EnvelopeType.twang, speed: 32.0 },
        { name: "twang 2", type: EnvelopeType.twang, speed: 8.0 },
        { name: "twang 3", type: EnvelopeType.twang, speed: 2.0 },
        { name: "swell 1", type: EnvelopeType.swell, speed: 32.0 },
        { name: "swell 2", type: EnvelopeType.swell, speed: 8.0 },
        { name: "swell 3", type: EnvelopeType.swell, speed: 2.0 },
        { name: "tremolo1", type: EnvelopeType.tremolo, speed: 4.0 },
        { name: "tremolo2", type: EnvelopeType.tremolo, speed: 2.0 },
        { name: "tremolo3", type: EnvelopeType.tremolo, speed: 1.0 },
        { name: "tremolo4", type: EnvelopeType.tremolo2, speed: 4.0 },
        { name: "tremolo5", type: EnvelopeType.tremolo2, speed: 2.0 },
        { name: "tremolo6", type: EnvelopeType.tremolo2, speed: 1.0 },
        { name: "decay 1", type: EnvelopeType.decay, speed: 10.0 },
        { name: "decay 2", type: EnvelopeType.decay, speed: 7.0 },
        { name: "decay 3", type: EnvelopeType.decay, speed: 4.0 },
        { name: "blip 1", type: EnvelopeType.blip, speed: 6.0 },
        { name: "blip 2", type: EnvelopeType.blip, speed: 16.0 },
        { name: "blip 3", type: EnvelopeType.blip, speed: 32.0 },
    ])}
     static  __initStatic95() {this.feedbacks = toNameMap([
        { name: "1⟲", indices: [[1], [], [], []] },
        { name: "2⟲", indices: [[], [2], [], []] },
        { name: "3⟲", indices: [[], [], [3], []] },
        { name: "4⟲", indices: [[], [], [], [4]] },
        { name: "1⟲ 2⟲", indices: [[1], [2], [], []] },
        { name: "3⟲ 4⟲", indices: [[], [], [3], [4]] },
        { name: "1⟲ 2⟲ 3⟲", indices: [[1], [2], [3], []] },
        { name: "2⟲ 3⟲ 4⟲", indices: [[], [2], [3], [4]] },
        { name: "1⟲ 2⟲ 3⟲ 4⟲", indices: [[1], [2], [3], [4]] },
        { name: "1→2", indices: [[], [1], [], []] },
        { name: "1→3", indices: [[], [], [1], []] },
        { name: "1→4", indices: [[], [], [], [1]] },
        { name: "2→3", indices: [[], [], [2], []] },
        { name: "2→4", indices: [[], [], [], [2]] },
        { name: "3→4", indices: [[], [], [], [3]] },
        { name: "1→3 2→4", indices: [[], [], [1], [2]] },
        { name: "1→4 2→3", indices: [[], [], [2], [1]] },
        { name: "1→2→3→4", indices: [[], [1], [2], [3]] },
    ])}
     static  __initStatic96() {this.chipNoiseLength = 1 << 15} // 32768
     static  __initStatic97() {this.spectrumNoiseLength = 1 << 15} // 32768
     static  __initStatic98() {this.spectrumBasePitch = 24}
     static  __initStatic99() {this.spectrumControlPoints = 30}
     static  __initStatic100() {this.spectrumControlPointsPerOctave = 7}
     static  __initStatic101() {this.spectrumControlPointBits = 3}
     static  __initStatic102() {this.spectrumMax = (1 << Config.spectrumControlPointBits) - 1}
     static  __initStatic103() {this.harmonicsControlPoints = 28}
     static  __initStatic104() {this.harmonicsRendered = 64}
     static  __initStatic105() {this.harmonicsRenderedForPickedString = 1 << 8} // 256
     static  __initStatic106() {this.harmonicsControlPointBits = 3}
     static  __initStatic107() {this.harmonicsMax = (1 << Config.harmonicsControlPointBits) - 1}
     static  __initStatic108() {this.harmonicsWavelength = 1 << 11} // 2048
     static  __initStatic109() {this.pulseWidthRange = 50}
     static  __initStatic110() {this.pulseWidthStepPower = 0.5}
     static  __initStatic111() {this.supersawVoiceCount = 7}
	 static  __initStatic112() {this.supersawDynamismMax = 6}
	 static  __initStatic113() {this.supersawSpreadMax = 12}
	 static  __initStatic114() {this.supersawShapeMax = 6}
     static  __initStatic115() {this.pitchChannelCountMin = 1}
     static  __initStatic116() {this.pitchChannelCountMax = 40}
     static  __initStatic117() {this.noiseChannelCountMin = 0}
     static  __initStatic118() {this.noiseChannelCountMax = 16}
     static  __initStatic119() {this.modChannelCountMin = 0}
     static  __initStatic120() {this.modChannelCountMax = 12}
     static  __initStatic121() {this.noiseInterval = 6}
     static  __initStatic122() {this.pitchesPerOctave = 12} // TODO: Use this for converting pitch to frequency.
     static  __initStatic123() {this.drumCount = 12}
     static  __initStatic124() {this.pitchOctaves = 8}
     static  __initStatic125() {this.modCount = 6}
     static  __initStatic126() {this.maxPitch = Config.pitchOctaves * Config.pitchesPerOctave}
     static  __initStatic127() {this.maximumTonesPerChannel = Config.maxChordSize * 2}
     static  __initStatic128() {this.justIntonationSemitones = [1.0 / 2.0, 8.0 / 15.0, 9.0 / 16.0, 3.0 / 5.0, 5.0 / 8.0, 2.0 / 3.0, 32.0 / 45.0, 3.0 / 4.0, 4.0 / 5.0, 5.0 / 6.0, 8.0 / 9.0, 15.0 / 16.0, 1.0, 16.0 / 15.0, 9.0 / 8.0, 6.0 / 5.0, 5.0 / 4.0, 4.0 / 3.0, 45.0 / 32.0, 3.0 / 2.0, 8.0 / 5.0, 5.0 / 3.0, 16.0 / 9.0, 15.0 / 8.0, 2.0].map(x => Math.log2(x) * Config.pitchesPerOctave)}
     static  __initStatic129() {this.pitchShiftRange = Config.justIntonationSemitones.length}
     static  __initStatic130() {this.pitchShiftCenter = Config.pitchShiftRange >> 1}
     static  __initStatic131() {this.detuneCenter = 200}
     static  __initStatic132() {this.detuneMax = 400}
     static  __initStatic133() {this.detuneMin = 0}
     static  __initStatic134() {this.songDetuneMin = 0}
     static  __initStatic135() {this.songDetuneMax = 500}
     static  __initStatic136() {this.sineWaveLength = 1 << 8} // 256
     static  __initStatic137() {this.sineWaveMask = Config.sineWaveLength - 1}
     static  __initStatic138() {this.sineWave = generateSineWave()}

    // Picked strings have an all-pass filter with a corner frequency based on the tone fundamental frequency, in order to add a slight inharmonicity. (Which is important for distortion.)
     static  __initStatic139() {this.pickedStringDispersionCenterFreq = 6000.0} // The tone fundamental freq is pulled toward this freq for computing the all-pass corner freq.
     static  __initStatic140() {this.pickedStringDispersionFreqScale = 0.3} // The tone fundamental freq freq moves this much toward the center freq for computing the all-pass corner freq.
     static  __initStatic141() {this.pickedStringDispersionFreqMult = 4.0} // The all-pass corner freq is based on this times the adjusted tone fundamental freq.
     static  __initStatic142() {this.pickedStringShelfHz = 4000.0} // The cutoff freq of the shelf filter that is used to decay the high frequency energy in the picked string.

     static  __initStatic143() {this.distortionRange = 8}
     static  __initStatic144() {this.stringSustainRange = 15}
     static  __initStatic145() {this.stringDecayRate = 0.12}
     static  __initStatic146() {this.enableAcousticSustain = false}
	 static  __initStatic147() {this.sustainTypeNames = ["bright", "acoustic"]} // See SustainType enum above.
	
     static  __initStatic148() {this.bitcrusherFreqRange = 14}
     static  __initStatic149() {this.bitcrusherOctaveStep = 0.5}
     static  __initStatic150() {this.bitcrusherQuantizationRange = 8}

     static  __initStatic151() {this.maxEnvelopeCount = 12}
     static  __initStatic152() {this.defaultAutomationRange = 13}
     static  __initStatic153() {this.instrumentAutomationTargets = toNameMap([
        { name: "none", computeIndex: null, displayName: "none",             /*perNote: false,*/ interleave: false, isFilter: false, /*range: 0,                              */    maxCount: 1, effect: null, compatibleInstruments: null },
        { name: "noteVolume", computeIndex: EnvelopeComputeIndex.noteVolume, displayName: "note volume",      /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.volumeRange,             */    maxCount: 1, effect: null, compatibleInstruments: null },
        { name: "pulseWidth", computeIndex: EnvelopeComputeIndex.pulseWidth, displayName: "pulse width",      /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.pulseWidthRange,         */    maxCount: 1, effect: null, compatibleInstruments: [InstrumentType.pwm, InstrumentType.supersaw] },
        { name: "stringSustain", computeIndex: EnvelopeComputeIndex.stringSustain, displayName: "sustain",          /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.stringSustainRange,      */    maxCount: 1, effect: null, compatibleInstruments: [InstrumentType.pickedString] },
        { name: "unison", computeIndex: EnvelopeComputeIndex.unison, displayName: "unison",           /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.defaultAutomationRange,  */    maxCount: 1, effect: null, compatibleInstruments: [InstrumentType.chip, InstrumentType.harmonics, InstrumentType.pickedString] },
        { name: "operatorFrequency", computeIndex: EnvelopeComputeIndex.operatorFrequency0, displayName: "fm# freq",         /*perNote:  true,*/ interleave: true, isFilter: false, /*range: Config.defaultAutomationRange,  */    maxCount: Config.operatorCount, effect: null, compatibleInstruments: [InstrumentType.fm] },
        { name: "operatorAmplitude", computeIndex: EnvelopeComputeIndex.operatorAmplitude0, displayName: "fm# volume",       /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.operatorAmplitudeMax + 1,*/    maxCount: Config.operatorCount, effect: null, compatibleInstruments: [InstrumentType.fm] },
        { name: "feedbackAmplitude", computeIndex: EnvelopeComputeIndex.feedbackAmplitude, displayName: "fm feedback",      /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.operatorAmplitudeMax + 1,*/    maxCount: 1, effect: null, compatibleInstruments: [InstrumentType.fm] },
        { name: "pitchShift", computeIndex: EnvelopeComputeIndex.pitchShift, displayName: "pitch shift",      /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.pitchShiftRange,         */    maxCount: 1, effect: EffectType.pitchShift, compatibleInstruments: null },
        { name: "detune", computeIndex: EnvelopeComputeIndex.detune, displayName: "detune",           /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.detuneMax + 1,           */    maxCount: 1, effect: EffectType.detune, compatibleInstruments: null },
        { name: "vibratoDepth", computeIndex: EnvelopeComputeIndex.vibratoDepth, displayName: "vibrato range",    /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.defaultAutomationRange,  */    maxCount: 1, effect: EffectType.vibrato, compatibleInstruments: null },
        { name: "noteFilterAllFreqs", computeIndex: EnvelopeComputeIndex.noteFilterAllFreqs, displayName: "n. filter freqs",  /*perNote:  true,*/ interleave: false, isFilter: true, /*range: null,                           */    maxCount: 1, effect: EffectType.noteFilter, compatibleInstruments: null },
        {name: "noteFilterFreq",         computeIndex:       EnvelopeComputeIndex.noteFilterFreq0,        displayName: "n. filter # freq", /*perNote:  true,*/ interleave: false/*true*/, isFilter:  true, /*range: Config.filterFreqRange, */    maxCount: Config.filterMaxPoints, effect: EffectType.noteFilter, compatibleInstruments: null},
		// Controlling filter gain is less obvious and intuitive than controlling filter freq, so to avoid confusion I've disabled it for envelopes.
		{name: "noteFilterGain",         computeIndex:                           null,                    displayName: "n. filter # vol",  /*perNote:  true,*/ interleave: false, isFilter:  true, /*range: Config.filterGainRange,         */    maxCount: Config.filterMaxPoints, effect: EffectType.noteFilter, compatibleInstruments: null},
		{name: "supersawDynamism",       computeIndex:       EnvelopeComputeIndex.supersawDynamism,       displayName: "dynamism",         /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.supersawDynamismMax + 1, */    maxCount: 1,    effect: null,                    compatibleInstruments: [InstrumentType.supersaw]},
		{name: "supersawSpread",         computeIndex:       EnvelopeComputeIndex.supersawSpread,         displayName: "spread",           /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.supersawSpreadMax + 1,   */    maxCount: 1,    effect: null,                    compatibleInstruments: [InstrumentType.supersaw]},
		{name: "supersawShape",          computeIndex:       EnvelopeComputeIndex.supersawShape,          displayName: "saw↔pulse",        /*perNote:  true,*/ interleave: false, isFilter: false, /*range: Config.supersawShapeMax + 1,    */    maxCount: 1,    effect: null,                    compatibleInstruments: [InstrumentType.supersaw]},
		/*
        {name: "distortion",             computeIndex: InstrumentAutomationIndex.distortion,             displayName: "distortion",       perNote: false, interleave: false, isFilter: false, range: Config.distortionRange,             maxCount: 1,    effect: EffectType.distortion,   compatibleInstruments: null},
        {name: "bitcrusherQuantization", computeIndex: InstrumentAutomationIndex.bitcrusherQuantization, displayName: "bit crush",        perNote: false, interleave: false, isFilter: false, range: Config.bitcrusherQuantizationRange, maxCount: 1,    effect: EffectType.bitcrusher,   compatibleInstruments: null},
        {name: "bitcrusherFrequency",    computeIndex: InstrumentAutomationIndex.bitcrusherFrequency,    displayName: "freq crush",       perNote: false, interleave: false, isFilter: false, range: Config.bitcrusherFreqRange,         maxCount: 1,    effect: EffectType.bitcrusher,   compatibleInstruments: null},
        {name: "eqFilterAllFreqs",       computeIndex: InstrumentAutomationIndex.eqFilterAllFreqs,       displayName: "eq filter freqs",  perNote: false, interleave: false, isFilter:  true, range: null,                               maxCount: 1,    effect: null,                    compatibleInstruments: null},
        {name: "eqFilterFreq",           computeIndex: InstrumentAutomationIndex.eqFilterFreq0,          displayName: "eq filter # freq", perNote: false, interleave:  true, isFilter:  true, range: Config.filterFreqRange,             maxCount: Config.filterMaxPoints, effect: null,  compatibleInstruments: null},
        {name: "eqFilterGain",           computeIndex: InstrumentAutomationIndex.eqFilterGain0,          displayName: "eq filter # vol",  perNote: false, interleave: false, isFilter:  true, range: Config.filterGainRange,             maxCount: Config.filterMaxPoints, effect: null,  compatibleInstruments: null},
        {name: "panning",                computeIndex: InstrumentAutomationIndex.panning,                displayName: "panning",          perNote: false, interleave: false, isFilter: false, range: Config.panMax + 1,                  maxCount: 1,    effect: EffectType.panning,      compatibleInstruments: null},
        {name: "chorus",                 computeIndex: InstrumentAutomationIndex.chorus,                 displayName: "chorus",           perNote: false, interleave: false, isFilter: false, range: Config.chorusRange,                 maxCount: 1,    effect: EffectType.chorus,       compatibleInstruments: null},
        {name: "echoSustain",            computeIndex: InstrumentAutomationIndex.echoSustain,            displayName: "echo",             perNote: false, interleave: false, isFilter: false, range: Config.echoSustainRange,            maxCount: 1,    effect: EffectType.echo,         compatibleInstruments: null},
        {name: "echoDelay",              computeIndex: InstrumentAutomationIndex.echoDelay,              displayName: "echo delay",       perNote: false, interleave: false, isFilter: false, range: Config.echoDelayRange,              maxCount: 1,    effect: EffectType.echo,         compatibleInstruments: null}, // wait until after we're computing a tick's settings for multiple run lengths.
        {name: "reverb",                 computeIndex: InstrumentAutomationIndex.reverb,                 displayName: "reverb",           perNote: false, interleave: false, isFilter: false, range: Config.reverbRange,                 maxCount: 1,    effect: EffectType.reverb,       compatibleInstruments: null},
        {name: "mixVolume",              computeIndex: InstrumentAutomationIndex.mixVolume,              displayName: "mix volume",       perNote: false, interleave: false, isFilter: false, range: Config.volumeRange,                 maxCount: 1,    effect: null,                    compatibleInstruments: null},
        {name: "envelope#",              computeIndex: null,                                             displayName: "envelope",         perNote: false, interleave: false, isFilter: false, range: Config.defaultAutomationRange,      maxCount: Config.maxEnvelopeCount, effect: null, compatibleInstruments: null}, // maxCount special case for envelopes to be allowed to target earlier ones.
        */
    ])}
     static  __initStatic154() {this.operatorWaves = toNameMap([
        { name: "sine", samples: Config.sineWave },
        { name: "triangle", samples: generateTriWave() },
        { name: "sawtooth", samples: generateSawWave() },
        { name: "pulse width", samples: generateSquareWave() },
        { name: "ramp", samples: generateSawWave(true) },
        { name: "trapezoid", samples: generateTrapezoidWave(2) },
    ])}
     static  __initStatic155() {this.pwmOperatorWaves = toNameMap([
        { name: "1%", samples: generateSquareWave(0.01) },
        { name: "5%", samples: generateSquareWave(0.05) },
        { name: "12.5%", samples: generateSquareWave(0.125) },
        { name: "25%", samples: generateSquareWave(0.25) },
        { name: "33%", samples: generateSquareWave(1 / 3) },
        { name: "50%", samples: generateSquareWave(0.5) },
        { name: "66%", samples: generateSquareWave(2 / 3) },
        { name: "75%", samples: generateSquareWave(0.75) },
        { name: "87.5%", samples: generateSquareWave(0.875) },
        { name: "95%", samples: generateSquareWave(0.95) },
        { name: "99%", samples: generateSquareWave(0.99) },
    ])}


    // Height of the small editor column for inserting/deleting rows, in pixels.
     static  __initStatic156() {this.barEditorHeight = 10}

    // Careful about changing index ordering for this. Index is stored in URL/JSON etc.
     static  __initStatic157() {this.modulators = toNameMap([
        { name: "none", pianoName: "None", maxRawVol: 6, newNoteVol: 6, forSong: true, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "No Mod Setting", promptDesc: [ "No setting has been chosen yet, so this modulator will have no effect. Try choosing a setting with the dropdown, then click this '?' again for more info.", "[$LO - $HI]" ] },
        { name: "song volume", pianoName: "Volume", maxRawVol: 100, newNoteVol: 100, forSong: true, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Song Volume", promptDesc: [ "This setting affects the overall volume of the song, just like the main volume slider.", "At $HI, the volume will be unchanged from default, and it will get gradually quieter down to $LO.", "[MULTIPLICATIVE] [$LO - $HI] [%]" ] },
        { name: "tempo", pianoName: "Tempo", maxRawVol: Config.tempoMax - Config.tempoMin, newNoteVol: Math.ceil((Config.tempoMax - Config.tempoMin) / 2), forSong: true, convertRealFactor: Config.tempoMin, associatedEffect: EffectType.length,
            promptName: "Song Tempo", promptDesc: [ "This setting controls the speed your song plays at, just like the tempo slider.", "When you first make a note for this setting, it will default to your current tempo. Raising it speeds up the song, up to $HI BPM, and lowering it slows it down, to a minimum of $LO BPM.", "Note that you can make a 'swing' effect by rapidly changing between two tempo values.", "[OVERWRITING] [$LO - $HI] [BPM]" ] },
        { name: "song reverb", pianoName: "Reverb", maxRawVol: Config.reverbRange * 2, newNoteVol: Config.reverbRange, forSong: true, convertRealFactor: -Config.reverbRange, associatedEffect: EffectType.length,
            promptName: "Song Reverb", promptDesc: [ "This setting affects the overall reverb of your song. It works by multiplying existing reverb for instruments, so those with no reverb set will be unaffected.", "At $MID, all instruments' reverb will be unchanged from default. This increases up to double the reverb value at $HI, or down to no reverb at $LO.", "[MULTIPLICATIVE] [$LO - $HI]" ] },
        { name: "next bar", pianoName: "Next Bar", maxRawVol: 1, newNoteVol: 1, forSong: true, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Go To Next Bar", promptDesc: [ "This setting functions a little different from most. Wherever a note is placed, the song will jump immediately to the next bar when it is encountered.", "This jump happens at the very start of the note, so the length of a next-bar note is irrelevant. Also, the note can be value 0 or 1, but the value is also irrelevant - wherever you place a note, the song will jump.", "You can make mixed-meter songs or intro sections by cutting off unneeded beats with a next-bar modulator.", "[$LO - $HI]" ] },
        { name: "note volume", pianoName: "Note Vol.", maxRawVol: Config.volumeRange, newNoteVol: Math.ceil(Config.volumeRange / 2), forSong: false, convertRealFactor: Math.ceil(-Config.volumeRange / 2.0), associatedEffect: EffectType.length,
            promptName: "Note Volume", promptDesc: [ "This setting affects the volume of your instrument as if its note size had been scaled.", "At $MID, an instrument's volume will be unchanged from default. This means you can still use the volume sliders to mix the base volume of instruments. The volume gradually increases up to $HI, or decreases down to mute at $LO.", "This setting was the default for volume modulation in BoneBox for a long time. Due to some new effects like distortion and bitcrush, note volume doesn't always allow fine volume control. Also, this modulator affects the value of FM modulator waves instead of just carriers. This can distort the sound which may be useful, but also may be undesirable. In those cases, use the 'mix volume' modulator instead, which will always just scale the volume with no added effects.", "For display purposes, this mod will show up on the instrument volume slider, as long as there is not also an active 'mix volume' modulator anyhow. However, as mentioned, it works more like changing note volume.", "[MULTIPLICATIVE] [$LO - $HI]" ] },
        { name: "pan", pianoName: "Pan", maxRawVol: Config.panMax, newNoteVol: Math.ceil(Config.panMax / 2), forSong: false, convertRealFactor: 0, associatedEffect: EffectType.panning,
            promptName: "Instrument Panning", promptDesc: [ "This setting controls the panning of your instrument, just like the panning slider.", "At $LO, your instrument will sound like it is coming fully from the left-ear side. At $MID it will be right in the middle, and at $HI, it will sound like it's on the right.", "[OVERWRITING] [$LO - $HI] [L-R]" ] },
        { name: "reverb", pianoName: "Reverb", maxRawVol: Config.reverbRange, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.reverb,
            promptName: "Instrument Reverb", promptDesc: [ "This setting controls the reverb of your insturment, just like the reverb slider.", "At $LO, your instrument will have no reverb. At $HI, it will be at maximum.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "distortion", pianoName: "Distortion", maxRawVol: Config.distortionRange-1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.distortion,
            promptName: "Instrument Distortion", promptDesc: [ "This setting controls the amount of distortion for your instrument, just like the distortion slider.", "At $LO, your instrument will have no distortion. At $HI, it will be at maximum.", "[OVERWRITING] [$LO - $HI]" ] },
        { name: "fm slider 1", pianoName: "FM 1", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Slider 1", promptDesc: [ "This setting affects the strength of the first FM slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]"] },
        { name: "fm slider 2", pianoName: "FM 2", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Slider 2", promptDesc: ["This setting affects the strength of the second FM slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]" ] },
        { name: "fm slider 3", pianoName: "FM 3", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Slider 3", promptDesc: ["This setting affects the strength of the third FM slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]" ] },
        { name: "fm slider 4", pianoName: "FM 4", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Slider 4", promptDesc: ["This setting affects the strength of the fourth FM slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]"] },
        { name: "fm feedback", pianoName: "FM Feedback", maxRawVol: 15, newNoteVol: 15, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "FM Feedback", promptDesc: ["This setting affects the strength of the FM feedback slider, just like the corresponding slider on your instrument.", "It works in a multiplicative way, so at $HI your slider will sound the same is its default value, and at $LO it will sound like it has been moved all the way to the left.", "For the full range of control with this mod, move your underlying slider all the way to the right.", "[MULTIPLICATIVE] [$LO - $HI] [%]"] },
        { name: "pulse width", pianoName: "Pulse Width", maxRawVol: Config.pulseWidthRange, newNoteVol: Config.pulseWidthRange, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Pulse Width", promptDesc: ["This setting controls the width of this instrument's pulse wave, just like the pulse width slider.", "At $HI, your instrument will sound like a pure square wave (on 50% of the time). It will gradually sound narrower down to $LO, where it will be inaudible (as it is on 0% of the time).", "Changing pulse width randomly between a few values is a common strategy in chiptune music to lend some personality to a lead instrument.", "[OVERWRITING] [$LO - $HI] [%Duty]"] },
        { name: "detune", pianoName: "Detune", maxRawVol: Config.detuneMax - Config.detuneMin, newNoteVol: Config.detuneCenter, forSong: false, convertRealFactor: -Config.detuneCenter, associatedEffect: EffectType.detune,
            promptName: "Instrument Detune", promptDesc: ["This setting controls the detune for this instrument, just like the detune slider.", "At $MID, your instrument will have no detune applied. Each tick corresponds to one cent, or one-hundredth of a pitch. Thus, each change of 100 ticks corresponds to one half-step of detune, up to two half-steps up at $HI, or two half-steps down at $LO.", "[OVERWRITING] [$LO - $HI] [cents]"] },
        { name: "vibrato depth", pianoName: "Vibrato Depth", maxRawVol: 50, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.vibrato,
            promptName: "Vibrato Depth", promptDesc: ["This setting controls the amount that your pitch moves up and down by during vibrato, just like the vibrato depth slider.", "At $LO, your instrument will have no vibrato depth so its vibrato would be inaudible. This increases up to $HI, where an extreme pitch change will be noticeable.", "[OVERWRITING] [$LO - $HI] [pitch ÷25]"] },
        { name: "song detune", pianoName: "Detune", maxRawVol: Config.songDetuneMax - Config.songDetuneMin, newNoteVol: Math.ceil((Config.songDetuneMax - Config.songDetuneMin) / 2), forSong: true, convertRealFactor: -250, associatedEffect: EffectType.length,
            promptName: "Song Detune", promptDesc: ["This setting controls the overall detune of the entire song. There is no associated slider.", "At $MID, your song will have no extra detune applied and sound unchanged from default. Each tick corresponds to four cents, or four hundredths of a pitch. Thus, each change of 25 ticks corresponds to one half-step of detune, up to 10 half-steps up at $HI, or 10 half-steps down at $LO.", "[MULTIPLICATIVE] [$LO - $HI] [cents x4]"] },
        { name: "vibrato speed", pianoName: "Vibrato Speed", maxRawVol: 30, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.vibrato,
            promptName: "Vibrato Speed", promptDesc: ["This setting controls the speed your instrument will vibrato at, just like the slider.", "A setting of $LO means there will be no oscillation, and vibrato will be disabled. Higher settings will increase the speed, up to a dramatic trill at the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "vibrato delay", pianoName: "Vibrato Delay", maxRawVol: 50, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.vibrato,
            promptName: "Vibrato Delay", promptDesc: ["This setting controls the amount of time vibrato will be held off for before triggering for every new note, just like the slider.", "A setting of $LO means there will be no delay. A setting of 24 corresponds to one full beat of delay. As a sole exception to this scale, setting delay to $HI will completely disable vibrato (as if it had infinite delay).", "[OVERWRITING] [$LO - $HI] [beats ÷24]"] },
        { name: "arp speed", pianoName: "Arp Speed", maxRawVol: 50, newNoteVol: 12, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.chord,
            promptName: "Arpeggio Speed", promptDesc: ["This setting controls the speed at which your instrument's chords arpeggiate, just like the arpeggio speed slider.", "Each setting corresponds to a different speed, from the slowest to the fastest. The speeds are listed below.",
                "[0-4]: x0, x1/16, x⅛, x⅕, x¼,", "[5-9]: x⅓, x⅖, x½, x⅔, x¾,", "[10-14]: x⅘, x0.9, x1, x1.1, x1.2,", "[15-19]: x1.3, x1.4, x1.5, x1.6, x1.7,", "[20-24]: x1.8, x1.9, x2, x2.1, x2.2,", "[25-29]: x2.3, x2.4, x2.5, x2.6, x2.7,", "[30-34]: x2.8, x2.9, x3, x3.1, x3.2,", "[35-39]: x3.3, x3.4, x3.5, x3.6, x3.7," ,"[40-44]: x3.8, x3.9, x4, x4.15, x4.3,", "[45-50]: x4.5, x4.8, x5, x5.5, x6, x8", "[OVERWRITING] [$LO - $HI]"] },
        { name: "pan delay", pianoName: "Pan Delay", maxRawVol: 20, newNoteVol: 10, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.panning,
            promptName: "Panning Delay", promptDesc: ["This setting controls the delay applied to panning for your instrument, just like the pan delay slider.", "With more delay, the panning effect will generally be more pronounced. $MID is the default value, whereas $LO will remove any delay at all. No delay can be desirable for chiptune songs.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "reset arp", pianoName: "Reset Arp", maxRawVol: 1, newNoteVol: 1, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.chord,
            promptName: "Reset Arpeggio", promptDesc: ["This setting functions a little different from most. Wherever a note is placed, the arpeggio of this instrument will reset at the very start of that note. This is most noticeable with lower arpeggio speeds. The lengths and values of notes for this setting don't matter, just the note start times.", "This mod can be used to sync up your apreggios so that they always sound the same, even if you are using an odd-ratio arpeggio speed or modulating arpeggio speed.", "[$LO - $HI]"] },
        { name: "eq filter", pianoName: "EQFlt", maxRawVol: 10, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "EQ Filter", promptDesc: ["This setting controls a few separate things for your instrument's EQ filter.", "When the option 'morph' is selected, your modulator values will indicate a sub-filter index of your EQ filter to 'morph' to over time. For example, a change from 0 to 1 means your main filter (default) will morph to sub-filter 1 over the specified duration. You can shape the main filter and sub-filters in the large filter editor ('+' button). If your two filters' number, type, and order of filter dots all match up, the morph will happen smoothly and you'll be able to hear them changing. If they do not match up, the filters will simply jump between each other.", "Note that filters will morph based on endpoints in the pattern editor. So, if you specify a morph from sub-filter 1 to 4 but do not specifically drag in new endpoints for 2 and 3, it will morph directly between 1 and 4 without going through the others.", "If you target Dot X or Dot Y, you can finely tune the coordinates of a single dot for your filter. The number of available dots to choose is dependent on your main filter's dot count.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "note filter", pianoName: "N.Flt", maxRawVol: 10, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.noteFilter,
            promptName: "Note Filter", promptDesc: ["This setting controls a few separate things for your instrument's note filter.", "When the option 'morph' is selected, your modulator values will indicate a sub-filter index of your note filter to 'morph' to over time. For example, a change from 0 to 1 means your main filter (default) will morph to sub-filter 1 over the specified duration. You can shape the main filter and sub-filters in the large filter editor ('+' button). If your two filters' number, type, and order of filter dots all match up, the morph will happen smoothly and you'll be able to hear them changing. If they do not match up, the filters will simply jump between each other.", "Note that filters will morph based on endpoints in the pattern editor. So, if you specify a morph from sub-filter 1 to 4 but do not specifically drag in new endpoints for 2 and 3, it will morph directly between 1 and 4 without going through the others.", "If you target Dot X or Dot Y, you can finely tune the coordinates of a single dot for your filter. The number of available dots to choose is dependent on your main filter's dot count.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "bit crush", pianoName: "Bitcrush", maxRawVol: Config.bitcrusherQuantizationRange-1, newNoteVol: Math.round(Config.bitcrusherQuantizationRange / 2), forSong: false, convertRealFactor: 0, associatedEffect: EffectType.bitcrusher,
            promptName: "Instrument Bit Crush", promptDesc: ["This setting controls the bit crush of your instrument, just like the bit crush slider.", "At a value of $LO, no bit crush will be applied. This increases and the bit crush effect gets more noticeable up to the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "freq crush", pianoName: "Freq Crush", maxRawVol: Config.bitcrusherFreqRange-1, newNoteVol: Math.round(Config.bitcrusherFreqRange / 2), forSong: false, convertRealFactor: 0, associatedEffect: EffectType.bitcrusher,
            promptName: "Instrument Frequency Crush", promptDesc: ["This setting controls the frequency crush of your instrument, just like the freq crush slider.", "At a value of $LO, no frequency crush will be applied. This increases and the frequency crush effect gets more noticeable up to the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "echo", pianoName: "Echo", maxRawVol: Config.echoSustainRange-1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.echo,
            promptName: "Instrument Echo Sustain", promptDesc: ["This setting controls the echo sustain (echo loudness) of your instrument, just like the echo slider.", "At $LO, your instrument will have no echo sustain and echo will not be audible. Echo sustain increases and the echo effect gets more noticeable up to the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "echo delay", pianoName: "Echo Delay", maxRawVol: Config.echoDelayRange, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Instrument Echo Delay", promptDesc: ["This setting controls the echo delay of your instrument, just like the echo delay slider.", "At $LO, your instrument will have very little echo delay, and this increases up to 2 beats of delay at $HI.", "[OVERWRITING] [$LO - $HI] [~beats ÷12]" ]
        }, // Disabled via associatedEffect and manually in list build in SongEditor, enable and set back to echo after fixing bugginess!
        { name: "chorus", pianoName: "Chorus", maxRawVol: Config.chorusRange-1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.chorus,
            promptName: "Instrument Chorus", promptDesc: ["This setting controls the chorus strength of your instrument, just like the chorus slider.", "At $LO, the chorus effect will be disabled. The strength of the chorus effect increases up to the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "eq filt cut", pianoName: "EQFlt Cut", maxRawVol: Config.filterSimpleCutRange - 1, newNoteVol: Config.filterSimpleCutRange - 1, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "EQ Filter Cutoff Frequency", promptDesc: ["This setting controls the filter cut position of your instrument, just like the filter cut slider.", "This setting is roughly analagous to the horizontal position of a single low-pass dot on the advanced filter editor. At lower values, a wider range of frequencies is cut off.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "eq filt peak", pianoName: "EQFlt Peak", maxRawVol: Config.filterSimplePeakRange - 1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "EQ Filter Peak Gain", promptDesc: ["This setting controls the filter peak position of your instrument, just like the filter peak slider.", "This setting is roughly analagous to the vertical position of a single low-pass dot on the advanced filter editor. At lower values, the cutoff frequency will not be emphasized, and at higher values you will hear emphasis on the cutoff frequency.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "note filt cut", pianoName: "N.Flt Cut", maxRawVol: Config.filterSimpleCutRange - 1, newNoteVol: Config.filterSimpleCutRange - 1, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.noteFilter,
            promptName: "Note Filter Cutoff Frequency", promptDesc: ["This setting controls the filter cut position of your instrument, just like the filter cut slider.", "This setting is roughly analagous to the horizontal position of a single low-pass dot on the advanced filter editor. At lower values, a wider range of frequencies is cut off.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "note filt peak", pianoName: "N.Flt Peak", maxRawVol: Config.filterSimplePeakRange - 1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.noteFilter,
            promptName: "Note Filter Peak Gain", promptDesc: ["This setting controls the filter peak position of your instrument, just like the filter peak slider.", "This setting is roughly analagous to the vertical position of a single low-pass dot on the advanced filter editor. At lower values, the cutoff frequency will not be emphasized, and at higher values you will hear emphasis on the cutoff frequency.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "pitch shift", pianoName: "Pitch Shift", maxRawVol: Config.pitchShiftRange - 1, newNoteVol: Config.pitchShiftCenter, forSong: false, convertRealFactor: -Config.pitchShiftCenter, associatedEffect: EffectType.pitchShift,
            promptName: "Pitch Shift", promptDesc: ["This setting controls the pitch offset of your instrument, just like the pitch shift slider.", "At $MID your instrument will have no pitch shift. This increases as you decrease toward $LO pitches (half-steps) at the low end, or increases towards +$HI pitches at the high end.", "[OVERWRITING] [$LO - $HI] [pitch]"] },
        { name: "sustain", pianoName: "Sustain", maxRawVol: Config.stringSustainRange - 1, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Picked String Sustain", promptDesc: ["This setting controls the sustain of your picked string instrument, just like the sustain slider.", "At $LO, your instrument will have minimum sustain and sound 'plucky'. This increases to a more held sound as your modulator approaches the maximum, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "mix volume", pianoName: "Mix Vol.", maxRawVol: Config.volumeRange, newNoteVol: Math.ceil(Config.volumeRange / 2), forSong: false, convertRealFactor: Math.ceil(-Config.volumeRange / 2.0), associatedEffect: EffectType.length,
            promptName: "Mix Volume", promptDesc: ["This setting affects the volume of your instrument as if its volume slider had been moved.", "At $MID, an instrument's volume will be unchanged from default. This means you can still use the volume sliders to mix the base volume of instruments, since this setting and the default value work multiplicatively. The volume gradually increases up to $HI, or decreases down to mute at $LO.", "Unlike the 'note volume' setting, mix volume is very straightforward and simply affects the resultant instrument volume after all effects are applied.", "[MULTIPLICATIVE] [$LO - $HI]"] },
        { name: "envelope speed", pianoName: "EnvelopeSpd", maxRawVol: 50, newNoteVol: 12, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Envelope Speed", promptDesc: ["This setting controls how fast all of the envelopes for the instrument play.", "At $LO, your instrument's envelopes will be frozen, and at values near there they will change very slowly. At 12, the envelopes will work as usual, performing at normal speed. This increases up to $HI, where the envelopes will change very quickly. The speeds are given below:",
                "[0-4]: x0, x1/16, x⅛, x⅕, x¼,", "[5-9]: x⅓, x⅖, x½, x⅔, x¾,", "[10-14]: x⅘, x0.9, x1, x1.1, x1.2,", "[15-19]: x1.3, x1.4, x1.5, x1.6, x1.7,", "[20-24]: x1.8, x1.9, x2, x2.1, x2.2,", "[25-29]: x2.3, x2.4, x2.5, x2.6, x2.7,", "[30-34]: x2.8, x2.9, x3, x3.1, x3.2,", "[35-39]: x3.3, x3.4, x3.5, x3.6, x3.7," ,"[40-44]: x3.8, x3.9, x4, x4.15, x4.3,", "[45-50]: x4.5, x4.8, x5, x5.5, x6, x8", "[OVERWRITING] [$LO - $HI]"] },
        { name: "dynamism", pianoName: "Dynamism", maxRawVol: Config.supersawDynamismMax, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Supersaw Dynamism", promptDesc: ["This setting controls the supersaw dynamism of your instrument, just like the dynamism slider.", "At $LO, your instrument will have only a single pulse contributing. Increasing this will raise the contribution of other waves which is similar to a chorus effect. The effect gets more noticeable up to the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "spread", pianoName: "Spread", maxRawVol: Config.supersawSpreadMax, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Supersaw Spread", promptDesc: ["This setting controls the supersaw spread of your instrument, just like the spread slider.", "At $LO, all the pulses in your supersaw will be at the same frequency. Increasing this value raises the frequency spread of the contributing waves, up to a dissonant spread at the max value, $HI.", "[OVERWRITING] [$LO - $HI]"] },
        { name: "saw shape", pianoName: "Saw Shape", maxRawVol: Config.supersawShapeMax, newNoteVol: 0, forSong: false, convertRealFactor: 0, associatedEffect: EffectType.length,
            promptName: "Supersaw Shape", promptDesc: ["This setting controls the supersaw shape of your instrument, just like the Saw↔Pulse slider.", "As the slider's name implies, this effect will give you a sawtooth wave at $LO, and a full pulse width wave at $HI. Values in between will be a blend of the two.", "[OVERWRITING] [$LO - $HI] [%]"] },
    ])}
} Config.__initStatic(); Config.__initStatic2(); Config.__initStatic3(); Config.__initStatic4(); Config.__initStatic5(); Config.__initStatic6(); Config.__initStatic7(); Config.__initStatic8(); Config.__initStatic9(); Config.__initStatic10(); Config.__initStatic11(); Config.__initStatic12(); Config.__initStatic13(); Config.__initStatic14(); Config.__initStatic15(); Config.__initStatic16(); Config.__initStatic17(); Config.__initStatic18(); Config.__initStatic19(); Config.__initStatic20(); Config.__initStatic21(); Config.__initStatic22(); Config.__initStatic23(); Config.__initStatic24(); Config.__initStatic25(); Config.__initStatic26(); Config.__initStatic27(); Config.__initStatic28(); Config.__initStatic29(); Config.__initStatic30(); Config.__initStatic31(); Config.__initStatic32(); Config.__initStatic33(); Config.__initStatic34(); Config.__initStatic35(); Config.__initStatic36(); Config.__initStatic37(); Config.__initStatic38(); Config.__initStatic39(); Config.__initStatic40(); Config.__initStatic41(); Config.__initStatic42(); Config.__initStatic43(); Config.__initStatic44(); Config.__initStatic45(); Config.__initStatic46(); Config.__initStatic47(); Config.__initStatic48(); Config.__initStatic49(); Config.__initStatic50(); Config.__initStatic51(); Config.__initStatic52(); Config.__initStatic53(); Config.__initStatic54(); Config.__initStatic55(); Config.__initStatic56(); Config.__initStatic57(); Config.__initStatic58(); Config.__initStatic59(); Config.__initStatic60(); Config.__initStatic61(); Config.__initStatic62(); Config.__initStatic63(); Config.__initStatic64(); Config.__initStatic65(); Config.__initStatic66(); Config.__initStatic67(); Config.__initStatic68(); Config.__initStatic69(); Config.__initStatic70(); Config.__initStatic71(); Config.__initStatic72(); Config.__initStatic73(); Config.__initStatic74(); Config.__initStatic75(); Config.__initStatic76(); Config.__initStatic77(); Config.__initStatic78(); Config.__initStatic79(); Config.__initStatic80(); Config.__initStatic81(); Config.__initStatic82(); Config.__initStatic83(); Config.__initStatic84(); Config.__initStatic85(); Config.__initStatic86(); Config.__initStatic87(); Config.__initStatic88(); Config.__initStatic89(); Config.__initStatic90(); Config.__initStatic91(); Config.__initStatic92(); Config.__initStatic93(); Config.__initStatic94(); Config.__initStatic95(); Config.__initStatic96(); Config.__initStatic97(); Config.__initStatic98(); Config.__initStatic99(); Config.__initStatic100(); Config.__initStatic101(); Config.__initStatic102(); Config.__initStatic103(); Config.__initStatic104(); Config.__initStatic105(); Config.__initStatic106(); Config.__initStatic107(); Config.__initStatic108(); Config.__initStatic109(); Config.__initStatic110(); Config.__initStatic111(); Config.__initStatic112(); Config.__initStatic113(); Config.__initStatic114(); Config.__initStatic115(); Config.__initStatic116(); Config.__initStatic117(); Config.__initStatic118(); Config.__initStatic119(); Config.__initStatic120(); Config.__initStatic121(); Config.__initStatic122(); Config.__initStatic123(); Config.__initStatic124(); Config.__initStatic125(); Config.__initStatic126(); Config.__initStatic127(); Config.__initStatic128(); Config.__initStatic129(); Config.__initStatic130(); Config.__initStatic131(); Config.__initStatic132(); Config.__initStatic133(); Config.__initStatic134(); Config.__initStatic135(); Config.__initStatic136(); Config.__initStatic137(); Config.__initStatic138(); Config.__initStatic139(); Config.__initStatic140(); Config.__initStatic141(); Config.__initStatic142(); Config.__initStatic143(); Config.__initStatic144(); Config.__initStatic145(); Config.__initStatic146(); Config.__initStatic147(); Config.__initStatic148(); Config.__initStatic149(); Config.__initStatic150(); Config.__initStatic151(); Config.__initStatic152(); Config.__initStatic153(); Config.__initStatic154(); Config.__initStatic155(); Config.__initStatic156(); Config.__initStatic157();

function centerWave(wave) {
    let sum = 0.0;
    for (let i = 0; i < wave.length; i++) sum += wave[i];
    const average = sum / wave.length;
    for (let i = 0; i < wave.length; i++) wave[i] -= average;
    performIntegral(wave);
    // The first sample should be zero, and we'll duplicate it at the end for easier interpolation.
    wave.push(0);
    return new Float32Array(wave);
}
function centerAndNormalizeWave(wave) {
    let magn = 0.0;

    centerWave(wave);

    // Going to length-1 because an extra 0 sample is added on the end as part of centerWave, which shouldn't impact magnitude calculation.
    for (let i = 0; i < wave.length - 1; i++) {
        magn += Math.abs(wave[i]);
    }
    const magnAvg = magn / (wave.length - 1);

    for (let i = 0; i < wave.length - 1; i++) {
        wave[i] = wave[i] / magnAvg;
    }

    return new Float32Array(wave);

}
export function performIntegral(wave) {
    // Perform the integral on the wave. The synth function will perform the derivative to get the original wave back but with antialiasing.
    let cumulative = 0.0;
    let newWave = new Float32Array(wave.length);
    for (let i = 0; i < wave.length; i++) {
        newWave[i] = cumulative;
        cumulative += wave[i];
    }

    return newWave;
}
export function performIntegralOld(wave) {
	// Old ver used in harmonics/picked string instruments, manipulates wave in place.
	let cumulative = 0.0;
	for (let i = 0; i < wave.length; i++) {
		const temp = wave[i];
		wave[i] = cumulative;
		cumulative += temp;
	}
}

export function getPulseWidthRatio(pulseWidth) {
    // BeepBox formula for reference
    //return Math.pow(0.5, (Config.pulseWidthRange - 1 - pulseWidth) * Config.pulseWidthStepPower) * 0.5;

    return pulseWidth / (Config.pulseWidthRange * 2);
}


// The function arguments will be defined in FFT.ts, but I want
// SynthConfig.ts to be at the top of the compiled JS so I won't directly
// depend on FFT here. synth.ts will take care of importing FFT.ts.
//function inverseRealFourierTransform(array: {length: number, [index: number]: number}, fullArrayLength: number): void;
//function scaleElementsByFactor(array: {length: number, [index: number]: number}, factor: number): void;
export function getDrumWave(index, inverseRealFourierTransform, scaleElementsByFactor) {
    let wave = Config.chipNoises[index].samples;
    if (wave == null) {
        wave = new Float32Array(Config.chipNoiseLength + 1);
        Config.chipNoises[index].samples = wave;

        if (index == 0) {
            // The "retro" drum uses a "Linear Feedback Shift Register" similar to the NES noise channel.
            let drumBuffer = 1;
            for (let i = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                let newBuffer = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer += 1 << 14;
                }
                drumBuffer = newBuffer;
            }
        } else if (index == 1) {
            // White noise is just random values for each sample.
            for (let i = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = Math.random() * 2.0 - 1.0;
            }
        } else if (index == 2) {
            // The "clang" noise wave is based on a similar noise wave in the modded beepbox made by DAzombieRE.
            let drumBuffer = 1;
            for (let i = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                let newBuffer = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer += 2 << 14;
                }
                drumBuffer = newBuffer;
            }
        } else if (index == 3) {
            // The "buzz" noise wave is based on a similar noise wave in the modded beepbox made by DAzombieRE.
            let drumBuffer = 1;
            for (let i = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                let newBuffer = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer += 10 << 2;
                }
                drumBuffer = newBuffer;
            }
        } else if (index == 4) {
            // "hollow" drums, designed in frequency space and then converted via FFT:
            drawNoiseSpectrum(wave, Config.chipNoiseLength, 10, 11, 1, 1, 0);
            drawNoiseSpectrum(wave, Config.chipNoiseLength, 11, 14, .6578, .6578, 0);
            inverseRealFourierTransform(wave, Config.chipNoiseLength);
            scaleElementsByFactor(wave, 1.0 / Math.sqrt(Config.chipNoiseLength));
        } else if (index == 5) {
            // "Shine" drums from modbox!
            var drumBuffer = 1;
            for (var i = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                var newBuffer = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer += 10 << 2;
                }
                drumBuffer = newBuffer;
            }
        } else if (index == 6) {
            // "Deep" drums from modbox!
            drawNoiseSpectrum(wave, Config.chipNoiseLength, 1, 10, 1, 1, 0);
            drawNoiseSpectrum(wave, Config.chipNoiseLength, 20, 14, -2, -2, 0);
            inverseRealFourierTransform(wave, Config.chipNoiseLength);
            scaleElementsByFactor(wave, 1.0 / Math.sqrt(Config.chipNoiseLength));
        } else if (index == 7) {
            // "Cutter" drums from modbox!
            var drumBuffer = 1;
            for (var i = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = (drumBuffer & 1) * 4.0 * (Math.random() * 14 + 1) - 8.0;
                var newBuffer = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer += 15 << 2;
                }
                drumBuffer = newBuffer;
            }
        } else if (index == 8) {
            // "Metallic" drums from modbox!
            var drumBuffer = 1;
            for (var i = 0; i < 32768; i++) {
                wave[i] = (drumBuffer & 1) / 2.0 - 0.5;
                var newBuffer = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer -= 10 << 2;
                }
                drumBuffer = newBuffer;
            }
        } else {
            throw new Error("Unrecognized drum index: " + index);
        }

        wave[Config.chipNoiseLength] = wave[0];
    }

    return wave;
}

export function drawNoiseSpectrum(wave, waveLength, lowOctave, highOctave, lowPower, highPower, overallSlope) {
    const referenceOctave = 11;
    const referenceIndex = 1 << referenceOctave;
    const lowIndex = Math.pow(2, lowOctave) | 0;
    const highIndex = Math.min(waveLength >> 1, Math.pow(2, highOctave) | 0);
    const retroWave = getDrumWave(0, null, null);
    let combinedAmplitude = 0.0;
    for (let i = lowIndex; i < highIndex; i++) {

        let lerped = lowPower + (highPower - lowPower) * (Math.log2(i) - lowOctave) / (highOctave - lowOctave);
        let amplitude = Math.pow(2, (lerped - 1) * 7 + 1) * lerped;

        amplitude *= Math.pow(i / referenceIndex, overallSlope);

        combinedAmplitude += amplitude;

        // Add two different sources of psuedo-randomness to the noise
        // (individually they aren't random enough) but in a deterministic
        // way so that live spectrum editing doesn't result in audible pops.
        // Multiply all the sine wave amplitudes by 1 or -1 based on the
        // LFSR retro wave (effectively random), and also rotate the phase
        // of each sine wave based on the golden angle to disrupt the symmetry.
        amplitude *= retroWave[i];
        const radians = 0.61803398875 * i * i * Math.PI * 2.0;

        wave[i] = Math.cos(radians) * amplitude;
        wave[waveLength - i] = Math.sin(radians) * amplitude;
    }

    return combinedAmplitude;
}

function generateSineWave() {
    const wave = new Float32Array(Config.sineWaveLength + 1);
    for (let i = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength);
    }
    return wave;
}

function generateTriWave() {
    const wave = new Float32Array(Config.sineWaveLength + 1);
    for (let i = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = Math.asin(Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength)) / (Math.PI / 2);
    }
    return wave;
}

function generateTrapezoidWave(drive = 2) {
    const wave = new Float32Array(Config.sineWaveLength + 1);
    for (let i = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = Math.max(-1.0, Math.min(1.0, Math.asin(Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength)) * drive));
    }
    return wave;
}

function generateSquareWave(phaseWidth = 0) {
    const wave = new Float32Array(Config.sineWaveLength + 1);
    const centerPoint = Config.sineWaveLength / 4;
    for (let i = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = +((Math.abs(i - centerPoint) < phaseWidth * Config.sineWaveLength / 2)
            || ((Math.abs(i - Config.sineWaveLength - centerPoint) < phaseWidth * Config.sineWaveLength / 2))) * 2 - 1;
    }
    return wave;
}

function generateSawWave(inverse = false) {
    const wave = new Float32Array(Config.sineWaveLength + 1);
    for (let i = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = ((i + (Config.sineWaveLength / 4.0)) * 2.0 / Config.sineWaveLength) % 2 - 1;
        wave[i] = inverse ? -wave[i] : wave[i];
    }
    return wave;
}

export function getArpeggioPitchIndex(pitchCount, useFastTwoNoteArp, arpeggio) {
    let arpeggioPattern = Config.arpeggioPatterns[pitchCount - 1];
    if (arpeggioPattern != null) {
        if (pitchCount == 2 && useFastTwoNoteArp == false) {
            arpeggioPattern = [0, 0, 1, 1];
        }
        return arpeggioPattern[arpeggio % arpeggioPattern.length];
    } else {
        return arpeggio % pitchCount;
    }
}

// Pardon the messy type casting. This allows accessing array members by numerical index or string name.
export function toNameMap(array) {
    const dictionary = {};
    for (let i = 0; i < array.length; i++) {
        const value = array[i];
        value.index = i;
        dictionary[value.name] = value;
    }
    const result = array;
    result.dictionary = dictionary;
    return result;
}

export function effectsIncludeTransition(effects) {
    return (effects & (1 << EffectType.transition)) != 0;
}
export function effectsIncludeChord(effects) {
    return (effects & (1 << EffectType.chord)) != 0;
}
export function effectsIncludePitchShift(effects) {
    return (effects & (1 << EffectType.pitchShift)) != 0;
}
export function effectsIncludeDetune(effects) {
    return (effects & (1 << EffectType.detune)) != 0;
}
export function effectsIncludeVibrato(effects) {
    return (effects & (1 << EffectType.vibrato)) != 0;
}
export function effectsIncludeNoteFilter(effects) {
    return (effects & (1 << EffectType.noteFilter)) != 0;
}
export function effectsIncludeDistortion(effects) {
    return (effects & (1 << EffectType.distortion)) != 0;
}
export function effectsIncludeBitcrusher(effects) {
    return (effects & (1 << EffectType.bitcrusher)) != 0;
}
export function effectsIncludePanning(effects) {
    return (effects & (1 << EffectType.panning)) != 0;
}
export function effectsIncludeChorus(effects) {
    return (effects & (1 << EffectType.chorus)) != 0;
}
export function effectsIncludeEcho(effects) {
    return (effects & (1 << EffectType.echo)) != 0;
}
export function effectsIncludeReverb(effects) {
    return (effects & (1 << EffectType.reverb)) != 0;
}
export function rawChipToIntegrated(raw) {
    const newArray = new Array(raw.length);
    const dictionary = {};
    for (let i = 0; i < newArray.length; i++) {
        newArray[i] = Object.assign([], raw[i]);
        const value = newArray[i];
        value.index = i;
        dictionary[value.name] = value;
    }
    for (let key in dictionary) {
        dictionary[key].samples = performIntegral(dictionary[key].samples);
    }
    const result = newArray;
    result.dictionary = dictionary;
    return result;
}