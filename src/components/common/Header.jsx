import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Menu,
    X,
    ShoppingBag,
    Search,
    Heart,
    User,
    ChevronDown
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useMembership } from '../../context/MembershipContext';
import logo from '../../assets/logo.png';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { getCartCount } = useCart();
    const { user, isAuthenticated } = useAuth();
    const { getUserMembershipStatus } = useMembership();

    const membershipStatus = getUserMembershipStatus();
    // Show "Member Portal" only when membership is active (not completed or none)
    const hasActiveMembership = membershipStatus === 'active';

    const cartCount = getCartCount();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Shop' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <>
            <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
                <div className="header__container">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="header__menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <Link to="/" className="header__logo">
                        <img src={logo} alt="GURUBAGAVAN SAREES" className="header__logo-img" />
                        <div className="header__logo-text-wrapper">
                            <span className="header__logo-text">GURUBAGAVAN</span>
                            <span className="header__logo-accent">SAREES</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="header__nav">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`header__nav-link ${location.pathname === link.path ? 'header__nav-link--active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="header__actions">
                        <Link to={hasActiveMembership ? "/seller/dashboard" : "/membership"} className={`header__seller-btn btn ${hasActiveMembership ? 'btn-secondary' : 'btn-outline'} btn-sm`}>
                            {hasActiveMembership ? 'Member Portal' : 'Become a Member'}
                        </Link>

                        {isAuthenticated ? (
                            <Link to="/profile" className="header__profile-icon" title="My Profile">
                                <div className="header__profile-avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </Link>
                        ) : (
                            <Link to="/login" className="header__login-link">
                                Login
                            </Link>
                        )}

                        <div className="header__actions-divider"></div>

                        <button
                            className="header__action-btn"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        <Link to="/cart" className="header__action-btn header__cart-btn">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="header__cart-count">{cartCount}</span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className={`header__search ${isSearchOpen ? 'header__search--open' : ''}`}>
                    <form onSubmit={handleSearch} className="header__search-form">
                        <Search size={20} className="header__search-icon" />
                        <input
                            type="text"
                            placeholder="Search for sarees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="header__search-input"
                        />
                        <button type="submit" className="header__search-submit">
                            Search
                        </button>
                    </form>
                </div>
            </header>

            {/* Mobile Menu - Outside header to avoid stacking context issues from backdrop-filter */}
            <div className={`header__mobile-menu ${isMenuOpen ? 'header__mobile-menu--open' : ''}`}>
                <nav className="header__mobile-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`header__mobile-link ${location.pathname === link.path ? 'header__mobile-link--active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="header__mobile-divider"></div>
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="header__mobile-link">
                                My Profile ({user.name})
                            </Link>
                            {hasActiveMembership && (
                                <Link to="/seller/dashboard" className="header__mobile-link header__mobile-link--highlight">
                                    Member Portal
                                </Link>
                            )}
                        </>
                    ) : (
                        <Link to="/login" className="header__mobile-link">
                            Login / Register
                        </Link>
                    )}

                    {!hasActiveMembership && (
                        <Link to="/membership" className="header__mobile-link">
                            Become a Member
                        </Link>
                    )}

                    <div className="header__mobile-divider"></div>
                    <Link to="/admin" className="header__mobile-link">
                        Admin Login
                    </Link>
                </nav>
            </div>

            {/* Overlay - Outside header to avoid stacking context issues */}
            {isMenuOpen && (
                <div
                    className="header__overlay"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Header;
