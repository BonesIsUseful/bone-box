// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

import { ColorConfig } from "./ColorConfig.js";
import { Config } from "../synth/SynthConfig.js";
import { isMobile } from "./EditorConfig.js";

import { ChannelRow } from "./ChannelRow.js";

import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";

export class TrackEditor {
	  __init() {this._barDropDown = HTML.select({ style: "width: 32px; height: " + Config.barEditorHeight + "px; top: 0px; position: absolute; opacity: 0" },

		HTML.option({ value: "barBefore" }, "Insert Bar Before"),
		HTML.option({ value: "barAfter" }, "Insert Bar After"),
		HTML.option({ value: "deleteBar" }, "Delete This Bar"),
	)}
	  __init2() {this._channelRowContainer = HTML.div({style: `display: flex; flex-direction: column; padding-top: ${Config.barEditorHeight}px`})}
	  __init3() {this._barNumberContainer = SVG.g()}
	  __init4() {this._playhead = SVG.rect({fill: ColorConfig.playhead, x: 0, y: 0, width: 4, height: 128})}
	  __init5() {this._boxHighlight = SVG.rect({fill: "none", stroke: ColorConfig.hoverPreview, "stroke-width": 2, "pointer-events": "none", x: 1, y: 1, width: 30, height: 30})}
	  __init6() {this._upHighlight = SVG.path({fill: ColorConfig.invertedText, stroke: ColorConfig.invertedText, "stroke-width": 1, "pointer-events": "none"})}
	  __init7() {this._downHighlight = SVG.path({fill: ColorConfig.invertedText, stroke: ColorConfig.invertedText, "stroke-width": 1, "pointer-events": "none"})}
	  __init8() {this._barEditorPath = SVG.path({ fill: ColorConfig.uiWidgetBackground, stroke: ColorConfig.uiWidgetBackground, "stroke-width": 1, "pointer-events": "none" });
		this._loopBarLeftBorder = SVG.line({ stroke: ColorConfig.loopAccent, "stroke-width": 2, "pointer-events": "none", "stroke-linecap": "square", x1: "0", y1: "0", x2: "0", y2: "0" });
		this._loopBarRightBorder = SVG.line({ stroke: ColorConfig.loopAccent, "stroke-width": 2, "pointer-events": "none", "stroke-linecap": "square", x1: "0", y1: "0", x2: "0", y2: "0" });
	}
	  __init9() {this._selectionRect = SVG.rect({ class: "dashed-line dash-move", fill: ColorConfig.boxSelectionFill, stroke: ColorConfig.hoverPreview, "stroke-width": 2, "stroke-dasharray": "5, 3", "fill-opacity": "0.4", "pointer-events": "none", visibility: "hidden", x: 1, y: 1, width: 62, height: 62 })}
	  __init10() {this._svg = SVG.svg({style: `position: absolute; top: 0;`},
		this._barEditorPath,
		this._selectionRect,
		this._barNumberContainer,
		this._boxHighlight,
		this._upHighlight,
		this._downHighlight,
		this._loopBarLeftBorder,
		this._loopBarRightBorder,
		this._playhead,
	)}
	  __init11() {this._select = HTML.select({class: "trackSelectBox", style: "background: none; border: none; appearance: none; border-radius: initial; box-shadow: none; color: transparent; position: absolute; touch-action: none;"})}
	  __init12() {this.container = HTML.div({class: "noSelection", style: "position: relative; overflow: hidden;"},
		this._channelRowContainer,
		this._svg,
		this._select,
		this._barDropDown
	)}
	  __init13() {this._channels = []}
	  __init14() {this._barNumbers = []}
	 __init15() {this._mouseX = 0}
	 __init16() {this._mouseY = 0}
	//private _lastScrollTime: number = 0;
	//private _selecting: boolean = false;
	//private _selectionStartBar: number = 0;
	//private _selectionStartChannel: number = 0;
	//private _pattern: Pattern | null = null;
	 __init17() {this._mouseStartBar = 0}
	 __init18() {this._mouseStartChannel = 0}
	 __init19() {this._mouseBar = 0}
	 __init20() {this._mouseChannel = 0}
	 __init21() {this._mouseOver = false}
	 __init22() {this._mousePressed = false}
	 __init23() {this._mouseDragging = false}
	 __init24() {this._barWidth = 32}
	 __init25() {this._renderedBarCount = -1}
	 __init26() {this._renderedEditorWidth = -1}
	 __init27() {this._renderedEditorHeight = -1}
	 __init28() {this._renderedPatternCount = 0}
	 __init29() {this._renderedPlayhead = -1}
	 __init30() {this._touchMode = isMobile}
	 __init31() {this._barDropDownBar = 0}
	 __init32() {this._lastScrollTime = 0}
		
