import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroSlider.css';

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        {
            id: 1,
            tag: 'New Collection 2026',
            title: 'Drape Yourself in ',
            accent: 'Timeless Elegance',
            text: 'Discover our exquisite collection of handcrafted sarees from the finest weavers across India. Each piece tells a story of tradition and artistry.',
            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1920',
            btnText: 'Shop Now',
            btnLink: '/shop'
        },
        {
            id: 2,
            tag: 'Festive Special',
            title: 'Celebrate in Style with ',
            accent: 'Royal Silks',
            text: 'Experience the grandeur of authentic Kanchipuram and Banarasi sarees, perfect for your most auspicious occasions.',
            image: 'https://images.unsplash.com/photo-1583391733981-8498408b9932?auto=format&fit=crop&q=80&w=1920',
            btnText: 'Explore Silk',
            btnLink: '/shop?category=silk'
        },
        {
            id: 3,
            tag: 'Authentic Handloom',
            title: 'The Art of ',
            accent: 'Traditional Weaving',
            text: 'Supporting master weavers to bring you masterpieces that carry the soul of Indian heritage in every thread.',
            image: 'https://images.unsplash.com/photo-1582236521508-3064f7ea7bc4?auto=format&fit=crop&q=80&w=1920',
            btnText: 'Our Heritage',
            btnLink: '/about'
        },
        {
            id: 4,
            tag: 'Bridal Special',
            title: 'Your Dream ',
            accent: 'Wedding Saree',
            text: 'Make your big day unforgettable with our handpicked bridal collection, featuring intricate zari and exquisite handwork.',
            image: 'https://images.unsplash.com/photo-1610030482684-28b9a2240974?auto=format&fit=crop&q=80&w=1920',
            btnText: 'Bridal Collection',
            btnLink: '/shop?tag=bridal'
        },
        {
            id: 5,
            tag: 'Modern Trends',
            title: 'Contemporary Designs for ',
            accent: 'Modern Woman',
            text: 'Elegant fusion sarees that blend traditional charm with modern aesthetic for today’s fashion-forward woman.',
            image: 'https://images.unsplash.com/photo-1593358055562-23c2a6881c1c?auto=format&fit=crop&q=80&w=1920',
            btnText: 'Shop Trends',
            btnLink: '/shop'
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
                        {/* Background with overlay */}
                        <div className="hero-slider__bg">
                            <img src={slide.image} alt={slide.accent} className="hero-slider__image" />
                            <div className="hero-slider__overlay"></div>
                            <div className="hero-slider__particles"></div>
                        </div>

                        {/* Content */}
                        <div className="container">
                            <div className="hero-slider__content">
                                <span className="hero-slider__tag">{slide.tag}</span>
                                <h1 className="hero-slider__title">
                                    {slide.title}
                                    <span className="hero-slider__accent">{slide.accent}</span>
                                </h1>
                                <p className="hero-slider__text">{slide.text}</p>
                                <div className="hero-slider__actions">
                                    <Link to={slide.btnLink} className="btn btn-secondary btn-lg">
                                        {slide.btnText} <ArrowRight size={20} />
                                    </Link>
                                    <Link to="/about" className="btn btn-outline btn-lg hero-slider__btn-outline">
                                        Our Story
                                    </Link>
                                </div>
                            </div>
                        </div>
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

            {/* Decorative bottom curve */}
            <div className="hero-slider__decoration"></div>
        </section>
    );
};

export default HeroSlider;
