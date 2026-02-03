import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addItem, isInCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
    };

    const inCart = isInCart(product.id);

    return (
        <Link to={`/product/${product.slug}`} className="product-card">
            <div className="product-card__image-wrapper">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
                    alt={product.name}
                    className="product-card__image"
                    loading="lazy"
                />

                {/* Discount Badge */}
                {product.discount > 0 && (
                    <span className="product-card__discount">
                        -{product.discount}%
                    </span>
                )}

                {/* Bestseller Badge */}
                {product.bestseller && (
                    <span className="product-card__bestseller">
                        Bestseller
                    </span>
                )}

                {/* Quick Actions */}
                <div className="product-card__actions">
                    <button
                        className={`product-card__action-btn ${inCart ? 'product-card__action-btn--active' : ''}`}
                        onClick={handleAddToCart}
                        aria-label={inCart ? 'Added to cart' : 'Add to cart'}
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>

                {/* Hover Overlay */}
                <div className="product-card__overlay">
                    <span className="product-card__view-btn">View Details</span>
                </div>
            </div>

            <div className="product-card__content">
                {/* Category */}
                <span className="product-card__category">
                    {product.fabric}
                </span>

                {/* Name */}
                <h3 className="product-card__name">{product.name}</h3>

                {/* Rating */}
                <div className="product-card__rating">
                    <Star size={14} className="product-card__star" />
                    <span>{product.rating}</span>
                    <span className="product-card__reviews">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="product-card__price">
                    <span className="product-card__current-price">
                        ₹{(product.discountPrice || product.price || 0).toLocaleString()}
                    </span>
                    {(product.originalPrice || product.price) && (product.originalPrice || product.price) !== (product.discountPrice || product.price) && (
                        <span className="product-card__original-price">
                            ₹{(product.originalPrice || product.price).toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
