import { useState, useMemo } from 'react';
import {
    DollarSign,
    ShoppingBag,
    TrendingUp,
    Users,
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    ArrowUp,
    ArrowDown,
    Calendar,
    Filter,
    RefreshCw
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import './Analytics.css';

const Analytics = () => {
    const { orders, loading: ordersLoading } = useOrders();
    const { products } = useProducts();

    const [dateRange, setDateRange] = useState('all');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter orders by date range
    const filteredOrders = useMemo(() => {
        let filtered = [...orders];
        const now = new Date();

        // Date filter
        switch (dateRange) {
            case 'today': {
                const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                filtered = filtered.filter(o => new Date(o.createdAt) >= start);
                break;
            }
            case 'week': {
                const start = new Date(now);
                start.setDate(start.getDate() - 7);
                filtered = filtered.filter(o => new Date(o.createdAt) >= start);
                break;
            }
            case 'month': {
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                filtered = filtered.filter(o => new Date(o.createdAt) >= start);
                break;
            }
            case 'year': {
                const start = new Date(now.getFullYear(), 0, 1);
                filtered = filtered.filter(o => new Date(o.createdAt) >= start);
                break;
            }
            case 'custom': {
                if (customFrom) {
                    filtered = filtered.filter(o => new Date(o.createdAt) >= new Date(customFrom));
                }
                if (customTo) {
                    const end = new Date(customTo);
                    end.setHours(23, 59, 59, 999);
                    filtered = filtered.filter(o => new Date(o.createdAt) <= end);
                }
                break;
            }
            default:
                break;
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(o => o.status === statusFilter);
        }

        return filtered;
    }, [orders, dateRange, customFrom, customTo, statusFilter]);

    // Compute KPIs
    const kpis = useMemo(() => {
        const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const totalOrders = filteredOrders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered').length;
        const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;
        const confirmedOrders = filteredOrders.filter(o => o.status === 'confirmed').length;
        const shippedOrders = filteredOrders.filter(o => o.status === 'shipped').length;
        const cancelledOrders = filteredOrders.filter(o => o.status === 'cancelled').length;

        return {
            totalRevenue,
            totalOrders,
            avgOrderValue,
            deliveredOrders,
            pendingOrders,
            confirmedOrders,
            shippedOrders,
            cancelledOrders,
            totalProducts: products.length
        };
    }, [filteredOrders, products]);

    // Revenue by day (last 7 days or filtered range)
    const revenueByDay = useMemo(() => {
        const days = {};
        const now = new Date();

        // Create last 7 days labels
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            days[key] = { revenue: 0, orders: 0, label: key };
        }

        filteredOrders.forEach(order => {
            const d = new Date(order.createdAt);
            const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            if (days[key]) {
                days[key].revenue += order.total || 0;
                days[key].orders += 1;
            }
        });

        return Object.values(days);
    }, [filteredOrders]);

    // Revenue by month
    const revenueByMonth = useMemo(() => {
        const months = {};
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
            months[key] = { revenue: 0, orders: 0, label: key };
        }

        orders.forEach(order => {
            const d = new Date(order.createdAt);
            const key = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
            if (months[key]) {
                months[key].revenue += order.total || 0;
                months[key].orders += 1;
            }
        });

        return Object.values(months);
    }, [orders]);

    // Top selling products
    const topProducts = useMemo(() => {
        const productMap = {};

        filteredOrders.forEach(order => {
            (order.items || []).forEach(item => {
                const id = item.id || item.name;
                if (!productMap[id]) {
                    productMap[id] = {
                        name: item.name,
                        image: item.images?.[0] || '',
                        quantity: 0,
                        revenue: 0
                    };
                }
                productMap[id].quantity += item.quantity || 1;
                productMap[id].revenue += (item.discountPrice || item.price || 0) * (item.quantity || 1);
            });
        });

        return Object.values(productMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    }, [filteredOrders]);

    // Order status distribution
    const statusDistribution = useMemo(() => {
        const statuses = {
            pending: { count: 0, label: 'Pending', color: '#f59e0b', icon: Clock },
            confirmed: { count: 0, label: 'Confirmed', color: '#3b82f6', icon: CheckCircle },
            shipped: { count: 0, label: 'Shipped', color: '#8b5cf6', icon: Truck },
            delivered: { count: 0, label: 'Delivered', color: '#10b981', icon: CheckCircle },
            cancelled: { count: 0, label: 'Cancelled', color: '#ef4444', icon: XCircle }
        };

        filteredOrders.forEach(o => {
            if (statuses[o.status]) {
                statuses[o.status].count += 1;
            }
        });

        return Object.entries(statuses).map(([key, val]) => ({ ...val, key }));
    }, [filteredOrders]);

    // Recent orders
    const recentOrders = useMemo(() => {
        return [...filteredOrders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);
    }, [filteredOrders]);

    const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue), 1);
    const maxMonthlyRevenue = Math.max(...revenueByMonth.map(d => d.revenue), 1);

    const formatCurrency = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (ordersLoading) {
        return (
            <div className="analytics">
                <div className="analytics__loading">
                    <RefreshCw size={32} className="analytics__spinner" />
                    <p>Loading analytics data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics">
            {/* Header */}
            <div className="analytics__header">
                <div>
                    <h1 className="analytics__title">Analytics</h1>
                    <p className="analytics__subtitle">Sales performance and order insights</p>
                </div>
            </div>

            {/* Filters */}
            <div className="analytics__filters">
                <div className="analytics__filter-group">
                    <Filter size={16} />
                    <span>Period:</span>
                    <div className="analytics__filter-pills">
                        {[
                            { value: 'today', label: 'Today' },
                            { value: 'week', label: '7 Days' },
                            { value: 'month', label: 'This Month' },
                            { value: 'year', label: 'This Year' },
                            { value: 'all', label: 'All Time' },
                            { value: 'custom', label: 'Custom' },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                className={`analytics__filter-pill ${dateRange === opt.value ? 'analytics__filter-pill--active' : ''}`}
                                onClick={() => setDateRange(opt.value)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {dateRange === 'custom' && (
                    <div className="analytics__custom-dates">
                        <div className="analytics__date-field">
                            <Calendar size={14} />
                            <input
                                type="date"
                                value={customFrom}
                                onChange={e => setCustomFrom(e.target.value)}
                                placeholder="From"
                            />
                        </div>
                        <span className="analytics__date-sep">to</span>
                        <div className="analytics__date-field">
                            <Calendar size={14} />
                            <input
                                type="date"
                                value={customTo}
                                onChange={e => setCustomTo(e.target.value)}
                                placeholder="To"
                            />
                        </div>
                    </div>
                )}

                <div className="analytics__filter-group">
                    <span>Status:</span>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="analytics__status-select"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="analytics__kpis">
                <div className="analytics__kpi analytics__kpi--revenue">
                    <div className="analytics__kpi-icon">
                        <DollarSign size={22} />
                    </div>
                    <div className="analytics__kpi-content">
                        <span className="analytics__kpi-value">{formatCurrency(kpis.totalRevenue)}</span>
                        <span className="analytics__kpi-label">Total Revenue</span>
                    </div>
                </div>
                <div className="analytics__kpi analytics__kpi--orders">
                    <div className="analytics__kpi-icon">
                        <ShoppingBag size={22} />
                    </div>
                    <div className="analytics__kpi-content">
                        <span className="analytics__kpi-value">{kpis.totalOrders}</span>
                        <span className="analytics__kpi-label">Total Orders</span>
                    </div>
                </div>
                <div className="analytics__kpi analytics__kpi--avg">
                    <div className="analytics__kpi-icon">
                        <TrendingUp size={22} />
                    </div>
                    <div className="analytics__kpi-content">
                        <span className="analytics__kpi-value">{formatCurrency(Math.round(kpis.avgOrderValue))}</span>
                        <span className="analytics__kpi-label">Avg Order Value</span>
                    </div>
                </div>
                <div className="analytics__kpi analytics__kpi--products">
                    <div className="analytics__kpi-icon">
                        <Package size={22} />
                    </div>
                    <div className="analytics__kpi-content">
                        <span className="analytics__kpi-value">{kpis.totalProducts}</span>
                        <span className="analytics__kpi-label">Total Products</span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="analytics__charts-row">
                {/* Daily Revenue Chart */}
                <div className="analytics__card analytics__card--wide">
                    <div className="analytics__card-header">
                        <h3>Daily Revenue (Last 7 Days)</h3>
                    </div>
                    <div className="analytics__bar-chart">
                        {revenueByDay.map((day, i) => (
                            <div key={i} className="analytics__bar-group">
                                <div className="analytics__bar-tooltip">
                                    {formatCurrency(day.revenue)}
                                    <br />
                                    <small>{day.orders} order{day.orders !== 1 ? 's' : ''}</small>
                                </div>
                                <div className="analytics__bar-wrapper">
                                    <div
                                        className="analytics__bar"
                                        style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                                    />
                                </div>
                                <span className="analytics__bar-label">{day.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div className="analytics__card">
                    <div className="analytics__card-header">
                        <h3>Order Status</h3>
                    </div>
                    <div className="analytics__status-list">
                        {statusDistribution.map(status => {
                            const percentage = kpis.totalOrders > 0
                                ? ((status.count / kpis.totalOrders) * 100).toFixed(1)
                                : 0;
                            const Icon = status.icon;
                            return (
                                <div key={status.key} className="analytics__status-item">
                                    <div className="analytics__status-info">
                                        <div
                                            className="analytics__status-dot"
                                            style={{ background: status.color }}
                                        >
                                            <Icon size={12} />
                                        </div>
                                        <span className="analytics__status-name">{status.label}</span>
                                    </div>
                                    <div className="analytics__status-bar-wrapper">
                                        <div
                                            className="analytics__status-bar"
                                            style={{
                                                width: `${percentage}%`,
                                                background: status.color
                                            }}
                                        />
                                    </div>
                                    <div className="analytics__status-meta">
                                        <span className="analytics__status-count">{status.count}</span>
                                        <span className="analytics__status-percent">{percentage}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Second Row */}
            <div className="analytics__charts-row">
                {/* Monthly Revenue */}
                <div className="analytics__card analytics__card--wide">
                    <div className="analytics__card-header">
                        <h3>Monthly Revenue (Last 6 Months)</h3>
                    </div>
                    <div className="analytics__bar-chart analytics__bar-chart--monthly">
                        {revenueByMonth.map((month, i) => (
                            <div key={i} className="analytics__bar-group">
                                <div className="analytics__bar-tooltip">
                                    {formatCurrency(month.revenue)}
                                    <br />
                                    <small>{month.orders} order{month.orders !== 1 ? 's' : ''}</small>
                                </div>
                                <div className="analytics__bar-wrapper">
                                    <div
                                        className="analytics__bar analytics__bar--monthly"
                                        style={{ height: `${(month.revenue / maxMonthlyRevenue) * 100}%` }}
                                    />
                                </div>
                                <span className="analytics__bar-label">{month.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="analytics__card">
                    <div className="analytics__card-header">
                        <h3>Top Selling Products</h3>
                    </div>
                    <div className="analytics__top-products">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, i) => (
                                <div key={i} className="analytics__product-item">
                                    <span className="analytics__product-rank">#{i + 1}</span>
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="analytics__product-img"
                                        />
                                    )}
                                    <div className="analytics__product-info">
                                        <span className="analytics__product-name">{product.name}</span>
                                        <span className="analytics__product-stats">
                                            {product.quantity} sold • {formatCurrency(product.revenue)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="analytics__empty">
                                <Package size={32} />
                                <p>No product data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="analytics__card analytics__card--full">
                <div className="analytics__card-header">
                    <h3>Recent Orders</h3>
                    <span className="analytics__card-badge">{filteredOrders.length} total</span>
                </div>
                {recentOrders.length > 0 ? (
                    <div className="analytics__table-wrapper">
                        <table className="analytics__table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.orderId}>
                                        <td className="analytics__table-id">{order.orderId?.slice(0, 15)}...</td>
                                        <td>{order.customer?.fullName || order.customer?.name || 'N/A'}</td>
                                        <td>{order.items?.length || 0} item(s)</td>
                                        <td className="analytics__table-amount">{formatCurrency(order.total)}</td>
                                        <td>
                                            <span className={`analytics__badge analytics__badge--${order.status}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="analytics__table-date">{formatDate(order.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="analytics__empty">
                        <ShoppingBag size={48} />
                        <p>No orders found for the selected filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
