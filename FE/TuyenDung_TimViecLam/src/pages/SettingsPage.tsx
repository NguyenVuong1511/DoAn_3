import { useState } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import {
  User, Lock, Bell, Eye, LogOut, CheckCircle2
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 w-full flex flex-col py-10">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black font-display text-gray-900 tracking-tight">Cài đặt <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-500">Tài khoản</span></h1>
            <p className="text-gray-500 mt-2 text-[15px]">Quản lý thông tin cá nhân, bảo mật và các tùy chọn hồ sơ của bạn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Sidebar Navigation */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center gap-3 w-full p-4 rounded-xl text-left font-bold transition-all cursor-pointer ${activeTab === 'account'
                    ? 'bg-white shadow-sm border border-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-white hover:text-indigo-600'
                  }`}
              >
                <User size={18} className={activeTab === 'account' ? 'text-indigo-500' : 'text-gray-400'} />
                Tài khoản cá nhân
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3 w-full p-4 rounded-xl text-left font-bold transition-all cursor-pointer ${activeTab === 'security'
                    ? 'bg-white shadow-sm border border-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-white hover:text-indigo-600'
                  }`}
              >
                <Lock size={18} className={activeTab === 'security' ? 'text-indigo-500' : 'text-gray-400'} />
                Bảo mật & Mật khẩu
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-3 w-full p-4 rounded-xl text-left font-bold transition-all cursor-pointer ${activeTab === 'notifications'
                    ? 'bg-white shadow-sm border border-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-white hover:text-indigo-600'
                  }`}
              >
                <Bell size={18} className={activeTab === 'notifications' ? 'text-indigo-500' : 'text-gray-400'} />
                Cài đặt thông báo
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-3 w-full p-4 rounded-xl text-left font-bold transition-all cursor-pointer ${activeTab === 'privacy'
                    ? 'bg-white shadow-sm border border-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-white hover:text-indigo-600'
                  }`}
              >
                <Eye size={18} className={activeTab === 'privacy' ? 'text-indigo-500' : 'text-gray-400'} />
                Quyền riêng tư
              </button>

              <div className="h-px bg-gray-200 my-2"></div>

              <button className="flex items-center gap-3 w-full p-4 rounded-xl text-left font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>

            {/* Content Area */}
            <div className="md:col-span-8 lg:col-span-9">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 min-h-[500px]">

                {activeTab === 'account' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold font-display text-gray-900 mb-6 pb-2 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-2 h-6 bg-linear-to-b from-purple-500 to-blue-500 rounded-full"></div>
                      Thông tin cơ bản
                    </h2>

                    <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full border-2 border-indigo-100 p-1 relative">
                          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256" alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <button className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer">
                          Đổi ảnh đại diện
                        </button>
                      </div>

                      {/* Form Fields */}
                      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-sm font-bold text-gray-700">Họ và Tên</label>
                          <input type="text" defaultValue="Nguyễn Văn A" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-bold text-gray-700">Email liên hệ</label>
                          <input type="email" defaultValue="nguyenvana.dev@gmail.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-bold text-gray-700">Số điện thoại</label>
                          <input type="tel" defaultValue="0987 654 321" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2 mt-4">
                          <button className="bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white py-3 px-6 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto self-end">
                            <CheckCircle2 size={18} />
                            Lưu thay đổi
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-bold font-display text-gray-900 mb-6 pb-2 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-2 h-6 bg-linear-to-b from-blue-500 to-teal-500 rounded-full"></div>
                      Đổi mật khẩu
                    </h2>

                    <div className="flex flex-col gap-5 max-w-md">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700">Mật khẩu hiện tại</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700">Mật khẩu mới</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700">Xác nhận mật khẩu mới</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                      </div>

                      <div className="mt-4">
                        <button className="bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white py-3 px-6 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full">
                          Cập nhật mật khẩu
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {(activeTab === 'notifications' || activeTab === 'privacy') && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      {activeTab === 'notifications' ? <Bell size={24} className="text-gray-400" /> : <Eye size={24} className="text-gray-400" />}
                    </div>
                    <p className="font-medium text-center max-w-sm">
                      Tính năng này đang trong quá trình phát triển và sẽ sớm được cập nhật.
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SettingsPage;
