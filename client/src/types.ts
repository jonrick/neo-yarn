export type Phase = 'LOBBY' | 'WRITING' | 'VOTING' | 'RESULTS' | 'GAME_OVER';

export interface Player {
    id: string; // socketId
    name: string;
    score: number;
    connected: boolean;
}

export interface Submission {
    id: string; // socketId of author
    text: string;
}

export interface GameState {
    phase: Phase;
    players: Player[];
    story: string[];
    round: number;
    submissions: Submission[];
}

export interface ClientActions {
    joinRoom: (roomId: string, userName: string) => void;
    startGame: () => void;
    submitText: (text: string) => void;
    castVote: (submissionId: string) => void;
}
