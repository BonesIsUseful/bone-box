



import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig.js";

export class BarScrollBar {
	  __init() {this._editorWidth = 512}
	  __init2() {this._editorHeight = 20}
	  __init3() {this._playhead = SVG.rect("rect", { fill: ColorConfig.playhead, x: 0, y: 0, width: 2, height: this._editorHeight })}
		  __init4() {this._notches = SVG.svg({"pointer-events": "none"})}
		  __init5() {this._handle = SVG.rect({fill: ColorConfig.uiWidgetBackground, x: 0, y: 2, width: 10, height: this._editorHeight - 4})}
		  __init6() {this._handleHighlight = SVG.rect({fill: "none", stroke: ColorConfig.hoverPreview, "stroke-width": 2, "pointer-events": "none", x: 0, y: 1, width: 10, height: this._editorHeight - 2})}
		  __init7() {this._leftHighlight = SVG.path({fill: ColorConfig.hoverPreview, "pointer-events": "none"})}
		  __init8() {this._rightHighlight = SVG.path({fill: ColorConfig.hoverPreview, "pointer-events": "none"})}
	 __init9() {this._renderedPlayhead = -1}
		
		  __init10() {this._svg = SVG.svg({style: `background-color: ${ColorConfig.editorBackground}; touch-action: pan-y; position: absolute;`, width: this._editorWidth, height: this._editorHeight},
		this._notches,
		this._handle,
		this._handleHighlight,
		this._leftHighlight,
		this._rightHighlight,
		this._playhead,
	)}
		
		  __init11() {this.container = HTML.div({class: "barScrollBar", style: "width: 512px; height: 20px; overflow: hidden; position: relative;"}, this._svg)}
		
	 __init12() {this._mouseX = 0}
	 __init13() {this._mouseDown = false}
	 __init14() {this._mouseOver = false}
	 __init15() {this._dragging = false}
	
	
	 __init16() {this._renderedNotchCount = -1}
	 __init17() {this._renderedScrollBarPos = -1; this._renderedLoopStart = -1; this._renderedLoopLength = -1}
	
	constructor( _doc) {;this._doc = _doc;BarScrollBar.prototype.__init.call(this);BarScrollBar.prototype.__init2.call(this);BarScrollBar.prototype.__init3.call(this);BarScrollBar.prototype.__init4.call(this);BarScrollBar.prototype.__init5.call(this);BarScrollBar.prototype.__init6.call(this);BarScrollBar.prototype.__init7.call(this);BarScrollBar.prototype.__init8.call(this);BarScrollBar.prototype.__init9.call(this);BarScrollBar.prototype.__init10.call(this);BarScrollBar.prototype.__init11.call(this);BarScrollBar.prototype.__init12.call(this);BarScrollBar.prototype.__init13.call(this);BarScrollBar.prototype.__init14.call(this);BarScrollBar.prototype.__init15.call(this);BarScrollBar.prototype.__init16.call(this);BarScrollBar.prototype.__init17.call(this);BarScrollBar.prototype.__init18.call(this);BarScrollBar.prototype.__init19.call(this);BarScrollBar.prototype.__init20.call(this);BarScrollBar.prototype.__init21.call(this);BarScrollBar.prototype.__init22.call(this);BarScrollBar.prototype.__init23.call(this);BarScrollBar.prototype.__init24.call(this);BarScrollBar.prototype.__init25.call(this);
		const center = this._editorHeight * 0.5;
		const base = 20;
		const tip = 9;
		const arrowHeight = 6;
		this._leftHighlight.setAttribute("d", `M ${tip} ${center} L ${base} ${center + arrowHeight} L ${base} ${center - arrowHeight} z`);
		this._rightHighlight.setAttribute("d", `M ${this._editorWidth - tip} ${center} L ${this._editorWidth - base} ${center + arrowHeight} L ${this._editorWidth - base} ${center - arrowHeight} z`);
			
		this.container.addEventListener("mousedown", this._whenMousePressed);
		document.addEventListener("mousemove", this._whenMouseMoved);
		document.addEventListener("mouseup", this._whenCursorReleased);
		this.container.addEventListener("mouseover", this._whenMouseOver);
		this.container.addEventListener("mouseout", this._whenMouseOut);
			
		this.container.addEventListener("touchstart", this._whenTouchPressed);
		this.container.addEventListener("touchmove", this._whenTouchMoved);
		this.container.addEventListener("touchend", this._whenCursorReleased);
		this.container.addEventListener("touchcancel", this._whenCursorReleased);
	}

