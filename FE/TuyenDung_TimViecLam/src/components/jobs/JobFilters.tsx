import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, ChevronDown, X } from 'lucide-react';
import { getCategories, getLocations } from '../../services/jobService';
import type { JobParams, Category } from '../../types/job';

interface JobFiltersProps {
    onFilterChange: (filters: JobParams) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ onFilterChange }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
    const [salaryRange, setSalaryRange] = useState('');
    const [filters, setFilters] = useState<JobParams>({
        title: '',
        categoryId: '',
        locationId: '',
        jobTypeId: '',
        levelId: '',
        experienceId: '',
        minSalary: undefined as number | undefined,
        maxSalary: undefined as number | undefined,
    });

    useEffect(() => {
        const loadMetadata = async () => {
            try {
                const [catRes, locRes] = await Promise.all([
                    getCategories(),
                    getLocations()
                ]);
                if (catRes.success) setCategories(catRes.data);
                if (locRes.success) setLocations(locRes.data);
            } catch (error) {
                console.error('Error loading filter metadata:', error);
            }
        };
        loadMetadata();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSalaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const range = e.target.value;
        setSalaryRange(range);
        
        let min: number | undefined;
        let max: number | undefined;

        switch (range) {
            case 'under-10': max = 10000000; break;
            case '10-20': min = 10000000; max = 20000000; break;
            case '20-30': min = 20000000; max = 30000000; break;
            case '30-50': min = 30000000; max = 50000000; break;
            case 'above-50': min = 50000000; break;
        }

        setFilters(prev => ({ ...prev, minSalary: min, maxSalary: max }));
    };

    const clearFilters = () => {
        const resetFilters: JobParams = {
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
        onFilterChange({});
    };

    const jobTypes = [
        { id: 'A3FFA4FE-5E93-403F-BC83-B9FC56A40094', name: 'Toàn thời gian (Full-time)' },
        { id: '8648E0D9-C90D-4C13-BCFD-2BF5806D2EC3', name: 'Bán thời gian (Part-time)' },
        { id: '98B3EBA3-862B-4E74-8E3E-CEFB90A4B57E', name: 'Làm từ xa (Remote)' },
    ];

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-6 mb-8">
            <div className="flex flex-col gap-6">
                {/* Search Bar & Main Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Input */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            name="title"
                            value={filters.title}
                            onChange={handleChange}
                            placeholder="Vị trí, công ty..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <select
                            name="categoryId"
                            value={filters.categoryId}
                            onChange={handleChange}
                            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">Tất cả ngành nghề</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    {/* Location Filter */}
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <select
                            name="locationId"
                            value={filters.locationId}
                            onChange={handleChange}
                            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">Toàn quốc</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    {/* Salary Filter */}
                    <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <select
                            value={salaryRange}
                            onChange={handleSalaryChange}
                            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer"
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

                {/* Additional Filters & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-gray-50">
                    <div className="flex flex-wrap items-center gap-8">
                        {/* Job Type Filter */}
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Hình thức:</span>
                            <div className="flex items-center gap-2">
                                {jobTypes.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => handleChange({ target: { name: 'jobTypeId', value: filters.jobTypeId === type.id ? '' : type.id } } as any)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            filters.jobTypeId === type.id 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                        }`}
                                    >
                                        {type.name.split(' (')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={clearFilters}
                            className="text-[11px] font-black text-gray-400 hover:text-rose-500 flex items-center gap-1.5 transition-colors uppercase tracking-widest"
                        >
                            <X size={14} />
                            Xóa lọc
                        </button>
                        <button
                            onClick={() => {
                                const cleanFilters = Object.fromEntries(
                                    Object.entries(filters)
                                        .filter(([_, value]) => value !== '' && value !== undefined && value !== null)
                                );
                                onFilterChange(cleanFilters);
                            }}
                            className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 transition-all active:scale-95"
                        >
                            Tìm kiếm ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobFilters;
