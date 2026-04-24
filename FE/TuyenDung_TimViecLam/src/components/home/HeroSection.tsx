import { Search, MapPin, Briefcase, Building2, Users, ChevronDown } from 'lucide-react';

const HeroSection = () => {
    return (
        <div className="w-full flex flex-col relative">
            {/* 1. Dark Hero Top Section */}
            <section className="relative w-full pt-30 pb-45">
                {/* Background Image & Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2669&ixlib=rb-4.0.3")', // Office background placeholder
                    }}
                >
                    {/* Dark Blue / Slate Overlay */}
                    <div className="absolute inset-0 bg-slate-800/70" />
                </div>

                {/* Hero Text Content */}
                <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/30 border border-indigo-500/20 backdrop-blur-md mb-8">
                        <span className="text-sm font-medium text-indigo-300 flex items-center gap-2 font-sans">
                            <span role="img" aria-label="rocket">🚀</span>
                            <span>Hơn 10.000 Việc Làm Đang Tuyển Dụng</span>
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-white tracking-tight mb-6 max-w-4xl leading-tight">
                        Khám phá <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">cơ hội</span> nghề nghiệp phù hợp với bạn
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-sans mb-4">
                        Kết nối với các nhà tuyển dụng hàng đầu, khám phá hàng ngàn vị trí ứng tuyển, và tiến xa hơn trên con đường sự nghiệp.
                    </p>
                </div>
            </section>

            {/* 2. Overlapping Search Bar & Bottom Stats Section */}
            <section className="relative w-full bg-[#f8fafc] z-20 pb-16">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Search Bar Container (Floating exactly on the edge) */}
                    <div className="relative z-30 w-full max-w-5xl mx-auto bg-white p-2 rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] flex flex-col md:flex-row items-center border border-gray-100 font-sans -mt-[44px]">

                        {/* Keyword */}
                        <div className="flex-1 flex items-center px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors border-b md:border-b-0 md:border-r border-gray-100 w-full md:w-auto">
                            <div className="flex items-center gap-3 w-full">
                                <Search className="text-indigo-500 w-5 h-5 shrink-0" />
                                <div className="flex flex-col flex-1 text-left">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tìm việc</span>
                                    <input
                                        type="text"
                                        placeholder="VD: Fullstack,.."
                                        className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-600 placeholder-gray-400 mt-0.5 truncate"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Industry */}
                        <div className="flex-1 flex items-center px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors border-b md:border-b-0 md:border-r border-gray-100 w-full md:w-auto cursor-pointer">
                            <div className="flex items-center gap-3 w-full">
                                <ChevronDown className="text-indigo-500 w-5 h-5 shrink-0" />
                                <div className="flex flex-col flex-1 text-left">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ngành nghề</span>
                                    <span className="text-sm font-bold text-gray-900 mt-0.5 truncate">Tất cả ngành nghề</span>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex-1 flex items-center px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors border-b md:border-b-0 md:border-r border-gray-100 w-full md:w-auto cursor-pointer">
                            <div className="flex items-center gap-3 w-full">
                                <MapPin className="text-indigo-500 w-5 h-5 shrink-0" />
                                <div className="flex flex-col flex-1 text-left">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Địa điểm</span>
                                    <span className="text-sm font-bold text-gray-900 mt-0.5 truncate">Tất cả địa điểm</span>
                                </div>
                            </div>
                        </div>

                        {/* Salary */}
                        <div className="flex-1 flex items-center px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors w-full md:w-auto cursor-pointer">
                            <div className="flex items-center gap-3 w-full">
                                <ChevronDown className="text-indigo-500 w-5 h-5 shrink-0" />
                                <div className="flex flex-col flex-1 text-left">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mức lương</span>
                                    <span className="text-sm font-bold text-gray-900 mt-0.5 truncate">Mọi mức lương</span>
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="w-full md:w-auto p-1.5">
                            <button className="w-full md:w-auto bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white px-8 py-3.5 rounded-xl font-bold font-sans flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-sm shadow-indigo-200 cursor-pointer">
                                <Search className="w-5 h-5" />
                                Tìm việc làm
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards Section */}
                    <div className="mt-16 font-sans">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center gap-5 hover:-translate-y-1 transition-transform group cursor-pointer w-full">
                                <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                                    <Briefcase className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-[26px] font-black font-display text-gray-900 leading-tight">10.000+</div>
                                    <div className="font-bold text-gray-800 text-[15px] mb-0.5">Việc làm đang tuyển</div>
                                    <div className="text-[13px] text-gray-500 font-medium tracking-tight">Đa dạng ngành nghề và địa điểm</div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center gap-5 hover:-translate-y-1 transition-transform group cursor-pointer w-full">
                                <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                                    <Building2 className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-[26px] font-black font-display text-gray-900 leading-tight">5.000+</div>
                                    <div className="font-bold text-gray-800 text-[15px] mb-0.5">Công ty hàng đầu</div>
                                    <div className="text-[13px] text-gray-500 font-medium tracking-tight">Từ startup đến các tập đoàn lớn</div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center gap-5 hover:-translate-y-1 transition-transform group cursor-pointer w-full">
                                <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                                    <Users className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className="text-[26px] font-black font-display text-gray-900 leading-tight">50.000+</div>
                                    <div className="font-bold text-gray-800 text-[15px] mb-0.5">Ứng viên đăng ký</div>
                                    <div className="text-[13px] text-gray-500 font-medium tracking-tight">Cộng đồng chuyên gia đang phát triển</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default HeroSection;