	constructor( _doc,  _songEditor) {;this._doc = _doc;this._songEditor = _songEditor;TrackEditor.prototype.__init.call(this);TrackEditor.prototype.__init2.call(this);TrackEditor.prototype.__init3.call(this);TrackEditor.prototype.__init4.call(this);TrackEditor.prototype.__init5.call(this);TrackEditor.prototype.__init6.call(this);TrackEditor.prototype.__init7.call(this);TrackEditor.prototype.__init8.call(this);TrackEditor.prototype.__init9.call(this);TrackEditor.prototype.__init10.call(this);TrackEditor.prototype.__init11.call(this);TrackEditor.prototype.__init12.call(this);TrackEditor.prototype.__init13.call(this);TrackEditor.prototype.__init14.call(this);TrackEditor.prototype.__init15.call(this);TrackEditor.prototype.__init16.call(this);TrackEditor.prototype.__init17.call(this);TrackEditor.prototype.__init18.call(this);TrackEditor.prototype.__init19.call(this);TrackEditor.prototype.__init20.call(this);TrackEditor.prototype.__init21.call(this);TrackEditor.prototype.__init22.call(this);TrackEditor.prototype.__init23.call(this);TrackEditor.prototype.__init24.call(this);TrackEditor.prototype.__init25.call(this);TrackEditor.prototype.__init26.call(this);TrackEditor.prototype.__init27.call(this);TrackEditor.prototype.__init28.call(this);TrackEditor.prototype.__init29.call(this);TrackEditor.prototype.__init30.call(this);TrackEditor.prototype.__init31.call(this);TrackEditor.prototype.__init32.call(this);TrackEditor.prototype.__init33.call(this);TrackEditor.prototype.__init34.call(this);TrackEditor.prototype.__init35.call(this);TrackEditor.prototype.__init36.call(this);TrackEditor.prototype.__init37.call(this);TrackEditor.prototype.__init38.call(this);TrackEditor.prototype.__init39.call(this);TrackEditor.prototype.__init40.call(this);TrackEditor.prototype.__init41.call(this);TrackEditor.prototype.__init42.call(this);TrackEditor.prototype.__init43.call(this);TrackEditor.prototype.__init44.call(this);
		window.requestAnimationFrame(this._animatePlayhead);
		this._svg.addEventListener("mousedown", this._whenMousePressed);
		document.addEventListener("mousemove", this._whenMouseMoved);
		document.addEventListener("mouseup", this._whenMouseReleased);
		this._svg.addEventListener("mouseover", this._whenMouseOver);
		this._svg.addEventListener("mouseout", this._whenMouseOut);
			
		this._select.addEventListener("change", this._whenSelectChanged);
		this._select.addEventListener("touchstart", this._whenSelectPressed);
		this._select.addEventListener("touchmove", this._whenSelectMoved);
		this._select.addEventListener("touchend", this._whenSelectReleased);
		this._select.addEventListener("touchcancel", this._whenSelectReleased);
			
		let determinedCursorType = false;
		document.addEventListener("mousedown", () => {
			if (!determinedCursorType) {
				this._touchMode = false;
				this._updatePreview();
			}
			determinedCursorType = true;
		}, true);
		document.addEventListener("touchstart", () => {
			if (!determinedCursorType) {
				this._touchMode = true;
				this._updatePreview();
			}
			determinedCursorType = true;
		}, true);

		this._barDropDown.selectedIndex = -1;
		this._barDropDown.addEventListener("change", this._barDropDownHandler);
		this._barDropDown.addEventListener("mousedown", this._barDropDownGetOpenedPosition);

	}

	 __init33() {this._barDropDownGetOpenedPosition = (event) => {
		this._barDropDownBar = Math.floor(Math.min(this._doc.song.barCount - 1, Math.max(0, this._mouseX / this._barWidth)));
	}}

