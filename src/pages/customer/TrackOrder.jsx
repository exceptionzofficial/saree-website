import { useState } from 'react';
import {
    Search,
    Package,
    CheckCircle,
    Truck,
    Clock,
    XCircle,
    CreditCard
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import './TrackOrder.css';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const { getOrderById } = useOrders();

    const handleSearch = (e) => {
        e.preventDefault();
        setError('');
        setSearched(true);

        if (!orderId.trim()) {
            setError('Please enter an order ID');
            setOrder(null);
            return;
        }

        const foundOrder = getOrderById(orderId.trim().toUpperCase());
        if (foundOrder) {
            setOrder(foundOrder);
        } else {
            setOrder(null);
            setError('Order not found. Please check your order ID and try again.');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock size={20} />;
            case 'confirmed':
            case 'processing':
                return <Package size={20} />;
            case 'shipped':
                return <Truck size={20} />;
            case 'delivered':
                return <CheckCircle size={20} />;
            case 'cancelled':
                return <XCircle size={20} />;
            default:
                return <Clock size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'status--pending';
            case 'confirmed':
            case 'processing':
                return 'status--processing';
            case 'shipped':
                return 'status--shipped';
            case 'delivered':
                return 'status--delivered';
            case 'cancelled':
                return 'status--cancelled';
            default:
                return 'status--pending';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'payment--pending';
            case 'verified':
                return 'payment--verified';
            case 'rejected':
                return 'payment--rejected';
            default:
                return 'payment--pending';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = order ? orderStatuses.indexOf(order.status) : -1;

    return (
        <main className="track-order">
            <div className="container">
                {/* Header */}
                <div className="track-order__header">
                    <h1 className="track-order__title">Track Your Order</h1>
                    <p className="track-order__subtitle">
                        Enter your order ID to check the status of your order
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="track-order__search">
                    <div className="track-order__search-wrapper">
                        <Search size={20} />
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                            placeholder="Enter Order ID (e.g., SE23ABC123)"
                            className="track-order__input"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Track Order
                    </button>
                </form>

                {/* Error */}
                {error && (
                    <div className="track-order__error">
                        <XCircle size={20} />
                        {error}
                    </div>
                )}

                {/* Order Details */}
                {order && (
                    <div className="track-order__result">
                        {/* Order Header */}
                        <div className="track-order__order-header">
                            <div>
                                <h2>Order #{order.id}</h2>
                                <p>Placed on {formatDate(order.createdAt)}</p>
                            </div>
                            <div className="track-order__badges">
                                <span className={`track-order__status ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <span className={`track-order__payment ${getPaymentStatusColor(order.paymentStatus)}`}>
                                    <CreditCard size={16} />
                                    Payment {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {order.status !== 'cancelled' && (
                            <div className="track-order__progress">
                                <div className="track-order__progress-bar">
                                    {orderStatuses.map((status, index) => (
                                        <div
                                            key={status}
                                            className={`track-order__progress-step ${index <= currentStatusIndex ? 'track-order__progress-step--completed' : ''
                                                } ${index === currentStatusIndex ? 'track-order__progress-step--current' : ''}`}
                                        >
                                            <div className="track-order__progress-icon">
                                                {getStatusIcon(status)}
                                            </div>
                                            <span className="track-order__progress-label">
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="track-order__timeline">
                            <h3>Order Timeline</h3>
                            <div className="track-order__timeline-list">
                                {order.timeline.slice().reverse().map((event, index) => (
                                    <div key={index} className="track-order__timeline-item">
                                        <div className="track-order__timeline-dot"></div>
                                        <div className="track-order__timeline-content">
                                            <span className="track-order__timeline-message">{event.message}</span>
                                            <span className="track-order__timeline-time">{formatDate(event.timestamp)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="track-order__items">
                            <h3>Items in Order</h3>
                            <div className="track-order__items-list">
                                {order.items.map(item => (
                                    <div key={item.id} className="track-order__item">
                                        <img src={item.images[0]} alt={item.name} />
                                        <div className="track-order__item-info">
                                            <span className="track-order__item-name">{item.name}</span>
                                            <span className="track-order__item-meta">
                                                Qty: {item.quantity} × ₹{item.discountPrice.toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="track-order__item-price">
                                            ₹{(item.discountPrice * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="track-order__address">
                            <h3>Shipping Address</h3>
                            <p>
                                {order.customer.fullName}<br />
                                {order.customer.address}<br />
                                {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                            </p>
                        </div>

                        {/* Order Total */}
                        <div className="track-order__total">
                            <div className="track-order__total-row">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="track-order__total-row">
                                <span>Shipping</span>
                                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                            </div>
                            <div className="track-order__total-row track-order__total-row--final">
                                <span>Total</span>
                                <span>₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Results */}
                {searched && !order && !error && (
                    <div className="track-order__no-result">
                        <Package size={48} />
                        <h3>No Order Found</h3>
                        <p>We couldn't find an order with that ID. Please check and try again.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default TrackOrder;
