import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../feature/auth/authThunk';
import { useTheme } from '../context/ThemeContext';
import icon from '../assets/icon.png'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    closeMenu();
    navigate('/login');
  };

  return (
    <header className="navbar shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img src={icon} alt="Logo" className="w-8 h-8" />
          <Link to="/home" className="text-2xl font-bold text-orange-600" style={{ letterSpacing: '0.01em' }}>
            Digital Recipe Book
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 text-md items-center">
            <li><Link to="/home" className="hover:underline">Home</Link></li>
            <li><Link to="/recipes" className="hover:underline">Recipes</Link></li>
            {user && <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>}
          </ul>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${theme === 'dark'
                  ? 'bg-gray-700 text-gray-200'
                  : 'bg-gray-200 text-gray-800'
                } transition-all duration-200`}
              style={{ minWidth: '90px' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white font-semibold rounded-full px-4 py-2 hover:bg-red-600 transition"
                  style={{ minWidth: '90px' }}
                >
                  Logout
                </button>
                <Link to="/profile" className="ml-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:shadow-md transition">
                    {user.displayName ? user.displayName[0].toUpperCase() : <span role="img" aria-label="profile">👤</span>}
                  </div>
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-red-500 text-white font-semibold rounded-full px-4 py-2 hover:bg-red-600 transition"
                style={{ minWidth: '90px' }}
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-2xl bg-transparent border-none">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden card w-full rounded-none rounded-b-2xl p-0 pt-2 pb-4">
          <ul className="flex flex-col items-center gap-4 py-2">
            <li><Link to="/home" onClick={closeMenu} className="hover:underline">Home</Link></li>
            <li><Link to="/recipes" onClick={closeMenu} className="hover:underline">Recipes</Link></li>
            {user && <li><Link to="/dashboard" onClick={closeMenu} className="hover:underline">Dashboard</Link></li>}
            <li>
              <button
                onClick={() => { toggleTheme(); closeMenu(); }}
                className="px-4 py-2 rounded-full border-none bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                style={{ minWidth: '90px' }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </li>
            <li>
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="btn-main"
                    style={{ width: 'auto', minWidth: '90px', background: '#ef4444' }}
                  >
                    Logout
                  </button>
                  <Link to="/profile" onClick={closeMenu}>
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:shadow-md transition">
                      {user.displayName ? user.displayName[0].toUpperCase() : <span role="img" aria-label="profile">👤</span>}
                    </div>
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="btn-main"
                  style={{ width: 'auto', minWidth: '90px' }}
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
