import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import CartItem from '../../components/common/CartItem';
import './Cart.css';

const Cart = () => {
    const {
        items,
        getCartTotal,
        getOriginalTotal,
        getSavings,
        clearCart
    } = useCart();
    const { getShippingCharge } = useOrders();

    const subtotal = getCartTotal();
    const originalTotal = getOriginalTotal();
    const savings = getSavings();
    const shipping = getShippingCharge(subtotal);
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <main className="cart cart--empty">
                <div className="container">
                    <div className="cart__empty-state">
                        <div className="cart__empty-icon">
                            <ShoppingBag size={64} />
                        </div>
                        <h2 className="cart__empty-title">Your Cart is Empty</h2>
                        <p className="cart__empty-text">
                            Looks like you haven't added any sarees to your cart yet.
                            Start shopping to fill it up!
                        </p>
                        <Link to="/shop" className="btn btn-primary btn-lg">
                            Start Shopping <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="cart">
            <div className="container">
                <div className="cart__header">
                    <h1 className="cart__title">Shopping Cart</h1>
                    <span className="cart__count">{items.length} items</span>
                </div>

                <div className="cart__content">
                    {/* Cart Items */}
                    <div className="cart__items">
                        <div className="cart__items-header">
                            <span>Product</span>
                            <span className="hide-mobile">Price</span>
                        </div>

                        <div className="cart__items-list">
                            {items.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        <div className="cart__actions">
                            <Link to="/shop" className="btn btn-ghost">
                                ← Continue Shopping
                            </Link>
                            <button
                                className="cart__clear-btn"
                                onClick={clearCart}
                            >
                                <Trash2 size={16} />
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="cart__summary">
                        <div className="cart__summary-card">
                            <h3 className="cart__summary-title">Order Summary</h3>

                            <div className="cart__summary-rows">
                                <div className="cart__summary-row">
                                    <span>Subtotal ({items.length} items)</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>

                                {savings > 0 && (
                                    <div className="cart__summary-row cart__summary-row--savings">
                                        <span>You Save</span>
                                        <span>-₹{savings.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="cart__summary-row">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'cart__free-shipping' : ''}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>

                                {shipping > 0 && (
                                    <p className="cart__shipping-note">
                                        Add ₹{(2000 - subtotal).toLocaleString()} more for free shipping
                                    </p>
                                )}

                                <div className="cart__summary-divider"></div>

                                <div className="cart__summary-row cart__summary-row--total">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>

                                {savings > 0 && (
                                    <p className="cart__savings-text">
                                        🎉 You're saving ₹{savings.toLocaleString()} on this order!
                                    </p>
                                )}
                            </div>

                            <Link to="/checkout" className="btn btn-primary btn-lg btn-block">
                                Proceed to Checkout <ArrowRight size={20} />
                            </Link>

                            <div className="cart__trust-badges">
                                <span>🔒 Secure Checkout</span>
                                <span>📦 Free Shipping on ₹2000+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Cart;
