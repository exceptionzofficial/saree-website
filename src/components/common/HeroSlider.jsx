import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroSlider.css';

// Import local banners
import banner1 from '../../assets/banner2.jpg';
import banner2 from '../../assets/banner1.jpg';
import banner3 from '../../assets/banner4.jpg';
import banner4 from '../../assets/banner3.jpeg';
import banner5 from '../../assets/banner5.jpg';

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        {
            id: 1,
            tag: 'MEGA',
            title: 'Love Sale',
            discount: '30',
            text: 'ON TIMELESS SILK SAREES & MORE.',
            image: banner1,
            btnText: 'Shop Now',
            btnLink: '/shop'
        },
        {
            id: 2,
            tag: 'FESTIVE',
            title: 'Grand Sale',
            discount: '40',
            text: 'ON PREMIUM KANCHIPURAM SILKS.',
            image: banner2,
            btnText: 'Explore Collection',
            btnLink: '/shop?category=silk'
        },
        {
            id: 3,
            tag: 'EXCLUSIVE',
            title: 'Bridal Edit',
            discount: '25',
            text: 'ON WEDDING COLLECTION.',
            image: banner3,
            btnText: 'Shop Bridal',
            btnLink: '/shop?tag=bridal'
        },
        {
            id: 4,
            tag: 'SPECIAL',
            title: 'Handloom',
            discount: '35',
            text: 'ON AUTHENTIC HANDWOVEN SAREES.',
            image: banner4,
            btnText: 'View Handloom',
            btnLink: '/shop?category=handloom'
        },
        {
            id: 5,
            tag: 'LATEST',
            title: 'New Arrivals',
            discount: '20',
            text: 'ON LATEST DESIGNER COLLECTION.',
            image: banner5,
            btnText: 'Explore New',
            btnLink: '/shop?sort=newest'
        }
    ];

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [nextSlide, isPaused]);

    return (
        <section
            className="hero-slider"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="hero-slider__container">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`hero-slider__slide ${index === currentSlide ? 'hero-slider__slide--active' : ''}`}
                    >
                        {/* Background Image */}
                        <div className="hero-slider__bg">
                            <img src={slide.image} alt={slide.title} className="hero-slider__image" />
                        </div>

                        {/* Promotional Overlay Box - Like Pothys */}
                        {index === currentSlide && (
                            <div className="hero-slider__promo-box">
                                <span className="hero-slider__promo-tag">{slide.tag}</span>
                                <h2 className="hero-slider__promo-title">{slide.title}</h2>
                                <div className="hero-slider__promo-divider"></div>
                                <div className="hero-slider__promo-discount">
                                    <span className="hero-slider__promo-upto">UPTO</span>
                                    <span className="hero-slider__promo-percent">{slide.discount}%</span>
                                    <span className="hero-slider__promo-off">OFF</span>
                                </div>
                                <p className="hero-slider__promo-text">{slide.text}</p>
                                <Link to={slide.btnLink} className="hero-slider__promo-btn">
                                    {slide.btnText}
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="hero-slider__dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`hero-slider__dot ${index === currentSlide ? 'hero-slider__dot--active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>

            {/* Arrow Navigation */}
            <button
                className="hero-slider__arrow hero-slider__arrow--prev"
                onClick={prevSlide}
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                className="hero-slider__arrow hero-slider__arrow--next"
                onClick={nextSlide}
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

        </section>
    );
};

export default HeroSlider;
