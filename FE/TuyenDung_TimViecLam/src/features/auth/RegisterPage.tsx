import { useState } from 'react';
import {
  Eye, EyeOff, User, Mail, Lock, ArrowRight, ArrowBigLeft,
  Building2, Globe, MapPin, FileText, Phone, Calendar, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerCandidateApi, registerEmployerApi } from '../../services/authService';

const inputClass =
  'w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-60';
const labelClass = 'block text-xs font-semibold text-gray-600 mb-1.5';

const SectionDivider = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 pt-1">
    <div className="flex-1 h-px bg-indigo-100" />
    <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider whitespace-nowrap">
      {title}
    </span>
    <div className="flex-1 h-px bg-indigo-100" />
  </div>
);

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');

  // ── Form state chung ──────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ── Ứng viên ──────────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');

  // ── Nhà tuyển dụng ────────────────────────────────────────────────────────
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  // ── Reset lỗi khi đổi role ────────────────────────────────────────────────
  const handleRoleChange = (r: 'candidate' | 'employer') => {
    setRole(r);
    setError('');
    setSuccessMsg('');
  };

  // ── Validate chung ────────────────────────────────────────────────────────
  const validate = () => {
    if (!email.trim()) return 'Vui lòng nhập email.';
    if (!password) return 'Vui lòng nhập mật khẩu.';
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    if (password !== confirmPassword) return 'Xác nhận mật khẩu không khớp.';
    if (role === 'candidate' && !fullName.trim()) return 'Vui lòng nhập họ và tên.';
    if (role === 'employer' && !companyName.trim()) return 'Vui lòng nhập tên công ty.';
    if (!agreed) return 'Bạn cần đồng ý với điều khoản dịch vụ.';
    return '';
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      if (role === 'candidate') {
        await registerCandidateApi({
          email: email.trim(),
          password,
          confirmPassword,
          fullName: fullName.trim(),
          phone: phone.trim() || undefined,
          dateOfBirth: dateOfBirth || undefined,
          gender: gender || undefined,
          address: address.trim() || undefined,
        });
      } else {
        await registerEmployerApi({
          email: email.trim(),
          password,
          confirmPassword,
          companyName: companyName.trim(),
          companyAddress: companyAddress.trim() || undefined,
          companyWebsite: companyWebsite.trim() || undefined,
          companyDescription: companyDescription.trim() || undefined,
        });
      }

      setSuccessMsg('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100/60">

        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-between w-[42%] bg-linear-to-br from-purple-600 via-indigo-600 to-blue-500 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => (
                <div key={`${row}-${col}`} className="absolute w-2 h-2 bg-white rounded-full"
                  style={{ top: row * 24, right: col * 24 }} />
              ))
            )}
          </div>
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <div key={`${row}-${col}`} className="absolute w-2 h-2 bg-white rounded-full"
                  style={{ bottom: row * 24, left: col * 24 }} />
              ))
            )}
          </div>

          <div className="flex flex-col z-10">
            <div className="text-[32px] font-black tracking-tighter text-white leading-none">
              Up<span className="text-white/70">Work</span>
            </div>
            <span className="text-[11px] text-white/60 font-medium mt-1">Tiếp lợi thế - Nối thành công</span>
          </div>

          <div className="z-10">
            <h2 className="text-3xl font-black text-white leading-tight mb-4">
              {role === 'employer'
                ? <> Tìm kiếm<br />nhân tài!</>
                : <> Chào mừng bạn<br />đến với UpWork</>}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {role === 'employer'
                ? 'Đăng tin tuyển dụng, quản lý hồ sơ ứng viên và xây dựng đội ngũ vững mạnh.'
                : 'Cùng xây dựng hồ sơ nổi bật và nhận cơ hội sự nghiệp lý tưởng dành cho bạn.'}
            </p>
          </div>

          <p className="text-white/40 text-xs z-10">© 2025 UpWork. All rights reserved.</p>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-white p-8 sm:p-10">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline mb-3">
            <ArrowBigLeft size={15} />Trang chủ
          </button>

          {/* Mobile logo */}
          <div className="flex flex-col mb-6 lg:hidden">
            <div className="text-[26px] font-black tracking-tighter text-gray-800 leading-none">
              Up<span className="bg-linear-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Work</span>
            </div>
            <span className="text-[9px] text-gray-500 font-medium mt-0.5">Tiếp lợi thế - Nối thành công</span>
          </div>

          <h1 className="text-2xl font-black text-gray-800 mb-1">Tạo tài khoản</h1>
          <p className="text-sm text-gray-500 mb-6">Bắt đầu hành trình sự nghiệp của bạn ngay hôm nay</p>

          {/* Role Switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {(['candidate', 'employer'] as const).map((r) => (
              <button key={r} onClick={() => handleRoleChange(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === r
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'}`}>
                {r === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng'}
              </button>
            ))}
          </div>

          {/* Error / Success banner */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <span className="shrink-0">⚠️</span>{error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
              <span className="shrink-0">✅</span>{successMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* ── Thông tin tài khoản ── */}
            <SectionDivider title="Thông tin tài khoản" />

            {/* Email */}
            <div>
              <label className={labelClass}>Email <span className="text-red-400">*</span></label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="Nhập email" className={inputClass}
                  value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Mật khẩu <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" className={inputClass}
                  value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>Xác nhận mật khẩu <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" className={inputClass}
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* ── Hồ sơ Ứng viên ── */}
            {role === 'candidate' && (
              <>
                <SectionDivider title="Thông tin cá nhân" />

                {/* FullName */}
                <div>
                  <label className={labelClass}>Họ và tên <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Nhập họ và tên" className={inputClass}
                      value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className={labelClass}>Số điện thoại</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" placeholder="VD: 0912 345 678" className={inputClass}
                      value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
                  </div>
                </div>

                {/* DateOfBirth + Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Ngày sinh</label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="date" className={inputClass}
                        value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} disabled={loading} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Giới tính</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select className={inputClass + ' cursor-pointer'} value={gender}
                        onChange={(e) => setGender(e.target.value)} disabled={loading}>
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className={labelClass}>Địa chỉ</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Nhập địa chỉ của bạn" className={inputClass}
                      value={address} onChange={(e) => setAddress(e.target.value)} disabled={loading} />
                  </div>
                </div>
              </>
            )}

            {/* ── Hồ sơ Nhà tuyển dụng ── */}
            {role === 'employer' && (
              <>
                <SectionDivider title="Thông tin công ty" />

                {/* Company Name */}
                <div>
                  <label className={labelClass}>Tên công ty <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Nhập tên công ty" className={inputClass}
                      value={companyName} onChange={(e) => setCompanyName(e.target.value)} disabled={loading} />
                  </div>
                </div>

                {/* Company Address */}
                <div>
                  <label className={labelClass}>Địa chỉ công ty</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Nhập địa chỉ" className={inputClass}
                      value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} disabled={loading} />
                  </div>
                </div>

                {/* Company Website */}
                <div>
                  <label className={labelClass}>Website công ty</label>
                  <div className="relative">
                    <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="url" placeholder="https://congty.com" className={inputClass}
                      value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} disabled={loading} />
                  </div>
                </div>

                {/* Company Description */}
                <div>
                  <label className={labelClass}>Mô tả công ty</label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <textarea rows={3} placeholder="Giới thiệu ngắn về công ty..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none disabled:opacity-60"
                      value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} disabled={loading} />
                  </div>
                </div>
              </>
            )}

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <div onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${agreed
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'border-gray-300 group-hover:border-indigo-400'}`}>
                {agreed && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-gray-500 leading-relaxed">
                Tôi đã đọc và đồng ý với{' '}
                <a href="#" className="text-indigo-600 hover:underline font-semibold">Điều khoản dịch vụ</a>
                {' '}và{' '}
                <a href="#" className="text-indigo-600 hover:underline font-semibold">Chính sách bảo mật</a>
                {' '}của UpWork
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-full bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                <>
                  Đăng ký
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">Hoặc đăng ký bằng</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-3 gap-2.5">
            <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                <path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </button>
          </div>

          {/* Login redirect */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Bạn đã có tài khoản?{' '}
            <a href="/login" className="text-indigo-600 font-semibold hover:underline">Đăng nhập ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
