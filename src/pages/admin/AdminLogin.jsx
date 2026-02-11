import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { adminAuthAPI } from '../../services/api';
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


    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await adminAuthAPI.login(credentials);
            if (response.token) {
                localStorage.setItem('adminAuth', JSON.stringify({
                    isAuthenticated: true,
                    username: response.user.username,
                    token: response.token,
                    loginTime: new Date().toISOString()
                }));
                navigate('/_gurusareesadmin_@_/dashboard');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'Invalid username or password.');
        } finally {
            setLoading(false);
        }
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
