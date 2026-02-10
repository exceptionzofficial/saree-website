import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Copy, Check, Users, Gift, Award, Clock,
    TrendingUp, Share2, RefreshCw, AlertCircle,
    ChevronRight, XCircle, Lock
} from 'lucide-react';
import { useMembership } from '../../context/MembershipContext';
import { useAuth } from '../../context/AuthContext';
import { membershipsAPI } from '../../services/api';
import './SellerDashboard.css';

const SellerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        getCurrentMembership,
        getCurrentRequest,
        getUserMembershipStatus
    } = useMembership();

    const [copied, setCopied] = useState(false);
    const [renewingMembership, setRenewingMembership] = useState(false);

    const membership = getCurrentMembership();
    const pendingRequest = getCurrentRequest();
    const status = getUserMembershipStatus();

    const copyReferralCode = () => {
        if (membership?.referralCode) {
            navigator.clipboard.writeText(membership.referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareReferralLink = () => {
        if (membership?.referralCode) {
            const shareText = `🎁 Use my referral code ${membership.referralCode} on Gurubagavan Sarees and get exclusive discounts! Shop beautiful sarees at amazing prices.`;
            if (navigator.share) {
                navigator.share({
                    title: 'Gurubagavan Sarees Referral',
                    text: shareText,
                    url: window.location.origin
                });
            } else {
                navigator.clipboard.writeText(shareText);
                alert('Referral message copied to clipboard!');
            }
        }
    };

    // Pending State
    if (status === 'pending' && pendingRequest) {
        return (
            <main className="seller-dashboard">
                <div className="container">
                    <div className="pending-card">
                        <div className="pending-icon">
                            <Clock size={48} />
                        </div>
                        <h1>Payment Under Review</h1>
                        <p>Your payment is being verified by our team. This usually takes 2-4 hours during business hours.</p>
                        <div className="pending-details">
                            <div className="detail-row">
                                <span>Submitted</span>
                                <span>{new Date(pendingRequest.submittedAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                            <div className="detail-row">
                                <span>Status</span>
                                <span className="status-badge status-pending">Pending Approval</span>
                            </div>
                        </div>
                        <button className="btn btn-outline" onClick={() => window.location.reload()}>
                            <RefreshCw size={18} />
                            Refresh Status
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // No Membership State
    if (status === 'none') {
        return (
            <main className="seller-dashboard">
                <div className="container">
                    <div className="no-membership-card">
                        <div className="no-membership-icon">
                            <Users size={48} />
                        </div>
                        <h1>Not a Member Yet</h1>
                        <p>Become a Premium Member to unlock referral earnings and gold coin rewards!</p>
                        <Link to="/membership" className="btn btn-primary btn-lg">
                            Become a Member
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Completed Membership State
    if (status === 'completed' && membership) {
        const cashbackEnabled = membership.cashbackEnabled !== false;
        const goldEnabled = membership.goldEnabled !== false;
        return (
            <main className="seller-dashboard">
                <div className="container">
                    <div className="completed-card">
                        <div className="completed-icon">
                            <Award size={48} />
                        </div>
                        <h1>🎉 Congratulations!</h1>
                        <p>You've successfully completed your membership cycle and earned all your rewards!</p>

                        <div className="achievement-summary">
                            <div className="achievement-item">
                                <span className="achievement-value">{membership.referralCount}</span>
                                <span className="achievement-label">Total Referrals</span>
                            </div>
                            {cashbackEnabled && (
                                <div className="achievement-item">
                                    <span className="achievement-value">₹{membership.planPrice || 999}</span>
                                    <span className="achievement-label">Money Back</span>
                                </div>
                            )}
                            {goldEnabled && (
                                <div className="achievement-item gold">
                                    <span className="achievement-value">🪙</span>
                                    <span className="achievement-label">Gold Coin</span>
                                </div>
                            )}
                        </div>

                        <div className="renew-section">
                            {goldEnabled && (
                                <>
                                    <h3>Claim Your Gold Coin</h3>
                                    {membership.goldCoinClaimed === 'pending_admin' ? (
                                        <div className="status-info-box">
                                            <Clock size={20} />
                                            <span>Gold Application Pending</span>
                                        </div>
                                    ) : membership.goldCoinClaimed === 'in_progress' ? (
                                        <div className="status-info-box info">
                                            <RefreshCw size={20} className="spin" />
                                            <span>Gold Application Processing</span>
                                        </div>
                                    ) : !membership.goldCoinClaimed ? (
                                        <Link to="/membership/claim/gold" className="btn btn-primary btn-lg" style={{ marginBottom: '16px' }}>
                                            Apply for Gold Coin
                                            <Award size={20} style={{ marginLeft: '8px' }} />
                                        </Link>
                                    ) : membership.goldCoinClaimed === true ? (
                                        <div className="status-info-box success">
                                            <Check size={20} />
                                            <span>Gold Coin Awarded!</span>
                                        </div>
                                    ) : (
                                        <div className="status-info-box danger">
                                            <XCircle size={20} />
                                            <span>Gold Application Rejected</span>
                                            <Link to="/membership/claim/gold" className="btn btn-primary btn-sm" style={{ marginLeft: '12px' }}>Apply Again</Link>
                                        </div>
                                    )}
                                </>
                            )}
                            <h3>Want to continue earning?</h3>
                            <p>Purchase a new membership to get a fresh referral code and start earning again!</p>
                            <Link to="/membership" className="btn btn-outline btn-lg">
                                Buy Membership Again
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // Active Membership State
    if (membership) {
        const cashbackGoal = membership.cashbackGoal || 5;
        const goldGoal = membership.goldGoal || 7;
        const cashbackEnabled = membership.cashbackEnabled !== false;
        const goldEnabled = membership.goldEnabled !== false;
        const planPrice = membership.planPrice || 999;

        const progressToMoneyBack = membership.moneyBackClaimed === true ? 100 : Math.min((membership.referralCount / cashbackGoal) * 100, 100);
        const progressToGoldCoin = membership.goldCoinClaimed === true ? 100 : Math.min((membership.referralCount / goldGoal) * 100, 100);

        // Determine if cycle is complete based on enabled goals
        const isCashbackDone = !cashbackEnabled || membership.moneyBackClaimed === true;
        const isGoldDone = !goldEnabled || membership.goldCoinClaimed === true;
        const isCycleComplete = isCashbackDone && isGoldDone;

        return (
            <main className="seller-dashboard">
                <div className="container">
                    <div className="dashboard-header">
                        <div>
                            <h1>Member Portal</h1>
                            <p>Welcome back, {user?.name || 'Member'}!</p>
                            <span className="plan-badge-main">{membership.planName || 'Premium Member'}</span>
                        </div>
                        <button className="refresh-btn-simple" onClick={() => window.location.reload()}>
                            <RefreshCw size={18} />
                            Refresh Status
                        </button>
                    </div>

                    {/* Referral Code Card */}
                    <div className="referral-code-card">
                        <div className="referral-code-header">
                            <h2>Your Referral Code</h2>
                            <span className="hint">Share this code to earn rewards</span>
                        </div>
                        <div className="referral-code-display">
                            <span className="code">{membership.referralCode}</span>
                            <div className="code-actions">
                                <button onClick={copyReferralCode} className="action-btn">
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button onClick={shareReferralLink} className="action-btn primary">
                                    <Share2 size={20} />
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Cards */}
                    <div className="progress-grid">
                        {/* Money Back Progress - only if cashback is enabled */}
                        {cashbackEnabled && (
                            <div className={`progress-card ${membership.moneyBackClaimed === true ? 'completed' : ''}`}>
                                <div className="progress-card-header">
                                    <Gift size={24} />
                                    <h3>100% Money Back</h3>
                                </div>
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${progressToMoneyBack}%` }}
                                    ></div>
                                </div>
                                <div className="progress-info">
                                    <span>{membership.referralCount} / {cashbackGoal} Referrals</span>
                                    {membership.moneyBackClaimed === 'pending_admin' ? (
                                        <span className="completed-badge pending">✓ Application Pending</span>
                                    ) : membership.moneyBackClaimed === 'in_progress' ? (
                                        <span className="completed-badge in-progress">✓ Processing</span>
                                    ) : membership.moneyBackClaimed === true ? (
                                        <span className="completed-badge">✓ Claimed</span>
                                    ) : (
                                        <span>{Math.max(0, cashbackGoal - membership.referralCount)} more to go</span>
                                    )}
                                </div>
                                {membership.referralCount >= cashbackGoal && (membership.moneyBackClaimed === false || !membership.moneyBackClaimed) && (
                                    <Link to="/membership/claim/cashback" className="claim-btn">
                                        Get Cashback
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Gold Coin Progress - only if gold is enabled */}
                        {goldEnabled && (
                            <div className={`progress-card gold ${membership.goldCoinClaimed === true ? 'completed' : ''}`}>
                                <div className="progress-card-header">
                                    <Award size={24} />
                                    <h3>Pure Gold Coin</h3>
                                </div>
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar gold"
                                        style={{ width: `${progressToGoldCoin}%` }}
                                    ></div>
                                </div>
                                <div className="progress-info">
                                    <span>{membership.referralCount} / {goldGoal} Referrals</span>
                                    {membership.goldCoinClaimed === 'pending_admin' ? (
                                        <span className="completed-badge gold pending">✓ Application Pending</span>
                                    ) : membership.goldCoinClaimed === 'in_progress' ? (
                                        <span className="completed-badge gold in-progress">✓ Processing</span>
                                    ) : membership.goldCoinClaimed === true ? (
                                        <span className="completed-badge gold">🪙 Earned!</span>
                                    ) : (
                                        <span>{Math.max(0, goldGoal - membership.referralCount)} more to go</span>
                                    )}
                                </div>
                                {membership.referralCount >= goldGoal && (membership.goldCoinClaimed === false || !membership.goldCoinClaimed) && (
                                    <Link to="/membership/claim/gold" className="claim-btn gold">
                                        Apply for Gold
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Membership Complete - Redirect to become member again */}
                    {isCycleComplete && (
                        <div className="renew-membership-card">
                            <div className="renew-icon">🎉</div>
                            <div className="renew-content">
                                <h3>Congratulations! You've completed your membership!</h3>
                                <p>You've earned all rewards. Your referral code is now <strong>inactive</strong>.</p>
                                <div className="blocked-warning">
                                    <Lock size={16} />
                                    <span>Referral code inactive - Start a new membership to earn again</span>
                                </div>
                                <Link to="/membership" className="btn btn-primary">
                                    Become a Member Again
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Stats Summary */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <TrendingUp size={24} />
                            <div className="stat-content">
                                <span className="stat-value">{membership.referralCount}</span>
                                <span className="stat-label">Total Referrals</span>
                            </div>
                        </div>
                        {goldEnabled ? (
                            <div className="stat-card">
                                <Users size={24} />
                                <div className="stat-content">
                                    <span className="stat-value">{Math.max(0, goldGoal - membership.referralCount)}</span>
                                    <span className="stat-label">Referrals to Gold</span>
                                </div>
                            </div>
                        ) : cashbackEnabled ? (
                            <div className="stat-card">
                                <Users size={24} />
                                <div className="stat-content">
                                    <span className="stat-value">{Math.max(0, cashbackGoal - membership.referralCount)}</span>
                                    <span className="stat-label">Referrals to Cashback</span>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Referral History */}
                    <div className="referral-history">
                        <h2>Referral History</h2>
                        {membership.referrals.length > 0 ? (
                            <div className="referral-list">
                                {membership.referrals.map((ref, index) => (
                                    <div key={index} className="referral-item">
                                        <div className="referral-avatar">
                                            {ref.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="referral-details">
                                            <span className="referral-name">{ref.name}</span>
                                            {ref.mobile && <span className="referral-mobile">{ref.mobile}</span>}
                                            <span className="referral-date">
                                                {new Date(ref.date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <Check size={20} className="referral-check" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-referrals">
                                <AlertCircle size={32} />
                                <p>No referrals yet. Share your code to start earning!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        );
    }

    return null;
};

export default SellerDashboard;
