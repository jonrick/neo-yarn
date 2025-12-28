import React, { useState } from 'react';

interface WritingViewProps {
    story: string[];
    onSubmit: (text: string) => void;
    timer: number;
    round: number;
}

export const WritingView: React.FC<WritingViewProps> = ({ story, onSubmit, timer, round }) => {
    const [text, setText] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSubmit(text);
            setSubmitted(true);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center border-b border-green-900 pb-2">
                <span className="text-xs text-green-700">SEQUENCE: {round}</span>
                <span className="text-2xl font-bold animate-pulse text-red-500">{timer}s</span>
            </div>

            <div className="flex-1 bg-green-900/5 p-4 border border-green-900/30 overflow-y-auto max-h-[40vh] space-y-4">
                {story.map((segment, idx) => (
                    <p key={idx} className="leading-relaxed opacity-80 border-l-2 border-green-800 pl-4">
                        {segment}
                    </p>
                ))}
            </div>

            {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="w-full bg-black border border-green-600 p-3 h-32 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 placeholder-green-800 resize-none font-mono"
                        placeholder="Extend the narrative..."
                        autoFocus
                        maxLength={280}
                    />
                    <div className="flex justify-between items-center text-xs text-green-700">
                        <span>{text.length}/280 CHARS</span>
                        <button
                            type="submit"
                            className="bg-green-700 hover:bg-green-500 text-black px-6 py-2 uppercase font-bold transition-colors"
                        >
                            Upload Segment
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center py-12 border border-green-800 border-dashed animate-pulse text-green-400">
                    <p>DATA FRAGMENT UPLOADED.</p>
                    <p className="text-xs mt-2 text-green-700">Awaiting peer synchronization...</p>
                </div>
            )}
        </div>
    );
};
