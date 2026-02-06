import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
    ArrowLeft, Users, Gift, Award, Clock, Check,
    RefreshCw, XCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMembership } from '../../context/MembershipContext';
import { membershipsAPI } from '../../services/api';
import './RewardHistory.css';

const RewardHistory = () => {
    const { user, isAuthenticated } = useAuth();
    const { getCurrentMembership } = useMembership();
    const membership = getCurrentMembership();

    const [rewardClaims, setRewardClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRewardClaims();
    }, []);

    const fetchRewardClaims = async () => {
        try {
            // Fetch all claims and filter by user email
            const claims = await membershipsAPI.getRewardClaims();
            const userClaims = claims.filter(c => c.email === user?.email);
            setRewardClaims(userClaims);
        } catch (err) {
            console.error('Error fetching reward claims:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'pending', icon: <Clock size={14} />, text: 'Pending' },
            pending_admin: { class: 'pending', icon: <Clock size={14} />, text: 'Pending Approval' },
            in_progress: { class: 'processing', icon: <RefreshCw size={14} className="spin" />, text: 'Processing' },
            completed: { class: 'completed', icon: <Check size={14} />, text: 'Completed' },
            rejected: { class: 'rejected', icon: <XCircle size={14} />, text: 'Rejected' }
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`status-badge ${badge.class}`}>
                {badge.icon}
                {badge.text}
            </span>
        );
    };

    return (
        <main className="reward-history-page">
            <div className="container">
                <Link to="/profile" className="back-link">
                    <ArrowLeft size={20} />
                    Back to Profile
                </Link>

                <h1>Reward History</h1>
                <p className="page-subtitle">View your referrals and reward claims</p>

                {/* Referral History Section */}
                <section className="history-section">
                    <div className="section-header">
                        <Users size={24} />
                        <h2>Your Referrals</h2>
                    </div>

                    {membership?.referrals && membership.referrals.length > 0 ? (
                        <div className="referral-list">
                            {membership.referrals.map((ref, index) => (
                                <div key={index} className="referral-item">
                                    <div className="referral-avatar">
                                        {ref.name?.charAt(0).toUpperCase() || 'R'}
                                    </div>
                                    <div className="referral-info">
                                        <span className="referral-name">{ref.name}</span>
                                        {ref.email && <span className="referral-email">{ref.email}</span>}
                                        <span className="referral-date">
                                            {new Date(ref.date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="referral-type">
                                        <span className="type-badge">{ref.type || 'Membership'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Users size={48} />
                            <p>No referrals yet. Share your referral code to start earning!</p>
                            {membership && (
                                <Link to="/seller/dashboard" className="btn btn-primary btn-sm">
                                    Go to Member Portal
                                    <ChevronRight size={16} />
                                </Link>
                            )}
                        </div>
                    )}
                </section>

                {/* Reward Claims Section */}
                <section className="history-section">
                    <div className="section-header">
                        <Award size={24} />
                        <h2>Reward Claims</h2>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <RefreshCw size={32} className="spin" />
                            <p>Loading claims...</p>
                        </div>
                    ) : rewardClaims.length > 0 ? (
                        <div className="claims-list">
                            {rewardClaims.map(claim => (
                                <div key={claim.id} className={`claim-item ${claim.type}`}>
                                    <div className="claim-icon">
                                        {claim.type === 'gold' ? <Award size={24} /> : <Gift size={24} />}
                                    </div>
                                    <div className="claim-info">
                                        <span className="claim-type">
                                            {claim.type === 'gold' ? 'Gold Coin' : '100% Money Back'}
                                        </span>
                                        <span className="claim-date">
                                            Submitted: {new Date(claim.submittedAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="claim-status">
                                        {getStatusBadge(claim.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Gift size={48} />
                            <p>No reward claims yet. Complete referrals to unlock rewards!</p>
                        </div>
                    )}
                </section>

                {/* Summary Stats */}
                {membership && (
                    <section className="summary-section">
                        <h2>Summary</h2>
                        <div className="summary-grid">
                            <div className="summary-card">
                                <span className="summary-value">{membership.referralCount || 0}</span>
                                <span className="summary-label">Total Referrals</span>
                            </div>
                            <div className="summary-card">
                                <span className="summary-value">
                                    {membership.moneyBackClaimed === true ? '✓' : '-'}
                                </span>
                                <span className="summary-label">Cashback Claimed</span>
                            </div>
                            <div className="summary-card gold">
                                <span className="summary-value">
                                    {membership.goldCoinClaimed === true ? '🪙' : '-'}
                                </span>
                                <span className="summary-label">Gold Coin Earned</span>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};

export default RewardHistory;
