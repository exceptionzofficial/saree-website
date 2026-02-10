import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { MembershipProvider } from './context/MembershipContext';
import { AuthProvider } from './context/AuthContext';

// Customer Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AnnouncementBar from './components/common/AnnouncementBar';
import CategoryNav from './components/common/CategoryNav';
import ScrollToTop from './components/common/ScrollToTop';

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
import MembershipPayment from './pages/customer/MembershipPayment';
import SellerDashboard from './pages/customer/SellerDashboard';
import ClaimReward from './pages/customer/ClaimReward';
import Profile from './pages/customer/Profile';
import RewardHistory from './pages/customer/RewardHistory';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Orders from './pages/customer/Orders';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminMemberships from './pages/admin/MembershipRequests';
import RewardClaims from './pages/admin/RewardClaims';
import AdminSettings from './pages/admin/Settings';
import Analytics from './pages/admin/Analytics';

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
      <ScrollToTop />
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <MembershipProvider>
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
                  <Route path="/register" element={
                    <CustomerLayout>
                      <Register />
                    </CustomerLayout>
                  } />
                  <Route path="/profile" element={
                    <CustomerLayout>
                      <Profile />
                    </CustomerLayout>
                  } />
                  <Route path="/orders" element={
                    <CustomerLayout>
                      <Orders />
                    </CustomerLayout>
                  } />
                  <Route path="/membership/payment" element={
                    <CustomerLayout>
                      <MembershipPayment />
                    </CustomerLayout>
                  } />
                  <Route path="/seller/dashboard" element={
                    <CustomerLayout>
                      <SellerDashboard />
                    </CustomerLayout>
                  } />
                  <Route path="/membership/claim/:type" element={
                    <CustomerLayout>
                      <ClaimReward />
                    </CustomerLayout>
                  } />
                  <Route path="/reward-history" element={
                    <CustomerLayout>
                      <RewardHistory />
                    </CustomerLayout>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="memberships" element={<AdminMemberships />} />
                    <Route path="reward-claims" element={<RewardClaims />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </MembershipProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