	 __init34() {this._barDropDownHandler = (event) => {

		var moveBarOffset = (this._barDropDown.value == "barBefore") ? 0 : 1;

		if (this._barDropDown.value == "barBefore" || this._barDropDown.value == "barAfter") {

			//var prevBar = this._doc.bar;

			this._doc.bar = this._barDropDownBar - 1 + moveBarOffset;

			this._doc.selection.resetBoxSelection();
			this._doc.selection.insertBars();

			// This moves doc.bar back. I kind of like moving it to the inserted zone, though.
			// this._doc.bar = prevBar + ((prevBar < this._barDropDownBar + moveBarOffset) ? 0 : 1);

			// Adjust song playhead
			if (this._doc.synth.playhead >= this._barDropDownBar + moveBarOffset) {
				this._doc.synth.playhead++;
				this._songEditor._barScrollBar.animatePlayhead();
			}

	}
		else if (this._barDropDown.value == "deleteBar") {
		
			//var prevBar = this._doc.bar;

			this._doc.bar = this._barDropDownBar;

			this._doc.selection.resetBoxSelection();
			this._doc.selection.deleteBars();

			// This moves doc.bar back. I kind of like moving it to the deleted zone, though.
			// this._doc.bar = prevBar - ((prevBar <= this._barDropDownBar) ? 0 : 1);

			// Adjust song playhead
			if (this._doc.synth.playhead > this._barDropDownBar) {
				this._doc.synth.playhead--;
				this._songEditor._barScrollBar.animatePlayhead();
			}

		}

		this._barDropDown.selectedIndex = -1;
	}}

	 __init35() {this._whenSelectChanged = () => {
		this._doc.selection.setPattern(this._select.selectedIndex);
	}}
		
	 __init36() {this._animatePlayhead = (timestamp) => {
		const playhead = (this._barWidth * this._doc.synth.playhead - 2);
		if (this._renderedPlayhead != playhead) {
			this._renderedPlayhead = playhead;
			this._playhead.setAttribute("x", "" + playhead);
		}
		window.requestAnimationFrame(this._animatePlayhead);
	}}
	
	 movePlayheadToMouse() {
		if (this._mouseOver) {
			this._doc.synth.playhead = this._mouseBar + (this._mouseX % this._barWidth) / this._barWidth;
			return true;
		}
		return false;
	}
	
	 _dragBoxSelection() {
		this._doc.selection.setTrackSelection(this._doc.selection.boxSelectionX0, this._mouseBar, this._doc.selection.boxSelectionY0, this._mouseChannel);
		this._doc.selection.selectionUpdated();
	}
		
	 _updateSelectPos(event) {
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = event.touches[0].clientX - boundingRect.left;
		this._mouseY = event.touches[0].clientY - boundingRect.top;
		if (isNaN(this._mouseX)) this._mouseX = 0;
		if (isNaN(this._mouseY)) this._mouseY = 0;
		this._mouseBar = Math.floor(Math.min(this._doc.song.barCount - 1, Math.max(0, this._mouseX / this._barWidth)));
		this._mouseChannel = Math.floor(Math.min(this._doc.song.getChannelCount() - 1, Math.max(0, (this._mouseY - Config.barEditorHeight) / ChannelRow.patternHeight)));
	}
		
	 __init37() {this._whenSelectPressed = (event) => {
		this._mousePressed = true;
		this._mouseDragging = true;
		this._updateSelectPos(event);
		this._mouseStartBar = this._mouseBar;
		this._mouseStartChannel = this._mouseChannel;
	}}
		
	 __init38() {this._whenSelectMoved = (event) => {
		this._updateSelectPos(event);
		if (this._mouseStartBar != this._mouseBar || this._mouseStartChannel != this._mouseChannel) {
			// if the touch has started dragging, cancel opening the select menu.
			event.preventDefault();
		}
		if (this._mousePressed) this._dragBoxSelection();
		this._updatePreview();
	}}
		
	 __init39() {this._whenSelectReleased = (event) => {
		this._mousePressed = false;
		this._mouseDragging = false;
		this._updatePreview();
	}}
		
	 __init40() {this._whenMouseOver = (event) => {
		if (this._mouseOver) return;
		this._mouseOver = true;
	}}
		
	 __init41() {this._whenMouseOut = (event) => {
		if (!this._mouseOver) return;
		this._mouseOver = false;
	}}
		
