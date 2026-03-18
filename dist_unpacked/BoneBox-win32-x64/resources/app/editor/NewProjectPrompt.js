import { Config } from "../synth/SynthConfig.js";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig.js";
import { ChangeSong, ChangeBeatsPerBar, ChangeSongTitle } from "./changes.js";

const { button, div, h2, input, select, option, label, span } = HTML;

export class NewProjectPrompt {
    constructor(doc, callback) {
        this._doc = doc;
        this._callback = callback;

        this._nameInput = input({ 
            class: "party-input", 
            type: "text", 
            placeholder: "Unnamed", 
            value: "Unnamed",
            style: "width: 100%; margin-bottom: 1em;"
        });

        this._scaleSelect = select({ style: "width: 100%; margin-bottom: 1em;" });
        for (let i = 0; i < Config.scales.length; i++) {
            this._scaleSelect.appendChild(option({ value: i }, Config.scales[i].name));
        }
        this._scaleSelect.value = this._doc.prefs.defaultScale;

        this._keySelect = select({ style: "width: 100%; margin-bottom: 1em;" });
        for (let i = 0; i < Config.keys.length; i++) {
            this._keySelect.appendChild(option({ value: i }, Config.keys[Config.keys.length - 1 - i].name));
        }
        this._keySelect.value = (Config.keys.length - 1).toString(); // C

        this._tempoInput = input({ 
            style: "width: 100%; margin-bottom: 1em;", 
            type: "number", 
            value: "150", 
            min: "30", 
            max: "500" 
        });

        this._beatsInput = input({ 
            style: "width: 100%; margin-bottom: 1em;", 
            type: "number", 
            value: "8", 
            min: "1", 
            max: "16" 
        });

        this._collabToggle = input({ type: "checkbox", style: "margin-right: 0.5em;" });
        this._roomCodeInput = input({ 
            class: "party-input", 
            type: "text", 
            placeholder: "ROOM CODE", 
            style: "width: 100%; margin-top: 0.5em; display: none; text-transform: uppercase;",
            maxlength: "6"
        });

        this._collabToggle.addEventListener("change", () => {
            this._roomCodeInput.style.display = this._collabToggle.checked ? "block" : "none";
            if (this._collabToggle.checked) {
                this._roomCodeInput.value = Math.random().toString(36).substring(2, 8).toUpperCase();
            }
        });

        this._cancelButton = button({ class: "cancelButton" });
        this._okayButton = button({ class: "okayButton", style: "width: 100%; margin-top: 1em;" }, "Create Project");

        this.container = div({ class: "prompt noSelection", style: "width: 300px; padding: 25px;" },
            h2("New Project"),
            label({ style: "display: block; margin-bottom: 0.3em; font-size: 11px; color: #999;" }, "PROJECT NAME"),
            this._nameInput,
            
            div({ style: "display: grid; grid-template-columns: 1fr 1fr; gap: 10px;" },
                div({}, 
                    label({ style: "display: block; margin-bottom: 0.3em; font-size: 11px; color: #999;" }, "SCALE"),
                    this._scaleSelect
                ),
                div({}, 
                    label({ style: "display: block; margin-bottom: 0.3em; font-size: 11px; color: #999;" }, "KEY"),
                    this._keySelect
                )
            ),

            div({ style: "display: grid; grid-template-columns: 1fr 1fr; gap: 10px;" },
                div({}, 
                    label({ style: "display: block; margin-bottom: 0.3em; font-size: 11px; color: #999;" }, "TEMPO"),
                    this._tempoInput
                ),
                div({}, 
                    label({ style: "display: block; margin-bottom: 0.3em; font-size: 11px; color: #999;" }, "BEATS"),
                    this._beatsInput
                )
            ),

            div({ style: "margin-top: 0.5em; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px;" },
                label({ style: "display: flex; align-items: center; cursor: pointer;" }, 
                    this._collabToggle,
                    span("Enable Collab Session")
                ),
                this._roomCodeInput
            ),

            this._okayButton,
            this._cancelButton
        );

        this._okayButton.addEventListener("click", () => this._submit());
        this._cancelButton.addEventListener("click", () => this._close());
    }

    _close() {
        this._doc.undo();
    }

    cleanUp() {
        this._okayButton.removeEventListener("click", this._submit);
        this._cancelButton.removeEventListener("click", this._close);
    }

    _submit() {
        const settings = {
            name: this._nameInput.value || "Unnamed",
            scale: parseInt(this._scaleSelect.value),
            key: Config.keys.length - 1 - parseInt(this._keySelect.value),
            tempo: parseInt(this._tempoInput.value),
            beats: parseInt(this._beatsInput.value),
            collab: this._collabToggle.checked,
            roomCode: this._roomCodeInput.value.toUpperCase()
        };

        this._doc.prompt = null;
        if (this._callback) this._callback(settings);
    }
}
