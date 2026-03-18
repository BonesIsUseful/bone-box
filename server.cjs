const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// rooms: Map<roomCode, { songHash: string, members: Map<socketId, MemberInfo> }>
const rooms = new Map();

// ── Helpers ────────────────────────────────────────────────────────────────────

const MEMBER_COLORS = [
    "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4",
    "#ffeaa7", "#dda0dd", "#98d8c8", "#f7dc6f",
    "#bb8fce", "#82e0aa", "#f0a500", "#c0392b",
];

function pickColor(room) {
    const used = new Set([...room.members.values()].map((m) => m.color));
    return MEMBER_COLORS.find((c) => !used.has(c)) ?? MEMBER_COLORS[0];
}

function generateRoomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

function roomSnapshot(room) {
    return [...room.members.values()].map(({ name, color }) => ({ name, color }));
}

// ── Socket events ──────────────────────────────────────────────────────────────

io.on("connection", (socket) => {
    let currentRoom = null;
    let memberName = "Anonymous";
    let memberColor = MEMBER_COLORS[0];

    // ── Create a new party room ──────────────────────────────────────────────
    socket.on("create-room", ({ name }, callback) => {
        memberName = (name || "Anonymous").trim().slice(0, 24);

        // Generate a unique 6-char code
        let code;
        do {
            code = generateRoomCode();
        } while (rooms.has(code));

        memberColor = MEMBER_COLORS[0];
        currentRoom = code;

        rooms.set(code, {
            songHash: "",
            members: new Map([[socket.id, { name: memberName, color: memberColor }]]),
        });

        socket.join(code);

        console.log(`[+] Room ${code} created by "${memberName}"`);

        callback({
            success: true,
            code,
            color: memberColor,
            members: roomSnapshot(rooms.get(code)),
        });
    });

    // ── Join an existing party room ──────────────────────────────────────────
    socket.on("join-room", ({ code, name }, callback) => {
        const normalCode = (code || "").trim().toUpperCase();
        const room = rooms.get(normalCode);

        if (!room) {
            callback({ success: false, error: "Room not found. Check the code and try again." });
            return;
        }

        memberName = (name || "Anonymous").trim().slice(0, 24);
        memberColor = pickColor(room);
        currentRoom = normalCode;

        room.members.set(socket.id, { name: memberName, color: memberColor });
        socket.join(normalCode);

        console.log(`[~] "${memberName}" joined room ${normalCode}`);

        // Tell the new joiner the current song state + member list
        callback({
            success: true,
            songHash: room.songHash,
            color: memberColor,
            members: roomSnapshot(room),
        });

        // Tell everyone else someone joined
        socket.to(normalCode).emit("member-joined", {
            name: memberName,
            color: memberColor,
            members: roomSnapshot(room),
        });
    });

    // ── Broadcast a song change to the room ──────────────────────────────────
    socket.on("song-update", ({ hash }) => {
        if (!currentRoom) return;
        const room = rooms.get(currentRoom);
        if (!room) return;

        room.songHash = hash;

        // Broadcast to everyone EXCEPT the sender
        socket.to(currentRoom).emit("song-updated", {
            hash,
            from: memberName,
            color: memberColor,
        });
    });

    // ── Leave room (explicit) ────────────────────────────────────────────────
    socket.on("leave-room", () => {
        handleLeave();
    });

    // ── Disconnect (tab closed, network dropped, etc.) ───────────────────────
    socket.on("disconnect", () => {
        handleLeave();
    });

    function handleLeave() {
        if (!currentRoom) return;
        const room = rooms.get(currentRoom);
        if (!room) return;

        room.members.delete(socket.id);
        console.log(`[-] "${memberName}" left room ${currentRoom} (${room.members.size} remaining)`);

        if (room.members.size === 0) {
            rooms.delete(currentRoom);
            console.log(`[x] Room ${currentRoom} closed (empty)`);
        } else {
            socket.to(currentRoom).emit("member-left", {
                name: memberName,
                members: roomSnapshot(room),
            });
        }

        currentRoom = null;
    }
});

// ── Health-check endpoint ──────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        rooms: rooms.size,
        timestamp: new Date().toISOString(),
    });
});

// ── Start ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`BoneBox Party Server  →  http://localhost:${PORT}`);
    console.log(`Health check          →  http://localhost:${PORT}/health`);
});
