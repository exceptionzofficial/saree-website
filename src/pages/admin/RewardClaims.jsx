import { useState, useEffect } from 'react';
import {
    Gift, Award, Clock, CheckCircle, XCircle,
    Phone, Mail, MapPin, CreditCard, Loader2,
    ChevronDown, ChevronUp
} from 'lucide-react';
import { membershipsAPI } from '../../services/api';
import './RewardClaims.css';

const RewardClaims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedClaim, setExpandedClaim] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'in_progress', 'completed'

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const data = await membershipsAPI.getRewardClaims();
            setClaims(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch reward claims');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await membershipsAPI.updateClaimStatus(id, newStatus);
            setClaims(prev => prev.map(claim =>
                claim.id === id ? { ...claim, status: newStatus } : claim
            ));
        } catch (err) {
            alert('Failed to update status');
            console.error(err);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'pending', icon: <Clock size={14} />, text: 'Pending' },
            in_progress: { class: 'in-progress', icon: <Loader2 size={14} />, text: 'In Progress' },
            completed: { class: 'completed', icon: <CheckCircle size={14} />, text: 'Completed' },
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

    const filteredClaims = filter === 'all'
        ? claims
        : claims.filter(c => c.status === filter);

    if (loading) {
        return (
            <div className="admin-reward-claims">
                <div className="loading-state">
                    <Loader2 size={48} className="spin" />
                    <p>Loading reward claims...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-reward-claims">
            <div className="claims-header">
                <div>
                    <h1>Reward Claims</h1>
                    <p>Manage Cashback and Gold Coin applications</p>
                </div>
                <div className="header-stats">
                    <div className="stat-badge pending">
                        <Clock size={16} />
                        <span>{claims.filter(c => c.status === 'pending').length} Pending</span>
                    </div>
                    <div className="stat-badge in-progress">
                        <Loader2 size={16} />
                        <span>{claims.filter(c => c.status === 'in_progress').length} In Progress</span>
                    </div>
                    <div className="stat-badge completed">
                        <CheckCircle size={16} />
                        <span>{claims.filter(c => c.status === 'completed').length} Completed</span>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {['all', 'pending', 'in_progress', 'completed'].map(f => (
                    <button
                        key={f}
                        className={`tab ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                ))}
            </div>

            {error && <div className="error-message">{error}</div>}

            {filteredClaims.length === 0 ? (
                <div className="empty-state">
                    <Gift size={48} />
                    <h3>No claims found</h3>
                    <p>{filter === 'all' ? 'No reward claims have been submitted yet.' : `No ${filter.replace('_', ' ')} claims.`}</p>
                </div>
            ) : (
                <div className="claims-list">
                    {filteredClaims.map(claim => (
                        <div key={claim.id} className={`claim-card ${claim.type}`}>
                            <div
                                className="claim-header"
                                onClick={() => setExpandedClaim(expandedClaim === claim.id ? null : claim.id)}
                            >
                                <div className="claim-type">
                                    {claim.type === 'gold' ? (
                                        <Award size={24} className="gold-icon" />
                                    ) : (
                                        <Gift size={24} className="cashback-icon" />
                                    )}
                                    <div>
                                        <h3>{claim.type === 'gold' ? 'Gold Coin' : 'Cashback'}</h3>
                                        <p>{claim.fullName}</p>
                                    </div>
                                </div>
                                <div className="claim-meta">
                                    {getStatusBadge(claim.status)}
                                    <span className="date">
                                        {new Date(claim.submittedAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    {expandedClaim === claim.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {expandedClaim === claim.id && (
                                <div className="claim-details">
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <Mail size={16} />
                                            <span>{claim.email}</span>
                                        </div>
                                        <div className="detail-item">
                                            <Phone size={16} />
                                            <span>{claim.phone}</span>
                                        </div>
                                        <div className="detail-item full-width">
                                            <MapPin size={16} />
                                            <span>{claim.address}, {claim.postalCode}</span>
                                        </div>

                                        {/* Payment Details (only for cashback) */}
                                        {claim.type === 'cashback' && (
                                            <>
                                                <div className="detail-item">
                                                    <CreditCard size={16} />
                                                    <span>
                                                        {claim.paymentMethod === 'upi'
                                                            ? `UPI: ${claim.upiId}`
                                                            : `Bank: ${claim.bankName} - ${claim.accountNumber}`
                                                        }
                                                    </span>
                                                </div>
                                                {claim.paymentMethod === 'bank' && (
                                                    <div className="detail-item">
                                                        <span className="label">IFSC:</span>
                                                        <span>{claim.ifscCode}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Status Update Actions */}
                                    <div className="action-buttons">
                                        <span className="label">Update Status:</span>
                                        <button
                                            className={`btn btn-warning ${claim.status === 'in_progress' ? 'active' : ''}`}
                                            onClick={() => updateStatus(claim.id, 'in_progress')}
                                        >
                                            {claim.status === 'in_progress' ? 'Re-sync Processing' : 'Mark In Progress'}
                                        </button>

                                        <button
                                            className={`btn btn-success ${claim.status === 'completed' ? 'active' : ''}`}
                                            onClick={() => updateStatus(claim.id, 'completed')}
                                        >
                                            {claim.status === 'completed' ? 'Re-sync Completion' : 'Mark Completed'}
                                        </button>

                                        {claim.status !== 'completed' && (
                                            <button
                                                className={`btn btn-danger ${claim.status === 'rejected' ? 'active' : ''}`}
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to reject this claim?')) {
                                                        updateStatus(claim.id, 'rejected');
                                                    }
                                                }}
                                            >
                                                {claim.status === 'rejected' ? 'Re-sync Rejection' : 'Reject'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RewardClaims;
