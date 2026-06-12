import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from './components/AnimatedPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CompareBar from './components/CompareBar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import BrandPage from './pages/BrandPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderTrack from './pages/OrderTrack';
import Visualizer from './pages/Visualizer';
import PaintCalculator from './pages/PaintCalculator';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Compare from './pages/Compare';
import Settings from './pages/Settings';
import './styles/App.css';

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="main-content">
        <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/products" element={<AnimatedPage><Products /></AnimatedPage>} />
            <Route path="/product/:id" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
            <Route path="/brand/:brandName" element={<AnimatedPage><BrandPage /></AnimatedPage>} />
            <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
            <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
            <Route path="/orders" element={<AnimatedPage><Orders /></AnimatedPage>} />
            <Route path="/orders/:id/track" element={<AnimatedPage><OrderTrack /></AnimatedPage>} />
            <Route path="/visualizer" element={<AnimatedPage><Visualizer /></AnimatedPage>} />
            <Route path="/calculator" element={<AnimatedPage><PaintCalculator /></AnimatedPage>} />
            <Route path="/admin/*" element={<AnimatedPage><Admin /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/signup" element={<AnimatedPage><Signup /></AnimatedPage>} />
            <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
            <Route path="/compare" element={<AnimatedPage><Compare /></AnimatedPage>} />
            <Route path="/settings" element={<AnimatedPage><Settings /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </main>
      <CompareBar />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <CompareProvider>
            <ToastProvider>
              <div className="app">
                <AppContent />
              </div>
            </ToastProvider>
          </CompareProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
