import { useParams, Link } from 'react-router-dom';
import {
    CheckCircle,
    Package,
    Phone,
    Mail,
    ArrowRight,
    Clock,
    Truck
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const { getOrderById, settings } = useOrders();

    const order = getOrderById(orderId);

    if (!order) {
        return (
            <main className="order-confirmation order-confirmation--not-found">
                <div className="container">
                    <h2>Order Not Found</h2>
                    <p>We couldn't find an order with this ID.</p>
                    <Link to="/shop" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="order-confirmation">
            <div className="container">
                <div className="order-confirmation__content">
                    {/* Success Icon */}
                    <div className="order-confirmation__icon">
                        <CheckCircle size={64} />
                    </div>

                    {/* Header */}
                    <h1 className="order-confirmation__title">
                        Order Placed Successfully!
                    </h1>
                    <p className="order-confirmation__subtitle">
                        Thank you for your order. We've received your payment screenshot and will verify it shortly.
                    </p>

                    {/* Order ID */}
                    <div className="order-confirmation__order-id">
                        <span>Order ID:</span>
                        <strong>{order.id}</strong>
                    </div>

                    {/* What's Next */}
                    <div className="order-confirmation__next-steps">
                        <h3>What happens next?</h3>
                        <div className="order-confirmation__steps">
                            <div className="order-confirmation__step">
                                <div className="order-confirmation__step-icon">
                                    <Clock size={24} />
                                </div>
                                <div className="order-confirmation__step-content">
                                    <h4>Payment Verification</h4>
                                    <p>We'll verify your payment screenshot within 24 hours.</p>
                                </div>
                            </div>
                            <div className="order-confirmation__step">
                                <div className="order-confirmation__step-icon">
                                    <Package size={24} />
                                </div>
                                <div className="order-confirmation__step-content">
                                    <h4>Order Processing</h4>
                                    <p>Once verified, we'll pack your beautiful saree with care.</p>
                                </div>
                            </div>
                            <div className="order-confirmation__step">
                                <div className="order-confirmation__step-icon">
                                    <Truck size={24} />
                                </div>
                                <div className="order-confirmation__step-content">
                                    <h4>Shipping</h4>
                                    <p>Your order will be shipped within 2-3 business days.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="order-confirmation__details">
                        <h3>Order Details</h3>

                        <div className="order-confirmation__info-grid">
                            <div className="order-confirmation__info-card">
                                <h4>Shipping Address</h4>
                                <p>
                                    {order.customer.fullName}<br />
                                    {order.customer.address}<br />
                                    {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                                    {order.customer.landmark && <><br />{order.customer.landmark}</>}
                                </p>
                            </div>

                            <div className="order-confirmation__info-card">
                                <h4>Contact Information</h4>
                                <p>
                                    <Phone size={14} /> {order.customer.phone}<br />
                                    {order.customer.email && <><Mail size={14} /> {order.customer.email}</>}
                                </p>
                            </div>
                        </div>

                        <div className="order-confirmation__items">
                            <h4>Items Ordered</h4>
                            {order.items.map(item => (
                                <div key={item.id} className="order-confirmation__item">
                                    <img src={item.images[0]} alt={item.name} />
                                    <div className="order-confirmation__item-info">
                                        <span className="order-confirmation__item-name">{item.name}</span>
                                        <span className="order-confirmation__item-qty">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="order-confirmation__item-price">
                                        ₹{(item.discountPrice * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="order-confirmation__totals">
                            <div className="order-confirmation__total-row">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="order-confirmation__total-row">
                                <span>Shipping</span>
                                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                            </div>
                            <div className="order-confirmation__total-row order-confirmation__total-row--final">
                                <span>Total</span>
                                <span>₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="order-confirmation__contact">
                        <h4>Need Help?</h4>
                        <p>
                            If you have any questions about your order, please contact us:
                        </p>
                        <div className="order-confirmation__contact-links">
                            <a href={`tel:${settings.storePhone}`}>
                                <Phone size={16} />
                                {settings.storePhone}
                            </a>
                            <a href={`mailto:${settings.storeEmail}`}>
                                <Mail size={16} />
                                {settings.storeEmail}
                            </a>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="order-confirmation__actions">
                        <Link to="/track-order" className="btn btn-outline">
                            Track Your Order
                        </Link>
                        <Link to="/shop" className="btn btn-primary">
                            Continue Shopping <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderConfirmation;
