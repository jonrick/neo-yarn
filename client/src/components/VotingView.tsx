import React, { useState } from 'react';
import { Submission } from '../types';

interface VotingViewProps {
    submissions: Submission[];
    onVote: (id: string) => void;
    timer: number;
}

export const VotingView: React.FC<VotingViewProps> = ({ submissions, onVote, timer }) => {
    const [votedId, setVotedId] = useState<string | null>(null);

    const handleVote = (id: string) => {
        if (!votedId) {
            onVote(id);
            setVotedId(id);
        }
    };

    return (
        <div className="h-full flex flex-col items-center">
            <h2 className="text-xl mb-6 flex items-center space-x-4">
                <span>SELECT OPTIMAL PATH</span>
                <span className="text-red-500 font-bold border border-red-900 px-2">{timer}s</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {submissions.map((sub) => (
                    <button
                        key={sub.id}
                        onClick={() => handleVote(sub.id)}
                        disabled={!!votedId}
                        className={`p-6 border text-left transition-all group relative overflow-hidden
                            ${votedId === sub.id
                                ? 'border-green-400 bg-green-900/30'
                                : 'border-green-800 hover:border-green-500 hover:bg-green-900/10'
                            }
                            ${votedId && votedId !== sub.id ? 'opacity-50 grayscale' : 'opacity-100'}
                        `}
                    >
                        {/* Glitch deco */}
                        <div className="absolute top-0 right-0 p-1 text-[10px] text-green-800 bg-green-900/20 opacity-0 group-hover:opacity-100">
                            ID: {sub.id.substr(0, 4)}
                        </div>

                        <p className="leading-relaxed">{sub.text}</p>

                        {votedId === sub.id && (
                            <div className="absolute  bottom-2 right-2 text-green-400 text-xs animate-pulse">
                                [ LOCKED ]
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {submissions.length === 0 && (
                <div className="text-red-500 border border-red-900 p-4">
                    ERROR: NO DATA FRAGMENTS RECEIVED. SYSTEM HALTED.
                </div>
            )}
        </div>
    );
};
