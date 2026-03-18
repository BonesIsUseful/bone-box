// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

//import { Layout } from "./Layout.js";
import { InstrumentType, EffectType, Config, effectsIncludeTransition, effectsIncludeChord, effectsIncludePitchShift, effectsIncludeDetune, effectsIncludeVibrato, effectsIncludeNoteFilter, effectsIncludeDistortion, effectsIncludeBitcrusher, effectsIncludePanning, effectsIncludeChorus, effectsIncludeEcho, effectsIncludeReverb, DropdownID } from "../synth/SynthConfig.js";
import { BarScrollBar } from "./BarScrollBar.js";
import { BeatsPerBarPrompt } from "./BeatsPerBarPrompt.js";
import { ChangeGroup } from "./Change.js";
import { ChannelSettingsPrompt } from "./ChannelSettingsPrompt.js";
import { ColorConfig } from "./ColorConfig.js";
import { CustomChipPrompt } from "./CustomChipPrompt.js";
import { CustomFilterPrompt } from "./CustomFilterPrompt.js";
import { EditorConfig, isMobile, prettyNumber } from "./EditorConfig.js";
import { ExportPrompt } from "./ExportPrompt.js";
import "./Layout.js"; // Imported here for the sake of ensuring this code is transpiled early.
import { Synth } from "../synth/synth.js";
import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";

import { HarmonicsEditor } from "./HarmonicsEditor.js";
import { InputBox, Slider } from "./HTMLWrapper.js";
import { ImportPrompt } from "./ImportPrompt.js";
import { ChannelRow } from "./ChannelRow.js";
import { LayoutPrompt } from "./LayoutPrompt.js";
import { EnvelopeEditor } from "./EnvelopeEditor.js";
import { FadeInOutEditor } from "./FadeInOutEditor.js";
import { FilterEditor } from "./FilterEditor.js";
import { LimiterPrompt } from "./LimiterPrompt.js";
import { LoopEditor } from "./LoopEditor.js";
import { MoveNotesSidewaysPrompt } from "./MoveNotesSidewaysPrompt.js";
import { MuteEditor } from "./MuteEditor.js";
import { OctaveScrollBar } from "./OctaveScrollBar.js";
import { MidiInputHandler } from "./MidiInput.js";
import { KeyboardLayout } from "./KeyboardLayout.js";
import { PatternEditor } from "./PatternEditor.js";
import { Piano } from "./Piano.js";


import { SongDurationPrompt } from "./SongDurationPrompt.js";
import { SustainPrompt } from "./SustainPrompt.js";
import { SongRecoveryPrompt } from "./SongRecoveryPrompt.js";
import { RecordingSetupPrompt } from "./RecordingSetupPrompt.js";
import { SpectrumEditor } from "./SpectrumEditor.js";
import { ThemePrompt } from "./ThemePrompt.js";
import { TipPrompt } from "./TipPrompt.js";
import { NewProjectPrompt } from "./NewProjectPrompt.js";
import { ChangeTempo, ChangeChorus, ChangeEchoDelay, ChangeEchoSustain, ChangeReverb, ChangeVolume, ChangePan, ChangePatternSelection, ChangePatternsPerChannel, ChangePatternNumbers, ChangeSupersawDynamism, ChangeSupersawSpread, ChangeSupersawShape, ChangePulseWidth, ChangeFeedbackAmplitude, ChangeOperatorAmplitude, ChangeOperatorFrequency, ChangeDrumsetEnvelope, ChangePasteInstrument, ChangePreset, pickRandomPresetValue, ChangeRandomGeneratedInstrument, ChangeEQFilterType, ChangeNoteFilterType, ChangeEQFilterSimpleCut, ChangeEQFilterSimplePeak, ChangeNoteFilterSimpleCut, ChangeNoteFilterSimplePeak, ChangeScale, ChangeDetectKey, ChangeKey, ChangeRhythm, ChangeFeedbackType, ChangeAlgorithm, ChangeChipWave, ChangeNoiseWave, ChangeTransition, ChangeToggleEffects, ChangeVibrato, ChangeUnison, ChangeChord, ChangeSong, ChangePitchShift, ChangeDetune, ChangeDistortion, ChangeStringSustain, ChangeBitcrusherFreq, ChangeBitcrusherQuantization, ChangeAddEnvelope, ChangeEnvelopeSpeed, ChangeDiscreteEnvelope, ChangeAddChannelInstrument, ChangeRemoveChannelInstrument, ChangeCustomWave, ChangeOperatorWaveform, ChangeOperatorPulseWidth, ChangeSongTitle, ChangeVibratoDepth, ChangeVibratoSpeed, ChangeVibratoDelay, ChangeVibratoType, ChangePanDelay, ChangeArpeggioSpeed, ChangeFastTwoNoteArp, ChangeClicklessTransition, ChangeAliasing, ChangeSetPatternInstruments, ChangeHoldingModRecording } from "./changes.js";

import { TrackEditor } from "./TrackEditor.js";

const { button, div, input, select, span, optgroup, option, canvas } = HTML;

function buildOptions(menu, items) {
    for (let index = 0; index < items.length; index++) {
        menu.appendChild(option({ value: index }, items[index]));
    }
    return menu;
}

// Similar to the above, but adds a non-interactive header to the list.
// @jummbus: Honestly not necessary with new HTML options interface, but not exactly necessary to change either!

function buildHeaderedOptions(header, menu, items) {
    menu.appendChild(option({ selected: true, disabled: true, value: header }, header));

    for (const item of items) {
        menu.appendChild(option({ value: item }, item));
    }
    return menu;
}

function buildPresetOptions(isNoise, idSet) {
    const menu = select({ id: idSet });


    // Show the "spectrum" custom type in both pitched and noise channels.
    //const customTypeGroup: HTMLElement = optgroup({label: EditorConfig.presetCategories[0].name});
    if (isNoise) {
        menu.appendChild(option({ value: InstrumentType.noise }, EditorConfig.valueToPreset(InstrumentType.noise).name));
        menu.appendChild(option({ value: InstrumentType.spectrum }, EditorConfig.valueToPreset(InstrumentType.spectrum).name));
        menu.appendChild(option({ value: InstrumentType.drumset }, EditorConfig.valueToPreset(InstrumentType.drumset).name));
    } else {
        menu.appendChild(option({ value: InstrumentType.chip }, EditorConfig.valueToPreset(InstrumentType.chip).name));
        menu.appendChild(option({ value: InstrumentType.pwm }, EditorConfig.valueToPreset(InstrumentType.pwm).name));
        menu.appendChild(option({ value: InstrumentType.supersaw}, EditorConfig.valueToPreset(InstrumentType.supersaw).name));
        menu.appendChild(option({ value: InstrumentType.harmonics }, EditorConfig.valueToPreset(InstrumentType.harmonics).name));
        menu.appendChild(option({ value: InstrumentType.pickedString }, EditorConfig.valueToPreset(InstrumentType.pickedString).name));
        menu.appendChild(option({ value: InstrumentType.spectrum }, EditorConfig.valueToPreset(InstrumentType.spectrum).name));
        menu.appendChild(option({ value: InstrumentType.fm }, EditorConfig.valueToPreset(InstrumentType.fm).name));
        menu.appendChild(option({ value: InstrumentType.customChipWave }, EditorConfig.valueToPreset(InstrumentType.customChipWave).name));
    }

    const randomGroup = optgroup({ label: "Randomize ▾" });
    randomGroup.appendChild(option({ value: "randomPreset" }, "Random Preset"));
    randomGroup.appendChild(option({ value: "randomGenerated" }, "Random Generated"));
    menu.appendChild(randomGroup);


    for (let categoryIndex = 1; categoryIndex < EditorConfig.presetCategories.length; categoryIndex++) {
        const category = EditorConfig.presetCategories[categoryIndex];
        const group = optgroup({ label: category.name + " ▾" });
        let foundAny = false;
        for (let presetIndex = 0; presetIndex < category.presets.length; presetIndex++) {
            const preset = category.presets[presetIndex];
            if ((preset.isNoise == true) == isNoise) {
                group.appendChild(option({ value: (categoryIndex << 6) + presetIndex }, preset.name));
                foundAny = true;
            }
        }

        // Need to re-sort some elements for readability. Can't just do this in the menu, because indices are saved in URLs and would get broken if the ordering actually changed.
        if (category.name == "String Presets" && foundAny) {

            // Put violin 2 after violin 1
            let moveViolin2 = group.removeChild(group.children[11]);
            group.insertBefore(moveViolin2, group.children[1]);
        }

        if (category.name == "Flute Presets" && foundAny) {

            // Put flute 2 after flute 1
            let moveFlute2 = group.removeChild(group.children[11]);
            group.insertBefore(moveFlute2, group.children[1]);
        }

        if (category.name == "Keyboard Presets" && foundAny) {

            // Put grand piano 2 and 3 after grand piano 1
            let moveGrandPiano2 = group.removeChild(group.children[9]);
            let moveGrandPiano3 = group.removeChild(group.children[9]);
            group.insertBefore(moveGrandPiano3, group.children[1]);
            group.insertBefore(moveGrandPiano2, group.children[1]);
        }

        if (foundAny) menu.appendChild(group);
    }

    return menu;
}

function setSelectedValue(menu, value, isSelect2 = false) {
    const stringValue = value.toString();
    if (menu.value != stringValue) {
        menu.value = stringValue;

        // Change select2 value, if this select is a member of that class.
        if (isSelect2) {
            $(menu).val(value).trigger('change.select2');
        }
    }
}

class CustomChipCanvas {
    
    
    
    
    
    
    

     __init() {this._change = null}

    constructor(  canvas,   _doc,   _getChange) {;this.canvas = canvas;this._doc = _doc;this._getChange = _getChange;CustomChipCanvas.prototype.__init.call(this);CustomChipCanvas.prototype.__init2.call(this);CustomChipCanvas.prototype.__init3.call(this);CustomChipCanvas.prototype.__init4.call(this);CustomChipCanvas.prototype.__init5.call(this);
        canvas.addEventListener("mousemove", this._onMouseMove);
        canvas.addEventListener("mousedown", this._onMouseDown);
        canvas.addEventListener("mouseup", this._onMouseUp);
        canvas.addEventListener("mouseleave", this._onMouseUp);

        this.mouseDown = false;
        this.continuousEdit = false;
        this.lastX = 0;
        this.lastY = 0;

        this.newArray = new Float32Array(64);
        this.renderedArray = new Float32Array(64);
        this.renderedColor = "";

        // Init waveform
        this.redrawCanvas();

    }

     redrawCanvas() {
        const chipData = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].customChipWave;
        const renderColor = ColorConfig.getComputedChannelColor(this._doc.song, this._doc.channel).primaryNote;

        // Check if the data has changed from the last render.
        let needsRedraw = false;
        if (renderColor != this.renderedColor) {
            needsRedraw = true;
        } else for (let i = 0; i < 64; i++) {
            if (chipData[i] != this.renderedArray[i]) {
                needsRedraw = true;
                i = 64;
            }
        }
        if (!needsRedraw) {
            return;
        }

        this.renderedArray.set(chipData);

        var ctx = this.canvas.getContext("2d") ;

        // Black BG
        ctx.fillStyle = ColorConfig.getComputed("--editor-background");
        ctx.fillRect(0, 0, 128, 52);

        // Mid-bar
        ctx.fillStyle = ColorConfig.getComputed("--ui-widget-background");
        ctx.fillRect(0, 25, 128, 2);

        // 25-75 bars
        ctx.fillStyle = ColorConfig.getComputed("--track-editor-bg-pitch-dim");
        ctx.fillRect(0, 13, 128, 1);
        ctx.fillRect(0, 39, 128, 1);

        // Waveform
        ctx.fillStyle = renderColor;

        for (let x = 0; x < 64; x++) {
            var y = chipData[x] + 26;
            ctx.fillRect(x * 2, y - 2, 2, 4);

            this.newArray[x] = y - 26;
        }
    }

     __init2() {this._onMouseMove = (event) => {
        if (this.mouseDown) {

            var x = (event.clientX || event.pageX) - this.canvas.getBoundingClientRect().left;
            var y = Math.floor((event.clientY || event.pageY) - this.canvas.getBoundingClientRect().top);

            if (y < 2) y = 2;
            if (y > 50) y = 50;

            var ctx = this.canvas.getContext("2d") ;

            if (this.continuousEdit == true && Math.abs(this.lastX - x) < 40) {

                var lowerBound = (x < this.lastX) ? x : this.lastX;
                var upperBound = (x < this.lastX) ? this.lastX : x;

                for (let i = lowerBound; i <= upperBound; i += 2) {

                    var progress = (Math.abs(x - this.lastX) > 2.0) ? ((x > this.lastX) ?
                        1.0 - ((i - lowerBound) / (upperBound - lowerBound))
                        : ((i - lowerBound) / (upperBound - lowerBound))) : 0.0;
                    var j = Math.round(y + (this.lastY - y) * progress);

                    ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                    ctx.fillRect(Math.floor(i / 2) * 2, 0, 2, 53);
                    ctx.fillStyle = ColorConfig.getComputed("--ui-widget-background");
                    ctx.fillRect(Math.floor(i / 2) * 2, 25, 2, 2);
                    ctx.fillStyle = ColorConfig.getComputed("--track-editor-bg-pitch-dim");
                    ctx.fillRect(Math.floor(i / 2) * 2, 13, 2, 1);
                    ctx.fillRect(Math.floor(i / 2) * 2, 39, 2, 1);
                    ctx.fillStyle = ColorConfig.getComputedChannelColor(this._doc.song, this._doc.channel).primaryNote;
                    ctx.fillRect(Math.floor(i / 2) * 2, j - 2, 2, 4);

                    // Actually update current instrument's custom waveform
                    this.newArray[Math.floor(i / 2)] = (j - 26);
                }

            }
            else {

                ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                ctx.fillRect(Math.floor(x / 2) * 2, 0, 2, 52);
                ctx.fillStyle = ColorConfig.getComputed("--ui-widget-background");
                ctx.fillRect(Math.floor(x / 2) * 2, 25, 2, 2);
                ctx.fillStyle = ColorConfig.getComputed("--track-editor-bg-pitch-dim");
                ctx.fillRect(Math.floor(x / 2) * 2, 13, 2, 1);
                ctx.fillRect(Math.floor(x / 2) * 2, 39, 2, 1);
                ctx.fillStyle = ColorConfig.getComputedChannelColor(this._doc.song, this._doc.channel).primaryNote;
                ctx.fillRect(Math.floor(x / 2) * 2, y - 2, 2, 4);

                // Actually update current instrument's custom waveform
                this.newArray[Math.floor(x / 2)] = (y - 26);

            }

            this.continuousEdit = true;
            this.lastX = x;
            this.lastY = y;

            // Preview - update integral used for sound synthesis based on new array, not actual stored array. When mouse is released, real update will happen.
            let instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];

            let sum = 0.0;
            for (let i = 0; i < this.newArray.length; i++) {
                sum += this.newArray[i];
            }
            const average = sum / this.newArray.length;

            // Perform the integral on the wave. The chipSynth will perform the derivative to get the original wave back but with antialiasing.
            let cumulative = 0;
            let wavePrev = 0;
            for (let i = 0; i < this.newArray.length; i++) {
                cumulative += wavePrev;
                wavePrev = this.newArray[i] - average;
                instrument.customChipWaveIntegral[i] = cumulative;
            }

            instrument.customChipWaveIntegral[64] = 0.0;
        }

    }}

     __init3() {this._onMouseDown = (event) => {
        this.mouseDown = true;

        // Allow single-click edit
        this._onMouseMove(event);
    }}
     __init4() {this._onMouseUp = () => {
        this.mouseDown = false;
        this.continuousEdit = false;

        this._whenChange();
    }}

     __init5() {this._whenChange = () => {
        this._change = this._getChange(this.newArray);

        this._doc.record(this._change);

        this._change = null;
    }}

}

export class SongEditor {
     __init6() {this.prompt = null}

