import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin, UserPlus, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        address: '',
        password: '',
        confirmPassword: '',
        referralId: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.mobile.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            navigate('/profile');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-page">
            <div className="auth-register-container">
                <div className="register-card">
                    <div className="register-header">
                        <div className="register-icon">
                            <UserPlus size={32} />
                        </div>
                        <h1>Create Account</h1>
                        <p>Join Saree Elegance and start shopping</p>
                    </div>

                    {error && <div className="register-error">{error}</div>}

                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-with-icon">
                                    <User className="input-icon" size={20} />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="mobile">Mobile Number</label>
                                <div className="input-with-icon">
                                    <Phone className="input-icon" size={20} />
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        placeholder="1234567890"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-with-icon">
                                    <Mail className="input-icon" size={20} />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="referralId">Referral ID (Optional)</label>
                                <div className="input-with-icon">
                                    <UserPlus className="input-icon" size={20} />
                                    <input
                                        type="text"
                                        id="referralId"
                                        name="referralId"
                                        placeholder="REF12345"
                                        value={formData.referralId}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Shipping Address</label>
                            <div className="input-with-icon">
                                <MapPin className="input-icon" size={20} />
                                <textarea
                                    id="address"
                                    name="address"
                                    placeholder="Enter your full shipping address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    rows="2"
                                ></textarea>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-with-icon">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="input-with-icon">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="register-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader className="spinner" size={20} />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="register-footer">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Register;
