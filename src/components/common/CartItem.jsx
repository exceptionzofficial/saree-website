import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
    const { updateQuantity, removeItem } = useCart();

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            updateQuantity(item.id, newQuantity);
        }
    };

    const subtotal = (item.discountPrice || item.price) * item.quantity;

    return (
        <div className="cart-item">
            {/* Product Image */}
            <div className="cart-item__image-wrapper">
                <img
                    src={item.images[0]}
                    alt={item.name}
                    className="cart-item__image"
                />
            </div>

            {/* Product Details */}
            <div className="cart-item__details">
                <div className="cart-item__info">
                    <span className="cart-item__category">{item.fabric}</span>
                    <h3 className="cart-item__name">{item.name}</h3>

                    {/* Mobile Price */}
                    <div className="cart-item__price-mobile">
                        <span className="cart-item__current-price">
                            ₹{(item.discountPrice || item.price).toLocaleString()}
                        </span>
                        {item.price !== item.discountPrice && (
                            <span className="cart-item__original-price">
                                ₹{item.price.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Quantity Controls */}
                <div className="cart-item__controls">
                    <div className="cart-item__quantity">
                        <button
                            className="cart-item__qty-btn"
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="cart-item__qty-value">{item.quantity}</span>
                        <button
                            className="cart-item__qty-btn"
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            aria-label="Increase quantity"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* Subtotal - Desktop */}
                    <div className="cart-item__subtotal">
                        <span className="cart-item__subtotal-label">Subtotal:</span>
                        <span className="cart-item__subtotal-value">
                            ₹{subtotal.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Unit Price - Desktop */}
            <div className="cart-item__price">
                <span className="cart-item__current-price">
                    ₹{(item.discountPrice || item.price).toLocaleString()}
                </span>
                {item.price !== item.discountPrice && (
                    <span className="cart-item__original-price">
                        ₹{item.price.toLocaleString()}
                    </span>
                )}
            </div>

            {/* Remove Button */}
            <button
                className="cart-item__remove"
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
            >
                <X size={20} />
            </button>
        </div>
    );
};

export default CartItem;
