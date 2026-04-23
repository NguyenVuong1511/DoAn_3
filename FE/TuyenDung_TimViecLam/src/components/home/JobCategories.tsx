import { useState, useEffect } from 'react';
import { getCategories } from "../../services/categoriesService";
import type { Category } from "../../types/categories";
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';


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
        return <div className="py-16 text-center">Đang tải danh mục...</div>;
    }

    return (
        <section className="w-full bg-slate-50 py-10 md:py-16 font-sans">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
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
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all outline-none cursor-pointer">
                            Xem tất cả danh mục
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {categories.map((category) => {
                        // Tự động convert string từ DB thành Icon (ví dụ: "Code" -> <Code />)
                        // Ép kiểu dynamic để truy cập vào LucideIcons
                        const IconComponent = (LucideIcons as any)[category.iconName] || LucideIcons.Code;

                        return (
                            <div
                                key={category.id}
                                className="bg-white rounded-xl p-5 flex items-center gap-4 border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-indigo-100 hover:-translate-y-1 transition-all cursor-pointer group"
                            >
                                {/* Icon Box */}
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-${category.bgColor}-50 text-${category.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                                    <IconComponent size={24} strokeWidth={1.5} />
                                </div>

                                {/* Text Info */}
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                                        {category.name}
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
