import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { GameList } from './pages/GameList';
import { GameForm } from './pages/GameForm';
import { PlayerList } from './pages/PlayerList';
import { PlayerForm } from './pages/PlayerForm';
import { useAuth } from './context/AuthContext';

import { Layout } from './components/Layout';
import { MatchList } from './pages/MatchList';
import { MatchForm } from './pages/MatchForm';
import { Dashboard } from './pages/Dashboard';


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>;
    return isAuthenticated ? (
        <Layout>{children}</Layout>
    ) : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                        <PrivateRoute>
                            <GameList />
                        </PrivateRoute>
                    } />
                    <Route path="/games/new" element={
                        <PrivateRoute>
                            <GameForm />
                        </PrivateRoute>
                    } />
                    <Route path="/games/:id/edit" element={
                        <PrivateRoute>
                            <GameForm />
                        </PrivateRoute>
                    } />
                    <Route path="/players" element={
                        <PrivateRoute>
                            <PlayerList />
                        </PrivateRoute>
                    } />
                    <Route path="/players/new" element={
                        <PrivateRoute>
                            <PlayerForm />
                        </PrivateRoute>
                    } />
                    <Route path="/players/:id/edit" element={
                        <PrivateRoute>
                            <PlayerForm />
                        </PrivateRoute>
                    } />
                    <Route path="/matches" element={
                        <PrivateRoute>
                            <MatchList />
                        </PrivateRoute>
                    } />
                    <Route path="/matches/new" element={
                        <PrivateRoute>
                            <MatchForm />
                        </PrivateRoute>
                    } />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
