import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import './CategoryNav.css';

const CategoryNav = () => {
    const [activeMenu, setActiveMenu] = useState(null);

    const categories = [
        {
            name: 'Pure Silk',
            path: '/shop?category=pure-silk',
            hasMegaMenu: true,
            megaMenuContent: {
                columns: [
                    {
                        title: 'Kanjivaram Silk',
                        links: ['Wedding Kanjivaram', 'Traditional Kanjivaram', 'Soft Silk', 'Temple Border Silk']
                    },
                    {
                        title: 'Other Silks',
                        links: ['Banarasi Silk', 'Mysore Silk', 'Tussar Silk', 'Chiffon Silk']
                    },
                    {
                        title: 'Silk Special',
                        links: ['Printed Silk', 'Embroidery Silk'],
                        specialLinks: [
                            { label: 'Pure Silk | Above ₹5000', path: '/shop?category=pure-silk&price=above-5000' }
                        ]
                    }
                ]
            }
        },
        {
            name: 'Semi Silk',
            path: '/shop?category=semi-silk',
            hasMegaMenu: true,
            megaMenuContent: {
                columns: [
                    {
                        title: 'Semi Silk Varieties',
                        links: ['Art Silk', 'Poly Silk', 'Cotton Silk', 'Tissue Silk']
                    },
                    {
                        title: 'Occasion Wear',
                        links: ['Party Wear', 'Evening Wear', 'Office Wear']
                    },
                    {
                        title: 'Budget Friendly',
                        specialLinks: [
                            { label: 'Under ₹2000', path: '/shop?category=semi-silk&price=under-2000' },
                            { label: '₹2000 - ₹5000', path: '/shop?category=semi-silk&price=2000-5000' }
                        ]
                    }
                ]
            }
        },
        {
            name: 'Cotton Saree',
            path: '/shop?category=cotton-saree',
            hasMegaMenu: true,
            megaMenuContent: {
                columns: [
                    {
                        title: 'Shop Cotton Sarees',
                        links: [
                            'Andhra Cotton', 'Bengal Cotton', 'Budget Cotton', 'Chanderi Cotton',
                            'Chettinad Cotton', 'Chikankari Cotton', 'Chirala Cotton'
                        ]
                    },
                    {
                        title: '',
                        links: [
                            'Coimbatore Cotton', 'Ikkat Cotton', 'Jute Cotton', 'Kalamkari Cotton',
                            'Kanchi Cotton', 'Kerala Sarees', 'Khadi Cotton'
                        ]
                    },
                    {
                        title: '',
                        links: [
                            'Kota Cotton', 'Linen Cotton', 'Maheshwari Cotton', 'Mangalgiri Cotton',
                            'Mul Mul Cotton', 'Narayanapet Cotton', 'Nine Yards Cotton', 'Polycotton',
                            'Semisilk Cotton', 'Sungudi Cotton', 'Venkatagiri Cotton'
                        ],
                        specialLinks: [
                            { label: 'Cotton Sarees | ₹ 500 To ₹ 1000', path: '/shop?price=500-1000' },
                            { label: 'Cotton Sarees | Above ₹ 1000', path: '/shop?price=above-1000' }
                        ]
                    },
                    {
                        title: 'Shop Designer Sarees',
                        links: [
                            'Casual Wear', 'Designer Sarees'
                        ],
                        specialLinks: [
                            { label: 'Designer Sarees | Below ₹ 1000', path: '/shop?category=designer&price=below-1000' },
                            { label: 'Designer Sarees | Above ₹ 1000', path: '/shop?category=designer&price=above-1000' }
                        ]
                    }
                ]
            }
        },
        {
            name: 'Pillars of Gurubagavan Sarees',
            path: '/pillars',
            hasMegaMenu: true,
            megaMenuContent: {
                columns: [
                    {
                        title: 'Signature Collections',
                        links: ['Samudrika Pattu', 'Parampara Pattu', 'Vastrakala Pattu', 'Handloom Specials']
                    },
                    {
                        title: 'Heritage',
                        links: ['Our Story', 'Craftsmanship', 'Awards']
                    }
                ]
            }
        },
        {
            name: 'Half Sarees',
            path: '/shop?category=half-saree',
            hasMegaMenu: true,
            megaMenuContent: {
                columns: [
                    {
                        title: 'Traditional',
                        links: ['Silk Half Saree', 'Pavada Sattai', 'Langa Voni']
                    },
                    {
                        title: 'Modern Fusion',
                        links: ['Ready-to-wear', 'Designer Half Sarees']
                    },
                    {
                        title: 'Age Groups',
                        links: ['Teens (13-19)', 'Adults']
                    }
                ]
            }
        },
        {
            name: 'Womens',
            path: '/shop?category=womens',
            hasMegaMenu: true,
            megaMenuContent: {
                columns: [
                    {
                        title: 'Ethnic Wear',
                        links: ['Salwar Suits', 'Kurtis', 'Lehengas', 'Gowns']
                    },
                    {
                        title: 'Readymade',
                        links: ['Blouses', 'Leggings', 'Dupattas']
                    },
                    {
                        title: 'Jewellery',
                        links: ['Necklace Sets', 'Earrings', 'Bangles']
                    }
                ]
            }
        },
        // {
        //     name: 'Mens & Kids Wear',
        //     path: '/shop?category=mens-kids',
        //     hasMegaMenu: true,
        //     megaMenuContent: {
        //         columns: [
        //             {
        //                 title: 'Mens Wear',
        //                 links: ['Dhotis', 'Kurtas', 'Shirts', 'Wedding Suits']
        //             },
        //             {
        //                 title: 'Boys Wear',
        //                 links: ['Boys Dhotis', 'Pattu Pavadai', 'Shirts']
        //             },
        //             {
        //                 title: 'Girls Wear',
        //                 links: ['Ghararas', 'Frocks', 'Pavatdai Sets']
        //             }
        //         ]
        //     }
        // },
        {
            name: 'New Arrivals',
            path: '/shop?new-arrivals=true',
            hasMegaMenu: true,
            megaMenuContent: {
                columns: [
                    {
                        title: 'This Week',
                        links: ['Latest Silk', 'New Cotton Collection', 'Fresh Trends']
                    },
                    {
                        title: 'Seasonal',
                        links: ['Summer Specials', 'Wedding Season 2026']
                    }
                ]
            }
        },
    ];

    return (
        <nav className="category-nav">
            <div className="category-nav__container">
                <ul className="category-nav__list">
                    {categories.map((cat, index) => (
                        <li
                            key={index}
                            className={`category-nav__item ${cat.hasMegaMenu ? 'category-nav__item--has-mega' : ''}`}
                            onMouseEnter={() => cat.hasMegaMenu && setActiveMenu(index)}
                            onMouseLeave={() => setActiveMenu(null)}
                        >
                            <Link to={cat.path} className="category-nav__link">
                                {cat.name}
                                {cat.hasMegaMenu && <ChevronDown size={14} className="category-nav__chevron" />}
                            </Link>

                            {cat.hasMegaMenu && activeMenu === index && (
                                <div className="mega-menu">
                                    <div className="mega-menu__container">
                                        {cat.megaMenuContent.columns.map((col, colIdx) => (
                                            <div key={colIdx} className="mega-menu__column">
                                                <h3 className={`mega-menu__title ${!col.title ? 'mega-menu__title--empty' : ''}`}>
                                                    {col.title || '\u00A0'}
                                                </h3>
                                                <ul className="mega-menu__links">
                                                    {col.links && col.links.map((link, linkIdx) => (
                                                        <li key={linkIdx}>
                                                            <Link to={`/shop?search=${encodeURIComponent(link)}`} className="mega-menu__link">
                                                                {link}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                    {col.specialLinks && col.specialLinks.map((sLink, sIdx) => (
                                                        <li key={sIdx}>
                                                            <Link to={sLink.path} className="mega-menu__link mega-menu__link--special">
                                                                {sLink.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default CategoryNav;
