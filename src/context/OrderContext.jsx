import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

const ORDERS_STORAGE_KEY = 'saree_elegance_orders';
const SETTINGS_STORAGE_KEY = 'saree_elegance_settings';

const defaultSettings = {
    upiId: 'sareeelegance@upi',
    qrCodeUrl: '',
    storeName: 'Saree Elegance',
    storeEmail: 'contact@sareeelegance.com',
    storePhone: '+91 98765 43210',
    storeAddress: '123 Fashion Street, Silk Bazaar, Chennai - 600001',
    shippingCharge: 99,
    freeShippingAbove: 2000,
    gstNumber: 'GSTIN1234567890',
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);

    // Load data on mount
    useEffect(() => {
        const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

        if (savedOrders) {
            try {
                setOrders(JSON.parse(savedOrders));
            } catch (error) {
                console.error('Error loading orders:', error);
            }
        }

        if (savedSettings) {
            try {
                setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }

        setLoading(false);
    }, []);

    // Save orders when they change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        }
    }, [orders, loading]);

    // Save settings when they change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        }
    }, [settings, loading]);

    const generateOrderId = () => {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `SE${timestamp}${random}`;
    };

    const createOrder = (orderData) => {
        const newOrder = {
            id: generateOrderId(),
            ...orderData,
            status: 'pending',
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            timeline: [
                {
                    status: 'pending',
                    message: 'Order placed successfully',
                    timestamp: new Date().toISOString()
                }
            ]
        };

        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    const getOrderById = (orderId) => {
        return orders.find(order => order.id === orderId);
    };

    const getOrdersByStatus = (status) => {
        return orders.filter(order => order.status === status);
    };

    const updateOrderStatus = (orderId, status, message = '') => {
        setOrders(orders.map(order => {
            if (order.id === orderId) {
                const timelineEntry = {
                    status,
                    message: message || getStatusMessage(status),
                    timestamp: new Date().toISOString()
                };

                return {
                    ...order,
                    status,
                    updatedAt: new Date().toISOString(),
                    timeline: [...order.timeline, timelineEntry]
                };
            }
            return order;
        }));
    };

    const updatePaymentStatus = (orderId, paymentStatus, message = '') => {
        setOrders(orders.map(order => {
            if (order.id === orderId) {
                const timelineEntry = {
                    status: `payment_${paymentStatus}`,
                    message: message || getPaymentStatusMessage(paymentStatus),
                    timestamp: new Date().toISOString()
                };

                return {
                    ...order,
                    paymentStatus,
                    updatedAt: new Date().toISOString(),
                    timeline: [...order.timeline, timelineEntry]
                };
            }
            return order;
        }));
    };

    const getStatusMessage = (status) => {
        const messages = {
            pending: 'Order placed',
            confirmed: 'Order confirmed',
            processing: 'Order is being processed',
            shipped: 'Order has been shipped',
            delivered: 'Order delivered',
            cancelled: 'Order cancelled'
        };
        return messages[status] || 'Status updated';
    };

    const getPaymentStatusMessage = (status) => {
        const messages = {
            pending: 'Payment pending',
            verified: 'Payment verified',
            rejected: 'Payment rejected'
        };
        return messages[status] || 'Payment status updated';
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const getShippingCharge = (total) => {
        if (total >= settings.freeShippingAbove) {
            return 0;
        }
        return settings.shippingCharge;
    };

    const getOrderStats = () => {
        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            confirmed: orders.filter(o => o.status === 'confirmed').length,
            processing: orders.filter(o => o.status === 'processing').length,
            shipped: orders.filter(o => o.status === 'shipped').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length,
            paymentPending: orders.filter(o => o.paymentStatus === 'pending').length,
            paymentVerified: orders.filter(o => o.paymentStatus === 'verified').length,
            totalRevenue: orders
                .filter(o => o.paymentStatus === 'verified')
                .reduce((sum, o) => sum + o.total, 0),
        };
        return stats;
    };

    const value = {
        orders,
        settings,
        loading,
        createOrder,
        getOrderById,
        getOrdersByStatus,
        updateOrderStatus,
        updatePaymentStatus,
        updateSettings,
        getShippingCharge,
        getOrderStats,
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

export default OrderContext;
