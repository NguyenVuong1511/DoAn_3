import { useState, useEffect, useCallback } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import CompanyCard from '../components/companies/CompanyCard';
import CompanyFilters from '../components/companies/CompanyFilters';
import { getCompanies } from '../services/companiesService';
import type { Company } from '../types/companies';
import { Loader2, Building2, Search } from 'lucide-react';

const CompanyListPage = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCompanies = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getCompanies();
            
            let companyData: Company[] = [];
            if (Array.isArray(response)) {
                companyData = response;
            } else if (response && response.success) {
                companyData = response.data;
            }

            setCompanies(companyData);
            setFilteredCompanies(companyData);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách công ty');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredCompanies(companies);
            return;
        }

        const filtered = companies.filter(company => 
            company.name.toLowerCase().includes(query.toLowerCase()) ||
            (company.industry && company.industry.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredCompanies(filtered);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
            <Header />

            <main className="flex-1 w-full pb-20">
                {/* Hero Banner Section (Matched with JobListPage) */}
                <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-slate-900">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2670")' }}
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-indigo-900 via-slate-900/40 to-transparent" />

                    <div className="absolute inset-0 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start pointer-events-none">
                        <div className="flex flex-col gap-4">
                            <div className="px-6 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl inline-flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white leading-none mb-1">
                                        {companies.length.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Công ty đối tác</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#f8fafc] to-transparent" />
                </div>

                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
                    <div className="flex flex-col gap-8">
                        {/* Filters */}
                        <CompanyFilters onSearch={handleSearch} />

                        {/* Content Area */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-gray-900">
                                    {filteredCompanies.length > 0 ? `Tìm thấy ${filteredCompanies.length} đối tác` : 'Kết quả tìm kiếm'}
                                </h2>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                        <Building2 className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <p className="mt-6 text-gray-400 font-medium animate-pulse">Đang tìm kiếm đối tác...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Building2 size={32} />
                                    </div>
                                    <p className="text-red-600 text-lg font-bold mb-6">{error}</p>
                                    <button
                                        onClick={fetchCompanies}
                                        className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 hover:shadow-lg transition-all"
                                    >
                                        Thử lại ngay
                                    </button>
                                </div>
                            ) : filteredCompanies.length === 0 ? (
                                <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search size={40} />
                                    </div>
                                    <p className="text-gray-500 text-xl font-bold">Không tìm thấy công ty nào</p>
                                    <p className="text-gray-400 mt-2 font-medium">Hãy thử thay đổi từ khóa tìm kiếm của bạn.</p>
                                    <button
                                        onClick={() => handleSearch('')}
                                        className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                                    >
                                        Xóa tìm kiếm
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCompanies.map((company, index) => (
                                        <CompanyCard key={company.id} company={company} index={index} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CompanyListPage;
