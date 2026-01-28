import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'saree_elegance_cart';

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingIndex = state.items.findIndex(
                item => item.id === action.payload.id
            );

            if (existingIndex >= 0) {
                const newItems = [...state.items];
                newItems[existingIndex].quantity += action.payload.quantity || 1;
                return { ...state, items: newItems };
            }

            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
            };
        }

        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };

        case 'UPDATE_QUANTITY': {
            const newItems = state.items.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: Math.max(1, action.payload.quantity) }
                    : item
            );
            return { ...state, items: newItems };
        }

        case 'CLEAR_CART':
            return { ...state, items: [] };

        case 'LOAD_CART':
            return { ...state, items: action.payload };

        default:
            return state;
    }
};

const initialState = {
    items: []
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                dispatch({ type: 'LOAD_CART', payload: parsedCart });
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    }, [state.items]);

    const addItem = (product, quantity = 1) => {
        dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } });
    };

    const removeItem = (productId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
    };

    const updateQuantity = (productId, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getCartTotal = () => {
        return state.items.reduce(
            (total, item) => total + (item.discountPrice || item.price) * item.quantity,
            0
        );
    };

    const getCartCount = () => {
        return state.items.reduce((count, item) => count + item.quantity, 0);
    };

    const getOriginalTotal = () => {
        return state.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const getSavings = () => {
        return getOriginalTotal() - getCartTotal();
    };

    const isInCart = (productId) => {
        return state.items.some(item => item.id === productId);
    };

    const value = {
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getOriginalTotal,
        getSavings,
        isInCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