	 _updateMousePos(event) {
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.clientX || event.pageX) - boundingRect.left;
		this._mouseY = (event.clientY || event.pageY) - boundingRect.top;
		this._mouseBar = Math.floor(Math.min(this._doc.song.barCount - 1, Math.max(0, this._mouseX / this._barWidth)));
		this._mouseChannel = Math.floor(Math.min(this._doc.song.getChannelCount() - 1, Math.max(0, (this._mouseY - Config.barEditorHeight) / ChannelRow.patternHeight)));
	}
		
	 __init42() {this._whenMousePressed = (event) => {
		event.preventDefault();
		this._mousePressed = true;
		this._updateMousePos(event);
		this._mouseStartBar = this._mouseBar;
		this._mouseStartChannel = this._mouseChannel;

		// Act on track portion
		if (this._mouseY >= Config.barEditorHeight) {

		if (event.shiftKey) {
			this._mouseDragging = true;
			this._doc.selection.setTrackSelection(this._doc.selection.boxSelectionX0, this._mouseBar, this._doc.selection.boxSelectionY0, this._mouseChannel);
			this._doc.selection.selectionUpdated();
		} else {
			this._mouseDragging = false;
			if (this._doc.channel != this._mouseChannel || this._doc.bar != this._mouseBar) {
				this._doc.selection.setChannelBar(this._mouseChannel, this._mouseBar);
				this._mouseDragging = true;
			}
			this._doc.selection.resetBoxSelection();
		}
	}
	}}
		
	 __init43() {this._whenMouseMoved = (event) => {
		this._updateMousePos(event);
		if (this._mousePressed) {
			if (this._mouseStartBar != this._mouseBar || this._mouseStartChannel != this._mouseChannel) {
				this._mouseDragging = true;
			}
			this._dragBoxSelection();
		}
		this._updatePreview();
	}}
		
	 __init44() {this._whenMouseReleased = (event) => {
		if (this._mousePressed && !this._mouseDragging) {
			if (this._doc.channel == this._mouseChannel && this._doc.bar == this._mouseBar) {
				const up = ((this._mouseY - Config.barEditorHeight) % ChannelRow.patternHeight) < ChannelRow.patternHeight / 2;
				const patternCount = this._doc.song.patternsPerChannel;
				this._doc.selection.setPattern((this._doc.song.channels[this._mouseChannel].bars[this._mouseBar] + (up ? 1 : patternCount)) % (patternCount + 1));
			}
		}
		this._mousePressed = false;
		this._mouseDragging = false;
		this._updatePreview();
	}}
		
	 _updatePreview() {
		let channel = this._mouseChannel;
		let bar = this._mouseBar;
			
		if (this._touchMode) {
			bar = this._doc.bar;
			channel = this._doc.channel;
		}
			
		const selected = (bar == this._doc.bar && channel == this._doc.channel);
		const overTrackEditor = (this._mouseY >= Config.barEditorHeight);
			
		if (this._mouseDragging && this._mouseStartBar != this._mouseBar) {

			// Handle auto-scroll in selection. Only @50ms or slower.
			var timestamp = Date.now();

			if (timestamp - this._lastScrollTime >= 50) {

				if (bar > this._doc.barScrollPos + this._doc.trackVisibleBars - 1 && this._doc.barScrollPos < this._doc.song.barCount - this._doc.trackVisibleBars) {

					this._songEditor.changeBarScrollPos(1);
				}
				if (bar < this._doc.barScrollPos && this._doc.barScrollPos > 0) {

					this._songEditor.changeBarScrollPos(-1);
				}

				this._lastScrollTime = timestamp;

			}

		}

		if (this._mouseOver && !this._mousePressed && !selected && overTrackEditor) {
			this._boxHighlight.setAttribute("x", "" + (1 + this._barWidth * bar));
			this._boxHighlight.setAttribute("y", "" + (1 + Config.barEditorHeight + ChannelRow.patternHeight * channel));
			this._boxHighlight.setAttribute("height", "" + (ChannelRow.patternHeight - 2));
			this._boxHighlight.setAttribute("width", "" + (this._barWidth - 2));
			this._boxHighlight.style.visibility = "visible";
		} else if ((this._mouseOver || ((this._mouseX >= bar * this._barWidth) && (this._mouseX < bar * this._barWidth + this._barWidth) && (this._mouseY > 0))) && (!overTrackEditor)) {
			this._boxHighlight.setAttribute("x", "" + (1 + this._barWidth * bar));
			this._boxHighlight.setAttribute("y", "1"); // The y is set to 1 instead of 0 due to the thickness of the box causing it to go slightly outside the frame at y=0.
			this._boxHighlight.setAttribute("height", "" + (Config.barEditorHeight - 3));
			this._boxHighlight.style.visibility = "visible";
		} else {
			this._boxHighlight.style.visibility = "hidden";
		}
			
		if ((this._mouseOver || this._touchMode) && selected && overTrackEditor) {
			const up = ((this._mouseY - Config.barEditorHeight) % ChannelRow.patternHeight) < ChannelRow.patternHeight / 2;
			const center = this._barWidth * (bar + 0.8);
			const middle = Config.barEditorHeight + ChannelRow.patternHeight * (channel + 0.5);
			const base = ChannelRow.patternHeight * 0.1;
			const tip = ChannelRow.patternHeight * 0.4;
			const width = ChannelRow.patternHeight * 0.175;
				
			this._upHighlight.setAttribute("fill", up && !this._touchMode ? ColorConfig.hoverPreview : ColorConfig.invertedText);
			this._downHighlight.setAttribute("fill", !up && !this._touchMode ? ColorConfig.hoverPreview : ColorConfig.invertedText);
				
			this._upHighlight.setAttribute("d", `M ${center} ${middle - tip} L ${center + width} ${middle - base} L ${center - width} ${middle - base} z`);
			this._downHighlight.setAttribute("d", `M ${center} ${middle + tip} L ${center + width} ${middle + base} L ${center - width} ${middle + base} z`);
				
			this._upHighlight.style.visibility = "visible";
			this._downHighlight.style.visibility = "visible";
		} else {
			this._upHighlight.style.visibility = "hidden";
			this._downHighlight.style.visibility = "hidden";
		}
			
		this._selectionRect.style.left = (this._barWidth * this._doc.bar) + "px";
		this._selectionRect.style.top = (Config.barEditorHeight + (ChannelRow.patternHeight * this._doc.channel)) + "px";

		this._select.style.left = (this._barWidth * this._doc.bar) + "px";

		this._select.style.width = this._barWidth + "px";
		this._select.style.top = (Config.barEditorHeight + ChannelRow.patternHeight * this._doc.channel) + "px";
		this._select.style.height = ChannelRow.patternHeight + "px";
			
		this._barDropDown.style.left = (this._barWidth * bar) + "px";

		const patternCount = this._doc.song.patternsPerChannel + 1;
		for (let i = this._renderedPatternCount; i < patternCount; i++) {
				this._select.appendChild(HTML.option({value: i}, i));
		}
		for (let i = patternCount; i < this._renderedPatternCount; i++) {
				this._select.removeChild( this._select.lastChild);
		}
		this._renderedPatternCount = patternCount;
		const selectedPattern = this._doc.song.channels[this._doc.channel].bars[this._doc.bar];
		if (this._select.selectedIndex != selectedPattern) this._select.selectedIndex = selectedPattern;
	}
		
	 render() {

		this._barWidth = this._doc.getBarWidth();
			
		if (this._channels.length != this._doc.song.getChannelCount()) {

			// Add new channel boxes if needed
			for (let y = this._channels.length; y < this._doc.song.getChannelCount(); y++) {
				const channelRow = new ChannelRow(this._doc, y);
				this._channels[y] = channelRow;
				this._channelRowContainer.appendChild(channelRow.container);
			}
				
			// Remove old channel boxes
			for (let y = this._doc.song.getChannelCount(); y < this._channels.length; y++) {
				this._channelRowContainer.removeChild(this._channels[y].container);
			}
			
			this._channels.length = this._doc.song.getChannelCount();
			this._mousePressed = false;
		}

		for (let j = 0; j < this._doc.song.getChannelCount(); j++) {
			this._channels[j].render();
		}
			
		const editorWidth = this._barWidth * this._doc.song.barCount;
		if (this._renderedEditorWidth != editorWidth) {
			this._renderedEditorWidth = editorWidth;
			this._channelRowContainer.style.width = editorWidth + "px";
			this.container.style.width = editorWidth + "px";
			this._svg.setAttribute("width", editorWidth + "");
			this._mousePressed = false;

			// Update bar editor's SVG
			// this._upHighlight.setAttribute("d", `M ${center} ${middle - tip} L ${center + width} ${middle - base} L ${center - width} ${middle - base} z`);
			//this._downHighlight.setAttribute("d", `M ${center} ${middle + tip} L ${center + width} ${middle + base} L ${center - width} ${middle + base} z`);

			var pathString = "";

			for (let x = 0; x < this._doc.song.barCount; x++) {
				var pathLeft = x * this._barWidth + 2;
				var pathTop = 1;
				var pathRight = x * this._barWidth + this._barWidth - 2;
				var pathBottom = Config.barEditorHeight - 3;

				pathString += `M ${pathLeft} ${pathTop} H ${pathRight} V ${pathBottom} H ${pathLeft} V ${pathTop} Z `;
		}
			
			this._barEditorPath.setAttribute("d", pathString);

			if (this._renderedBarCount < this._doc.song.barCount) {
				this._barNumbers.length = this._doc.song.barCount;
				for (var pos = this._renderedBarCount; pos < this._barNumbers.length; pos++) {
					this._barNumbers[pos] = SVG.text({ "font-family": "sans-serif", "font-size": "8px", "text-anchor": "middle", "font-weight": "bold", "x": (pos * this._barWidth + this._barWidth / 2) + "px", "y": "7px", fill: ColorConfig.secondaryText }, "" + (pos + 1));
					if (pos % 4 == 0) {
						// Highlighting every 4 bars
						this._barNumbers[pos].setAttribute("fill", ColorConfig.primaryText);
					}
					this._barNumberContainer.appendChild(this._barNumbers[pos]);
				}
				this._renderedBarCount = this._doc.song.barCount;
			}
			else if (this._renderedBarCount > this._doc.song.barCount) {
				for (var pos = this._renderedBarCount - 1; pos >= this._doc.song.barCount; pos--) {
					this._barNumberContainer.removeChild(this._barNumbers[pos]);
				}
				this._barNumbers.length = this._doc.song.barCount;
				this._renderedBarCount = this._doc.song.barCount;
			}

			// Update x of bar editor numbers
			for (var pos = 0; pos < this._barNumbers.length; pos++) {
				this._barNumbers[pos].setAttribute("x", (pos * this._barWidth + this._barWidth / 2) + "px");
			}
		
			this._renderedEditorWidth = editorWidth;
			this._channelRowContainer.style.width = editorWidth + "px";
			this.container.style.width = editorWidth + "px";
			this._svg.setAttribute("width", editorWidth + "");
			this._mousePressed = false;
		}
		
		const editorHeight = this._doc.song.getChannelCount() * ChannelRow.patternHeight;
		if (this._renderedEditorHeight != editorHeight) {
			this._renderedEditorHeight = editorHeight;
			this._svg.setAttribute("height", "" + editorHeight + Config.barEditorHeight);
			this._playhead.setAttribute("height", "" + editorHeight + Config.barEditorHeight);
			this.container.style.height = (editorHeight + Config.barEditorHeight) + "px";
		}

		const Song = this._doc.song;
		const PathTop = 1;
		const PathBottom = Config.barEditorHeight + editorHeight - 2;
		const LeftX = Song.loopStart * this._barWidth + 2;
		const RightX = (Song.loopStart + Song.loopLength) * this._barWidth - 2;
		this._loopBarLeftBorder.setAttribute("x1", String(LeftX));
		this._loopBarLeftBorder.setAttribute("x2", String(LeftX));
		this._loopBarLeftBorder.setAttribute("y1", String(PathTop));
		this._loopBarLeftBorder.setAttribute("y2", String(PathBottom));
		this._loopBarRightBorder.setAttribute("x1", String(RightX));
		this._loopBarRightBorder.setAttribute("x2", String(RightX));
		this._loopBarRightBorder.setAttribute("y1", String(PathTop));
		this._loopBarRightBorder.setAttribute("y2", String(PathBottom));
			
		this._select.style.display = this._touchMode ? "" : "none";
		
		if (this._doc.selection.boxSelectionActive) {
			// TODO: This causes the selection rectangle to repaint every time the
			// editor renders and the selection is visible. Check if anything changed
			// before overwriting the attributes?
			this._selectionRect.setAttribute("x", String(this._barWidth * this._doc.selection.boxSelectionBar + 1));
			this._selectionRect.setAttribute("y", String(Config.barEditorHeight + ChannelRow.patternHeight * this._doc.selection.boxSelectionChannel + 1));
			this._selectionRect.setAttribute("width", String(this._barWidth * this._doc.selection.boxSelectionWidth - 2));
			this._selectionRect.setAttribute("height", String(ChannelRow.patternHeight * this._doc.selection.boxSelectionHeight - 2));
			this._selectionRect.setAttribute("visibility", "visible");
		} else {
			this._selectionRect.setAttribute("visibility", "hidden");
		}
			
		this._updatePreview();
	}
}
