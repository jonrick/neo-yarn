import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, ClientActions } from '../types';

const INITIAL_STATE: GameState = {
    phase: 'LOBBY',
    players: [],
    story: [],
    round: 0,
    submissions: [] // Empty/masked during writing
};

// Auto-detect URL: relative for prod (same origin), localhost:3000 for dev
// We configured Vite proxy, so just '/' should work for standard socket, 
// But often with Docker/Portainer it's safer to use explicit logic or env var.
// Vite proxy forwards /socket.io, so we can connect to window.location.origin
const SOCKET_URL = '/';

export const useSocket = () => {
    const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
    const [isConnected, setIsConnected] = useState(false);
    const [timer, setTimer] = useState<number>(0);
    const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Initialize Socket
        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'], // Fallback
            reconnectionAttempts: 5
        });

        socketRef.current = socket;

        // Connection Events
        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
            setIsConnected(true);
            setMyPlayerId(socket.id || null);
            setError(null);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
            setMyPlayerId(null);
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setError('Connection failed. Retrying...');
        });

        // Game Events
        socket.on('state_update', (newState: GameState) => {
            console.log('State Update:', newState);
            setGameState(newState);
        });

        socket.on('timer_update', (seconds: number) => {
            setTimer(seconds);
        });

        socket.on('error', (msg: string) => {
            setError(msg);
            // Clear error after 5s
            setTimeout(() => setError(null), 5000);
        });

        // Cleanup
        return () => {
            socket.disconnect();
        };
    }, []);

    // Actions
    const actions: ClientActions = {
        joinRoom: (roomId: string, userName: string) => {
            socketRef.current?.emit('join_room', { roomId, userName });
        },
        startGame: () => {
            socketRef.current?.emit('start_game');
        },
        submitText: (text: string) => {
            socketRef.current?.emit('submit_text', text);
        },
        castVote: (submissionId: string) => {
            socketRef.current?.emit('cast_vote', submissionId);
        }
    };

    return {
        gameState,
        isConnected,
        timer,
        myPlayerId,
        error,
        actions
    };
};
