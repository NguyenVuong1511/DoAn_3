import React, { useState } from 'react';
import { Search, X, Building2 } from 'lucide-react';

interface CompanyFiltersProps {
    onSearch: (query: string) => void;
}

const CompanyFilters: React.FC<CompanyFiltersProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleClear = () => {
        setSearchQuery('');
        onSearch('');
    };

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-6 mb-8">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm công ty theo tên hoặc lĩnh vực..."
                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-gray-700 placeholder-gray-400"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-300 hover:text-rose-500 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-6 py-4 bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        <X size={14} />
                        Xóa
                    </button>
                    <button
                        type="submit"
                        className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Search size={14} />
                        Tìm kiếm
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyFilters;
