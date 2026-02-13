import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';


// Icons (Simple SVGs for now, can replace with assets if needed)
const GameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 2.325 2.325 0 01-1.745-1.543l-1.005-2.516a.75.75 0 00-1.398 0l-1.006 2.516a2.324 2.324 0 01-1.745 1.543.64.64 0 01-.657-.643v0c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0c0 .733.402 1.383 1 .917V19.5a3 3 0 003 3h3a3 3 0 003-3V6.626c.96.166 1.632.748 1.632 1.712v0a.64.64 0 01-.657.643 2.325 2.325 0 01-1.745-1.543l-1.005-2.516a.75.75 0 00-1.398 0l-1.006 2.516a2.324 2.324 0 01-1.745 1.543.64.64 0 01-.657-.643v0z" /></svg>;
const PlayerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const MatchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0V9.499a2.25 2.25 0 00-2.25-2.25H11.25a2.25 2.25 0 00-2.25 2.25v5.876m5.006 0H8.995" /></svg>;

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

    const NavItem = ({ to, icon, label }: { to: string, icon: JSX.Element, label: string }) => (
        <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(to) ? 'text-flunk-orange' : 'text-gray-400 hover:text-white'}`}>
            {icon}
            <span className="text-xs">{label}</span>
        </Link>
    );



    // simplified approach: The Links are full height relative to header, text aligned to bottom?
    // or Flex container items-end.

    // Sliding Underline Logic
    const navRef = useRef<HTMLElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

    useEffect(() => {
        if (navRef.current) {
            const links = Array.from(navRef.current.querySelectorAll('a'));
            // Find active link based on current pathname
            const activeLink = links.find(link => link.getAttribute('href') === location.pathname);

            if (activeLink) {
                setIndicatorStyle({
                    left: activeLink.offsetLeft,
                    width: activeLink.offsetWidth,
                    opacity: 1
                });
            } else {
                setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
            }
        }
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-white flex flex-col pb-16 md:pb-0">
            {/* Header */}
            <header className="bg-flunk-gray shadow-sm z-20 sticky top-0">
                <div className="container mx-auto px-4 h-20 flex justify-between items-end pb-0 relative">
                    <div className="flex items-center gap-2 pb-4 self-center">
                        <Link to="/">
                            <img src="/assets/logo.png" alt="Flunk" className="h-10 w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav ref={navRef} className="hidden md:flex space-x-8 h-10 relative">
                        {['/', '/players', '/matches'].map((path) => (
                            <Link
                                key={path}
                                to={path}
                                className={`font-medium pb-4 px-2 relative transition-colors z-10 ${isActive(path) ? 'text-flunk-blue' : 'text-gray-500 hover:text-flunk-blue'
                                    }`}
                            >
                                {path === '/' ? 'Collection' : path === '/players' ? 'Players' : 'Matches'}
                            </Link>
                        ))}
                        {/* Sliding Indicator */}
                        <span
                            className="absolute bottom-0 h-1 bg-flunk-orange rounded-t-sm transition-all duration-300 ease-in-out"
                            style={{
                                left: indicatorStyle.left,
                                width: indicatorStyle.width,
                                opacity: indicatorStyle.opacity
                            }}
                        />
                    </nav>

                    <div className="flex items-center gap-4 pb-5 self-center">
                        {/* User Profile / Logout */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-flunk-blue text-white flex items-center justify-center font-bold">
                                {user?.email[0].toUpperCase()}
                            </div>
                            <button
                                onClick={logout}
                                className="text-sm text-gray-500 hover:text-flunk-orange"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-6">
                {children}
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-flunk-blue h-16 flex justify-around items-center z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] rounded-t-2xl">
                <NavItem to="/" icon={<GameIcon />} label="Games" />
                <NavItem to="/players" icon={<PlayerIcon />} label="Players" />
                <NavItem to="/matches" icon={<MatchIcon />} label="Matches" />
            </nav>
        </div>
    );
};
