// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

export class Change {constructor() { Change.prototype.__init.call(this); }
	 __init() {this._noop = true}
		
	 _didSomething() {
		this._noop = false;
	}
		
	 isNoop() {
		return this._noop;
	}
		
	 commit() {}
}

export class UndoableChange extends Change {
	
	
	constructor(reversed) {
		super();
		this._reversed = reversed;
		this._doneForwards = !reversed;
	}
		
	 undo() {
		if (this._reversed) {
			this._doForwards();
			this._doneForwards = true;
		} else {
			this._doBackwards();
			this._doneForwards = false;
		}
	}
		
	 redo() {
		if (this._reversed) {
			this._doBackwards();
			this._doneForwards = false;
		} else {
			this._doForwards();
			this._doneForwards = true;
		}
	}
		
	// isDoneForwards() returns whether or not the Change was most recently 
	// performed forwards or backwards. If the change created something, do not 
	// delete it in the change destructor unless the Change was performed 
	// backwards: 
	 _isDoneForwards() {
		return this._doneForwards;
	}
		
	 _doForwards() {
		throw new Error("Change.doForwards(): Override me.");
	}
		
	 _doBackwards() {
		throw new Error("Change.doBackwards(): Override me.");
	}
}

export class ChangeGroup extends Change {
	constructor() {
		super();
	}
		
	 append(change) {
		if (change.isNoop()) return;
		this._didSomething();
	}
}

export class ChangeSequence extends UndoableChange {
	
	
	constructor(changes) {
		super(false);
		if (changes == undefined) {
			this._changes = [];
		} else {
			this._changes = changes.concat();
		}
		this._committed = false;
	}

	 checkFirst() {
		if (this._changes.length > 0)
			return this._changes[0];
		return null;
    }
		
	 append(change) {
		if (change.isNoop()) return;
		this._changes[this._changes.length] = change;
		this._didSomething();
	}
		
	 _doForwards() {
		for (let i = 0; i < this._changes.length; i++) {
			this._changes[i].redo();
		}
	}
		
	 _doBackwards() {
			for (let i = this._changes.length-1; i >= 0 ; i--) {
			this._changes[i].undo();
		}
	}

	 isCommitted() {
		return this._committed;
	}

	 commit() {
		this._committed = true;
    }
}
