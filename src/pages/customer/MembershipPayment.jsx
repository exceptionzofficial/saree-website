import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, Copy, Check, CreditCard, Smartphone, AlertCircle, ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useMembership } from '../../context/MembershipContext';
import { useOrders, generateUPIQRUrl } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import './MembershipPayment.css';

const MembershipPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { submitPaymentRequest } = useMembership();
    const { settings } = useOrders();
    const { user, isAuthenticated } = useAuth();
    const { products } = useProducts();

    // Get plan details
    const selectedPlanId = location.state?.planId || 'premium';
    const plan = settings.membershipPlans?.find(p => p.id === selectedPlanId) || {
        id: 'premium',
        name: 'Premium Member',
        price: 999,
        cashbackGoal: 5,
        goldGoal: 7
    };

    const membershipPrice = plan.price;

    // Auto-fill from logged-in user
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || ''
    });
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState('');
    const [copied, setCopied] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [selectedSarees, setSelectedSarees] = useState([]);

    // Filter products applicable for this plan
    const availableSarees = products.filter(p =>
        p.applicablePlans?.includes(selectedPlanId) && p.inStock
    );

    const sareeLimit = plan.sareeLimit || 0;

    const toggleSaree = (sareeId) => {
        if (selectedSarees.includes(sareeId)) {
            setSelectedSarees(prev => prev.filter(id => id !== sareeId));
        } else {
            if (selectedSarees.length >= sareeLimit) {
                alert(`You can only select up to ${sareeLimit} sarees with this plan.`);
                return;
            }
            setSelectedSarees(prev => [...prev, sareeId]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleScreenshotUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const copyUpiId = () => {
        navigator.clipboard.writeText(settings.upiId || 'gurubagavan@upi');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!screenshot) {
            alert('Please upload payment screenshot');
            return;
        }

        setSubmitting(true);

        try {
            await submitPaymentRequest(formData, screenshot, selectedPlanId, selectedSarees);
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting payment:', error);
            alert('Failed to submit payment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <main className="membership-payment">
                <div className="container">
                    <div className="payment-success">
                        <div className="success-icon">
                            <Check size={48} />
                        </div>
                        <h1>Payment Submitted!</h1>
                        <p>Your payment is under review. You will be notified once approved.</p>
                        <div className="success-info">
                            <AlertCircle size={20} />
                            <span>Approval usually takes 2-4 hours during business hours.</span>
                        </div>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate('/seller/dashboard')}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="membership-payment">
            <div className="container">
                <button className="back-btn" onClick={() => navigate('/membership')}>
                    <ArrowLeft size={20} />
                    Back to Membership
                </button>

                <div className="payment-container">
                    {/* Order Summary Column */}
                    <div className="payment-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-card">
                            <div className="summary-item">
                                <span className="item-name">{plan.name}</span>
                                <span className="item-price">₹{membershipPrice.toLocaleString()}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-benefits">
                                <h4>What you'll get:</h4>
                                <ul>
                                    <li>✓ Unique Referral Code</li>
                                    <li>✓ Refer & Earn Program</li>
                                    {plan.cashbackEnabled !== false && (
                                        <li>✓ 100% Money Back on {plan.cashbackGoal} Referrals</li>
                                    )}
                                    {plan.goldEnabled !== false && (
                                        <li>✓ Pure Gold Coin on {plan.goldGoal} Referrals</li>
                                    )}
                                    {sareeLimit > 0 && (
                                        <li>✓ {sareeLimit} {sareeLimit === 1 ? 'Free Saree' : 'Free Sarees'} Included</li>
                                    )}
                                </ul>
                            </div>
                            <div className="summary-divider"></div>
                            {selectedSarees.length > 0 && (
                                <div className="summary-selected-sarees">
                                    <h4>Included Benefits:</h4>
                                    {selectedSarees.map(id => {
                                        const saree = products.find(p => p.id === id);
                                        return saree ? (
                                            <div key={id} className="selected-saree-item">
                                                <img src={saree.images?.[0] || saree.image} alt={saree.name} />
                                                <div className="selected-saree-details">
                                                    <span className="saree-name">{saree.name}</span>
                                                    <span className="saree-price">Benefit Item</span>
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                    <div className="summary-divider"></div>
                                </div>
                            )}
                            <div className="summary-total">
                                <span>Total</span>
                                <span className="total-amount">₹{membershipPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Product Selection */}
                        {availableSarees.length > 0 && (
                            <div className="saree-selection">
                                <div className="saree-selection__header">
                                    <h3>Select Your Benefit Sarees</h3>
                                    <span className={selectedSarees.length >= sareeLimit ? 'limit-reached' : ''}>
                                        {selectedSarees.length} / {sareeLimit} Selected
                                    </span>
                                </div>
                                <div className="saree-selection__grid">
                                    {availableSarees.map(saree => (
                                        <div
                                            key={saree.id}
                                            className={`saree-benefit-card ${selectedSarees.includes(saree.id) ? 'selected' : ''}`}
                                            onClick={() => toggleSaree(saree.id)}
                                        >
                                            <div className="saree-benefit-image">
                                                <img src={saree.images?.[0] || saree.image} alt={saree.name} />
                                                {selectedSarees.includes(saree.id) && (
                                                    <div className="selected-overlay">
                                                        <Check size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="saree-benefit-info">
                                                <span className="saree-name">{saree.name}</span>
                                                <span className="saree-material">{saree.material}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {sareeLimit > 0 && (
                                    <p className="saree-selection__hint">
                                        Choose {sareeLimit} items as part of your membership benefits.
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="membership-note">
                            <AlertCircle size={18} />
                            <p>
                                <strong>Goal-Based Membership:</strong> Your {plan.name} is active until you complete all enabled goals.
                                {plan.cashbackEnabled !== false && ` Cashback at ${plan.cashbackGoal} referrals.`}
                                {plan.goldEnabled !== false && ` Gold Coin at ${plan.goldGoal} referrals.`}
                                {' '}To continue referring after that, simply purchase again!
                            </p>
                        </div>
                    </div>

                    {/* Payment Section Column */}
                    <div className="payment-form-section">
                        <h2>Complete Payment</h2>

                        {/* UPI Payment Info */}
                        <div className="upi-payment-card">
                            <div className="upi-header">
                                <Smartphone size={24} />
                                <span>Pay via UPI</span>
                            </div>

                            <div className="upi-details">
                                <div className="upi-id-section">
                                    <label>UPI ID</label>
                                    <div className="upi-id-copy">
                                        <span>{settings.upiId || 'gurubagavan@upi'}</span>
                                        <button type="button" onClick={copyUpiId} className="copy-btn">
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                            {copied ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    <p className="upi-hint">Pay ₹{membershipPrice.toLocaleString()} to this UPI ID using GPay, PhonePe, or any UPI app</p>

                                    <div className="qr-code-wrapper" style={{ marginTop: '24px' }}>
                                        <img
                                            src={generateUPIQRUrl(settings.upiId || 'gurubagavan@upi', settings.storeName || 'Gurubagavan Sarees', membershipPrice)}
                                            alt="Payment QR Code"
                                        />
                                        <span>Scan to Pay</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Form */}
                        <form onSubmit={handleSubmit} className="payment-form">
                            <h3>After Payment</h3>
                            <p className="form-subtitle">Fill your details and upload payment screenshot</p>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number *</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="10-digit mobile"
                                        pattern="[0-9]{10}"
                                        required
                                    />
                                </div>
                                <div className="form-group form-group--full">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="screenshot-upload">
                                <label>Payment Screenshot *</label>
                                <div className={`upload-area ${screenshotPreview ? 'has-preview' : ''}`}>
                                    {screenshotPreview ? (
                                        <div className="preview-container">
                                            <img src={screenshotPreview} alt="Payment Screenshot" />
                                            <button
                                                type="button"
                                                className="change-btn"
                                                onClick={() => document.getElementById('screenshot-input').click()}
                                            >
                                                Change
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="upload-label" htmlFor="screenshot-input">
                                            <Upload size={32} />
                                            <span>Click to upload screenshot</span>
                                            <span className="upload-hint">PNG, JPG up to 5MB</span>
                                        </label>
                                    )}
                                    <input
                                        id="screenshot-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleScreenshotUpload}
                                        hidden
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg btn-block"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit for Approval'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MembershipPayment;
