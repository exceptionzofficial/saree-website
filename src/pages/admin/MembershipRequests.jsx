import { useState } from 'react';
import {
    Users, Check, X, Eye, Clock,
    UserCheck, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { useMembership } from '../../context/MembershipContext';
import './MembershipRequests.css';

const MembershipRequests = () => {
    const {
        getPendingRequests,
        getApprovedRequests,
        getAllMembers,
        approveRequest,
        rejectRequest
    } = useMembership();

    const [viewingScreenshot, setViewingScreenshot] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [expandedMember, setExpandedMember] = useState(null);

    const pendingRequests = getPendingRequests();
    const approvedRequests = getApprovedRequests();
    const allMembers = getAllMembers();

    const handleApprove = (requestId) => {
        if (window.confirm('Approve this membership request? The user will get access to referral features.')) {
            approveRequest(requestId);
        }
    };

    const handleReject = (requestId) => {
        if (window.confirm('Reject this membership request?')) {
            rejectRequest(requestId);
        }
    };

    return (
        <div className="admin-memberships">
            <div className="admin-memberships__header">
                <div>
                    <h1>Membership Requests</h1>
                    <p>Approve payment screenshots to activate memberships</p>
                </div>
                <div className="header-stats">
                    <div className="stat-badge pending">
                        <Clock size={16} />
                        <span>{pendingRequests.length} Pending</span>
                    </div>
                    <div className="stat-badge active">
                        <UserCheck size={16} />
                        <span>{allMembers.filter(m => m.status === 'active').length} Active</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="memberships-tabs">
                <button
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    <Clock size={18} />
                    Pending Requests
                    {pendingRequests.length > 0 && (
                        <span className="tab-count">{pendingRequests.length}</span>
                    )}
                </button>
                <button
                    className={`tab ${activeTab === 'members' ? 'active' : ''}`}
                    onClick={() => setActiveTab('members')}
                >
                    <Users size={18} />
                    All Members
                    <span className="tab-count">{allMembers.length}</span>
                </button>
            </div>

            {/* Pending Requests Tab */}
            {activeTab === 'pending' && (
                <div className="requests-list">
                    {pendingRequests.length === 0 ? (
                        <div className="empty-state">
                            <Check size={48} />
                            <h3>All caught up!</h3>
                            <p>No pending membership requests at the moment.</p>
                        </div>
                    ) : (
                        pendingRequests.map(request => (
                            <div key={request.id} className="request-card">
                                <div className="request-info">
                                    <div className="user-avatar">
                                        {request.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-details">
                                        <h3>{request.name}</h3>
                                        <p>{request.email}</p>
                                        <span className="mobile">{request.mobile}</span>
                                    </div>
                                </div>

                                <div className="request-meta">
                                    <span className="submitted-time">
                                        <Clock size={14} />
                                        {new Date(request.submittedAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                <div className="request-screenshot">
                                    <button
                                        className="view-screenshot-btn"
                                        onClick={() => setViewingScreenshot(request.screenshotUrl)}
                                    >
                                        <Eye size={18} />
                                        View Screenshot
                                    </button>
                                </div>

                                <div className="request-actions">
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleApprove(request.id)}
                                    >
                                        <Check size={18} />
                                        Approve
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleReject(request.id)}
                                    >
                                        <X size={18} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* All Members Tab */}
            {activeTab === 'members' && (
                <div className="members-list">
                    {allMembers.length === 0 ? (
                        <div className="empty-state">
                            <Users size={48} />
                            <h3>No members yet</h3>
                            <p>Approved members will appear here.</p>
                        </div>
                    ) : (
                        allMembers.map(member => (
                            <div key={member.id} className="member-card">
                                <div
                                    className="member-header"
                                    onClick={() => setExpandedMember(
                                        expandedMember === member.id ? null : member.id
                                    )}
                                >
                                    <div className="member-info">
                                        <div className="member-avatar">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="member-details">
                                            <h3>{member.name}</h3>
                                            <p>{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="member-stats">
                                        <span className={`status-badge ${member.status}`}>
                                            {member.status === 'active' ? 'Active' : 'Completed'}
                                        </span>
                                        <span className="referral-count">
                                            {member.referralCount}/7 Referrals
                                        </span>
                                        {expandedMember === member.id ?
                                            <ChevronUp size={20} /> :
                                            <ChevronDown size={20} />
                                        }
                                    </div>
                                </div>

                                {expandedMember === member.id && (
                                    <div className="member-expanded">
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <span className="label">Referral Code</span>
                                                <span className="value code">{member.referralCode}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Mobile</span>
                                                <span className="value">{member.mobile}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Activated On</span>
                                                <span className="value">
                                                    {new Date(member.activatedAt).toLocaleDateString('en-IN')}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Money Back</span>
                                                <span className={`value ${member.moneyBackClaimed ? 'success' : ''}`}>
                                                    {member.moneyBackClaimed ? '✓ Claimed' : 'Pending'}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Gold Coin</span>
                                                <span className={`value ${member.goldCoinClaimed ? 'gold' : ''}`}>
                                                    {member.goldCoinClaimed ? '🪙 Earned' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        {member.referrals.length > 0 && (
                                            <div className="referral-list">
                                                <h4>Referrals ({member.referrals.length})</h4>
                                                <div className="referral-chips">
                                                    {member.referrals.map((ref, index) => (
                                                        <span key={index} className="referral-chip">
                                                            {ref.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Screenshot Modal */}
            {viewingScreenshot && (
                <div className="screenshot-modal" onClick={() => setViewingScreenshot(null)}>
                    <div className="screenshot-content" onClick={e => e.stopPropagation()}>
                        <button
                            className="close-btn"
                            onClick={() => setViewingScreenshot(null)}
                        >
                            <X size={24} />
                        </button>
                        <img src={viewingScreenshot} alt="Payment Screenshot" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembershipRequests;
