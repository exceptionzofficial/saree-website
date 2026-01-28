import { Link } from 'react-router-dom';
import {
    Phone,
    Mail,
    MapPin,
    Instagram,
    Facebook,
    Send,
    Heart
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { path: '/shop', label: 'Shop All' },
        { path: '/shop?category=silk', label: 'Silk Sarees' },
        { path: '/shop?category=cotton', label: 'Cotton Sarees' },
        { path: '/shop?category=banarasi', label: 'Banarasi Sarees' },
        { path: '/shop?category=kanjivaram', label: 'Kanjivaram Sarees' },
    ];

    const helpLinks = [
        { path: '/track-order', label: 'Track Order' },
        { path: '/about', label: 'About Us' },
        { path: '/contact', label: 'Contact Us' },
        { path: '/shipping', label: 'Shipping Info' },
        { path: '/returns', label: 'Returns & Exchange' },
    ];

    return (
        <footer className="footer">
            {/* Newsletter Section */}
            <div className="footer__newsletter">
                <div className="footer__newsletter-content">
                    <h3 className="footer__newsletter-title">
                        Stay Updated with New Collections
                    </h3>
                    <p className="footer__newsletter-text">
                        Subscribe to get exclusive offers and new arrival updates
                    </p>
                    <form className="footer__newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="footer__newsletter-input"
                        />
                        <button type="submit" className="footer__newsletter-btn">
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Footer */}
            <div className="footer__main">
                <div className="footer__container">
                    {/* Brand Section */}
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <span className="footer__logo-text">Saree</span>
                            <span className="footer__logo-accent">Elegance</span>
                        </Link>
                        <p className="footer__tagline">
                            Draping you in timeless elegance. We bring the finest handcrafted
                            sarees from across India to your doorstep.
                        </p>
                        <div className="footer__social">
                            <a href="#" className="footer__social-link" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="footer__social-link" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__links">
                        <h4 className="footer__links-title">Shop</h4>
                        <ul className="footer__links-list">
                            {quickLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="footer__link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div className="footer__links">
                        <h4 className="footer__links-title">Help</h4>
                        <ul className="footer__links-list">
                            {helpLinks.map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="footer__link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer__contact">
                        <h4 className="footer__links-title">Contact Us</h4>
                        <div className="footer__contact-list">
                            <a href="tel:+919876543210" className="footer__contact-item">
                                <Phone size={18} />
                                <span>+91 98765 43210</span>
                            </a>
                            <a href="mailto:contact@sareeelegance.com" className="footer__contact-item">
                                <Mail size={18} />
                                <span>contact@sareeelegance.com</span>
                            </a>
                            <div className="footer__contact-item">
                                <MapPin size={18} />
                                <span>123 Fashion Street, Silk Bazaar, Chennai - 600001</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer__bottom">
                <div className="footer__container footer__bottom-content">
                    <p className="footer__copyright">
                        © {currentYear} Saree Elegance. All rights reserved.
                    </p>
                    <p className="footer__made-with">
                        Made with <Heart size={14} className="footer__heart" /> in India
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
