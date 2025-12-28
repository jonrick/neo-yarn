const { v4: uuidv4 } = require('uuid');

class Room {
    constructor(roomId, io) {
        this.id = roomId;
        this.io = io;
        // Phases: 'LOBBY' | 'WRITING' | 'VOTING' | 'RESULTS' | 'GAME_OVER'
        this.phase = 'LOBBY';

        // Players: Map<socketId, {id, name, score, connected}>
        this.players = new Map();

        // Game State
        this.story = ["It was a dark and stormy night in the digital void..."];
        this.roundCount = 0;
        this.maxRounds = 5;

        // Round Data
        // Map<socketId, text>
        this.currentSubmissions = new Map();
        // Map<submissionId, count> - simplified for now, need to track who voted for what?
        // Actually: Map<socketId, submissionId> (Player -> Vote Target)
        this.currentVotes = new Map();

        this.timer = null;
        this.timeLeft = 0;
    }

    join(socket, playerName) {
        // Prevent joining if game already started, unless reconnecting (TODO: Reconnect logic)
        if (this.phase !== 'LOBBY') {
            socket.emit('error', 'Game already in progress');
            return;
        }

        const player = {
            id: socket.id,
            name: playerName || `User-${socket.id.substr(0, 4)}`,
            score: 0,
            connected: true
        };

        this.players.set(socket.id, player);
        socket.join(this.id);

        this.broadcastState();
    }

    leave(socketId) {
        if (this.players.has(socketId)) {
            this.players.delete(socketId); // Or mark disconnected
            this.broadcastState();

            // If empty, purely optional cleanup here, usually handled by Manager
        }
    }

    startGame() {
        if (this.phase !== 'LOBBY') return;
        this.roundCount = 0;
        this.story = ["It was a dark and stormy night in the digital void..."]; // Reset story
        this.startRound();
    }

    startRound() {
        this.phase = 'WRITING';
        this.currentSubmissions.clear();
        this.currentVotes.clear();
        this.roundCount++;

        this.broadcastState();
        this.startTimer(60, () => this.startVoting());
    }

    submitText(socketId, text) {
        if (this.phase !== 'WRITING') return;
        this.currentSubmissions.set(socketId, text);

        // If everyone submitted, end early
        if (this.currentSubmissions.size === this.players.size) {
            this.clearTimer();
            this.startVoting();
        } else {
            this.broadcastState(); // Update 'submitted' status
        }
    }

    startVoting() {
        this.phase = 'VOTING';
        this.broadcastState();
        this.startTimer(30, () => this.tallyVotes());
    }

    castVote(socketId, targetSocketId) {
        if (this.phase !== 'VOTING') return;
        if (socketId === targetSocketId) return; // Prevent self-voting
        if (!this.currentSubmissions.has(targetSocketId)) return; // Vote must be for valid submission

        this.currentVotes.set(socketId, targetSocketId);

        if (this.currentVotes.size === this.players.size) {
            this.clearTimer();
            this.tallyVotes();
        } else {
            this.broadcastState();
        }
    }

    tallyVotes() {
        // Calculate scores
        const voteCounts = {}; // targetId -> count

        this.currentVotes.forEach((targetId) => {
            voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
        });

        let winnerId = null;
        let maxVotes = -1;

        // Find winner (simple majority)
        for (const [suspectId, count] of Object.entries(voteCounts)) {
            if (count > maxVotes) {
                maxVotes = count;
                winnerId = suspectId;
            } else if (count === maxVotes) {
                // Tie breaker: Random or First? Let's say First for now (effectively random due to iteration order)
                // Or no winner? Let's pick valid winner to keep story moving.
            }
        }

        if (winnerId && this.currentSubmissions.has(winnerId)) {
            const winningText = this.currentSubmissions.get(winnerId);
            this.story.push(winningText);

            // Award points
            const winner = this.players.get(winnerId);
            if (winner) {
                winner.score += 10 + (maxVotes * 2);
            }
        } else {
            // No votes? or Tie?
            // Fallback: Pick random submission or nothing.
            // Let's skip adding if no valid winner.
        }

        this.phase = 'RESULTS';
        this.broadcastState();

        this.startTimer(10, () => {
            if (this.roundCount >= this.maxRounds) {
                this.endGame();
            } else {
                this.startRound();
            }
        });
    }

    endGame() {
        this.phase = 'GAME_OVER';
        this.broadcastState();

        // Save story to DB (TODO)
    }

    // --- Helpers ---

    startTimer(seconds, callback) {
        this.clearTimer();
        this.timeLeft = seconds;

        // Initial tick
        this.io.to(this.id).emit('timer_update', this.timeLeft);

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.io.to(this.id).emit('timer_update', this.timeLeft);

            if (this.timeLeft <= 0) {
                this.clearTimer();
                if (callback) callback();
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    broadcastState() {
        // Serialize state for client
        const state = {
            phase: this.phase,
            players: Array.from(this.players.values()),
            story: this.story,
            round: this.roundCount,
            submissions: this.phase === 'VOTING' || this.phase === 'RESULTS'
                ? Array.from(this.currentSubmissions.entries()).map(([id, text]) => ({ id, text }))
                : [], // Hide text during writing? Actually we need to hide it.
            // During WRITING, client just needs to know WHO submitted, not WHAT.
            // But for simplicity, we can send generic "submitted: true" flag in player list?
            // Let's refine public state.
        };

        // Mask submissions during WRITING
        if (this.phase === 'WRITING') {
            state.submissions = []; // Don't show text
        }

        this.io.to(this.id).emit('state_update', state);
    }
}

module.exports = Room;