      __init7() {this._keyboardLayout = new KeyboardLayout(this._doc)}
      __init8() {this._patternEditorPrev = new PatternEditor(this._doc, false, -1)}
      __init9() {this._patternEditor = new PatternEditor(this._doc, true, 0)}
      __init10() {this._patternEditorNext = new PatternEditor(this._doc, false, 1)}
      __init11() {this._trackEditor = new TrackEditor(this._doc, this)}
      __init12() {this._muteEditor = new MuteEditor(this._doc, this)}
      __init13() {this._loopEditor = new LoopEditor(this._doc, this._trackEditor)}
      __init14() {this._piano = new Piano(this._doc)}
      __init15() {this._octaveScrollBar = new OctaveScrollBar(this._doc, this._piano)}
      __init16() {this._playButton = button({ class: "playButton", type: "button", title: "Play (Space)" }, span("Play"))}
      __init17() {this._pauseButton = button({ class: "pauseButton", style: "display: none;", type: "button", title: "Pause (Space)" }, "Pause")}
      __init18() {this._recordButton = button({ class: "recordButton", style: "display: none;", type: "button", title: "Record (Ctrl+Space)" }, span("Record"))}
      __init19() {this._stopButton = button({ class: "stopButton", style: "display: none;", type: "button", title: "Stop Recording (Space)" }, "Stop Recording")}
      __init20() {this._prevBarButton = button({ class: "prevBarButton", type: "button", title: "Previous Bar (left bracket)" })}
      __init21() {this._nextBarButton = button({ class: "nextBarButton", type: "button", title: "Next Bar (right bracket)" })}
      __init22() {this._volumeSlider = new Slider(input({ title: "main volume", style: "width: 5em; flex-grow: 1; margin: 0;", type: "range", min: "0", max: "75", value: "50", step: "1" }), this._doc, null, false)}
      __init23() {this._outVolumeBarBg = SVG.rect({ "pointer-events": "none", width: "90%", height: "50%", x: "5%", y: "25%", fill: ColorConfig.uiWidgetBackground })}
      __init24() {this._outVolumeBar = SVG.rect({ "pointer-events": "none", height: "50%", width: "0%", x: "5%", y: "25%", fill: "url('#volumeGrad2')" })}
      __init25() {this._outVolumeCap = SVG.rect({ "pointer-events": "none", width: "2px", height: "50%", x: "5%", y: "25%", fill: ColorConfig.uiWidgetFocus })}
      __init26() {this._stop1 = SVG.stop({ "stop-color": "lime", offset: "60%" })}
      __init27() {this._stop2 = SVG.stop({ "stop-color": "orange", offset: "90%" })}
      __init28() {this._stop3 = SVG.stop({ "stop-color": "red", offset: "100%" })}
      __init29() {this._gradient = SVG.linearGradient({ id: "volumeGrad2", gradientUnits: "userSpaceOnUse" }, this._stop1, this._stop2, this._stop3)}
      __init30() {this._defs = SVG.defs({}, this._gradient)}
      __init31() {this._volumeBarContainer = SVG.svg({ style: `touch-action: none; overflow: visible; margin: auto; max-width: 20vw;`, width: "160px", height: "100%", preserveAspectRatio: "none", viewBox: "0 0 160 12" },
        this._defs,
        this._outVolumeBarBg,
        this._outVolumeBar,
        this._outVolumeCap,
    )}
      __init32() {this._volumeBarBox = div({ class: "playback-volume-bar", style: "height: 12px; align-self: center;" },
        this._volumeBarContainer,
    )}
      __init33() {this._fileMenu = select({ style: "width: 100%;" },
        option({ selected: true, disabled: true, hidden: false }, "File"), // todo: "hidden" should be true but looks wrong on mac chrome, adds checkmark next to first visible option even though it's not selected. :(
        option({ value: "new" }, "+ New Blank Song"),
        option({ value: "import" }, "↑ Import Song... (" + EditorConfig.ctrlSymbol + "O)"),
        option({ value: "export" }, "↓ Export Song... (" + EditorConfig.ctrlSymbol + "S)"),
        option({ value: "copyUrl" }, "⎘ Copy Song URL"),
        option({ value: "shareUrl" }, "⤳ Share Song URL"),
        option({ value: "shortenUrl" }, "… Shorten Song URL"),
        option({ value: "viewPlayer" }, "▶ View in Song Player"),
        option({ value: "copyEmbed" }, "⎘ Copy HTML Embed Code"),
        option({ value: "songRecovery" }, "⚠ Recover Recent Song..."),
    )}
      __init34() {this._editMenu = select({ style: "width: 100%;" },
        option({ selected: true, disabled: true, hidden: false }, "Edit"), // todo: "hidden" should be true but looks wrong on mac chrome, adds checkmark next to first visible option even though it's not selected. :(
        option({ value: "undo" }, "Undo (Z)"),
        option({ value: "redo" }, "Redo (Y)"),
        option({ value: "copy" }, "Copy Pattern (C)"),
        option({ value: "pasteNotes" }, "Paste Pattern Notes (V)"),
        option({ value: "pasteNumbers" }, "Paste Pattern Numbers (" + EditorConfig.ctrlSymbol + "⇧V)"),
        option({ value: "insertBars" }, "Insert Bar (⏎)"),
        option({ value: "deleteBars" }, "Delete Selected Bars (⌫)"),
        option({ value: "insertChannel" }, "Insert Channel (" + EditorConfig.ctrlSymbol + "⏎)"),
        option({ value: "deleteChannel" }, "Delete Selected Channels (" + EditorConfig.ctrlSymbol + "⌫)"),
        option({ value: "selectChannel" }, "Select Channel (⇧A)"),
        option({ value: "selectAll" }, "Select All (A)"),
        option({ value: "duplicatePatterns" }, "Duplicate Reused Patterns (D)"),
        option({ value: "transposeUp" }, "Move Notes Up (+ or ⇧+)"),
        option({ value: "transposeDown" }, "Move Notes Down (- or ⇧-)"),
        option({ value: "moveNotesSideways" }, "Move All Notes Sideways... (W)"),
        option({ value: "beatsPerBar" }, "Change Beats Per Bar..."),
        option({ value: "barCount" }, "Change Song Length... (L)"),
        option({ value: "channelSettings" }, "Channel Settings... (Q)"),
        option({ value: "limiterSettings" }, "Limiter Settings... (⇧L)"),
    )}
      __init35() {this._optionsMenu = select({ style: "width: 100%;" },
        option({ selected: true, disabled: true, hidden: false }, "Preferences"), // todo: "hidden" should be true but looks wrong on mac chrome, adds checkmark next to first visible option even though it's not selected. :(
        option({ value: "autoPlay" }, "Auto Play on Load"),
        option({ value: "autoFollow" }, "Auto Follow Playhead"),
        option({ value: "enableNotePreview" }, "Hear Added Notes"),
        option({ value: "showLetters" }, "Show Piano Keys"),
        option({ value: "showFifth" }, 'Highlight "Fifth" Note'),
        option({ value: "notesOutsideScale" }, "Place Notes Out of Scale"),
        option({ value: "setDefaultScale" }, "Set Current Scale as Default"),
        option({ value: "showChannels" }, "Show All Channels"),
        option({ value: "showScrollBar" }, "Show Octave Scroll Bar"),
        option({ value: "alwaysFineNoteVol" }, "Always Fine Note Volume"),
        option({ value: "enableChannelMuting" }, "Enable Channel Muting"),
        option({ value: "displayBrowserUrl" }, "Show Song Data in URL"),
        option({ value: "displayVolumeBar" }, "Show Playback Volume"),
        option({ value: "layout" }, "Set Layout..."),
        option({ value: "colorTheme" }, "Set Theme..."),
        option({ value: "recordingSetup" }, "Note Recording..."),
    )}
      __init36() {this._scaleSelect = buildOptions(select(), Config.scales.map(scale => scale.name))}
      __init37() {this._keySelect = buildOptions(select(), Config.keys.map(key => key.name).reverse())}
      __init38() {this._tempoSlider = new Slider(input({ style: "margin: 0; vertical-align: middle;", type: "range", min: "30", max: "320", value: "160", step: "1" }), this._doc, (oldValue, newValue) => new ChangeTempo(this._doc, oldValue, newValue), false)}
      __init39() {this._tempoStepper = input({ style: "width: 4em; font-size: 80%; margin-left: 0.4em; vertical-align: middle;", type: "number", step: "1" })}
      __init40() {this._chorusSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.chorusRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeChorus(this._doc, oldValue, newValue), false)}
      __init41() {this._chorusRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("chorus") }, "Chorus:"), this._chorusSlider.container)}
      __init42() {this._reverbSlider = new Slider(input({ style: "margin: 0; position: sticky,", type: "range", min: "0", max: Config.reverbRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeReverb(this._doc, oldValue, newValue), false)}
      __init43() {this._reverbRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("reverb") }, "Reverb:"), this._reverbSlider.container)}
      __init44() {this._echoSustainSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.echoSustainRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeEchoSustain(this._doc, oldValue, newValue), false)}
      __init45() {this._echoSustainRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("echoSustain") }, "Echo:"), this._echoSustainSlider.container)}
      __init46() {this._echoDelaySlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.echoDelayRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeEchoDelay(this._doc, oldValue, newValue), false)}
      __init47() {this._echoDelayRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("echoDelay") }, "Echo Delay:"), this._echoDelaySlider.container)}
      __init48() {this._rhythmSelect = buildOptions(select(), Config.rhythms.map(rhythm => rhythm.name))}
      __init49() {this._pitchedPresetSelect = buildPresetOptions(false, "pitchPresetSelect")}
      __init50() {this._drumPresetSelect = buildPresetOptions(true, "drumPresetSelect")}
      __init51() {this._algorithmSelect = buildOptions(select(), Config.algorithms.map(algorithm => algorithm.name))}
      __init52() {this._algorithmSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("algorithm") }, "Algorithm: "), div({ class: "selectContainer" }, this._algorithmSelect))}
      __init53() {this._instrumentButtons = []}
      __init54() {this._instrumentAddButton = button({ type: "button", class: "add-instrument last-button" })}
      __init55() {this._instrumentRemoveButton = button({ type: "button", class: "remove-instrument" })}
      __init56() {this._instrumentsButtonBar = div({ class: "instrument-bar" }, this._instrumentRemoveButton, this._instrumentAddButton)}
      __init57() {this._instrumentsButtonRow = div({ class: "selectRow", style: "display: none;" }, span({ class: "tip", onclick: () => this._openPrompt("instrumentIndex") }, "Instrument:"), this._instrumentsButtonBar)}
      __init58() {this._instrumentVolumeSlider = new Slider(input({ style: "margin: 0; position: sticky;", type: "range", min: Math.floor(-Config.volumeRange / 2), max: Math.floor(Config.volumeRange / 2), value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeVolume(this._doc, oldValue, newValue), true)}
      __init59() {this._instrumentVolumeSliderInputBox = input({ style: "width: 4em; font-size: 80%", id: "volumeSliderInputBox", type: "number", step: "1", min: Math.floor(-Config.volumeRange / 2), max: Math.floor(Config.volumeRange / 2), value: "0" })}
      __init60() {this._instrumentVolumeSliderTip = div({ class: "selectRow", style: "height: 1em" }, span({ class: "tip", style: "font-size: smaller;", onclick: () => this._openPrompt("instrumentVolume") }, "Volume: "))}
      __init61() {this._instrumentVolumeSliderRow = div({ class: "selectRow" }, div({},
        div({ style: `color: ${ColorConfig.secondaryText};` }, span({ class: "tip" }, this._instrumentVolumeSliderTip)),
        div({ style: `color: ${ColorConfig.secondaryText}; margin-top: -3px;` }, this._instrumentVolumeSliderInputBox),
    ), this._instrumentVolumeSlider.container)}
      __init62() {this._panSlider = new Slider(input({ style: "margin: 0; position: sticky;", type: "range", min: "0", max: Config.panMax, value: Config.panCenter, step: "1" }), this._doc, (oldValue, newValue) => new ChangePan(this._doc, oldValue, newValue), true)}
      __init63() {this._panDropdown = button({ style: "margin-left:0em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(DropdownID.Pan) }, "▼")}
      __init64() {this._panSliderInputBox = input({ style: "width: 4em; font-size: 80%; ", id: "panSliderInputBox", type: "number", step: "1", min: "0", max: "100", value: "0" })}
      __init65() {this._panSliderRow = div({ class: "selectRow" }, div({},
        span({ class: "tip", tabindex: "0", style: "height:1em; font-size: smaller;", onclick: () => this._openPrompt("pan") }, "Pan: "),
        div({ style: "color: " + ColorConfig.secondaryText + "; margin-top: -3px;" }, this._panSliderInputBox),
    ), this._panDropdown, this._panSlider.container)}
      __init66() {this._panDelaySlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.modulators.dictionary["pan delay"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangePanDelay(this._doc, oldValue, newValue), false)}
      __init67() {this._panDelayRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("panDelay") }, "‣ Delay:"), this._panDelaySlider.container)}
      __init68() {this._panDropdownGroup = div({ class: "editor-controls", style: "display: none;" }, this._panDelayRow)}
      __init69() {this._chipWaveSelect = buildOptions(select(), Config.chipWaves.map(wave => wave.name))}
      __init70() {this._chipNoiseSelect = buildOptions(select(), Config.chipNoises.map(wave => wave.name))}
      __init71() {this._chipWaveSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("chipWave") }, "Wave: "), div({ class: "selectContainer" }, this._chipWaveSelect))}
      __init72() {this._chipNoiseSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("chipNoise") }, "Noise: "), div({ class: "selectContainer" }, this._chipNoiseSelect))}
      __init73() {this._fadeInOutEditor = new FadeInOutEditor(this._doc)}
      __init74() {this._fadeInOutRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("fadeInOut") }, "Fade:"), this._fadeInOutEditor.container)}
      __init75() {this._transitionSelect = buildOptions(select(), Config.transitions.map(transition => transition.name))}
      __init76() {this._transitionDropdown = button({ style: "margin-left:0em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(DropdownID.Transition) }, "▼")}
      __init77() {this._transitionRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("transition") }, "Transition:"), this._transitionDropdown, div({ class: "selectContainer", style: "width: 52.5%;" }, this._transitionSelect))}
      __init78() {this._clicklessTransitionBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-right: 4em;" })}
      __init79() {this._clicklessTransitionRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("clicklessTransition") }, "‣ Clickless:"), this._clicklessTransitionBox)}
      __init80() {this._transitionDropdownGroup = div({ class: "editor-controls", style: "display: none;" }, this._clicklessTransitionRow)}

      __init81() {this._effectsSelect = select(option({ selected: true, disabled: true, hidden: false }))} // todo: "hidden" should be true but looks wrong on mac chrome, adds checkmark next to first visible option even though it's not selected. :(
      __init82() {this._eqFilterSimpleButton = button({ style: "font-size: x-small; width: 50%; height: 40%", class: "no-underline", onclick: () => this._switchEQFilterType(true) }, "simple")}
      __init83() {this._eqFilterAdvancedButton = button({ style: "font-size: x-small; width: 50%; height: 40%", class: "last-button no-underline", onclick: () => this._switchEQFilterType(false) }, "advanced")}
      __init84() {this._eqFilterTypeRow = div({ class: "selectRow", style: "padding-top: 4px; margin-bottom: 0px;" }, span({ style: "font-size: x-small;", class: "tip", onclick: () => this._openPrompt("filterType") }, "EQ Filt.Type:"), div({ class: "instrument-bar" }, this._eqFilterSimpleButton, this._eqFilterAdvancedButton))}
      __init85() {this._eqFilterEditor = new FilterEditor(this._doc)}
      __init86() {this._eqFilterZoom = button({ style: "margin-left:0em; padding-left:0.2em; height:1.5em; max-width: 12px;", onclick: () => this._openPrompt("customEQFilterSettings") }, "+")}
      __init87() {this._eqFilterRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("eqFilter") }, "EQ Filt:"), this._eqFilterZoom, this._eqFilterEditor.container)}
      __init88() {this._eqFilterSimpleCutSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.filterSimpleCutRange - 1, value: "6", step: "1" }), this._doc, (oldValue, newValue) => new ChangeEQFilterSimpleCut(this._doc, oldValue, newValue), false)}
     __init89() {this._eqFilterSimpleCutRow = div({ class: "selectRow", title: "Low-pass Filter Cutoff Frequency" }, span({ class: "tip", onclick: () => this._openPrompt("filterCutoff") }, "Filter Cut:"), this._eqFilterSimpleCutSlider.container)}
      __init90() {this._eqFilterSimplePeakSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.filterSimplePeakRange - 1, value: "6", step: "1" }), this._doc, (oldValue, newValue) => new ChangeEQFilterSimplePeak(this._doc, oldValue, newValue), false)}
     __init91() {this._eqFilterSimplePeakRow = div({ class: "selectRow", title: "Low-pass Filter Peak Resonance" }, span({ class: "tip", onclick: () => this._openPrompt("filterResonance") }, "Filter Peak:"), this._eqFilterSimplePeakSlider.container)}

      __init92() {this._noteFilterSimpleButton = button({ style: "font-size: x-small; width: 50%; height: 40%", class: "no-underline", onclick: () => this._switchNoteFilterType(true) }, "simple")}
      __init93() {this._noteFilterAdvancedButton = button({ style: "font-size: x-small; width: 50%; height: 40%", class: "last-button no-underline", onclick: () => this._switchNoteFilterType(false) }, "advanced")}
      __init94() {this._noteFilterTypeRow = div({ class: "selectRow", style: "padding-top: 4px; margin-bottom: 0px;" }, span({ style: "font-size: x-small;", class: "tip", onclick: () => this._openPrompt("filterType") }, "Note Filt.Type:"), div({ class: "instrument-bar" }, this._noteFilterSimpleButton, this._noteFilterAdvancedButton))}
      __init95() {this._noteFilterEditor = new FilterEditor(this._doc, true)}
      __init96() {this._noteFilterZoom = button({ style: "margin-left:0em; padding-left:0.2em; height:1.5em; max-width: 12px;", onclick: () => this._openPrompt("customNoteFilterSettings") }, "+")}
      __init97() {this._noteFilterRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("noteFilter") }, "Note Filt:"), this._noteFilterZoom, this._noteFilterEditor.container)}
      __init98() {this._supersawDynamismSlider = new Slider(input({style: "margin: 0;", type: "range", min: "0", max: Config.supersawDynamismMax, value: "0", step: "1"}), this._doc, (oldValue, newValue) => new ChangeSupersawDynamism(this._doc, oldValue, newValue), false)}
	  __init99() {this._supersawDynamismRow = div({class: "selectRow"}, span({class: "tip", onclick: ()=>this._openPrompt("supersawDynamism")}, "Dynamism:"), this._supersawDynamismSlider.container)}
	  __init100() {this._supersawSpreadSlider = new Slider(input({style: "margin: 0;", type: "range", min: "0", max: Config.supersawSpreadMax, value: "0", step: "1"}), this._doc, (oldValue, newValue) => new ChangeSupersawSpread(this._doc, oldValue, newValue), false)}
	  __init101() {this._supersawSpreadRow = div({class: "selectRow"}, span({class: "tip", onclick: ()=>this._openPrompt("supersawSpread")}, "Spread:"), this._supersawSpreadSlider.container)}
	  __init102() {this._supersawShapeSlider = new Slider(input({style: "margin: 0;", type: "range", min: "0", max: Config.supersawShapeMax, value: "0", step: "1"}), this._doc, (oldValue, newValue) => new ChangeSupersawShape(this._doc, oldValue, newValue), false)}
	  __init103() {this._supersawShapeRow = div({class: "selectRow"}, span({class: "tip", onclick: ()=>this._openPrompt("supersawShape"), style: "overflow: clip;"}, "Saw↔Pulse:"), this._supersawShapeSlider.container)}
	
      __init104() {this._noteFilterSimpleCutSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.filterSimpleCutRange - 1, value: "6", step: "1" }), this._doc, (oldValue, newValue) => new ChangeNoteFilterSimpleCut(this._doc, oldValue, newValue), false)}
     __init105() {this._noteFilterSimpleCutRow = div({ class: "selectRow", title: "Low-pass Filter Cutoff Frequency" }, span({ class: "tip", onclick: () => this._openPrompt("filterCutoff") }, "Filter Cut:"), this._noteFilterSimpleCutSlider.container)}
      __init106() {this._noteFilterSimplePeakSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.filterSimplePeakRange - 1, value: "6", step: "1" }), this._doc, (oldValue, newValue) => new ChangeNoteFilterSimplePeak(this._doc, oldValue, newValue), false)}
     __init107() {this._noteFilterSimplePeakRow = div({ class: "selectRow", title: "Low-pass Filter Peak Resonance" }, span({ class: "tip", onclick: () => this._openPrompt("filterResonance") }, "Filter Peak:"), this._noteFilterSimplePeakSlider.container)}

      __init108() {this._pulseWidthSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "1", max: Config.pulseWidthRange, value: "1", step: "1" }), this._doc, (oldValue, newValue) => new ChangePulseWidth(this._doc, oldValue, newValue), false)}
      __init109() {this._pwmSliderInputBox = input({ style: "width: 4em; font-size: 80%; ", id: "pwmSliderInputBox", type: "number", step: "1", min: "1", max: Config.pulseWidthRange, value: "1" })}
      __init110() {this._pulseWidthRow = div({ class: "selectRow" }, div({},
        span({ class: "tip", tabindex: "0", style: "height:1em; font-size: smaller;", onclick: () => this._openPrompt("pulseWidth") }, "PulseWidth:"),
        div({ style: `color: ${ColorConfig.secondaryText}; margin-top: -3px;` }, this._pwmSliderInputBox)
        ), this._pulseWidthSlider.container)}

      __init111() {this._pitchShiftSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.pitchShiftRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangePitchShift(this._doc, oldValue, newValue), true)}
      __init112() {this._pitchShiftTonicMarkers = [div({ class: "pitchShiftMarker", style: { color: ColorConfig.tonic } }), div({ class: "pitchShiftMarker", style: { color: ColorConfig.tonic, left: "50%" } }), div({ class: "pitchShiftMarker", style: { color: ColorConfig.tonic, left: "100%" } })]}
      __init113() {this._pitchShiftFifthMarkers = [div({ class: "pitchShiftMarker", style: { color: ColorConfig.fifthNote, left: (100 * 7 / 24) + "%" } }), div({ class: "pitchShiftMarker", style: { color: ColorConfig.fifthNote, left: (100 * 19 / 24) + "%" } })]}
      __init114() {this._pitchShiftMarkerContainer = div({ style: "display: flex; position: relative;" }, this._pitchShiftSlider.container, div({ class: "pitchShiftMarkerContainer" }, this._pitchShiftTonicMarkers, this._pitchShiftFifthMarkers))}
      __init115() {this._pitchShiftRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("pitchShift") }, "Pitch Shift:"), this._pitchShiftMarkerContainer)}
      __init116() {this._detuneSlider = new Slider(input({ style: "margin: 0;", type: "range", min: Config.detuneMin - Config.detuneCenter, max: Config.detuneMax - Config.detuneCenter, value: 0, step: "4" }), this._doc, (oldValue, newValue) => new ChangeDetune(this._doc, oldValue, newValue), true)}
      __init117() {this._detuneSliderInputBox = input({ style: "width: 4em; font-size: 80%; ", id: "detuneSliderInputBox", type: "number", step: "1", min: Config.detuneMin - Config.detuneCenter, max: Config.detuneMax - Config.detuneCenter, value: 0 })}
      __init118() {this._detuneSliderRow = div({ class: "selectRow" }, div({},
        span({ class: "tip", style: "height:1em; font-size: smaller;", onclick: () => this._openPrompt("detune") }, "Detune: "),
        div({ style: `color: ${ColorConfig.secondaryText}; margin-top: -3px;` }, this._detuneSliderInputBox),
    ), this._detuneSlider.container)}
      __init119() {this._distortionSlider = new Slider(input({ style: "margin: 0; position: sticky;", type: "range", min: "0", max: Config.distortionRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeDistortion(this._doc, oldValue, newValue), false)}
      __init120() {this._distortionRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("distortion") }, "Distortion:"), this._distortionSlider.container)}
      __init121() {this._aliasingBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-right: 4em;" })}
      __init122() {this._aliasingRow = div({ class: "selectRow" }, span({ class: "tip", style: "margin-left:10px;", onclick: () => this._openPrompt("aliases") }, "Aliasing:"), this._aliasingBox)}
      __init123() {this._bitcrusherQuantizationSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.bitcrusherQuantizationRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeBitcrusherQuantization(this._doc, oldValue, newValue), false)}
      __init124() {this._bitcrusherQuantizationRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("bitcrusherQuantization") }, "Bit Crush:"), this._bitcrusherQuantizationSlider.container)}
      __init125() {this._bitcrusherFreqSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.bitcrusherFreqRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeBitcrusherFreq(this._doc, oldValue, newValue), false)}
      __init126() {this._bitcrusherFreqRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("bitcrusherFreq") }, "Freq Crush:"), this._bitcrusherFreqSlider.container)}
      __init127() {this._stringSustainSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.stringSustainRange - 1, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeStringSustain(this._doc, oldValue, newValue), false)}
      __init128() {this._stringSustainLabel = span({class: "tip", onclick: ()=>this._openPrompt("stringSustain")}, "Sustain:")}
	  __init129() {this._stringSustainRow = div({class: "selectRow"}, this._stringSustainLabel, this._stringSustainSlider.container)}
	  __init130() {this._unisonSelect = buildOptions(select(), Config.unisons.map(unison => unison.name))}
      __init131() {this._unisonSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("unison") }, "Unison:"), div({ class: "selectContainer" }, this._unisonSelect))}
      __init132() {this._chordSelect = buildOptions(select(), Config.chords.map(chord => chord.name))}
      __init133() {this._chordDropdown = button({ style: "margin-left:0em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(DropdownID.Chord) }, "▼")}

      __init134() {this._chordSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("chords") }, "Chords:"), this._chordDropdown, div({ class: "selectContainer" }, this._chordSelect))}
      __init135() {this._arpeggioSpeedDisplay = span({ style: `color: ${ColorConfig.secondaryText}; font-size: smaller; text-overflow: clip;` }, "x1")}
      __init136() {this._arpeggioSpeedSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.modulators.dictionary["arp speed"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeArpeggioSpeed(this._doc, oldValue, newValue), false)}
      __init137() {this._arpeggioSpeedRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("arpeggioSpeed") }, "‣ Spd:"), this._arpeggioSpeedDisplay, this._arpeggioSpeedSlider.container)}
      __init138() {this._twoNoteArpBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-right: 4em;" })}
      __init139() {this._twoNoteArpRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("twoNoteArpeggio") }, "‣ Fast Two-Note:"), this._twoNoteArpBox)}
      __init140() {this._chordDropdownGroup = div({ class: "editor-controls", style: "display: none;" }, this._arpeggioSpeedRow, this._twoNoteArpRow)}

      __init141() {this._vibratoSelect = buildOptions(select(), Config.vibratos.map(vibrato => vibrato.name))}
      __init142() {this._vibratoDropdown = button({ style: "margin-left:0em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(DropdownID.Vibrato) }, "▼")}
      __init143() {this._vibratoSelectRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("vibrato") }, "Vibrato:"), this._vibratoDropdown, div({ class: "selectContainer", style: "width: 61.5%;" }, this._vibratoSelect))}
      __init144() {this._vibratoDepthSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.modulators.dictionary["vibrato depth"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeVibratoDepth(this._doc, oldValue, newValue), false)}
      __init145() {this._vibratoDepthRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("vibratoDepth") }, "‣ Depth:"), this._vibratoDepthSlider.container)}
      __init146() {this._vibratoSpeedDisplay = span({ style: `color: ${ColorConfig.secondaryText}; font-size: smaller; text-overflow: clip;` }, "x1")}
      __init147() {this._vibratoSpeedSlider = new Slider(input({ style: "margin: 0; text-overflow: clip;", type: "range", min: "0", max: Config.modulators.dictionary["vibrato speed"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeVibratoSpeed(this._doc, oldValue, newValue), false)}
      __init148() {this._vibratoSpeedRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("vibratoSpeed") }, "‣ Spd:"), this._vibratoSpeedDisplay, this._vibratoSpeedSlider.container)}
      __init149() {this._vibratoDelaySlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.modulators.dictionary["vibrato delay"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeVibratoDelay(this._doc, oldValue, newValue), false)}
      __init150() {this._vibratoDelayRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("vibratoDelay") }, "‣ Delay:"), this._vibratoDelaySlider.container)}
      __init151() {this._vibratoTypeSelect = buildOptions(select(), Config.vibratoTypes.map(vibrato => vibrato.name))}
      __init152() {this._vibratoTypeSelectRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("vibratoType") }, "‣ Type:"), div({ class: "selectContainer", style: "width: 61.5%;" }, this._vibratoTypeSelect))}
      __init153() {this._vibratoDropdownGroup = div({ class: "editor-controls", style: `display: none;` }, this._vibratoDepthRow, this._vibratoSpeedRow, this._vibratoDelayRow, this._vibratoTypeSelectRow)}
      __init154() {this._phaseModGroup = div({ class: "editor-controls" })}
      __init155() {this._feedbackTypeSelect = buildOptions(select(), Config.feedbacks.map(feedback => feedback.name))}
      __init156() {this._feedbackRow1 = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("feedbackType") }, "Feedback:"), div({ class: "selectContainer" }, this._feedbackTypeSelect))}
      __init157() {this._spectrumEditor = new SpectrumEditor(this._doc, null)}
      __init158() {this._spectrumRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("spectrum") }, "Spectrum:"), this._spectrumEditor.container)}
      __init159() {this._harmonicsEditor = new HarmonicsEditor(this._doc)}
      __init160() {this._harmonicsRow = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("harmonics") }, "Harmonics:"), this._harmonicsEditor.container)}

      __init161() {this._envelopeEditor = new EnvelopeEditor(this._doc)}
      __init162() {this._discreteEnvelopeBox = input({ type: "checkbox", style: "width: 1em; padding: 0; margin-right: 4em;" })}
      __init163() {this._discreteEnvelopeRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("discreteEnvelope") }, "‣ Discrete:"), this._discreteEnvelopeBox)}
      __init164() {this._envelopeSpeedDisplay = span({ style: `color: ${ColorConfig.secondaryText}; font-size: smaller; text-overflow: clip;` }, "x1")}
      __init165() {this._envelopeSpeedSlider = new Slider(input({ style: "margin: 0;", type: "range", min: "0", max: Config.modulators.dictionary["envelope speed"].maxRawVol, value: "0", step: "1" }), this._doc, (oldValue, newValue) => new ChangeEnvelopeSpeed(this._doc, oldValue, newValue), false)}
      __init166() {this._envelopeSpeedRow = div({ class: "selectRow dropFader" }, span({ class: "tip", style: "margin-left:4px;", onclick: () => this._openPrompt("envelopeSpeed") }, "‣ Spd:"), this._envelopeSpeedDisplay, this._envelopeSpeedSlider.container)}
      __init167() {this._envelopeDropdownGroup = div({ class: "editor-controls", style: "display: none;" }, this._discreteEnvelopeRow, this._envelopeSpeedRow)}
      __init168() {this._envelopeDropdown = button({ style: "margin-left:0em; margin-right: 1em; height:1.5em; width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(DropdownID.Envelope) }, "▼")}
   
      __init169() {this._drumsetGroup = div({ class: "editor-controls" })}
      __init170() {this._modulatorGroup = div({ class: "editor-controls" })}
    
    
    
    
    
    
    
    

      __init171() {this._instrumentCopyButton = button({ style: "max-width:86px; width: 86px;", class: "copyButton", title: "Copy Instrument (⇧C)" }, [
        "Copy",
        // Copy icon:
        SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 50%; margin-top: -1em; pointer-events: none;", width: "2em", height: "2em", viewBox: "-5 -21 26 26" }, [
            SVG.path({ d: "M 0 -15 L 1 -15 L 1 0 L 13 0 L 13 1 L 0 1 L 0 -15 z M 2 -1 L 2 -17 L 10 -17 L 14 -13 L 14 -1 z M 3 -2 L 13 -2 L 13 -12 L 9 -12 L 9 -16 L 3 -16 z", fill: "currentColor" }),
        ]),
    ])}
      __init172() {this._instrumentPasteButton = button({ style: "max-width:86px;", class: "pasteButton", title: "Paste Instrument (⇧V)" }, [
        "Paste",
        // Paste icon:
        SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 50%; margin-top: -1em; pointer-events: none;", width: "2em", height: "2em", viewBox: "0 0 26 26" }, [
            SVG.path({ d: "M 8 18 L 6 18 L 6 5 L 17 5 L 17 7 M 9 8 L 16 8 L 20 12 L 20 22 L 9 22 z", stroke: "currentColor", fill: "none" }),
            SVG.path({ d: "M 9 3 L 14 3 L 14 6 L 9 6 L 9 3 z M 16 8 L 20 12 L 16 12 L 16 8 z", fill: "currentColor", }),
        ]),
    ])}

      __init173() {this._customWaveDrawCanvas = new CustomChipCanvas(canvas({ width: 128, height: 52, style: "border:2px solid " + ColorConfig.uiWidgetBackground, id: "customWaveDrawCanvas" }), this._doc, (newArray) => new ChangeCustomWave(this._doc, newArray))}
      __init174() {this._customWavePresetDrop = buildHeaderedOptions("Load Preset", select({ style: "width: 50%; height:1.5em; text-align: center; text-align-last: center;" }),
        Config.chipWaves.map(wave => wave.name)
    )}
      __init175() {this._customWaveZoom = button({ style: "margin-left:0.5em; height:1.5em; max-width: 20px;", onclick: () => this._openPrompt("customChipSettings") }, "+")}

      __init176() {this._customWaveDraw = div({ style: "height:80px; margin-top:10px; margin-bottom:5px" }, [
        div({ style: "height:54px; display:flex; justify-content:center;" }, [this._customWaveDrawCanvas.canvas]),
        div({ style: "margin-top:5px; display:flex; justify-content:center;" }, [this._customWavePresetDrop, this._customWaveZoom]),
    ])}

      __init177() {this._songTitleInputBox = new InputBox(input({ style: "font-weight:bold; border:none; width: 98%; background-color:${ColorConfig.editorBackground}; color:${ColorConfig.primaryText}; text-align:center", maxlength: "30", type: "text", value: EditorConfig.versionDisplayName }), this._doc, (oldValue, newValue) => new ChangeSongTitle(this._doc, oldValue, newValue))}


      __init178() {this._feedbackAmplitudeSlider = new Slider(input({ type: "range", min: "0", max: Config.operatorAmplitudeMax, value: "0", step: "1", title: "Feedback Amplitude" }), this._doc, (oldValue, newValue) => new ChangeFeedbackAmplitude(this._doc, oldValue, newValue), false)}
      __init179() {this._feedbackRow2 = div({ class: "selectRow" }, span({ class: "tip", onclick: () => this._openPrompt("feedbackVolume") }, "Fdback Vol:"), this._feedbackAmplitudeSlider.container)}
    /*
     * @jummbus - my very real, valid reason for cutting this button: I don't like it.
     * 
    private readonly _customizeInstrumentButton: HTMLButtonElement = button({type: "button", style: "margin: 2px 0"},

        "Customize Instrument",
    );
    */
      __init180() {this._addEnvelopeButton = button({ type: "button", class: "add-envelope" })}
      __init181() {this._customInstrumentSettingsGroup = div({ class: "editor-controls" },
        this._panSliderRow,
        this._panDropdownGroup,
        this._chipWaveSelectRow,
        this._chipNoiseSelectRow,
        this._customWaveDraw,
        this._eqFilterTypeRow,
        this._eqFilterRow,
        this._eqFilterSimpleCutRow,
        this._eqFilterSimplePeakRow,
        this._fadeInOutRow,
        this._algorithmSelectRow,
        this._phaseModGroup,
        this._feedbackRow1,
        this._feedbackRow2,
        this._spectrumRow,
        this._harmonicsRow,
        this._drumsetGroup,
		this._supersawDynamismRow,
		this._supersawSpreadRow,
		this._supersawShapeRow,
        this._pulseWidthRow,
        this._stringSustainRow,
        this._unisonSelectRow,
        div({ style: `padding: 2px 0; margin-left: 2em; display: flex; align-items: center;` },
            span({ style: `flex-grow: 1; text-align: center;` }, span({ class: "tip", onclick: () => this._openPrompt("effects") }, "Effects")),
            div({ class: "effects-menu" }, this._effectsSelect),
        ),
        this._transitionRow,
        this._transitionDropdownGroup,
        this._chordSelectRow,
        this._chordDropdownGroup,
        this._pitchShiftRow,
        this._detuneSliderRow,
        this._vibratoSelectRow,
        this._vibratoDropdownGroup,
        this._noteFilterTypeRow,
        this._noteFilterRow,
        this._noteFilterSimpleCutRow,
        this._noteFilterSimplePeakRow,
        this._distortionRow,
        this._aliasingRow,
        this._bitcrusherQuantizationRow,
        this._bitcrusherFreqRow,
        this._chorusRow,
        this._echoSustainRow,
        this._echoDelayRow,
        this._reverbRow,
        div({ style: `padding: 2px 0; margin-left: 2em; display: flex; align-items: center;` },
            span({ style: `flex-grow: 1; text-align: center;` }, span({ class: "tip", onclick: () => this._openPrompt("envelopes") }, "Envelopes")),
            this._envelopeDropdown,
            this._addEnvelopeButton,
        ),
        this._envelopeDropdownGroup,
        this._envelopeEditor.container,
    )}
      __init182() {this._instrumentCopyGroup = div({ class: "editor-controls" },
        div({ class: "selectRow" },
            this._instrumentCopyButton,
            this._instrumentPasteButton,
        ),
    )}
      __init183() {this._instrumentSettingsTextRow = div({ id: "instrumentSettingsText", style: `padding: 3px 0; max-width: 15em; text-align: center; color: ${ColorConfig.secondaryText};` },
        "Instrument Settings"
    )}
      __init184() {this._instrumentTypeSelectRow = div({ class: "selectRow", id: "typeSelectRow" },
        span({ class: "tip", onclick: () => this._openPrompt("instrumentType") }, "Type:"),
        div(
            div({ class: "pitchSelect" }, this._pitchedPresetSelect),
            div({ class: "drumSelect" }, this._drumPresetSelect)
        ),
    )}
      __init185() {this._instrumentSettingsGroup = div({ class: "editor-controls" },
        this._instrumentSettingsTextRow,
        this._instrumentsButtonRow,
        this._instrumentTypeSelectRow,
        this._instrumentVolumeSliderRow,
        //this._customizeInstrumentButton,
        this._customInstrumentSettingsGroup,
    )}
      __init186() {this._usedPatternIndicator = SVG.path({ d: "M -6 -6 H 6 V 6 H -6 V -6 M -2 -3 L -2 -3 L -1 -4 H 1 V 4 H -1 V -1.2 L -1.2 -1 H -2 V -3 z", fill: ColorConfig.indicatorSecondary, "fill-rule": "evenodd" })}
      __init187() {this._usedInstrumentIndicator = SVG.path({ d: "M -6 -0.8 H -3.8 V -6 H 0.8 V 4.4 H 2.2 V -0.8 H 6 V 0.8 H 3.8 V 6 H -0.8 V -4.4 H -2.2 V 0.8 H -6 z", fill: ColorConfig.indicatorSecondary })}
      __init188() {this._jumpToModIndicator = SVG.svg({ style: "width: 92%; height: 1.3em; flex-shrink: 0; position: absolute;", viewBox: "0 0 200 200" }, [
        SVG.path({ d: "M90 155 l0 -45 -45 0 c-25 0 -45 -4 -45 -10 0 -5 20 -10 45 -10 l45 0 0 -45 c0 -25 5 -45 10 -45 6 0 10 20 10 45 l0 45 45 0 c25 0 45 5 45 10 0 6 -20 10 -45 10 l -45 0 0 45 c0 25 -4 45 -10 45 -5 0 -10 -20 -10 -45z" }),
        SVG.path({ d: "M42 158 c-15 -15 -16 -38 -2 -38 6 0 10 7 10 15 0 8 7 15 15 15 8 0 15 5 15 10 0 14 -23 13 -38 -2z" }),
        SVG.path({ d: "M120 160 c0 -5 7 -10 15 -10 8 0 15 -7 15 -15 0 -8 5 -15 10 -15 14 0 13 23 -2 38 -15 15 -38 16 -38 2z" }),
        SVG.path({ d: "M32 58 c3 -23 48 -40 48 -19 0 6 -7 11 -15 11 -8 0 -15 7 -15 15 0 8 -5 15 -11 15 -6 0 -9 -10 -7 -22z" }),
        SVG.path({ d: "M150 65 c0 -8 -7 -15 -15 -15 -8 0 -15 -4 -15 -10 0 -14 23 -13 38 2 15 15 16 38 2 38 -5 0 -10 -7 -10 -15z" })])}

      __init189() {this._promptContainer = div({ class: "promptContainer", style: "display: none;" })}
      __init190() {this._zoomInButton = button({ class: "zoomInButton", type: "button", title: "Zoom In" })}
      __init191() {this._zoomOutButton = button({ class: "zoomOutButton", type: "button", title: "Zoom Out" })}
      __init192() {this._patternEditorRow = div({ style: "flex: 1; height: 100%; display: flex; overflow: hidden; justify-content: center;" },
        this._patternEditorPrev.container,
        this._patternEditor.container,
        this._patternEditorNext.container,
    )}
      __init193() {this._patternArea = div({ class: "pattern-area" },
        this._piano.container,
        this._patternEditorRow,
        this._octaveScrollBar.container,
        this._zoomInButton,
        this._zoomOutButton,
    )}
      __init194() {this._trackContainer = div({ class: "trackContainer" },
        this._trackEditor.container,
        this._loopEditor.container,
    )}
      __init195() {this._trackVisibleArea = div({ style: "position: absolute; width: 100%; height: 100%; pointer-events: none;" })}
      __init196() {this._trackAndMuteContainer = div({ class: "trackAndMuteContainer" },
        this._muteEditor.container,
        this._trackContainer,
        this._trackVisibleArea,
    )}
      __init197() {this._barScrollBar = new BarScrollBar(this._doc)}
      __init198() {this._trackArea = div({ class: "track-area" },
        this._trackAndMuteContainer,
        this._barScrollBar.container,
    )}

      __init199() {this._menuArea = div({ class: "menu-area" },
        div({ class: "selectContainer menu file" },
            this._fileMenu,
        ),
        div({ class: "selectContainer menu edit" },
            this._editMenu,
        ),
        div({ class: "selectContainer menu preferences" },
            this._optionsMenu,
        ),
    )}
      __init200() {
        // Collaboration Components
        this._collaborationToggle = button({ class: "party-btn", style: "width: 100%; margin-top: 5px; margin-bottom: 5px; padding: 6px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s;" }, "Enable Collaboration");
        this._collaborationToggle.onclick = () => {
            const state = window.boneboxParty.getState();
            if (state.inParty) {
                if (confirm("Are you sure you want to disable collaboration? This will disconnect you from the party.")) {
                    window.boneboxParty.leave();
                }
            } else {
                window.boneboxParty.create();
            }
        };

        this._roomCodeRow = div({ class: "selectRow", style: "display: none; margin: 5px 0; align-items: center;" },
            span({ class: "tip", style: "font-size: 11px; flex-shrink: 0; width: 60px;" }, "Room: "),
            div({ class: "selectContainer", style: "display: flex; gap: 5px; align-items: center; flex-grow: 1;" },
                this._roomCodeInput = input({ type: "text", readonly: true, style: "flex-grow: 1; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: " + ColorConfig.primaryText + "; font-family: monospace; font-size: 14px; padding: 4px; text-align: center;" }),
                button({ title: "Copy Code", style: "padding: 4px 8px; cursor: pointer; border-radius: 12px;", onclick: () => {
                    navigator.clipboard.writeText(this._roomCodeInput.value);
                    alert("Room code copied!");
                } }, "📋")
            )
        );

        this._inviteLinkRow = div({ class: "selectRow", style: "display: none; margin: 5px 0; align-items: center;" },
            span({ class: "tip", style: "font-size: 11px; flex-shrink: 0; width: 60px;" }, "Link: "),
            div({ class: "selectContainer", style: "display: flex; gap: 4px; align-items: center; flex-grow: 1;" },
                this._inviteLinkInput = input({ type: "text", readonly: true, style: "flex-grow: 1; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: " + ColorConfig.primaryText + "; font-size: 8px; padding: 4px;" }),
                button({ title: "Copy Link", style: "padding: 4px 8px; cursor: pointer; border-radius: 4px;", onclick: () => {
                    navigator.clipboard.writeText(this._inviteLinkInput.value);
                    alert("Invite link copied!");
                } }, "📋")
            )
        );

        this._joinRoomRow = div({ class: "selectRow", style: "margin: 8px 0; align-items: center;" },
            span({ class: "tip", style: "font-size: 11px; flex-shrink: 0; width: 60px;" }, "Join: "),
             div({ class: "selectContainer", style: "display: flex; gap: 5px; align-items: center; flex-grow: 1;" },
                this._joinCodeInput = input({ type: "text", placeholder: "CODE", maxlength: "6", style: "width: 70px; text-transform: uppercase; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: " + ColorConfig.primaryText + "; padding: 4px; font-family: monospace;" }),
                button({ style: "padding: 4px 10px; cursor: pointer; border-radius: 12px;", onclick: () => {
                    const code = this._joinCodeInput.value.trim();
                    if (code) window.boneboxParty.join(code);
                } }, "Join")
            )
        );

        this._collaborationGroup = div({ class: "editor-song-settings", style: "margin-top: 10px; padding: 10px; background: rgba(148, 100, 255, 0.05); border: 1px solid rgba(148, 100, 255, 0.2); border-radius: 12px;" },
            div({ style: "text-align: center; color: " + ColorConfig.secondaryText + "; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: bold;" }, "Collaboration"),
            this._collaborationToggle,
            this._roomCodeRow,
            this._inviteLinkRow,
            this._joinRoomRow
        );

        if (window.boneboxParty) {
            window.boneboxParty.onUpdate(() => this._updateCollaborationUI());
            setTimeout(() => this._updateCollaborationUI(), 100);
        }

        this._songSettingsArea = div({ class: "song-settings-area" },
            div({ class: "editor-controls" },
                div({ class: "editor-song-settings" },
                    div({ style: "margin: 3px 0; position: relative; text-align: center; color: " + ColorConfig.secondaryText + ";" },
                        div({ class: "tip", style: "flex-shrink: 0; position:absolute; left: 0; top: 0; width: 12px; height: 12px", onclick: () => this._openPrompt("usedPattern") },
                            SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 0; pointer-events: none;", width: "12px", height: "12px", "margin-right": "0.5em", viewBox: "-6 -6 12 12" },
                                this._usedPatternIndicator,
                            ),
                        ),
                        div({ class: "tip", style: "flex-shrink: 0; position: absolute; left: 14px; top: 0; width: 12px; height: 12px", onclick: () => this._openPrompt("usedInstrument") },
                            SVG.svg({ style: "flex-shrink: 0; position: absolute; left: 0; top: 0; pointer-events: none;", width: "12px", height: "12px", "margin-right": "1em", viewBox: "-6 -6 12 12" },
                                this._usedInstrumentIndicator,
                            ),
                        ),
                        "Song Settings",
                        div({ style: "width: 100%; left: 0; top: -1px; position:absolute; overflow-x:clip;" }, this._jumpToModIndicator),
                    ),
                ),
                div({ class: "selectRow" },
                    span({ class: "tip", onclick: () => this._openPrompt("scale") }, "Scale: "),
                    div({ class: "selectContainer" }, this._scaleSelect),
                ),
                div({ class: "selectRow" },
                    span({ class: "tip", onclick: () => this._openPrompt("key") }, "Key: "),
                    div({ class: "selectContainer" }, this._keySelect),
                ),
                div({ class: "selectRow" },
                    span({ class: "tip", onclick: () => this._openPrompt("tempo") }, "Tempo: "),
                    span({ style: "display: flex;" },
                        this._tempoSlider.container,
                        this._tempoStepper,
                    ),
                ),
                div({ class: "selectRow" },
                    span({ class: "tip", onclick: () => this._openPrompt("rhythm") }, "Rhythm: "),
                    div({ class: "selectContainer" }, this._rhythmSelect),
                ),
                this._collaborationGroup,
            ),
        );
    }
      __init201() {
        this._instrumentSettingsArea = div({ class: "instrument-settings-area" },
            this._instrumentSettingsGroup,
            this._modulatorGroup
        );
    }
      __init202() {
        this._settingsArea = div({ class: "settings-area noSelection" },
            div({ class: "version-area" },
                div({ style: `text-align: center; margin: 3px 0; color: ${ColorConfig.secondaryText};` },
                    this._songTitleInputBox.input,
                ),
            ),
            div({ class: "play-pause-area" },
                this._volumeBarBox,
                div({ class: "playback-bar-controls" },
                    this._playButton,
                    this._pauseButton,
                    this._recordButton,
                    this._stopButton,
                    this._prevBarButton,
                    this._nextBarButton,
                ),
                div({ class: "playback-volume-controls" },
                    span({ class: "volume-speaker" }),
                    this._volumeSlider.container,
                ),
            ),
            this._menuArea,
            this._songSettingsArea,
            this._instrumentSettingsArea,
        );
    }

      __init203() {this.mainLayer = div({ class: "beepboxEditor", tabIndex: "0" },
        this._patternArea,
        this._trackArea,
        this._settingsArea,
        this._promptContainer,
    )}

     __init204() {this._wasPlaying = false}
     __init205() {this._currentPromptName = null}
     __init206() {this._highlightedInstrumentIndex = -1}
     __init207() {this._renderedInstrumentCount = 0}
     __init208() {this._renderedIsPlaying = false}
     __init209() {this._renderedIsRecording = false}
     __init210() {this._renderedShowRecordButton = false}
     __init211() {this._renderedCtrlHeld = false}
     __init212() {this._ctrlHeld = false}
     __init213() {this._shiftHeld = false}
     __init214() {this._deactivatedInstruments = false}
      __init215() {this._operatorRows = []}
      __init216() {this._operatorAmplitudeSliders = []}
      __init217() {this._operatorFrequencySelects = []}
      __init218() {this._operatorDropdowns = []}
      __init219() {this._operatorWaveformSelects = []}
      __init220() {this._operatorWaveformHints = []}
      __init221() {this._operatorWaveformPulsewidthSliders = []}
      __init222() {this._operatorDropdownRows = []}
      __init223() {this._operatorDropdownGroups = []}
      __init224() {this._drumsetSpectrumEditors = []}
      __init225() {this._drumsetEnvelopeSelects = []}
     __init226() {this._showModSliders = []}
     __init227() {this._newShowModSliders = []}
     __init228() {this._modSliderValues = []}
     __init229() {this._hasActiveModSliders = false}

     __init230() {this._openPanDropdown = false}
     __init231() {this._openVibratoDropdown = false}
     __init232() {this._openEnvelopeDropdown = false}
     __init233() {this._openChordDropdown = false}
     __init234() {this._openTransitionDropdown = false}
     __init235() {this._openOperatorDropdowns = []}

     __init236() {this.outVolumeHistoricTimer = 0}
     __init237() {this.outVolumeHistoricCap = 0}
     __init238() {this.lastOutVolumeCap = 0}
     __init239() {this.patternUsed = false}
     __init240() {this._modRecTimeout = -1}

    constructor(_doc) {
        this._doc = _doc;
        for (let i = 6; i <= 290; i++) {
            const method = "__init" + i;
            if (typeof SongEditor.prototype[method] === "function") {
                SongEditor.prototype[method].call(this);
            }
        }
        this._doc.notifier.watch(this.whenUpdated);
        this._doc.modRecordingHandler = () => { this.handleModRecording() };
        new MidiInputHandler(this._doc);
        window.addEventListener("resize", this.whenUpdated);
        window.requestAnimationFrame(this.updatePlayButton);
        window.requestAnimationFrame(this._animate);

        if (!("share" in navigator)) {
            this._fileMenu.removeChild(this._fileMenu.querySelector("[value='shareUrl']"));
        }

        this._scaleSelect.appendChild(optgroup({ label: "Edit" },
            option({ value: "forceScale" }, "Snap Notes To Scale"),
        ));
        this._keySelect.appendChild(optgroup({ label: "Edit" },
            option({ value: "detectKey" }, "Detect Key"),
        ));
        this._rhythmSelect.appendChild(optgroup({ label: "Edit" },
            option({ value: "forceRhythm" }, "Snap Notes To Rhythm"),
        ));

        this._vibratoSelect.appendChild(option({ hidden: true, value: 5 }, "custom"));

        this._showModSliders = new Array(Config.modulators.length);
        this._modSliderValues = new Array(Config.modulators.length);

        this._phaseModGroup.appendChild(div({ class: "selectRow", style: `color: ${ColorConfig.secondaryText}; height: 1em; margin-top: 0.5em;` },
            div({ style: "margin-right: .1em; visibility: hidden;" }, 1 + "."),
            div({ style: "width: 3em; margin-right: .3em;", class: "tip", onclick: () => this._openPrompt("operatorFrequency") }, "Freq:"),
            div({ class: "tip", onclick: () => this._openPrompt("operatorVolume") }, "Volume:"),
        ));
        for (let i = 0; i < Config.operatorCount; i++) {
            const operatorIndex = i;
            const operatorNumber = div({ style: "margin-right: 0px; color: " + ColorConfig.secondaryText + ";" }, i + 1 + "");
            const frequencySelect = buildOptions(select({ style: "width: 100%;", title: "Frequency" }), Config.operatorFrequencies.map(freq => freq.name));
            const amplitudeSlider = new Slider(input({ type: "range", min: "0", max: Config.operatorAmplitudeMax, value: "0", step: "1", title: "Volume" }), this._doc, (oldValue, newValue) => new ChangeOperatorAmplitude(this._doc, operatorIndex, oldValue, newValue), false);
            const waveformSelect = buildOptions(select({ style: "width: 100%;", title: "Waveform" }), Config.operatorWaves.map(wave => wave.name));
            const waveformDropdown = button({ style: "margin-left:0em; margin-right: 2px; height:1.5em; width: 8px; max-width: 10px; padding: 0px; font-size: 8px;", onclick: () => this._toggleDropdownMenu(DropdownID.FM, i) }, "▼");
            const waveformDropdownHint = span({ class: "tip", style: "margin-left: 10px;", onclick: () => this._openPrompt("operatorWaveform") }, "Wave:");
            const waveformPulsewidthSlider = new Slider(input({ style: "margin-left: 10px; width: 85%;", type: "range", min: "0", max: Config.pwmOperatorWaves.length - 1, value: "0", step: "1", title: "Pulse Width" }), this._doc, (oldValue, newValue) => new ChangeOperatorPulseWidth(this._doc, operatorIndex, oldValue, newValue), true);
            const waveformDropdownRow = div({ class: "selectRow" }, waveformDropdownHint, waveformPulsewidthSlider.container,
                div({ class: "selectContainer", style: "width: 6em; margin-left: .3em;" }, waveformSelect));
            const waveformDropdownGroup = div({ class: "operatorRow" }, waveformDropdownRow);
            const row = div({ class: "selectRow" },
                operatorNumber,
                waveformDropdown,
                div({ class: "selectContainer", style: "width: 3em; margin-right: .3em;" }, frequencySelect),
                amplitudeSlider.container,
            );
            this._phaseModGroup.appendChild(row);
            this._operatorRows[i] = row;
            this._operatorAmplitudeSliders[i] = amplitudeSlider;
            this._operatorFrequencySelects[i] = frequencySelect;
            this._operatorDropdowns[i] = waveformDropdown;
            this._operatorWaveformHints[i] = waveformDropdownHint;
            this._operatorWaveformSelects[i] = waveformSelect;
            this._operatorWaveformPulsewidthSliders[i] = waveformPulsewidthSlider;
            this._operatorDropdownRows[i] = waveformDropdownRow;
            this._phaseModGroup.appendChild(waveformDropdownGroup);
            this._operatorDropdownGroups[i] = waveformDropdownGroup;
            this._openOperatorDropdowns[i] = false;

            waveformSelect.addEventListener("change", () => {
                this._doc.record(new ChangeOperatorWaveform(this._doc, operatorIndex, waveformSelect.selectedIndex));
            });

            frequencySelect.addEventListener("change", () => {
                this._doc.record(new ChangeOperatorFrequency(this._doc, operatorIndex, frequencySelect.selectedIndex));
            });
        }

        this._drumsetGroup.appendChild(
            div({ class: "selectRow" },
                span({ class: "tip", onclick: () => this._openPrompt("drumsetEnvelope") }, "Envelope:"),
                span({ class: "tip", onclick: () => this._openPrompt("drumsetSpectrum") }, "Spectrum:"),
            ),
        );
        for (let i = Config.drumCount - 1; i >= 0; i--) {
            const drumIndex = i;
            const spectrumEditor = new SpectrumEditor(this._doc, drumIndex);
            spectrumEditor.container.addEventListener("mousedown", this.refocusStage);
            this._drumsetSpectrumEditors[i] = spectrumEditor;

            const envelopeSelect = buildOptions(select({ style: "width: 100%;", title: "Filter Envelope" }), Config.envelopes.map(envelope => envelope.name));
            this._drumsetEnvelopeSelects[i] = envelopeSelect;
            envelopeSelect.addEventListener("change", () => {
                this._doc.record(new ChangeDrumsetEnvelope(this._doc, drumIndex, envelopeSelect.selectedIndex));
            });

            const row = div({ class: "selectRow" },
                div({ class: "selectContainer", style: "width: 5em; margin-right: .3em;" }, envelopeSelect),
                this._drumsetSpectrumEditors[i].container,
            );
            this._drumsetGroup.appendChild(row);
        }

        this._modNameRows = [];
        this._modChannelBoxes = [];
        this._modInstrumentBoxes = [];
        this._modSetRows = [];
        this._modSetBoxes = [];
        this._modFilterRows = [];
        this._modFilterBoxes = [];
        this._modTargetIndicators = [];
        for (let mod = 0; mod < Config.modCount; mod++) {

            let modChannelBox = select({ style: "width: 100%; color: currentColor; text-overflow:ellipsis;" });
            let modInstrumentBox = select({ style: "width: 100%; color: currentColor;" });

            let modNameRow = div({ class: "operatorRow", style: "height: 1em; margin-bottom: 0.65em;" },
                div({ class: "tip", style: "width: 10%; max-width: 5.4em;", id: "modChannelText" + mod, onclick: () => this._openPrompt("modChannel") }, "Ch:"),
                div({ class: "selectContainer", style: 'width: 35%;' }, modChannelBox),
                div({ class: "tip", style: "width: 1.2em; margin-left: 0.8em;", id: "modInstrumentText" + mod, onclick: () => this._openPrompt("modInstrument") }, "Ins:"),
                div({ class: "selectContainer", style: "width: 10%;" }, modInstrumentBox),
            );

            let modSetBox = select();
            let modFilterBox = select();
            let modSetRow = div({ class: "selectRow", id: "modSettingText" + mod, style: "margin-bottom: 0.9em; color: currentColor;" }, span({ class: "tip", onclick: () => this._openPrompt("modSet") }, "Setting: "), span({ class: "tip", style: "font-size:x-small;", onclick: () => this._openPrompt("modSetInfo" + mod) }, "?"), div({ class: "selectContainer" }, modSetBox));
            let modFilterRow = div({ class: "selectRow", id: "modFilterText" + mod, style: "margin-bottom: 0.9em; color: currentColor;" }, span({ class: "tip", onclick: () => this._openPrompt("modFilter" + mod) }, "Target: "), div({ class: "selectContainer" }, modFilterBox));

            // @jummbus: I could template this up above and simply create from the template, especially since I also reuse it in song settings, but unsure how to do that with imperative-html :P
            let modTarget = SVG.svg({ style: "transform: translate(0px, 1px);", width: "1.5em", height: "1em", viewBox: "0 0 200 200" }, [
                SVG.path({ d: "M90 155 l0 -45 -45 0 c-25 0 -45 -4 -45 -10 0 -5 20 -10 45 -10 l45 0 0 -45 c0 -25 5 -45 10 -45 6 0 10 20 10 45 l0 45 45 0 c25 0 45 5 45 10 0 6 -20 10 -45 10 l -45 0 0 45 c0 25 -4 45 -10 45 -5 0 -10 -20 -10 -45z" }),
                SVG.path({ d: "M42 158 c-15 -15 -16 -38 -2 -38 6 0 10 7 10 15 0 8 7 15 15 15 8 0 15 5 15 10 0 14 -23 13 -38 -2z" }),
                SVG.path({ d: "M120 160 c0 -5 7 -10 15 -10 8 0 15 -7 15 -15 0 -8 5 -15 10 -15 14 0 13 23 -2 38 -15 15 -38 16 -38 2z" }),
                SVG.path({ d: "M32 58 c3 -23 48 -40 48 -19 0 6 -7 11 -15 11 -8 0 -15 7 -15 15 0 8 -5 15 -11 15 -6 0 -9 -10 -7 -22z" }),
                SVG.path({ d: "M150 65 c0 -8 -7 -15 -15 -15 -8 0 -15 -4 -15 -10 0 -14 23 -13 38 2 15 15 16 38 2 38 -5 0 -10 -7 -10 -15z" })]);

            this._modNameRows.push(modNameRow);
            this._modChannelBoxes.push(modChannelBox);
            this._modInstrumentBoxes.push(modInstrumentBox);
            this._modSetRows.push(modSetRow);
            this._modSetBoxes.push(modSetBox);
            this._modFilterRows.push(modFilterRow);
            this._modFilterBoxes.push(modFilterBox);
            this._modTargetIndicators.push(modTarget);

            this._modulatorGroup.appendChild(div({ style: "margin: 3px 0; font-weight: bold; margin-bottom: 0.7em; text-align: center; color: " + ColorConfig.secondaryText + "; background: " + ColorConfig.uiWidgetBackground + ";" }, ["Modulator " + (mod + 1), modTarget]));
            this._modulatorGroup.appendChild(modNameRow);
            this._modulatorGroup.appendChild(modSetRow);
            this._modulatorGroup.appendChild(modFilterRow);

        }

        // @jummbus - Unsure why this hack is needed for alignment, but I've never been a css wiz...
        this._pitchShiftSlider.container.style.setProperty("transform", "translate(0px, 3px)");
        this._pitchShiftSlider.container.style.setProperty("width", "100%");

        this._fileMenu.addEventListener("change", this._fileMenuHandler);
        this._editMenu.addEventListener("change", this._editMenuHandler);
        this._optionsMenu.addEventListener("change", this._optionsMenuHandler);
        this._customWavePresetDrop.addEventListener("change", this._customWavePresetHandler);
        this._tempoStepper.addEventListener("change", this._whenSetTempo);
        this._scaleSelect.addEventListener("change", this._whenSetScale);
        this._keySelect.addEventListener("change", this._whenSetKey);
        this._rhythmSelect.addEventListener("change", this._whenSetRhythm);
        //this._pitchedPresetSelect.addEventListener("change", this._whenSetPitchedPreset);
        //this._drumPresetSelect.addEventListener("change", this._whenSetDrumPreset);
        this._algorithmSelect.addEventListener("change", this._whenSetAlgorithm);
        this._instrumentsButtonBar.addEventListener("click", this._whenSelectInstrument);
        //this._customizeInstrumentButton.addEventListener("click", this._whenCustomizePressed);
        this._feedbackTypeSelect.addEventListener("change", this._whenSetFeedbackType);
        this._chipWaveSelect.addEventListener("change", this._whenSetChipWave);
        this._chipNoiseSelect.addEventListener("change", this._whenSetNoiseWave);
        this._transitionSelect.addEventListener("change", this._whenSetTransition);
        this._effectsSelect.addEventListener("change", this._whenSetEffects);
        this._unisonSelect.addEventListener("change", this._whenSetUnison);
        this._chordSelect.addEventListener("change", this._whenSetChord);
        this._vibratoSelect.addEventListener("change", this._whenSetVibrato);
        this._vibratoTypeSelect.addEventListener("change", this._whenSetVibratoType);
        this._playButton.addEventListener("click", this.togglePlay);
        this._pauseButton.addEventListener("click", this.togglePlay);
        this._recordButton.addEventListener("click", this._toggleRecord);
        this._stopButton.addEventListener("click", this._toggleRecord);
        // Start recording instead of opening context menu when control-clicking the record button on a Mac.
        this._recordButton.addEventListener("contextmenu", (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
                this._toggleRecord();
            }
        });
        this._stopButton.addEventListener("contextmenu", (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
                this._toggleRecord();
            }
        });
        this._prevBarButton.addEventListener("click", this._whenPrevBarPressed);
        this._nextBarButton.addEventListener("click", this._whenNextBarPressed);
        this._volumeSlider.input.addEventListener("input", this._setVolumeSlider);
        this._zoomInButton.addEventListener("click", this._zoomIn);
        this._zoomOutButton.addEventListener("click", this._zoomOut);
        this._patternArea.addEventListener("mousedown", this._refocusStageNotEditing);
        this._trackArea.addEventListener("mousedown", this.refocusStage);

        // The song volume slider is styled slightly different than the class' default.
        this._volumeSlider.container.style.setProperty("flex-grow", "1");
        this._volumeSlider.container.style.setProperty("display", "flex");

        this._volumeBarContainer.style.setProperty("flex-grow", "1");
        this._volumeBarContainer.style.setProperty("display", "flex");

        // Also, any slider with a multiplicative effect instead of a replacement effect gets a different mod color, and a round slider.
        this._volumeSlider.container.style.setProperty("--mod-color", ColorConfig.multiplicativeModSlider);
        this._volumeSlider.container.style.setProperty("--mod-border-radius", "50%");
        this._instrumentVolumeSlider.container.style.setProperty("--mod-color", ColorConfig.multiplicativeModSlider);
        this._instrumentVolumeSlider.container.style.setProperty("--mod-border-radius", "50%");
        this._feedbackAmplitudeSlider.container.style.setProperty("--mod-color", ColorConfig.multiplicativeModSlider);
        this._feedbackAmplitudeSlider.container.style.setProperty("--mod-border-radius", "50%");
        for (let i = 0; i < Config.operatorCount; i++) {
            this._operatorAmplitudeSliders[i].container.style.setProperty("--mod-color", ColorConfig.multiplicativeModSlider);
            this._operatorAmplitudeSliders[i].container.style.setProperty("--mod-border-radius", "50%");
        }

        let thisRef = this;
        for (let mod = 0; mod < Config.modCount; mod++) {
            this._modChannelBoxes[mod].addEventListener("change", function () { thisRef._whenSetModChannel(mod); });
            this._modInstrumentBoxes[mod].addEventListener("change", function () { thisRef._whenSetModInstrument(mod); });
            this._modSetBoxes[mod].addEventListener("change", function () { thisRef._whenSetModSetting(mod); });
            this._modFilterBoxes[mod].addEventListener("change", function () { thisRef._whenSetModFilter(mod); });
            this._modTargetIndicators[mod].addEventListener("click", function () { thisRef._whenClickModTarget(mod); });
        }

        this._jumpToModIndicator.addEventListener("click", function () { thisRef._whenClickJumpToModTarget() });

        this._patternArea.addEventListener("mousedown", this.refocusStage);
        this._fadeInOutEditor.container.addEventListener("mousedown", this.refocusStage);
        this._spectrumEditor.container.addEventListener("mousedown", this.refocusStage);
        this._eqFilterEditor.container.addEventListener("mousedown", this.refocusStage);
        this._noteFilterEditor.container.addEventListener("mousedown", this.refocusStage);
        this._harmonicsEditor.container.addEventListener("mousedown", this.refocusStage);
        this._tempoStepper.addEventListener("keydown", this._tempoStepperCaptureNumberKeys, false);
        this._addEnvelopeButton.addEventListener("click", this._addNewEnvelope);
        this._patternArea.addEventListener("contextmenu", this._disableCtrlContextMenu);
        this._trackArea.addEventListener("contextmenu", this._disableCtrlContextMenu);
        this.mainLayer.addEventListener("keydown", this._whenKeyPressed);
        this.mainLayer.addEventListener("keyup", this._whenKeyReleased);
        this.mainLayer.addEventListener("focusin", this._onFocusIn);
        this._instrumentCopyButton.addEventListener("click", this._copyInstrument.bind(this));
        this._instrumentPasteButton.addEventListener("click", this._pasteInstrument.bind(this));

        this._instrumentVolumeSliderInputBox.addEventListener("input", () => { this._doc.record(new ChangeVolume(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].volume, Math.min(25.0, Math.max(-25.0, Math.round(+this._instrumentVolumeSliderInputBox.value))))) });
        this._panSliderInputBox.addEventListener("input", () => { this._doc.record(new ChangePan(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].pan, Math.min(100.0, Math.max(0.0, Math.round(+this._panSliderInputBox.value))))) });
        this._pwmSliderInputBox.addEventListener("input", () => { this._doc.record(new ChangePulseWidth(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].pulseWidth, Math.min(Config.pulseWidthRange, Math.max(1.0, Math.round(+this._pwmSliderInputBox.value))))) });
        this._detuneSliderInputBox.addEventListener("input", () => { this._doc.record(new ChangeDetune(this._doc, this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].detune, Math.min(Config.detuneMax - Config.detuneCenter, Math.max(Config.detuneMin - Config.detuneCenter, Math.round(+this._detuneSliderInputBox.value))))) });
        this._customWaveDraw.addEventListener("input", () => { this._doc.record(new ChangeCustomWave(this._doc, this._customWaveDrawCanvas.newArray)) });
        this._twoNoteArpBox.addEventListener("input", () => { this._doc.record(new ChangeFastTwoNoteArp(this._doc, this._twoNoteArpBox.checked)) });
        this._clicklessTransitionBox.addEventListener("input", () => { this._doc.record(new ChangeClicklessTransition(this._doc, this._clicklessTransitionBox.checked)) });
        this._aliasingBox.addEventListener("input", () => { this._doc.record(new ChangeAliasing(this._doc, this._aliasingBox.checked)) });
        this._discreteEnvelopeBox.addEventListener("input", () => { this._doc.record(new ChangeDiscreteEnvelope(this._doc, this._discreteEnvelopeBox.checked)) });

        this._promptContainer.addEventListener("click", (event) => {
            if (event.target == this._promptContainer) {
                this._doc.undo();
            }
        });

        // Sorry, bypassing typescript type safety on this function because I want to use the new "passive" option.
		//this._trackAndMuteContainer.addEventListener("scroll", this._onTrackAreaScroll, {capture: false, passive: true});
		(this._trackAndMuteContainer.addEventListener)("scroll", this._onTrackAreaScroll, {capture: false, passive: true});

        if (isMobile) {
            const autoPlayOption = this._optionsMenu.querySelector("[value=autoPlay]");
            autoPlayOption.disabled = true;
            autoPlayOption.setAttribute("hidden", "");
        }

        // Beepbox uses availHeight too, but I have a display that fails the check even when one of the other layouts would look better on it. -jummbus
        if (window.screen.availWidth < 710 /*|| window.screen.availHeight < 710*/) {
            const layoutOption = this._optionsMenu.querySelector("[value=layout]");
            layoutOption.disabled = true;
            layoutOption.setAttribute("hidden", "");
        }
    }

     _toggleDropdownMenu(dropdown, submenu = 0) {
        let target = this._vibratoDropdown;
        let group = this._vibratoDropdownGroup;
        switch (dropdown) {
            case DropdownID.Envelope:
                target = this._envelopeDropdown;
                this._openEnvelopeDropdown = this._openEnvelopeDropdown ? false : true;
                group = this._envelopeDropdownGroup;
                break;
            case DropdownID.Vibrato:
                target = this._vibratoDropdown;
                this._openVibratoDropdown = this._openVibratoDropdown ? false : true;
                group = this._vibratoDropdownGroup;
                break;
            case DropdownID.Pan:
                target = this._panDropdown;
                this._openPanDropdown = this._openPanDropdown ? false : true;
                group = this._panDropdownGroup;
                break;
            case DropdownID.Chord:
                target = this._chordDropdown;
                this._openChordDropdown = this._openChordDropdown ? false : true;
                group = this._chordDropdownGroup;
                break;
            case DropdownID.Transition:
                target = this._transitionDropdown;
                this._openTransitionDropdown = this._openTransitionDropdown ? false : true;
                group = this._transitionDropdownGroup;
                break;
            case DropdownID.FM:
                target = this._operatorDropdowns[submenu];
                this._openOperatorDropdowns[submenu] = this._openOperatorDropdowns[submenu] ? false : true;
                group = this._operatorDropdownGroups[submenu];
                break;
        }

        if (target.textContent == "▼") {
            let instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
            target.textContent = "▲";
            if (group != this._chordDropdownGroup) {
                group.style.display = "";
            } // Only show arpeggio dropdown if chord arpeggiates
            else if (instrument.chord == Config.chords.dictionary["arpeggio"].index) {
                group.style.display = "";
            }

            for (let i = 0; i < group.children.length; i++) {
                // A timeout is needed so that the previous 0s, 0 opacity settings can be applied. They're not done until the group is visible again because display: none prunes animation steps.
                setTimeout(() => {
                    (group.children[i] ).style.animationDelay = '0.17s';
                    (group.children[i] ).style.opacity = '1';}
                );
            }

        }
        else {
            for (let i = 0; i < group.children.length; i++) {
                (group.children[i] ).style.animationDelay = '0s';
                (group.children[i] ).style.opacity = '0';
            }
            target.textContent = "▼";
            group.style.display = "none";
        }
    }

     _modSliderUpdate() {

        if (!this._doc.synth.playing) {
            this._hasActiveModSliders = false;

            for (let setting = 0; setting < Config.modulators.length; setting++) {
                if (this._showModSliders[setting] == true) {
                    this._showModSliders[setting] = false;
                    this._newShowModSliders[setting] = false;
                    let slider = this.getSliderForModSetting(setting);

                    if (slider != null) {
                        slider.container.classList.remove("modSlider");

                    }
                }
            }
        }
        else {

            let instrument = this._doc.getCurrentInstrument();
            const anyModActive = this._doc.synth.isAnyModActive(this._doc.channel, instrument);

            // Check and update mod values on sliders
            if (anyModActive) {

                let instrument = this._doc.getCurrentInstrument();

                function updateModSlider(editor, slider, setting, channel, instrument) {
                    if (editor._doc.synth.isModActive(setting, channel, instrument)) {
                        let currentVal = (editor._doc.synth.getModValue(setting, channel, instrument, false) - Config.modulators[setting].convertRealFactor) / Config.modulators[setting].maxRawVol;
                        if (currentVal != editor._modSliderValues[setting]) {
                            editor._modSliderValues[setting] = currentVal;
                            slider.container.style.setProperty("--mod-position", (currentVal * 96.0 + 2.0) + "%");
                        }
                        return true;
                    }
                    return false;
                }

                // Set mod sliders to present values
                for (let setting = 0; setting < Config.modulators.length; setting++) {
                    // Set to last value
                    this._newShowModSliders[setting] = this._showModSliders[setting];

                    // Check for newer value
                    let slider = this.getSliderForModSetting(setting);
                    if (slider != null) {
                        this._newShowModSliders[setting] = updateModSlider(this, slider, setting, this._doc.channel, instrument);
                    }
                }

            }
            else if (this._hasActiveModSliders) {
                // Zero out show-mod-slider settings (since none are active) to kill active mod slider flag
                for (let setting = 0; setting < Config.modulators.length; setting++) {
                    this._newShowModSliders[setting] = false;
                }
            }

            // Class or unclass mod sliders based on present status
            if (anyModActive || this._hasActiveModSliders) {

                let anySliderActive = false;

                for (let setting = 0; setting < Config.modulators.length; setting++) {
                    if (this._newShowModSliders[setting] != this._showModSliders[setting]) {
                        this._showModSliders[setting] = this._newShowModSliders[setting];
                        let slider = this.getSliderForModSetting(setting);

                        if (slider != null) {

                            if (this._showModSliders[setting] == true) {
                                slider.container.classList.add("modSlider");
                            }
                            else {
                                slider.container.classList.remove("modSlider");
                            }

                        }
                    }

                    if (this._newShowModSliders[setting] == true)
                        anySliderActive = true;
                }

                this._hasActiveModSliders = anySliderActive;

            }

        }

    }

     getSliderForModSetting(setting) {
        switch (setting) {
            case Config.modulators.dictionary["pan"].index:
                return this._panSlider;
            case Config.modulators.dictionary["detune"].index:
                return this._detuneSlider;
            case Config.modulators.dictionary["fm slider 1"].index:
                return this._operatorAmplitudeSliders[0];
            case Config.modulators.dictionary["fm slider 2"].index:
                return this._operatorAmplitudeSliders[1];
            case Config.modulators.dictionary["fm slider 3"].index:
                return this._operatorAmplitudeSliders[2];
            case Config.modulators.dictionary["fm slider 4"].index:
                return this._operatorAmplitudeSliders[3];
            case Config.modulators.dictionary["fm feedback"].index:
                return this._feedbackAmplitudeSlider;
            case Config.modulators.dictionary["pulse width"].index:
                return this._pulseWidthSlider;
            case Config.modulators.dictionary["reverb"].index:
                return this._reverbSlider;
            case Config.modulators.dictionary["distortion"].index:
                return this._distortionSlider;
            case Config.modulators.dictionary["note volume"].index:
                // So, this should technically not affect this slider, but it will look better as legacy songs used this mod as 'volume'.
                // In the case that mix volume is used as well, they'd fight for the display, so just don't use this.
                if (!this._showModSliders[Config.modulators.dictionary["mix volume"].index])
                    return this._instrumentVolumeSlider;
                return null;
            case Config.modulators.dictionary["mix volume"].index:
                return this._instrumentVolumeSlider;
            case Config.modulators.dictionary["vibrato depth"].index:
                return this._vibratoDepthSlider;
            case Config.modulators.dictionary["vibrato speed"].index:
                return this._vibratoSpeedSlider;
            case Config.modulators.dictionary["vibrato delay"].index:
                return this._vibratoDelaySlider;
            case Config.modulators.dictionary["arp speed"].index:
                return this._arpeggioSpeedSlider;
            case Config.modulators.dictionary["pan delay"].index:
                return this._panDelaySlider;
            case Config.modulators.dictionary["tempo"].index:
                return this._tempoSlider;
            case Config.modulators.dictionary["song volume"].index:
                return this._volumeSlider;
            case Config.modulators.dictionary["eq filt cut"].index:
                return this._eqFilterSimpleCutSlider;
            case Config.modulators.dictionary["eq filt peak"].index:
                return this._eqFilterSimplePeakSlider;
            case Config.modulators.dictionary["note filt cut"].index:
                return this._noteFilterSimpleCutSlider;
            case Config.modulators.dictionary["note filt peak"].index:
                return this._noteFilterSimplePeakSlider;
            case Config.modulators.dictionary["bit crush"].index:
                return this._bitcrusherQuantizationSlider;
            case Config.modulators.dictionary["freq crush"].index:
                return this._bitcrusherFreqSlider;
            case Config.modulators.dictionary["pitch shift"].index:
                return this._pitchShiftSlider;
            case Config.modulators.dictionary["chorus"].index:
                return this._chorusSlider;
            case Config.modulators.dictionary["echo"].index:
                return this._echoSustainSlider;
            case Config.modulators.dictionary["echo delay"].index:
                return this._echoDelaySlider;
            case Config.modulators.dictionary["sustain"].index:
                return this._stringSustainSlider;
            case Config.modulators.dictionary["envelope speed"].index:
                return this._envelopeSpeedSlider;
            case Config.modulators.dictionary["dynamism"].index:
                return this._supersawDynamismSlider;
            case Config.modulators.dictionary["spread"].index:
                return this._supersawSpreadSlider;
            case Config.modulators.dictionary["saw shape"].index:
                return this._supersawShapeSlider;
            default:
                return null;
        }

    }

     _openPrompt(promptName) {
        this._doc.openPrompt(promptName);
        this._setPrompt(promptName);
    }

     _setPrompt(promptName) {
        if (this._currentPromptName == promptName) return;
        this._currentPromptName = promptName;

        if (this.prompt) {
            if (this._wasPlaying && !(this.prompt instanceof TipPrompt || this.prompt instanceof LimiterPrompt || this.prompt instanceof CustomChipPrompt || this.prompt instanceof CustomFilterPrompt || this.prompt instanceof SustainPrompt)) {
                this._doc.performance.play();
            }
            this._wasPlaying = false;
            this._promptContainer.style.display = "none";
            this._promptContainer.removeChild(this.prompt.container);
            this.prompt.cleanUp();
            this.prompt = null;
            this.refocusStage();
        }

        if (promptName) {
            switch (promptName) {
                case "export":
                    this.prompt = new ExportPrompt(this._doc);
                    break;
                case "import":
                    this.prompt = new ImportPrompt(this._doc);
                    break;
                case "songRecovery":
                    this.prompt = new SongRecoveryPrompt(this._doc);
                    break;
                case "barCount":
                    this.prompt = new SongDurationPrompt(this._doc);
                    break;
                case "beatsPerBar":
                    this.prompt = new BeatsPerBarPrompt(this._doc);
                    break;
                case "newProject":
                    this.prompt = new NewProjectPrompt(this._doc, this._doc.newProjectCallback);
                    break;
                case "moveNotesSideways":
                    this.prompt = new MoveNotesSidewaysPrompt(this._doc);
                    break;
                case "channelSettings":
                    this.prompt = new ChannelSettingsPrompt(this._doc);
                    break;
                case "limiterSettings":
                    this.prompt = new LimiterPrompt(this._doc, this);
                    break;
                case "customChipSettings":
                    this.prompt = new CustomChipPrompt(this._doc, this);
                    break;
                case "customEQFilterSettings":
                    this.prompt = new CustomFilterPrompt(this._doc, this, false);
                    break;
                case "customNoteFilterSettings":
                    this.prompt = new CustomFilterPrompt(this._doc, this, true);
                    break;
                case "theme":
                    this.prompt = new ThemePrompt(this._doc);
                    break;
                case "layout":
                    this.prompt = new LayoutPrompt(this._doc);
                    break;
                case "recordingSetup":
                    this.prompt = new RecordingSetupPrompt(this._doc);
                    break;
				case "stringSustain":
					this.prompt = new SustainPrompt(this._doc);
					break;
                default:
                    this.prompt = new TipPrompt(this._doc, promptName);
                    break;
            }

            if (this.prompt) {
                if (!(this.prompt instanceof TipPrompt || this.prompt instanceof LimiterPrompt || this.prompt instanceof CustomChipPrompt || this.prompt instanceof CustomFilterPrompt || this.prompt instanceof SustainPrompt)) {
                    this._wasPlaying = this._doc.synth.playing;
                    this._doc.performance.pause();
                }
                this._promptContainer.style.display = "";
                this._promptContainer.appendChild(this.prompt.container);
            }
        }
    }

     __init241() {this.refocusStage = () => {
        this.mainLayer.focus({ preventScroll: true });
    }}

     __init242() {this._onFocusIn = (event) => {
        if (this._doc.synth.recording && event.target != this.mainLayer && event.target != this._stopButton && event.target != this._volumeSlider.input) {
            // Don't allow using tab to focus on the song settings while recording,
            // since interacting with them while recording would mess up the recording.
            this.refocusStage();
        }
    }}

    // Refocus stage if a sub-element that needs focus isn't being edited.
     __init243() {this._refocusStageNotEditing = () => {
        if (!this._patternEditor.editingModLabel)
            this.mainLayer.focus({ preventScroll: true });
    }}

     changeBarScrollPos(offset) {
        this._barScrollBar.changePos(offset);
    }

     __init244() {this.whenUpdated = () => {
        const prefs = this._doc.prefs;
        this._muteEditor.container.style.display = prefs.enableChannelMuting ? "" : "none";
        const trackBounds = this._trackVisibleArea.getBoundingClientRect();
        this._doc.trackVisibleBars = Math.floor((trackBounds.right - trackBounds.left - (prefs.enableChannelMuting ? 32 : 0)) / this._doc.getBarWidth());
        this._doc.trackVisibleChannels = Math.floor((trackBounds.bottom - trackBounds.top - 30) / ChannelRow.patternHeight);
		for (let i = this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount; i < this._doc.song.channels.length; i++) {
            const channel = this._doc.song.channels[i];
            for (let j = 0; j < channel.instruments.length; j++) {
                this._doc.synth.determineInvalidModulators(channel.instruments[j]);
            }
        }
        this._barScrollBar.render();
        this._trackEditor.render();
        this._muteEditor.render();

        this._trackAndMuteContainer.scrollLeft = this._doc.barScrollPos * this._doc.getBarWidth();
		this._trackAndMuteContainer.scrollTop = this._doc.channelScrollPos * ChannelRow.patternHeight;

        if (document.activeElement != this._patternEditor.modDragValueLabel && this._patternEditor.editingModLabel) {
            this._patternEditor.stopEditingModLabel(false);
        }

        this._piano.container.style.display = prefs.showLetters ? "" : "none";
        this._octaveScrollBar.container.style.display = prefs.showScrollBar ? "" : "none";
        this._barScrollBar.container.style.display = this._doc.song.barCount > this._doc.trackVisibleBars ? "" : "none";
        this._volumeBarBox.style.display = this._doc.prefs.displayVolumeBar ? "" : "none";

        if (this._doc.getFullScreen()) {
            const semitoneHeight = this._patternEditorRow.clientHeight / this._doc.getVisiblePitchCount();
            const targetBeatWidth = semitoneHeight * 5;
            const minBeatWidth = this._patternEditorRow.clientWidth / (this._doc.song.beatsPerBar * 3);
            const maxBeatWidth = this._patternEditorRow.clientWidth / (this._doc.song.beatsPerBar + 2);
            const beatWidth = Math.max(minBeatWidth, Math.min(maxBeatWidth, targetBeatWidth));
            const patternEditorWidth = beatWidth * this._doc.song.beatsPerBar;

            this._patternEditorPrev.container.style.width = patternEditorWidth + "px";
            this._patternEditor.container.style.width = patternEditorWidth + "px";
            this._patternEditorNext.container.style.width = patternEditorWidth + "px";
            this._patternEditorPrev.container.style.flexShrink = "0";
            this._patternEditor.container.style.flexShrink = "0";
            this._patternEditorNext.container.style.flexShrink = "0";
            this._patternEditorPrev.container.style.display = "";
            this._patternEditorNext.container.style.display = "";
            this._patternEditorPrev.render();
            this._patternEditorNext.render();
            this._zoomInButton.style.display = (this._doc.channel < this._doc.song.pitchChannelCount) ? "" : "none";
            this._zoomOutButton.style.display = (this._doc.channel < this._doc.song.pitchChannelCount) ? "" : "none";
            this._zoomInButton.style.right = prefs.showScrollBar ? "24px" : "4px";
            this._zoomOutButton.style.right = prefs.showScrollBar ? "24px" : "4px";
        } else {
            this._patternEditor.container.style.width = "";
            this._patternEditor.container.style.flexShrink = "";
            this._patternEditorPrev.container.style.display = "none";
            this._patternEditorNext.container.style.display = "none";
            this._zoomInButton.style.display = "none";
            this._zoomOutButton.style.display = "none";
        }
        this._patternEditor.render();

        const optionCommands = [
            (prefs.autoPlay ? "✓ " : "　") + "Auto Play on Load",
            (prefs.autoFollow ? "✓ " : "　") + "Auto Follow Playhead",
            (prefs.enableNotePreview ? "✓ " : "　") + "Hear Added Notes",
            (prefs.showLetters ? "✓ " : "　") + "Show Piano Keys",
            (prefs.showFifth ? "✓ " : "　") + 'Highlight "Fifth" Note',
            (prefs.notesOutsideScale ? "✓ " : "　") + "Place Notes Out of Scale",
            (prefs.defaultScale == this._doc.song.scale ? "✓ " : "　") + "Set Current Scale as Default",
            (prefs.showChannels ? "✓ " : "　") + "Show All Channels",
            (prefs.showScrollBar ? "✓ " : "　") + "Show Octave Scroll Bar",
            (prefs.alwaysFineNoteVol ? "✓ " : "") + "Always Fine Note Volume",
            (prefs.enableChannelMuting ? "✓ " : "　") + "Enable Channel Muting",
            (prefs.displayBrowserUrl ? "✓ " : "　") + "Show Song Data in URL",
            (prefs.displayVolumeBar ? "✓ " : "　") + "Show Playback Volume",
            "　Set Layout...",
            "　Set Theme...",
            "　Note Recording...",
        ];
        for (let i = 0; i < optionCommands.length; i++) {
            const option = this._optionsMenu.children[i + 1];
            if (option.textContent != optionCommands[i]) option.textContent = optionCommands[i];
        }

        const channel = this._doc.song.channels[this._doc.channel];
        const instrumentIndex = this._doc.getCurrentInstrument();
        const instrument = channel.instruments[instrumentIndex];
        const wasActive = this.mainLayer.contains(document.activeElement);
        const activeElement = document.activeElement;
        const colors = ColorConfig.getChannelColor(this._doc.song, this._doc.channel);

        for (let i = this._effectsSelect.childElementCount - 1; i < Config.effectOrder.length; i++) {
            this._effectsSelect.appendChild(option({ value: i }));
        }
        this._effectsSelect.selectedIndex = -1;
        for (let i = 0; i < Config.effectOrder.length; i++) {
            let effectFlag = Config.effectOrder[i];
            const selected = ((instrument.effects & (1 << effectFlag)) != 0);
            const label = (selected ? "✓ " : "　") + Config.effectNames[effectFlag];
            const option = this._effectsSelect.children[i + 1];
            if (option.textContent != label) option.textContent = label;
        }

        setSelectedValue(this._scaleSelect, this._doc.song.scale);
        this._scaleSelect.title = Config.scales[this._doc.song.scale].realName;
        setSelectedValue(this._keySelect, Config.keys.length - 1 - this._doc.song.key);
        this._tempoSlider.updateValue(Math.max(0, Math.round(this._doc.song.tempo)));
        this._tempoStepper.value = Math.round(this._doc.song.tempo).toString();
        this._songTitleInputBox.updateValue(this._doc.song.title);

        this._eqFilterTypeRow.style.setProperty("--text-color-lit", colors.primaryNote);
        this._eqFilterTypeRow.style.setProperty("--text-color-dim", colors.secondaryNote);
        this._eqFilterTypeRow.style.setProperty("--background-color-lit", colors.primaryChannel);
        this._eqFilterTypeRow.style.setProperty("--background-color-dim", colors.secondaryChannel);

        if (instrument.eqFilterType) {
            this._eqFilterSimpleButton.classList.remove("deactivated");
            this._eqFilterAdvancedButton.classList.add("deactivated");
            this._eqFilterRow.style.display = "none";
            this._eqFilterSimpleCutRow.style.display = "";
            this._eqFilterSimplePeakRow.style.display = "";
        } else {
            this._eqFilterSimpleButton.classList.add("deactivated");
            this._eqFilterAdvancedButton.classList.remove("deactivated");
            this._eqFilterRow.style.display = "";
            this._eqFilterSimpleCutRow.style.display = "none";
            this._eqFilterSimplePeakRow.style.display = "none";
        }

        setSelectedValue(this._rhythmSelect, this._doc.song.rhythm);

        if (!this._doc.song.getChannelIsMod(this._doc.channel)) {

            this._customInstrumentSettingsGroup.style.display = "";
            this._panSliderRow.style.display = "";
            this._panDropdownGroup.style.display = (this._openPanDropdown ? "" : "none");
            this._detuneSliderRow.style.display = "";
            this._instrumentVolumeSliderRow.style.display = "";
            this._instrumentTypeSelectRow.style.setProperty("display", "");
            this._instrumentSettingsGroup.appendChild(this._instrumentCopyGroup);
            this._instrumentSettingsGroup.insertBefore(this._instrumentsButtonRow, this._instrumentSettingsGroup.firstChild);
            this._instrumentSettingsGroup.insertBefore(this._instrumentSettingsTextRow, this._instrumentSettingsGroup.firstChild);

            if (this._doc.song.channels[this._doc.channel].name == "") {
                this._instrumentSettingsTextRow.textContent = "Instrument Settings";
            }
            else {
                this._instrumentSettingsTextRow.textContent = this._doc.song.channels[this._doc.channel].name;
            }

            this._modulatorGroup.style.display = "none";

            // Check if current viewed pattern on channel is used anywhere
            // + Check if current instrument on channel is used anywhere
            // + Check if a mod targets this
            this._usageCheck(this._doc.channel, instrumentIndex);

            if (this._doc.song.getChannelIsNoise(this._doc.channel)) {
                this._pitchedPresetSelect.style.display = "none";
                this._drumPresetSelect.style.display = "";
                // Also hide select2
                $("#pitchPresetSelect").parent().hide();
                $("#drumPresetSelect").parent().show();

                setSelectedValue(this._drumPresetSelect, instrument.preset, true);
            } else {
                this._pitchedPresetSelect.style.display = "";
                this._drumPresetSelect.style.display = "none";

                // Also hide select2
                $("#pitchPresetSelect").parent().show();
                $("#drumPresetSelect").parent().hide();

                setSelectedValue(this._pitchedPresetSelect, instrument.preset, true);
            }

            if (instrument.type == InstrumentType.noise) {
                this._chipWaveSelectRow.style.display = "none";
                this._chipNoiseSelectRow.style.display = "";
                setSelectedValue(this._chipNoiseSelect, instrument.chipNoise, true);
            } else {
                this._chipNoiseSelectRow.style.display = "none";
            }
            if (instrument.type == InstrumentType.spectrum) {
                this._chipWaveSelectRow.style.display = "none";
                this._spectrumRow.style.display = "";
                this._spectrumEditor.render();
            } else {
                this._spectrumRow.style.display = "none";
            }
            if (instrument.type == InstrumentType.harmonics || instrument.type == InstrumentType.pickedString) {
                this._chipWaveSelectRow.style.display = "none";
                this._harmonicsRow.style.display = "";
                this._harmonicsEditor.render();
            } else {
                this._harmonicsRow.style.display = "none";
            }
            if (instrument.type == InstrumentType.pickedString) {
                this._chipWaveSelectRow.style.display = "none";
                this._stringSustainRow.style.display = "";
                this._stringSustainSlider.updateValue(instrument.stringSustain);
                this._stringSustainLabel.textContent = Config.enableAcousticSustain ? "Sustain (" + Config.sustainTypeNames[instrument.stringSustainType].substring(0,1).toUpperCase() + "):" : "Sustain:";
            } else {
                this._stringSustainRow.style.display = "none";
            }
            if (instrument.type == InstrumentType.drumset) {
                this._drumsetGroup.style.display = "";
                this._chipWaveSelectRow.style.display = "none";
                this._fadeInOutRow.style.display = "none";
                for (let i = 0; i < Config.drumCount; i++) {
                    setSelectedValue(this._drumsetEnvelopeSelects[i], instrument.drumsetEnvelopes[i]);
                    this._drumsetSpectrumEditors[i].render();
                }
            } else {
                this._drumsetGroup.style.display = "none";
                this._fadeInOutRow.style.display = "";
                this._fadeInOutEditor.render();
            }

            if (instrument.type == InstrumentType.chip) {
                this._chipWaveSelectRow.style.display = "";
                setSelectedValue(this._chipWaveSelect, instrument.chipWave);
            }

            if (instrument.type == InstrumentType.customChipWave) {
                this._customWaveDraw.style.display = "";
                this._chipWaveSelectRow.style.display = "none";
            }
            else {
                this._customWaveDraw.style.display = "none";
            }

            if (instrument.type == InstrumentType.supersaw) {
				this._supersawDynamismRow.style.display = "";
				this._supersawSpreadRow.style.display = "";
				this._supersawShapeRow.style.display = "";
				this._supersawDynamismSlider.updateValue(instrument.supersawDynamism);
				this._supersawSpreadSlider.updateValue(instrument.supersawSpread);
				this._supersawShapeSlider.updateValue(instrument.supersawShape);
			} else {
				this._supersawDynamismRow.style.display = "none";
				this._supersawSpreadRow.style.display = "none";
				this._supersawShapeRow.style.display = "none";
			}
            if (instrument.type == InstrumentType.pwm || instrument.type == InstrumentType.supersaw) {
                this._chipWaveSelectRow.style.display = "none";
                this._pulseWidthRow.style.display = "";
                this._pulseWidthSlider.input.title = prettyNumber(instrument.pulseWidth) + "%";
                this._pulseWidthSlider.updateValue(instrument.pulseWidth);
            } else {
                this._pulseWidthRow.style.display = "none";
            }


            if (instrument.type == InstrumentType.fm) {
                this._algorithmSelectRow.style.display = "";
                this._phaseModGroup.style.display = "";
                this._feedbackRow1.style.display = "";
                this._feedbackRow2.style.display = "";
                this._chipWaveSelectRow.style.display = "none";
                setSelectedValue(this._algorithmSelect, instrument.algorithm);
                setSelectedValue(this._feedbackTypeSelect, instrument.feedbackType);
                this._feedbackAmplitudeSlider.updateValue(instrument.feedbackAmplitude);
                for (let i = 0; i < Config.operatorCount; i++) {
                    const isCarrier = (i < Config.algorithms[instrument.algorithm].carrierCount);
                    this._operatorRows[i].style.color = isCarrier ? ColorConfig.primaryText : "";
                    setSelectedValue(this._operatorFrequencySelects[i], instrument.operators[i].frequency);
                    this._operatorAmplitudeSliders[i].updateValue(instrument.operators[i].amplitude);
                    setSelectedValue(this._operatorWaveformSelects[i], instrument.operators[i].waveform);
                    this._operatorWaveformPulsewidthSliders[i].updateValue(instrument.operators[i].pulseWidth);
                    this._operatorWaveformPulsewidthSliders[i].input.title = "" + Config.pwmOperatorWaves[instrument.operators[i].pulseWidth].name;
                    this._operatorDropdownGroups[i].style.color = isCarrier ? ColorConfig.primaryText : "";
                    const operatorName = (isCarrier ? "Voice " : "Modulator ") + (i + 1);
                    this._operatorFrequencySelects[i].title = operatorName + " Frequency";
                    this._operatorAmplitudeSliders[i].input.title = operatorName + (isCarrier ? " Volume" : " Amplitude");
                    this._operatorDropdownGroups[i].style.display = (this._openOperatorDropdowns[i] ? "" : "none");
                    if (instrument.operators[i].waveform == 3) {
                        this._operatorWaveformPulsewidthSliders[i].container.style.display = "";
                        this._operatorWaveformHints[i].style.display = "none";
                    } else {
                        this._operatorWaveformPulsewidthSliders[i].container.style.display = "none";
                        this._operatorWaveformHints[i].style.display = "";
                    }
                }
            }
            else {
                this._algorithmSelectRow.style.display = "none";
                this._phaseModGroup.style.display = "none";
                this._feedbackRow1.style.display = "none";
                this._feedbackRow2.style.display = "none";
            }
            this._pulseWidthSlider.input.title = prettyNumber(instrument.pulseWidth) + "%";


            if (effectsIncludeTransition(instrument.effects)) {
                this._transitionRow.style.display = "";
                if (this._openTransitionDropdown)
                    this._transitionDropdownGroup.style.display = "";
                setSelectedValue(this._transitionSelect, instrument.transition);
            } else {
                this._transitionDropdownGroup.style.display = "none";
                this._transitionRow.style.display = "none";
            }

            if (effectsIncludeChord(instrument.effects)) {
                this._chordSelectRow.style.display = "";
                this._chordDropdown.style.display = (instrument.chord == Config.chords.dictionary["arpeggio"].index) ? "" : "none";
                this._chordDropdownGroup.style.display = (instrument.chord == Config.chords.dictionary["arpeggio"].index && this._openChordDropdown) ? "" : "none";
                setSelectedValue(this._chordSelect, instrument.chord);
            } else {
                this._chordSelectRow.style.display = "none";
                this._chordDropdown.style.display = "none";
                this._chordDropdownGroup.style.display = "none";
            }

            if (effectsIncludePitchShift(instrument.effects)) {
                this._pitchShiftRow.style.display = "";
                this._pitchShiftSlider.updateValue(instrument.pitchShift);
                this._pitchShiftSlider.input.title = (instrument.pitchShift - Config.pitchShiftCenter) + " semitone(s)";
                for (const marker of this._pitchShiftFifthMarkers) {
                    marker.style.display = prefs.showFifth ? "" : "none";
                }
            } else {
                this._pitchShiftRow.style.display = "none";
            }

            if (effectsIncludeDetune(instrument.effects)) {
                this._detuneSliderRow.style.display = "";
                this._detuneSlider.updateValue(instrument.detune - Config.detuneCenter);
                this._detuneSlider.input.title = (Synth.detuneToCents(instrument.detune)) + " cent(s)";
            } else {
                this._detuneSliderRow.style.display = "none";
            }

            if (effectsIncludeVibrato(instrument.effects)) {
                this._vibratoSelectRow.style.display = "";
                if (this._openVibratoDropdown)
                    this._vibratoDropdownGroup.style.display = "";
                setSelectedValue(this._vibratoSelect, instrument.vibrato);
            } else {
                this._vibratoDropdownGroup.style.display = "none";
                this._vibratoSelectRow.style.display = "none";
            }

            if (effectsIncludeNoteFilter(instrument.effects)) {

                this._noteFilterTypeRow.style.setProperty("--text-color-lit", colors.primaryNote);
                this._noteFilterTypeRow.style.setProperty("--text-color-dim", colors.secondaryNote);
                this._noteFilterTypeRow.style.setProperty("--background-color-lit", colors.primaryChannel);
                this._noteFilterTypeRow.style.setProperty("--background-color-dim", colors.secondaryChannel);
                this._noteFilterTypeRow.style.display = "";

                if (this._doc.synth.isFilterModActive(true, this._doc.channel, this._doc.getCurrentInstrument())) {
                    this._noteFilterEditor.render(true, this._ctrlHeld || this._shiftHeld);
                }
                else {
                    this._noteFilterEditor.render();
                }

                if (instrument.noteFilterType) {
                    this._noteFilterSimpleButton.classList.remove("deactivated");
                    this._noteFilterAdvancedButton.classList.add("deactivated");
                    this._noteFilterRow.style.display = "none";
                    this._noteFilterSimpleCutRow.style.display = "";
                    this._noteFilterSimplePeakRow.style.display = "";
                } else {
                    this._noteFilterSimpleButton.classList.add("deactivated");
                    this._noteFilterAdvancedButton.classList.remove("deactivated");
                    this._noteFilterRow.style.display = "";
                    this._noteFilterSimpleCutRow.style.display = "none";
                    this._noteFilterSimplePeakRow.style.display = "none";
                }
            } else {
                this._noteFilterRow.style.display = "none";
                this._noteFilterSimpleCutRow.style.display = "none";
                this._noteFilterSimplePeakRow.style.display = "none";
                this._noteFilterTypeRow.style.display = "none";
            }

            if (effectsIncludeDistortion(instrument.effects)) {
                this._distortionRow.style.display = "";
                if (instrument.type == InstrumentType.chip || instrument.type == InstrumentType.customChipWave || instrument.type == InstrumentType.pwm || instrument.type == InstrumentType.supersaw)
                    this._aliasingRow.style.display = "";
                else
                    this._aliasingRow.style.display = "none";
                this._distortionSlider.updateValue(instrument.distortion);
            } else {
                this._distortionRow.style.display = "none";
                this._aliasingRow.style.display = "none";
            }

            if (effectsIncludeBitcrusher(instrument.effects)) {
                this._bitcrusherQuantizationRow.style.display = "";
                this._bitcrusherFreqRow.style.display = "";
                this._bitcrusherQuantizationSlider.updateValue(instrument.bitcrusherQuantization);
                this._bitcrusherFreqSlider.updateValue(instrument.bitcrusherFreq);
            } else {
                this._bitcrusherQuantizationRow.style.display = "none";
                this._bitcrusherFreqRow.style.display = "none";
            }

            if (effectsIncludePanning(instrument.effects)) {
                this._panSliderRow.style.display = "";
                if (this._openPanDropdown)
                    this._panDropdownGroup.style.display = "";
                this._panSlider.updateValue(instrument.pan);
            } else {
                this._panSliderRow.style.display = "none";
                this._panDropdownGroup.style.display = "none";
            }

            if (effectsIncludeChorus(instrument.effects)) {
                this._chorusRow.style.display = "";
                this._chorusSlider.updateValue(instrument.chorus);
            } else {
                this._chorusRow.style.display = "none";
            }

            if (effectsIncludeEcho(instrument.effects)) {
                this._echoSustainRow.style.display = "";
                this._echoSustainSlider.updateValue(instrument.echoSustain);
                this._echoDelayRow.style.display = "";
                this._echoDelaySlider.updateValue(instrument.echoDelay);
                this._echoDelaySlider.input.title = (Math.round((instrument.echoDelay + 1) * Config.echoDelayStepTicks / (Config.ticksPerPart * Config.partsPerBeat) * 1000) / 1000) + " beat(s)";
            } else {
                this._echoSustainRow.style.display = "none";
                this._echoDelayRow.style.display = "none";
            }

            if (effectsIncludeReverb(instrument.effects)) {
                this._reverbRow.style.display = "";
                this._reverbSlider.updateValue(instrument.reverb);
            } else {
                this._reverbRow.style.display = "none";
            }

            if (instrument.type == InstrumentType.chip || instrument.type == InstrumentType.customChipWave || instrument.type == InstrumentType.harmonics || instrument.type == InstrumentType.pickedString) {
                this._unisonSelectRow.style.display = "";
                setSelectedValue(this._unisonSelect, instrument.unison);
            } else {
                this._unisonSelectRow.style.display = "none";
            }

            if (this._openEnvelopeDropdown)
                this._envelopeDropdownGroup.style.display = "";
            else
                this._envelopeDropdownGroup.style.display = "none";

            this._envelopeEditor.render();

            for (let chordIndex = 0; chordIndex < Config.chords.length; chordIndex++) {
                let hidden = (!Config.instrumentTypeHasSpecialInterval[instrument.type] && Config.chords[chordIndex].customInterval);
                const option = this._chordSelect.children[chordIndex];
                if (hidden) {
                    if (!option.hasAttribute("hidden")) {
                        option.setAttribute("hidden", "");
                    }
                } else {
                    option.removeAttribute("hidden");
                }
            }

            this._instrumentSettingsGroup.style.color = ColorConfig.getChannelColor(this._doc.song, this._doc.channel).primaryNote;

            setSelectedValue(this._transitionSelect, instrument.transition);
            setSelectedValue(this._vibratoSelect, instrument.vibrato);
            setSelectedValue(this._vibratoTypeSelect, instrument.vibratoType);
            setSelectedValue(this._chordSelect, instrument.chord);
            this._panSliderInputBox.value = instrument.pan + "";
            this._pwmSliderInputBox.value = instrument.pulseWidth + "";
            this._detuneSliderInputBox.value = (instrument.detune - Config.detuneCenter) + "";
            this._instrumentVolumeSlider.updateValue(instrument.volume);
            this._instrumentVolumeSliderInputBox.value = "" + (instrument.volume);
            this._vibratoDepthSlider.updateValue(Math.round(instrument.vibratoDepth * 25));
            this._vibratoDelaySlider.updateValue(Math.round(instrument.vibratoDelay));
            this._vibratoSpeedSlider.updateValue(instrument.vibratoSpeed);
            setSelectedValue(this._vibratoTypeSelect, instrument.vibratoType);
            this._arpeggioSpeedSlider.updateValue(instrument.arpeggioSpeed);
            this._panDelaySlider.updateValue(instrument.panDelay);
            this._vibratoDelaySlider.input.title = "" + Math.round(instrument.vibratoDelay);
            this._vibratoDepthSlider.input.title = "" + instrument.vibratoDepth;
            this._vibratoSpeedSlider.input.title = "x" + instrument.vibratoSpeed / 10;
            this._vibratoSpeedDisplay.textContent = "x" + instrument.vibratoSpeed / 10;
            this._panDelaySlider.input.title = "" + instrument.panDelay;
            this._arpeggioSpeedSlider.input.title = "x" + prettyNumber(Config.arpSpeedScale[instrument.arpeggioSpeed]);
            this._arpeggioSpeedDisplay.textContent = "x" + prettyNumber(Config.arpSpeedScale[instrument.arpeggioSpeed]);
            this._eqFilterSimpleCutSlider.updateValue(instrument.eqFilterSimpleCut);
            this._eqFilterSimplePeakSlider.updateValue(instrument.eqFilterSimplePeak);
            this._noteFilterSimpleCutSlider.updateValue(instrument.noteFilterSimpleCut);
            this._noteFilterSimplePeakSlider.updateValue(instrument.noteFilterSimplePeak);
            this._envelopeSpeedSlider.updateValue(instrument.envelopeSpeed);
            this._envelopeSpeedSlider.input.title = "x" + prettyNumber(Config.arpSpeedScale[instrument.envelopeSpeed]);
            this._envelopeSpeedDisplay.textContent = "x" + prettyNumber(Config.arpSpeedScale[instrument.envelopeSpeed]);


            if (instrument.type == InstrumentType.customChipWave) {
                this._customWaveDrawCanvas.redrawCanvas();
                if (this.prompt instanceof CustomChipPrompt) {
                    this.prompt.customChipCanvas.render();
                }
            }

            this._renderInstrumentBar(channel, instrumentIndex, colors);
        }
        // Options for mod channel
        else {
            this._usageCheck(this._doc.channel, instrumentIndex);

            this._pitchedPresetSelect.style.display = "none";
            this._drumPresetSelect.style.display = "none";
            $("#pitchPresetSelect").parent().hide();
            $("#drumPresetSelect").parent().hide();
            this._modulatorGroup.appendChild(this._instrumentCopyGroup);

            this._modulatorGroup.insertBefore(this._instrumentsButtonRow, this._modulatorGroup.firstChild);
            this._modulatorGroup.insertBefore(this._instrumentSettingsTextRow, this._modulatorGroup.firstChild);
            if (this._doc.song.channels[this._doc.channel].name == "") {
                this._instrumentSettingsTextRow.textContent = "Modulator Settings";
            }
            else {
                this._instrumentSettingsTextRow.textContent = this._doc.song.channels[this._doc.channel].name;
            }

            this._chipNoiseSelectRow.style.display = "none";
            this._chipWaveSelectRow.style.display = "none";
            this._spectrumRow.style.display = "none";
            this._harmonicsRow.style.display = "none";
            this._transitionRow.style.display = "none";
            this._chordSelectRow.style.display = "none";
            this._chordDropdownGroup.style.display = "none";
            //this._filterCutoffRow.style.display = "none";
            //this._filterResonanceRow.style.display = "none";
            //this._filterEnvelopeRow.style.display = "none";
            this._drumsetGroup.style.display = "none";
            this._customWaveDraw.style.display = "none";
            this._supersawDynamismRow.style.display = "none";
			this._supersawSpreadRow.style.display = "none";
			this._supersawShapeRow.style.display = "none";
            this._algorithmSelectRow.style.display = "none";
            this._phaseModGroup.style.display = "none";
            this._feedbackRow1.style.display = "none";
            this._feedbackRow2.style.display = "none";
            //this._pulseEnvelopeRow.style.display = "none";
            this._pulseWidthRow.style.display = "none";
            this._vibratoSelectRow.style.display = "none";
            this._vibratoDropdownGroup.style.display = "none";
            this._envelopeDropdownGroup.style.display = "none";
            //this._intervalSelectRow.style.display = "none";
            this._detuneSliderRow.style.display = "none";
            this._panSliderRow.style.display = "none";
            this._panDropdownGroup.style.display = "none";

            this._modulatorGroup.style.display = "";
            this._modulatorGroup.style.color = ColorConfig.getChannelColor(this._doc.song, this._doc.channel).primaryNote;

            for (let mod = 0; mod < Config.modCount; mod++) {

                let instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
                let modChannel = Math.max(0, instrument.modChannels[mod]);
                let modInstrument = instrument.modInstruments[mod];

                // Boundary checking
                if (modInstrument >= this._doc.song.channels[modChannel].instruments.length + 2 || (modInstrument > 0 && this._doc.song.channels[modChannel].instruments.length <= 1)) {
                    modInstrument = 0;
                    instrument.modInstruments[mod] = 0;
                }
                if (modChannel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
                    instrument.modInstruments[mod] = 0;
                    instrument.modulators[mod] = 0;
                }

                // Build options for modulator channels (make sure it has the right number).
                if (this._doc.recalcChannelNames || (this._modChannelBoxes[mod].children.length != 2 + this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)) {
                    while (this._modChannelBoxes[mod].firstChild) this._modChannelBoxes[mod].remove(0);
                    const channelList = [];
                    channelList.push("none");
                    channelList.push("song");
                    for (let i = 0; i < this._doc.song.pitchChannelCount; i++) {
                        if (this._doc.song.channels[i].name == "") {
                            channelList.push("pitch " + (i + 1));
                        }
                        else {
                            channelList.push(this._doc.song.channels[i].name);
                        }
                    }
                    for (let i = 0; i < this._doc.song.noiseChannelCount; i++) {
                        if (this._doc.song.channels[i + this._doc.song.pitchChannelCount].name == "") {
                            channelList.push("noise " + (i + 1));
                        }
                        else {
                            channelList.push(this._doc.song.channels[i + this._doc.song.pitchChannelCount].name);
                        }
                    }
                    buildOptions(this._modChannelBoxes[mod], channelList);
                }

                // Set selected index based on channel info.

                this._modChannelBoxes[mod].selectedIndex = instrument.modChannels[mod] + 2; // Offset to get to first pitch channel

                let channel = this._doc.song.channels[modChannel];

                // Build options for modulator instruments (make sure it has the right number).
                if (this._modInstrumentBoxes[mod].children.length != channel.instruments.length + 2) {
                    while (this._modInstrumentBoxes[mod].firstChild) this._modInstrumentBoxes[mod].remove(0);
                    const instrumentList = [];
                    for (let i = 0; i < channel.instruments.length; i++) {
                        instrumentList.push("" + i + 1);
                    }
                    instrumentList.push("all");
                    instrumentList.push("active");
                    buildOptions(this._modInstrumentBoxes[mod], instrumentList);
                }

                // If non-zero pattern, point to which instrument(s) is/are the current
                if (channel.bars[this._doc.bar] > 0) {

                    let usedInstruments = channel.patterns[channel.bars[this._doc.bar] - 1].instruments;

                    for (let i = 0; i < channel.instruments.length; i++) {

                        if (usedInstruments.includes(i)) {
                            this._modInstrumentBoxes[mod].options[i].label = "🢒" + (i + 1);
                        }
                        else {
                            this._modInstrumentBoxes[mod].options[i].label = "" + (i + 1);
                        }
                    }
                }
                else {
                    for (let i = 0; i < channel.instruments.length; i++) {
                        this._modInstrumentBoxes[mod].options[i].label = "" + (i + 1);
                    }
                }

                // Set selected index based on instrument info.
                this._modInstrumentBoxes[mod].selectedIndex = instrument.modInstruments[mod];

                // Build options for modulator settings (based on channel settings)

                if (instrument.modChannels[mod] != -2) {
                    while (this._modSetBoxes[mod].firstChild) this._modSetBoxes[mod].remove(0);
                    const settingList = [];
                    const unusedSettingList = [];

                    // Make sure these names match the names declared for modulators in SynthConfig.ts.

                    settingList.push("none");

                    // Populate mod setting options for the song scope.
                    if (instrument.modChannels[mod] == -1) {
                        settingList.push("song volume");
                        settingList.push("tempo");
                        settingList.push("song reverb");
                        settingList.push("next bar");
                        settingList.push("song detune");
                    }
                    // Populate mod setting options for instrument scope.
                    else {

                        settingList.push("note volume");
                        settingList.push("mix volume");

                        // Build a list of target instrument indices, types and other info. It will be a single type for a single instrument, but with "all" and "active" it could be more.
                        // All or active are included together. Active allows any to be set, just in case the user fiddles with which are active later.
                        let tgtInstrumentTypes = [];
                        let anyInstrumentAdvancedEQ = false,
                            anyInstrumentSimpleEQ = false,
                            anyInstrumentAdvancedNote = false,
                            anyInstrumentSimpleNote = false,
                            anyInstrumentArps = false,
                            anyInstrumentPitchShifts = false,
                            anyInstrumentDetunes = false,
                            anyInstrumentVibratos = false,
                            anyInstrumentNoteFilters = false,
                            anyInstrumentDistorts = false,
                            anyInstrumentBitcrushes = false,
                            anyInstrumentPans = false,
                            anyInstrumentChorus = false,
                            anyInstrumentEchoes = false,
                            anyInstrumentReverbs = false,
                            anyInstrumentHasEnvelopes = false;
                        let allInstrumentPitchShifts = true,
                            allInstrumentNoteFilters = true,
                            allInstrumentDetunes = true,
                            allInstrumentVibratos = true,
                            allInstrumentDistorts = true,
                            allInstrumentBitcrushes = true,
                            allInstrumentPans = true,
                            allInstrumentChorus = true,
                            allInstrumentEchoes = true,
                            allInstrumentReverbs = true;
                        let instrumentCandidates = [];
                        if (modInstrument >= channel.instruments.length) {
                            for (let i = 0; i < channel.instruments.length; i++) {
                                instrumentCandidates.push(i);
                            }
                        } else {
                            instrumentCandidates.push(modInstrument);
                        }
                        for (let i = 0; i < instrumentCandidates.length; i++) {
                            let instrumentIndex = instrumentCandidates[i];

                            if (!tgtInstrumentTypes.includes(channel.instruments[instrumentIndex].type))
                                tgtInstrumentTypes.push(channel.instruments[instrumentIndex].type);
                            if (channel.instruments[instrumentIndex].eqFilterType)
                                anyInstrumentSimpleEQ = true;
                            else
                                anyInstrumentAdvancedEQ = true;
                            if (effectsIncludeChord(channel.instruments[instrumentIndex].effects) && channel.instruments[instrumentIndex].getChord().arpeggiates) {
                                anyInstrumentArps = true;
                            }
                            if (effectsIncludePitchShift(channel.instruments[instrumentIndex].effects)) {
                                anyInstrumentPitchShifts = true;
                            } else {
                                allInstrumentPitchShifts = false;
                            }
                            if (effectsIncludeDetune(channel.instruments[instrumentIndex].effects)) {
                                anyInstrumentDetunes = true;
                            }
                            else {
                                allInstrumentDetunes = false;
                            }
                            if (effectsIncludeVibrato(channel.instruments[instrumentIndex].effects)) {
                                anyInstrumentVibratos = true;
                            }
                            else {
                                allInstrumentVibratos = false;
                            }
                            if (effectsIncludeNoteFilter(channel.instruments[instrumentIndex].effects)) {
                                anyInstrumentNoteFilters = true;
                                if (channel.instruments[instrumentIndex].noteFilterType)
                                    anyInstrumentSimpleNote = true;
                                else
                                    anyInstrumentAdvancedNote = true;
                            }
                            else {
                                allInstrumentNoteFilters = false;
                            }
                            if (effectsIncludeDistortion(channel.instruments[instrumentIndex].effects)) {
                                anyInstrumentDistorts = true;
                            }
                            else {
                                allInstrumentDistorts = false;
                            }
                            if (effectsIncludeBitcrusher(channel.instruments[instrumentIndex].effects)) {
                                anyInstrumentBitcrushes = true;
                            }
                            else {
                                allInstrumentBitcrushes = false;
                            }
                            if (effectsIncludePanning(channel.instruments[instrumentIndex].effects)) {
                                anyInstrumentPans = true;
                            }
                            else {
                                allInstrumentPans = false;
                            }
                            if (effectsIncludeChorus(channel.instruments[instrumentIndex].effects)) {
                                anyInstrumentChorus = true;
                            }
                            else {
                                allInstrumentChorus = false;
                            }
                            if (effectsIncludeEcho(channel.instruments[instrumentIndex].effects)) {
                                anyInstrumentEchoes = true;
                            }
                            else {
                                allInstrumentEchoes = false;
                            }
                            if (effectsIncludeReverb(channel.instruments[instrumentIndex].effects)) {
                                anyInstrumentReverbs = true;
                            }
                            else {
                                allInstrumentReverbs = false;
                            }
                            if (channel.instruments[instrumentIndex].envelopes.length > 0) {
                                anyInstrumentHasEnvelopes = true;
                            }

                        }
                        if (anyInstrumentAdvancedEQ) {
                            settingList.push("eq filter");
                        }
                        if (anyInstrumentSimpleEQ) {
                            settingList.push("eq filt cut");
                            settingList.push("eq filt peak");
                        }
                        if (tgtInstrumentTypes.includes(InstrumentType.fm)) {
                            settingList.push("fm slider 1");
                            settingList.push("fm slider 2");
                            settingList.push("fm slider 3");
                            settingList.push("fm slider 4");
                            settingList.push("fm feedback");
                        }
                        if (tgtInstrumentTypes.includes(InstrumentType.pwm) || tgtInstrumentTypes.includes(InstrumentType.supersaw)) {
                            settingList.push("pulse width");
                        }
                        if (tgtInstrumentTypes.includes(InstrumentType.supersaw)) {
                            settingList.push("dynamism");
                            settingList.push("spread");
                            settingList.push("saw shape");
                        }
                        if (tgtInstrumentTypes.includes(InstrumentType.pickedString)) {
                            settingList.push("sustain");
                        }
                        if (anyInstrumentArps) {
                            settingList.push("arp speed");
                            settingList.push("reset arp");
                        }
                        if (anyInstrumentPitchShifts) {
                            settingList.push("pitch shift");
                        }
                        if (!allInstrumentPitchShifts) {
                            unusedSettingList.push("+ pitch shift");
                        }
                        if (anyInstrumentDetunes) {
                            settingList.push("detune");
                        }
                        if (!allInstrumentDetunes) {
                            unusedSettingList.push("+ detune");
                        }
                        if (anyInstrumentVibratos) {
                            settingList.push("vibrato depth");
                            settingList.push("vibrato speed");
                            settingList.push("vibrato delay");
                        }
                        if (!allInstrumentVibratos) {
                            unusedSettingList.push("+ vibrato depth");
                            unusedSettingList.push("+ vibrato speed");
                            unusedSettingList.push("+ vibrato delay");
                        }
                        if (anyInstrumentNoteFilters) {
                            if (anyInstrumentAdvancedNote) {
                                settingList.push("note filter");
                            }
                            if (anyInstrumentSimpleNote) {
                                settingList.push("note filt cut");
                                settingList.push("note filt peak");
                            }
                        }
                        if (!allInstrumentNoteFilters) {
                            unusedSettingList.push("+ note filter");
                        }
                        if (anyInstrumentDistorts) {
                            settingList.push("distortion");
                        }
                        if (!allInstrumentDistorts) {
                            unusedSettingList.push("+ distortion");
                        }
                        if (anyInstrumentBitcrushes) {
                            settingList.push("bit crush");
                            settingList.push("freq crush");
                        }
                        if (!allInstrumentBitcrushes) {
                            unusedSettingList.push("+ bit crush");
                            unusedSettingList.push("+ freq crush");
                        }
                        if (anyInstrumentPans) {
                            settingList.push("pan");
                            settingList.push("pan delay");
                        }
                        if (!allInstrumentPans) {
                            unusedSettingList.push("+ pan");
                            unusedSettingList.push("+ pan delay");
                        }
                        if (anyInstrumentChorus) {
                            settingList.push("chorus");
                        }
                        if (!allInstrumentChorus) {
                            unusedSettingList.push("+ chorus");
                        }
                        if (anyInstrumentEchoes) {
                            settingList.push("echo");
                            // Disabled currently!
                            //settingList.push("echo delay");
                        }
                        if (!allInstrumentEchoes) {
                            unusedSettingList.push("+ echo");
                            //unusedSettingList.push("echo delay");
                        }
                        if (anyInstrumentReverbs) {
                            settingList.push("reverb");
                        }
                        if (!allInstrumentReverbs) {
                            unusedSettingList.push("+ reverb");
                        }

                        if (anyInstrumentHasEnvelopes) {
                            settingList.push("envelope speed");
                        }

                    }

                    buildOptions(this._modSetBoxes[mod], settingList);
                    if (unusedSettingList.length > 0) {
                        this._modSetBoxes[mod].appendChild(option({ selected: false, disabled: true, value: "Add Effect" }, "Add Effect"));
                        buildOptions(this._modSetBoxes[mod], unusedSettingList);
                    }

                    let setIndex = settingList.indexOf(Config.modulators[instrument.modulators[mod]].name);

                    // Catch instances where invalid set forced setting to "none"
                    if (setIndex == -1) {
                        this._modSetBoxes[mod].insertBefore(option({ value: Config.modulators[instrument.modulators[mod]].name, style: "color: red;" }, Config.modulators[instrument.modulators[mod]].name), this._modSetBoxes[mod].children[0]);
                        this._modSetBoxes[mod].selectedIndex = 0;
                        this._whenSetModSetting(mod, true);
                    }
                    else {
                        this._modSetBoxes[mod].selectedIndex = setIndex;
                        this._modSetBoxes[mod].classList.remove("invalidSetting");
                        instrument.invalidModulators[mod] = false;
                    }

                } else if (this._modSetBoxes[mod].selectedIndex > 0) {
                    this._modSetBoxes[mod].selectedIndex = 0;
                    this._whenSetModSetting(mod);
                }

                //Hide instrument select if channel is "none" or "song"
                if (instrument.modChannels[mod] < 0) {
                    ((this._modInstrumentBoxes[mod].parentElement) ).style.display = "none";
                    $("#modInstrumentText" + mod).get(0).style.display = "none";
                    $("#modChannelText" + mod).get(0).innerText = "Channel:";

                    //Hide setting select if channel is "none"
                    if (instrument.modChannels[mod] == -2) {
                        $("#modSettingText" + mod).get(0).style.display = "none";
                        ((this._modSetBoxes[mod].parentElement) ).style.display = "none";
                    }
                    else {
                        $("#modSettingText" + mod).get(0).style.display = "";
                        ((this._modSetBoxes[mod].parentElement) ).style.display = "";
                    }

                    this._modTargetIndicators[mod].style.setProperty("fill", ColorConfig.uiWidgetFocus);
                    this._modTargetIndicators[mod].classList.remove("modTarget");

                }
                else {
                    ((this._modInstrumentBoxes[mod].parentElement) ).style.display = (channel.instruments.length > 1) ? "" : "none";
                    $("#modInstrumentText" + mod).get(0).style.display = (channel.instruments.length > 1) ? "" : "none";
                    $("#modChannelText" + mod).get(0).innerText = (channel.instruments.length > 1) ? "Ch:" : "Channel:";
                    $("#modSettingText" + mod).get(0).style.display = "";
                    ((this._modSetBoxes[mod].parentElement) ).style.display = "";

                    this._modTargetIndicators[mod].style.setProperty("fill", ColorConfig.indicatorPrimary);
                    this._modTargetIndicators[mod].classList.add("modTarget");
                }

                let filterType = Config.modulators[instrument.modulators[mod]].name;
                if (filterType == "eq filter" || filterType == "note filter") {
                    $("#modFilterText" + mod).get(0).style.display = "";
                    $("#modSettingText" + mod).get(0).style.setProperty("margin-bottom", "2px");

                    let useInstrument = instrument.modInstruments[mod];
                    let modChannel = this._doc.song.channels[Math.max(0, instrument.modChannels[mod])];
                    let tmpCount = -1;
                    if (useInstrument >= modChannel.instruments.length) {
                        // Use greatest number of dots among all instruments if setting is 'all' or 'active'. If it won't have an effect on one, no worry.
                        for (let i = 0; i < modChannel.instruments.length; i++) {
                            if (filterType == "eq filter") {
                                if (modChannel.instruments[i].eqFilter.controlPointCount > tmpCount) {
                                    tmpCount = modChannel.instruments[i].eqFilter.controlPointCount;
                                    useInstrument = i;
                                }
                            } else {
                                if (modChannel.instruments[i].noteFilter.controlPointCount > tmpCount) {
                                    tmpCount = modChannel.instruments[i].noteFilter.controlPointCount;
                                    useInstrument = i;
                                }
                            }
                        }
                    }

                    // Build options for modulator filters (make sure it has the right number of filter dots).
                    let dotCount = (filterType == "eq filter")
                        ? channel.instruments[useInstrument].getLargestControlPointCount(false)
                        : channel.instruments[useInstrument].getLargestControlPointCount(true);

                    const isSimple = (filterType == "eq filter" ? channel.instruments[useInstrument].eqFilterType : channel.instruments[useInstrument].noteFilterType);
                    if (isSimple)
                        dotCount = 0;

                    if (isSimple || this._modFilterBoxes[mod].children.length != 1 + dotCount * 2) {
                        while (this._modFilterBoxes[mod].firstChild) this._modFilterBoxes[mod].remove(0);
                        const dotList = [];
                        if (!isSimple)
                            dotList.push("morph");
                        for (let i = 0; i < dotCount; i++) {
                            dotList.push("dot " + (i + 1) + " x");
                            dotList.push("dot " + (i + 1) + " y");
                        }
                        buildOptions(this._modFilterBoxes[mod], dotList);
                    }

                    if (isSimple || instrument.modFilterTypes[mod] >= this._modFilterBoxes[mod].length) {
                        this._modFilterBoxes[mod].classList.add("invalidSetting");
                        instrument.invalidModulators[mod] = true;
                        let useName = ((instrument.modFilterTypes[mod] - 1) % 2 == 1) ?
                            "dot " + (Math.floor((instrument.modFilterTypes[mod] - 1) / 2) + 1) + " y"
                            : "dot " + (Math.floor((instrument.modFilterTypes[mod] - 1) / 2) + 1) + " x";
                        if (instrument.modFilterTypes[mod] == 0)
                            useName = "morph";
                        this._modFilterBoxes[mod].insertBefore(option({ value: useName, style: "color: red;" }, useName), this._modFilterBoxes[mod].children[0]);
                        this._modFilterBoxes[mod].selectedIndex = 0;

                    }
                    else {
                        this._modFilterBoxes[mod].classList.remove("invalidSetting");
                        instrument.invalidModulators[mod] = false;
                        this._modFilterBoxes[mod].selectedIndex = instrument.modFilterTypes[mod];
                    }



                } else {
                    $("#modFilterText" + mod).get(0).style.display = "none";
                    $("#modSettingText" + mod).get(0).style.setProperty("margin-bottom", "0.9em");

                }
            }

            this._doc.recalcChannelNames = false;

            for (let chordIndex = 0; chordIndex < Config.chords.length; chordIndex++) {
                const option = this._chordSelect.children[chordIndex];
                if (!option.hasAttribute("hidden")) {
                    option.setAttribute("hidden", "");
                }

            }

            //this._instrumentSelectRow.style.display = "none";

            this._customInstrumentSettingsGroup.style.display = "none";
            this._panSliderRow.style.display = "none";
            this._panDropdownGroup.style.display = "none";
            this._instrumentVolumeSliderRow.style.display = "none";
            this._instrumentTypeSelectRow.style.setProperty("display", "none");

            this._instrumentSettingsGroup.style.color = ColorConfig.getChannelColor(this._doc.song, this._doc.channel).primaryNote;

            // Force piano to re-show, if channel is modulator
            if (this._doc.channel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
                this._piano.forceRender();
            }

            this._renderInstrumentBar(channel, instrumentIndex, colors);

        }

        this._instrumentSettingsGroup.style.color = colors.primaryNote;

        if (this._doc.synth.isFilterModActive(false, this._doc.channel, this._doc.getCurrentInstrument())) {
            this._eqFilterEditor.render(true, this._ctrlHeld || this._shiftHeld);
        }
        else {
            this._eqFilterEditor.render();
        }
        this._instrumentVolumeSlider.updateValue(instrument.volume);
        this._detuneSlider.updateValue(instrument.detune - Config.detuneCenter);
        this._twoNoteArpBox.checked = instrument.fastTwoNoteArp ? true : false;
        this._clicklessTransitionBox.checked = instrument.clicklessTransition ? true : false;
        this._aliasingBox.checked = instrument.aliases ? true : false;
        this._addEnvelopeButton.disabled = (instrument.envelopeCount >= Config.maxEnvelopeCount);
        this._discreteEnvelopeBox.checked = instrument.discreteEnvelope ? true : false;

        this._volumeSlider.updateValue(prefs.volume);

        // If an interface element was selected, but becomes invisible (e.g. an instrument
        // select menu) just select the editor container so keyboard commands still work.
        if (wasActive && activeElement != null && activeElement.clientWidth == 0) {
            this.refocusStage();
        }

        this._setPrompt(this._doc.prompt);

        if (prefs.autoFollow && !this._doc.synth.playing) {
            this._doc.synth.goToBar(this._doc.bar);
        }

        // When adding effects or envelopes to an instrument in fullscreen modes,
        // auto-scroll the settings areas to ensure the new settings are visible.
        if (this._doc.addedEffect) {
            const envButtonRect = this._addEnvelopeButton.getBoundingClientRect();
            const instSettingsRect = this._instrumentSettingsArea.getBoundingClientRect();
            const settingsRect = this._settingsArea.getBoundingClientRect();
            this._instrumentSettingsArea.scrollTop += Math.max(0, envButtonRect.top - (instSettingsRect.top + instSettingsRect.height));
            this._settingsArea.scrollTop += Math.max(0, envButtonRect.top - (settingsRect.top + settingsRect.height));
            this._doc.addedEffect = false;
        }
        if (this._doc.addedEnvelope) {
            this._instrumentSettingsArea.scrollTop = this._instrumentSettingsArea.scrollHeight;
            this._settingsArea.scrollTop = this._settingsArea.scrollHeight;
            this._doc.addedEnvelope = false;
        }

        // Writeback to mods if control key is held while moving a slider.
        this.handleModRecording();

    }}

     handleModRecording() {
        window.clearTimeout(this._modRecTimeout);
        const lastChange = this._doc.checkLastChange();
        if ((this._ctrlHeld || this._shiftHeld) && lastChange != null && this._doc.synth.playing) {
            const changedPatterns = this._patternEditor.setModSettingsForChange(lastChange, this);
            if (this._doc.continuingModRecordingChange != null) {
                this._modRecTimeout = window.setTimeout(() => { this.handleModRecording(); }, 10);
                this._doc.recordingModulators = true;

                if (changedPatterns)
                    this._trackEditor.render();
            }
        }
        else if (this._doc.recordingModulators) {
            this._doc.recordingModulators = false;
            // A dummy change that pushes history state.
            this._doc.record(new ChangeHoldingModRecording(this._doc, null, null, null));
        }
    }

     _renderInstrumentBar(channel, instrumentIndex, colors) {
        if (this._doc.song.layeredInstruments || this._doc.song.patternInstruments) {
            this._instrumentsButtonRow.style.display = "";
            this._instrumentsButtonBar.style.setProperty("--text-color-lit", colors.primaryNote);
            this._instrumentsButtonBar.style.setProperty("--text-color-dim", colors.secondaryNote);
            this._instrumentsButtonBar.style.setProperty("--background-color-lit", colors.primaryChannel);
            this._instrumentsButtonBar.style.setProperty("--background-color-dim", colors.secondaryChannel);

            const maxInstrumentsPerChannel = this._doc.song.getMaxInstrumentsPerChannel();
            while (this._instrumentButtons.length < channel.instruments.length) {
                const instrumentButton = button(String(this._instrumentButtons.length + 1));
                this._instrumentButtons.push(instrumentButton);
                this._instrumentsButtonBar.insertBefore(instrumentButton, this._instrumentRemoveButton);
            }
            for (let i = this._renderedInstrumentCount; i < channel.instruments.length; i++) {
                this._instrumentButtons[i].style.display = "";
            }
            for (let i = channel.instruments.length; i < this._renderedInstrumentCount; i++) {
                this._instrumentButtons[i].style.display = "none";
            }
            this._renderedInstrumentCount = channel.instruments.length;
            while (this._instrumentButtons.length > maxInstrumentsPerChannel) {
                this._instrumentsButtonBar.removeChild(this._instrumentButtons.pop());
            }

            this._instrumentRemoveButton.style.display = (channel.instruments.length > Config.instrumentCountMin) ? "" : "none";
            this._instrumentAddButton.style.display = (channel.instruments.length < maxInstrumentsPerChannel) ? "" : "none";
            if (channel.instruments.length < maxInstrumentsPerChannel) {
                this._instrumentRemoveButton.classList.remove("last-button");
            } else {
                this._instrumentRemoveButton.classList.add("last-button");
            }
            if (channel.instruments.length > 1) {
                if (this._highlightedInstrumentIndex != instrumentIndex) {
                    const oldButton = this._instrumentButtons[this._highlightedInstrumentIndex];
                    if (oldButton != null) oldButton.classList.remove("selected-instrument");
                    const newButton = this._instrumentButtons[instrumentIndex];
                    newButton.classList.add("selected-instrument");
                    this._highlightedInstrumentIndex = instrumentIndex;
                }
            } else {
                const oldButton = this._instrumentButtons[this._highlightedInstrumentIndex];
                if (oldButton != null) oldButton.classList.remove("selected-instrument");
                this._highlightedInstrumentIndex = -1;
            }

            if (this._doc.song.layeredInstruments && this._doc.song.patternInstruments && (this._doc.channel < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)) {
                //const pattern: Pattern | null = this._doc.getCurrentPattern();
                for (let i = 0; i < channel.instruments.length; i++) {
                    if (this._doc.recentPatternInstruments[this._doc.channel].indexOf(i) != -1) {
                        this._instrumentButtons[i].classList.remove("deactivated");
                    } else {
                        this._instrumentButtons[i].classList.add("deactivated");
                    }
                }
                this._deactivatedInstruments = true;
            } else if (this._deactivatedInstruments || (this._doc.channel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)) {
                for (let i = 0; i < channel.instruments.length; i++) {

                    this._instrumentButtons[i].classList.remove("deactivated");
                }
                this._deactivatedInstruments = false;
            }

            if ((this._doc.song.layeredInstruments && this._doc.song.patternInstruments) && channel.instruments.length > 1 && (this._doc.channel < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)) {
                for (let i = 0; i < channel.instruments.length; i++) {
                    this._instrumentButtons[i].classList.remove("no-underline");
                }
            }
            else {
                for (let i = 0; i < channel.instruments.length; i++) {
                    this._instrumentButtons[i].classList.add("no-underline");
                }
            }
        } else {
            this._instrumentsButtonRow.style.display = "none";
        }
    }

     __init245() {this.updatePlayButton = () => {
        if (this._renderedIsPlaying != this._doc.synth.playing || this._renderedIsRecording != this._doc.synth.recording || this._renderedShowRecordButton != this._doc.prefs.showRecordButton || this._renderedCtrlHeld != this._ctrlHeld) {
            this._renderedIsPlaying = this._doc.synth.playing;
            this._renderedIsRecording = this._doc.synth.recording;
            this._renderedShowRecordButton = this._doc.prefs.showRecordButton;
            this._renderedCtrlHeld = this._ctrlHeld;

            if (document.activeElement == this._playButton || document.activeElement == this._pauseButton || document.activeElement == this._recordButton || document.activeElement == this._stopButton) {
                // When a focused element is hidden, focus is transferred to the document, so let's refocus the editor instead to make sure we can still capture keyboard input.
                this.refocusStage();
            }

            this._playButton.style.display = "none";
            this._pauseButton.style.display = "none";
            this._recordButton.style.display = "none";
            this._stopButton.style.display = "none";
            this._prevBarButton.style.display = "";
            this._nextBarButton.style.display = "";
            this._playButton.classList.remove("shrunk");
            this._recordButton.classList.remove("shrunk");
            this._patternEditorRow.style.pointerEvents = "";
            this._octaveScrollBar.container.style.pointerEvents = "";
            this._octaveScrollBar.container.style.opacity = "";
            this._trackContainer.style.pointerEvents = "";
            this._loopEditor.container.style.opacity = "";
            this._instrumentSettingsArea.style.pointerEvents = "";
            this._instrumentSettingsArea.style.opacity = "";
            this._menuArea.style.pointerEvents = "";
            this._menuArea.style.opacity = "";
            this._songSettingsArea.style.pointerEvents = "";
            this._songSettingsArea.style.opacity = "";

            if (this._doc.synth.recording) {
                this._stopButton.style.display = "";
                this._prevBarButton.style.display = "none";
                this._nextBarButton.style.display = "none";
                this._patternEditorRow.style.pointerEvents = "none";
                this._octaveScrollBar.container.style.pointerEvents = "none";
                this._octaveScrollBar.container.style.opacity = "0.5";
                this._trackContainer.style.pointerEvents = "none";
                this._loopEditor.container.style.opacity = "0.5";
                this._instrumentSettingsArea.style.pointerEvents = "none";
                this._instrumentSettingsArea.style.opacity = "0.5";
                this._menuArea.style.pointerEvents = "none";
                this._menuArea.style.opacity = "0.5";
                this._songSettingsArea.style.pointerEvents = "none";
                this._songSettingsArea.style.opacity = "0.5";
            } else if (this._doc.synth.playing) {
                this._pauseButton.style.display = "";
            } else if (this._doc.prefs.showRecordButton) {
                this._playButton.style.display = "";
                this._recordButton.style.display = "";
                this._playButton.classList.add("shrunk");
                this._recordButton.classList.add("shrunk");
            } else if (this._ctrlHeld) {
                this._recordButton.style.display = "";
            } else {
                this._playButton.style.display = "";
            }
        }
        window.requestAnimationFrame(this.updatePlayButton);
    }}

     __init246() {this._onTrackAreaScroll = (event) => {
        this._doc.barScrollPos = (this._trackAndMuteContainer.scrollLeft / this._doc.getBarWidth());
        this._doc.channelScrollPos = (this._trackAndMuteContainer.scrollTop / ChannelRow.patternHeight);
		//this._doc.notifier.changed();
	}}

     __init247() {this._disableCtrlContextMenu = (event) => {
        // On a Mac, clicking while holding control opens the right-click context menu.
        // But in the pattern and track editors I'd rather prevent that and instead allow
        // custom behaviors such as setting the volume of a note.
        if (event.ctrlKey) {
            event.preventDefault();
            return false;
        }
        return true;
    }}

     _usageCheck(channelIndex, instrumentIndex) {
        var instrumentUsed = false;
        var patternUsed = false;
        var modUsed = false;
        const channel = this._doc.song.channels[channelIndex];

        if (channelIndex < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
            for (let modChannelIdx = this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount; modChannelIdx < this._doc.song.channels.length; modChannelIdx++) {
                const modChannel = this._doc.song.channels[modChannelIdx];
                const patternIdx = modChannel.bars[this._doc.bar];
                if (patternIdx > 0) {
                    const modInstrumentIdx = modChannel.patterns[patternIdx - 1].instruments[0];
                    const modInstrument = modChannel.instruments[modInstrumentIdx];
                    for (let mod = 0; mod < Config.modCount; mod++) {
                        if (modInstrument.modChannels[mod] == channelIndex && (modInstrument.modInstruments[mod] == instrumentIndex || modInstrument.modInstruments[mod] >= channel.instruments.length)) {
                            modUsed = true;
                        }
                    }
                }
            }
        }

        let lowestSelX = Math.min(this._doc.selection.boxSelectionX0, this._doc.selection.boxSelectionX1);
        let highestSelX = Math.max(this._doc.selection.boxSelectionX0, this._doc.selection.boxSelectionX1);
        let lowestSelY = Math.min(this._doc.selection.boxSelectionY0, this._doc.selection.boxSelectionY1);
        let highestSelY = Math.max(this._doc.selection.boxSelectionY0, this._doc.selection.boxSelectionY1);

        if (channel.bars[this._doc.bar] != 0) {
            for (let i = 0; i < this._doc.song.barCount; i++) {
                // Check for this exact bar in another place, but only count it if it's not within the selection
                if (channel.bars[i] == channel.bars[this._doc.bar] && i != this._doc.bar &&
                    (i < lowestSelX || i > highestSelX || this._doc.channel < lowestSelY || this._doc.channel > highestSelY)) {

                    patternUsed = true;
                    i = this._doc.song.barCount;
                }
            }
        }

        for (let i = 0; i < this._doc.song.barCount; i++) {
            // Check for this exact instrument in another place, but only count it if it's not within the selection
            if (channel.bars[i] != 0 && channel.bars[i] != channel.bars[this._doc.bar] &&
                channel.patterns[channel.bars[i] - 1].instruments.includes(instrumentIndex) && i != this._doc.bar &&
                (i < lowestSelX || i > highestSelX || this._doc.channel < lowestSelY || this._doc.channel > highestSelY)) {

                instrumentUsed = true;
                i = this._doc.song.barCount;
            }
        }

        if (patternUsed) {
            this._usedPatternIndicator.style.setProperty("fill", ColorConfig.indicatorPrimary);
            this.patternUsed = true;
        }
        else {
            this._usedPatternIndicator.style.setProperty("fill", ColorConfig.indicatorSecondary);
            this.patternUsed = false;
        }
        if (instrumentUsed) {
            this._usedInstrumentIndicator.style.setProperty("fill", ColorConfig.indicatorPrimary);
        }
        else {
            this._usedInstrumentIndicator.style.setProperty("fill", ColorConfig.indicatorSecondary);
        }
        if (modUsed) {
            this._jumpToModIndicator.style.setProperty("display", "");
            this._jumpToModIndicator.style.setProperty("fill", ColorConfig.indicatorPrimary);
            this._jumpToModIndicator.classList.add("modTarget");
        }
        else if (channelIndex < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
            this._jumpToModIndicator.style.setProperty("display", "");
            this._jumpToModIndicator.style.setProperty("fill", ColorConfig.indicatorSecondary);
            this._jumpToModIndicator.classList.remove("modTarget");
        } else {
            this._jumpToModIndicator.style.setProperty("display", "none");
        }

    }

     __init248() {this._tempoStepperCaptureNumberKeys = (event) => {
        // When the number input is in focus, allow some keyboard events to
        // edit the input without accidentally editing the song otherwise.
        switch (event.keyCode) {
            case 8: // backspace/delete
            case 13: // enter/return
            case 38: // up
            case 40: // down
            case 37: // left
            case 39: // right
            case 48: // 0
            case 49: // 1
            case 50: // 2
            case 51: // 3
            case 52: // 4
            case 53: // 5
            case 54: // 6
            case 55: // 7
            case 56: // 8
            case 57: // 9
                event.stopPropagation();
                break;
        }
    }}

     __init249() {this._whenKeyPressed = (event) => {
        this._ctrlHeld = event.ctrlKey;
        this._shiftHeld = event.shiftKey;

        if (this.prompt) {
            if (this.prompt instanceof CustomChipPrompt || this.prompt instanceof LimiterPrompt || this.prompt instanceof CustomFilterPrompt) {
                this.prompt.whenKeyPressed(event);
            }
            if (event.keyCode == 27) { // ESC key
                // close prompt.
                this._doc.undo();
            }
            return;
        }

        // Defer to actively editing song title, channel name, or mod label
        if (document.activeElement == this._songTitleInputBox.input || this._patternEditor.editingModLabel || document.activeElement == this._muteEditor._channelNameInput.input) {
            // Enter/esc returns focus to form
            if (event.keyCode == 13 || event.keyCode == 27) {
                this.mainLayer.focus();
                this._patternEditor.stopEditingModLabel(event.keyCode == 27);
            }

            return;
        }

        // Defer to actively editing volume/pan rows
        if (document.activeElement == this._panSliderInputBox || document.activeElement == this._pwmSliderInputBox || document.activeElement == this._detuneSliderInputBox || document.activeElement == this._instrumentVolumeSliderInputBox) {
            // Enter/esc returns focus to form
            if (event.keyCode == 13 || event.keyCode == 27) {
                this.mainLayer.focus();
            }

            return;
        }

        if (this._doc.synth.recording) {
            // The only valid keyboard interactions when recording are playing notes or pressing space OR P to stop.
            if (!event.ctrlKey && !event.metaKey) {
                this._keyboardLayout.handleKeyEvent(event, true);
            }
            if (event.keyCode == 32) { // space
                this._toggleRecord();
                event.preventDefault();
                this.refocusStage();
            } else if (event.keyCode == 80 && (event.ctrlKey || event.metaKey)) { // p
                this._toggleRecord();
                event.preventDefault();
                this.refocusStage();
            }
            return;
        }

        const needControlForShortcuts = (this._doc.prefs.pressControlForShortcuts != event.getModifierState("CapsLock"));
        const canPlayNotes = (!event.ctrlKey && !event.metaKey && needControlForShortcuts);
        if (canPlayNotes) this._keyboardLayout.handleKeyEvent(event, true);

        //this._trackEditor.onKeyPressed(event);
        switch (event.keyCode) {
            case 27: // ESC key
                if (!event.ctrlKey && !event.metaKey) {
                    new ChangePatternSelection(this._doc, 0, 0);
                    this._doc.selection.resetBoxSelection();
                }
                break;
            case 16: // Shift
                this._patternEditor.shiftMode = true;
                break;
            case 17: // Ctrl
                this._patternEditor.controlMode = true;
                break;
            case 32: // space
                if (event.ctrlKey) {
                    this._toggleRecord();
                } else if (event.shiftKey) {
                    // Jump to mouse
                    if (this._trackEditor.movePlayheadToMouse() || this._patternEditor.movePlayheadToMouse()) {
                        if (!this._doc.synth.playing) this._doc.performance.play();
                    }
                    if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
                        this._doc.synth.loopBarStart = -1;
                        this._doc.synth.loopBarEnd = -1;
                        this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                    }
                } else {
                    this.togglePlay();
                }
                event.preventDefault();
                this.refocusStage();
                break;
            case 80: // p
                if (canPlayNotes) break;
                if (event.ctrlKey || event.metaKey) {
                    this._toggleRecord();
                    this._doc.synth.loopBarStart = -1;
                    this._doc.synth.loopBarEnd = -1;
                    this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);

                    event.preventDefault();
                    this.refocusStage();
                }
                break;
            case 90: // z
                if (canPlayNotes) break;
                if (event.shiftKey) {
                    this._doc.redo();
                } else {
                    this._doc.undo();
                }
                event.preventDefault();
                break;
            case 89: // y
                if (canPlayNotes) break;
                this._doc.redo();
                event.preventDefault();
                break;
            case 66: // b
                if (canPlayNotes) break;

                if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                    const leftSel = Math.min(this._doc.selection.boxSelectionX0, this._doc.selection.boxSelectionX1);
                    const rightSel = Math.max(this._doc.selection.boxSelectionX0, this._doc.selection.boxSelectionX1);
                    if ((leftSel < this._doc.synth.loopBarStart || this._doc.synth.loopBarStart == -1)
                        || (rightSel > this._doc.synth.loopBarEnd || this._doc.synth.loopBarEnd == -1)
                    ) {
                        this._doc.synth.loopBarStart = leftSel;
                        this._doc.synth.loopBarEnd = rightSel;

                        if (!this._doc.synth.playing) {
                            this._doc.synth.snapToBar();
                            this._doc.performance.play();
                        }
                    }
                    else {
                        this._doc.synth.loopBarStart = -1;
                        this._doc.synth.loopBarEnd = -1;
                    }

                    // Pressed while viewing a different bar than the current synth playhead.
                    if (this._doc.bar != Math.floor(this._doc.synth.playhead) && this._doc.synth.loopBarStart != -1) {

                        this._doc.synth.goToBar(this._doc.bar);
                        this._doc.synth.snapToBar();
                        this._doc.synth.initModFilters(this._doc.song);
                        this._doc.synth.computeLatestModValues();
                        if (this._doc.prefs.autoFollow) {
                            this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                        }

                    }

                    this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);


                    event.preventDefault();
                }
                break;
            case 67: // c
                if (canPlayNotes) break;
                if (event.shiftKey) {
                    this._copyInstrument();
                } else {
                    this._doc.selection.copy();
                }
                this._doc.selection.resetBoxSelection();
                this._doc.selection.selectionUpdated();
                event.preventDefault();
                break;
            case 13: // enter/return
                this._doc.synth.loopBarStart = -1;
                this._doc.synth.loopBarEnd = -1;
                this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);

                if (event.ctrlKey || event.metaKey) {
                    this._doc.selection.insertChannel();
                } else {
                    this._doc.selection.insertBars();
                }
                event.preventDefault();
                break;
            case 8: // backspace/delete
                this._doc.synth.loopBarStart = -1;
                this._doc.synth.loopBarEnd = -1;
                this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);

                if (event.ctrlKey || event.metaKey) {
                    this._doc.selection.deleteChannel();
                } else {
                    this._doc.selection.deleteBars();
                }
                this._barScrollBar.animatePlayhead();
                event.preventDefault();
                break;
            case 65: // a
                if (canPlayNotes) break;
                if (event.shiftKey) {
                    this._doc.selection.selectChannel();
                } else {
                    this._doc.selection.selectAll();
                }
                event.preventDefault();
                break;
            case 68: // d
                if (canPlayNotes) break;
                if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                    this._doc.selection.duplicatePatterns();
                    event.preventDefault();
                }
                break;
            case 69: // e (+shift: eq filter settings)
                if (event.shiftKey) {
                    const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
                    if (!instrument.eqFilterType && this._doc.channel < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)
                        this._openPrompt("customEQFilterSettings");
                }
                break;
            case 70: // f
                if (canPlayNotes) break;
                if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {

                    this._doc.synth.loopBarStart = -1;
                    this._doc.synth.loopBarEnd = -1;
                    this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);

                    this._doc.synth.snapToStart();
                    this._doc.synth.initModFilters(this._doc.song);
                    this._doc.synth.computeLatestModValues();
                    if (this._doc.prefs.autoFollow) {
                        this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                    }
                    event.preventDefault();
                }
                break;
            case 72: // h
                if (canPlayNotes) break;

                if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {

                    this._doc.synth.goToBar(this._doc.bar);
                    this._doc.synth.snapToBar();
                    this._doc.synth.initModFilters(this._doc.song);
                    this._doc.synth.computeLatestModValues();

                    if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
                        this._doc.synth.loopBarStart = -1;
                        this._doc.synth.loopBarEnd = -1;
                        this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                    }

                    if (this._doc.prefs.autoFollow) {
                        this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                    }
                    event.preventDefault();
                }
                break;
            case 74: // j
                if (canPlayNotes) break;
                // Ctrl Alt Shift J: Jummbify - set all prefs to my preferred ones lol
                if (event.shiftKey && event.ctrlKey && event.altKey) {
                    this._doc.prefs.autoPlay = false;
                    this._doc.prefs.autoFollow = false;
                    this._doc.prefs.enableNotePreview = true;
                    this._doc.prefs.showFifth = true;
                    this._doc.prefs.notesOutsideScale = false;
                    this._doc.prefs.defaultScale = 0;
                    this._doc.prefs.showLetters = true;
                    this._doc.prefs.showChannels = true;
                    this._doc.prefs.showScrollBar = true;
                    this._doc.prefs.alwaysFineNoteVol = false;
                    this._doc.prefs.enableChannelMuting = true;
                    this._doc.prefs.displayBrowserUrl = true;
                    this._doc.prefs.displayVolumeBar = true;
                    this._doc.prefs.layout = "wide";
                    this._doc.prefs.visibleOctaves = 5;
                    this._doc.prefs.save();
                    event.preventDefault();
                    location.reload();
                }
                break;
            case 76: // l
                if (canPlayNotes) break;
                if (event.shiftKey) {
                    this._openPrompt("limiterSettings");
                }
                else {
                    this._openPrompt("barCount");
                }
                break;
            case 77: // m
                if (canPlayNotes) break;
                if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                    if (this._doc.prefs.enableChannelMuting) {
                        this._doc.selection.muteChannels(event.shiftKey);
                        event.preventDefault();
                    }
                }
                break;
            case 78: // n
                if (canPlayNotes) break;
                // Find lowest-index unused pattern for current channel
                // Ctrl+n - lowest-index completely empty pattern
                // Shift+n - note filter settings

                const group = new ChangeGroup();

                if (event.shiftKey) {
                    const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
                    if (effectsIncludeNoteFilter(instrument.effects) && !instrument.noteFilterType && this._doc.channel < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)
                        this._openPrompt("customNoteFilterSettings");
                    break;
                }
                else if (event.ctrlKey) {
                    let nextEmpty = 0;
                    while (nextEmpty < this._doc.song.patternsPerChannel && this._doc.song.channels[this._doc.channel].patterns[nextEmpty].notes.length > 0)
                        nextEmpty++;

                    nextEmpty++; // The next empty pattern is actually the one after the found one

                    // Can't set anything if we're at the absolute limit.
                    if (nextEmpty <= Config.barCountMax) {

                        if (nextEmpty > this._doc.song.patternsPerChannel) {

                            // Add extra empty pattern, if all the rest have something in them.
                            group.append(new ChangePatternsPerChannel(this._doc, nextEmpty));
                        }

                        // Change pattern number to lowest-index unused
                        group.append(new ChangePatternNumbers(this._doc, nextEmpty, this._doc.bar, this._doc.channel, 1, 1));

                        // Auto set the used instruments to the ones you were most recently viewing.
                        if (this._doc.channel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)
                        {
                           
                                this._doc.viewedInstrument[this._doc.channel] = this._doc.recentPatternInstruments[this._doc.channel][0];
                        }
                        group.append(new ChangeSetPatternInstruments(this._doc, this._doc.channel, this._doc.recentPatternInstruments[this._doc.channel],  this._doc.song.channels[this._doc.channel].patterns[nextEmpty-1]));
                        
                    }
                }
                else {
                    let nextUnused = 1;
                    while (this._doc.song.channels[this._doc.channel].bars.indexOf(nextUnused) != -1
                        && nextUnused <= this._doc.song.patternsPerChannel)
                        nextUnused++;

                    // Can't set anything if we're at the absolute limit.
                    if (nextUnused <= Config.barCountMax) {

                        if (nextUnused > this._doc.song.patternsPerChannel) {

                            // Add extra empty pattern, if all the rest are used.
                            group.append(new ChangePatternsPerChannel(this._doc, nextUnused));
                        }

                        // Change pattern number to lowest-index unused
                        group.append(new ChangePatternNumbers(this._doc, nextUnused, this._doc.bar, this._doc.channel, 1, 1));
                        
                        // Auto set the used instruments to the ones you were most recently viewing.
                        if (this._doc.channel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount)
                        {
                                this._doc.viewedInstrument[this._doc.channel] = this._doc.recentPatternInstruments[this._doc.channel][0];
                        }
                        group.append(new ChangeSetPatternInstruments(this._doc, this._doc.channel, this._doc.recentPatternInstruments[this._doc.channel],  this._doc.song.channels[this._doc.channel].patterns[nextUnused-1]));

                    }
                }

                this._doc.record(group);

                event.preventDefault();
                break;
            case 81: // q
                if (canPlayNotes) break;
                if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                    this._openPrompt("channelSettings");
                    event.preventDefault();
                }
                break;
            case 83: // s
                if (canPlayNotes) break;
                if (event.ctrlKey || event.metaKey) {
                    this._openPrompt("export");
                    event.preventDefault();
                } else {
                    if (this._doc.prefs.enableChannelMuting) {
                        // BoneBox deviation: I like shift+s as just another mute toggle personally.
                        // Easier to reach than M and the shift+s invert functionality I am overwriting could be 
                        // obtained with M anyway. Useability-wise you very often want to 'add' channels on to a solo as you work.
                        if (event.shiftKey) {
                            this._doc.selection.muteChannels(false);
                        } else {
                            this._doc.selection.soloChannels(false);
                        }
                        event.preventDefault();
                    }
                }
                break;
            case 79: // o
                if (canPlayNotes) break;
                if (event.ctrlKey || event.metaKey) {
                    this._openPrompt("import");
                    event.preventDefault();
                }
                break;
            case 86: // v
                if (canPlayNotes) break;
                if ((event.ctrlKey || event.metaKey) && event.shiftKey && !needControlForShortcuts) {
                    this._doc.selection.pasteNumbers();
                } else if (event.shiftKey) {
                    this._pasteInstrument();
                } else {
                    this._doc.selection.pasteNotes();
                }
                event.preventDefault();
                break;
            case 87: // w
                if (canPlayNotes) break;
                this._openPrompt("moveNotesSideways");
                break;
            case 73: // i
                if (canPlayNotes) break;
                if (needControlForShortcuts == (event.ctrlKey || event.metaKey) && event.shiftKey) {
                    // Copy the current instrument as a preset to the clipboard.
                    const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
                    const instrumentObject = instrument.toJsonObject();
                    delete instrumentObject["preset"];
                    // Volume and the panning effect are not included in presets.
                    delete instrumentObject["volume"];
                    delete instrumentObject["pan"];
                    const panningEffectIndex = instrumentObject["effects"].indexOf(Config.effectNames[EffectType.panning]);
                    if (panningEffectIndex != -1) instrumentObject["effects"].splice(panningEffectIndex, 1);
                    for (let i = 0; i < instrumentObject["envelopes"].length; i++) {
                        const envelope = instrumentObject["envelopes"][i];
                        // If there are any envelopes targeting panning or none, remove those too.
                        if (envelope["target"] == "panning" || envelope["target"] == "none" || envelope["envelope"] == "none") {
                            instrumentObject["envelopes"].splice(i, 1);
                            i--;
                        }
                    }
                    this._copyTextToClipboard(JSON.stringify(instrumentObject));
                    event.preventDefault();
                }
                break;
            case 82: // r
                if (canPlayNotes) break;
                if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                    if (event.shiftKey) {
                        this._randomGenerated();
                    } else {
                        this._randomPreset();
                    }
                    event.preventDefault();
                }
                break;
            case 219: // left brace
                if (canPlayNotes) break;
                if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                    this._doc.synth.goToPrevBar();
                    this._doc.synth.initModFilters(this._doc.song);
                    this._doc.synth.computeLatestModValues();
                    if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
                        this._doc.synth.loopBarStart = -1;
                        this._doc.synth.loopBarEnd = -1;
                        this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                    }

                    if (this._doc.prefs.autoFollow) {
                        this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                    }
                    event.preventDefault();
                }
                break;
            case 221: // right brace
                if (canPlayNotes) break;
                if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                    this._doc.synth.goToNextBar();
                    this._doc.synth.initModFilters(this._doc.song);
                    this._doc.synth.computeLatestModValues();
                    if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
                        this._doc.synth.loopBarStart = -1;
                        this._doc.synth.loopBarEnd = -1;
                        this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
                    }

                    if (this._doc.prefs.autoFollow) {
                        this._doc.selection.setChannelBar(this._doc.channel, Math.floor(this._doc.synth.playhead));
                    }
                    event.preventDefault();
                }
                break;
            case 189: // -
            case 173: // Firefox -
                if (canPlayNotes) break;
                if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                    this._doc.selection.transpose(false, event.shiftKey);
                    event.preventDefault();
                }
                break;
            case 187: // +
            case 61: // Firefox +
            case 171: // Some users have this as +? Hmm.
                if (canPlayNotes) break;
                if (needControlForShortcuts == (event.ctrlKey || event.metaKey)) {
                    this._doc.selection.transpose(true, event.shiftKey);
                    event.preventDefault();
                }
                break;
            case 38: // up
                if (event.ctrlKey || event.metaKey) {
                    this._doc.selection.swapChannels(-1);
                } else if (event.shiftKey) {
                    this._doc.selection.boxSelectionY1 = Math.max(0, this._doc.selection.boxSelectionY1 - 1);
                    this._doc.selection.scrollToEndOfSelection();
                    this._doc.selection.selectionUpdated();
                } else {
                    this._doc.selection.setChannelBar((this._doc.channel - 1 + this._doc.song.getChannelCount()) % this._doc.song.getChannelCount(), this._doc.bar);
                    this._doc.selection.resetBoxSelection();
                }
                event.preventDefault();
                break;
            case 40: // down
                if (event.ctrlKey || event.metaKey) {
                    this._doc.selection.swapChannels(1);
                } else if (event.shiftKey) {
                    this._doc.selection.boxSelectionY1 = Math.min(this._doc.song.getChannelCount() - 1, this._doc.selection.boxSelectionY1 + 1);
                    this._doc.selection.scrollToEndOfSelection();
                    this._doc.selection.selectionUpdated();
                } else {
                    this._doc.selection.setChannelBar((this._doc.channel + 1) % this._doc.song.getChannelCount(), this._doc.bar);
                    this._doc.selection.resetBoxSelection();
                }
                event.preventDefault();
                break;
            case 37: // left
                if (event.shiftKey) {
                    this._doc.selection.boxSelectionX1 = Math.max(0, this._doc.selection.boxSelectionX1 - 1);
                    this._doc.selection.scrollToEndOfSelection();
                    this._doc.selection.selectionUpdated();
                } else {
                    this._doc.selection.setChannelBar(this._doc.channel, (this._doc.bar + this._doc.song.barCount - 1) % this._doc.song.barCount);
                    this._doc.selection.resetBoxSelection();
                }
                event.preventDefault();
                break;
            case 39: // right
                if (event.shiftKey) {
                    this._doc.selection.boxSelectionX1 = Math.min(this._doc.song.barCount - 1, this._doc.selection.boxSelectionX1 + 1);
                    this._doc.selection.scrollToEndOfSelection();
                    this._doc.selection.selectionUpdated();
                } else {
                    this._doc.selection.setChannelBar(this._doc.channel, (this._doc.bar + 1) % this._doc.song.barCount);
                    this._doc.selection.resetBoxSelection();
                }
                event.preventDefault();
                break;
            case 46: // Delete
                this._doc.selection.digits = "";
                this._doc.selection.nextDigit("0", false, false);
                break;
            case 48: // 0
                if (canPlayNotes) break;
                this._doc.selection.nextDigit("0", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                event.preventDefault();
                break;
            case 49: // 1
                if (canPlayNotes) break;
                this._doc.selection.nextDigit("1", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                event.preventDefault();
                break;
            case 50: // 2
                if (canPlayNotes) break;
                this._doc.selection.nextDigit("2", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                event.preventDefault();
                break;
            case 51: // 3
                if (canPlayNotes) break;
                this._doc.selection.nextDigit("3", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                event.preventDefault();
                break;
            case 52: // 4
                if (canPlayNotes) break;
                this._doc.selection.nextDigit("4", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                event.preventDefault();
                break;
            case 53: // 5
                if (canPlayNotes) break;
                this._doc.selection.nextDigit("5", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                event.preventDefault();
                break;
            case 54: // 6
                if (canPlayNotes) break;
                this._doc.selection.nextDigit("6", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                event.preventDefault();
                break;
            case 55: // 7
                if (canPlayNotes) break;
                this._doc.selection.nextDigit("7", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                event.preventDefault();
                break;
            case 56: // 8
                if (canPlayNotes) break;
                this._doc.selection.nextDigit("8", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                event.preventDefault();
                break;
            case 57: // 9
                if (canPlayNotes) break;
                this._doc.selection.nextDigit("9", needControlForShortcuts != (event.shiftKey || event.ctrlKey || event.metaKey), event.altKey);
                this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], this._doc.getCurrentInstrument(), ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
                event.preventDefault();
                break;
            default:
                this._doc.selection.digits = "";
                this._doc.selection.instrumentDigits = "";
                break;
        }

        if (canPlayNotes) {
            this._doc.selection.digits = "";
            this._doc.selection.instrumentDigits = "";
        }
    }}


     __init250() {this._whenKeyReleased = (event) => {
        this._muteEditor.onKeyUp(event);
        if (!event.ctrlKey) { // Ctrl
            this._patternEditor.controlMode = false;
        }
        if (!event.shiftKey) { // Shift
            this._patternEditor.shiftMode = false;
        }

        this._ctrlHeld = event.ctrlKey;
        this._shiftHeld = event.shiftKey;
        // Release live pitches regardless of control or caps lock so that any pitches played before will get released even if the modifier keys changed.
        this._keyboardLayout.handleKeyEvent(event, false);
    }}

     _copyTextToClipboard(text) {
        // Set as any to allow compilation without clipboard types (since, uh, I didn't write this bit and don't know the proper types library) -jummbus
        let nav;
        nav = navigator;

        if (nav.clipboard && nav.clipboard.writeText) {
            nav.clipboard.writeText(text).catch(() => {
                window.prompt("Copy to clipboard:", text);
            });
            return;
        }
        const textField = document.createElement("textarea");
        textField.textContent = text;
        document.body.appendChild(textField);
        textField.select();
        const succeeded = document.execCommand("copy");
        textField.remove();
        this.refocusStage();
        if (!succeeded) window.prompt("Copy this:", text);
    }

     __init251() {this._whenPrevBarPressed = () => {
        this._doc.synth.goToPrevBar();
        if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
            this._doc.synth.loopBarStart = -1;
            this._doc.synth.loopBarEnd = -1;
            this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
        }
        this._barScrollBar.animatePlayhead();
    }}

     __init252() {this._whenNextBarPressed = () => {
        this._doc.synth.goToNextBar();
        if (Math.floor(this._doc.synth.playhead) < this._doc.synth.loopBarStart || Math.floor(this._doc.synth.playhead) > this._doc.synth.loopBarEnd) {
            this._doc.synth.loopBarStart = -1;
            this._doc.synth.loopBarEnd = -1;
            this._loopEditor.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
        }
        this._barScrollBar.animatePlayhead();
    }}

     __init253() {this.togglePlay = () => {
        if (this._doc.synth.playing) {
            this._doc.performance.pause();
            this.outVolumeHistoricCap = 0;
        } else {
            this._doc.synth.snapToBar();
            this._doc.performance.play();
        }
    }}

     __init254() {this._toggleRecord = () => {
        if (this._doc.synth.playing) {
            this._doc.performance.pause();
        } else {
            this._doc.performance.record();
        }
    }}

     __init255() {this._animate = () => {
        // Need to update mods once more to clear the slider display
        this._modSliderUpdate();
        // Same for volume display
        if (this._doc.prefs.displayVolumeBar) {
            this._volumeUpdate();
        }
        // ...and barscrollbar playhead
        this._barScrollBar.animatePlayhead();
        // ...and filters
        if (this._doc.synth.isFilterModActive(false, this._doc.channel, this._doc.getCurrentInstrument())) {
            this._eqFilterEditor.render(true, this._ctrlHeld || this._shiftHeld);
        }
        if (this._doc.synth.isFilterModActive(true, this._doc.channel, this._doc.getCurrentInstrument())) {
            this._noteFilterEditor.render(true, this._ctrlHeld || this._shiftHeld);
        }


        window.requestAnimationFrame(this._animate);
    }}

     __init256() {this._volumeUpdate = () => {
        this.outVolumeHistoricTimer--;
        if (this.outVolumeHistoricTimer <= 0) {
            this.outVolumeHistoricCap -= 0.03;
        }
        if (this._doc.song.outVolumeCap > this.outVolumeHistoricCap) {
            this.outVolumeHistoricCap = this._doc.song.outVolumeCap;
            this.outVolumeHistoricTimer = 50;
        }

        if (this._doc.song.outVolumeCap != this.lastOutVolumeCap) {
            this.lastOutVolumeCap = this._doc.song.outVolumeCap;
            this._animateVolume(this._doc.song.outVolumeCap, this.outVolumeHistoricCap);
        }
    }}

     _animateVolume(outVolumeCap, historicOutCap) {
        this._outVolumeBar.setAttribute("width", "" + Math.min(144, outVolumeCap * 144));
        this._outVolumeCap.setAttribute("x", "" + (8 + Math.min(144, historicOutCap * 144)));
    }

     __init257() {this._setVolumeSlider = () => {
        // Song volume slider doesn't use a change, but it can still be modulated.
        if ((this._ctrlHeld || this._shiftHeld) && this._doc.synth.playing) {
            const prevVol = this._doc.prefs.volume;
            // The slider only goes to 75, but the mod is 0-100 and in this instance we're using the value for a mod set.
            this._doc.prefs.volume = Math.round(Number(this._volumeSlider.input.value) * 4 / 3);
            const changedPatterns = this._patternEditor.setModSettingsForChange(null, this);
            const useVol = this._doc.prefs.volume;
            window.clearTimeout(this._modRecTimeout);
            this._modRecTimeout = window.setTimeout(() => { this._recordVolumeSlider(useVol); }, 10);
            this._doc.recordingModulators = true;

            this._doc.prefs.volume = prevVol;
            this._volumeSlider.updateValue(this._doc.prefs.volume);

            if (changedPatterns)
                this._trackEditor.render();
            }
        else {
            this._doc.setVolume(Number(this._volumeSlider.input.value));
            if (this._doc.recordingModulators) {
                this._doc.recordingModulators = false;
                // A dummy change that pushes history state.
                this._doc.record(new ChangeHoldingModRecording(this._doc, null, null, null));
            }
        }
    }}

     _recordVolumeSlider(useVol) {
        // Song volume slider doesn't use a change, but it can still be modulated.
        if ((this._ctrlHeld || this._shiftHeld) && this._doc.synth.playing) {
            const prevVol = this._doc.prefs.volume;
            // The slider only goes to 75, but the mod is 0-100 and in this instance we're using the value for a mod set.
            this._doc.prefs.volume = useVol;
            this._patternEditor.setModSettingsForChange(null, this);
            window.clearTimeout(this._modRecTimeout);
            this._modRecTimeout = window.setTimeout(() => { this._recordVolumeSlider(useVol); }, 10);
            this._doc.recordingModulators = true;

            this._doc.prefs.volume = prevVol;
            this._volumeSlider.updateValue(this._doc.prefs.volume);
        }
        else {
            this._doc.setVolume(Number(this._volumeSlider.input.value));
            if (this._doc.recordingModulators) {
                this._doc.recordingModulators = false;
                // A dummy change that pushes history state.
                this._doc.record(new ChangeHoldingModRecording(this._doc, null, null, null));
            }
        }
    }

     __init258() {this._copyInstrument = () => {
        const channel = this._doc.song.channels[this._doc.channel];
        const instrument = channel.instruments[this._doc.getCurrentInstrument()];
        const instrumentCopy = instrument.toJsonObject();
        instrumentCopy["isDrum"] = this._doc.song.getChannelIsNoise(this._doc.channel);
        instrumentCopy["isMod"] = this._doc.song.getChannelIsMod(this._doc.channel);
        window.localStorage.setItem("instrumentCopy", JSON.stringify(instrumentCopy));
        this.refocusStage();
    }}

     __init259() {this._pasteInstrument = () => {
        const channel = this._doc.song.channels[this._doc.channel];
        const instrument = channel.instruments[this._doc.getCurrentInstrument()];
        const instrumentCopy = JSON.parse(String(window.localStorage.getItem("instrumentCopy")));
        if (instrumentCopy != null && instrumentCopy["isDrum"] == this._doc.song.getChannelIsNoise(this._doc.channel) && instrumentCopy["isMod"] == this._doc.song.getChannelIsMod(this._doc.channel)) {
            this._doc.record(new ChangePasteInstrument(this._doc, instrument, instrumentCopy));
        }
        this.refocusStage();
    }}

     _switchEQFilterType(toSimple) {
        const channel = this._doc.song.channels[this._doc.channel];
        const instrument = channel.instruments[this._doc.getCurrentInstrument()];
        if (instrument.eqFilterType != toSimple) {
            this._doc.record(new ChangeEQFilterType(this._doc, instrument, toSimple));
        }
    }

     _switchNoteFilterType(toSimple) {
        const channel = this._doc.song.channels[this._doc.channel];
        const instrument = channel.instruments[this._doc.getCurrentInstrument()];
        if (instrument.noteFilterType != toSimple) {
            this._doc.record(new ChangeNoteFilterType(this._doc, instrument, toSimple));
        }
    }

     _randomPreset() {
        const isNoise = this._doc.song.getChannelIsNoise(this._doc.channel);
        this._doc.record(new ChangePreset(this._doc, pickRandomPresetValue(isNoise)));
    }

     _randomGenerated() {
        this._doc.record(new ChangeRandomGeneratedInstrument(this._doc));
    }


     __init260() {this._whenSetTempo = () => {
        this._doc.record(new ChangeTempo(this._doc, -1, parseInt(this._tempoStepper.value) | 0));
    }}

     __init261() {this._whenSetScale = () => {
        if (isNaN(this._scaleSelect.value)) {
            switch (this._scaleSelect.value) {
                case "forceScale":
                    this._doc.selection.forceScale();
                    break;
            }
            this._doc.notifier.changed();
        } else {
            this._doc.record(new ChangeScale(this._doc, this._scaleSelect.selectedIndex));
        }
    }}

     __init262() {this._whenSetKey = () => {
        if (isNaN(this._keySelect.value)) {
            switch (this._keySelect.value) {
                case "detectKey":
                    this._doc.record(new ChangeDetectKey(this._doc));
                    break;
            }
            this._doc.notifier.changed();
        } else {
            this._doc.record(new ChangeKey(this._doc, Config.keys.length - 1 - this._keySelect.selectedIndex));
        }
    }}

     __init263() {this._whenSetRhythm = () => {
        if (isNaN(this._rhythmSelect.value)) {
            switch (this._rhythmSelect.value) {
                case "forceRhythm":
                    this._doc.selection.forceRhythm();
                    break;
            }
            this._doc.notifier.changed();
        } else {
            this._doc.record(new ChangeRhythm(this._doc, this._rhythmSelect.selectedIndex));
        }
    }}

     __init264() {this._refocus = () => {
        // Waits a bit because select2 "steals" back focus even after the close event fires.
        var selfRef = this;
        setTimeout(function () { selfRef.mainLayer.focus(); }, 20);
    }}

     __init265() {this._whenSetPitchedPreset = () => {
        this._setPreset($('#pitchPresetSelect').val() + "");
    }}

     __init266() {this._whenSetDrumPreset = () => {
        this._setPreset($('#drumPresetSelect').val() + "");
    }}

     _setPreset(preset) {
        if (isNaN(preset)) {
            switch (preset) {
                case "copyInstrument":
                    this._copyInstrument();
                    break;
                case "pasteInstrument":
                    this._pasteInstrument();
                    break;
                case "randomPreset":
                    this._randomPreset();
                    break;
                case "randomGenerated":
                    this._randomGenerated();
                    break;
            }
            this._doc.notifier.changed();
        } else {
            this._doc.record(new ChangePreset(this._doc, parseInt(preset)));
        }
    }

     __init267() {this._whenSetFeedbackType = () => {
        this._doc.record(new ChangeFeedbackType(this._doc, this._feedbackTypeSelect.selectedIndex));
    }}


     __init268() {this._whenSetAlgorithm = () => {
        this._doc.record(new ChangeAlgorithm(this._doc, this._algorithmSelect.selectedIndex));
    }}

     __init269() {this._whenSelectInstrument = (event) => {
        if (event.target == this._instrumentAddButton) {
            this._doc.record(new ChangeAddChannelInstrument(this._doc));
        } else if (event.target == this._instrumentRemoveButton) {
            this._doc.record(new ChangeRemoveChannelInstrument(this._doc));
        } else {
            const index = this._instrumentButtons.indexOf(event.target);
            if (index != -1) {
                this._doc.selection.selectInstrument(index);
            }
            // Force piano to re-show, if channel is modulator
            if (this._doc.channel >= this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
                this._piano.forceRender();
            }
            this._renderInstrumentBar(this._doc.song.channels[this._doc.channel], index, ColorConfig.getChannelColor(this._doc.song, this._doc.channel));
        }

        this.refocusStage();
    }}

     __init270() {this._whenSetModChannel = (mod) => {

        let instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        let previouslyUnset = (instrument.modulators[mod] == 0 || Config.modulators[instrument.modulators[mod]].forSong);

        this._doc.selection.setModChannel(mod, this._modChannelBoxes[mod].selectedIndex);

        const modChannel = Math.max(0, instrument.modChannels[mod]);

        // Check if setting was 'song' or 'none' and is changing to a channel number, in which case suggested instrument to mod will auto-set to the current one.
        if (this._doc.song.channels[modChannel].instruments.length > 1 && previouslyUnset && this._modChannelBoxes[mod].selectedIndex >= 2) {
            if (this._doc.song.channels[modChannel].bars[this._doc.bar] > 0) {
                this._doc.selection.setModInstrument(mod, this._doc.song.channels[modChannel].patterns[this._doc.song.channels[modChannel].bars[this._doc.bar] - 1].instruments[0]);
            }
        }

        // Force piano to re-show
        this._piano.forceRender();
    }}

     __init271() {this._whenSetModInstrument = (mod) => {
        this._doc.selection.setModInstrument(mod, this._modInstrumentBoxes[mod].selectedIndex);

        // Force piano to re-show
        this._piano.forceRender();
    }}

     __init272() {this._whenSetModSetting = (mod, invalidIndex = false) => {
        let text = "none";
        if (this._modSetBoxes[mod].selectedIndex != -1) {
            text = this._modSetBoxes[mod].children[this._modSetBoxes[mod].selectedIndex].textContent ;

            if (invalidIndex) {
                // A setting is invalid (not in instrument's effects). It will be the first index. Allow it, but mark it as red.
                this._modSetBoxes[mod].selectedOptions.item(0).style.setProperty("color", "red");
                this._modSetBoxes[mod].classList.add("invalidSetting");
                this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].invalidModulators[mod] = true;
            } else {
                this._modSetBoxes[mod].classList.remove("invalidSetting");
                this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()].invalidModulators[mod] = false;
            }
        }
        if (!invalidIndex) // Invalid index means a set is actually not occurring, just the same index and a warning.
            this._doc.selection.setModSetting(mod, text);

        // Force piano to re-show if channel is modulator, as text shown on it needs to update
        this._piano.forceRender();

    }}

     __init273() {this._whenClickModTarget = (mod) => {
        if (this._modChannelBoxes[mod].selectedIndex >= 2) {
            this._doc.selection.setChannelBar(this._modChannelBoxes[mod].selectedIndex - 2, this._doc.bar);
        }
    }}

     __init274() {this._whenClickJumpToModTarget = () => {
        const channelIndex = this._doc.channel;
        const instrumentIndex = this._doc.getCurrentInstrument();
        if (channelIndex < this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount) {
            for (let modChannelIdx = this._doc.song.pitchChannelCount + this._doc.song.noiseChannelCount; modChannelIdx < this._doc.song.channels.length; modChannelIdx++) {
                const modChannel = this._doc.song.channels[modChannelIdx];
                const patternIdx = modChannel.bars[this._doc.bar];
                if (patternIdx > 0) {
                    const modInstrumentIdx = modChannel.patterns[patternIdx - 1].instruments[0];
                    const modInstrument = modChannel.instruments[modInstrumentIdx];
                    for (let mod = 0; mod < Config.modCount; mod++) {
                        if (modInstrument.modChannels[mod] == channelIndex && (modInstrument.modInstruments[mod] == instrumentIndex || modInstrument.modInstruments[mod] >= this._doc.song.channels[channelIndex].instruments.length)) {
                            this._doc.selection.setChannelBar(modChannelIdx, this._doc.bar);
                            return;
                        }
                    }
                }
            }
        }
    }}

     __init275() {this._whenSetModFilter = (mod) => {
        this._doc.selection.setModFilter(mod, this._modFilterBoxes[mod].selectedIndex);
    }}

     __init276() {this._whenSetChipWave = () => {
        this._doc.record(new ChangeChipWave(this._doc, this._chipWaveSelect.selectedIndex));
    }}

     __init277() {this._whenSetNoiseWave = () => {
        this._doc.record(new ChangeNoiseWave(this._doc, this._chipNoiseSelect.selectedIndex));
    }}



     __init278() {this._whenSetTransition = () => {
        this._doc.record(new ChangeTransition(this._doc, this._transitionSelect.selectedIndex));
    }}

     __init279() {this._whenSetEffects = () => {
        const instrument = this._doc.song.channels[this._doc.channel].instruments[this._doc.getCurrentInstrument()];
        const oldValue = instrument.effects;
        const toggleFlag = Config.effectOrder[this._effectsSelect.selectedIndex - 1];
        this._doc.record(new ChangeToggleEffects(this._doc, toggleFlag, null));
        this._effectsSelect.selectedIndex = 0;
        if (instrument.effects > oldValue) {
            this._doc.addedEffect = true;
        }
        this._doc.notifier.changed();
    }}

     __init280() {this._whenSetVibrato = () => {
        this._doc.record(new ChangeVibrato(this._doc, this._vibratoSelect.selectedIndex));
    }}

     __init281() {this._whenSetVibratoType = () => {
        this._doc.record(new ChangeVibratoType(this._doc, this._vibratoTypeSelect.selectedIndex));
    }}

     __init282() {this._whenSetUnison = () => {
        this._doc.record(new ChangeUnison(this._doc, this._unisonSelect.selectedIndex));
    }}

     __init283() {this._whenSetChord = () => {
        this._doc.record(new ChangeChord(this._doc, this._chordSelect.selectedIndex));
    }}

     __init284() {this._addNewEnvelope = () => {
        this._doc.record(new ChangeAddEnvelope(this._doc));
        this.refocusStage();
        this._doc.addedEnvelope = true;
    }}

     __init285() {this._zoomIn = () => {
        this._doc.prefs.visibleOctaves = Math.max(1, this._doc.prefs.visibleOctaves - 1);
        this._doc.prefs.save();
        this._doc.notifier.changed();
        this.refocusStage();
    }}

     __init286() {this._zoomOut = () => {
        this._doc.prefs.visibleOctaves = Math.min(Config.pitchOctaves, this._doc.prefs.visibleOctaves + 1);
        this._doc.prefs.save();
        this._doc.notifier.changed();
        this.refocusStage();
    }}

     __init287() {this._fileMenuHandler = (event) => {
        switch (this._fileMenu.value) {
            case "new":
                this._doc.goBackToStart();
                this._doc.song.restoreLimiterDefaults();
                for (const channel of this._doc.song.channels) {
                    channel.muted = false;
                    channel.name = "";
                }
                this._doc.record(new ChangeSong(this._doc, ""), false, true);
                break;
            case "export":
                this._openPrompt("export");
                break;
            case "import":
                this._openPrompt("import");
                break;
            case "copyUrl":
                this._copyTextToClipboard(new URL("#" + this._doc.song.toBase64String(), location.href).href);
                break;
            case "shareUrl":
                (navigator).share({ url: new URL("#" + this._doc.song.toBase64String(), location.href).href });
                break;
            case "shortenUrl":
                window.open("https://tinyurl.com/api-create.php?url=" + encodeURIComponent(new URL("#" + this._doc.song.toBase64String(), location.href).href));
                break;
            case "viewPlayer":
                location.href = "player/#song=" + this._doc.song.toBase64String();
                break;
            case "copyEmbed":
                this._copyTextToClipboard(`<iframe width="384" height="60" style="border: none;" src="${new URL("player/#song=" + this._doc.song.toBase64String(), location.href).href}"></iframe>`);
                break;
            case "songRecovery":
                this._openPrompt("songRecovery");
                break;
        }
        this._fileMenu.selectedIndex = 0;
    }}

     __init288() {this._editMenuHandler = (event) => {
        switch (this._editMenu.value) {
            case "undo":
                this._doc.undo();
                break;
            case "redo":
                this._doc.redo();
                break;
            case "copy":
                this._doc.selection.copy();
                break;
            case "insertBars":
                this._doc.selection.insertBars();
                break;
            case "deleteBars":
                this._doc.selection.deleteBars();
                break;
            case "insertChannel":
                this._doc.selection.insertChannel();
                break;
            case "deleteChannel":
                this._doc.selection.deleteChannel();
                break;
            case "pasteNotes":
                this._doc.selection.pasteNotes();
                break;
            case "pasteNumbers":
                this._doc.selection.pasteNumbers();
                break;
            case "transposeUp":
                this._doc.selection.transpose(true, false);
                break;
            case "transposeDown":
                this._doc.selection.transpose(false, false);
                break;
            case "selectAll":
                this._doc.selection.selectAll();
                break;
            case "selectChannel":
                this._doc.selection.selectChannel();
                break;
            case "duplicatePatterns":
                this._doc.selection.duplicatePatterns();
                break;
            case "barCount":
                this._openPrompt("barCount");
                break;
            case "beatsPerBar":
                this._openPrompt("beatsPerBar");
                break;
            case "moveNotesSideways":
                this._openPrompt("moveNotesSideways");
                break;
            case "channelSettings":
                this._openPrompt("channelSettings");
                break;
            case "limiterSettings":
                this._openPrompt("limiterSettings");
                break;
        }
        this._editMenu.selectedIndex = 0;
    }}

     __init289() {this._optionsMenuHandler = (event) => {
        switch (this._optionsMenu.value) {
            case "autoPlay":
                this._doc.prefs.autoPlay = !this._doc.prefs.autoPlay;
                break;
            case "autoFollow":
                this._doc.prefs.autoFollow = !this._doc.prefs.autoFollow;
                break;
            case "enableNotePreview":
                this._doc.prefs.enableNotePreview = !this._doc.prefs.enableNotePreview;
                break;
            case "showLetters":
                this._doc.prefs.showLetters = !this._doc.prefs.showLetters;
                break;
            case "showFifth":
                this._doc.prefs.showFifth = !this._doc.prefs.showFifth;
                break;
            case "notesOutsideScale":
                this._doc.prefs.notesOutsideScale = !this._doc.prefs.notesOutsideScale;
                break;
            case "setDefaultScale":
                this._doc.prefs.defaultScale = this._doc.song.scale;
                break;
            case "showChannels":
                this._doc.prefs.showChannels = !this._doc.prefs.showChannels;
                break;
            case "showScrollBar":
                this._doc.prefs.showScrollBar = !this._doc.prefs.showScrollBar;
                break;
            case "alwaysFineNoteVol":
                this._doc.prefs.alwaysFineNoteVol = !this._doc.prefs.alwaysFineNoteVol;
                break;
            case "enableChannelMuting":
                this._doc.prefs.enableChannelMuting = !this._doc.prefs.enableChannelMuting;
                for (const channel of this._doc.song.channels) channel.muted = false;
                break;
            case "displayBrowserUrl":
                this._doc.toggleDisplayBrowserUrl();
                break;
            case "displayVolumeBar":
                this._doc.prefs.displayVolumeBar = !this._doc.prefs.displayVolumeBar;
                break;
            case "layout":
                this._openPrompt("layout");
                break;
            case "colorTheme":
                this._openPrompt("theme");
                break;
            case "recordingSetup":
                this._openPrompt("recordingSetup");
                break;
        }
        this._optionsMenu.selectedIndex = 0;
        this._doc.notifier.changed();
        this._doc.prefs.save();
    }}

     __init290() {this._customWavePresetHandler = (event) => {

        // Update custom wave value
        let customWaveArray = new Float32Array(64);
        let index = this._customWavePresetDrop.selectedIndex - 1;
        let maxValue = Number.MIN_VALUE;
        let minValue = Number.MAX_VALUE;
        let arrayPoint = 0;
        let arrayStep = (Config.chipWaves[index].samples.length - 1) / 64.0;

        for (let i = 0; i < 64; i++) {
            // Compute derivative to get original wave.
            customWaveArray[i] = (Config.chipWaves[index].samples[Math.floor(arrayPoint)] - Config.chipWaves[index].samples[(Math.floor(arrayPoint) + 1)]) / arrayStep;

            if (customWaveArray[i] < minValue)
                minValue = customWaveArray[i];

            if (customWaveArray[i] > maxValue)
                maxValue = customWaveArray[i];

            // Scale an any-size array to 64 elements
            arrayPoint += arrayStep;
        }

        for (let i = 0; i < 64; i++) {
            // Change array range from Min~Max to 0~(Max-Min)
            customWaveArray[i] -= minValue;
            // Divide by (Max-Min) to get a range of 0~1,
            customWaveArray[i] /= (maxValue - minValue);
            //then multiply by 48 to get 0~48,
            customWaveArray[i] *= 48.0;
            //then subtract 24 to get - 24~24
            customWaveArray[i] -= 24.0;
            //need to force integers
            customWaveArray[i] = Math.ceil(customWaveArray[i]);

            // Copy back data to canvas
            this._customWaveDrawCanvas.newArray[i] = customWaveArray[i];
        }

        //this._instrumentVolumeSlider.input.value = "" + Math.round(Config.waveVolumes[index] * 50.0 - 50.0);

        this._doc.record(new ChangeCustomWave(this._doc, customWaveArray))
        this._doc.record(new ChangeVolume(this._doc, +this._instrumentVolumeSlider.input.value, -Config.volumeRange / 2 + Math.round(Math.sqrt(Config.chipWaves[index].expression) * Config.volumeRange / 2)));

        this._customWavePresetDrop.selectedIndex = 0;
        this._doc.notifier.changed();
        this._doc.prefs.save();
    }}

    _updateCollaborationUI() {
        if (!window.boneboxParty) return;
        const state = window.boneboxParty.getState();
        if (state.inParty) {
            this._collaborationToggle.textContent = "Disable Collaboration";
            this._collaborationToggle.style.background = "rgba(255, 100, 100, 0.2)";
            this._collaborationToggle.style.color = "#ff8080";
            this._collaborationToggle.style.border = "1px solid rgba(255, 100, 100, 0.4)";
            
            this._roomCodeRow.style.display = "flex";
            this._inviteLinkRow.style.display = "flex";
            this._roomCodeInput.value = state.roomCode || "";
            // If running on localhost or file (Electron), use the public landing page for sharing
            const publicBase = (window.location.hostname === "localhost" || window.location.protocol === "file:") 
                ? "https://bonesisuseful.github.io/bone-box/invite.html" 
                : window.location.origin + window.location.pathname.replace("index.html", "") + "invite.html";
            this._inviteLinkInput.value = publicBase + "?party=" + state.roomCode;
            this._joinRoomRow.style.display = "none";
        } else {
            this._collaborationToggle.textContent = "Enable Collaboration";
            this._collaborationToggle.style.background = "linear-gradient(135deg, #7c4dff, #9c64f7)";
            this._collaborationToggle.style.color = "white";
            this._collaborationToggle.style.border = "none";
            
            this._roomCodeRow.style.display = "none";
            this._inviteLinkRow.style.display = "none";
            this._joinRoomRow.style.display = "flex";
        }
    }
}
