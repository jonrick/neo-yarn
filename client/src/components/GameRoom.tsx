import React from 'react';
import { useSocket } from '../hooks/useSocket';
import { Layout } from './Layout';
import { LobbyView } from './LobbyView';
import { WritingView } from './WritingView';
import { VotingView } from './VotingView';
import { ResultsView } from './ResultsView';

export const GameRoom: React.FC = () => {
    const { gameState, isConnected, timer, myPlayerId, error, actions } = useSocket();

    return (
        <Layout>
            <div className="h-[600px] flex flex-col relative">
                {/* HUD */}
                <div className="absolute -top-12 right-0 font-mono text-xs text-green-800 text-right">
                    <div>CONNECTION: {isConnected ? 'SECURE' : 'OFFLINE'}</div>
                    <div>ID: {myPlayerId?.substr(0, 8)}</div>
                </div>

                {error && (
                    <div className="absolute top-0 left-0 w-full p-2 bg-red-900/50 border border-red-500 text-red-100 text-center font-bold animate-pulse z-50">
                        SYSTEM ALERT: {error}
                    </div>
                )}

                {/* Sub-Components based on Phase */}
                <div className="flex-1 overflow-hidden relative p-4 bg-black/50 border border-green-900/50">
                    {gameState.phase === 'LOBBY' && (
                        <LobbyView
                            onJoin={actions.joinRoom}
                            onStart={actions.startGame}
                            isConnected={isConnected}
                            hasJoined={!!myPlayerId} // TODO: Improve hasJoined check logic if we want to separate "Connect" vs "Join Room"
                            playerCount={gameState.players.length}
                        />
                    )}

                    {gameState.phase === 'WRITING' && (
                        <WritingView
                            story={gameState.story}
                            onSubmit={actions.submitText}
                            timer={timer}
                            round={gameState.round}
                        />
                    )}

                    {gameState.phase === 'VOTING' && (
                        <VotingView
                            submissions={gameState.submissions}
                            onVote={actions.castVote}
                            timer={timer}
                        />
                    )}

                    {gameState.phase === 'RESULTS' && (
                        <ResultsView
                            story={gameState.story}
                            timer={timer}
                        />
                    )}

                    {gameState.phase === 'GAME_OVER' && (
                        <div className="text-center py-20">
                            <h2 className="text-4xl font-bold mb-8">NARRATIVE COMPLETE</h2>
                            <div className="bg-green-900/20 p-6 border border-green-600 max-h-[400px] overflow-y-auto mb-8 whitespace-pre-wrap">
                                {gameState.story.join(' ')}
                            </div>
                            <button
                                onClick={actions.startGame}
                                className="bg-green-600 text-black font-bold py-3 px-8 hover:bg-green-400"
                            >
                                REBOOT SYSTEM
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
