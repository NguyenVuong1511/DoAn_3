import { useState, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowBigLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Refs để focus vào ô input lỗi
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Helper: hiện lỗi + focus vào input lỗi
  const showError = (msg: string, ref?: React.RefObject<HTMLInputElement | null>) => {
    setError(msg);
    setTimeout(() => ref?.current?.focus(), 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate phía client
    if (!email.trim()) return showError('Vui lòng nhập email.', emailRef);
    if (!password) return showError('Vui lòng nhập mật khẩu.', passwordRef);

    setLoading(true);
    try {
      const user = await loginApi({ email: email.trim(), password });

      // Điều hướng theo role
      if (user.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100/60">

        {/* Left Panel - Branding */}
        <div className="hidden lg:flex flex-col justify-between w-[42%] bg-linear-to-br from-purple-600 via-indigo-600 to-blue-500 p-10 relative overflow-hidden">
          {/* Decorative dots */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => (
                <div
                  key={`${row}-${col}`}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{ top: row * 24, right: col * 24 }}
                />
              ))
            )}
          </div>
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <div
                  key={`${row}-${col}`}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{ bottom: row * 24, left: col * 24 }}
                />
              ))
            )}
          </div>

          {/* Logo */}
          <div className="flex flex-col z-10">
            <div className="text-[32px] font-black tracking-tighter text-white leading-none">
              Up<span className="text-white/70">Work</span>
            </div>
            <span className="text-[11px] text-white/60 font-medium mt-1">
              Tiếp lợi thế - Nối thành công
            </span>
          </div>

          {/* Center content */}
          <div className="z-10">
            <h2 className="text-3xl font-black text-white leading-tight mb-4">
              Chào mừng<br />trở lại!
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Đăng nhập để tiếp tục hành trình sự nghiệp của bạn và khám phá hàng nghìn cơ hội việc làm hấp dẫn.
            </p>
          </div>

          {/* Bottom */}
          <p className="text-white/40 text-xs z-10">© 2025 UpWork. All rights reserved.</p>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 bg-white p-8 sm:p-10">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline mb-3">
            <ArrowBigLeft size={15} />Trang chủ
          </button>

          {/* Mobile Logo */}
          <div className="flex flex-col mb-6 lg:hidden">
            <div className="text-[26px] font-black tracking-tighter text-gray-800 leading-none">
              Up<span className="bg-linear-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Work</span>
            </div>
            <span className="text-[9px] text-gray-500 font-medium mt-0.5">Tiếp lợi thế - Nối thành công</span>
          </div>

          <h1 className="text-2xl font-black text-gray-800 mb-1">Đăng nhập</h1>
          <p className="text-sm text-gray-500 mb-8">Chào mừng bạn quay trở lại UpWork</p>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600">Mật khẩu</label>
                <a href="#" className="text-xs text-indigo-600 font-semibold hover:underline">Quên mật khẩu?</a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => setRemember(!remember)}
                className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${remember ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'
                  }`}
              >
                {remember && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span onClick={() => setRemember(!remember)} className="text-xs text-gray-500">Ghi nhớ đăng nhập</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">Hoặc đăng nhập bằng</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-3 gap-2.5">
            <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" /><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" /><path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" /><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" /></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              Facebook
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="#0A66C2" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              LinkedIn
            </button>
          </div>

          {/* Register redirect */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Chưa có tài khoản?{' '}
            <a href="/register" className="text-indigo-600 font-semibold hover:underline">Đăng ký ngay</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
