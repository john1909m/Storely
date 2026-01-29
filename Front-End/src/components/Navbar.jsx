// components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, role, user, logout } = useAuth();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const navigate = useNavigate();

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
      case 'CUSTOMER':
        return '/';
      default:
        return '/';
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'For Vendors', href: '/pricing' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">Storely</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart for customers */}
                {role?.toUpperCase() === 'CUSTOMER' && (
                  <Link
                    to="/cart"
                    className="relative px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                )}
                {/* Dashboard link */}
                <Link
                  to={getDashboardLink()}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors flex items-center space-x-2"
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-6 py-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-700 hover:text-indigo-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4">
                {isAuthenticated ? (
                  <>
                    {role?.toUpperCase() === 'CUSTOMER' && (
                      <Link
                        to="/cart"
                        className="w-full py-2 text-gray-700 font-medium border rounded-lg hover:border-indigo-600 flex items-center justify-center space-x-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Cart ({itemCount})</span>
                      </Link>
                    )}
                    <Link
                      to={getDashboardLink()}
                      className="w-full py-2 text-gray-700 font-medium border rounded-lg hover:border-indigo-600 flex items-center justify-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 text-gray-700 font-medium border rounded-lg hover:border-indigo-600 flex items-center justify-center space-x-2"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="w-full py-2 text-gray-700 font-medium border rounded-lg hover:border-indigo-600 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 text-center"
                      onClick={() => setIsMenuOpen(false)}
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