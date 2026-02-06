import { useState } from 'react';
import { Search, Filter, Eye, Check, X, ChevronDown } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import './Orders.css';

const AdminOrders = () => {
    const {
        orders,
        updateOrderStatus,
        verifyPayment,
        rejectPayment
    } = useOrders();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const filteredOrders = orders.filter(order => {
        const orderIdVal = order.orderId || order.id || '';
        const customerName = order.customer.fullName || order.customer.name || '';
        const matchesSearch =
            orderIdVal.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.phone.includes(searchTerm);
        const matchesStatus = !statusFilter || order.status === statusFilter;
        const matchesPayment = !paymentFilter || order.paymentStatus === paymentFilter;
        return matchesSearch && matchesStatus && matchesPayment;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusChange = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
        if (selectedOrder && (selectedOrder.orderId === orderId || selectedOrder.id === orderId)) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
    };

    const handleVerifyPayment = (orderId) => {
        verifyPayment(orderId);
        if (selectedOrder && (selectedOrder.orderId === orderId || selectedOrder.id === orderId)) {
            setSelectedOrder({ ...selectedOrder, paymentStatus: 'verified' });
        }
    };

    const handleRejectPayment = (orderId) => {
        rejectPayment(orderId);
        if (selectedOrder && (selectedOrder.orderId === orderId || selectedOrder.id === orderId)) {
            setSelectedOrder({ ...selectedOrder, paymentStatus: 'rejected' });
        }
    };

    const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    return (
        <div className="admin-orders">
            <div className="admin-orders__header">
                <div>
                    <h1 className="admin-orders__title">Orders</h1>
                    <p className="admin-orders__subtitle">Manage customer orders and payments</p>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-orders__filters">
                <div className="admin-orders__search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search orders by ID, name, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="admin-orders__select"
                >
                    <option value="">All Status</option>
                    {statusOptions.map(status => (
                        <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                    ))}
                </select>
                <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="admin-orders__select"
                >
                    <option value="">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="admin-orders__content">
                {/* Orders List */}
                <div className="admin-orders__list">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <div
                                key={order.orderId || order.id}
                                className={`admin-orders__card ${(selectedOrder?.orderId === order.orderId || selectedOrder?.id === order.id) ? 'admin-orders__card--active' : ''}`}
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div className="admin-orders__card-header">
                                    <div>
                                        <span className="admin-orders__card-id">{order.orderId || order.id}</span>
                                        <span className="admin-orders__card-date">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className="admin-orders__card-badges">
                                        <span className={`admin-orders__status status--${order.status}`}>
                                            {order.status}
                                        </span>
                                        <span className={`admin-orders__payment payment--${order.paymentStatus}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                                <div className="admin-orders__card-body">
                                    <span className="admin-orders__card-customer">{order.customer.fullName || order.customer.name}</span>
                                    <span className="admin-orders__card-total">₹{order.total.toLocaleString()}</span>
                                </div>
                                <div className="admin-orders__card-items">
                                    {order.items.slice(0, 3).map(item => (
                                        <img key={item.id} src={item.images[0]} alt={item.name} />
                                    ))}
                                    {order.items.length > 3 && (
                                        <span className="admin-orders__card-more">+{order.items.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="admin-orders__empty">
                            <p>No orders found</p>
                        </div>
                    )}
                </div>

                {/* Order Details */}
                {selectedOrder && (
                    <div className="admin-orders__details">
                        <div className="admin-orders__details-header">
                            <h2>Order Details</h2>
                            <button
                                className="admin-orders__details-close"
                                onClick={() => setSelectedOrder(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="admin-orders__details-content">
                            {/* Order Info */}
                            <div className="admin-orders__detail-section">
                                <h3>Order Information</h3>
                                <div className="admin-orders__detail-grid">
                                    <div className="admin-orders__detail-item">
                                        <span>Order ID</span>
                                        <strong>{selectedOrder.orderId || selectedOrder.id}</strong>
                                    </div>
                                    <div className="admin-orders__detail-item">
                                        <span>Date</span>
                                        <strong>{formatDate(selectedOrder.createdAt)}</strong>
                                    </div>
                                    <div className="admin-orders__detail-item">
                                        <span>Status</span>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => handleStatusChange(selectedOrder.orderId || selectedOrder.id, e.target.value)}
                                            className={`admin-orders__status-select status--${selectedOrder.status}`}
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="admin-orders__detail-item">
                                        <span>Payment</span>
                                        <strong className={`payment--${selectedOrder.paymentStatus}`}>
                                            {selectedOrder.paymentStatus}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="admin-orders__detail-section">
                                <h3>Customer</h3>
                                <p className="admin-orders__customer-name">{selectedOrder.customer.fullName || selectedOrder.customer.name}</p>
                                <p className="admin-orders__customer-contact">
                                    {selectedOrder.customer.phone}<br />
                                    {selectedOrder.customer.email}
                                </p>
                                <p className="admin-orders__customer-address">
                                    {selectedOrder.customer.address}<br />
                                    {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                                </p>
                            </div>

                            {/* Items */}
                            <div className="admin-orders__detail-section">
                                <h3>Items</h3>
                                <div className="admin-orders__items">
                                    {selectedOrder.items.map(item => (
                                        <div key={item.id} className="admin-orders__item">
                                            <img src={item.images[0]} alt={item.name} />
                                            <div className="admin-orders__item-info">
                                                <span className="admin-orders__item-name">{item.name}</span>
                                                <span className="admin-orders__item-qty">Qty: {item.quantity}</span>
                                            </div>
                                            <span className="admin-orders__item-price">
                                                ₹{(item.discountPrice * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Screenshot */}
                            {selectedOrder.paymentScreenshot && (
                                <div className="admin-orders__detail-section">
                                    <h3>Payment Screenshot</h3>
                                    <div className="admin-orders__screenshot">
                                        <img src={selectedOrder.paymentScreenshot} alt="Payment Screenshot" />
                                    </div>

                                    {selectedOrder.paymentStatus === 'pending' && (
                                        <div className="admin-orders__payment-actions">
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleVerifyPayment(selectedOrder.orderId || selectedOrder.id)}
                                            >
                                                <Check size={16} />
                                                Verify Payment
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleRejectPayment(selectedOrder.orderId || selectedOrder.id)}
                                            >
                                                <X size={16} />
                                                Reject Payment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Totals */}
                            <div className="admin-orders__detail-section">
                                <h3>Order Total</h3>
                                <div className="admin-orders__totals">
                                    <div className="admin-orders__total-row">
                                        <span>Subtotal</span>
                                        <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="admin-orders__total-row">
                                        <span>Shipping</span>
                                        <span>{selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}</span>
                                    </div>
                                    <div className="admin-orders__total-row admin-orders__total-row--final">
                                        <span>Total</span>
                                        <span>₹{selectedOrder.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
