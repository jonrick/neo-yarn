import React from 'react';

interface ResultsViewProps {
    story: string[]; // The FULL story, including the new winner
    timer: number;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ story, timer }) => {
    const latestSegment = story[story.length - 1];

    return (
        <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-green-400 mb-2">SEGMENT ASSIMILATED</h2>

            <div className="p-8 border-2 border-green-500 bg-green-900/20 relative">
                <div className="absolute -top-3 -left-3 border-t-2 border-l-2 border-green-500 w-6 h-6"></div>
                <div className="absolute -bottom-3 -right-3 border-b-2 border-r-2 border-green-500 w-6 h-6"></div>

                <p className="text-xl leading-relaxed italic text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                    "{latestSegment}"
                </p>
            </div>

            <div className="mt-12 text-green-700">
                <p>NEXT CYCLE INITIATING IN: <span className="text-white font-bold">{timer}s</span></p>
                <div className="h-1 bg-green-900 mt-2 w-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${(timer / 10) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};
