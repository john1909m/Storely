// components/Navbar.jsx (Calm White & Burgundy Style)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User, Sparkles, Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { isAuthenticated, role, user, logout } = useAuth();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    {
      name: t('components.navbar.links.home.name'),
      href: '/',
      ariaLabel: t('components.navbar.links.home.ariaLabel'),
      icon: <Globe className="h-4 w-4" />,
    },
    {
      name: t('components.navbar.links.pricing.name'),
      href: '/pricing',
      ariaLabel: t('components.navbar.links.pricing.ariaLabel'),
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      name: t('components.navbar.links.contact.name'),
      href: '/contact',
      ariaLabel: t('components.navbar.links.contact.ariaLabel'),
      icon: <Globe className="h-4 w-4" />,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/95 backdrop-blur-md border-b border-gray-100 ${
        isScrolled ? 'py-2 shadow-sm' : 'py-4'
      }`}
      role="navigation"
      aria-label={t('components.navbar.aria.mainNavigation')}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            aria-label={t('components.navbar.aria.siteHome')}
            onMouseEnter={() => setHoveredItem('logo')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="h-12 w-12 sm:h-11 sm:w-11 flex items-center justify-center rounded-xl bg-[#800020]/5 border border-[#800020]/10 group-hover:bg-[#800020]/10 transition-colors duration-300">
              <img
                src="Logo_new_w.png"
                alt={t('components.navbar.logoAlt')}
                className="h-7 w-7 sm:h-6 sm:w-6 object-contain"
                loading="eager"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#800020] tracking-tight">
              Storely
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative group"
                aria-label={link.ariaLabel}
                onMouseEnter={() => setHoveredItem(link.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300 ${
                  hoveredItem === link.name ? 'bg-[#800020]/5' : ''
                }`}>
                  <span className={`transition-colors duration-300 ${
                    hoveredItem === link.name ? 'text-[#800020]' : 'text-gray-500'
                  }`}>
                    {link.icon}
                  </span>
                  <span className={`font-medium transition-colors duration-300 ${
                    hoveredItem === link.name ? 'text-[#800020]' : 'text-gray-700'
                  }`}>
                    {link.name}
                  </span>
                </div>
                {/* Underline indicator */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#800020] rounded-full transition-all duration-300 ${
                  hoveredItem === link.name ? 'w-6' : 'w-0'
                }`}></div>
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
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
                    <div className={`p-2.5 rounded-lg transition-colors duration-300 ${
                      hoveredItem === 'cart' ? 'bg-[#800020]/5' : 'hover:bg-gray-50'
                    }`}>
                      <ShoppingCart className={`h-5 w-5 transition-colors duration-300 ${
                        hoveredItem === 'cart' ? 'text-[#800020]' : 'text-gray-600'
                      }`} />
                      {itemCount > 0 && (
                        <span
                          className="absolute -top-1 -right-1 bg-[#800020] text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center"
                          aria-label={t('components.navbar.aria.cartItems', { count: itemCount })}
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
                  <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300 ${
                    hoveredItem === 'dashboard' ? 'bg-[#800020]/5' : 'hover:bg-gray-50'
                  }`}>
                    <User className={`h-4 w-4 transition-colors duration-300 ${
                      hoveredItem === 'dashboard' ? 'text-[#800020]' : 'text-gray-600'
                    }`} />
                    <span className={`font-medium transition-colors duration-300 ${
                      hoveredItem === 'dashboard' ? 'text-[#800020]' : 'text-gray-700'
                    }`}>
                      {t('components.navbar.actions.dashboard')}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="relative group"
                  onMouseEnter={() => setHoveredItem('logout')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300 ${
                    hoveredItem === 'logout' ? 'bg-red-50' : 'hover:bg-gray-50'
                  }`}>
                    <LogOut className={`h-4 w-4 transition-colors duration-300 ${
                      hoveredItem === 'logout' ? 'text-red-500' : 'text-gray-600'
                    }`} />
                    <span className={`font-medium transition-colors duration-300 ${
                      hoveredItem === 'logout' ? 'text-red-500' : 'text-gray-700'
                    }`}>
                      {t('components.navbar.actions.logout')}
                    </span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button
                    className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-300"
                    onMouseEnter={() => setHoveredItem('login')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className={hoveredItem === 'login' ? 'text-[#800020]' : ''}>
                      {t('components.navbar.actions.login')}
                    </span>
                  </button>
                </Link>
                <Link to="/signup">
                  <button
                    className="px-5 py-2.5 rounded-lg bg-[#800020] text-white font-medium hover:bg-[#6a001a] transition-all duration-300 shadow-sm hover:shadow-md flex items-center space-x-2"
                    onMouseEnter={() => setHoveredItem('signup')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span>{t('components.navbar.actions.signup')}</span>
                    <Sparkles className={`h-4 w-4 transition-transform duration-300 ${
                      hoveredItem === 'signup' ? 'rotate-12' : ''
                    }`} />
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? t('components.navbar.aria.closeMenu') : t('components.navbar.aria.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden mt-3 rounded-2xl bg-white border border-gray-100 p-3 animate-slide-down shadow-lg"
            role="menu"
            aria-label={t('components.navbar.aria.mobileNavigationMenu')}
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center space-x-3 text-gray-700 hover:text-[#800020] hover:bg-[#800020]/5 px-4 py-3 rounded-xl transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                  aria-label={link.ariaLabel}
                >
                  <span className="text-gray-400">{link.icon}</span>
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}

              <div className="flex flex-col space-y-2 pt-3 mt-2 border-t border-gray-100">
                {isAuthenticated ? (
                  <>
                    {role?.toUpperCase() === 'CUSTOMER' && (
                      <Link
                        to="/cart"
                        className="flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:text-[#800020] hover:bg-[#800020]/5 rounded-xl transition-colors duration-300"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>{t('components.navbar.actions.cartCount', { count: itemCount })}</span>
                      </Link>
                    )}

                    <Link
                      to={getDashboardLink()}
                      className="flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:text-[#800020] hover:bg-[#800020]/5 rounded-xl transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      <User className="h-5 w-5" />
                      <span>{t('components.navbar.actions.dashboard')}</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-300"
                      role="menuitem"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>{t('components.navbar.actions.logout')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-3 text-gray-700 hover:text-[#800020] hover:bg-[#800020]/5 rounded-xl text-center font-medium transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      {t('components.navbar.actions.login')}
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-3 bg-[#800020] text-white font-medium rounded-xl text-center hover:bg-[#6a001a] transition-colors duration-300 shadow-sm"
                      onClick={() => setIsMenuOpen(false)}
                      role="menuitem"
                    >
                      {t('components.navbar.actions.signup')}
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