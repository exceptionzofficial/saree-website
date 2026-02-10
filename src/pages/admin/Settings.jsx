import { useState, useEffect } from 'react';
import { Save, Check, Plus, X, Megaphone } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import './Settings.css';

const AdminSettings = () => {
    const { settings, updateSettings } = useOrders();
    const [formData, setFormData] = useState({
        upiId: settings.upiId || '',
        membershipPrice: settings.membershipPrice || 999,
        storeName: settings.storeName || 'Saree Elegance',
        storeEmail: settings.storeEmail || '',
        storePhone: settings.storePhone || '',
        storeAddress: settings.storeAddress || '',
        freeShippingThreshold: settings.freeShippingThreshold || settings.freeShippingAbove || 2000,
        shippingCharge: settings.shippingCharge || 99,
        announcements: settings.announcements || [],
        membershipPlans: settings.membershipPlans || []
    });
    const [newAnnouncement, setNewAnnouncement] = useState('');
    const [saved, setSaved] = useState(false);

    // Sync form data with settings when they load
    useEffect(() => {
        if (settings) {
            setFormData({
                upiId: settings.upiId || '',
                membershipPrice: settings.membershipPrice || 999,
                storeName: settings.storeName || 'Saree Elegance',
                storeEmail: settings.storeEmail || '',
                storePhone: settings.storePhone || '',
                storeAddress: settings.storeAddress || '',
                freeShippingThreshold: settings.freeShippingThreshold || settings.freeShippingAbove || 2000,
                shippingCharge: settings.shippingCharge || 99,
                announcements: settings.announcements || [],
                membershipPlans: settings.membershipPlans || []
            });
        }
    }, [settings]);

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

    const addAnnouncement = () => {
        if (newAnnouncement.trim()) {
            setFormData(prev => ({
                ...prev,
                announcements: [...prev.announcements, newAnnouncement.trim()]
            }));
            setNewAnnouncement('');
        }
    };

    const removeAnnouncement = (index) => {
        setFormData(prev => ({
            ...prev,
            announcements: prev.announcements.filter((_, i) => i !== index)
        }));
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
                {/* Membership Plans Settings */}
                <div className="admin-settings__section">
                    <div className="admin-settings__section-header">
                        <h2>Membership Plans</h2>
                        <p>Manage different membership levels and their rewards</p>
                    </div>

                    <div className="plans-editor">
                        {formData.membershipPlans?.map((plan, planIndex) => (
                            <div key={planIndex} className="plan-editor-card">
                                <div className="plan-editor-row">
                                    <div className="admin-settings__field">
                                        <label>Plan Name</label>
                                        <input
                                            type="text"
                                            value={plan.name}
                                            onChange={(e) => {
                                                const newPlans = [...formData.membershipPlans];
                                                newPlans[planIndex].name = e.target.value;
                                                setFormData({ ...formData, membershipPlans: newPlans });
                                            }}
                                        />
                                    </div>
                                    <div className="admin-settings__field">
                                        <label>Price (₹)</label>
                                        <input
                                            type="number"
                                            value={plan.price}
                                            onChange={(e) => {
                                                const newPlans = [...formData.membershipPlans];
                                                newPlans[planIndex].price = parseInt(e.target.value);
                                                setFormData({ ...formData, membershipPlans: newPlans });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="plan-editor-row">
                                    <div className="admin-settings__field">
                                        <div className="goal-toggle-row">
                                            <label>Cashback Goal (Referrals)</label>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={plan.cashbackEnabled !== false}
                                                    onChange={(e) => {
                                                        const newPlans = [...formData.membershipPlans];
                                                        newPlans[planIndex].cashbackEnabled = e.target.checked;
                                                        setFormData({ ...formData, membershipPlans: newPlans });
                                                    }}
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                        <input
                                            type="number"
                                            value={plan.cashbackGoal}
                                            disabled={plan.cashbackEnabled === false}
                                            onChange={(e) => {
                                                const newPlans = [...formData.membershipPlans];
                                                newPlans[planIndex].cashbackGoal = parseInt(e.target.value);
                                                setFormData({ ...formData, membershipPlans: newPlans });
                                            }}
                                        />
                                    </div>
                                    <div className="admin-settings__field">
                                        <div className="goal-toggle-row">
                                            <label>Gold Coin Goal (Referrals)</label>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={plan.goldEnabled !== false}
                                                    onChange={(e) => {
                                                        const newPlans = [...formData.membershipPlans];
                                                        newPlans[planIndex].goldEnabled = e.target.checked;
                                                        setFormData({ ...formData, membershipPlans: newPlans });
                                                    }}
                                                />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                        <input
                                            type="number"
                                            value={plan.goldGoal}
                                            disabled={plan.goldEnabled === false}
                                            onChange={(e) => {
                                                const newPlans = [...formData.membershipPlans];
                                                newPlans[planIndex].goldGoal = parseInt(e.target.value);
                                                setFormData({ ...formData, membershipPlans: newPlans });
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => {
                                        const newPlans = formData.membershipPlans.filter((_, i) => i !== planIndex);
                                        setFormData({ ...formData, membershipPlans: newPlans });
                                    }}
                                >
                                    Remove Plan
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => {
                                const newPlans = [...(formData.membershipPlans || []), {
                                    id: `plan_${Date.now()}`,
                                    name: 'New Plan',
                                    price: 999,
                                    cashbackEnabled: true,
                                    cashbackGoal: 5,
                                    goldEnabled: true,
                                    goldGoal: 7,
                                    features: []
                                }];
                                setFormData({ ...formData, membershipPlans: newPlans });
                            }}
                        >
                            <Plus size={18} /> Add New Plan
                        </button>
                    </div>
                </div>

                {/* Announcement Settings */}
                <div className="admin-settings__section">
                    <div className="admin-settings__section-header">
                        <h2><Megaphone size={20} style={{ marginRight: '8px', display: 'inline' }} />Announcement Bar</h2>
                        <p>Add scrolling announcements to display at the top of your store</p>
                    </div>

                    <div className="admin-settings__announcements">
                        <div className="admin-settings__announcement-add">
                            <input
                                type="text"
                                value={newAnnouncement}
                                onChange={(e) => setNewAnnouncement(e.target.value)}
                                placeholder="🚚 Free delivery on orders above ₹2000!"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAnnouncement())}
                            />
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={addAnnouncement}
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>

                        {formData.announcements.length > 0 && (
                            <div className="admin-settings__announcement-list">
                                {formData.announcements.map((text, index) => (
                                    <div key={index} className="admin-settings__announcement-item">
                                        <span>{text}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeAnnouncement(index)}
                                            className="admin-settings__announcement-remove"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <span className="admin-settings__hint">
                            Add emoji-enhanced announcements for promotions, offers, or news. They will scroll automatically!
                        </span>
                    </div>
                </div>

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
                                QR code will be auto-generated for customers based on this UPI ID
                            </span>
                        </div>

                        {/* <div className="admin-settings__field">
                            <label>Membership Price (₹)</label>
                            <input
                                type="number"
                                name="membershipPrice"
                                value={formData.membershipPrice}
                                onChange={handleChange}
                                min="0"
                            />
                            <span className="admin-settings__hint">
                                Price for premium membership subscription
                            </span>
                        </div> */}
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

                {/* <div className="admin-settings__section">
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
                </div> */}

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
