import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, ArrowRight, Check, Gift, Award } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import './BecomeMember.css';

const BecomeMember = () => {
    const navigate = useNavigate();
    const { settings } = useOrders();
    const membershipPlans = settings.membershipPlans || [];

    const benefits = [
        {
            icon: <Zap size={24} />,
            title: 'Unlock Referral Access',
            description: 'Only Premium Members can refer friends and earn rewards.'
        },
        {
            icon: <Gift size={24} />,
            title: '100% Money Back',
            description: 'Refer members according to your plan and get your full purchase amount back!'
        },
        {
            icon: <Award size={24} />,
            title: 'Gold Coin Rewards',
            description: 'Earn a pure Gold Coin for reaching your plan milestones.'
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
            btnText: 'Current Plan',
            disabled: true
        },
        ...membershipPlans.map(plan => {
            const features = plan.features || [];
            // If no custom features, generate them dynamically
            const dynamicFeatures = features.length > 0 ? features : [
                '✔ Unique Referral Code',
                '✔ Refer & Earn Program',
                plan.cashbackEnabled !== false
                    ? `✔ Money Back for ${plan.cashbackGoal} Referrals`
                    : '✘ No Cashback Reward',
                plan.goldEnabled !== false
                    ? `✔ Gold Coin for ${plan.goldGoal} Referrals`
                    : '✘ No Gold Coin Reward',
                'Priority Doorstep Delivery'
            ];
            return {
                id: plan.id,
                name: plan.name,
                price: `₹${plan.price.toLocaleString()}`,
                priceNote: 'per referral cycle',
                features: dynamicFeatures,
                recommended: plan.id === 'premium' || plan.id === 'elite',
                btnText: `Get ${plan.name} Access`,
                planId: plan.id
            };
        })
    ];

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
                                    onClick={() => !plan.disabled && navigate('/membership/payment', { state: { planId: plan.planId } })}
                                    disabled={plan.disabled}
                                >
                                    {plan.btnText}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default BecomeMember;
