import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-gray-800 border-b border-gray-700">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-cyan-400">RizeOS</Link>
                <nav>
                    {userInfo ? (
                        <div className="flex items-center space-x-4">
                            <span>Welcome, {userInfo.name}</span>
                            <Link to="/profile" className="hover:text-cyan-400">Profile</Link>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">Logout</button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="hover:text-cyan-400">Login</Link>
                            <Link to="/register" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg">Register</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;