	 __init18() {this.animatePlayhead = () => {
		const playhead = Math.min(512, Math.max(0, (this._notchSpace * this._doc.synth.playhead - 2)));
		if (this._renderedPlayhead != playhead) {
			this._renderedPlayhead = playhead;
			this._playhead.setAttribute("x", "" + playhead);
		}
	}}
		
	 __init19() {this._whenMouseOver = (event) => {
		if (this._mouseOver) return;
		this._mouseOver = true;
		this._updatePreview();
	}}
		
	 __init20() {this._whenMouseOut = (event) => {
		if (!this._mouseOver) return;
		this._mouseOver = false;
		this._updatePreview();
	}}
		
	 __init21() {this._whenMousePressed = (event) => {
		event.preventDefault();
		this._mouseDown = true;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.clientX || event.pageX) - boundingRect.left;
		//this._mouseY = (event.clientY || event.pageY) - boundingRect.top;
		this._updatePreview();
		if (this._mouseX >= this._doc.barScrollPos * this._notchSpace && this._mouseX <= (this._doc.barScrollPos + this._doc.trackVisibleBars) * this._notchSpace) {
			this._dragging = true;
			this._dragStart = this._mouseX;
		}
	}}
		
	 __init22() {this._whenTouchPressed = (event) => {
		event.preventDefault();
		this._mouseDown = true;
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = event.touches[0].clientX - boundingRect.left;
		//this._mouseY = event.touches[0].clientY - boundingRect.top;
		this._updatePreview();
		if (this._mouseX >= this._doc.barScrollPos * this._notchSpace && this._mouseX <= (this._doc.barScrollPos + this._doc.trackVisibleBars) * this._notchSpace) {
			this._dragging = true;
			this._dragStart = this._mouseX;
		}
	}}
		
	 __init23() {this._whenMouseMoved = (event) => {
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = (event.clientX || event.pageX) - boundingRect.left;
		//this._mouseY = (event.clientY || event.pageY) - boundingRect.top;
		this._whenCursorMoved();
	}}
		
	 __init24() {this._whenTouchMoved = (event) => {
		if (!this._mouseDown) return;
		event.preventDefault();
		const boundingRect = this._svg.getBoundingClientRect();
		this._mouseX = event.touches[0].clientX - boundingRect.left;
		//this._mouseY = event.touches[0].clientY - boundingRect.top;
		this._whenCursorMoved();
	}}
		
	 _whenCursorMoved() {
		if (this._dragging) {
			while (this._mouseX - this._dragStart < -this._notchSpace * 0.5) {
				if (this._doc.barScrollPos > 0) {
					this._doc.barScrollPos--;
					this._dragStart -= this._notchSpace;
					this._doc.notifier.changed();
				} else {
					break;
				}
			}
			while (this._mouseX - this._dragStart > this._notchSpace * 0.5) {
				if (this._doc.barScrollPos < this._doc.song.barCount - this._doc.trackVisibleBars) {
					this._doc.barScrollPos++;
					this._dragStart += this._notchSpace;
					this._doc.notifier.changed();
				} else {
					break;
				}
			}
		}
		if (this._mouseOver) this._updatePreview();
	}
		
	 changePos(offset) {
		while (Math.abs(offset) >= 1) {

			if (offset < 0) {
				if (this._doc.barScrollPos > 0) {
					this._doc.barScrollPos--;
					this._dragStart += this._notchSpace;
					this._doc.notifier.changed();
				}
			}
			else {
				if (this._doc.barScrollPos < this._doc.song.barCount - this._doc.trackVisibleBars) {
					this._doc.barScrollPos++;
					this._dragStart += this._notchSpace;
					this._doc.notifier.changed();
				}
			}

			offset += (offset > 0) ? -1 : 1;

		}
	}

	 __init25() {this._whenCursorReleased = (event) => {
		if (!this._dragging && this._mouseDown) {
			if (this._mouseX < (this._doc.barScrollPos + 8) * this._notchSpace) {
				if (this._doc.barScrollPos > 0) this._doc.barScrollPos--;
				this._doc.notifier.changed();
			} else {
				if (this._doc.barScrollPos < this._doc.song.barCount - this._doc.trackVisibleBars) this._doc.barScrollPos++;
				this._doc.notifier.changed();
			}
		}
		this._mouseDown = false;
		this._dragging = false;
		this._updatePreview();
	}}
		
	 _updatePreview() {
		const showHighlight = this._mouseOver && !this._mouseDown;
		let showleftHighlight = false;
		let showRightHighlight = false;
		let showHandleHighlight = false;
			
		if (showHighlight) {
			if (this._mouseX < this._doc.barScrollPos * this._notchSpace) {
				showleftHighlight = true;
			} else if (this._mouseX > (this._doc.barScrollPos + this._doc.trackVisibleBars) * this._notchSpace) {
				showRightHighlight = true;
			} else {
				showHandleHighlight = true;
			}
		}
			
		this._leftHighlight.style.visibility = showleftHighlight ? "visible" : "hidden";
		this._rightHighlight.style.visibility = showRightHighlight ? "visible" : "hidden";
		this._handleHighlight.style.visibility = showHandleHighlight ? "visible" : "hidden";
	}
		
	 render() {
			this._notchSpace = (this._editorWidth-1) / Math.max(this._doc.trackVisibleBars, this._doc.song.barCount);
			
		const Song = this._doc.song;
		const NotchesNeedRebuild = this._renderedNotchCount != Song.barCount
			|| this._renderedLoopStart !== Song.loopStart
			|| this._renderedLoopLength !== Song.loopLength;
		if (NotchesNeedRebuild) {
			this._renderedNotchCount = Song.barCount;
			this._renderedLoopStart = Song.loopStart;
			this._renderedLoopLength = Song.loopLength;
				
			while (this._notches.firstChild) this._notches.removeChild(this._notches.firstChild);
				
			for (let i = 0; i <= Song.barCount; i++) {
				const lineHeight = (i % 16 == 0) ? 0 : ((i % 4 == 0) ? this._editorHeight / 8 : this._editorHeight / 3);
				const AtLoopStart = i === Song.loopStart;
				const AtLoopEnd = i === Song.loopStart + Song.loopLength;
				const NotchFill = (AtLoopStart || AtLoopEnd) ? ColorConfig.loopAccent : ColorConfig.uiWidgetBackground;
				this._notches.appendChild(SVG.rect({ fill: NotchFill, x: i * this._notchSpace - 1, y: lineHeight, width: 2, height: this._editorHeight - lineHeight * 2 }));
			}
		}
		
		
		if (NotchesNeedRebuild || this._renderedScrollBarPos != this._doc.barScrollPos) {
			this._renderedScrollBarPos = this._doc.barScrollPos;
			this._handle.setAttribute("x", String(this._notchSpace * this._doc.barScrollPos));
			this._handle.setAttribute("width", String(this._notchSpace * this._doc.trackVisibleBars));
			this._handleHighlight.setAttribute("x", String(this._notchSpace * this._doc.barScrollPos));
			this._handleHighlight.setAttribute("width", String(this._notchSpace * this._doc.trackVisibleBars));
		}
			
		this._updatePreview();
	}
}
