const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const Room = require('./game/Room');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve Frontend
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../client/dist/index.html');
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.send('Neo-Yarn Server Running. Client not built.');
    }
});

// Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Room Manager
const rooms = new Map();

// Helper to get or create room
function getRoom(roomId) {
    if (!rooms.has(roomId)) {
        console.log(`Creating new room: ${roomId}`);
        rooms.set(roomId, new Room(roomId, io));
    }
    return rooms.get(roomId);
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Initial simple join logic: Everyone joins "default" room for now
    // Or we expect client to emit 'join_room'

    socket.on('join_room', ({ roomId, userName }) => {
        const room = getRoom(roomId || 'default');
        room.join(socket, userName);
        socket.data.roomId = room.id; // Store room ref on socket
    });

    socket.on('start_game', () => {
        const roomId = socket.data.roomId;
        if (roomId && rooms.has(roomId)) {
            rooms.get(roomId).startGame();
        }
    });

    socket.on('submit_text', (text) => {
        const roomId = socket.data.roomId;
        if (roomId && rooms.has(roomId)) {
            rooms.get(roomId).submitText(socket.id, text);
        }
    });

    socket.on('cast_vote', (submissionId) => {
        const roomId = socket.data.roomId;
        if (roomId && rooms.has(roomId)) {
            rooms.get(roomId).castVote(socket.id, submissionId);
        }
    });

    socket.on('disconnect', () => {
        const roomId = socket.data.roomId;
        if (roomId && rooms.has(roomId)) {
            rooms.get(roomId).leave(socket.id);
            // Optional: destroy room if empty
        }
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
