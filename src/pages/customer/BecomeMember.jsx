import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, TrendingUp, Users, ShieldCheck, Zap, ArrowRight, Check, Gift, Award } from 'lucide-react';
import './BecomeMember.css';

const BecomeMember = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        city: '',
    });

    const benefits = [
        {
            icon: <Zap size={24} />,
            title: 'Unlock Referral Access',
            description: 'Only Premium Members can refer friends and earn rewards.'
        },
        {
            icon: <Gift size={24} />,
            title: '100% Money Back',
            description: 'Refer 5 members and get your full purchase amount back!'
        },
        {
            icon: <Award size={24} />,
            title: 'Gold Coin Rewards',
            description: 'Earn a pure Gold Coin for every 7 successful referrals.'
        },
        {
            icon: <ShieldCheck size={24} />,
            title: 'Exclusive Early Access',
            description: 'Priority access to new collections and festive sales.'
        }
    ];

    const plans = [
        {
            name: 'Free User',
            price: '₹0',
            features: [
                'Browse & Shop Collection',
                'Standard Customer Support',
                'Save Wishlist Items',
                '✘ No Referral Earnings',
                '✘ No Gold Coin Rewards'
            ],
            recommended: false,
            btnText: 'Current Plan'
        },
        {
            name: 'Premium Member',
            price: '₹999',
            priceNote: 'per referral cycle',
            features: [
                'All Free User features',
                '✔ Unique Referral Code',
                '✔ Refer & Earn Program',
                '✔ Money Back for 5 Referrals',
                '✔ Gold Coin for 7 Referrals',
                'Priority Doorstep Delivery'
            ],
            recommended: true,
            btnText: 'Get Premium Access'
        }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Member registration:', formData);
        alert('Thank you for your interest! Please proceed to payment to unlock your Unique Referral Code.');
    };

    return (
        <main className="seller-page">
            {/* Hero Section */}
            <section className="seller-hero">
                <div className="container">
                    <div className="seller-hero__content">
                        <span className="seller-hero__tag">GURUBAGAVAN EXCLUSIVE</span>
                        <h1 className="seller-hero__title">Become a <span>Premium Member</span></h1>
                        <p className="seller-hero__text">
                            Unlock the power of referrals. Share your love for sarees and get rewarded with
                            Full Money Back and Pure Gold Coins!
                        </p>
                        <a href="#plans-section" className="btn btn-secondary btn-lg">
                            View Membership Plans <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="seller-benefits">
                <div className="container">
                    <div className="seller-section-header">
                        <h2>Membership Benefits</h2>
                        <div className="divider-accent"></div>
                    </div>
                    <div className="seller-benefits__grid">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="seller-benefit-card">
                                <div className="benefit-icon-wrapper">{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Membership Section */}
            <section id="plans-section" className="seller-plans">
                <div className="container">
                    <div className="seller-section-header">
                        <h2>Choose Your Plan</h2>
                        <p>Unlock your unique referral code by becoming a premium member today.</p>
                    </div>
                    <div className="plans-grid">
                        {plans.map((plan, index) => (
                            <div key={index} className={`plan-card ${plan.recommended ? 'plan-card--recommended' : ''}`}>
                                {plan.recommended && <div className="plan-badge">Highly Recommended</div>}
                                <h3 className="plan-name">{plan.name}</h3>
                                <div className="plan-price">
                                    {plan.price}
                                    {plan.priceNote && <span className="price-note">{plan.priceNote}</span>}
                                </div>
                                <ul className="plan-features">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className={feature.startsWith('✘') ? 'feature-locked' : ''}>
                                            {feature.startsWith('✔') || feature.startsWith('✘') ? '' : <Check size={18} />}
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className={`btn ${plan.recommended ? 'btn-primary' : 'btn-outline'} btn-block`}
                                    onClick={() => plan.recommended && navigate('/membership/payment')}
                                >
                                    {plan.btnText}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Registration Form Section */}
            <section id="register-form" className="seller-register">
                <div className="container">
                    <div className="register-container">
                        <div className="register-info">
                            <h2>Join the Club</h2>
                            <p>Become a member today and start generating your unique referral code to share with your friends and family.</p>
                            <div className="info-list">
                                <div className="info-item">
                                    <div className="info-icon"><Users size={20} /></div>
                                    <div>
                                        <h4>Community Power</h4>
                                        <p>Join thousands of members already earning gold coins.</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon"><TrendingUp size={20} /></div>
                                    <div>
                                        <h4>Track Earnings</h4>
                                        <p>Real-time dashboard to see your referral progress.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="register-form-card">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        placeholder="10-digit number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required
                                        pattern="[0-9]{10}"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="Your City"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-secondary btn-block btn-lg">
                                    Register & Proceed to Payment
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default BecomeMember;
