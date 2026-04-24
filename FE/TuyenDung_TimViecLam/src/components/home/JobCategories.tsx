import { useState, useEffect } from 'react';
import { getCategories } from "../../services/categoriesService";
import type { Category } from "../../types/categories";
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';


// Mapping màu sắc cố định để Tailwind có thể quét được toàn bộ class đơn sắc
const colorMap: Record<string, { text: string; bg: string }> = {
    // Nhóm màu bạn đã có
    indigo: { text: 'text-indigo-600', bg: 'bg-indigo-50' },
    emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50' },
    orange: { text: 'text-orange-600', bg: 'bg-orange-50' },
    rose: { text: 'text-rose-600', bg: 'bg-rose-50' },
    amber: { text: 'text-amber-600', bg: 'bg-amber-50' },
    sky: { text: 'text-sky-600', bg: 'bg-sky-50' },
    violet: { text: 'text-violet-600', bg: 'bg-violet-50' },
    yellow: { text: 'text-yellow-600', bg: 'bg-yellow-50' },
    blue: { text: 'text-blue-600', bg: 'bg-blue-50' },
    cyan: { text: 'text-cyan-600', bg: 'bg-cyan-50' },
    slate: { text: 'text-slate-600', bg: 'bg-slate-50' },

    // Nhóm màu bổ sung đầy đủ
    red: { text: 'text-red-600', bg: 'bg-red-50' },
    green: { text: 'text-green-600', bg: 'bg-green-50' },
    pink: { text: 'text-pink-600', bg: 'bg-pink-50' },
    fuchsia: { text: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
    purple: { text: 'text-purple-600', bg: 'bg-purple-50' },
    lime: { text: 'text-lime-600', bg: 'bg-lime-50' },
    teal: { text: 'text-teal-600', bg: 'bg-teal-50' },
    gray: { text: 'text-gray-600', bg: 'bg-gray-50' },
    zinc: { text: 'text-zinc-600', bg: 'bg-zinc-50' },
    neutral: { text: 'text-neutral-600', bg: 'bg-neutral-50' },
    stone: { text: 'text-stone-600', bg: 'bg-stone-50' },
};

const JobCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();

                // Kiểm tra nếu response là mảng (trường hợp BE trả về trực tiếp mảng)
                // Hoặc nếu response là object có success (trường hợp BE dùng ApiResponse wrapper)
                if (Array.isArray(response)) {
                    setCategories(response);
                } else if (response && response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-medium">Đang tải danh mục...</p>
            </div>
        );
    }

    return (
        <section className="w-full bg-white py-16 md:py-24 font-sans">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase mb-3">
                            TÌM KIẾM THEO NGÀNH NGHỀ
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black font-display text-gray-900 mb-3">
                            Ngành Nghề Phổ Biến
                        </h2>
                        <p className="text-gray-500">
                            Khám phá cơ hội việc làm ở các ngành nghề được săn đón nhất
                        </p>
                    </div>
                    <div>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all outline-none cursor-pointer group">
                            Xem tất cả danh mục
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        // Tự động convert string từ DB thành Icon (ví dụ: "Code" -> <Code />)
                        const IconComponent = (LucideIcons as any)[category.iconName] || LucideIcons.Code;

                        // Lấy class màu từ mapping
                        const colors = colorMap[category.color] || colorMap.indigo;

                        return (
                            <div
                                key={category.id}
                                className="bg-white rounded-2xl p-6 flex items-center gap-5 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 hover:-translate-y-1 transition-all cursor-pointer group"
                            >
                                {/* Icon Box */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
                                    <IconComponent size={28} strokeWidth={1.5} />
                                </div>

                                {/* Text Info */}
                                <div className="flex flex-col">
                                    <span className="font-extrabold text-gray-900 text-[15px] group-hover:text-indigo-600 transition-colors">
                                        {category.name}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1 font-medium group-hover:text-gray-500">
                                        Xem việc làm
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default JobCategories;
