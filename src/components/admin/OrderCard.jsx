import { Eye, Check, X, Clock, Truck, Package } from 'lucide-react';
import './OrderCard.css';

const OrderCard = ({ order, onView, onUpdateStatus }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock size={14} />;
            case 'confirmed':
            case 'processing':
                return <Package size={14} />;
            case 'shipped':
                return <Truck size={14} />;
            case 'delivered':
                return <Check size={14} />;
            case 'cancelled':
                return <X size={14} />;
            default:
                return <Clock size={14} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'order-card__status--pending';
            case 'confirmed':
            case 'processing':
                return 'order-card__status--processing';
            case 'shipped':
                return 'order-card__status--shipped';
            case 'delivered':
                return 'order-card__status--delivered';
            case 'cancelled':
                return 'order-card__status--cancelled';
            default:
                return 'order-card__status--pending';
        }
    };

    const getPaymentColor = (status) => {
        switch (status) {
            case 'pending':
                return 'order-card__payment--pending';
            case 'verified':
                return 'order-card__payment--verified';
            case 'rejected':
                return 'order-card__payment--rejected';
            default:
                return 'order-card__payment--pending';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="order-card">
            <div className="order-card__header">
                <div className="order-card__id">
                    <span className="order-card__label">Order</span>
                    <strong>{order.id}</strong>
                </div>
                <div className="order-card__badges">
                    <span className={`order-card__status ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                    </span>
                    <span className={`order-card__payment ${getPaymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                    </span>
                </div>
            </div>

            <div className="order-card__body">
                <div className="order-card__customer">
                    <span className="order-card__name">{order.customer.fullName}</span>
                    <span className="order-card__phone">{order.customer.phone}</span>
                </div>

                <div className="order-card__items">
                    {order.items.slice(0, 2).map(item => (
                        <img
                            key={item.id}
                            src={item.images[0]}
                            alt={item.name}
                            className="order-card__item-image"
                        />
                    ))}
                    {order.items.length > 2 && (
                        <span className="order-card__more-items">
                            +{order.items.length - 2}
                        </span>
                    )}
                </div>

                <div className="order-card__info">
                    <div className="order-card__info-item">
                        <span className="order-card__label">Total</span>
                        <strong>₹{order.total.toLocaleString()}</strong>
                    </div>
                    <div className="order-card__info-item">
                        <span className="order-card__label">Date</span>
                        <span>{formatDate(order.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="order-card__footer">
                <button
                    className="order-card__btn order-card__btn--view"
                    onClick={() => onView(order)}
                >
                    <Eye size={16} />
                    View Details
                </button>

                {order.paymentStatus === 'pending' && (
                    <div className="order-card__actions">
                        <button
                            className="order-card__btn order-card__btn--verify"
                            onClick={() => onUpdateStatus(order.id, 'verified')}
                        >
                            <Check size={16} />
                            Verify
                        </button>
                        <button
                            className="order-card__btn order-card__btn--reject"
                            onClick={() => onUpdateStatus(order.id, 'rejected')}
                        >
                            <X size={16} />
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
