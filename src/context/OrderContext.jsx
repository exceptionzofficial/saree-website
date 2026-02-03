import { createContext, useContext, useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const OrderContext = createContext();

const SETTINGS_STORAGE_KEY = 'saree_elegance_settings';

const defaultSettings = {
    upiId: 'gurubagavan@upi',
    qrCodeUrl: '',
    storeName: 'Gurubagavan Sarees',
    storeEmail: 'contact@gurubagavan.com',
    storePhone: '+91 98765 43210',
    storeAddress: '123 Fashion Street, Silk Bazaar, Chennai - 600001',
    shippingCharge: 99,
    freeShippingAbove: 2000,
    gstNumber: 'GSTIN1234567890',
    announcements: [],
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [useAPI, setUseAPI] = useState(true);

    // Load data on mount
    useEffect(() => {
        loadOrders();
        loadSettings();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const apiOrders = await ordersAPI.getAll();
            setOrders(apiOrders);
            setUseAPI(true);
        } catch (err) {
            console.warn('API unavailable for orders, using local storage:', err.message);
            // Fallback to localStorage
            const savedOrders = localStorage.getItem('saree_elegance_orders');
            if (savedOrders) {
                try {
                    setOrders(JSON.parse(savedOrders));
                } catch (error) {
                    console.error('Error loading orders:', error);
                }
            }
            setUseAPI(false);
        }
        setLoading(false);
    };

    const loadSettings = () => {
        const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (savedSettings) {
            try {
                setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    };

    // Save orders to localStorage as backup
    useEffect(() => {
        if (!loading && orders.length > 0) {
            localStorage.setItem('saree_elegance_orders', JSON.stringify(orders));
        }
    }, [orders, loading]);

    // Save settings when they change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        }
    }, [settings, loading]);

    const createOrder = async (orderData) => {
        if (useAPI) {
            try {
                const newOrder = await ordersAPI.create(orderData);
                setOrders(prev => [newOrder, ...prev]);
                return newOrder;
            } catch (err) {
                console.error('Error creating order via API:', err);
                throw err;
            }
        } else {
            // Local fallback
            const timestamp = Date.now().toString(36).toUpperCase();
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            const newOrder = {
                orderId: `SE${timestamp}${random}`,
                ...orderData,
                status: 'pending',
                paymentStatus: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                statusHistory: [
                    {
                        status: 'pending',
                        note: 'Order placed successfully',
                        date: new Date().toISOString()
                    }
                ]
            };
            setOrders(prev => [newOrder, ...prev]);
            return newOrder;
        }
    };

    const getOrderById = (orderId) => {
        return orders.find(order => order.orderId === orderId || order.id === orderId);
    };

    const getOrdersByStatus = (status) => {
        return orders.filter(order => order.status === status);
    };

    const updateOrderStatus = async (orderId, status, message = '') => {
        if (useAPI) {
            try {
                const updatedOrder = await ordersAPI.updateStatus(orderId, status, message);
                setOrders(orders.map(order =>
                    (order.orderId === orderId || order.id === orderId) ? updatedOrder : order
                ));
                return updatedOrder;
            } catch (err) {
                console.error('Error updating order status:', err);
                throw err;
            }
        } else {
            setOrders(orders.map(order => {
                if (order.orderId === orderId || order.id === orderId) {
                    const timelineEntry = {
                        status,
                        note: message || `Status changed to ${status}`,
                        date: new Date().toISOString()
                    };
                    return {
                        ...order,
                        status,
                        updatedAt: new Date().toISOString(),
                        statusHistory: [...(order.statusHistory || []), timelineEntry]
                    };
                }
                return order;
            }));
        }
    };

    const updatePaymentStatus = (orderId, paymentStatus, message = '') => {
        setOrders(orders.map(order => {
            if (order.orderId === orderId || order.id === orderId) {
                const timelineEntry = {
                    status: `payment_${paymentStatus}`,
                    note: message || `Payment ${paymentStatus}`,
                    date: new Date().toISOString()
                };
                return {
                    ...order,
                    paymentStatus,
                    updatedAt: new Date().toISOString(),
                    statusHistory: [...(order.statusHistory || []), timelineEntry]
                };
            }
            return order;
        }));
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
                .reduce((sum, o) => sum + (o.total || 0), 0),
        };
        return stats;
    };

    const trackOrder = async (orderId) => {
        if (useAPI) {
            try {
                return await ordersAPI.track(orderId);
            } catch (err) {
                console.error('Error tracking order:', err);
                return getOrderById(orderId);
            }
        }
        return getOrderById(orderId);
    };

    const refreshOrders = () => {
        loadOrders();
    };

    const value = {
        orders,
        settings,
        loading,
        useAPI,
        createOrder,
        getOrderById,
        getOrdersByStatus,
        updateOrderStatus,
        updatePaymentStatus,
        updateSettings,
        getShippingCharge,
        getOrderStats,
        trackOrder,
        refreshOrders,
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
