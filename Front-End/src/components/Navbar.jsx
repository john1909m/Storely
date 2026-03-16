// components/Navbar.jsx (Vision Pro AR Style)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User, Sparkles, Globe} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { isAuthenticated, role, user, logout } = useAuth();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'VENDOR':
        return '/vendor/dashboard';
      default:
        return '/';
    }
  };

  const navLinks = [
    { name: 'Home', href: '/', ariaLabel: 'Go to homepage', icon: <Globe className="h-4 w-4" /> },
    { name: 'Pricing', href: '/pricing', ariaLabel: 'View pricing plans', icon: <Sparkles className="h-4 w-4" /> },
    { name: 'Contact', href: '/contact', ariaLabel: 'Contact us', icon: <Globe className="h-4 w-4" /> },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? 'py-3' 
          : 'py-5'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Floating glass background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent backdrop-blur-3xl border-b border-white/10"></div>
      
      {/* 3D Light effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo with 3D effect */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group relative"
            aria-label="Storely homepage"
            onMouseEnter={() => setHoveredItem('logo')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* 3D Hover effect */}
            <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 blur-2xl transition-opacity duration-700 fill-white ${
              hoveredItem === 'logo' ? 'opacity-50' : 'opacity-0'
            }`}></div>
            
            <div className="h-16 w-16 sm:h-14 sm:w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden fill-white">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-purple-400/0 group-hover:animate-shimmer fill-white" ></div>
              <img 
                src="Logo_new_w.png" 
                alt="Storely Logo" 
                className="h-10 w-10 fill-white scale-160  sm:h-7 sm:w-7 object-contain brightness-200 drop-shadow-2xl relative z-10"
                loading="eager"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-2xl [text-shadow:0_0_30px_rgba(255,255,255,0.5)]">
              Storely
            </span>
          </Link>

          {/* Desktop Navigation with 3D cards */}
          <div className="hidden md:flex items-center space-x-2 bg-white/5 backdrop-blur-2xl rounded-3xl p-1.5 border border-white/10 shadow-2xl">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative group"
                aria-label={link.ariaLabel}
                onMouseEnter={() => setHoveredItem(link.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* 3D Hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-xl transition-opacity duration-500 rounded-2xl ${
                  hoveredItem === link.name ? 'opacity-100' : 'opacity-0'
                }`}></div>
                
                <div className="relative px-5 py-2.5 rounded-2xl flex items-center space-x-2 overflow-hidden">
                  {/* Background shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="text-white/80 group-hover:text-white transition-colors duration-300">
                    {link.icon}
                  </span>
                  <span className="text-white/80 group-hover:text-white font-medium transition-colors duration-300">
                    {link.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Buttons with 3D effects */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {role?.toUpperCase() === 'CUSTOMER' && (
                  <Link
                    to="/cart"
                    className="relative group"
                    onMouseEnter={() => setHoveredItem('cart')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-xl transition-opacity duration-500 rounded-2xl ${
                      hoveredItem === 'cart' ? 'opacity-100' : 'opacity-0'
                    }`}></div>
                    
                    <div className="relative p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
                      <ShoppingCart className="h-5 w-5 text-white/80 group-hover:text-white" />
                      {itemCount > 0 && (
                        <span 
                          className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse"
                          aria-label={`${itemCount} items in cart`}
                        >
                          {itemCount > 9 ? '9+' : itemCount}
                        </span>
                      )}
                    </div>
                  </Link>
                )}
                
                <Link
                  to={getDashboardLink()}
                  className="relative group"
                  onMouseEnter={() => setHoveredItem('dashboard')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-xl transition-opacity duration-500 rounded-2xl ${
                    hoveredItem === 'dashboard' ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                  
                  <div className="relative px-4 py-2.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-300 flex items-center space-x-2">
                    <User className="h-5 w-5 text-white/80 group-hover:text-white" />
                    <span className="text-white/80 group-hover:text-white font-medium">Dashboard</span>
                  </div>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="relative group"
                  onMouseEnter={() => setHoveredItem('logout')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-red-400/30 to-pink-400/30 blur-xl transition-opacity duration-500 rounded-2xl ${
                    hoveredItem === 'logout' ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                  
                  <div className="relative px-4 py-2.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-300 flex items-center space-x-2">
                    <LogOut className="h-5 w-5 text-white/80 group-hover:text-white" />
                    <span className="text-white/80 group-hover:text-white font-medium">Logout</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-xl transition-opacity duration-500 rounded-2xl ${
                      hoveredItem === 'login' ? 'opacity-100' : 'opacity-0'
                    }`}></div>
                    
                    <div className="relative px-5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
                      <span className="text-white/80 group-hover:text-white font-medium">Login</span>
                    </div>
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="relative group overflow-hidden rounded-2xl">
                    {/* 3D Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 left-0 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-float"></div>
                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-float animation-delay-2000"></div>
                    </div>
                    
                    <span className="relative z-10 px-5 py-2.5 text-white font-medium flex items-center space-x-2">
                      <span>Sign Up</span>
                      <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    </span>
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button with 3D effect */}
          <button
            className="md:hidden p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu with 3D floating effect */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden mt-4 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-4 animate-slide-down shadow-2xl"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center space-x-3 text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                  aria-label={link.ariaLabel}
                >
                  <span className="text-white/60">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <div className="flex flex-col space-y-2 pt-4 mt-2 border-t border-white/10">
                {isAuthenticated ? (
                  <>
                    {role?.toUpperCase() === 'CUSTOMER' && (
                      <Link
                        to="/cart"
                        className="flex items-center justify-center space-x-2 px-4 py-3 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Cart ({itemCount})</span>
                      </Link>
                    )}
                    
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center justify-center space-x-2 px-4 py-3 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      <User className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 px-4 py-3 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300"
                      role="menuitem"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-3 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl text-center transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-medium rounded-xl text-center hover:shadow-2xl transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;