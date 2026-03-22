(function () {
  "use strict";

  // ── Config ─────────────────────────────────────────────────────────────────
  // ── Config ─────────────────────────────────────────────────────────────────
  const isLocal = window.location.hostname === "localhost" || window.location.protocol === "file:";
  
  // Use a public server if available (e.g. your hosted backend), otherwise fallback to localhost for devs.
  // Replace this URL with your real production server URL (e.g. https://bonebox-party.onrender.com)
  const PRODUCTION_SERVER = "https://bonebox-collab.onrender.com"; 
  const PARTY_SERVER = PRODUCTION_SERVER || "http://localhost:3001";
  
  const DEBOUNCE_MS = 5000; // 5 seconds to wait before broadcasting a song change

  // ── State ──────────────────────────────────────────────────────────────────
  let socket = null;
  let inParty = false;
  let roomCode = null;
  let myName = localStorage.getItem("party-name") || "Anonymous";
  let myColor = "#4ecdc4";
  let mySocketId = null;
  let members = [];
  let isApplyingRemote = false;
  let broadcastTimer = null;
  let lastSentHash = "";
  let lastHashBeforeRemote = "";
  let onUpdateCallback = null;
  let ignoreNextHashChange = false;

  // ── Wait for Socket.io client to load, then boot ───────────────────────────
  function waitForSocketIO(cb) {
    if (window.io) { cb(); return; }
    
    // In production (GitHub Pages), skip trying localhost if no prod server is set
    if (!isLocal && !PRODUCTION_SERVER) {
       console.log("[BoneBox Party] Collaboration disabled (no production server set).");
       return;
    }

    const script = document.createElement("script");
    script.src = PARTY_SERVER + "/socket.io/socket.io.js";
    script.onload = cb;
    script.onerror = () => {
      console.warn("[BoneBox Party] Could not load Socket.IO client from " + PARTY_SERVER);
      showToast("⚠️ Could not reach party server.", "error");
    };
    document.head.appendChild(script);
  }

  // ── DOM: inject styles (Only for Toast now) ────────────────────────────────
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
            /* ── Toast ── */
            #bb-toast-container {
                position: fixed;
                bottom: 18px;
                right: 18px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 8px;
                pointer-events: none;
            }
            .bb-toast {
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 12px;
                font-family: 'Segoe UI', system-ui, sans-serif;
                font-weight: 600;
                max-width: 260px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                animation: toast-in 0.25s ease;
                pointer-events: none;
                letter-spacing: 0.2px;
            }
            .bb-toast.info {
                background: color-mix(in srgb, var(--ui-widget-background, #444) 90%, transparent);
                border: 1px solid color-mix(in srgb, var(--link-accent, #98f) 40%, transparent);
                color: var(--primary-text, #fff);
            }
            .bb-toast.success {
                background: color-mix(in srgb, var(--ui-widget-background, #444) 90%, transparent);
                border: 1px solid color-mix(in srgb, var(--pitch1-secondary-channel, #4ecdc4) 40%, transparent);
                color: var(--pitch1-secondary-channel, #4ecdc4);
            }
            .bb-toast.error {
                background: color-mix(in srgb, var(--ui-widget-background, #444) 90%, transparent);
                border: 1px solid rgba(255, 107, 107, 0.4);
                color: #ff6b6b;
            }
            .bb-toast.update {
                background: color-mix(in srgb, var(--ui-widget-background, #444) 90%, transparent);
                border: 2px solid var(--pitch1-secondary-channel, #4ecdc4);
                color: var(--primary-text, #fff);
                pointer-events: auto;
                cursor: pointer;
            }
            @keyframes toast-in {
                from { opacity: 0; transform: translateY(10px) scale(0.95); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
            }
        `;
    document.head.appendChild(style);
  }

  // ── DOM: inject the toast container ────────────────────────────────────────
  function injectHTML() {
    // Toast container
    const tc = document.createElement("div");
    tc.id = "bb-toast-container";
    document.body.appendChild(tc);
  }

  // ── Toast helper ───────────────────────────────────────────────────────────
  function showToast(msg, type = "info", duration = 3000) {
    const container = document.getElementById("bb-toast-container");
    if (!container) return;
    const el = document.createElement("div");
    el.className = `bb-toast ${type}`;
    el.textContent = msg;
    
    // If it's an update, make it clickable and prominent
    if (type === "update") {
      el.title = "Click to update now";
      el.addEventListener("click", () => {
        if (confirm("Would you like to restart BoneBox to finish the update?")) {
          window.location.reload(true);
        }
      });
    }

    container.appendChild(el);
    setTimeout(() => { if(el.parentNode) { el.style.opacity = "0"; el.style.transition = "opacity 0.3s"; } }, duration);
    setTimeout(() => { if(el.parentNode) el.remove(); }, duration + 320);
  }

  function triggerUpdate() {
    if (onUpdateCallback) onUpdateCallback();
  }

  // ── Song sync ──────────────────────────────────────────────────────────────
  function getCurrentHash() {
    return location.hash;
  }

  function applyRemoteHash(hash) {
    if (hash && hash !== getCurrentHash()) {
      isApplyingRemote = true;
      lastHashBeforeRemote = getCurrentHash();
      location.hash = hash;
      // Longer timeout to ensure the hash change is fully processed
      setTimeout(() => { 
        isApplyingRemote = false; 
      }, 500);
    }
  }

  function scheduleBroadcast() {
    if (!inParty || !socket) return;
    clearTimeout(broadcastTimer);
    broadcastTimer = setTimeout(() => {
      const hash = getCurrentHash();
      if (hash !== lastSentHash && !isApplyingRemote) {
        console.log("[BoneBox Party] Broadcasting song update");
        lastSentHash = hash;
        socket.emit("song-update", { hash });
      }
    }, DEBOUNCE_MS);
  }
  
  // Check if hash change is likely client-side only (navigation, playback, view changes)
  function isClientSideOnlyChange(oldHash, newHash) {
    if (!oldHash || !newHash) return false;
    
    // Remove the # prefix
    const oldData = oldHash.replace(/^#/, '');
    const newData = newHash.replace(/^#/, '');
    
    // If either is empty, it's a significant change
    if (!oldData || !newData) return false;
    
    // These patterns indicate client-side only changes that shouldn't trigger sync
    // BeepBox/JummBox uses specific parameter prefixes for these
    // Examples: playback position, view state, scroll position
    
    // For now, we'll use a simple heuristic: if the hash changed but it's within
    // a very short time (less than debounce), it's likely rapid edits or navigation
    // The debounce timer will handle this, but we can add more sophisticated checks here
    
    return false; // Let debounce handle filtering for now
  }

  // ── Connect to server ──────────────────────────────────────────────────────
  function connectSocket() {
    socket = window.io(PARTY_SERVER, { transports: ["websocket", "polling"] });

    socket.on("connect", () => {
      console.log("[BoneBox Party] Connected to party server");
      mySocketId = socket.id;
      triggerUpdate();
    });

    socket.on("disconnect", () => {
      if (inParty) {
        showToast("⚠️ Disconnected from party server", "error");
        inParty = false;
        members = [];
        roomCode = null;
        mySocketId = null;
        triggerUpdate();
      }
    });

    socket.on("member-joined", (data) => {
      members = data.members;
      showToast(`🎵 ${data.name} joined the party!`, "success");
      triggerUpdate();
    });

    socket.on("member-left", (data) => {
      members = data.members;
      showToast(`${data.name} left the party`, "info");
      triggerUpdate();
    });

    socket.on("song-updated", (data) => {
      // Ignore updates from ourselves
      if (data.socketId && data.socketId === mySocketId) {
        console.log("[BoneBox Party] Ignoring our own update");
        return;
      }
      
      if (isApplyingRemote) {
        console.log("[BoneBox Party] Already applying remote update, skipping");
        return;
      }
      
      console.log("[BoneBox Party] Applying remote song update");
      applyRemoteHash(data.hash);
      triggerUpdate();
    });
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  function createRoom(name) {
    if (!socket) return;
    myName = name || myName;
    localStorage.setItem("party-name", myName);

    socket.emit("create-room", { name: myName }, (res) => {
      if (!res.success) {
        showToast("Failed to create room", "error");
        return;
      }

      inParty = true;
      roomCode = res.code;
      myColor = res.color;
      members = res.members;

      lastSentHash = getCurrentHash();
      socket.emit("song-update", { hash: lastSentHash });

      showToast(`🎉 Room ${roomCode} created!`, "success", 4000);
      triggerUpdate();
    });
  }

  function joinRoom(code, name) {
    if (!socket) return;
    myName = name || myName;
    localStorage.setItem("party-name", myName);
    const cleanCode = code.trim().toUpperCase();

    socket.emit("join-room", { code: cleanCode, name: myName }, (res) => {
      if (!res.success) {
        showToast(`❌ ${res.error}`, "error");
        return;
      }

      inParty = true;
      roomCode = cleanCode;
      myColor = res.color;
      members = res.members;

      if (res.songHash) {
        applyRemoteHash(res.songHash);
        lastSentHash = res.songHash;
      }

      showToast(`🎵 Joined room ${roomCode}!`, "success");
      triggerUpdate();
    });
  }

  function leaveRoom() {
    if (!inParty || !socket) return;
    socket.emit("leave-room");
    inParty = false;
    members = [];
    roomCode = null;
    showToast("Left the party", "info");
    triggerUpdate();
  }

  // ── Event Watchers ─────────────────────────────────────────────────────────
  let lastLocalHash = getCurrentHash();
  
  window.addEventListener("hashchange", () => {
    const currentHash = getCurrentHash();
    
    // Don't broadcast if we're applying a remote update
    if (isApplyingRemote) {
      console.log("[BoneBox Party] Hash changed due to remote update, not broadcasting");
      lastLocalHash = currentHash;
      return;
    }
    
    // Don't broadcast if this is the same as what we just sent
    if (currentHash === lastSentHash) {
      console.log("[BoneBox Party] Hash matches last sent, not broadcasting");
      lastLocalHash = currentHash;
      return;
    }
    
    console.log("[BoneBox Party] Local hash change detected, scheduling broadcast");
    lastLocalHash = currentHash;
    scheduleBroadcast();
  });

  // Removed the aggressive setInterval polling - debounced hashchange is sufficient

  // ── Public API ─────────────────────────────────────────────────────────────
  window.boneboxParty = {
    create: (name) => createRoom(name),
    join: (code, name) => joinRoom(code, name),
    leave: () => leaveRoom(),
    getState: () => ({
      inParty,
      roomCode,
      members,
      myName,
      myColor,
      mySocketId,
      connected: !!(socket && socket.connected)
    }),
    onUpdate: (cb) => { onUpdateCallback = cb; },
    showToast: (msg, type, duration) => showToast(msg, type, duration)
  };

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  injectStyles();
  injectHTML();
  waitForSocketIO(() => {
    connectSocket();
    
    // Check for party code in URL
    const params = new URLSearchParams(window.location.search);
    const partyCode = params.get("party");
    if (partyCode && partyCode.length >= 4) {
      setTimeout(() => {
        joinRoom(partyCode);
        // Clear param after joining
        const newUrl = window.location.origin + window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      }, 1000);
    }
  });

  console.log("[BoneBox Party] API Ready");

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }
})();
