


import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ChangeLoop, ChangeChannelBar } from "./changes.js";
import { ColorConfig } from "./ColorConfig.js";












export class LoopEditor {
	  __init() {this._editorHeight = 20}
		  __init2() {this._startMode = 0}
		  __init3() {this._endMode = 1}
		  __init4() {this._bothMode = 2}
		  __init5() {this._loopMode = 3}
		 __init6() {this._loopAtPointStart = -1}
		 __init7() {this._loopAtPointEnd = -1}
		
		  __init8() {this._loop = SVG.path({fill: "none", stroke: ColorConfig.loopAccent, "stroke-width": 4})}
		  __init9() {this._barLoop = SVG.path({fill: "none", stroke: ColorConfig.uiWidgetFocus, "stroke-width": 2})}
		  __init10() {this._highlight = SVG.path({fill: ColorConfig.hoverPreview, "pointer-events": "none"})}
		
	  __init11() {this._svg = SVG.svg({style: `touch-action: pan-y; position: absolute;`, height: this._editorHeight},
		this._loop,
		this._highlight,
		this._barLoop
	)}
		
	  __init12() {this.container = HTML.div({class: "loopEditor"}, this._svg)}
		
	 __init13() {this._barWidth = 32}
	 __init14() {this._change = null}
		 __init15() {this._cursor = {startBar: -1, mode: -1}}
	 __init16() {this._mouseX = 0}
	//private _mouseY: number = 0;
	 __init17() {this._clientStartX = 0}
	 __init18() {this._clientStartY = 0}
	 __init19() {this._startedScrolling = false}
	 __init20() {this._draggingHorizontally = false}
	 __init21() {this._mouseDown = false}
	 __init22() {this._mouseOver = false}
	 __init23() {this._renderedLoopStart = -1}
	 __init24() {this._renderedLoopStop = -1}
	 __init25() {this._renderedBarCount = 0}
	 __init26() {this._renderedBarWidth = -1}
	 __init27() {this._renderedBarLoopStart = -1}
	 __init28() {this._renderedBarLoopEnd = -1}
		
	constructor( _doc,  _trackEditor) {;this._doc = _doc;this._trackEditor = _trackEditor;LoopEditor.prototype.__init.call(this);LoopEditor.prototype.__init2.call(this);LoopEditor.prototype.__init3.call(this);LoopEditor.prototype.__init4.call(this);LoopEditor.prototype.__init5.call(this);LoopEditor.prototype.__init6.call(this);LoopEditor.prototype.__init7.call(this);LoopEditor.prototype.__init8.call(this);LoopEditor.prototype.__init9.call(this);LoopEditor.prototype.__init10.call(this);LoopEditor.prototype.__init11.call(this);LoopEditor.prototype.__init12.call(this);LoopEditor.prototype.__init13.call(this);LoopEditor.prototype.__init14.call(this);LoopEditor.prototype.__init15.call(this);LoopEditor.prototype.__init16.call(this);LoopEditor.prototype.__init17.call(this);LoopEditor.prototype.__init18.call(this);LoopEditor.prototype.__init19.call(this);LoopEditor.prototype.__init20.call(this);LoopEditor.prototype.__init21.call(this);LoopEditor.prototype.__init22.call(this);LoopEditor.prototype.__init23.call(this);LoopEditor.prototype.__init24.call(this);LoopEditor.prototype.__init25.call(this);LoopEditor.prototype.__init26.call(this);LoopEditor.prototype.__init27.call(this);LoopEditor.prototype.__init28.call(this);LoopEditor.prototype.__init29.call(this);LoopEditor.prototype.__init30.call(this);LoopEditor.prototype.__init31.call(this);LoopEditor.prototype.__init32.call(this);LoopEditor.prototype.__init33.call(this);LoopEditor.prototype.__init34.call(this);LoopEditor.prototype.__init35.call(this);LoopEditor.prototype.__init36.call(this);LoopEditor.prototype.__init37.call(this);
		this._updateCursorStatus();
		this._render();
		this._doc.notifier.watch(this._documentChanged);
			
		this.container.addEventListener("mousedown", this._whenMousePressed);
		document.addEventListener("mousemove", this._whenMouseMoved);
		document.addEventListener("mouseup", this._whenCursorReleased);
		this.container.addEventListener("mouseover", this._whenMouseOver);
		this.container.addEventListener("mouseout", this._whenMouseOut);
			
		this.container.addEventListener("touchstart", this._whenTouchPressed);
		this.container.addEventListener("touchmove", this._whenTouchMoved);
		this.container.addEventListener("touchend", this._whenTouchReleased);
		this.container.addEventListener("touchcancel", this._whenTouchReleased);
	}
		
