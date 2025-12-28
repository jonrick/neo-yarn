import React, { useState } from 'react';

interface LobbyViewProps {
    onJoin: (roomId: string, name: string) => void;
    onStart: () => void;
    isConnected: boolean;
    hasJoined: boolean;
    playerCount: number;
}

export const LobbyView: React.FC<LobbyViewProps> = ({ onJoin, onStart, isConnected, hasJoined, playerCount }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('DEFAULT');

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) onJoin(room, name);
    };

    return (
        <div className="space-y-8 text-center">
            {!hasJoined ? (
                <form onSubmit={handleJoin} className="space-y-4 max-w-sm mx-auto">
                    <div className="space-y-2">
                        <label className="block text-left text-sm uppercase tracking-widest text-green-700">Identity</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-black border border-green-600 p-2 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder-green-900"
                            placeholder="ENTER_CODENAME"
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-left text-sm uppercase tracking-widest text-green-700">Target Node</label>
                        <input
                            type="text"
                            value={room}
                            onChange={e => setRoom(e.target.value)}
                            className="w-full bg-black border border-green-600 p-2 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder-green-900"
                            placeholder="ROOM_ID"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!isConnected}
                        className="w-full bg-green-900/20 border border-green-500 text-green-400 py-3 hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest font-bold"
                    >
                        {isConnected ? 'Initialise Link' : 'Connecting...'}
                    </button>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className="border border-green-900 p-4 bg-green-900/10">
                        <h2 className="text-xl mb-2">STATUS: CONNECTED</h2>
                        <p className="text-green-300">WAITING FOR OPERATIVES...</p>
                        <div className="text-4xl font-bold my-4">{playerCount} / ?</div>
                    </div>

                    <button
                        onClick={onStart}
                        className="w-full max-w-md bg-green-600 text-black font-bold py-4 hover:bg-green-400 transition-all uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    >
                        EXECUTE_PROGRAM.EXE
                    </button>
                </div>
            )}
        </div>
    );
};
