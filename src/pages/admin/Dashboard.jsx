import { Link } from 'react-router-dom';
import {
    ShoppingBag,
    Package,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    Truck,
    Eye,
    ArrowRight
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import './Dashboard.css';

const Dashboard = () => {
    const { orders, getOrderStats } = useOrders();
    const { products } = useProducts();

    const stats = getOrderStats();
    const recentOrders = orders.slice(0, 5);

    const statCards = [
        {
            icon: <ShoppingBag size={24} />,
            label: 'Total Orders',
            value: stats.total || 0,
            color: 'stat--blue'
        },
        {
            icon: <DollarSign size={24} />,
            label: 'Total Revenue',
            value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
            color: 'stat--green'
        },
        {
            icon: <Clock size={24} />,
            label: 'Pending Orders',
            value: stats.pending || 0,
            color: 'stat--yellow'
        },
        {
            icon: <Package size={24} />,
            label: 'Total Products',
            value: products.length,
            color: 'stat--purple'
        }
    ];

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
                return <CheckCircle size={14} />;
            default:
                return <Clock size={14} />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard">
            <div className="dashboard__header">
                <div>
                    <h1 className="dashboard__title">Dashboard</h1>
                    <p className="dashboard__subtitle">Welcome back! Here's what's happening.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="dashboard__stats">
                {statCards.map((stat, index) => (
                    <div key={index} className={`dashboard__stat ${stat.color}`}>
                        <div className="dashboard__stat-icon">{stat.icon}</div>
                        <div className="dashboard__stat-content">
                            <span className="dashboard__stat-value">{stat.value}</span>
                            <span className="dashboard__stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard__content">
                {/* Recent Orders */}
                <div className="dashboard__section">
                    <div className="dashboard__section-header">
                        <h2>Recent Orders</h2>
                        <Link to="/admin/orders" className="dashboard__section-link">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="dashboard__orders">
                            {recentOrders.map(order => (
                                <div key={order.id} className="dashboard__order">
                                    <div className="dashboard__order-info">
                                        <span className="dashboard__order-id">{order.id}</span>
                                        <span className="dashboard__order-customer">{order.customer.fullName}</span>
                                    </div>
                                    <div className="dashboard__order-meta">
                                        <span className={`dashboard__order-status status--${order.status}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                        <span className="dashboard__order-total">₹{order.total.toLocaleString()}</span>
                                        <span className="dashboard__order-date">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <Link to="/admin/orders" className="dashboard__order-view">
                                        <Eye size={16} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="dashboard__empty">
                            <ShoppingBag size={48} />
                            <p>No orders yet</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="dashboard__section dashboard__section--small">
                    <div className="dashboard__section-header">
                        <h2>Quick Actions</h2>
                    </div>

                    <div className="dashboard__actions">
                        <Link to="/admin/products" className="dashboard__action">
                            <Package size={24} />
                            <span>Add New Product</span>
                        </Link>
                        <Link to="/admin/orders" className="dashboard__action">
                            <ShoppingBag size={24} />
                            <span>View Orders</span>
                        </Link>
                        <Link to="/admin/settings" className="dashboard__action">
                            <TrendingUp size={24} />
                            <span>Update Settings</span>
                        </Link>
                    </div>

                    {/* Payment Pending Alert */}
                    {stats.paymentPending > 0 && (
                        <div className="dashboard__alert">
                            <Clock size={20} />
                            <div>
                                <strong>{stats.paymentPending} payments</strong> awaiting verification
                            </div>
                            <Link to="/admin/orders" className="btn btn-sm btn-primary">
                                Review
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