	 _updateCursorStatus() {
		const bar = this._mouseX / this._barWidth;
		this._cursor.startBar = bar;

		if (bar >= this._loopAtPointStart && bar <= this._loopAtPointEnd + 1) {
			this._cursor.mode = this._loopMode;
        }
		else if (bar > this._doc.song.loopStart - 0.25 && bar < this._doc.song.loopStart + this._doc.song.loopLength + 0.25) {
			if (bar - this._doc.song.loopStart < this._doc.song.loopLength * 0.5) {
				this._cursor.mode = this._startMode;
			} else {
				this._cursor.mode = this._endMode;
			}
		} else {
			this._cursor.mode = this._bothMode;
		}
	}
		
	 _findEndPoints(middle) {
		let start = Math.round(middle - this._doc.song.loopLength / 2);
		let end = start + this._doc.song.loopLength;
		if (start < 0) {
			end -= start;
			start = 0;
		}
		if (end > this._doc.song.barCount) {
			start -= end - this._doc.song.barCount;
			end = this._doc.song.barCount;
		}
			return {start: start, length: end - start};
	}
		
	 __init29() {this._whenMouseOver = (event) => {
		if (this._mouseOver) return;
		this._mouseOver = true;
		this._updatePreview();
	}}
		
	 __init30() {this._whenMouseOut = (event) => {
		if (!this._mouseOver) return;
		this._mouseOver = false;
		this._updatePreview();
	}}
		
