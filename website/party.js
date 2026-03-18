(function () {
  "use strict";

  // ── Config ─────────────────────────────────────────────────────────────────
  // ── Config ─────────────────────────────────────────────────────────────────
  const isLocal = window.location.hostname === "localhost" || window.location.protocol === "file:";
  
  // Use a public server if available (e.g. your hosted backend), otherwise fallback to localhost for devs.
  // Replace this URL with your real production server URL (e.g. https://bonebox-party.onrender.com)
  const PRODUCTION_SERVER = "https://bonebox-collab.onrender.com"; 
  const PARTY_SERVER = (isLocal || !PRODUCTION_SERVER) ? "http://localhost:3001" : PRODUCTION_SERVER;
  
  const DEBOUNCE_MS = 400; // ms to wait before broadcasting a song change

  // ── State ──────────────────────────────────────────────────────────────────
  let socket = null;
  let inParty = false;
  let roomCode = null;
  let myName = localStorage.getItem("party-name") || "Anonymous";
  let myColor = "#4ecdc4";
  let members = [];
  let isApplyingRemote = false;
  let broadcastTimer = null;
  let lastSentHash = "";
  let onUpdateCallback = null;

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
                background: #1e1e3a;
                border: 1px solid rgba(148, 100, 255, 0.4);
                color: #d0d0f0;
            }
            .bb-toast.success {
                background: #0d2b1e;
                border: 1px solid rgba(78, 205, 196, 0.4);
                color: #4ecdc4;
            }
            .bb-toast.error {
                background: #2b0d0d;
                border: 1px solid rgba(255, 107, 107, 0.4);
                color: #ff6b6b;
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
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity 0.3s"; }, duration);
    setTimeout(() => el.remove(), duration + 320);
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
      location.hash = hash;
      setTimeout(() => { isApplyingRemote = false; }, 200);
    }
  }

  function scheduleBroadcast() {
    if (!inParty || !socket) return;
    clearTimeout(broadcastTimer);
    broadcastTimer = setTimeout(() => {
      const hash = getCurrentHash();
      if (hash !== lastSentHash) {
        lastSentHash = hash;
        socket.emit("song-update", { hash });
      }
    }, DEBOUNCE_MS);
  }

  // ── Connect to server ──────────────────────────────────────────────────────
  function connectSocket() {
    socket = window.io(PARTY_SERVER, { transports: ["websocket", "polling"] });

    socket.on("connect", () => {
      console.log("[BoneBox Party] Connected to party server");
      triggerUpdate();
    });

    socket.on("disconnect", () => {
      if (inParty) {
        showToast("⚠️ Disconnected from party server", "error");
        inParty = false;
        members = [];
        roomCode = null;
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
      if (isApplyingRemote) return;
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
  window.addEventListener("hashchange", () => {
    if (!isApplyingRemote) {
      scheduleBroadcast();
    }
  });

  setInterval(() => {
    if (inParty && !isApplyingRemote) {
      const hash = getCurrentHash();
      if (hash !== lastSentHash) {
        scheduleBroadcast();
      }
    }
  }, 500);

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
      connected: !!(socket && socket.connected)
    }),
    onUpdate: (cb) => { onUpdateCallback = cb; }
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
