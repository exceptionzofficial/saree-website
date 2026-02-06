import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
    ShoppingBag,
    User,
    ChevronRight,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    Search,
    Mail,
    Phone,
    LogOut,
    LayoutDashboard,
    UserPlus,
    ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useMembership } from '../../context/MembershipContext';
import './Profile.css'; // Reuse profile layouts

const Orders = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { orders, loading } = useOrders();
    const { getUserMembershipStatus } = useMembership();
    const [searchTerm, setSearchTerm] = useState('');

    const membershipStatus = getUserMembershipStatus();
    const hasActiveMembership = membershipStatus === 'active';

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Filter user's orders
    const userOrders = orders.filter(order => order.customer.email === user.email);

    // Filter by search term (Order ID or Product Name)
    const filteredOrders = userOrders.filter(order => {
        const orderId = order.orderId || order.id || '';
        const matchesId = orderId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProduct = order.items.some(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchesId || matchesProduct;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="status-icon pending" />;
            case 'confirmed': return <CheckCircle size={16} className="status-icon confirmed" />;
            case 'processing': return <Clock size={16} className="status-icon processing" />;
            case 'shipped': return <Truck size={16} className="status-icon shipped" />;
            case 'delivered': return <CheckCircle size={16} className="status-icon delivered" />;
            case 'cancelled': return <XCircle size={16} className="status-icon cancelled" />;
            default: return <Clock size={16} />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const OrderCard = ({ order }) => (
        <div className="order-history-card">
            <div className="order-history-header">
                <div className="order-id-section">
                    <span className="order-label">Order ID</span>
                    <span className="order-id">{order.orderId || order.id}</span>
                </div>
                <div className="order-date-section">
                    <span className="order-label">Placed on</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <div className={`order-status-badge status--${order.status}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status.toUpperCase()}</span>
                </div>
            </div>

            <div className="order-history-body">
                <div className="order-items-list">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="order-history-item">
                            <div className="item-img">
                                <img src={item.images?.[0] || 'https://via.placeholder.com/60'} alt={item.name} />
                            </div>
                            <div className="item-info">
                                <h4>{item.name}</h4>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                            <div className="item-price">
                                ₹{(item.discountPrice * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-history-footer">
                <div className="order-total-section">
                    <span className="total-label">Order Total:</span>
                    <span className="total-value">₹{order.total.toLocaleString()}</span>
                </div>
                <div className="order-actions">
                    {/* <Link to={`/track-order?id=${order.orderId || order.id}`} className="btn btn-outline btn-sm">
                        Track Order
                    </Link> */}
                </div>
            </div>
        </div>
    );

    return (
        <main className="profile-page">
            <div className="container">
                <div className="profile-grid">
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="profile-user-card">
                            <div className="profile-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="profile-user-info">
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <nav className="profile-nav">
                            <Link to="/profile" className="profile-nav-item">
                                <User size={20} />
                                <span>My Profile</span>
                                <ChevronRight size={16} />
                            </Link>
                            <Link to="/orders" className="profile-nav-item active">
                                <ShoppingBag size={20} />
                                <span>My Orders</span>
                                <ChevronRight size={16} />
                            </Link>
                            {hasActiveMembership ? (
                                <Link to="/seller/dashboard" className="profile-nav-item highlight">
                                    <LayoutDashboard size={20} />
                                    <span>Member Portal</span>
                                    <ChevronRight size={16} />
                                </Link>
                            ) : (
                                <Link to="/membership" className="profile-nav-item">
                                    <UserPlus size={20} />
                                    <span>Become a Member</span>
                                    <ChevronRight size={16} />
                                </Link>
                            )}
                            <button onClick={logout} className="profile-nav-item logout">
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="profile-content">
                        <section className="profile-section">
                            <div className="section-header">
                                <h2>Order History</h2>
                                <div className="order-search">
                                    <Search size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by ID or Product..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="orders-loading">
                                    <div className="spinner"></div>
                                    <p>Loading your orders...</p>
                                </div>
                            ) : filteredOrders.length > 0 ? (
                                <div className="orders-list">
                                    {filteredOrders.map(order => (
                                        <OrderCard key={order.orderId || order.id} order={order} />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-orders">
                                    <ShoppingBag size={48} />
                                    <h3>No orders found</h3>
                                    <p>{searchTerm ? 'No orders match your search criteria.' : 'You haven\'t placed any orders yet.'}</p>
                                    <Link to="/shop" className="btn btn-primary">
                                        Start Shopping
                                    </Link>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .order-search {
                    display: flex;
                    align-items: center;
                    background: #f8f9fa;
                    padding: 8px 15px;
                    border-radius: 8px;
                    border: 1px solid #eee;
                    width: 100%;
                    max-width: 300px;
                }
                .order-search input {
                    border: none;
                    background: transparent;
                    padding: 5px 10px;
                    width: 100%;
                    outline: none;
                }
                .orders-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin-top: 20px;
                }
                .order-history-card {
                    background: white;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .order-history-header {
                    padding: 15px 20px;
                    background: #fcfcfc;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                .order-label {
                    display: block;
                    font-size: 11px;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 2px;
                }
                .order-id {
                    font-weight: 600;
                    color: #1e3a5f;
                    font-family: monospace;
                    font-size: 14px;
                }
                .order-date {
                    font-weight: 500;
                    color: #444;
                    font-size: 14px;
                }
                .order-status-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                }
                .status--pending { background: #fff8e1; color: #f57c00; }
                .status--confirmed { background: #e8f5e9; color: #2e7d32; }
                .status--processing { background: #e3f2fd; color: #1976d2; }
                .status--shipped { background: #f3e5f5; color: #7b1fa2; }
                .status--delivered { background: #e8f5e9; color: #2e7d32; }
                .status--cancelled { background: #ffebee; color: #c62828; }
                
                .order-history-body {
                    padding: 20px;
                }
                .order-history-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #f5f5f5;
                    margin-bottom: 15px;
                }
                .order-history-item:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }
                .item-img img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 8px;
                }
                .item-info h4 {
                    margin: 0 0 5px;
                    font-size: 14px;
                    color: #333;
                }
                .item-info p {
                    margin: 0;
                    font-size: 12px;
                    color: #666;
                }
                .item-price {
                    margin-left: auto;
                    font-weight: 600;
                    color: #1e3a5f;
                }
                .order-history-footer {
                    padding: 15px 20px;
                    background: #fcfcfc;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .total-label {
                    color: #666;
                    margin-right: 8px;
                    font-size: 14px;
                }
                .total-value {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1e3a5f;
                }
                .empty-orders {
                    text-align: center;
                    padding: 60px 20px;
                    color: #888;
                }
                .empty-orders h3 {
                    margin: 15px 0 10px;
                    color: #444;
                }
                @media (max-width: 600px) {
                    .order-history-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .order-status-badge {
                        align-self: flex-start;
                    }
                }
            `}</style>
        </main>
    );
};

export default Orders;
