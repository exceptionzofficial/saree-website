import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    Heart,
    Share2,
    Minus,
    Plus,
    Star,
    Truck,
    Shield,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    ArrowLeft
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/common/ProductCard';
import './ProductDetail.css';

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { getProductBySlug, products } = useProducts();
    const { addItem, isInCart } = useCart();

    const product = getProductBySlug(slug);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeAccordion, setActiveAccordion] = useState('details');
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    if (!product) {
        return (
            <main className="product-detail">
                <div className="container product-detail__not-found">
                    <h2>Product Not Found</h2>
                    <p>Sorry, the product you're looking for doesn't exist.</p>
                    <Link to="/shop" className="btn btn-primary">
                        Back to Shop
                    </Link>
                </div>
            </main>
        );
    }

    const handleAddToCart = () => {
        addItem(product, quantity);
    };

    const handleBuyNow = () => {
        addItem(product, quantity);
        navigate('/cart');
    };

    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? '' : section);
    };

    // Handle mouse move for zoom
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const handleMouseEnter = () => {
        setIsZooming(true);
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    // Get related products (same category, excluding current)
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const inCart = isInCart(product.id);

    const accordions = [
        {
            id: 'details',
            title: 'Product Details',
            content: (
                <div className="product-detail__accordion-content">
                    <ul className="product-detail__details-list">
                        <li><strong>Fabric:</strong> {product.fabric}</li>
                        <li><strong>Length:</strong> {product.length}</li>
                        <li><strong>Weight:</strong> {product.weight}</li>
                        <li><strong>Blouse:</strong> {product.blouse}</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'features',
            title: 'Features',
            content: (
                <ul className="product-detail__features-list">
                    {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            )
        },
        {
            id: 'care',
            title: 'Care Instructions',
            content: <p>{product.care}</p>
        },
        {
            id: 'shipping',
            title: 'Shipping & Returns',
            content: (
                <div>
                    <p><strong>Shipping:</strong> Free shipping on orders above ₹2000. Delivery within 5-7 business days.</p>
                    <p><strong>Returns:</strong> Easy 7-day returns. Product must be unused with original tags.</p>
                </div>
            )
        }
    ];

    return (
        <main className="product-detail">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="product-detail__breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/shop">Shop</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </nav>

                {/* Back Button - Mobile */}
                <button className="product-detail__back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="product-detail__main">
                    {/* Images Section */}
                    <div className="product-detail__images">
                        <div
                            className="product-detail__main-image"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="product-detail__image"
                            />
                            {product.discount > 0 && (
                                <span className="product-detail__discount-badge">
                                    -{product.discount}%
                                </span>
                            )}
                            {/* Zoom Lens */}
                            {isZooming && (
                                <div
                                    className="product-detail__zoom-lens"
                                    style={{
                                        left: `${zoomPosition.x}%`,
                                        top: `${zoomPosition.y}%`
                                    }}
                                />
                            )}
                        </div>

                        {/* Zoomed Preview */}
                        {isZooming && (
                            <div className="product-detail__zoom-result">
                                <div
                                    className="product-detail__zoom-image"
                                    style={{
                                        backgroundImage: `url(${product.images[selectedImage]})`,
                                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
                                    }}
                                />
                            </div>
                        )}

                        {product.images.length > 1 && (
                            <div className="product-detail__thumbnails">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        className={`product-detail__thumbnail ${selectedImage === index ? 'product-detail__thumbnail--active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={image} alt={`${product.name} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="product-detail__info">
                        <div className="product-detail__header">
                            <span className="product-detail__category">{product.fabric}</span>
                            <h1 className="product-detail__title">{product.name}</h1>

                            {/* Rating */}
                            <div className="product-detail__rating">
                                <div className="product-detail__stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
                                        />
                                    ))}
                                </div>
                                <span className="product-detail__rating-text">
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="product-detail__price">
                                <span className="product-detail__current-price">
                                    ₹{(product.discountPrice || product.price || 0).toLocaleString()}
                                </span>
                                {(product.originalPrice || product.price) !== (product.discountPrice || product.price) && (
                                    <>
                                        <span className="product-detail__original-price">
                                            ₹{(product.originalPrice || product.price || 0).toLocaleString()}
                                        </span>
                                        <span className="product-detail__savings">
                                            You save ₹{((product.originalPrice || product.price || 0) - (product.discountPrice || product.price || 0)).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="product-detail__description">{product.description}</p>

                        {/* Tags */}
                        <div className="product-detail__tags">
                            {product.tags.map(tag => (
                                <span key={tag} className="product-detail__tag">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Quantity & Actions */}
                        <div className="product-detail__actions">
                            <div className="product-detail__quantity">
                                <span className="product-detail__quantity-label">Quantity:</span>
                                <div className="product-detail__quantity-controls">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)}>
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="product-detail__buttons">
                                <button
                                    className={`btn btn-primary btn-lg product-detail__add-btn ${inCart ? 'product-detail__add-btn--added' : ''}`}
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingBag size={20} />
                                    {inCart ? 'Added to Cart' : 'Add to Cart'}
                                </button>
                                <button
                                    className="btn btn-secondary btn-lg product-detail__buy-btn"
                                    onClick={handleBuyNow}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Features Icons */}
                        <div className="product-detail__features">
                            <div className="product-detail__feature">
                                <Truck size={24} />
                                <span>Free Shipping</span>
                            </div>
                            <div className="product-detail__feature">
                                <Shield size={24} />
                                <span>Secure Payment</span>
                            </div>
                            <div className="product-detail__feature">
                                <RefreshCw size={24} />
                                <span>Easy Returns</span>
                            </div>
                        </div>

                        {/* Accordions */}
                        <div className="product-detail__accordions">
                            {accordions.map(accordion => (
                                <div
                                    key={accordion.id}
                                    className={`product-detail__accordion ${activeAccordion === accordion.id ? 'product-detail__accordion--open' : ''}`}
                                >
                                    <button
                                        className="product-detail__accordion-header"
                                        onClick={() => toggleAccordion(accordion.id)}
                                    >
                                        <span>{accordion.title}</span>
                                        {activeAccordion === accordion.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    {activeAccordion === accordion.id && (
                                        <div className="product-detail__accordion-body">
                                            {accordion.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="product-detail__related">
                        <h2 className="product-detail__related-title">You May Also Like</h2>
                        <div className="product-detail__related-grid">
                            {relatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};

export default ProductDetail;
