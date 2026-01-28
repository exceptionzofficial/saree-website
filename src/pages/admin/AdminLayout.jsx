import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Check authentication
    const auth = localStorage.getItem('adminAuth');
    const isAuthenticated = auth ? JSON.parse(auth).isAuthenticated : false;

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="admin-layout">
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="admin-layout__main">
                <header className="admin-layout__header">
                    <button
                        className="admin-layout__menu-btn"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <span className="admin-layout__brand">Saree Elegance Admin</span>
                </header>

                <main className="admin-layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
