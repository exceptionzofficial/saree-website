import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Copy, Check, CreditCard, Smartphone, AlertCircle, ArrowLeft } from 'lucide-react';
import { useMembership } from '../../context/MembershipContext';
import './MembershipPayment.css';

const MembershipPayment = () => {
    const navigate = useNavigate();
    const { settings, submitPaymentRequest, currentUserEmail } = useMembership();

    const [formData, setFormData] = useState({
        name: '',
        email: currentUserEmail || '',
        mobile: ''
    });
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState('');
    const [copied, setCopied] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        submitPaymentRequest(formData, screenshotPreview);
        setSubmitting(false);
        setSubmitted(true);
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
                    {/* Order Summary */}
                    <div className="payment-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-card">
                            <div className="summary-item">
                                <span className="item-name">Premium Membership</span>
                                <span className="item-price">₹999</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-benefits">
                                <h4>What you'll get:</h4>
                                <ul>
                                    <li>✓ Unique Referral Code</li>
                                    <li>✓ Refer & Earn Program</li>
                                    <li>✓ 100% Money Back on 5 Referrals</li>
                                    <li>✓ Pure Gold Coin on 7 Referrals</li>
                                </ul>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span className="total-amount">₹999</span>
                            </div>
                        </div>

                        <div className="membership-note">
                            <AlertCircle size={18} />
                            <p>
                                <strong>Goal-Based Membership:</strong> Your membership is active until you earn your Gold Coin (7 referrals).
                                To continue referring after that, simply purchase again!
                            </p>
                        </div>
                    </div>

                    {/* Payment Section */}
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
                                    <p className="upi-hint">Pay ₹999 to this UPI ID using GPay, PhonePe, or any UPI app</p>

                                    <div className="qr-code-wrapper" style={{ marginTop: '24px' }}>
                                        <img
                                            src={settings.qrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=gurubagavan@upi&pn=Gurubagavan%20Sarees&am=999&cu=INR'}
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
