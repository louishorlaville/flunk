import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        Flunk <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Tracker</span>
                    </Link>

                    <nav className="hidden md:flex space-x-6">
                        <Link
                            to="/"
                            className={`${isActive('/') && location.pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            Games
                        </Link>
                        <Link
                            to="/players"
                            className={`${isActive('/players') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            Players
                        </Link>
                        <Link
                            to="/matches"
                            className={`${isActive('/matches') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            Matches
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-right hidden sm:block">
                            <div className="font-medium text-gray-900">{user?.email}</div>
                        </div>
                        <button
                            onClick={logout}
                            className="text-sm text-red-600 hover:text-red-800 border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Flunk Project.
                </div>
            </footer>
        </div>
    );
};
