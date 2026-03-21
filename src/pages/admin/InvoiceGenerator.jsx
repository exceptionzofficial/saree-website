import { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, User, Phone, MapPin, Package, Download } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { generateInvoice } from '../../utils/invoiceGenerator';
import logoImg from '../../assets/logo.png';
import './InvoiceGenerator.css';

const InvoiceGenerator = () => {
    const { settings } = useOrders();
    const { products } = useProducts();
    const [logoBase64, setLogoBase64] = useState(null);

    const [customerData, setCustomerData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });

    const [invoiceItems, setInvoiceItems] = useState([
        { id: Date.now(), productId: '', name: '', quantity: 1, price: 0 }
    ]);

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [orderId, setOrderId] = useState(`OFF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    const [shippingCharge, setShippingCharge] = useState(0);
    const [gstPercentage, setGstPercentage] = useState(5);

    // Load logo and convert to base64 for PDF
    useEffect(() => {
        const img = new Image();
        img.src = logoImg;
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            setLogoBase64(canvas.toDataURL('image/png'));
        };
    }, []);

    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setCustomerData(prev => ({ ...prev, [name]: value }));
    };

    const addItem = () => {
        setInvoiceItems([...invoiceItems, { id: Date.now(), productId: '', name: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (id) => {
        if (invoiceItems.length > 1) {
            setInvoiceItems(invoiceItems.filter(item => item.id !== id));
        }
    };

    const handleItemChange = (id, field, value) => {
        setInvoiceItems(prev => prev.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                
                // If product is selected, auto-fill name and price
                if (field === 'productId' && value !== '') {
                    const product = products.find(p => p.id === value);
                    if (product) {
                        updatedItem.name = product.name;
                        updatedItem.price = product.discountPrice || product.price;
                    }
                }
                return updatedItem;
            }
            return item;
        }));
    };

    const calculateSubtotal = () => {
        return invoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleGenerateInvoice = () => {
        if (!customerData.name || !customerData.phone) {
            alert('Please enter customer name and phone');
            return;
        }

        const subtotal = calculateSubtotal();
        const gstAmount = subtotal * (gstPercentage / 100);

        const order = {
            id: orderId,
            orderId: orderId,
            createdAt: new Date(date).toISOString(),
            customer: {
                fullName: customerData.name,
                phone: customerData.phone,
                email: customerData.email,
                address: customerData.address
            },
            items: invoiceItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                discountPrice: item.price
            })),
            subtotal: subtotal,
            gstPercentage: gstPercentage,
            gstAmount: gstAmount,
            total: subtotal + gstAmount + shippingCharge,
            shippingCharge: shippingCharge
        };

        const settingsWithGst = {
            ...settings,
            gstNumber: "33IHMPB2726R1ZV"
        };

        generateInvoice(order, settingsWithGst, logoBase64);
    };

    return (
        <div className="invoice-gen">
            <div className="admin-page__header">
                <div>
                    <h1 className="admin-page__title">Invoice Generator</h1>
                    <p className="admin-page__subtitle">Create invoices for offline clients</p>
                </div>
            </div>

            <div className="invoice-gen__content">
                <div className="invoice-gen__card">
                    <div className="invoice-gen__section">
                        <h3 className="invoice-gen__section-title">
                            <User size={18} />
                            Customer Details
                        </h3>
                        <div className="invoice-gen__form-grid">
                            <div className="invoice-gen__field">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={customerData.name}
                                    onChange={handleCustomerChange}
                                    placeholder="Enter customer name"
                                />
                            </div>
                            <div className="invoice-gen__field">
                                <label>Phone *</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={customerData.phone}
                                    onChange={handleCustomerChange}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div className="invoice-gen__field">
                                <label>Email (Optional)</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={customerData.email}
                                    onChange={handleCustomerChange}
                                    placeholder="Enter email"
                                />
                            </div>
                            <div className="invoice-gen__field">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="invoice-gen__field full-width">
                            <label>Address</label>
                            <textarea
                                name="address"
                                value={customerData.address}
                                onChange={handleCustomerChange}
                                placeholder="Enter customer address"
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="invoice-gen__section">
                        <h3 className="invoice-gen__section-title">
                            <Package size={18} />
                            Items
                        </h3>
                        <div className="invoice-gen__items">
                            <div className="invoice-gen__items-header">
                                <span>Product</span>
                                <span>Qty</span>
                                <span>Price</span>
                                <span>Total</span>
                                <span></span>
                            </div>
                            {invoiceItems.map((item) => (
                                <div key={item.id} className="invoice-gen__item-row">
                                    <div className="invoice-gen__item-product">
                                        <select
                                            value={item.productId}
                                            onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)}
                                        >
                                            <option value="">Select Saree (Optional)</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} - ₹{p.discountPrice || p.price}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                            placeholder="Item Name"
                                        />
                                    </div>
                                    <div className="invoice-gen__item-qty">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                            min="1"
                                        />
                                    </div>
                                    <div className="invoice-gen__item-price">
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="invoice-gen__item-total">
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </div>
                                    <button className="invoice-gen__remove" onClick={() => removeItem(item.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button className="invoice-gen__add-btn" onClick={addItem}>
                                <Plus size={18} /> Add Another Item
                            </button>
                        </div>
                    </div>

                    <div className="invoice-gen__footer">
                        <div className="invoice-gen__summary">
                            <div className="invoice-gen__summary-row">
                                <span>Subtotal</span>
                                <span>₹{calculateSubtotal().toLocaleString()}</span>
                            </div>
                            <div className="invoice-gen__summary-row shipping-edit">
                                <span>Shipping Charge</span>
                                <div className="invoice-gen__shipping-input">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        value={shippingCharge}
                                        onChange={(e) => setShippingCharge(parseFloat(e.target.value) || 0)}
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="invoice-gen__summary-row shipping-edit">
                                <span>GST Percentage</span>
                                <div className="invoice-gen__shipping-input">
                                    <input
                                        type="number"
                                        value={gstPercentage}
                                        onChange={(e) => setGstPercentage(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        max="100"
                                    />
                                    <span>%</span>
                                </div>
                            </div>
                            <div className="invoice-gen__summary-row">
                                <span>GST Amount</span>
                                <span>₹{(calculateSubtotal() * (gstPercentage / 100)).toLocaleString()}</span>
                            </div>
                            <div className="invoice-gen__summary-row total">
                                <span>Grand Total</span>
                                <span>₹{(calculateSubtotal() + (calculateSubtotal() * (gstPercentage / 100)) + shippingCharge).toLocaleString()}</span>
                            </div>
                        </div>
                        <button className="btn btn-primary btn-lg" onClick={handleGenerateInvoice}>
                            <Download size={20} /> Generate & Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceGenerator;
