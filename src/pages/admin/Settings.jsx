import { useState } from 'react';
import { Save, Upload, Check } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import './Settings.css';

const AdminSettings = () => {
    const { settings, updateSettings } = useOrders();
    const [formData, setFormData] = useState({
        upiId: settings.upiId || '',
        qrCodeUrl: settings.qrCodeUrl || '',
        storeName: settings.storeName || 'Saree Elegance',
        storeEmail: settings.storeEmail || '',
        storePhone: settings.storePhone || '',
        storeAddress: settings.storeAddress || '',
        freeShippingThreshold: settings.freeShippingThreshold || 2000,
        shippingCharge: settings.shippingCharge || 99
    });
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleQrUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, qrCodeUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSettings(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="admin-settings">
            <div className="admin-settings__header">
                <div>
                    <h1 className="admin-settings__title">Settings</h1>
                    <p className="admin-settings__subtitle">Configure your store settings</p>
                </div>
            </div>

            <form className="admin-settings__form" onSubmit={handleSubmit}>
                {/* Payment Settings */}
                <div className="admin-settings__section">
                    <div className="admin-settings__section-header">
                        <h2>Payment Settings</h2>
                        <p>Configure UPI payment details for checkout</p>
                    </div>

                    <div className="admin-settings__grid">
                        <div className="admin-settings__field">
                            <label>UPI ID *</label>
                            <input
                                type="text"
                                name="upiId"
                                value={formData.upiId}
                                onChange={handleChange}
                                placeholder="yourname@upi"
                                required
                            />
                            <span className="admin-settings__hint">
                                This will be shown to customers for payment
                            </span>
                        </div>

                        <div className="admin-settings__field">
                            <label>QR Code Image</label>
                            <div className="admin-settings__qr-upload">
                                {formData.qrCodeUrl && (
                                    <img
                                        src={formData.qrCodeUrl}
                                        alt="QR Code"
                                        className="admin-settings__qr-preview"
                                    />
                                )}
                                <label className="admin-settings__upload-btn">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleQrUpload}
                                        hidden
                                    />
                                    <Upload size={18} />
                                    {formData.qrCodeUrl ? 'Change QR Code' : 'Upload QR Code'}
                                </label>
                            </div>
                            <span className="admin-settings__hint">
                                Upload your GPay/UPI QR code image
                            </span>
                        </div>
                    </div>
                </div>

                {/* Store Settings */}
                <div className="admin-settings__section">
                    <div className="admin-settings__section-header">
                        <h2>Store Information</h2>
                        <p>Your store details shown to customers</p>
                    </div>

                    <div className="admin-settings__grid">
                        <div className="admin-settings__field">
                            <label>Store Name</label>
                            <input
                                type="text"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="admin-settings__field">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="storeEmail"
                                value={formData.storeEmail}
                                onChange={handleChange}
                                placeholder="contact@example.com"
                            />
                        </div>

                        <div className="admin-settings__field">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="storePhone"
                                value={formData.storePhone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div className="admin-settings__field admin-settings__field--full">
                            <label>Store Address</label>
                            <textarea
                                name="storeAddress"
                                value={formData.storeAddress}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Full store address"
                            />
                        </div>
                    </div>
                </div>

                {/* Shipping Settings */}
                <div className="admin-settings__section">
                    <div className="admin-settings__section-header">
                        <h2>Shipping Settings</h2>
                        <p>Configure shipping charges and free shipping threshold</p>
                    </div>

                    <div className="admin-settings__grid">
                        <div className="admin-settings__field">
                            <label>Free Shipping Threshold (₹)</label>
                            <input
                                type="number"
                                name="freeShippingThreshold"
                                value={formData.freeShippingThreshold}
                                onChange={handleChange}
                                min="0"
                            />
                            <span className="admin-settings__hint">
                                Orders above this amount get free shipping
                            </span>
                        </div>

                        <div className="admin-settings__field">
                            <label>Shipping Charge (₹)</label>
                            <input
                                type="number"
                                name="shippingCharge"
                                value={formData.shippingCharge}
                                onChange={handleChange}
                                min="0"
                            />
                            <span className="admin-settings__hint">
                                Shipping charge for orders below threshold
                            </span>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="admin-settings__actions">
                    <button
                        type="submit"
                        className={`btn btn-primary btn-lg ${saved ? 'btn--saved' : ''}`}
                    >
                        {saved ? (
                            <>
                                <Check size={18} />
                                Saved Successfully!
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
