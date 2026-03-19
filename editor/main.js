// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { EnvelopeType, InstrumentType, Config } from "../synth/SynthConfig.js";
import { isMobile, EditorConfig } from "./EditorConfig.js";
import { ColorConfig } from "./ColorConfig.js";
import "./style.js"; // Import for the side effects, there's no exports.
import "../website/party.js";
import { SongEditor } from "./SongEditor.js";
import { Note, Pattern, Instrument, Channel, Song, Synth } from "../synth/synth.js";
import { SongDocument } from "./SongDocument.js";
import { ExportPrompt } from "./ExportPrompt.js";
import { ChangePreset } from "./changes.js";
import { TabManager } from "./TabManager.js";

const beepbox = { EnvelopeType, InstrumentType, Config, Note, Pattern, Instrument, Channel, Song, Synth, ColorConfig, EditorConfig, SongDocument, SongEditor, ExportPrompt, ChangePreset };
window.beepbox = beepbox;

const doc = new SongDocument();
doc.prompt = null;
const editor = new SongEditor(doc);
const tabManager = new TabManager(doc);
const beepboxEditorContainer = document.getElementById("beepboxEditorContainer");

document.body.insertBefore(tabManager.container, beepboxEditorContainer);
beepboxEditorContainer.appendChild(editor.mainLayer);

editor.whenUpdated();

// Fade-in transitions
editor.mainLayer.className += " load";
const classesToLoad = ["pattern-area", "settings-area", "song-settings-area", "instrument-settings-area", "trackAndMuteContainer", "barScrollBar"];
for (const className of classesToLoad) {
	const elements = editor.mainLayer.getElementsByClassName(className);
	for (let i = 0; i < elements.length; i++) {
		elements[i].classList.add("load");
	}
}

// Give select2 class to these
$('#pitchPresetSelect').select2({ dropdownAutoWidth: true });
$('#drumPresetSelect').select2({ dropdownAutoWidth: true });

// Onclick event to expand/collapse optgroups
$("body").on('click', '.select2-container--open .select2-results__group', function () {
	$(this).siblings().toggle();
});

// Open event to collapse all optgroups by default
$("#pitchPresetSelect").on('select2:open', function () {
	$('.select2-dropdown--below').css('opacity', 0);
	$('.select2-dropdown').css('opacity', 1);
	$('#pitchPresetSelect')
	setTimeout(() => {
		let groups = $('.select2-container--open .select2-results__group');
		let options = $('.select2-container--open .select2-results__option');

		$.each(groups, (index, v) => {
			$(v).siblings().hide();
			$(v)[0].setAttribute("style", "color: " + ColorConfig.getChannelColor(doc.song, doc.channel).primaryNote + ";");
		})
		$.each(options, (index, v) => {
			$(v)[0].setAttribute("style", "color: " + ColorConfig.getChannelColor(doc.song, doc.channel).primaryNote + ";");
		})

		$('.select2-dropdown--below').css('opacity', 1);
	}, 0);
});

// Open event to collapse all optgroups by default
$("#drumPresetSelect").on('select2:open', function () {
	$('.select2-dropdown--below').css('opacity', 0);
	$('.select2-dropdown').css('opacity', 1);
	$('#drumPresetSelect')
	setTimeout(() => {
		let groups = $('.select2-container--open .select2-results__group');
		let options = $('.select2-container--open .select2-results__option');

		$.each(groups, (index, v) => {
			$(v).siblings().hide();
			$(v)[0].setAttribute("style", "color: " + ColorConfig.getChannelColor(doc.song, doc.channel).primaryNote + ";");
		})
		$.each(options, (index, v) => {
			$(v)[0].setAttribute("style", "color: " + ColorConfig.getChannelColor(doc.song, doc.channel).primaryNote + ";");
		})

		$('.select2-dropdown--below').css('opacity', 1);
	}, 0);
});

// Select2 events
// The latter is to ensure select2 doesn't keep focus after the select2 is closed without making a selection.
$('#pitchPresetSelect').on("change", editor._whenSetPitchedPreset);
$('#pitchPresetSelect').on("select2:close", editor._refocus);

$('#drumPresetSelect').on("change", editor._whenSetDrumPreset);
$('#drumPresetSelect').on("select2:close", editor._refocus);


editor.mainLayer.focus();

// don't autoplay on mobile devices, wait for input.
if (!isMobile && doc.prefs.autoPlay) {
	function autoplay() {
		if (!document.hidden) {
			doc.synth.play();
			editor.updatePlayButton();
			window.removeEventListener("visibilitychange", autoplay);
		}
	}
	if (document.hidden) {
		// Wait until the tab is visible to autoplay:
		window.addEventListener("visibilitychange", autoplay);
	} else {
		// Can't call this immediately, as main.ts needs to finish executing for the beepbox namespace to finish being declared.
		window.setTimeout(autoplay);
	}
}

// BeepBox uses browser history state as its own undo history. Browsers typically
// remember scroll position for each history state, but BeepBox users would prefer not 
// auto scrolling when undoing. Sadly this tweak doesn't work on Edge or IE.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

editor.updatePlayButton();

if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("/service_worker.js", {updateViaCache: "all", scope: "/"}).catch(() => {});
}

// Version check periodically
async function checkUpdates() {
	try {
		const response = await fetch("package.json?v=" + Date.now());
		const data = await response.json();
		if (data.version && data.version !== EditorConfig.version) {
			if (window.boneboxParty && window.boneboxParty.showToast) {
				window.boneboxParty.showToast("🚀 A new update (v" + data.version + ") is available! Click here to restart and apply.", "update", 30000);
			}
		}
	} catch (e) {
		// Silently continue if offline
	}
}
setTimeout(checkUpdates, 5000); // Check 5s after bootup
setInterval(checkUpdates, 1000 * 60 * 30); // Check every 30 minutes

// When compiling synth.ts as a standalone module named "beepbox", expose these classes as members to JavaScript:
export { EnvelopeType, InstrumentType, Config, Note, Pattern, Instrument, Channel, Song, Synth, ColorConfig, EditorConfig, SongDocument, SongEditor, ExportPrompt, ChangePreset } ;
