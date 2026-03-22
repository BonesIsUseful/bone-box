import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { Synth } from "../synth/synth.js";
import { ColorConfig } from "./ColorConfig.js";
import { ChangeSong, ChangeSongTitle } from "./changes.js";

const { div, span, button, img, input } = HTML;

function _MenuIconSvg(Paths) {
    return SVG.svg({
        class: "menu-item-icon",
        width: "18",
        height: "18",
        viewBox: "0 0 18 18",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.4",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
    }, Paths);
}

function _MenuRowWithIcon(Icon, LabelText, Shortcut) {
    const row = div({ class: "menu-item menu-item-with-icon" }, [
        div({ class: "menu-item-icon-wrap" }, [Icon]),
        span({ class: "menu-item-label" }, LabelText)
    ]);
    if (Shortcut) row.appendChild(span({ class: "menu-item-shortcut" }, Shortcut));
    return row;
}

function _IconPinnedTabSvg() {
    return SVG.svg({
        class: "tab-pinned-icon-svg",
        width: "15",
        height: "15",
        viewBox: "0 0 18 18",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "1.45",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
    }, [
        SVG.rect({ x: "4", y: "2.5", width: "10", height: "13", rx: "1.5" }),
        SVG.path({ d: "M6.5 7h5M6.5 10h4" })
    ]);
}

