import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Award, RefreshCw } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../../components/common/ProductCard';
import HeroSlider from '../../components/common/HeroSlider';
import './Home.css';

const Home = () => {
    const { categories, getFeaturedProducts, getBestsellers } = useProducts();

    const featuredProducts = getFeaturedProducts().slice(0, 4);
    const bestsellers = getBestsellers().slice(0, 4);

    const features = [
        {
            icon: <Truck size={32} />,
            title: 'Free Shipping',
            description: 'On orders above ₹2000'
        },
        {
            icon: <Shield size={32} />,
            title: 'Secure Payment',
            description: 'UPI & GPay accepted'
        },
        {
            icon: <Award size={32} />,
            title: 'Premium Quality',
            description: 'Handpicked sarees'
        },
        {
            icon: <RefreshCw size={32} />,
            title: 'Easy Returns',
            description: '7 days return policy'
        }
    ];

    const testimonials = [
        {
            name: 'Priya Sharma',
            location: 'Mumbai',
            text: 'Absolutely stunning collection! The Kanjivaram saree I ordered exceeded my expectations. The quality is impeccable.',
            rating: 5
        },
        {
            name: 'Lakshmi Devi',
            location: 'Chennai',
            text: 'Best place to buy authentic silk sarees. The customer service is excellent and delivery was prompt.',
            rating: 5
        },
        {
            name: 'Anita Patel',
            location: 'Bangalore',
            text: 'I\'ve been ordering from GURUBAGAVAN SAREES for 2 years now. Never disappointed! Highly recommend.',
            rating: 5
        }
    ];

    useEffect(() => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => {
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    return (
        <main className="home">
            {/* Hero Slider */}
            <HeroSlider />

            {/* Features Section */}
            {/* <section className="home__features">
                <div className="container">
                    <div className="home__features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="home__feature">
                                <div className="home__feature-icon">{feature.icon}</div>
                                <h3 className="home__feature-title">{feature.title}</h3>
                                <p className="home__feature-text">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* Categories Section */}
            <section className="home__categories section">
                <div className="container">
                    <div className="home__section-header reveal reveal-up">
                        <span className="home__section-tag">Browse By</span>
                        <h2 className="home__section-title">Shop by Category</h2>
                        <div className="divider-accent"></div>
                    </div>

                    <div className="home__categories-grid reveal reveal-up reveal-stagger">
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                to={`/shop?category=${category.id}`}
                                className="home__category-card"
                            >
                                <div className="home__category-image-wrapper">
                                    <img src={category.image} alt={category.name} className="home__category-image" />
                                </div>
                                <h3 className="home__category-name">{category.name}</h3>
                                <p className="home__category-description">{category.description}</p>
                                <span className="home__category-link">
                                    Explore <ArrowRight size={16} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="home__products section">
                <div className="container">
                    <div className="home__section-header reveal reveal-up">
                        <span className="home__section-tag">Handpicked For You</span>
                        <h2 className="home__section-title">Featured Collection</h2>
                        <div className="divider-accent"></div>
                    </div>

                    <div className="home__products-grid reveal reveal-up reveal-stagger">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="home__products-action reveal reveal-up">
                        <Link to="/shop" className="btn btn-primary btn-lg">
                            View All Products <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Banner Section */}
            <section className="home__banner reveal reveal-in">
                <div className="home__banner-content">
                    <span className="home__banner-tag">Limited Time Offer</span>
                    <h2 className="home__banner-title">
                        Upto 30% Off on Bridal Collection
                    </h2>
                    <p className="home__banner-text">
                        Make your special day even more memorable with our exclusive bridal sarees
                    </p>
                    <Link to="/shop?tag=bridal" className="btn btn-secondary btn-lg">
                        Shop Bridal Collection
                    </Link>
                </div>
            </section>

            {/* Bestsellers */}
            <section className="home__products section">
                <div className="container">
                    <div className="home__section-header reveal reveal-up">
                        <span className="home__section-tag">Most Loved</span>
                        <h2 className="home__section-title">Bestselling Sarees</h2>
                        <div className="divider-accent"></div>
                    </div>

                    <div className="home__products-grid reveal reveal-up reveal-stagger">
                        {bestsellers.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="home__testimonials section">
                <div className="container">
                    <div className="home__section-header reveal reveal-up">
                        <span className="home__section-tag">What Our Customers Say</span>
                        <h2 className="home__section-title">Customer Stories</h2>
                        <div className="divider-accent"></div>
                    </div>

                    <div className="home__testimonials-grid reveal reveal-up reveal-stagger">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="home__testimonial">
                                <div className="home__testimonial-stars">
                                    {'★'.repeat(testimonial.rating)}
                                </div>
                                <p className="home__testimonial-text">"{testimonial.text}"</p>
                                <div className="home__testimonial-author">
                                    <span className="home__testimonial-name">{testimonial.name}</span>
                                    <span className="home__testimonial-location">{testimonial.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="home__cta reveal reveal-in">
                <div className="container">
                    <div className="home__cta-content">
                        <h2 className="home__cta-title">Ready to Find Your Perfect Saree?</h2>
                        <p className="home__cta-text">
                            Browse our extensive collection and find the saree that speaks to you
                        </p>
                        <Link to="/shop" className="btn btn-secondary btn-lg">
                            Start Shopping <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