	 __init31() {this._whenMousePressed = (event) => {
		event.preventDefault();
		this._mouseDown = true;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.clientX || event.pageX) - boundingRect.left;
		//this._mouseY = (event.clientY || event.pageY) - boundingRect.top;
		this._updateCursorStatus();
		this._updatePreview();
		this._whenMouseMoved(event);
	}}
		
	 __init32() {this._whenTouchPressed = (event) => {
		//event.preventDefault();
		this._mouseDown = true;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = event.touches[0].clientX - boundingRect.left;
		//this._mouseY = event.touches[0].clientY - boundingRect.top;
		this._updateCursorStatus();
		this._updatePreview();
		//this._whenTouchMoved(event);
		this._clientStartX = event.touches[0].clientX;
		this._clientStartY = event.touches[0].clientY;
		this._draggingHorizontally = false;
		this._startedScrolling = false;
	}}
		
	 __init33() {this._whenMouseMoved = (event) => {
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.clientX || event.pageX) - boundingRect.left;
		//this._mouseY = (event.clientY || event.pageY) - boundingRect.top;
		this._whenCursorMoved();
	}}
		
	 __init34() {this._whenTouchMoved = (event) => {
		if (!this._mouseDown) return;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = event.touches[0].clientX - boundingRect.left;
		//this._mouseY = event.touches[0].clientY - boundingRect.top;
			
		if (!this._draggingHorizontally && !this._startedScrolling) {
			if (Math.abs(event.touches[0].clientY - this._clientStartY) > 10) {
				this._startedScrolling = true;
			} else if (Math.abs(event.touches[0].clientX - this._clientStartX) > 10) {
				this._draggingHorizontally = true;
			}
		}
			
		if (this._draggingHorizontally) {
			this._whenCursorMoved();
			event.preventDefault();
		}
	}}
		
	 _whenCursorMoved() {
		if (this._mouseDown) {
			let oldStart = this._doc.song.loopStart;
			let oldEnd = this._doc.song.loopStart + this._doc.song.loopLength;
			if (this._change != null && this._doc.lastChangeWas(this._change)) {
				oldStart = this._change.oldStart;
				oldEnd = oldStart + this._change.oldLength;
			}
				
			const bar = this._mouseX / this._barWidth;
			let start;
			let end;
			let temp;
			if (this._cursor.mode == this._startMode) {
				start = oldStart + Math.round(bar - this._cursor.startBar);
				end = oldEnd;
				if (start < 0) start = 0;
				if (start >= this._doc.song.barCount) start = this._doc.song.barCount;
				if (start == end) {
					start = end - 1;
				} else if (start > end) {
					temp = start;
					start = end;
					end = temp;
				}
				this._change = new ChangeLoop(this._doc, oldStart, oldEnd - oldStart, start, end - start);
			} else if (this._cursor.mode == this._endMode) {
				start = oldStart;
				end = oldEnd + Math.round(bar - this._cursor.startBar);
				if (end < 0) end = 0;
				if (end >= this._doc.song.barCount) end = this._doc.song.barCount;
				if (end == start) {
					end = start + 1;
				} else if (end < start) {
					temp = start;
					start = end;
					end = temp;
				}
				this._change = new ChangeLoop(this._doc, oldStart, oldEnd - oldStart, start, end - start);
			} else if (this._cursor.mode == this._bothMode) {
				const endPoints = this._findEndPoints(bar);
				this._change = new ChangeLoop(this._doc, oldStart, oldEnd - oldStart, endPoints.start, endPoints.length);
			}
			else if (this._cursor.mode == this._loopMode) {
				this._doc.synth.loopBarStart = -1;
				this._doc.synth.loopBarEnd = -1;
				this.setLoopAt(this._doc.synth.loopBarStart, this._doc.synth.loopBarEnd);
            }
			this._doc.synth.jumpIntoLoop();
			if (this._doc.prefs.autoFollow) {
				new ChangeChannelBar(this._doc, this._doc.channel, Math.floor(this._doc.synth.playhead), true);
			}
			this._doc.setProspectiveChange(this._change);
		} else {
			this._updateCursorStatus();
			this._updatePreview();
		}
	}
		
	 __init35() {this._whenTouchReleased = (event) => {
		event.preventDefault();
		if (!this._startedScrolling) {
			this._whenCursorMoved();
			this._mouseOver = false;
			this._whenCursorReleased(event);
			this._updatePreview();
		}

		this._mouseDown = false;
	}}
		
	 __init36() {this._whenCursorReleased = (event) => {
		if (this._change != null) this._doc.record(this._change);
		this._change = null;
		this._mouseDown = false;
		this._updateCursorStatus();
		this._render();
	}}
		
	 _updatePreview() {
		const showHighlight = this._mouseOver && !this._mouseDown;
		this._highlight.style.visibility = showHighlight ? "visible" : "hidden";
			
		if (showHighlight) {
			const radius = this._editorHeight / 2;

			let highlightStart = (this._doc.song.loopStart) * this._barWidth;
			let highlightStop = (this._doc.song.loopStart + this._doc.song.loopLength) * this._barWidth;
			if (this._cursor.mode == this._startMode) {
				highlightStop = (this._doc.song.loopStart) * this._barWidth + radius * 2;
			} else if (this._cursor.mode == this._endMode) {
				highlightStart = (this._doc.song.loopStart + this._doc.song.loopLength) * this._barWidth - radius * 2;
			} else if (this._cursor.mode == this._bothMode) {
				const endPoints = this._findEndPoints(this._cursor.startBar);
				highlightStart = (endPoints.start) * this._barWidth;
				highlightStop = (endPoints.start + endPoints.length) * this._barWidth;
			}

			if (this._cursor.mode == this._loopMode) {
				const barLoopStart = (this._loopAtPointStart + 0.5) * this._barWidth;
				const barLoopEnd = (this._loopAtPointEnd + 0.5) * this._barWidth;
				this._highlight.setAttribute("d",
					`M ${barLoopStart} ${radius * 1.7} ` +
					`L ${barLoopStart - radius * 1.5} ${radius}` +
					`L ${barLoopStart} ${radius * 0.3}` +
					`L ${barLoopEnd} ${radius * 0.3}` +
					`L ${barLoopEnd + radius * 1.5} ${radius}` +
					`L ${barLoopEnd} ${radius * 1.7}` +
					`z`
				);
			}
			else {

				this._highlight.setAttribute("d",
					`M ${highlightStart + radius} ${4} ` +
					`L ${highlightStop - radius} ${4} ` +
					`A ${radius - 4} ${radius - 4} ${0} ${0} ${1} ${highlightStop - radius} ${this._editorHeight - 4} ` +
					`L ${highlightStart + radius} ${this._editorHeight - 4} ` +
					`A ${radius - 4} ${radius - 4} ${0} ${0} ${1} ${highlightStart + radius} ${4} ` +
					`z`
				);

			}
		}
	}
		
	 __init37() {this._documentChanged = () => {
		this._render();
	}}

	 setLoopAt(startBar, endBar) {
		this._loopAtPointStart = startBar;
		this._loopAtPointEnd = endBar;
		this._trackEditor.render();
		this._render();
    }
		
	 _render() {
		this._barWidth = this._doc.getBarWidth();
			
		const radius = this._editorHeight / 2;
		const loopStart = (this._doc.song.loopStart) * this._barWidth;
		const loopStop = (this._doc.song.loopStart + this._doc.song.loopLength) * this._barWidth;
			
		if (this._renderedBarCount != this._doc.song.barCount || this._renderedBarWidth != this._barWidth) {
			this._renderedBarCount = this._doc.song.barCount;
			this._renderedBarWidth = this._barWidth;
			const editorWidth = this._barWidth * this._doc.song.barCount;
			this.container.style.width = editorWidth + "px";
			this._svg.setAttribute("width", editorWidth + "");
		}

		if (this._renderedLoopStart != loopStart || this._renderedLoopStop != loopStop) {
			this._renderedLoopStart = loopStart;
			this._renderedLoopStop = loopStop;
			this._loop.setAttribute("d",
				`M ${loopStart + radius} ${2} ` +
				`L ${loopStop - radius} ${2} ` +
				`A ${radius - 2} ${radius - 2} ${0} ${0} ${1} ${loopStop - radius} ${this._editorHeight - 2} ` +
				`L ${loopStart + radius} ${this._editorHeight - 2} ` +
				`A ${radius - 2} ${radius - 2} ${0} ${0} ${1} ${loopStart + radius} ${2} ` +
				`z`
			);
		}

		const barLoopStart = (this._loopAtPointStart + 0.5) * this._barWidth;
		const barLoopEnd = (this._loopAtPointEnd + 0.5) * this._barWidth;
		if (this._renderedBarLoopStart != barLoopStart || this._renderedBarLoopEnd != barLoopEnd) {
			if (barLoopStart < 0 || barLoopEnd < 0) {
				this._barLoop.setAttribute("d", "");
			}
			else {
				this._barLoop.setAttribute("d",
					`M ${barLoopStart} ${radius * 1.5} ` +
					`L ${barLoopStart - radius} ${radius}` +
					`L ${barLoopStart} ${radius * 0.5}` +
					`L ${barLoopEnd} ${radius * 0.5}` +
					`L ${barLoopEnd + radius} ${radius}` +
					`L ${barLoopEnd} ${radius * 1.5}` +
					`z`
				);
			}
			this._renderedBarLoopStart = barLoopStart;
			this._renderedBarLoopEnd = barLoopEnd;
		}
			
		this._updatePreview();
	}
}
