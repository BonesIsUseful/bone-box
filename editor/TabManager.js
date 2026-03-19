import { HTML, SVG } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig.js";
import { ChangeSong, ChangeSongTitle } from "./changes.js";

const { div, span, button, img } = HTML;

export class TabManager {
    constructor(doc) {
        this.doc = doc;
        this.tabs = this._loadTabs();
        this.tabGroups = this._loadTabGroups();
        this.activeTabId = this._loadActiveTabId();
        this.renderedTabIds = new Set(this.tabs.map(t => t.id));

        this._injectStyles();
        this.container = div({ class: "tab-manager-wrapper" });
        this.tabBar = div({
            class: "tab-bar-container",
            ondragover: (e) => this._handleDragOver(e),
            ondrop: (e) => this._handleWrapperDrop(e)
        });
        this.savedGroupsBar = div({ class: "saved-groups-bar" });
        this.container.appendChild(this.tabBar);
        this.container.appendChild(this.savedGroupsBar);

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
    }

    _loadTabs() {
        const saved = localStorage.getItem("bonebox_tabs");
        if (saved) {
            try {
                const tabs = JSON.parse(saved);
                if (Array.isArray(tabs) && tabs.length > 0) return tabs;
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

    _showContextMenu(tab, x, y) {
        if (this._contextMenu) this._contextMenu.remove();

        const menu = div({ class: "tab-context-menu" });

        const newGroup = div({ class: "menu-item" }, "Add to New Group");
        newGroup.onclick = () => {
            const name = window.prompt("New group name:");
            if (name) {
                const groupId = Date.now().toString();
                // Select a random preset color
                const presetColors = ["#dadce0", "#8ab4f8", "#f28b82", "#fde293", "#81c995", "#ff8bcb", "#c58af9", "#78d9ec", "#fcad70"];
                const color = presetColors[Math.floor(Math.random() * presetColors.length)];
                this.tabGroups.push({ id: groupId, name, color, collapsed: false, saved: false });
                tab.groupId = groupId;

                this._saveAll();
                this._updateUI();
            }
            menu.remove();
        };
        menu.appendChild(newGroup);

        if (tab.groupId) {
            const removeGroup = div({ class: "menu-item" }, "Remove from Group");
            removeGroup.onclick = () => {
                tab.groupId = null;
                this._saveAll();
                this._updateUI();
                menu.remove();
            }
            menu.appendChild(removeGroup);
        }

        this.tabGroups.forEach(g => {
            if (g.id !== tab.groupId) {
                const addToG = div({ class: "menu-item" }, `Add to ${g.name}`);
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

        const closeMenu = () => {
            if (this._contextMenu) this._contextMenu.remove();
            document.removeEventListener("click", closeMenu);
        };
        setTimeout(() => document.addEventListener("click", closeMenu), 0);
    }

    _showGroupContextMenu(group, x, y) {
        if (this._contextMenu) this._contextMenu.remove();

        const menu = div({ class: "tab-context-menu" });

        const renameGroup = div({ class: "menu-item" }, "Rename Group");
        renameGroup.onclick = () => {
            const name = window.prompt("Rename group:", group.name);
            if (name) {
                group.name = name;
                this._saveTabGroups();
                this._updateUI();
            }
            menu.remove();
        };

        const colorGrid = div({ class: "color-grid" });
        const presetColors = ["#dadce0", "#8ab4f8", "#f28b82", "#fde293", "#81c995", "#ff8bcb", "#c58af9", "#78d9ec", "#fcad70"];
        presetColors.forEach(c => {
            const swatch = div({ class: "color-swatch", style: `background: ${c};` });
            if (group.color === c) swatch.classList.add("selected");
            swatch.onclick = (e) => {
                group.color = c;
                this._saveTabGroups();
                this._updateUI();
                e.stopPropagation();
            };
            colorGrid.appendChild(swatch);
        });
        menu.appendChild(colorGrid);

        const toggleSaveGroup = div({ class: "menu-item" }, group.saved ? "Unsave Group" : "Save Group");
        toggleSaveGroup.onclick = () => {
            group.saved = !group.saved;
            this._saveTabGroups();
            this._updateUI();
            menu.remove();
        };

        const ungroupGroup = div({ class: "menu-item" }, "Ungroup");
        ungroupGroup.onclick = () => {
            this.tabs.forEach(t => {
                if (t.groupId === group.id) t.groupId = null;
            });
            this._saveAll();
            this._updateUI();
            menu.remove();
        };

        const closeGroupTabs = () => {
            if (group.saved) {
                // Save the tabs that belong to this group before closing them
                // We make a deep copy so we can cleanly restore them
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
            menu.remove();
        };

        const closeGroup = div({ class: "menu-item" }, group.saved ? "Hide Group" : "Close Group");
        closeGroup.onclick = () => {
            closeGroupTabs();
        };

        const deleteGroup = div({ class: "menu-item" }, "Delete Group");
        deleteGroup.onclick = () => {
            group.saved = false;
            group.savedTabs = [];
            this.tabGroups = this.tabGroups.filter(g => g.id !== group.id);
            closeGroupTabs();
        };

        menu.appendChild(toggleSaveGroup);
        menu.appendChild(ungroupGroup);
        menu.appendChild(closeGroup);
        menu.appendChild(deleteGroup);

        menu.style.left = x + "px";
        menu.style.top = y + "px";
        document.body.appendChild(menu);
        this._contextMenu = menu;

        const closeMenu = (e) => {
            if (this._contextMenu) this._contextMenu.remove();
            document.removeEventListener("click", closeMenu);
        };
        setTimeout(() => document.addEventListener("click", closeMenu), 0);
    }

    _handleDragStart(e, tabId) {
        e.dataTransfer.setData("text/plain", tabId);
        e.dataTransfer.effectAllowed = "move";
        e.target.style.opacity = "0.5";
    }

    _handleDragEnd(e) {
        e.target.style.opacity = "1";
    }

    _handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    _handleDrop(e, targetId) {
        e.preventDefault();
        e.stopPropagation();

        if (this._handleLinkDrop(e)) return;

        const data = e.dataTransfer.getData("text/plain");
        const draggedId = Number(data);
        if (!draggedId || draggedId === targetId) return;

        const draggedIndex = this.tabs.findIndex(t => t.id === draggedId);
        const targetIndex = this.tabs.findIndex(t => t.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const draggedTab = this.tabs[draggedIndex];
        const targetTab = this.tabs[targetIndex];

        // Assign same group as the target
        draggedTab.groupId = targetTab.groupId;

        let insertAfter = false;
        const tabItem = e.target.closest('.tab-item');
        if (tabItem) {
            const rect = tabItem.getBoundingClientRect();
            if (e.clientX > rect.left + rect.width / 2) {
                insertAfter = true;
            }
        }

        // Reorder
        this.tabs.splice(draggedIndex, 1);
        let newTargetIndex = this.tabs.findIndex(t => t.id === targetId);

        if (insertAfter) {
            newTargetIndex++;
        }

        this.tabs.splice(newTargetIndex, 0, draggedTab);

        this._saveAll();
        this._updateUI();
    }

    _handleDropOnGroupHeader(e, group) {
        e.preventDefault();
        e.stopPropagation();
        const draggedId = Number(e.dataTransfer.getData("text/plain"));
        if (!draggedId) return;

        const draggedIndex = this.tabs.findIndex(t => t.id === draggedId);
        if (draggedIndex === -1) return;

        const draggedTab = this.tabs[draggedIndex];
        draggedTab.groupId = group.id;

        // Move to the first position in that group
        this.tabs.splice(draggedIndex, 1);
        const firstGroupTabIndex = this.tabs.findIndex(t => t.groupId === group.id);

        if (firstGroupTabIndex !== -1) {
            this.tabs.splice(firstGroupTabIndex, 0, draggedTab);
        } else {
            // Group had no tabs
            this.tabs.push(draggedTab);
        }

        this._saveAll();
        this._updateUI();
    }

    _handleWrapperDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this._handleLinkDrop(e)) return;

        if (!e.target.classList.contains("tabs-wrapper")) return;

        const data = e.dataTransfer.getData("text/plain");
        const draggedId = Number(data);
        if (!draggedId) return;

        const draggedIndex = this.tabs.findIndex(t => t.id === draggedId);
        if (draggedIndex === -1) return;

        const draggedTab = this.tabs[draggedIndex];

        // Drop on the wrapper directly means "move to end and ungroup"
        draggedTab.groupId = null;
        this.tabs.splice(draggedIndex, 1);
        this.tabs.push(draggedTab);

        this._saveAll();
        this._updateUI();
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
                const badge = div({ class: "saved-group-badge", style: `color: ${g.color}; border: 1px solid ${g.color};` }, g.name);
                badge.onclick = () => {
                    const firstTab = this.tabs.find(t => t.groupId === g.id);
                    if (firstTab) {
                        // Already open, jump to the first tab
                        this.switchTab(firstTab.id);
                    } else if (g.savedTabs && g.savedTabs.length > 0) {
                        // Restore previously hidden tabs
                        // Refresh their IDs to avoid potential collisions
                        g.savedTabs.forEach(t => {
                            t.id = Date.now() + Math.random();
                            this.tabs.push(t);
                        });
                        g.savedTabs = []; // clear cache
                        this._saveAll();
                        const restoredTab = this.tabs.find(t => t.groupId === g.id);
                        if (restoredTab) this.switchTab(restoredTab.id);
                        this._updateUI();
                    } else {
                        // Open entirely new tab in group
                        const newTab = { id: Date.now(), name: "Unnamed", hash: "", groupId: g.id };
                        this.tabs.push(newTab);
                        this._saveTabs();
                        this.switchTab(newTab.id);
                    }
                };
                badge.oncontextmenu = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this._showGroupContextMenu(g, e.clientX, e.clientY);
                };
                this.savedGroupsBar.appendChild(badge);
            });
        } else {
            this.savedGroupsBar.style.display = "none";
        }

        const brand = div({ class: "tab-brand", style: "display: flex; align-items: center;" }, [
            img({ src: "./website/icon_32.png", width: "22", height: "22", style: "margin-right: 8px;" }),
            span({ style: "margin-bottom: -2px;" }, "BoneBox")
        ]);
        const tabsWrapper = div({
            class: "tabs-wrapper",
            ondragover: (e) => this._handleDragOver(e),
            ondrop: (e) => this._handleWrapperDrop(e)
        });

        let currentGroupId = null;
        let currentGroupContainer = null;

        this.tabs.forEach(tab => {
            const isActive = tab.id === this.activeTabId;
            const isNew = !this.renderedTabIds.has(tab.id);
            const tabEl = div({
                class: `tab-item ${isActive ? "active" : ""} ${isNew ? "newly-added" : ""}`,
                draggable: "true",
                ondragstart: (e) => this._handleDragStart(e, tab.id),
                ondragend: (e) => this._handleDragEnd(e),
                ondragover: (e) => this._handleDragOver(e),
                ondrop: (e) => this._handleDrop(e, tab.id),
                onclick: () => this.switchTab(tab.id),
                oncontextmenu: (e) => {
                    e.preventDefault();
                    this._showContextMenu(tab, e.clientX, e.clientY);
                }
            }, [
                span({ class: "tab-name" }, tab.name),
                button({
                    class: "tab-close",
                    onclick: (e) => this.closeTab(tab.id, e),
                    title: "Close Tab"
                }, "✕")
            ]);

            if (tab.groupId) {
                const group = this.tabGroups.find(g => g.id === tab.groupId);
                if (group) {
                    if (currentGroupId !== tab.groupId) {
                        currentGroupId = tab.groupId;
                        const groupHeader = div({
                            class: "tab-group-header",
                            style: `background-color: ${group.color}; color: #000;`,
                            ondragover: (e) => this._handleDragOver(e),
                            ondrop: (e) => this._handleDropOnGroupHeader(e, group),
                            oncontextmenu: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this._showGroupContextMenu(group, e.clientX, e.clientY);
                            }
                        }, group.name);

                        groupHeader.onclick = () => {
                            group.collapsed = !group.collapsed;
                            this._saveTabGroups();
                            this._updateUI();
                        };

                        const groupContainerInner = div({ class: "tab-group-inner", style: `${group.collapsed ? 'display: none;' : ''}` });

                        currentGroupContainer = div({ class: "tab-group-container", style: `border: 2px solid ${group.color}; border-bottom: none;` }, [
                            groupHeader,
                            groupContainerInner
                        ]);
                        tabsWrapper.appendChild(currentGroupContainer);
                    }
                    if (currentGroupContainer) {
                        currentGroupContainer.querySelector(".tab-group-inner").appendChild(tabEl);
                    }
                } else {
                    currentGroupId = null;
                    currentGroupContainer = null;
                    tabsWrapper.appendChild(tabEl);
                }
            } else {
                currentGroupId = null;
                currentGroupContainer = null;
                tabsWrapper.appendChild(tabEl);
            }

            if (isNew) this.renderedTabIds.add(tab.id);
        });

        const addBtn = button({
            class: "tab-add",
            onclick: () => this.addTab(),
            title: "New Project"
        }, "+");

        tabsWrapper.appendChild(addBtn);

        this.tabBar.appendChild(brand);
        this.tabBar.appendChild(tabsWrapper);
    }

    _injectStyles() {
        const style = HTML.style({ type: "text/css" }, `
            @keyframes neonFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            .tab-manager-wrapper {
                display: flex;
                flex-direction: column;
                width: 100%;
                flex-shrink: 0;
                z-index: 10;
                background: var(--editor-background, #050510);
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
                min-height: 48px;
            }

            .tab-bar-container::after {
                content: '';
                position: absolute;
                bottom: 4px;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, var(--link-accent, #98f), #fff, var(--link-accent, #98f));
                background-size: 200% 100%;
                animation: neonFlow 8s ease infinite;
                box-shadow: 0 5px 15px -8px var(--link-accent, #98f);
                z-index: 0;
                pointer-events: none;
            }

            .saved-groups-bar {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px 24px;
                width: 100%;
                box-sizing: border-box;
                background: rgba(0, 0, 0, 0.2);
                min-height: 28px;
                flex-wrap: wrap;
                border-top: none;
            }

            .saved-group-badge {
                font-size: 11px;
                font-weight: bold;
                padding: 2px 8px;
                border-radius: 12px;
                cursor: pointer;
                user-select: none;
                background: rgba(255, 255, 255, 0.05);
                transition: background 0.1s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .saved-group-badge:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .tab-brand {
                font-weight: 900;
                font-size: 14px;
                letter-spacing: 2px;
                color: var(--link-accent, #98f);
                text-transform: uppercase;
                margin-bottom: 8px;
                background: linear-gradient(135deg, var(--link-accent, #98f), #fff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 0 8px rgba(153, 136, 255, 0.4));
                cursor: default;
                display: flex;
                align-items: center;
            }

            .tabs-wrapper {
                display: flex;
                align-items: flex-end;
                gap: 4px;
                overflow-x: auto;
                scrollbar-width: none;
                flex-grow: 1;
                padding: 4px 12px;
                z-index: 1;
            }
            .tabs-wrapper::-webkit-scrollbar {
                display: none;
            }

            .tab-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 18px;
                background: transparent;
                border: none;
                border-radius: 12px 12px 0 0;
                color: var(--secondary-text, #999);
                cursor: pointer;
                font-size: 13px;
                font-weight: 600;
                white-space: nowrap;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                min-width: 90px;
                justify-content: space-between;
                margin-bottom: -2px;
            }

            .tab-item:hover {
                background: rgba(255, 255, 255, 0.06);
                color: var(--primary-text, #fff);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .tab-item.active {
                background: var(--editor-background, #050510);
                color: var(--primary-text, #fff);
                z-index: 2;
                box-shadow: 0 -5px 15px -8px var(--link-accent, #98f);
                position: relative;
            }

            .tab-item.active::before {
                content: '';
                position: absolute;
                inset: -2px -2px 2px -2px;
                padding: 2px;
                border-radius: 12px 12px 0 0;
                background: linear-gradient(135deg, var(--link-accent, #98f), #fff, var(--link-accent, #98f));
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
                bottom: 0px;
                left: 0px;
                right: 0px;
                height: 4px;
                background: var(--editor-background, #050510);
                z-index: 5;
                pointer-events: none;
            }

            .tab-name {
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
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
                background: rgba(255, 255, 255, 0.05);
                border: none;
                color: var(--secondary-text, #999);
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
                background: rgba(255, 255, 255, 0.15);
                color: #fff;
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
                background: rgba(255, 255, 255, 0.02);
                position: relative;
                z-index: 1;
            }
            .tab-group-container::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: -2px;
                right: -2px;
                height: 2px;
                background: var(--editor-background, #050510);
                z-index: 10;
                pointer-events: none;
            }
            .tab-group-header {
                font-size: 11px;
                font-weight: 800;
                padding: 4px 10px;
                cursor: pointer;
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
                gap: 4px;
            }
            
            .tab-context-menu {
                position: fixed;
                background: rgba(15, 15, 25, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 6px 0;
                min-width: 160px;
                z-index: 9999;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(12px);
                font-family: system-ui, -apple-system, sans-serif;
            }
            .menu-item {
                padding: 8px 16px;
                font-size: 13px;
                color: #ddd;
                cursor: pointer;
                white-space: nowrap;
                transition: background 0.1s, color 0.1s;
                font-weight: 500;
            }
            .menu-item:hover {
                background: var(--link-accent, #98f);
                color: #fff;
            }
            .color-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 6px;
                padding: 8px 16px;
                margin-bottom: 4px;
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
        `);
        document.head.appendChild(style);
    }
}
