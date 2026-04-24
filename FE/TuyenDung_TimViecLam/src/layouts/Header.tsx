import { useState, useEffect } from 'react';
import { ChevronDown, User, LogOut, Menu, X, History, Heart, LayoutDashboard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { logout, getToken, getUserRole, getUserId } from '../services/authService';
import { getCVByUserId } from '../services/cvService';
import { isTokenExpired } from '../utils/jwt';


const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const role = (getUserRole() || '').toUpperCase();

  // Debug: log role để kiểm tra tại sao không hiện menu
  useEffect(() => {
    if (isLoggedIn) {
      console.log("Header - User Role:", role);
    }
  }, [isLoggedIn, role]);


  useEffect(() => {
    const checkToken = () => {
      const token = getToken();
      if (token) {
        if (isTokenExpired(token)) {
          logout();
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      }
    };

    checkToken();
    const intervalId = setInterval(checkToken, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch avatar when logged in and listen for updates
  useEffect(() => {
    const fetchAvatar = async () => {
      const userId = getUserId();
      if (userId && isLoggedIn) {
        try {
          const res = await getCVByUserId(userId);
          if (res.success && res.data?.avatar) {
            setAvatarUrl(`/images/avatar/${res.data.avatar}`);
          }
        } catch (e) {
          console.error("Failed to fetch avatar for header", e);
        }
      }
    };

    if (isLoggedIn) {
      fetchAvatar();
    } else {
      setAvatarUrl(null);
    }

    const handleAvatarUpdate = () => fetchAvatar();
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate);
  }, [isLoggedIn]);

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
            <Link to="/" className="flex flex-col justify-center cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-[28px] font-black font-display tracking-tighter text-gray-800 leading-none">
                Up<span className="bg-linear-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Work</span>
              </div>
              <span className="text-[9px] text-gray-500 font-medium mt-0.5 hidden sm:block">
                Tiếp lợi thế - Nối thành công
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/jobs" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors font-sans group">
              Việc làm
              <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </Link>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors font-sans group">
              Hồ sơ CV
              <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </a>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors font-sans group">
              Công ty
              <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </a>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors font-sans group">
              Tin tức
              <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {isLoggedIn ? (
                <div
                  className="relative"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 transition-colors outline-none cursor-pointer">
                    {avatarUrl ? (
                      <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden shadow-sm shadow-indigo-200 border-2 border-indigo-100 flex items-center justify-center">
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover aspect-square" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 shrink-0 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                        <User size={18} />
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <Link
                        to={(role === 'CANDIDATE' ? '/profile' : '/recruiter-profile')}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User size={16} />
                        Hồ sơ cá nhân
                      </Link>
                      <div className="h-px bg-gray-100 my-1"></div>
                      {/* Menu cho Ứng viên */}
                      {role === 'CANDIDATE' && (
                        <>
                          <Link
                            to="/applied-jobs"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            <History size={16} />
                            Lịch sử ứng tuyển
                          </Link>
                          <div className="h-px bg-gray-100 my-1"></div>
                          <Link
                            to="/saved-jobs"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            <Heart size={16} />
                            Việc làm đã lưu
                          </Link>
                          <div className="h-px bg-gray-100 my-1"></div>
                        </>
                      )}

                      {/* Menu cho Nhà tuyển dụng */}
                      {(role === 'RECRUITER' || role === 'RECRUITER') && (
                        <>
                          <Link
                            to="/recruiter/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            <LayoutDashboard size={16} />
                            Quản lý tuyển dụng
                          </Link>
                          <div className="h-px bg-gray-100 my-1"></div>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
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
                    className="px-5 py-2 rounded-full border border-indigo-600 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-colors font-sans outline-none cursor-pointer"
                  >
                    Đăng ký
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 rounded-full bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity font-sans outline-none shadow-sm shadow-indigo-200 cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex lg:hidden items-center ml-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-2">
            <a href="#" className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors">
              Việc làm
              <ChevronDown size={18} className="text-gray-400" />
            </a>
            <a href="#" className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors">
              Hồ sơ CV
              <ChevronDown size={18} className="text-gray-400" />
            </a>
            <a href="#" className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors">
              Công ty
              <ChevronDown size={18} className="text-gray-400" />
            </a>
            <a href="#" className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors">
              Tin tức
              <ChevronDown size={18} className="text-gray-400" />
            </a>
          </nav>

          <div className="h-px bg-gray-100 mx-2 my-2"></div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 px-2 pb-2">
            {isLoggedIn ? (
              <>
                <Link
                  to={role === 'CANDIDATE' ? '/profile' : '/recruiter-profile'}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {avatarUrl ? (
                    <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden border border-indigo-100 flex items-center justify-center">
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover aspect-square" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <User size={18} />
                    </div>
                  )}
                  Trang cá nhân
                </Link>

                {role === 'CANDIDATE' && (
                  <>
                    <Link
                      to="/applied-jobs"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <History size={18} />
                      </div>
                      Lịch sử ứng tuyển
                    </Link>
                    <Link
                      to="/saved-jobs"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Heart size={18} />
                      </div>
                      Việc làm đã lưu
                    </Link>
                  </>
                )}

                {(role === 'RECRUITER' || role === 'RECRUITER') && (
                  <Link
                    to="/recruiter/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <LayoutDashboard size={18} />
                    </div>
                    Quản lý tuyển dụng
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <LogOut size={18} />
                  </div>
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl border border-indigo-600 text-indigo-600 font-bold text-center hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  Đăng ký
                </button>
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 text-white font-bold text-center hover:opacity-90 transition-opacity shadow-sm shadow-indigo-200 cursor-pointer"
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
