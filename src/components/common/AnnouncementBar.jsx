import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
    const { settings } = useOrders();
    const [isVisible, setIsVisible] = useState(true);

    // Default announcements if none set by admin
    const defaultAnnouncements = [
        '🏆 Refer 7 friends & get a Pure Gold Coin! ✨',
        '💵 Refer 5 friends & get 100% Money Back on your saree!',
        '🚚 Free Delivery on orders above ₹2000!',
        '✨ New Arrivals - Kanchipuram Silk Collection',
        '💫 Authentic Handwoven Sarees from Master Weavers'
    ];

    // Use admin-set announcements or defaults
    const announcements = settings.announcements?.length > 0
        ? settings.announcements
        : defaultAnnouncements;

    if (!isVisible || announcements.length === 0) return null;

    return (
        <div className="announcement-bar">
            <div className="announcement-bar__track">
                <div className="announcement-bar__content">
                    {/* Double the content for seamless loop */}
                    {[...announcements, ...announcements].map((text, index) => (
                        <span key={index} className="announcement-bar__item">
                            {text}
                            <span className="announcement-bar__separator">•</span>
                        </span>
                    ))}
                </div>
            </div>
            <button
                className="announcement-bar__close"
                onClick={() => setIsVisible(false)}
                aria-label="Close announcement"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default AnnouncementBar;
