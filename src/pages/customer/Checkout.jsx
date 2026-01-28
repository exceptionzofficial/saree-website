import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    MapPin,
    Phone,
    User,
    Mail,
    Upload,
    Check,
    ArrowLeft,
    Shield,
    Smartphone
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, getCartTotal, clearCart } = useCart();
    const { settings, getShippingCharge, createOrder } = useOrders();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
    });
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = getCartTotal();
    const shipping = getShippingCharge(subtotal);
    const total = subtotal + shipping;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
            setPaymentScreenshot(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateAddress = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit phone number';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter valid 6-digit pincode';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        if (validateAddress()) {
            setStep(2);
        }
    };

    const handlePlaceOrder = async () => {
        if (!paymentScreenshot) {
            alert('Please upload payment screenshot');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                customer: formData,
                items: items,
                subtotal: subtotal,
                shipping: shipping,
                total: total,
                paymentScreenshot: screenshotPreview,
                paymentMethod: 'UPI'
            };

            const order = createOrder(orderData);
            clearCart();
            navigate(`/order-confirmation/${order.id}`);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <main className="checkout checkout--empty">
                <div className="container">
                    <div className="checkout__empty-state">
                        <h2>Your cart is empty</h2>
                        <p>Add some beautiful sarees to your cart first!</p>
                        <Link to="/shop" className="btn btn-primary">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout">
            <div className="container">
                {/* Progress Steps */}
                <div className="checkout__progress">
                    <div className={`checkout__step ${step >= 1 ? 'checkout__step--active' : ''}`}>
                        <span className="checkout__step-number">1</span>
                        <span className="checkout__step-label">Shipping</span>
                    </div>
                    <div className="checkout__step-line"></div>
                    <div className={`checkout__step ${step >= 2 ? 'checkout__step--active' : ''}`}>
                        <span className="checkout__step-number">2</span>
                        <span className="checkout__step-label">Payment</span>
                    </div>
                </div>

                <div className="checkout__content">
                    {/* Main Section */}
                    <div className="checkout__main">
                        {step === 1 && (
                            <div className="checkout__section">
                                <div className="checkout__section-header">
                                    <MapPin size={24} />
                                    <h2>Shipping Address</h2>
                                </div>

                                <form onSubmit={handleAddressSubmit} className="checkout__form">
                                    <div className="checkout__form-row">
                                        <div className="checkout__field">
                                            <label>Full Name *</label>
                                            <div className="checkout__input-wrapper">
                                                <User size={18} />
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your full name"
                                                    className={errors.fullName ? 'error' : ''}
                                                />
                                            </div>
                                            {errors.fullName && <span className="checkout__error">{errors.fullName}</span>}
                                        </div>

                                        <div className="checkout__field">
                                            <label>Phone Number *</label>
                                            <div className="checkout__input-wrapper">
                                                <Phone size={18} />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="10-digit mobile number"
                                                    className={errors.phone ? 'error' : ''}
                                                />
                                            </div>
                                            {errors.phone && <span className="checkout__error">{errors.phone}</span>}
                                        </div>
                                    </div>

                                    <div className="checkout__field">
                                        <label>Email (Optional)</label>
                                        <div className="checkout__input-wrapper">
                                            <Mail size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="checkout__field">
                                        <label>Complete Address *</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="House/Flat No., Building, Street, Area"
                                            rows={3}
                                            className={errors.address ? 'error' : ''}
                                        />
                                        {errors.address && <span className="checkout__error">{errors.address}</span>}
                                    </div>

                                    <div className="checkout__form-row checkout__form-row--3">
                                        <div className="checkout__field">
                                            <label>City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="City"
                                                className={errors.city ? 'error' : ''}
                                            />
                                            {errors.city && <span className="checkout__error">{errors.city}</span>}
                                        </div>

                                        <div className="checkout__field">
                                            <label>State *</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                placeholder="State"
                                                className={errors.state ? 'error' : ''}
                                            />
                                            {errors.state && <span className="checkout__error">{errors.state}</span>}
                                        </div>

                                        <div className="checkout__field">
                                            <label>Pincode *</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                placeholder="6-digit"
                                                maxLength={6}
                                                className={errors.pincode ? 'error' : ''}
                                            />
                                            {errors.pincode && <span className="checkout__error">{errors.pincode}</span>}
                                        </div>
                                    </div>

                                    <div className="checkout__field">
                                        <label>Landmark (Optional)</label>
                                        <input
                                            type="text"
                                            name="landmark"
                                            value={formData.landmark}
                                            onChange={handleInputChange}
                                            placeholder="Near temple, school, etc."
                                        />
                                    </div>

                                    <div className="checkout__form-actions">
                                        <Link to="/cart" className="btn btn-ghost">
                                            <ArrowLeft size={18} />
                                            Back to Cart
                                        </Link>
                                        <button type="submit" className="btn btn-primary btn-lg">
                                            Continue to Payment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="checkout__section">
                                <div className="checkout__section-header">
                                    <Smartphone size={24} />
                                    <h2>Pay via UPI / GPay</h2>
                                </div>

                                <div className="checkout__payment">
                                    <div className="checkout__payment-info">
                                        <div className="checkout__payment-amount">
                                            <span>Amount to Pay</span>
                                            <strong>₹{total.toLocaleString()}</strong>
                                        </div>
                                    </div>

                                    <div className="checkout__qr-section">
                                        <div className="checkout__qr-wrapper">
                                            {settings.qrCodeUrl ? (
                                                <img
                                                    src={settings.qrCodeUrl}
                                                    alt="Payment QR Code"
                                                    className="checkout__qr-image"
                                                />
                                            ) : (
                                                <div className="checkout__qr-placeholder">
                                                    <Smartphone size={48} />
                                                    <p>QR Code</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="checkout__upi-info">
                                            <p className="checkout__upi-label">Or pay using UPI ID:</p>
                                            <div className="checkout__upi-id">
                                                <span>{settings.upiId}</span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(settings.upiId)}
                                                    className="checkout__copy-btn"
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="checkout__payment-steps">
                                        <h4>Steps to Pay:</h4>
                                        <ol>
                                            <li>Open GPay, PhonePe, or any UPI app</li>
                                            <li>Scan the QR code or enter the UPI ID</li>
                                            <li>Enter amount: <strong>₹{total.toLocaleString()}</strong></li>
                                            <li>Complete the payment</li>
                                            <li>Take a screenshot of the payment confirmation</li>
                                            <li>Upload the screenshot below</li>
                                        </ol>
                                    </div>

                                    <div className="checkout__upload-section">
                                        <h4>Upload Payment Screenshot *</h4>
                                        <p>Please upload the screenshot of your payment confirmation</p>

                                        <label className="checkout__upload-area">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                hidden
                                            />
                                            {screenshotPreview ? (
                                                <div className="checkout__upload-preview">
                                                    <img src={screenshotPreview} alt="Payment Screenshot" />
                                                    <span className="checkout__upload-change">Click to change</span>
                                                </div>
                                            ) : (
                                                <div className="checkout__upload-placeholder">
                                                    <Upload size={32} />
                                                    <span>Click to upload screenshot</span>
                                                    <span className="checkout__upload-hint">PNG, JPG up to 5MB</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>

                                    <div className="checkout__form-actions">
                                        <button
                                            type="button"
                                            className="btn btn-ghost"
                                            onClick={() => setStep(1)}
                                        >
                                            <ArrowLeft size={18} />
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-lg"
                                            onClick={handlePlaceOrder}
                                            disabled={!paymentScreenshot || isSubmitting}
                                        >
                                            {isSubmitting ? 'Placing Order...' : 'Place Order'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="checkout__sidebar">
                        <div className="checkout__summary">
                            <h3 className="checkout__summary-title">Order Summary</h3>

                            <div className="checkout__summary-items">
                                {items.map(item => (
                                    <div key={item.id} className="checkout__summary-item">
                                        <div className="checkout__summary-item-image">
                                            <img src={item.images[0]} alt={item.name} />
                                            <span className="checkout__summary-item-qty">{item.quantity}</span>
                                        </div>
                                        <div className="checkout__summary-item-info">
                                            <span className="checkout__summary-item-name">{item.name}</span>
                                            <span className="checkout__summary-item-price">
                                                ₹{(item.discountPrice * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="checkout__summary-totals">
                                <div className="checkout__summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="checkout__summary-row">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                </div>
                                <div className="checkout__summary-divider"></div>
                                <div className="checkout__summary-row checkout__summary-total">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="checkout__trust">
                                <Shield size={18} />
                                <span>Your payment is 100% secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Checkout;
