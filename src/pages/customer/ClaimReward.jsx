import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Gift, Award, ArrowLeft, Send,
    Smartphone, User, MapPin, Hash,
    Building, CreditCard, AlertCircle, CheckCircle
} from 'lucide-react';
import { useMembership } from '../../context/MembershipContext';
import { useAuth } from '../../context/AuthContext';
import './ClaimReward.css';

const ClaimReward = () => {
    const { type } = useParams(); // 'cashback' or 'gold'
    const navigate = useNavigate();
    const { user } = useAuth();
    const { submitRewardClaim, getCurrentMembership } = useMembership();
    const membership = getCurrentMembership();

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        phone: user?.mobile || '',
        address: user?.address || '',
        postalCode: '',
        paymentMethod: 'upi', // 'upi' or 'bank'
        upiId: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        branchName: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const isGold = type === 'gold';
    const rewardName = isGold ? 'Pure Gold Coin' : '100% Money Back';
    const icon = isGold ? <Award size={48} className="reward-icon gold" /> : <Gift size={48} className="reward-icon" />;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const claimData = {
                type,
                ...formData,
                email: user?.email,
                membershipId: membership?.id
            };

            await submitRewardClaim(claimData);
            setSubmitted(true);

            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/seller/dashboard');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to submit claim. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <main className="claim-reward-page">
                <div className="container">
                    <div className="success-container">
                        <CheckCircle size={64} className="success-icon" />
                        <h1>Application Submitted!</h1>
                        <p>Your request for {rewardName} has been received. Our team will verify the details and process it within 3-5 business days.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/seller/dashboard')}>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="claim-reward-page">
            <div className="container">
                <button className="back-btn" onClick={() => navigate('/seller/dashboard')}>
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <div className="claim-container">
                    <div className="claim-header">
                        {icon}
                        <h1>Claim Your {rewardName}</h1>
                        <p>Please provide the necessary details for us to process your reward.</p>
                    </div>

                    {error && (
                        <div className="claim-error">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="claim-form">
                        <section className="form-section">
                            <h2><User size={20} /> Personal Details</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        pattern="[0-9]{10}"
                                        placeholder="10-digit mobile"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Shipping Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        placeholder="Full address for delivery (especially for Gold Coin)"
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Postal Code *</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="6-digit PIN"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Payment Details - Only for Cashback */}
                        {!isGold && (
                            <section className="form-section">
                                <h2><Smartphone size={20} /> Payment Details</h2>
                                <div className="payment-method-toggle">
                                    <button
                                        type="button"
                                        className={`toggle-btn ${formData.paymentMethod === 'upi' ? 'active' : ''}`}
                                        onClick={() => setFormData(p => ({ ...p, paymentMethod: 'upi' }))}
                                    >
                                        UPI
                                    </button>
                                    <button
                                        type="button"
                                        className={`toggle-btn ${formData.paymentMethod === 'bank' ? 'active' : ''}`}
                                        onClick={() => setFormData(p => ({ ...p, paymentMethod: 'bank' }))}
                                    >
                                        Bank Transfer
                                    </button>
                                </div>

                                {formData.paymentMethod === 'upi' ? (
                                    <div className="form-group">
                                        <label>UPI ID *</label>
                                        <div className="input-with-icon">
                                            <Smartphone size={18} />
                                            <input
                                                type="text"
                                                name="upiId"
                                                value={formData.upiId}
                                                onChange={handleChange}
                                                required
                                                placeholder="example@upi"
                                            />
                                        </div>
                                        <p className="hint">GPay, PhonePe, or Paytm UPI ID</p>
                                    </div>
                                ) : (
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Bank Name *</label>
                                            <div className="input-with-icon">
                                                <Building size={18} />
                                                <input
                                                    type="text"
                                                    name="bankName"
                                                    value={formData.bankName}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g. SBI, HDFC"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Account Number *</label>
                                            <div className="input-with-icon">
                                                <CreditCard size={18} />
                                                <input
                                                    type="text"
                                                    name="accountNumber"
                                                    value={formData.accountNumber}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Enter account number"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>IFSC Code *</label>
                                            <div className="input-with-icon">
                                                <Hash size={18} />
                                                <input
                                                    type="text"
                                                    name="ifscCode"
                                                    value={formData.ifscCode}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="11-digit IFSC"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Branch Name</label>
                                            <input
                                                type="text"
                                                name="branchName"
                                                value={formData.branchName}
                                                onChange={handleChange}
                                                placeholder="Enter branch name"
                                            />
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        <div className="form-footer">
                            <p className="disclaimer">
                                <AlertCircle size={14} />
                                {isGold
                                    ? 'By submitting, you confirm that the address provided is accurate. Your Gold Coin will be shipped within 7-10 business days.'
                                    : 'By submitting, you confirm that the details provided are accurate. Gurubagavan Sarees is not responsible for transfers made to incorrect UPI IDs or account numbers.'
                                }
                            </p>
                            <button
                                type="submit"
                                className="submit-claim-btn"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : (
                                    <>
                                        Submit Application <Send size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ClaimReward;
