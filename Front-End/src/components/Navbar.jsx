// components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User, Store } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, role, user, logout } = useAuth();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const navigate = useNavigate();

  // تأثير عند التمرير
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
    { name: 'Home', href: '/', ariaLabel: 'Go to homepage' },
    { name: 'Pricing', href: '/pricing', ariaLabel: 'View pricing plans' },
    { name: 'Contact', href: '/contact', ariaLabel: 'Contact us' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-white/90 backdrop-blur-sm shadow-sm py-4'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - محسن للوصول */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group rounded-lg p-1"
            aria-label="Storely homepage"
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:shadow-lg transition-all duration-300">
              <img 
                src="Logo.png" 
                alt="Storely Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                loading="eager"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              Storely
            </span>
          </Link>

          {/* Desktop Navigation - محسن للوصول */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={link.ariaLabel}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons - محسن للوصول */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart for customers */}
                {role?.toUpperCase() === 'CUSTOMER' && (
                  <Link
                    to="/cart"
                    className="relative p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label={`Shopping cart with ${itemCount} items`}
                  >
                    <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
                    {itemCount > 0 && (
                      <span 
                        className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
                        aria-label={`${itemCount} items in cart`}
                      >
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </Link>
                )}
                
                {/* Dashboard link */}
                <Link
                  to={getDashboardLink()}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center space-x-2"
                  aria-label="Go to dashboard"
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
                  aria-label="Logout from your account"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button 
                    className="px-5 py-2.5 text-gray-700 font-medium hover:text-white hover:bg-indigo-600 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Login to your account"
                  >
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button 
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Create a new account"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button - محسن للوصول */}
          <button
            className="md:hidden p-2.5 hover:bg-indigo-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu - محسن للوصول */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-slide-down"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                  aria-label={link.ariaLabel}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    {role?.toUpperCase() === 'CUSTOMER' && (
                      <Link
                        to="/cart"
                        className="w-full px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 flex items-center justify-center space-x-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Cart ({itemCount})</span>
                      </Link>
                    )}
                    
                    <Link
                      to={getDashboardLink()}
                      className="w-full px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 flex items-center justify-center space-x-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      <User className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:border-red-600 hover:bg-red-50 flex items-center justify-center space-x-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
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
                      className="w-full px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 text-center transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
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