import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, UserPlus, ArrowRight, CheckCircle2, Gift, Award } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login attempt:', { mobileNumber, referralCode });
        navigate('/');
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Login to your GURUBAGAVAN account</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="mobile">Mobile Number</label>
                            <div className="input-with-icon">
                                <Phone size={20} className="input-icon" />
                                <input
                                    type="tel"
                                    id="mobile"
                                    placeholder="Enter your 10-digit mobile number"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    required
                                    pattern="[0-9]{10}"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="referral">Unique Reference Code (Optional)</label>
                            <div className="input-with-icon">
                                <UserPlus size={20} className="input-icon" />
                                <input
                                    type="text"
                                    id="referral"
                                    placeholder="Enter your friend's reference code"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                />
                            </div>
                            <p className="form-help">Enter the unique code of the member who referred you to unlock benefits.</p>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block btn-lg">
                            Login / Register <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
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
                    <div className="benefits-note">
                        * Rewards are credited after purchasing your membership.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
