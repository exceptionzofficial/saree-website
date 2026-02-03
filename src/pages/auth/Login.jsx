import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Loader, Gift, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const from = location.state?.from?.pathname || '/profile';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(mobile, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Login to your Saree Elegance account</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="mobile">Mobile Number</label>
                            <div className="input-with-icon">
                                <Phone size={20} className="input-icon" />
                                <input
                                    type="tel"
                                    id="mobile"
                                    placeholder="Enter your 10-digit mobile number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    required
                                    pattern="[0-9]{10}"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-with-icon">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader className="spinner" size={20} />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    Login <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Create Account</Link>
                    </div>
                </div>

                <div className="referral-benefits">
                    <h2 className="benefits-title">Referral Rewards Program</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <Gift size={24} />
                            </div>
                            <div className="benefit-content">
                                <h3>5 Referrals</h3>
                                <p>Get your full money back for your purchased saree!</p>
                            </div>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <Award size={24} />
                            </div>
                            <div className="benefit-content">
                                <h3>7 Referrals</h3>
                                <p>Receive a pure Gold Coin as a reward!</p>
                            </div>
                        </div>
                        <div className="benefit-card highlight">
                            <div className="benefit-icon">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="benefit-content">
                                <h3>Recurring Bonus</h3>
                                <p>Get an extra gold coin for every 7 additional successful referrals!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
