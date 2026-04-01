import { useState, useEffect } from 'react';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { logout, getToken } from '../services/authService';
import { isTokenExpired } from '../utils/jwt';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = getToken();
      if (token) {
        if (isTokenExpired(token)) {
          logout();
          setIsLoggedIn(false);
          // Optional: navigate('/login') here if you want to kick them out immediately
        } else {
          setIsLoggedIn(true);
        }
      }
    };

    checkToken(); // Kiểm tra lúc vừa load
    const intervalId = setInterval(checkToken, 60 * 1000); // Mỗi 1 phút kiểm tra lại 1 lần
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">

          {/* Left: Logo */}
          <div className="flex items-center gap-8 xl:gap-12">
            {/* Logo */}
            <div className="flex flex-col justify-center cursor-pointer">
              <div className="text-[28px] font-black font-display tracking-tighter text-gray-800 leading-none">
                Up<span className="bg-linear-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Work</span>
              </div>
              <span className="text-[9px] text-gray-500 font-medium mt-0.5">
                Tiếp lợi thế - Nối thành công
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors font-sans group">
              Việc làm
              <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </a>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors font-sans group">
              Hồ sơ CV
              <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </a>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors font-sans group">
              Công ty
              <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 transition-colors outline-none cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                    <User size={18} />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User size={16} />
                      Hồ sơ cá nhân
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2 rounded-full border border-indigo-600 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-colors font-sans outline-none"
                >
                  Đăng ký
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 rounded-full bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity font-sans outline-none shadow-sm shadow-indigo-200"
                >
                  Đăng nhập
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
