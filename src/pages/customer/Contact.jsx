import { useState } from 'react';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageCircle,
    Instagram,
    Facebook
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import './Contact.css';

const Contact = () => {
    const { settings } = useOrders();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        setTimeout(() => setSubmitted(false), 5000);
    };

    const contactInfo = [
        {
            icon: <MapPin size={24} />,
            title: 'Visit Us',
            lines: [
                settings.storeAddress || '123 Saree Street',
                'Chennai, Tamil Nadu 600001'
            ]
        },
        {
            icon: <Phone size={24} />,
            title: 'Call Us',
            lines: [
                settings.storePhone || '+91 98765 43210',
                'Mon - Sat: 10 AM - 7 PM'
            ]
        },
        {
            icon: <Mail size={24} />,
            title: 'Email Us',
            lines: [
                settings.storeEmail || 'hello@sareeelegance.com',
                'We reply within 24 hours'
            ]
        },
        {
            icon: <Clock size={24} />,
            title: 'Working Hours',
            lines: [
                'Monday - Saturday',
                '10:00 AM - 7:00 PM'
            ]
        }
    ];

    const faqItems = [
        {
            question: 'How long does delivery take?',
            answer: 'Standard delivery takes 5-7 business days. Express delivery is available for select locations.'
        },
        {
            question: 'What is your return policy?',
            answer: 'We offer easy 7-day returns for unused products with original tags and packaging.'
        },
        {
            question: 'How do I track my order?',
            answer: 'Use your Order ID on our Track Order page to check real-time status updates.'
        },
        {
            question: 'Are all sarees authentic?',
            answer: 'Yes! We source directly from certified weavers and provide authenticity certificates for silk sarees.'
        }
    ];

    return (
        <main className="contact">
            {/* Hero Section */}
            <section className="contact__hero">
                <div className="container">
                    <div className="contact__hero-content">
                        <span className="contact__hero-tag">Get in Touch</span>
                        <h1 className="contact__hero-title">We'd Love to Hear From You</h1>
                        <p className="contact__hero-text">
                            Have a question about our sarees, need styling advice, or want to share your feedback?
                            We're here to help!
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="contact__info section">
                <div className="container">
                    <div className="contact__info-grid">
                        {contactInfo.map((item, index) => (
                            <div key={index} className="contact__info-card">
                                <div className="contact__info-icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                {item.lines.map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="contact__main section">
                <div className="container">
                    <div className="contact__content">
                        {/* Form */}
                        <div className="contact__form-section">
                            <div className="contact__form-header">
                                <h2>Send us a Message</h2>
                                <p>Fill out the form below and we'll get back to you shortly.</p>
                            </div>

                            {submitted && (
                                <div className="contact__success">
                                    <MessageCircle size={24} />
                                    <span>Thank you! Your message has been sent successfully.</span>
                                </div>
                            )}

                            <form className="contact__form" onSubmit={handleSubmit}>
                                <div className="contact__form-row">
                                    <div className="contact__field">
                                        <label>Your Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                    <div className="contact__field">
                                        <label>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Your phone number"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="contact__field">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div className="contact__field">
                                    <label>Subject *</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="product">Product Inquiry</option>
                                        <option value="order">Order Related</option>
                                        <option value="return">Returns & Refunds</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="contact__field">
                                    <label>Your Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us how we can help you..."
                                        rows={5}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg">
                                    <Send size={18} />
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Sidebar */}
                        <div className="contact__sidebar">
                            {/* WhatsApp CTA */}
                            <div className="contact__whatsapp">
                                <div className="contact__whatsapp-content">
                                    <MessageCircle size={32} />
                                    <h3>Chat with Us</h3>
                                    <p>Get instant replies on WhatsApp</p>
                                    <a
                                        href={`https://wa.me/91${settings.storePhone?.replace(/[^0-9]/g, '') || '9876543210'}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-success"
                                    >
                                        Start WhatsApp Chat
                                    </a>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="contact__social">
                                <h3>Follow Us</h3>
                                <p>Stay updated with our latest collections</p>
                                <div className="contact__social-links">
                                    <a href="#" className="contact__social-link contact__social-link--instagram">
                                        <Instagram size={24} />
                                        <span>@sareeelegance</span>
                                    </a>
                                    <a href="#" className="contact__social-link contact__social-link--facebook">
                                        <Facebook size={24} />
                                        <span>Saree Elegance</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="contact__faq section">
                <div className="container">
                    <div className="contact__faq-header">
                        <h2>Frequently Asked Questions</h2>
                        <p>Quick answers to common queries</p>
                    </div>

                    <div className="contact__faq-grid">
                        {faqItems.map((item, index) => (
                            <div key={index} className="contact__faq-item">
                                <h4>{item.question}</h4>
                                <p>{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;
