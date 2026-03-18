import { HTML } from "imperative-html/dist/esm/elements-strict";
import { ColorConfig } from "./ColorConfig.js";
import { ChangeSong, ChangeSongTitle } from "./changes.js";

const { div, span, button } = HTML;

export class TabManager {
    constructor(doc) {
        this.doc = doc;
        this.tabs = this._loadTabs();
        this.activeTabId = this._loadActiveTabId();
        this.renderedTabIds = new Set(this.tabs.map(t => t.id));
        
        this._injectStyles();
        this.container = div({ class: "tab-bar-container" });
        this._updateUI();
        
        // Listen for song changes to update titles
        this.doc.notifier.watch(this._onDocUpdate.bind(this));
        
        // Handle window closure to save the active tab's current hash
        window.addEventListener("beforeunload", () => {
            this._saveActiveTabHash();
        });

        // Setup the new project callback immediately so it's available if a prompt is restored from history
        this.doc.newProjectCallback = (settings) => this._handleNewProject(settings);
    }

    _loadTabs() {
        const saved = localStorage.getItem("bonebox_tabs");
        if (saved) {
            try {
                const tabs = JSON.parse(saved);
                if (Array.isArray(tabs) && tabs.length > 0) return tabs;
            } catch (e) {}
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

    _saveTabs() {
        localStorage.setItem("bonebox_tabs", JSON.stringify(this.tabs));
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

    _updateUI() {
        this.container.innerHTML = "";
        
        const brand = div({ class: "tab-brand" }, "BoneBox");
        const tabsWrapper = div({ class: "tabs-wrapper" });
        
        this.tabs.forEach(tab => {
            const isActive = tab.id === this.activeTabId;
            const isNew = !this.renderedTabIds.has(tab.id);
            const tabEl = div({ 
                class: `tab-item ${isActive ? "active" : ""} ${isNew ? "newly-added" : ""}`,
                onclick: () => this.switchTab(tab.id)
            }, [
                span({ class: "tab-name" }, tab.name),
                button({ 
                    class: "tab-close",
                    onclick: (e) => this.closeTab(tab.id, e),
                    title: "Close Tab"
                }, "✕")
            ]);
            tabsWrapper.appendChild(tabEl);
            if (isNew) this.renderedTabIds.add(tab.id);
        });
        
        const addBtn = button({ 
            class: "tab-add",
            onclick: () => this.addTab(),
            title: "New Project"
        }, "+");
        
        this.container.appendChild(brand);
        this.container.appendChild(tabsWrapper);
        this.container.appendChild(addBtn);
    }

    _injectStyles() {
        const style = HTML.style({ type: "text/css" }, `
            .tab-bar-container {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 10px 24px 0 24px;
                width: 100%;
                box-sizing: border-box;
                background: rgba(10, 10, 20, 0.85);
                backdrop-filter: blur(10px);
                user-select: none;
                flex-shrink: 0;
                position: relative;
                z-index: 10;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }

            .tab-brand {
                font-weight: 900;
                font-size: 15px;
                letter-spacing: 1.5px;
                color: var(--link-accent, #98f);
                text-transform: uppercase;
                margin-bottom: 2px;
                background: linear-gradient(135deg, var(--link-accent, #98f), #fff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 0 5px rgba(152, 119, 255, 0.3));
            }

            .tabs-wrapper {
                display: flex;
                gap: 4px;
                overflow-x: auto;
                scrollbar-width: none;
                flex-grow: 1;
            }
            .tabs-wrapper::-webkit-scrollbar {
                display: none;
            }

            .tab-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 18px;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-bottom: none;
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
                margin-bottom: -1px;
            }

            .tab-item:hover {
                background: rgba(255, 255, 255, 0.06);
                color: var(--primary-text, #fff);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .tab-item.active {
                background: var(--editor-background, #050510);
                border-color: rgba(255, 255, 255, 0.25);
                color: var(--primary-text, #fff);
                z-index: 1;
                box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.3);
            }

            .tab-item.active::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, var(--link-accent, #98f), #fff);
                border-radius: 12px 12px 0 0;
                box-shadow: 0 0 10px var(--link-accent, #98f);
            }

            .tab-item.active::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--editor-background, #050510);
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
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: var(--secondary-text, #999);
                width: 34px;
                height: 34px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                flex-shrink: 0;
                font-size: 22px;
                margin-bottom: 4px;
            }

            .tab-add:hover {
                background: var(--link-accent, #98f);
                border-color: var(--link-accent, #98f);
                color: #fff;
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 6px 16px rgba(152, 119, 255, 0.4);
            }

            /* Tooltip or animation for Switching */
            .tab-item.newly-added {
                animation: tabIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            @keyframes tabIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `);
        document.head.appendChild(style);
    }
}
