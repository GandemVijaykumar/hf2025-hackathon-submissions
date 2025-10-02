
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email and Password fields... same structure */}
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-700 text-white rounded-md p-2" />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-700 text-white rounded-md p-2" />
                </div>
                <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg">Login</button>
            </form>
            <p className="mt-4 text-center">New User? <Link to="/register" className="text-cyan-400">Register here</Link></p>
        </div>
    );
}

export default LoginPage;