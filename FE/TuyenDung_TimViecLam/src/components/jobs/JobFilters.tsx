import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, ChevronDown, X, Layers, Award, Clock } from 'lucide-react';
import { getCategories, getLocations, getLevels, getExperiences, getJobTypes } from '../../services/jobService';
import type { JobParams, Category, Level, Experience, JobType } from '../../types/job';

interface JobFiltersProps {
    onFilterChange: (filters: JobParams) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ onFilterChange }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
    const [levels, setLevels] = useState<Level[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [dbJobTypes, setDbJobTypes] = useState<JobType[]>([]);
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
                const [catRes, locRes, levelRes, expRes, typeRes] = await Promise.all([
                    getCategories(),
                    getLocations(),
                    getLevels(),
                    getExperiences(),
                    getJobTypes()
                ]);
                if (catRes.success) setCategories(catRes.data);
                if (locRes.success) setLocations(locRes.data);
                if (levelRes.success) setLevels(levelRes.data);
                if (expRes.success) setExperiences(expRes.data);
                if (typeRes.success) setDbJobTypes(typeRes.data);
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

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-6 mb-8">
            <div className="flex flex-col gap-6">
                {/* Search Bar & Primary Filters (Row 1) */}
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

                {/* Secondary Filters (Row 2) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Level Filter */}
                    <div className="relative group">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <select
                            name="levelId"
                            value={filters.levelId}
                            onChange={handleChange}
                            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">Tất cả cấp bậc</option>
                            {levels.map(lvl => (
                                <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    {/* Experience Filter */}
                    <div className="relative group">
                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <select
                            name="experienceId"
                            value={filters.experienceId}
                            onChange={handleChange}
                            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">Kinh nghiệm</option>
                            {experiences.map(exp => (
                                <option key={exp.id} value={exp.id}>{exp.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    {/* Job Type Filter (Select mode for better alignment) */}
                    <div className="relative group">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <select
                            name="jobTypeId"
                            value={filters.jobTypeId}
                            onChange={handleChange}
                            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="">Hình thức làm việc</option>
                            {dbJobTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    {/* Actions Button Cell */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearFilters}
                            className="flex-1 h-full py-3.5 bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                            <X size={14} />
                            Xóa
                        </button>
                        <button
                            onClick={() => {
                                const cleanFilters = Object.fromEntries(
                                    Object.entries(filters)
                                        .filter(([_, value]) => value !== '' && value !== undefined && value !== null)
                                );
                                onFilterChange(cleanFilters);
                            }}
                            className="flex-2 h-full py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Search size={14} />
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobFilters;
