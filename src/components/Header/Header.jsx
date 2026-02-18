import React, { useState, useEffect } from 'react';
import { Container, Logo, LogoutBtn } from '../index';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Heart, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [coins] = useState(320);
  const { darkMode, toggleDarkMode } = useTheme();

  const isHome = location.pathname === '/';

  const navItems = [
    { name: 'Home', slug: "/", active: !authStatus },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Dashboard", slug: "/dashboard", active: authStatus },
    { name: "Appointments", slug: "/appointments", active: authStatus },
    { name: "Community", slug: "/helping-points", active: authStatus },
    { name: "Reports", slug: "/reports", active: authStatus },
    { name: "Settings", slug: "/settings", active: authStatus },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerBgClass = !isHome || scrolled
    ? 'bg-[#0a0c2e]/95 backdrop-blur-xl shadow-2xl border-b border-indigo-500/10'
    : 'bg-transparent';

  const textColorClass = 'text-white';
  const navItemColorClass = !isHome || scrolled ? 'text-indigo-200 hover:text-white hover:bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10';
  const coinBtnColorClass = !isHome || scrolled ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20' : 'bg-white/10 text-yellow-300 hover:bg-white/20';
  const logoutBtnClass = 'bg-red-600 text-white hover:bg-red-700';
  const mobileMenuBtnColorClass = 'text-white hover:bg-white/10';

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full h-16 z-[1000] transition-all duration-500 ${headerBgClass}`}
      >
        <Container>
          <nav className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <Link to="/" className="z-50 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className={`font-black text-xl transition-colors duration-300 ${textColorClass}`}>
                Aarogya SOS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) =>
                item.active && (
                  <Link
                    key={item.name}
                    to={item.slug}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${navItemColorClass}`}
                  >
                    {item.name}
                    <span className="absolute inset-x-3 bottom-1 h-0.5 bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
                  </Link>
                )
              )}

              {/* Coins badge */}
              {authStatus && (
                <button
                  onClick={() => navigate('/helping-points')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ml-1 ${coinBtnColorClass}`}
                >
                  <span>🪙</span>
                  <span>{coins}</span>
                </button>
              )}

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 ml-1"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {authStatus && (
                <LogoutBtn className={`ml-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${logoutBtnClass}`} />
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden z-50 p-2 rounded-xl transition-colors duration-200 ${mobileMenuBtnColorClass}`}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Navigation */}
            <div
              className={`fixed inset-0 bg-[#0a0c2e] backdrop-blur-3xl transform transition-transform duration-500 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                } md:hidden`}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-8 px-8">
                {/* Logo in mobile menu */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-black text-3xl text-white">Aarogya SOS</span>
                </div>

                {navItems.map((item) =>
                  item.active && (
                    <button
                      key={item.name}
                      onClick={() => { navigate(item.slug); setMenuOpen(false); }}
                      className="text-2xl font-bold text-indigo-100 hover:text-white transition-colors duration-200 w-full text-center py-2"
                    >
                      {item.name}
                    </button>
                  )
                )}

                {/* Dark mode toggle in mobile */}
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

                {authStatus && (
                  <div className="flex flex-col gap-4 w-full items-center">
                    <button
                      onClick={() => { navigate('/helping-points'); setMenuOpen(false); }}
                      className="flex items-center gap-2 px-8 py-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-2xl font-bold"
                    >
                      🪙 {coins} Aarogya Coins
                    </button>
                    <LogoutBtn className="w-full max-w-[200px] px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/20" />
                  </div>
                )}
              </div>
            </div>
          </nav>
        </Container>
      </header>

      {/* Spacer */}
      {!isHome && <div className="h-16" />}
    </>
  );
}

export default Header;