function _formatDurationLabelFromHash(hash) {
    const normalized = (hash || "").replace(/^#/, "").trim();
    if (!normalized) return "—";
    try {
        const synth = new Synth(normalized);
        const samples = synth.getTotalSamples(true, true, 0);
        if (samples < 0) return "—";
        const rawSeconds = Math.round(samples / synth.samplesPerSecond);
        const seconds = rawSeconds % 60;
        const minutes = Math.floor(rawSeconds / 60);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    } catch (e) {
        return "—";
    }
}

export class TabManager {
    constructor(doc) {
        this.doc = doc;
        this.tabs = this._loadTabs();
        this.tabGroups = this._loadTabGroups();
        this.activeTabId = this._loadActiveTabId();
        this.renderedTabIds = new Set(this.tabs.map(t => t.id));

        this._injectStyles();
        this.container = div({ class: "tab-manager-wrapper" });
        this.tabBrandRow = div({ class: "tab-brand-row" });
        this.tabBar = div({
            class: "tab-bar-container",
            ondragover: (e) => this._handleDragOver(e),
            ondrop: (e) => this._handleWrapperDrop(e)
        });
        this._tabPointerMove = this._onTabPointerMove.bind(this);
        this._tabPointerUp = this._onTabPointerUp.bind(this);
        this._groupPointerMove = this._onGroupPointerMove.bind(this);
        this._groupPointerUp = this._onGroupPointerUp.bind(this);
        this.savedGroupsBar = div({ class: "saved-groups-bar bonebox-saved-groups-topbar" });
        this.container.appendChild(this.tabBrandRow);
        this.container.appendChild(this.tabBar);

        this._updateUI();

        // Listen for song changes to update titles
        this.doc.notifier.watch(this._onDocUpdate.bind(this));

        // Handle window closure to save the active tab's current hash
        window.addEventListener("beforeunload", () => {
            this._saveActiveTabHash();
        });

        // Keybinds
        window.addEventListener("keydown", (e) => {
            // Only trigger if not typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
            
            if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                this._handleNewProject({
                    name: "New Project",
                    scale: this.doc.prefs.defaultScale,
                    key: 0,
                    tempo: 160,
                    beats: 8,
                    collab: false,
                    roomCode: ""
                });
            }
        });
        // Setup the new project callback immediately so it's available if a prompt is restored from history
        this.doc.newProjectCallback = (settings) => this._handleNewProject(settings);

        // On startup, if there is no hash in the URL, load the hash from the last active tab
        if (!window.location.hash || window.location.hash === "#") {
            const activeTab = this.tabs.find(t => t.id === this.activeTabId);
            if (activeTab && activeTab.hash) {
                // Directly update the document's song to prevent trigger loops
                if (activeTab.hash != "") {
                    this.doc.song.fromBase64String(activeTab.hash);
                }
                window.location.hash = activeTab.hash;
                this.doc.prompt = null; // Prevent unwanted "new project" prompt on load
            }
        }

        this.applyTabPosition();
    }

    applyTabPosition() {
        const Allowed = ["top", "left", "right", "bottom"];
        let TabPosition = this.doc.prefs.tabPosition || "top";
        if (Allowed.indexOf(TabPosition) < 0) TabPosition = "top";
        document.body.classList.remove("tab-position-top", "tab-position-bottom", "tab-position-left", "tab-position-right");
        document.body.classList.add("tab-position-" + TabPosition);
        this._syncBoneboxMainRowShell(TabPosition);
        this._updateUI();
    }

    _syncBoneboxMainRowShell(TabPosition) {
        const MainRow = document.querySelector(".bonebox-main-row");
        const Column = document.querySelector(".bonebox-editor-column");
        const Editor = document.getElementById("beepboxEditorContainer");
        if (!MainRow || !Column || !this.container || !this.savedGroupsBar || !Editor) return;
        const Saved = this.savedGroupsBar;
        const Tabs = this.container;
        if (Editor.parentElement === Column && Saved.parentElement === Column) {
            if (Column.firstChild !== Saved || Saved.nextSibling !== Editor) Column.insertBefore(Saved, Editor);
        } else if (Editor.parentElement === Column) Column.insertBefore(Saved, Editor);
        if (TabPosition === "bottom") {
            MainRow.appendChild(Column);
            MainRow.appendChild(Tabs);
            return;
        }
        MainRow.appendChild(Tabs);
        MainRow.appendChild(Column);
    }

    _loadTabs() {
        const saved = localStorage.getItem("bonebox_tabs");
        if (saved) {
            try {
                const tabs = JSON.parse(saved);
                if (Array.isArray(tabs) && tabs.length > 0) {
                    tabs.forEach(t => { if (t.pinned) t.groupId = null; });
                    const pinned = tabs.filter(t => t.pinned);
                    const unpinned = tabs.filter(t => !t.pinned);
                    return [...pinned, ...unpinned];
                }
            } catch (e) { }
        }
        // Default tab (the current song)
        return [{
            id: Date.now(),
            name: "Unnamed",
            hash: window.location.hash || ""
        }];
    }

    _loadActiveTabId() {
        const id = localStorage.getItem("bonebox_active_tab_id");
        if (id) {
            const found = this.tabs.find(t => t.id == id);
            if (found) return found.id;
        }
        return this.tabs[0].id;
    }

    _loadTabGroups() {
        const saved = localStorage.getItem("bonebox_tab_groups");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) { }
        }
        return [];
    }

    _saveTabs() {
        localStorage.setItem("bonebox_tabs", JSON.stringify(this.tabs));
    }

    _saveTabGroups() {
        localStorage.setItem("bonebox_tab_groups", JSON.stringify(this.tabGroups));
    }

    _saveAll() {
        this._saveTabs();
        this._saveTabGroups();
    }

    _saveActiveTabId() {
        localStorage.setItem("bonebox_active_tab_id", this.activeTabId.toString());
    }

    _saveActiveTabHash() {
        const activeTab = this.tabs.find(t => t.id === this.activeTabId);
        if (activeTab) {
            activeTab.hash = window.location.hash;
            this._saveTabs();
        }
    }

    _onDocUpdate() {
        const activeTab = this.tabs.find(t => t.id === this.activeTabId);
        if (activeTab) {
            const songName = this.doc.song.title || "Unnamed";
            const currentHash = this.doc.song.toBase64String();

            let changed = false;
            if (activeTab.name !== songName) {
                activeTab.name = songName;
                changed = true;
            }
            if (activeTab.hash !== currentHash) {
                activeTab.hash = currentHash;
                changed = true;
            }

            if (changed) {
                this._saveTabs();
                this._updateUI();
            }
        }
    }

    _handleNewProject(settings) {
        const newTab = {
            id: Date.now(),
            name: settings.name,
            hash: "",
            collab: settings.collab,
            roomCode: settings.roomCode
        };
        this.tabs.push(newTab);
        this.activeTabId = newTab.id;

        // Apply song settings
        this.doc.record(new ChangeSong(this.doc, ""), false, true);
        this.doc.record(new ChangeSongTitle(this.doc, this.doc.song.title, settings.name), false, true);
        this.doc.song.scale = settings.scale;
        this.doc.song.key = settings.key;
        this.doc.song.tempo = Number(settings.tempo);
        this.doc.song.beatsPerBar = Number(settings.beats);

        // Update URL will be handled by doc.record above.

        // Handle Collab
        if (settings.collab && window.party) {
            window.party.join(settings.roomCode, "Host");
        } else if (window.party) {
            window.party.leave();
        }

        this._saveTabs();
        this._saveActiveTabId();
        this._updateUI();
        this.doc.notifier.changed();
    }

    addTab() {
        this._saveActiveTabHash();
        this.doc.openPrompt("newProject");
    }

    switchTab(id) {
        if (id === this.activeTabId) return;

        this._saveActiveTabHash();

        const targetTab = this.tabs.find(t => t.id === id);
        if (targetTab) {
            this.activeTabId = targetTab.id;

            // Explicitly update the document to the new tab's song data
            this.doc.record(new ChangeSong(this.doc, targetTab.hash), false, true);

            // Update the URL to stay in sync
            window.location.hash = targetTab.hash;

            // Handle Party switching
            if (targetTab.collab && targetTab.roomCode && window.party) {
                window.party.join(targetTab.roomCode);
            } else if (window.party) {
                window.party.leave();
            }

            this._saveActiveTabId();
            this._updateUI();
        }
    }

    closeTab(id, event) {
        if (event) event.stopPropagation();

        if (this.tabs.length <= 1) {
            // Can't close the last tab, just clear it?
            this.doc.song.title = "Unnamed";
            window.location.hash = "";
            const tab = this.tabs[0];
            tab.name = "Unnamed";
            tab.hash = "";
            this._saveTabs();
            this._updateUI();
            return;
        }

        const index = this.tabs.findIndex(t => t.id === id);
        this.tabs.splice(index, 1);

        if (this.activeTabId === id) {
            const nextTab = this.tabs[Math.max(0, index - 1)];
            this.activeTabId = nextTab.id;
            window.location.hash = nextTab.hash;
        }

        this._saveTabs();
        this._saveActiveTabId();
        this._updateUI();
    }

    _newTabToRightOf(tab) {
        this._saveActiveTabHash();
        const idx = this.tabs.findIndex(t => t.id === tab.id);
        if (idx === -1) return;
        const newTab = {
            id: Date.now(),
            name: "Unnamed",
            hash: "",
            groupId: tab.groupId || undefined
        };
        this.tabs.splice(idx + 1, 0, newTab);
        this._saveTabs();
        this.switchTab(newTab.id);
        this.doc.openPrompt("newProject");
    }

    _openTabInBrowserTab(tab) {
        const raw = (tab.hash || "").replace(/^#/, "");
        const base = window.location.href.split("#")[0];
        const url = raw ? `${base}#${raw}` : base;
        window.open(url, "_blank", "noopener,noreferrer");
    }

    _duplicateTab(tab) {
        this._saveActiveTabHash();
        const idx = this.tabs.findIndex(t => t.id === tab.id);
        if (idx === -1) return;
        const dup = {
            id: Date.now(),
            name: tab.name,
            hash: tab.hash,
            groupId: tab.groupId,
            collab: tab.collab,
            roomCode: tab.roomCode,
            pinned: false
        };
        this.tabs.splice(idx + 1, 0, dup);
        this._saveTabs();
        this.switchTab(dup.id);
        this._updateUI();
    }

    _togglePinTab(tab) {
        const idx = this.tabs.findIndex(t => t.id === tab.id);
        if (idx === -1) return;
        if (!tab.pinned) {
            this.tabs.splice(idx, 1);
            tab.pinned = true;
            tab.groupId = null;
            const insertAt = this.tabs.filter(t => t.pinned).length;
            this.tabs.splice(insertAt, 0, tab);
        } else {
            this.tabs.splice(idx, 1);
            tab.pinned = false;
            const insertAt = this.tabs.filter(t => t.pinned).length;
            this.tabs.splice(insertAt, 0, tab);
        }
        this._saveTabs();
        this._updateUI();
    }

    _closeOtherTabs(tab) {
        const ids = this.tabs.filter(t => t.id !== tab.id && !t.pinned).map(t => t.id);
        for (const id of ids) this.closeTab(id, null);
    }

    _closeTabsToRightOf(tab) {
        const idx = this.tabs.findIndex(t => t.id === tab.id);
        if (idx === -1) return;
        const toClose = [];
        for (let i = idx + 1; i < this.tabs.length; i++) {
            if (!this.tabs[i].pinned) toClose.push(this.tabs[i].id);
        }
        for (const id of toClose) this.closeTab(id, null);
    }

    _showContextMenu(tab, x, y) {
        if (this._contextMenu) this._contextMenu.remove();

        const IconAddNewGroup = _MenuIconSvg([
            SVG.circle({ cx: "9", cy: "9", r: "7" }),
            SVG.path({ d: "M9 6v6M6 9h6" })
        ]);
        const IconRemoveFromGroup = _MenuIconSvg([
            SVG.path({ d: "M6 7h6M7 7V5.5h4V7M6.5 9.5V14h5V9.5" }),
            SVG.path({ d: "M4 16h10" })
        ]);
        const IconAddToGroup = _MenuIconSvg([
            SVG.rect({ x: "3", y: "4", width: "10", height: "10", rx: "1.5" }),
            SVG.path({ d: "M10 9h3M11.5 7.5v3" })
        ]);
        const IconNewTabRight = _MenuIconSvg([
            SVG.rect({ x: "3", y: "4", width: "7", height: "10", rx: "1.5" }),
            SVG.path({ d: "M13 6v6M11 8l2 2 2-2" })
        ]);
        const IconBrowserTab = _MenuIconSvg([
            SVG.rect({ x: "3", y: "3", width: "9", height: "9", rx: "1.5" }),
            SVG.path({ d: "M11 3h4v4M11 7l6-6" })
        ]);
        const IconDuplicate = _MenuIconSvg([
            SVG.rect({ x: "3", y: "4", width: "7", height: "9", rx: "1" }),
            SVG.rect({ x: "6", y: "6", width: "7", height: "9", rx: "1" })
        ]);
        const IconPinTab = _MenuIconSvg([
            SVG.path({ d: "M9 3l2 2v2.5l-4 4V14H8v-2.5l4-4V5L9 3z" })
        ]);
        const IconCloseTab = _MenuIconSvg([
            SVG.path({ d: "M6 6l6 6M12 6l-6 6" })
        ]);
        const IconCloseOthers = _MenuIconSvg([
            SVG.path({ d: "M4 5h3M4 9h3M4 13h3" }),
            SVG.path({ d: "M11 6l6 6M17 6l-6 6" })
        ]);
        const IconCloseRight = _MenuIconSvg([
            SVG.path({ d: "M3 9h9M10 5l4 4-4 4" })
        ]);

        const menu = div({
            class: "tab-context-menu",
            onmousedown: (e) => e.stopPropagation(),
            onclick: (e) => e.stopPropagation()
        });

        const newTabRight = _MenuRowWithIcon(IconNewTabRight, "New tab to the right", null);
        newTabRight.onclick = () => {
            this._newTabToRightOf(tab);
            menu.remove();
        };

        const openBrowserTab = _MenuRowWithIcon(IconBrowserTab, "Move to new browser tab", null);
        openBrowserTab.onclick = () => {
            this._openTabInBrowserTab(tab);
            menu.remove();
        };

        const duplicateTab = _MenuRowWithIcon(IconDuplicate, "Duplicate tab", null);
        duplicateTab.onclick = () => {
            this._duplicateTab(tab);
            menu.remove();
        };

        const pinTabRow = _MenuRowWithIcon(IconPinTab, tab.pinned ? "Unpin tab" : "Pin tab", null);
        pinTabRow.onclick = () => {
            this._togglePinTab(tab);
            menu.remove();
        };

        const closeTabRow = _MenuRowWithIcon(IconCloseTab, "Close tab", null);
        closeTabRow.onclick = () => {
            this.closeTab(tab.id, null);
            menu.remove();
        };

        const closeOthersRow = _MenuRowWithIcon(IconCloseOthers, "Close other tabs", null);
        closeOthersRow.onclick = () => {
            this._closeOtherTabs(tab);
            menu.remove();
        };

        const closeRightRow = _MenuRowWithIcon(IconCloseRight, "Close tabs to the right", null);
        closeRightRow.onclick = () => {
            this._closeTabsToRightOf(tab);
            menu.remove();
        };

        const sepBeforeGroup = div({ class: "menu-separator" });

        const newGroup = _MenuRowWithIcon(IconAddNewGroup, "Add to new group", null);
        newGroup.onclick = () => {
            const name = window.prompt("New group name:");
            if (name) {
                const groupId = Date.now().toString();
                const presetColors = ["#dadce0", "#8ab4f8", "#f28b82", "#fde293", "#81c995", "#ff8bcb", "#c58af9", "#78d9ec", "#fcad70"];
                const color = presetColors[Math.floor(Math.random() * presetColors.length)];
                this.tabGroups.push({ id: groupId, name, color, collapsed: false, saved: false });
                tab.groupId = groupId;

                this._saveAll();
                this._updateUI();
            }
            menu.remove();
        };

        menu.appendChild(newTabRight);
        menu.appendChild(openBrowserTab);
        menu.appendChild(duplicateTab);
        menu.appendChild(pinTabRow);
        menu.appendChild(sepBeforeGroup);
        menu.appendChild(closeTabRow);
        menu.appendChild(closeOthersRow);
        menu.appendChild(closeRightRow);

        const sepAfterClose = div({ class: "menu-separator" });
        menu.appendChild(sepAfterClose);
        menu.appendChild(newGroup);

        if (tab.groupId) {
            const removeGroup = _MenuRowWithIcon(IconRemoveFromGroup, "Remove from group", null);
            removeGroup.onclick = () => {
                tab.groupId = null;
                this._saveAll();
                this._updateUI();
                menu.remove();
            };
            menu.appendChild(removeGroup);
        }

        this.tabGroups.forEach(g => {
            if (g.id !== tab.groupId) {
                const addToG = _MenuRowWithIcon(IconAddToGroup, `Add to ${g.name}`, null);
                addToG.onclick = () => {
                    tab.groupId = g.id;
                    this._saveAll();
                    this._updateUI();
                    menu.remove();
                };
                menu.appendChild(addToG);
            }
        });

        menu.style.left = x + "px";
        menu.style.top = y + "px";
        document.body.appendChild(menu);
        this._contextMenu = menu;

        const closeMenu = (e) => {
            if (!this._contextMenu) return;
            if (this._contextMenu.contains(e.target)) return;
            this._contextMenu.remove();
            this._contextMenu = null;
            document.removeEventListener("click", closeMenu);
        };
        setTimeout(() => document.addEventListener("click", closeMenu), 0);
    }

    _activateSavedGroupFromBar(g) {
        const firstTab = this.tabs.find(t => t.groupId === g.id);
        if (firstTab) {
            g.collapsed = false;
            this._saveTabGroups();
            const AlreadyOnFirst = firstTab.id === this.activeTabId;
            this.switchTab(firstTab.id);
            if (AlreadyOnFirst) this._updateUI();
        } else if (g.savedTabs && g.savedTabs.length > 0) {
            g.collapsed = false;
            g.savedTabs.forEach(t => {
                t.id = Date.now() + Math.random();
                this.tabs.push(t);
            });
            g.savedTabs = [];
            this._saveAll();
            const restoredTab = this.tabs.find(t => t.groupId === g.id);
            if (restoredTab) this.switchTab(restoredTab.id);
            this._updateUI();
        } else {
            g.collapsed = false;
            const newTab = { id: Date.now(), name: "Unnamed", hash: "", groupId: g.id };
            this.tabs.push(newTab);
            this._saveTabs();
            this.switchTab(newTab.id);
        }
    }

    _closeGroupTabs(group) {
        if (group.saved) {
            group.savedTabs = JSON.parse(JSON.stringify(this.tabs.filter(t => t.groupId === group.id)));
        }
        this.tabs = this.tabs.filter(t => t.groupId !== group.id);
        if (this.tabs.length === 0) {
            this.tabs.push({ id: Date.now(), name: "Unnamed", hash: "" });
        }
        if (!this.tabs.some(t => t.id === this.activeTabId)) {
            this.switchTab(this.tabs[0].id);
        } else {
            this._saveAll();
            this._updateUI();
        }
    }

    _showSavedGroupBarContextMenu(group, x, y) {
        if (this._contextMenu) this._contextMenu.remove();

        const IconOpenGroup = _MenuIconSvg([
            SVG.path({ d: "M5 11h8M9 7l4 4-4 4" })
        ]);
        const IconOpenInNewTab = _MenuIconSvg([
            SVG.rect({ x: "3", y: "3", width: "9", height: "9", rx: "1.5" }),
            SVG.path({ d: "M11 3h4v4M11 7l6-6" })
        ]);
        const IconUnpin = _MenuIconSvg([
            SVG.path({ d: "M9 3l2 2v2.5l-4 4V14H8v-2.5l4-4V5L9 3z" }),
            SVG.path({ d: "M3 15l12-12" })
        ]);
        const IconDelete = _MenuIconSvg([
            SVG.path({ d: "M6 6.5h6M7 6.5V5h4v1.5M7.5 8v6.5h3V8" }),
            SVG.path({ d: "M5 8h8v8H5V8z" })
        ]);

        const menu = div({
            class: "tab-context-menu tab-context-menu-wide",
            style: `--menu-group-color: ${group.color};`,
            onmousedown: (e) => e.stopPropagation(),
            onclick: (e) => e.stopPropagation()
        });

        const menuHeader = div({
            class: "menu-saved-group-header",
            style: `color: ${group.color};`
        }, (group.name || "Group").toUpperCase());

        const openGroup = _MenuRowWithIcon(IconOpenGroup, "Open group", null);
        openGroup.onclick = () => {
            this._activateSavedGroupFromBar(group);
            menu.remove();
        };

        const openGroupInNewTab = _MenuRowWithIcon(IconOpenInNewTab, "Open group in new tab", null);
        openGroupInNewTab.onclick = () => {
            group.collapsed = false;
            this._saveTabGroups();
            const newTab = { id: Date.now(), name: "Unnamed", hash: "", groupId: group.id };
            this.tabs.push(newTab);
            this._saveTabs();
            this.switchTab(newTab.id);
            menu.remove();
        };

        const unpinGroup = _MenuRowWithIcon(IconUnpin, "Unpin group", null);
        unpinGroup.onclick = () => {
            group.saved = false;
            this._saveTabGroups();
            this._updateUI();
            menu.remove();
        };

        const deleteGroupBar = _MenuRowWithIcon(IconDelete, "Delete group", null);
        deleteGroupBar.onclick = () => {
            group.saved = false;
            group.savedTabs = [];
            this.tabGroups = this.tabGroups.filter(g => g.id !== group.id);
            this._closeGroupTabs(group);
            menu.remove();
        };

        const separator = div({ class: "menu-separator" });
        const tabsSectionTitle = div({ class: "menu-tabs-section-header" }, [
            span({ class: "menu-item-duration-wrap menu-section-duration-label" }, "Time"),
            span({ class: "menu-tabs-section-title-text" }, "Tabs in group")
        ]);
        const tabList = div({ class: "menu-tab-list" });

        const openTabs = this.tabs.filter(t => t.groupId === group.id);
        const savedOnly = !openTabs.length && group.savedTabs && group.savedTabs.length > 0 ? group.savedTabs : [];
        const rows = openTabs.length ? openTabs : savedOnly;

        if (rows.length === 0) {
            tabList.appendChild(div({ class: "menu-item menu-item-muted menu-item-with-icon" }, [
                div({ class: "menu-item-duration-wrap" }, [span({ class: "menu-item-duration" }, "—")]),
                span({ class: "menu-item-label" }, "No tabs")
            ]));
        } else {
            rows.forEach(t => {
                const label = t.name || "Unnamed";
                const durationText = _formatDurationLabelFromHash(t.hash);
                const row = div({ class: "menu-item menu-item-with-icon menu-item-tab" }, [
                    div({ class: "menu-item-duration-wrap" }, [span({ class: "menu-item-duration" }, durationText)]),
                    span({ class: "menu-item-label" }, label)
                ]);
                if (openTabs.length) {
                    row.onclick = () => {
                        group.collapsed = false;
                        this._saveTabGroups();
                        const AlreadyOn = t.id === this.activeTabId;
                        this.switchTab(t.id);
                        if (AlreadyOn) this._updateUI();
                        menu.remove();
                    };
                } else {
                    row.classList.add("menu-item-muted");
                }
                tabList.appendChild(row);
            });
        }

        menu.appendChild(menuHeader);
        menu.appendChild(openGroup);
        menu.appendChild(openGroupInNewTab);
        menu.appendChild(unpinGroup);
        menu.appendChild(deleteGroupBar);
        menu.appendChild(separator);
        menu.appendChild(tabsSectionTitle);
        menu.appendChild(tabList);

        menu.style.left = x + "px";
        menu.style.top = y + "px";
        document.body.appendChild(menu);
        this._contextMenu = menu;

        const closeMenu = (e) => {
            if (!this._contextMenu) return;
            if (this._contextMenu.contains(e.target)) return;
            this._contextMenu.remove();
            this._contextMenu = null;
            document.removeEventListener("click", closeMenu);
        };
        setTimeout(() => document.addEventListener("click", closeMenu), 0);
    }

    _showGroupContextMenu(group, x, y) {
        if (this._contextMenu) this._contextMenu.remove();

        const IconNewTabInGroup = _MenuIconSvg([
            SVG.rect({ x: "3", y: "3", width: "12", height: "12", rx: "2" }),
            SVG.path({ d: "M9 6.5v5M6.5 9h5" })
        ]);
        const IconPinBar = _MenuIconSvg([
            SVG.path({ d: "M9 3l2 2v2.5l-4 4V14H8v-2.5l4-4V5L9 3z" })
        ]);
        const IconCloseGroup = _MenuIconSvg([
            SVG.rect({ x: "3.5", y: "3.5", width: "11", height: "11", rx: "1.5" }),
            SVG.path({ d: "M6.5 6.5l5 5M11.5 6.5l-5 5" })
        ]);
        const IconUngroup = _MenuIconSvg([
            SVG.path({ d: "M3 8h4v4H3V8zM11 6h4v4h-4V6z" }),
            SVG.path({ d: "M7.5 9l3.5-2" })
        ]);
        const IconTrash = _MenuIconSvg([
            SVG.path({ d: "M6 6.5h6M7 6.5V5h4v1.5M7.5 8.5v6h3v-6" }),
            SVG.path({ d: "M5.5 8.5h7l-.5 7.5h-6L5.5 8.5z" })
        ]);

        const menu = div({
            class: "tab-context-menu tab-context-menu-chrome",
            style: `--menu-group-color: ${group.color};`,
            onmousedown: (e) => e.stopPropagation(),
            onclick: (e) => e.stopPropagation()
        });

        const nameInput = input({
            class: "menu-chrome-name-input",
            type: "text",
            value: (group.name || "").toUpperCase(),
            onmousedown: (e) => e.stopPropagation(),
            onkeydown: (e) => {
                e.stopPropagation();
                if (e.key === "Enter") e.target.blur();
            },
            oninput: (e) => {
                const el = e.target;
                const upper = el.value.toUpperCase();
                if (el.value !== upper) {
                    const c = el.selectionStart;
                    el.value = upper;
                    el.setSelectionRange(c, c);
                }
            },
            onblur: (e) => {
                const v = e.target.value.trim().toUpperCase();
                if (v) group.name = v;
                else e.target.value = (group.name || "").toUpperCase();
                this._saveTabGroups();
                this._updateUI();
            }
        });

        const nameBlock = div({ class: "menu-chrome-name-block" }, [nameInput]);

        const colorGrid = div({ class: "color-grid color-grid-chrome" });
        const presetColors = ["#dadce0", "#8ab4f8", "#f28b82", "#fde293", "#81c995", "#ff8bcb", "#c58af9", "#78d9ec", "#fcad70"];
        presetColors.forEach(c => {
            const swatch = div({ class: "color-swatch", style: `background: ${c};` });
            if (group.color === c) swatch.classList.add("selected");
            swatch.onclick = (e) => {
                group.color = c;
                menu.style.setProperty("--menu-group-color", c);
                this._saveTabGroups();
                this._updateUI();
                e.stopPropagation();
            };
            colorGrid.appendChild(swatch);
        });

        const sep1 = div({ class: "menu-separator" });

        const newTabInGroup = _MenuRowWithIcon(IconNewTabInGroup, "New tab in group", null);
        newTabInGroup.onclick = () => {
            group.collapsed = false;
            this._saveTabGroups();
            const newTab = { id: Date.now(), name: "Unnamed", hash: "", groupId: group.id };
            this.tabs.push(newTab);
            this._saveTabs();
            this.switchTab(newTab.id);
            menu.remove();
        };

        const toggleSaveGroup = _MenuRowWithIcon(IconPinBar, group.saved ? "Unpin group" : "Pin group", null);
        toggleSaveGroup.onclick = () => {
            group.saved = !group.saved;
            this._saveTabGroups();
            this._updateUI();
            menu.remove();
        };

        const closeGroup = _MenuRowWithIcon(IconCloseGroup, group.saved ? "Hide group" : "Close group", null);
        closeGroup.onclick = () => {
            this._closeGroupTabs(group);
            menu.remove();
        };

        const sep2 = div({ class: "menu-separator" });

        const ungroupGroup = _MenuRowWithIcon(IconUngroup, "Ungroup", null);
        ungroupGroup.onclick = () => {
            this.tabs.forEach(t => {
                if (t.groupId === group.id) t.groupId = null;
            });
            this._saveAll();
            this._updateUI();
            menu.remove();
        };

        const deleteGroup = _MenuRowWithIcon(IconTrash, "Delete group", null);
        deleteGroup.onclick = () => {
            group.saved = false;
            group.savedTabs = [];
            this.tabGroups = this.tabGroups.filter(g => g.id !== group.id);
            this._closeGroupTabs(group);
            menu.remove();
        };

        menu.appendChild(nameBlock);
        menu.appendChild(colorGrid);
        menu.appendChild(sep1);
        menu.appendChild(newTabInGroup);
        menu.appendChild(toggleSaveGroup);
        menu.appendChild(closeGroup);
        menu.appendChild(sep2);
        menu.appendChild(ungroupGroup);
        menu.appendChild(deleteGroup);

        menu.style.left = x + "px";
        menu.style.top = y + "px";
        document.body.appendChild(menu);
        this._contextMenu = menu;

        requestAnimationFrame(() => {
            nameInput.focus();
            nameInput.select();
        });

        const closeMenu = (e) => {
            if (!this._contextMenu) return;
            if (this._contextMenu.contains(e.target)) return;
            this._contextMenu.remove();
            this._contextMenu = null;
            document.removeEventListener("click", closeMenu);
        };
        setTimeout(() => document.addEventListener("click", closeMenu), 0);
    }

    _handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    _applyTabReorder(draggedId, targetId, clientX) {
        if (!draggedId || draggedId === targetId) return false;
        const draggedIndex = this.tabs.findIndex(t => t.id === draggedId);
        const targetIndex = this.tabs.findIndex(t => t.id === targetId);
        if (draggedIndex === -1 || targetIndex === -1) return false;
        const draggedTab = this.tabs[draggedIndex];
        const targetTab = this.tabs[targetIndex];
        draggedTab.groupId = targetTab.groupId;
        let insertAfter = false;
        const tabItem = this.tabBar.querySelector(`[data-tab-id="${targetId}"]`);
        if (tabItem && clientX != null) {
            const rect = tabItem.getBoundingClientRect();
            if (clientX > rect.left + rect.width / 2) insertAfter = true;
        }
        this.tabs.splice(draggedIndex, 1);
        let newTargetIndex = this.tabs.findIndex(t => t.id === targetId);
        if (insertAfter) newTargetIndex++;
        const pinnedAfter = this.tabs.filter((T) => T.pinned).length;
        if (!draggedTab.pinned && newTargetIndex < pinnedAfter) newTargetIndex = pinnedAfter;
        if (draggedTab.pinned && newTargetIndex > pinnedAfter) newTargetIndex = pinnedAfter;
        this.tabs.splice(newTargetIndex, 0, draggedTab);
        this._saveAll();
        this._updateUI();
        return true;
    }

    _applyTabInsertBeforeGroup(draggedId, groupId) {
        const draggedIndex = this.tabs.findIndex((T) => T.id === draggedId);
        if (draggedIndex === -1) return;
        const draggedTab = this.tabs[draggedIndex];
        draggedTab.groupId = null;
        this.tabs.splice(draggedIndex, 1);
        const firstIdx = this.tabs.findIndex((T) => String(T.groupId) === String(groupId));
        const pinnedAfter = this.tabs.filter((T) => T.pinned).length;
        let insertAt = firstIdx === -1 ? pinnedAfter : firstIdx;
        if (!draggedTab.pinned && insertAt < pinnedAfter) insertAt = pinnedAfter;
        if (draggedTab.pinned && insertAt > pinnedAfter) insertAt = pinnedAfter;
        this.tabs.splice(insertAt, 0, draggedTab);
        this._saveAll();
        this._updateUI();
    }

    _applyDropOnGroupHeader(tabId, group) {
        const draggedIndex = this.tabs.findIndex(t => t.id === tabId);
        if (draggedIndex === -1) return;
        const draggedTab = this.tabs[draggedIndex];
        draggedTab.groupId = group.id;
        this.tabs.splice(draggedIndex, 1);
        const firstGroupTabIndex = this.tabs.findIndex(t => t.groupId === group.id);
        if (firstGroupTabIndex !== -1) this.tabs.splice(firstGroupTabIndex, 0, draggedTab);
        else this.tabs.push(draggedTab);
        this._saveAll();
        this._updateUI();
    }

    _applyWrapperDrop(tabId) {
        const draggedIndex = this.tabs.findIndex(t => t.id === tabId);
        if (draggedIndex === -1) return;
        const draggedTab = this.tabs[draggedIndex];
        draggedTab.groupId = null;
        this.tabs.splice(draggedIndex, 1);
        this.tabs.push(draggedTab);
        this._saveAll();
        this._updateUI();
    }

    _tabsScrollBlocksSorted() {
        const Scroll = this.tabBar.querySelector(".tabs-scroll");
        if (!Scroll) return [];
        return [...Scroll.children].sort((A, B) => {
            const Ra = A.getBoundingClientRect();
            const Rb = B.getBoundingClientRect();
            if (Math.abs(Ra.top - Rb.top) > 1) return Ra.top - Rb.top;
            return Ra.left - Rb.left;
        });
    }

    _clampGroupBlockInsertIndex(To, Blocks) {
        if (Blocks[0] && Blocks[0].classList.contains("tab-pinned-strip") && To === 0) return 1;
        return To;
    }

    _syncUnpinnedTabsFromTabsScrollDom() {
        const Pinned = this.tabs.filter((T) => T.pinned);
        const Scroll = this.tabBar.querySelector(".tabs-scroll");
        const Unpinned = [];
        const Seen = new Set();
        if (Scroll) {
            for (const Child of Scroll.children) {
                if (Child.classList.contains("tab-pinned-strip")) continue;
                if (Child.classList.contains("tab-group-container")) {
                    const Inner = Child.querySelector(".tab-group-inner");
                    if (!Inner) continue;
                    for (const Tab of Inner.querySelectorAll(".tab-item")) {
                        const Id = Number(Tab.dataset.tabId);
                        const T = this.tabs.find((X) => X.id === Id);
                        if (T && !T.pinned && !Seen.has(T.id)) {
                            Seen.add(T.id);
                            Unpinned.push(T);
                        }
                    }
                } else if (Child.classList.contains("tab-item")) {
                    const Id = Number(Child.dataset.tabId);
                    const T = this.tabs.find((X) => X.id === Id);
                    if (T && !T.pinned && !Seen.has(T.id)) {
                        Seen.add(T.id);
                        Unpinned.push(T);
                    }
                }
            }
        }
        const Rest = this.tabs.filter((T) => !T.pinned && !Seen.has(T.id));
        this.tabs = [...Pinned, ...Unpinned, ...Rest];
    }

    _applyGroupBlockReorder(GroupId, ToBlockIndex) {
        const Scroll = this.tabBar.querySelector(".tabs-scroll");
        if (!Scroll) return;
        const El = Scroll.querySelector(`[data-group-container-id="${GroupId}"]`);
        if (!El) return;
        const Blocks = [...Scroll.children];
        const From = Blocks.indexOf(El);
        if (From === -1 || ToBlockIndex === From) return;
        if (ToBlockIndex < 0 || ToBlockIndex > Blocks.length) return;
        if (ToBlockIndex === Blocks.length) Scroll.appendChild(El);
        else {
            const Ref = Blocks[ToBlockIndex];
            if (Ref !== El) Scroll.insertBefore(El, Ref);
        }
        this._syncUnpinnedTabsFromTabsScrollDom();
        this._saveAll();
        this._updateUI();
    }

    _handleDrop(e, targetId) {
        e.preventDefault();
        e.stopPropagation();
        if (this._handleLinkDrop(e)) return;
        const data = e.dataTransfer.getData("text/plain");
        const draggedId = Number(data);
        this._applyTabReorder(draggedId, targetId, e.clientX);
    }

    _handleDropOnGroupHeader(e, group) {
        e.preventDefault();
        e.stopPropagation();
        const draggedId = Number(e.dataTransfer.getData("text/plain"));
        if (!draggedId) return;
        this._applyDropOnGroupHeader(draggedId, group);
    }

    _handleWrapperDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this._handleLinkDrop(e)) return;
        if (!e.target.classList.contains("tabs-wrapper") && !e.target.classList.contains("tabs-scroll")) return;
        const data = e.dataTransfer.getData("text/plain");
        const draggedId = Number(data);
        if (!draggedId) return;
        this._applyWrapperDrop(draggedId);
    }

    _handleTabPointerDown(e, tab) {
        if (e.button !== 0) return;
        if (e.target.closest(".tab-close")) return;
        this._tabPointerPending = {
            TabId: tab.id,
            StartX: e.clientX,
            StartY: e.clientY,
            SourceEl: e.currentTarget
        };
        document.addEventListener("pointermove", this._tabPointerMove);
        document.addEventListener("pointerup", this._tabPointerUp);
        document.addEventListener("pointercancel", this._tabPointerUp);
    }

    _tabItemsInVisualOrder() {
        const Items = [...this.tabBar.querySelectorAll(".tab-item")];
        Items.sort((A, B) => {
            const Ra = A.getBoundingClientRect();
            const Rb = B.getBoundingClientRect();
            if (Math.abs(Ra.top - Rb.top) > 1) return Ra.top - Rb.top;
            return Ra.left - Rb.left;
        });
        return Items;
    }

    _tabDragInsertIndex(ClientX, Nodes, DragEl, SplitRatio = 0.5) {
        const From = Nodes.indexOf(DragEl);
        if (From === -1) return 0;
        const DragRect = DragEl.getBoundingClientRect();
        if (ClientX >= DragRect.left && ClientX <= DragRect.right) return From;
        const Others = Nodes.filter((El) => El !== DragEl);
        let J = 0;
        for (; J < Others.length; J++) {
            const R = Others[J].getBoundingClientRect();
            if (ClientX < R.left + R.width * SplitRatio) break;
        }
        if (J >= Others.length) return Nodes.length;
        return Nodes.indexOf(Others[J]);
    }

    _clampTabDragInsertIndexForPins(To, Nodes, DragEl) {
        const DragsPinned = DragEl.classList.contains("tab-item-pinned");
        const FirstUnpinned = Nodes.findIndex((El) => !El.classList.contains("tab-item-pinned"));
        const FU = FirstUnpinned === -1 ? Nodes.length : FirstUnpinned;
        if (!DragsPinned) return Math.max(To, FU);
        return Math.min(To, FU);
    }

    _tabDragOverGroupHeader(ClientX, ClientY) {
        const Scroll = this.tabBar.querySelector(".tabs-scroll");
        if (!Scroll) return null;
        for (const H of Scroll.querySelectorAll(".tab-group-header")) {
            const R = H.getBoundingClientRect();
            if (ClientX >= R.left && ClientX <= R.right && ClientY >= R.top && ClientY <= R.bottom) return H.dataset.groupId;
        }
        return null;
    }

    _firstTabElForGroupInNodes(Nodes, groupId) {
        for (const El of Nodes) {
            const C = El.closest(".tab-group-container");
            if (C && String(C.dataset.groupContainerId) === String(groupId)) return El;
        }
        return null;
    }

    _clearTabDragShifts() {
        for (const El of this.tabBar.querySelectorAll(".tab-item")) El.style.transform = "";
    }

    _updateTabDragShifts(Pending, ClientX, ClientY) {
        const Nodes = this._tabItemsInVisualOrder();
        const From = Nodes.indexOf(Pending.SourceEl);
        if (From === -1) return;
        let To = this._tabDragInsertIndex(ClientX, Nodes, Pending.SourceEl, 0.42);
        const HeaderGid = this._tabDragOverGroupHeader(ClientX, ClientY);
        if (HeaderGid !== null) {
            const First = this._firstTabElForGroupInNodes(Nodes, HeaderGid);
            if (First) {
                const Ix = Nodes.indexOf(First);
                if (Ix !== -1) To = Ix;
            }
        }
        To = this._clampTabDragInsertIndexForPins(To, Nodes, Pending.SourceEl);
        const W = Pending.DragWidth;
        const N = Nodes.length;
        if (To === From) {
            for (const El of Nodes) {
                if (El !== Pending.SourceEl) El.style.transform = "";
            }
            return;
        }
        const SourcePinned = Pending.SourceEl.classList.contains("tab-item-pinned");
        for (let I = 0; I < N; I++) {
            const El = Nodes[I];
            if (El === Pending.SourceEl) continue;
            const ElPinned = El.classList.contains("tab-item-pinned");
            if (SourcePinned !== ElPinned) {
                El.style.transform = "";
                continue;
            }
            let Tx = 0;
            if (To > From) {
                if (I >= From + 1 && I <= Math.min(To, N - 1)) Tx = -W;
            } else if (To < From) {
                if (I >= To && I <= From - 1) Tx = W;
            }
            El.style.transform = Tx === 0 ? "" : `translateX(${Tx}px)`;
        }
    }

    _onTabPointerMove(e) {
        const Pending = this._tabPointerPending;
        if (!Pending) return;
        const Dx = e.clientX - Pending.StartX;
        const Dy = e.clientY - Pending.StartY;
        const Dist = Math.hypot(Dx, Dy);
        if (!Pending.Dragging && Dist < 5) return;
        if (!Pending.Dragging) {
            Pending.Dragging = true;
            document.body.style.cursor = "grabbing";
            const Rect = Pending.SourceEl.getBoundingClientRect();
            Pending.GrabOffsetX = e.clientX - Rect.left;
            Pending.Ghost = document.createElement("div");
            Pending.Ghost.className = "tab-drag-ghost";
            const Clone = Pending.SourceEl.cloneNode(true);
            Clone.classList.remove("tab-item-dragging");
            const CloseBtn = Clone.querySelector(".tab-close");
            if (CloseBtn) CloseBtn.remove();
            Pending.Ghost.appendChild(Clone);
            Pending.Ghost.style.width = Rect.width + "px";
            Pending.Ghost.style.height = Rect.height + "px";
            Pending.DragWidth = Rect.width;
            document.body.appendChild(Pending.Ghost);
            Pending.SourceEl.classList.add("tab-item-dragging");
        }
        Pending.Ghost.style.left = (e.clientX - Pending.GrabOffsetX) + "px";
        Pending.Ghost.style.top = Pending.SourceEl.getBoundingClientRect().top + "px";
        this._updateTabDragShifts(Pending, e.clientX, e.clientY);
    }

    _onTabPointerUp(e) {
        document.removeEventListener("pointermove", this._tabPointerMove);
        document.removeEventListener("pointerup", this._tabPointerUp);
        document.removeEventListener("pointercancel", this._tabPointerUp);
        const Pending = this._tabPointerPending;
        this._tabPointerPending = null;
        if (!Pending) return;
        document.body.style.cursor = "";
        if (Pending.Dragging) this._clearTabDragShifts();
        if (Pending.Ghost) {
            Pending.Ghost.remove();
            Pending.SourceEl.classList.remove("tab-item-dragging");
        }
        if (!Pending.Dragging) return;
        e.preventDefault();
        const X = e.clientX;
        const Hit = document.elementFromPoint(X, e.clientY);
        if (Hit) {
            const HeaderHit = Hit.closest(".tab-group-header");
            if (HeaderHit) {
                const Gid = HeaderHit.dataset.groupId;
                if (Gid) this._applyTabInsertBeforeGroup(Pending.TabId, Gid);
            } else {
                const TabHit = Hit.closest(".tab-item");
                if (TabHit) {
                    const TargetId = Number(TabHit.dataset.tabId);
                    if (TargetId && TargetId !== Pending.TabId) this._applyTabReorder(Pending.TabId, TargetId, X);
                } else if ((Hit.closest(".tabs-scroll") || Hit.closest(".tabs-wrapper")) && !Hit.closest(".tab-add")) {
                    this._applyWrapperDrop(Pending.TabId);
                }
            }
        }
        Pending.SourceEl.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
        }, { capture: true, once: true });
    }

    _clearGroupDragShifts() {
        const Scroll = this.tabBar.querySelector(".tabs-scroll");
        if (!Scroll) return;
        for (const El of Scroll.children) El.style.transform = "";
    }

    _updateGroupDragShifts(Pending, ClientX) {
        const Blocks = this._tabsScrollBlocksSorted();
        const From = Blocks.indexOf(Pending.SourceContainerEl);
        if (From === -1) return;
        const To = this._clampGroupBlockInsertIndex(
            this._tabDragInsertIndex(ClientX, Blocks, Pending.SourceContainerEl, 0.32),
            Blocks
        );
        const W = Pending.DragWidth;
        const N = Blocks.length;
        if (To === From) {
            for (const El of Blocks) {
                if (El !== Pending.SourceContainerEl) El.style.transform = "";
            }
            return;
        }
        for (let I = 0; I < N; I++) {
            const El = Blocks[I];
            if (El === Pending.SourceContainerEl) continue;
            let Tx = 0;
            if (To > From) {
                if (I >= From + 1 && I <= Math.min(To, N - 1)) Tx = -W;
            } else if (To < From) {
                if (I >= To && I <= From - 1) Tx = W;
            }
            El.style.transform = Tx === 0 ? "" : `translateX(${Tx}px)`;
        }
    }

    _handleGroupHeaderPointerDown(e, group) {
        if (e.button !== 0) return;
        if (this._tabPointerPending) return;
        const Container = e.currentTarget.closest(".tab-group-container");
        if (!Container) return;
        this._groupPointerPending = {
            GroupId: group.id,
            Group: group,
            SourceContainerEl: Container,
            StartX: e.clientX,
            StartY: e.clientY,
            HeaderEl: e.currentTarget
        };
        document.addEventListener("pointermove", this._groupPointerMove);
        document.addEventListener("pointerup", this._groupPointerUp);
        document.addEventListener("pointercancel", this._groupPointerUp);
    }

    _onGroupPointerMove(e) {
        const Pending = this._groupPointerPending;
        if (!Pending) return;
        const Dx = e.clientX - Pending.StartX;
        const Dy = e.clientY - Pending.StartY;
        const Dist = Math.hypot(Dx, Dy);
        if (!Pending.Dragging && Dist < 5) return;
        if (!Pending.Dragging) {
            Pending.Dragging = true;
            document.body.style.cursor = "grabbing";
            const Rect = Pending.SourceContainerEl.getBoundingClientRect();
            Pending.GrabOffsetX = e.clientX - Rect.left;
            Pending.Ghost = document.createElement("div");
            Pending.Ghost.className = "tab-drag-ghost tab-group-drag-ghost";
            const Clone = Pending.SourceContainerEl.cloneNode(true);
            Clone.classList.remove("tab-group-dragging");
            Clone.querySelectorAll(".tab-item-dragging").forEach((N) => N.classList.remove("tab-item-dragging"));
            Pending.Ghost.appendChild(Clone);
            Pending.Ghost.style.width = Rect.width + "px";
            Pending.Ghost.style.height = Rect.height + "px";
            Pending.DragWidth = Rect.width;
            document.body.appendChild(Pending.Ghost);
            Pending.SourceContainerEl.classList.add("tab-group-dragging");
        }
        Pending.Ghost.style.left = (e.clientX - Pending.GrabOffsetX) + "px";
        Pending.Ghost.style.top = Pending.SourceContainerEl.getBoundingClientRect().top + "px";
        this._updateGroupDragShifts(Pending, e.clientX);
    }

    _onGroupPointerUp(e) {
        document.removeEventListener("pointermove", this._groupPointerMove);
        document.removeEventListener("pointerup", this._groupPointerUp);
        document.removeEventListener("pointercancel", this._groupPointerUp);
        const Pending = this._groupPointerPending;
        this._groupPointerPending = null;
        if (!Pending) return;
        document.body.style.cursor = "";
        if (Pending.Dragging) this._clearGroupDragShifts();
        if (Pending.Ghost) {
            Pending.Ghost.remove();
            Pending.SourceContainerEl.classList.remove("tab-group-dragging");
        }
        if (Pending.Dragging) {
            e.preventDefault();
            const Blocks = this._tabsScrollBlocksSorted();
            const To = this._clampGroupBlockInsertIndex(
                this._tabDragInsertIndex(e.clientX, Blocks, Pending.SourceContainerEl, 0.32),
                Blocks
            );
            const From = Blocks.indexOf(Pending.SourceContainerEl);
            if (To !== From) this._applyGroupBlockReorder(Pending.GroupId, To);
            Pending.HeaderEl.addEventListener("click", (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
            }, { capture: true, once: true });
            return;
        }
        const Dist = Math.hypot(e.clientX - Pending.StartX, e.clientY - Pending.StartY);
        if (Dist < 5) {
            Pending.Group.collapsed = !Pending.Group.collapsed;
            this._saveTabGroups();
            this._updateUI();
        }
    }

    _handleLinkDrop(e) {
        const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain") || "";
        if (url && (url.includes("#") || url.includes("http"))) {
            const hashMatch = url.match(/#(.+)$/);
            if (hashMatch) {
                const hash = hashMatch[1];
                const id = Date.now();
                const newTab = {
                    id: id,
                    name: "Imported Song",
                    hash: hash
                };
                this.tabs.push(newTab);
                this._saveTabs();
                this.switchTab(id);
                this._updateUI();
                return true;
            }
        }
        return false;
    }

    _updateUI() {
        this.tabBar.innerHTML = "";
        this.savedGroupsBar.innerHTML = "";

        // Clean up empty groups that are not saved
        this.tabGroups = this.tabGroups.filter(g => g.saved || this.tabs.some(t => t.groupId === g.id));
        this._saveTabGroups();

        // Render saved groups bar
        const savedGroups = this.tabGroups.filter(g => g.saved);
        if (savedGroups.length > 0) {
            this.savedGroupsBar.style.display = "flex";
            savedGroups.forEach(g => {
                const GroupIsOpen = this.tabs.some(t => t.groupId === g.id);
                const BadgeStyle = GroupIsOpen
                    ? `color: ${g.color}; border: 2px solid ${g.color}; background: transparent; box-shadow: none;`
                    : `background-color: ${g.color}; color: #000; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2);`;
                const badge = div({
                    class: `saved-group-badge ${GroupIsOpen ? "saved-group-badge-open" : "saved-group-badge-active"}`,
                    style: BadgeStyle
                }, g.name);
                badge.onclick = () => this._activateSavedGroupFromBar(g);
                badge.oncontextmenu = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this._showSavedGroupBarContextMenu(g, e.clientX, e.clientY);
                };
                this.savedGroupsBar.appendChild(badge);
            });
        } else {
            this.savedGroupsBar.style.display = "none";
        }

        const brand = div({ class: "tab-brand", style: "display: flex; align-items: center;" }, [
            img({ src: "./website/icon_32.png", width: "22", height: "22", class: "tab-brand-logo", style: "margin-right: 8px;" }),
            span({ class: "tab-brand-text", style: "margin-bottom: -2px;" }, "BoneBox")
        ]);
        const TabsScroll = div({
            class: "tabs-scroll",
            ondragover: (e) => this._handleDragOver(e),
            ondrop: (e) => this._handleWrapperDrop(e)
        });
        const tabsWrapper = div({ class: "tabs-wrapper" });

        const pinnedTabs = this.tabs.filter(t => t.pinned);
        const unpinnedTabs = this.tabs.filter(t => !t.pinned);

        const renderTabEl = (tab) => {
            const isActive = tab.id === this.activeTabId;
            const isNew = !this.renderedTabIds.has(tab.id);
            const TabGroup = tab.groupId != null && tab.groupId !== ""
                ? this.tabGroups.find(g => g.id == tab.groupId)
                : null;
            const tabEl = div({
                class: `tab-item ${isActive ? "active" : ""} ${TabGroup ? "grouped-tab" : ""} ${isNew ? "newly-added" : ""} ${tab.pinned ? "tab-item-pinned" : ""}`,
                ...(tab.pinned ? { title: tab.name || "Unnamed" } : {}),
                onpointerdown: (e) => this._handleTabPointerDown(e, tab),
                ondragover: (e) => this._handleDragOver(e),
                ondrop: (e) => this._handleDrop(e, tab.id),
                onclick: () => this.switchTab(tab.id),
                oncontextmenu: (e) => {
                    e.preventDefault();
                    this._showContextMenu(tab, e.clientX, e.clientY);
                }
            }, tab.pinned ? [
                span({ class: "tab-pinned-icon-wrap" }, [_IconPinnedTabSvg()])
            ] : [
                span({ class: "tab-name" }, tab.name),
                button({
                    class: "tab-close",
                    onclick: (e) => this.closeTab(tab.id, e),
                    title: "Close Tab"
                }, "✕")
            ]);

            if (TabGroup) tabEl.style.setProperty("--tab-group-color", TabGroup.color);
            else tabEl.style.removeProperty("--tab-group-color");
            tabEl.dataset.tabId = String(tab.id);

            if (isNew) this.renderedTabIds.add(tab.id);
            return tabEl;
        };

        if (pinnedTabs.length) {
            const pinnedStrip = div({ class: "tab-pinned-strip" });
            pinnedTabs.forEach(tab => pinnedStrip.appendChild(renderTabEl(tab)));
            TabsScroll.appendChild(pinnedStrip);
        }

        let currentGroupId = null;
        let currentGroupContainer = null;

        unpinnedTabs.forEach(tab => {
            const tabEl = renderTabEl(tab);
            const TabGroup = tab.groupId != null && tab.groupId !== ""
                ? this.tabGroups.find(g => g.id == tab.groupId)
                : null;

            if (tab.groupId) {
                const group = TabGroup;
                if (group) {
                    if (currentGroupId !== tab.groupId) {
                        currentGroupId = tab.groupId;
                        const groupHeader = div({
                            class: "tab-group-header",
                            style: `background-color: ${group.color}; color: #000;`,
                            onpointerdown: (e) => this._handleGroupHeaderPointerDown(e, group),
                            ondragover: (e) => this._handleDragOver(e),
                            ondrop: (e) => this._handleDropOnGroupHeader(e, group),
                            oncontextmenu: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this._showGroupContextMenu(group, e.clientX, e.clientY);
                            }
                        }, group.name);
                        groupHeader.dataset.groupId = String(group.id);

                        const groupContainerInner = div({ class: "tab-group-inner", style: `${group.collapsed ? 'display: none;' : ''}` });

                        currentGroupContainer = div({
                            class: "tab-group-container",
                            style: `--tab-group-color: ${group.color};`
                        }, [
                            groupHeader,
                            groupContainerInner
                        ]);
                        currentGroupContainer.dataset.groupContainerId = String(group.id);
                        TabsScroll.appendChild(currentGroupContainer);
                    }
                    if (currentGroupContainer) {
                        currentGroupContainer.querySelector(".tab-group-inner").appendChild(tabEl);
                    }
                } else {
                    currentGroupId = null;
                    currentGroupContainer = null;
                    TabsScroll.appendChild(tabEl);
                }
            } else {
                currentGroupId = null;
                currentGroupContainer = null;
                TabsScroll.appendChild(tabEl);
            }
        });

        const addBtn = button({
            class: "tab-add",
            onclick: () => this.addTab(),
            title: "New Project"
        }, "+");

        tabsWrapper.appendChild(TabsScroll);
        tabsWrapper.appendChild(addBtn);

        const UseVerticalStrip = this.doc.prefs.tabPosition === "left" || this.doc.prefs.tabPosition === "right";
        if (UseVerticalStrip) {
            this.tabBrandRow.innerHTML = "";
            this.tabBrandRow.appendChild(brand);
            this.tabBrandRow.style.display = "";
            this.tabBar.appendChild(tabsWrapper);
        } else {
            this.tabBrandRow.innerHTML = "";
            this.tabBrandRow.style.display = "none";
            this.tabBar.appendChild(brand);
            this.tabBar.appendChild(tabsWrapper);
        }
    }

    _injectStyles() {
        const style = HTML.style({ type: "text/css" }, `
            @keyframes neonFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes neonFlowVertical {
                0% { background-position: 50% 0%; }
                50% { background-position: 50% 100%; }
                100% { background-position: 50% 0%; }
            }

            .tab-manager-wrapper {
                display: flex;
                flex-direction: column;
                width: 100%;
                flex-shrink: 0;
                z-index: 10;
                position: relative;
                background: var(--editor-background);
                --saved-groups-bar-bg: color-mix(in srgb, var(--editor-background) 88%, var(--primary-text));
            }
            .tab-manager-wrapper::after {
                content: "";
                position: absolute;
                pointer-events: none;
                z-index: 3;
                box-sizing: border-box;
            }
            body.tab-position-top .tab-manager-wrapper::after {
                bottom: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, var(--link-accent), var(--primary-text), var(--loop-accent));
                background-size: 200% 100%;
                animation: neonFlow 8s ease infinite;
                box-shadow: 0 5px 15px -8px color-mix(in srgb, var(--link-accent) 55%, transparent);
            }
            body.tab-position-bottom .tab-manager-wrapper::after {
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, var(--link-accent), var(--primary-text), var(--loop-accent));
                background-size: 200% 100%;
                animation: neonFlow 8s ease infinite;
                box-shadow: 0 -5px 15px -8px color-mix(in srgb, var(--link-accent) 55%, transparent);
            }
            body.tab-position-left .tab-manager-wrapper::after {
                top: 0;
                bottom: 0;
                right: 0;
                width: 2px;
                background: linear-gradient(180deg, var(--link-accent), var(--primary-text), var(--loop-accent));
                background-size: 100% 200%;
                animation: neonFlowVertical 8s ease infinite;
                box-shadow: -4px 0 12px -6px color-mix(in srgb, var(--link-accent) 45%, transparent);
            }
            body.tab-position-right .tab-manager-wrapper::after {
                top: 0;
                bottom: 0;
                left: 0;
                width: 2px;
                background: linear-gradient(180deg, var(--link-accent), var(--primary-text), var(--loop-accent));
                background-size: 100% 200%;
                animation: neonFlowVertical 8s ease infinite;
                box-shadow: 4px 0 12px -6px color-mix(in srgb, var(--link-accent) 45%, transparent);
            }

            .tab-brand-row {
                display: none;
                flex-shrink: 0;
                box-sizing: border-box;
            }

            .tab-bar-container {
                display: flex;
                align-items: flex-end;
                gap: 12px;
                padding: 8px 12px 0 12px;
                width: 100%;
                box-sizing: border-box;
                user-select: none;
                position: relative;
                z-index: 2;
                overflow: visible;
            }

            .saved-groups-bar {
                --saved-groups-bar-bg: color-mix(in srgb, var(--editor-background) 88%, var(--primary-text));
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px 24px;
                width: 100%;
                box-sizing: border-box;
                background: var(--saved-groups-bar-bg);
                min-height: 28px;
                flex-wrap: wrap;
                position: relative;
                z-index: 1;
                border-top: none;
            }

            .bonebox-saved-groups-topbar {
                flex-shrink: 0;
                z-index: 15;
                border-bottom: 1px solid color-mix(in srgb, var(--primary-text) 10%, transparent);
                min-width: 0;
                max-width: 100%;
                overflow-x: auto;
                overflow-y: hidden;
            }
            .bonebox-saved-groups-topbar::before,
            .bonebox-saved-groups-topbar::after {
                content: "";
                position: absolute;
                pointer-events: none;
                z-index: 2;
                box-sizing: border-box;
            }
            body.tab-position-top .bonebox-saved-groups-topbar::before,
            body.tab-position-bottom .bonebox-saved-groups-topbar::before {
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, var(--link-accent), var(--primary-text), var(--loop-accent));
                background-size: 200% 100%;
                animation: neonFlow 8s ease infinite;
                box-shadow: 0 4px 12px -6px color-mix(in srgb, var(--link-accent) 55%, transparent);
            }
            body.tab-position-top .bonebox-saved-groups-topbar::after,
            body.tab-position-bottom .bonebox-saved-groups-topbar::after {
                display: none;
            }
            body.tab-position-left .bonebox-saved-groups-topbar::before {
                display: none;
            }
            body.tab-position-left .bonebox-saved-groups-topbar::after {
                top: 0;
                bottom: 0;
                right: 0;
                width: 2px;
                background: linear-gradient(180deg, var(--link-accent), var(--primary-text), var(--loop-accent));
                background-size: 100% 200%;
                animation: neonFlowVertical 8s ease infinite;
                box-shadow: -4px 0 12px -6px color-mix(in srgb, var(--link-accent) 45%, transparent);
            }
            body.tab-position-right .bonebox-saved-groups-topbar::before {
                display: none;
            }
            body.tab-position-right .bonebox-saved-groups-topbar::after {
                top: 0;
                bottom: 0;
                left: 0;
                width: 2px;
                background: linear-gradient(180deg, var(--link-accent), var(--primary-text), var(--loop-accent));
                background-size: 100% 200%;
                animation: neonFlowVertical 8s ease infinite;
                box-shadow: 4px 0 12px -6px color-mix(in srgb, var(--link-accent) 45%, transparent);
            }

            .saved-group-badge {
                font-size: 11px;
                font-weight: 800;
                padding: 4px 10px;
                border-radius: 8px;
                cursor: pointer;
                user-select: none;
                transition: filter 0.1s, opacity 0.1s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .saved-group-badge-open:hover {
                filter: brightness(1.08);
            }

            .saved-group-badge-active:hover {
                filter: brightness(1.06);
            }

            .tab-brand {
                font-weight: 900;
                font-size: 14px;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-bottom: 8px;
                background: linear-gradient(135deg, var(--loop-accent), var(--primary-text), var(--link-accent));
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 0 8px color-mix(in srgb, var(--link-accent) 45%, transparent));
                cursor: default;
                display: flex;
                align-items: center;
            }

            .tabs-wrapper {
                display: flex;
                align-items: stretch;
                gap: 4px;
                overflow: visible;
                flex-grow: 1;
                min-width: 0;
                padding: 4px 12px 0 12px;
                position: relative;
                z-index: 1;
            }

            .tabs-scroll {
                display: flex;
                align-items: stretch;
                gap: 4px;
                flex: 1;
                min-width: 0;
                overflow-x: auto;
                overflow-y: visible;
                scrollbar-width: none;
                padding-bottom: 4px;
                box-sizing: border-box;
            }
            .tabs-scroll::-webkit-scrollbar {
                display: none;
            }

            .tab-pinned-strip {
                display: flex;
                align-items: stretch;
                align-self: stretch;
                flex-shrink: 0;
                gap: 3px;
                margin-right: 6px;
                padding-right: 8px;
                border-right: 1px solid color-mix(in srgb, var(--primary-text) 14%, transparent);
                max-width: 45%;
            }

            .tab-item.tab-item-dragging {
                opacity: 0;
                pointer-events: none;
            }

            .tab-drag-ghost {
                position: fixed;
                z-index: 100000;
                pointer-events: none;
                box-sizing: border-box;
            }

            .tab-drag-ghost .tab-item {
                pointer-events: none;
                box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
            }

            .tab-item {
                display: grid;
                grid-template-columns: minmax(0, 1fr) auto;
                column-gap: 10px;
                padding: 8px 18px 0 18px;
                background: transparent;
                border: none;
                border-radius: 12px 12px 0 0;
                color: var(--secondary-text);
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                white-space: nowrap;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                min-width: 90px;
                margin-bottom: 0;
            }

            .tab-item.tab-item-pinned {
                align-self: stretch;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 0;
                width: 38px;
                max-width: 38px;
                flex: 0 0 38px;
                box-sizing: border-box;
                overflow: visible;
                padding: 8px 0 0 0;
                grid-template-columns: unset;
                column-gap: unset;
            }
            .tab-pinned-icon-wrap {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                pointer-events: none;
            }
            .tab-pinned-icon-svg {
                display: block;
                opacity: 0.92;
            }

            .tab-item:hover {
                background: color-mix(in srgb, var(--primary-text) 8%, transparent);
                color: var(--primary-text);
            }

            .tab-item.active {
                background: var(--saved-groups-bar-bg);
                color: var(--primary-text);
                z-index: 3;
                box-shadow: 0 -5px 15px -8px color-mix(in srgb, var(--tab-group-color, var(--link-accent)) 70%, transparent);
                position: relative;
                padding-bottom: 4px;
                margin-bottom: -4px;
            }

            .tab-item.active::before {
                content: '';
                position: absolute;
                inset: -2px -2px 2px -2px;
                padding: 2px;
                border-radius: 12px 12px 0 0;
                background: linear-gradient(135deg,
                    var(--tab-group-color, var(--loop-accent)),
                    var(--tab-group-color, var(--primary-text)),
                    var(--tab-group-color, var(--link-accent)));
                background-size: 200% 200%;
                animation: neonFlow 8s ease infinite;
                -webkit-mask: 
                    linear-gradient(#fff 0 0) content-box, 
                    linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                pointer-events: none;
                z-index: 4;
            }

            .tab-item.active::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 8px;
                background: var(--saved-groups-bar-bg);
                z-index: 5;
                pointer-events: none;
            }

            .tab-name {
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.25;
            }

            .tab-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                font-size: 10px;
                padding: 4px;
                margin-right: -6px;
                border-radius: 50%;
                opacity: 0.2;
                transition: all 0.2s;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
            }

            .tab-item:hover .tab-close {
                opacity: 0.6;
            }

            .tab-close:hover {
                opacity: 1 !important;
                background: rgba(255, 50, 50, 0.3);
                color: #ff5555;
                transform: scale(1.1);
            }

            .tab-add {
                align-self: flex-end;
                background: color-mix(in srgb, var(--primary-text) 6%, transparent);
                border: none;
                color: var(--secondary-text);
                width: 28px;
                height: 28px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background 0.2s;
                flex-shrink: 0;
                font-size: 18px;
                margin-bottom: 6px;
                margin-left: 4px;
            }

            .tab-add:hover {
                background: color-mix(in srgb, var(--primary-text) 14%, transparent);
                color: var(--primary-text);
            }

            /* Tooltip or animation for Switching */
            .tab-item.newly-added {
                animation: tabIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            @keyframes tabIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .tab-group-container {
                display: flex;
                align-items: flex-end;
                gap: 4px;
                margin: 0 4px;
                padding: 4px 4px 0 4px;
                border-radius: 12px 12px 0 0;
                position: relative;
                z-index: 1;
                border-bottom: 3px solid var(--tab-group-color);
                box-sizing: border-box;
                overflow: visible;
                min-width: 0;
            }

            .tab-group-container.tab-group-dragging {
                opacity: 0;
                pointer-events: none;
            }

            .tab-drag-ghost.tab-group-drag-ghost {
                z-index: 100001;
            }

            .tab-group-header {
                font-size: 11px;
                font-weight: 800;
                padding: 4px 10px;
                cursor: grab;
                border-radius: 8px;
                white-space: nowrap;
                user-select: none;
                margin-bottom: 6px;
                margin-right: 4px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: transform 0.1s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .tab-group-header:active {
                transform: scale(0.95);
            }
            .tab-group-inner {
                display: flex;
                align-items: stretch;
                gap: 4px;
                overflow: visible;
                min-width: 0;
            }
            
            .tab-context-menu {
                position: fixed;
                background: color-mix(in srgb, var(--editor-background) 92%, var(--primary-text));
                backdrop-filter: blur(10px);
                border: 1px solid color-mix(in srgb, var(--primary-text) 12%, transparent);
                border-radius: 10px;
                padding: 6px 0;
                min-width: 180px;
                z-index: 9999;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12), 0 10px 32px rgba(0, 0, 0, 0.18);
                backdrop-filter: blur(12px);
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }
            .tab-context-menu-wide {
                min-width: 260px;
            }
            .menu-saved-group-header {
                padding: 10px 14px 9px;
                font-size: 13px;
                font-weight: 800;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                border-bottom: 1px solid color-mix(in srgb, var(--primary-text) 10%, transparent);
                cursor: default;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .tab-context-menu-chrome {
                min-width: 288px;
                border-radius: 12px;
                padding: 0 0 6px 0;
            }
            .menu-chrome-name-block {
                padding: 12px 12px 8px;
            }
            .menu-chrome-name-input {
                width: 100%;
                box-sizing: border-box;
                padding: 8px 10px;
                border-radius: 6px;
                border: 1px solid var(--menu-group-color, var(--link-accent));
                background: color-mix(in srgb, var(--editor-background) 88%, var(--primary-text));
                color: var(--primary-text);
                font-size: 13px;
                outline: none;
                text-transform: uppercase;
                letter-spacing: 0.06em;
            }
            .menu-chrome-name-input:focus {
                border-color: var(--menu-group-color, var(--link-accent));
                box-shadow: 0 0 0 2px color-mix(in srgb, var(--menu-group-color, var(--link-accent)) 32%, transparent);
            }
            .menu-item {
                padding: 8px 16px;
                font-size: 13px;
                color: var(--secondary-text);
                cursor: pointer;
                white-space: nowrap;
                transition: background 0.1s, color 0.1s;
                font-weight: 500;
            }
            .menu-item-with-icon {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 9px 14px;
            }
            .menu-item-icon-wrap {
                flex-shrink: 0;
                width: 20px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: color-mix(in srgb, var(--secondary-text) 88%, var(--primary-text));
            }
            .menu-item-with-icon:hover .menu-item-icon-wrap {
                color: var(--inverted-text);
            }
            .menu-item-icon {
                display: block;
            }
            .menu-item-label {
                flex: 1;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .menu-item-shortcut {
                flex-shrink: 0;
                font-size: 11px;
                opacity: 0.55;
                font-weight: 400;
            }
            .menu-item:hover {
                background: var(--link-accent);
                color: var(--inverted-text);
            }
            .menu-separator {
                height: 1px;
                margin: 6px 0;
                background: color-mix(in srgb, var(--primary-text) 14%, transparent);
                pointer-events: none;
            }
            .menu-section-title {
                padding: 6px 16px 4px 16px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                color: color-mix(in srgb, var(--secondary-text) 92%, transparent);
                cursor: default;
            }
            .menu-tabs-section-header {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 14px 4px 14px;
                cursor: default;
                color: color-mix(in srgb, var(--secondary-text) 92%, transparent);
            }
            .menu-section-duration-label {
                min-width: 3.25em;
                flex-shrink: 0;
                text-align: right;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                opacity: 0.78;
            }
            .menu-tabs-section-title-text {
                flex: 1;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.06em;
            }
            .menu-item-duration-wrap {
                min-width: 3.25em;
                flex-shrink: 0;
                text-align: right;
                font-variant-numeric: tabular-nums;
            }
            .menu-item-duration {
                font-size: 12px;
                font-weight: 600;
                color: color-mix(in srgb, var(--secondary-text) 88%, var(--primary-text));
            }
            .menu-item-with-icon:hover .menu-item-duration {
                color: inherit;
            }
            .menu-tab-list {
                max-height: 220px;
                overflow-y: auto;
                padding-bottom: 4px;
            }
            .menu-item-tab {
                font-size: 12px;
            }
            .menu-item-muted {
                cursor: default;
                opacity: 0.72;
                font-size: 12px;
            }
            .menu-item-muted:hover {
                background: transparent;
                color: var(--secondary-text);
            }
            .color-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 6px;
                padding: 8px 16px;
                margin-bottom: 4px;
            }
            .color-grid-chrome {
                grid-template-columns: repeat(9, minmax(0, 1fr));
                gap: 4px;
                padding: 10px 12px 6px;
                margin-bottom: 0;
            }
            .color-swatch {
                width: 22px;
                height: 22px;
                border-radius: 50%;
                cursor: pointer;
                box-sizing: border-box;
                border: 2px solid transparent;
                transition: transform 0.1s;
            }
            .color-swatch:hover {
                transform: scale(1.15);
            }
            .color-swatch.selected {
                border-color: #fff;
                box-shadow: 0 0 0 1px rgba(0,0,0,0.5);
            }

            body.tab-position-bottom {
                flex-direction: column;
            }
            body.tab-position-bottom .bonebox-main-row {
                display: flex;
                flex-direction: column;
                flex: 1;
                min-height: 0;
                width: 100%;
            }
            body.tab-position-bottom .bonebox-editor-column {
                display: contents;
            }
            body.tab-position-bottom .bonebox-main-row > .bonebox-saved-groups-topbar {
                order: 0;
            }
            body.tab-position-bottom .bonebox-main-row > #beepboxEditorContainer {
                order: 1;
                flex: 1;
                min-height: 0;
            }
            body.tab-position-bottom .bonebox-main-row > .tab-manager-wrapper {
                order: 2;
                flex-shrink: 0;
            }

            body.tab-position-top .bonebox-main-row {
                display: flex;
                flex-direction: column;
                flex: 1;
                min-height: 0;
                width: 100%;
            }
            body.tab-position-top .bonebox-editor-column {
                display: contents;
            }
            body.tab-position-top .bonebox-main-row > .tab-manager-wrapper {
                order: 0;
                flex-shrink: 0;
            }
            body.tab-position-top .bonebox-main-row > .bonebox-saved-groups-topbar {
                order: 1;
            }
            body.tab-position-top .bonebox-main-row > #beepboxEditorContainer {
                order: 2;
                flex: 1;
                min-height: 0;
            }

            body.tab-position-left #beepboxEditorContainer,
            body.tab-position-right #beepboxEditorContainer {
                flex: 1;
                min-width: 0;
                min-height: 0;
            }
            body.tab-position-left .tab-manager-wrapper,
            body.tab-position-right .tab-manager-wrapper {
                --vertical-tab-strip-width: 52px;
                width: var(--vertical-tab-strip-width);
                min-width: var(--vertical-tab-strip-width);
                max-width: var(--vertical-tab-strip-width);
                height: 100%;
                min-height: 0;
                align-self: stretch;
                flex-shrink: 0;
                overflow: hidden;
                flex-direction: column;
            }
            body.tab-position-right .tab-manager-wrapper {
                order: 2;
            }
            body.tab-position-right .bonebox-editor-column {
                order: 1;
            }
            body.tab-position-left .tab-brand-row,
            body.tab-position-right .tab-brand-row {
                display: flex;
                order: 0;
                width: 100%;
                padding: 6px 4px 4px 4px;
                box-sizing: border-box;
                justify-content: center;
                align-items: center;
            }
            body.tab-position-left .tab-brand-row .tab-brand,
            body.tab-position-right .tab-brand-row .tab-brand {
                margin-bottom: 0;
                justify-content: center;
                width: 100%;
            }
            body.tab-position-left .tab-brand-row .tab-brand-text,
            body.tab-position-right .tab-brand-row .tab-brand-text {
                display: none !important;
            }
            body.tab-position-left .tab-brand-row .tab-brand-logo,
            body.tab-position-right .tab-brand-row .tab-brand-logo {
                margin-right: 0 !important;
                margin-left: 0 !important;
                display: block;
            }
            body.tab-position-left .tab-bar-container,
            body.tab-position-right .tab-bar-container {
                order: 2;
                flex-direction: column;
                align-items: stretch;
                flex: 1;
                min-height: 0;
                padding: 4px 2px 6px 2px;
            }
            body.tab-position-left .tabs-wrapper,
            body.tab-position-right .tabs-wrapper {
                flex-direction: column;
                flex: 1;
                min-height: 0;
                padding: 2px 2px 4px 2px;
            }
            body.tab-position-left .tabs-scroll,
            body.tab-position-right .tabs-scroll {
                flex-direction: column;
                overflow-x: hidden;
                overflow-y: auto;
                align-items: stretch;
                flex: 1;
                min-height: 0;
            }
            body.tab-position-left .tab-pinned-strip,
            body.tab-position-right .tab-pinned-strip {
                flex-direction: column;
                margin-right: 0;
                margin-bottom: 6px;
                padding-right: 0;
                padding-bottom: 6px;
                border-right: none;
                border-bottom: 1px solid color-mix(in srgb, var(--primary-text) 14%, transparent);
                max-width: none;
                max-height: 40%;
            }
            body.tab-position-left .tab-item,
            body.tab-position-right .tab-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                border-radius: 6px;
                min-width: 0;
                width: 100%;
                max-width: 100%;
                white-space: normal;
                margin-bottom: 2px;
                padding: 6px 2px 4px 2px;
                grid-template-columns: unset;
                column-gap: 0;
            }
            body.tab-position-left .tab-item .tab-name,
            body.tab-position-right .tab-item .tab-name {
                writing-mode: vertical-rl;
                text-orientation: mixed;
                max-width: none;
                max-height: 160px;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.2;
            }
            body.tab-position-left .tab-item .tab-close,
            body.tab-position-right .tab-item .tab-close {
                margin-right: 0;
                margin-top: 2px;
            }
            body.tab-position-left .tab-item.active::before,
            body.tab-position-right .tab-item.active::before {
                border-radius: 6px;
            }
            body.tab-position-left .tab-add,
            body.tab-position-right .tab-add {
                align-self: center;
                margin-bottom: 0;
                margin-top: 4px;
                width: 26px;
                height: 26px;
            }
            body.tab-position-left .tab-group-container {
                flex-direction: column;
                align-items: stretch;
                margin: 3px 0;
                border-bottom: none;
                border-left: 3px solid var(--tab-group-color);
                border-radius: 0 8px 8px 0;
                padding: 3px 2px 3px 4px;
            }
            body.tab-position-right .tab-group-container {
                flex-direction: column;
                align-items: stretch;
                margin: 3px 0;
                border-bottom: none;
                border-right: 3px solid var(--tab-group-color);
                border-radius: 8px 0 0 8px;
                padding: 3px 4px 3px 2px;
            }
            body.tab-position-left .tab-group-inner,
            body.tab-position-right .tab-group-inner {
                flex-direction: column;
            }
            body.tab-position-left .tab-group-header,
            body.tab-position-right .tab-group-header {
                margin-right: 0;
                margin-bottom: 4px;
                writing-mode: vertical-rl;
                text-orientation: mixed;
                align-self: center;
                max-height: 120px;
                padding: 4px 2px;
                font-size: 9px;
            }
        `);
        document.head.appendChild(style);
    }
}
