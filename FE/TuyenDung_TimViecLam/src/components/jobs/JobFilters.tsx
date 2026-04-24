import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, ChevronDown, Filter, X, DollarSign, Award, Clock } from 'lucide-react';
import { getCategories } from '../../services/categoriesService';
import type { Category } from '../../types/categories';

interface JobFiltersProps {
    onFilterChange: (filters: any) => void;
}

const JobFilters = ({ onFilterChange }: JobFiltersProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState({
        title: '',
        categoryId: '',
        locationId: '',
        jobTypeId: '',
        levelId: '',
        experienceId: '',
        minSalary: undefined as number | undefined,
        maxSalary: undefined as number | undefined,
    });

    const [salaryRange, setSalaryRange] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange(filters);
        }, 500);

        return () => clearTimeout(timer);
    }, [filters.title, onFilterChange]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response.success) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        
        // For selects and radios, trigger immediately
        if (name !== 'title') {
            onFilterChange(newFilters);
        }
    };

    const handleSalaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSalaryRange(value);
        
        let min: number | undefined = undefined;
        let max: number | undefined = undefined;

        if (value === 'under-10') {
            max = 10000000;
        } else if (value === '10-20') {
            min = 10000000;
            max = 20000000;
        } else if (value === '20-30') {
            min = 20000000;
            max = 30000000;
        } else if (value === '30-50') {
            min = 30000000;
            max = 50000000;
        } else if (value === 'above-50') {
            min = 50000000;
        }

        const newFilters = { ...filters, minSalary: min, maxSalary: max };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const resetFilters = {
            title: '',
            categoryId: '',
            locationId: '',
            jobTypeId: '',
            levelId: '',
            experienceId: '',
            minSalary: undefined,
            maxSalary: undefined,
        };
        setFilters(resetFilters);
        setSalaryRange('');
        onFilterChange(resetFilters);
    };

    const locations = [
        { id: '1', name: 'Hồ Chí Minh' },
        { id: '2', name: 'Hà Nội' },
        { id: '3', name: 'Đà Nẵng' },
        { id: '4', name: 'Cần Thơ' },
        { id: '5', name: 'Bình Dương' },
    ];

    const jobTypes = [
        { id: '1', name: 'Toàn thời gian' },
        { id: '2', name: 'Bán thời gian' },
        { id: '3', name: 'Làm từ xa (Remote)' },
        { id: '4', name: 'Thực tập' },
    ];

    const experienceLevels = [
        { id: '1', name: 'Chưa có kinh nghiệm' },
        { id: '2', name: 'Dưới 1 năm' },
        { id: '3', name: '1-3 năm' },
        { id: '4', name: '3-5 năm' },
        { id: '5', name: 'Trên 5 năm' },
    ];

    const jobLevels = [
        { id: '1', name: 'Nhân viên' },
        { id: '2', name: 'Trưởng nhóm' },
        { id: '3', name: 'Trưởng phòng' },
        { id: '4', name: 'Giám đốc' },
        { id: '5', name: 'Thực tập sinh' },
    ];

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 sticky top-24">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Filter size={20} />
                    </div>
                    <h3 className="font-black text-gray-900 text-xl uppercase tracking-tight">Bộ lọc</h3>
                </div>
                <button 
                    onClick={clearFilters}
                    className="text-[11px] font-black text-gray-400 hover:text-rose-500 flex items-center gap-1.5 transition-colors uppercase tracking-widest"
                >
                    <X size={14} />
                    Xóa tất cả
                </button>
            </div>

            <div className="space-y-8">
                {/* Search Input */}
                <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Từ khóa tìm kiếm
                    </label>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            name="title"
                            value={filters.title}
                            onChange={handleChange}
                            placeholder="Vị trí, công ty..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Ngành nghề
                    </label>
                    <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <select
                            name="categoryId"
                            value={filters.categoryId}
                            onChange={handleChange}
                            className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">Tất cả ngành nghề</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Salary Filter */}
                <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Mức lương
                    </label>
                    <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <select
                            value={salaryRange}
                            onChange={handleSalaryChange}
                            className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">Mọi mức lương</option>
                            <option value="under-10">Dưới 10 triệu</option>
                            <option value="10-20">10 - 20 triệu</option>
                            <option value="20-30">20 - 30 triệu</option>
                            <option value="30-50">30 - 50 triệu</option>
                            <option value="above-50">Trên 50 triệu</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Location Filter */}
                <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Địa điểm
                    </label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <select
                            name="locationId"
                            value={filters.locationId}
                            onChange={handleChange}
                            className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">Toàn quốc</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Level Filter */}
                <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Cấp bậc
                    </label>
                    <div className="relative group">
                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <select
                            name="levelId"
                            value={filters.levelId}
                            onChange={handleChange}
                            className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">Tất cả cấp bậc</option>
                            {jobLevels.map(level => (
                                <option key={level.id} value={level.id}>{level.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Job Type Filter */}
                <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Hình thức làm việc
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                        {jobTypes.map(type => (
                            <label key={type.id} className="flex items-center gap-3 p-3 rounded-xl border border-transparent bg-gray-50 hover:bg-indigo-50/50 hover:border-indigo-100 cursor-pointer transition-all group">
                                <input
                                    type="radio"
                                    name="jobTypeId"
                                    value={type.id}
                                    checked={filters.jobTypeId === type.id}
                                    onChange={handleChange}
                                    className="w-5 h-5 border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                />
                                <span className="text-sm font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">
                                    {type.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Experience Level Filter */}
                <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Kinh nghiệm
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                        {experienceLevels.map(exp => (
                            <label key={exp.id} className="flex items-center gap-3 p-3 rounded-xl border border-transparent bg-gray-50 hover:bg-indigo-50/50 hover:border-indigo-100 cursor-pointer transition-all group">
                                <input
                                    type="radio"
                                    name="experienceId"
                                    value={exp.id}
                                    checked={filters.experienceId === exp.id}
                                    onChange={handleChange}
                                    className="w-5 h-5 border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                />
                                <span className="text-sm font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">
                                    {exp.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={() => onFilterChange(filters)}
                className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 transition-all active:scale-95"
            >
                Tìm kiếm ngay
            </button>
        </div>
    );
};

export default JobFilters;
