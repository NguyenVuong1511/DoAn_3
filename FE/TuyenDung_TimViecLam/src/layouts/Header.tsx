import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

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
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
