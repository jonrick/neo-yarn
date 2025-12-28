import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col items-center">
            <div className="w-full max-w-4xl border-2 border-green-800 p-6 shadow-[0_0_20px_rgba(34,197,94,0.2)] bg-black/90">
                <header className="mb-8 border-b border-green-900 pb-4 flex justify-between items-end">
                    <h1 className="text-4xl font-bold tracking-tighter animate-pulse" style={{ textShadow: '0 0 10px #22c55e' }}>
                        NEO-YARN
                    </h1>
                    <span className="text-xs text-green-700">SYS.VER.1.0_BETA</span>
                </header>
                <main>
                    {children}
                </main>
            </div>
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover mix-blend-screen z-50"></div>
        </div>
    );
};
