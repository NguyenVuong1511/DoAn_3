import { MapPin, Phone, Mail } from 'lucide-react';

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const LinkedinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const Footer = () => {
    return (
        <footer className="bg-[rgb(11,17,33)] text-slate-300 font-sans border-t border-slate-800/50 pt-16 pb-8">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                    {/* Column 1: Brand & Info (Spans 2 cols) */}
                    <div className="lg:col-span-2 pr-0 lg:pr-10">
                        <div className="text-[32px] font-black font-display tracking-tighter text-white leading-none mb-6 cursor-pointer inline-block">
                            Up<span className="bg-linear-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">Work</span>
                        </div>
                        <p className="text-slate-400 text-[15px] leading-relaxed max-w-sm mb-8">
                            Nền tảng kết nối hàng triệu ứng viên và nhà tuyển dụng hàng đầu. Khám phá cơ hội sự nghiệp lý tưởng và vươn xa hơn mỗi ngày.
                        </p>

                        <div className="flex flex-col gap-4 text-sm text-slate-400">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">Đào Xá, Nghĩa Dân, Hưng Yên, Việt Nam</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-indigo-400 shrink-0" />
                                <span>(84) 999 999 999</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-indigo-400 shrink-0" />
                                <span>upwork@support.vn</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Candidates */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-[13px] opacity-90">
                            Dành cho ứng viên
                        </h3>
                        <ul className="flex flex-col gap-4 text-[15px] text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Việc làm mới nhất</a></li>
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Tạo CV chuyên nghiệp</a></li>
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Cẩm nang nghề nghiệp</a></li>
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Tra cứu mức lương</a></li>
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Trắc nghiệm tính cách</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Recruiters */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-[13px] opacity-90">
                            Nhà tuyển dụng
                        </h3>
                        <ul className="flex flex-col gap-4 text-[15px] text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Đăng tin tuyển dụng</a></li>
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Tìm kiếm hồ sơ</a></li>
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Sản phẩm & Dịch vụ</a></li>
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Kinh nghiệm tuyển dụng</a></li>
                        </ul>
                    </div>

                    {/* Column 4: About Us */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-[13px] opacity-90">
                            Về UpWork
                        </h3>
                        <ul className="flex flex-col gap-4 text-[15px] text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Giới thiệu</a></li>
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Góc báo chí</a></li>
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Quy định bảo mật</a></li>
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Điều khoản dịch vụ</a></li>
                            <li><a href="#" className="hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Liên hệ</a></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-linear-to-r from-transparent via-slate-700/50 to-transparent mb-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[14px] text-slate-500 font-medium">
                        &copy; {new Date().getFullYear()} UpWork Vietnam. All rights reserved.
                    </p>

                    <div className="flex items-center gap-3">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-500/30">
                            <FacebookIcon />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm hover:shadow-blue-500/30">
                            <LinkedinIcon />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all shadow-sm hover:shadow-sky-500/30">
                            <TwitterIcon />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all shadow-sm hover:shadow-pink-500/30">
                            <InstagramIcon />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
