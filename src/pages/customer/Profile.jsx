import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    MapPin,
    ShoppingBag,
    UserPlus,
    Settings,
    LogOut,
    ChevronRight,
    ShieldCheck,
    LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMembership } from '../../context/MembershipContext';
import './Profile.css';

const Profile = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { getUserMembershipStatus } = useMembership();

    const membershipStatus = getUserMembershipStatus();
    const hasActiveMembership = membershipStatus === 'active';

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <main className="profile-page">
            <div className="container">
                <div className="profile-grid">
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="profile-user-card">
                            <div className="profile-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="profile-user-info">
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <nav className="profile-nav">
                            <Link to="/profile" className="profile-nav-item active">
                                <User size={20} />
                                <span>My Profile</span>
                                <ChevronRight size={16} />
                            </Link>
                            <Link to="/orders" className="profile-nav-item">
                                <ShoppingBag size={20} />
                                <span>My Orders</span>
                                <ChevronRight size={16} />
                            </Link>
                            {hasActiveMembership ? (
                                <Link to="/seller/dashboard" className="profile-nav-item highlight">
                                    <LayoutDashboard size={20} />
                                    <span>Member Portal</span>
                                    <ChevronRight size={16} />
                                </Link>
                            ) : (
                                <Link to="/membership" className="profile-nav-item">
                                    <UserPlus size={20} />
                                    <span>Become a Member</span>
                                    <ChevronRight size={16} />
                                </Link>
                            )}
                            <button onClick={logout} className="profile-nav-item logout">
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="profile-content">
                        <section className="profile-section">
                            <div className="section-header">
                                <h2>Account Details</h2>
                                <button className="btn btn-ghost btn-sm">Edit Profile</button>
                            </div>

                            <div className="details-grid">
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <User size={20} />
                                    </div>
                                    <div className="detail-info">
                                        <label>Full Name</label>
                                        <p>{user.name}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <Mail size={20} />
                                    </div>
                                    <div className="detail-info">
                                        <label>Email Address</label>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <Phone size={20} />
                                    </div>
                                    <div className="detail-info">
                                        <label>Mobile Number</label>
                                        <p>{user.mobile}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">
                                        <UserPlus size={20} />
                                    </div>
                                    <div className="detail-info">
                                        <label>Referral ID</label>
                                        <p>{user.referralId || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="profile-section">
                            <div className="section-header">
                                <h2>Shipping Address</h2>
                                <button className="btn btn-ghost btn-sm">Change</button>
                            </div>
                            <div className="address-card">
                                <MapPin size={24} className="address-icon" />
                                <div className="address-info">
                                    <p>{user.address}</p>
                                </div>
                            </div>
                        </section>

                        {hasActiveMembership && (
                            <section className="profile-section membership-status">
                                <div className="membership-card">
                                    <div className="membership-icon">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <div className="membership-content">
                                        <h3>Member Account</h3>
                                        <p>You have full access to the Member Portal and referral benefits.</p>
                                        <Link to="/seller/dashboard" className="btn btn-primary btn-sm">
                                            Go to Member Portal
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;
