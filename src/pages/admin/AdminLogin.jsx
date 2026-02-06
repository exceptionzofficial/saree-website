import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Admin credentials
    const ADMIN_USERNAME = 'gurubagavansarees';
    const ADMIN_PASSWORD = 'gurubagavan@123';

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate login delay
        setTimeout(() => {
            if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
                localStorage.setItem('adminAuth', JSON.stringify({
                    isAuthenticated: true,
                    username: credentials.username,
                    loginTime: new Date().toISOString()
                }));
                navigate('/admin/dashboard');
            } else {
                setError('Invalid username or password. Please contact the administrator if you forgot your credentials.');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <main className="admin-login">
            <div className="admin-login__container">
                <div className="admin-login__card">
                    <div className="admin-login__header">
                        <div className="admin-login__logo">
                            <span>✨</span>
                        </div>
                        <h1 className="admin-login__title">Admin Login</h1>
                        <p className="admin-login__subtitle">
                            Sign in to manage your store
                        </p>
                    </div>

                    {error && (
                        <div className="admin-login__error">
                            {error}
                        </div>
                    )}

                    <form className="admin-login__form" onSubmit={handleSubmit}>
                        <div className="admin-login__field">
                            <label>Username</label>
                            <div className="admin-login__input-wrapper">
                                <User size={18} />
                                <input
                                    type="text"
                                    name="username"
                                    value={credentials.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="admin-login__field">
                            <label>Password</label>
                            <div className="admin-login__input-wrapper">
                                <Lock size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="admin-login__toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default AdminLogin;
