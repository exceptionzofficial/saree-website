import { Link } from 'react-router-dom';
import { Heart, Award, Truck, Users, ArrowRight } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import './About.css';

const About = () => {
    const { settings } = useOrders();
    const values = [
        {
            icon: <Heart size={32} />,
            title: 'Passion for Tradition',
            description: 'We celebrate the rich heritage of Indian textiles and bring you sarees that carry stories of generations.'
        },
        {
            icon: <Award size={32} />,
            title: 'Quality Assured',
            description: 'Every saree is handpicked and quality checked to ensure you receive only the finest products.'
        },
        {
            icon: <Truck size={32} />,
            title: 'Reliable Delivery',
            description: 'We ensure your precious sarees reach you safely, packaged with love and care.'
        },
        {
            icon: <Users size={32} />,
            title: 'Customer First',
            description: 'Your satisfaction is our priority. We\'re here to help you find your perfect saree.'
        }
    ];

    const stats = [
        { number: '5000+', label: 'Happy Customers' },
        { number: '1000+', label: 'Saree Designs' },
        { number: '50+', label: 'Weaver Partners' },
        { number: '100%', label: 'Authentic Products' }
    ];

    return (
        <main className="about">
            {/* Hero Section */}
            <section className="about__hero">
                <div className="container">
                    <div className="about__hero-content">
                        <span className="about__hero-tag">Our Story</span>
                        <h1 className="about__hero-title">
                            Weaving Dreams into
                            <span className="about__hero-accent"> Reality</span>
                        </h1>
                        <p className="about__hero-text">
                            At {settings.storeName?.toUpperCase() || 'GURUBAGAVAN SAREES'}, we believe every saree is more than just fabric –
                            it's a piece of art, a story waiting to be told, a tradition passed down through generations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="about__story section">
                <div className="container">
                    <div className="about__story-content">
                        <div className="about__story-text">
                            <h2>Our Journey</h2>
                            <p>
                                Founded with a vision to bring the finest handcrafted sarees from across India
                                to your doorstep, {settings.storeName?.toUpperCase() || 'GURUBAGAVAN SAREES'} started as a small family venture driven by
                                passion for Indian textiles.
                            </p>
                            <p>
                                Today, we work directly with master weavers from Kanchipuram, Banaras,
                                Chanderi, and many other renowned textile hubs, ensuring fair compensation
                                for their incredible craftsmanship while bringing you authentic, premium quality sarees.
                            </p>
                            <p>
                                Every thread in our collection represents the dedication of skilled artisans,
                                the richness of Indian culture, and our commitment to keeping these
                                traditional art forms alive.
                            </p>
                        </div>
                        <div className="about__story-image">
                            <img
                                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800"
                                alt="Saree weaving"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about__values section">
                <div className="container">
                    <div className="about__section-header">
                        <span className="about__section-tag">What We Stand For</span>
                        <h2 className="about__section-title">Our Values</h2>
                    </div>

                    <div className="about__values-grid">
                        {values.map((value, index) => (
                            <div key={index} className="about__value-card">
                                <div className="about__value-icon">{value.icon}</div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="about__stats">
                <div className="container">
                    <div className="about__stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="about__stat">
                                <span className="about__stat-number">{stat.number}</span>
                                <span className="about__stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="about__mission section">
                <div className="container">
                    <div className="about__mission-content">
                        <h2>Our Mission</h2>
                        <p className="about__mission-text">
                            "To preserve and promote the rich heritage of Indian textiles by connecting
                            skilled artisans with discerning customers worldwide, while ensuring fair
                            trade practices and sustainable craftsmanship."
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about__cta">
                <div className="container">
                    <div className="about__cta-content">
                        <h2>Ready to Experience Elegance?</h2>
                        <p>Explore our curated collection of authentic handcrafted sarees</p>
                        <Link to="/shop" className="btn btn-secondary btn-lg">
                            Shop Collection <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
