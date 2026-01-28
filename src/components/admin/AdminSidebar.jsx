import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Settings,
    LogOut,
    X
} from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        navigate('/admin/login');
    };

    const navItems = [
        { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/admin/products', icon: <Package size={20} />, label: 'Products' },
        { to: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
        { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' }
    ];

    return (
        <>
            <aside className={`admin-sidebar ${isOpen ? 'admin-sidebar--open' : ''}`}>
                <div className="admin-sidebar__header">
                    <div className="admin-sidebar__logo">
                        <span className="admin-sidebar__logo-icon">✨</span>
                        <span className="admin-sidebar__logo-text">Admin Panel</span>
                    </div>
                    <button className="admin-sidebar__close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="admin-sidebar__nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                            }
                            onClick={onClose}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar__footer">
                    <button className="admin-sidebar__logout" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {isOpen && (
                <div className="admin-sidebar__overlay" onClick={onClose}></div>
            )}
        </>
    );
};

export default AdminSidebar;
