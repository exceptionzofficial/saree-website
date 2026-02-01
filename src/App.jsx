import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';

// Customer Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AnnouncementBar from './components/common/AnnouncementBar';
import CategoryNav from './components/common/CategoryNav';

// Customer Pages
import Home from './pages/customer/Home';
import Shop from './pages/customer/Shop';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import TrackOrder from './pages/customer/TrackOrder';
import About from './pages/customer/About';
import Contact from './pages/customer/Contact';
import BecomeMember from './pages/customer/BecomeMember';
import Login from './pages/auth/Login';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminSettings from './pages/admin/Settings';

import './App.css';

// Customer Layout Component
const CustomerLayout = ({ children }) => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <AnnouncementBar />
      <Header />
      <CategoryNav />
      <div className={isHome ? '' : 'page-container'}>
        {children}
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={
                <CustomerLayout>
                  <Home />
                </CustomerLayout>
              } />
              <Route path="/shop" element={
                <CustomerLayout>
                  <Shop />
                </CustomerLayout>
              } />
              <Route path="/product/:slug" element={
                <CustomerLayout>
                  <ProductDetail />
                </CustomerLayout>
              } />
              <Route path="/cart" element={
                <CustomerLayout>
                  <Cart />
                </CustomerLayout>
              } />
              <Route path="/checkout" element={
                <CustomerLayout>
                  <Checkout />
                </CustomerLayout>
              } />
              <Route path="/order-confirmation/:orderId" element={
                <CustomerLayout>
                  <OrderConfirmation />
                </CustomerLayout>
              } />
              <Route path="/track-order" element={
                <CustomerLayout>
                  <TrackOrder />
                </CustomerLayout>
              } />
              <Route path="/about" element={
                <CustomerLayout>
                  <About />
                </CustomerLayout>
              } />
              <Route path="/contact" element={
                <CustomerLayout>
                  <Contact />
                </CustomerLayout>
              } />
              <Route path="/membership" element={
                <CustomerLayout>
                  <BecomeMember />
                </CustomerLayout>
              } />
              <Route path="/login" element={
                <CustomerLayout>
                  <Login />
                </CustomerLayout>
              } />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;
