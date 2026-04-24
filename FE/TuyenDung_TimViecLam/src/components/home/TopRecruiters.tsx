import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Company } from "../../types/companies.ts";
import { getCompanies } from "../../services/companiesService.ts";


const TopRecruiters = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const extendedCompanies = [...companies, ...companies];
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await getCompanies();

                if (Array.isArray(response)) {
                    setCompanies(response);
                } else if (response && response.success) {
                    setCompanies(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    if (loading) {
        return <div className="py-16 text-center">Đang tải dữ liệu...</div>;
    }

    return (
        <section className="w-full bg-white py-16 md:py-24 font-sans overflow-hidden">
            <style>
                {`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: scroll 30s linear infinite;
                    }
                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                    .mask-edges {
                        mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                        -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    }
                `}
            </style>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                <div className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase mb-3">
                    ĐỐI TÁC TIN CẬY
                </div>
                <h2 className="text-3xl md:text-4xl font-black font-display text-gray-900 mb-4">
                    Nhà Tuyển Dụng Hàng Đầu
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Gia nhập hàng ngàn chuyên gia đã tìm được công việc lý tưởng thông qua mạng lưới đối tác của chúng tôi.
                </p>
            </div>

            {/* Marquee Wrapper */}
            <div className="w-full relative mask-edges max-w-[1400px] mx-auto mb-12">
                <div className="flex gap-5 w-max animate-marquee py-4">
                    {extendedCompanies.map((c, index) => (
                        <div
                            key={index}
                            className="flex max-w-[400px] items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] hover:shadow-md hover:border-indigo-100 transition-all min-w-[200px] shrink-0 cursor-pointer"
                        >
                            <img src={`/images/${c.logoUrl}`} alt="company logo" className='w-auto h-10 rounded-xl' />
                            <span className="font-bold text-gray-800 text-sm">
                                {c.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center px-4">
                <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all shadow-lg shadow-slate-900/20 cursor-pointer">
                    Xem tất cả công ty đối tác
                    <ArrowRight size={16} />
                </button>
            </div>
        </section>
    );
};

export default TopRecruiters;
