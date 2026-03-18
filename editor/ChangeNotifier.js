// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license, see accompanying the LICENSE.md file.

export class ChangeNotifier {constructor() { ChangeNotifier.prototype.__init.call(this);ChangeNotifier.prototype.__init2.call(this); }
	 __init() {this._watchers = []}
	 __init2() {this._dirty = false}

	 watch(watcher) {
		if (this._watchers.indexOf(watcher) == -1) {
			this._watchers.push(watcher);
		}
	}

	 unwatch(watcher) {
		const index = this._watchers.indexOf(watcher);
		if (index != -1) {
			this._watchers.splice(index, 1);
		}
	}

	 changed() {
		this._dirty = true;
	}

	 notifyWatchers() {
		if (!this._dirty) return;
		this._dirty = false;
		for (const watcher of this._watchers.concat()) {
			watcher();
		}
	}
}
