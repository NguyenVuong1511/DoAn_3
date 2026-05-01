import { useState, useEffect, useCallback } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import JobPagination from '../components/jobs/JobPagination';
import { getJobs } from '../services/jobService';
import type { Job, JobParams } from '../types/job';
import { Loader2, Briefcase, Search } from 'lucide-react';

const JobListPage = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: 9
    });
    const [filters, setFilters] = useState<JobParams>({});

    const fetchJobs = useCallback(async (page: number, currentFilters: JobParams) => {
        try {
            setLoading(true);
            const response = await getJobs({
                ...currentFilters,
                pageNumber: page,
                pageSize: pagination.pageSize
            });

            if (response.success) {
                setJobs(response.data.jobs);
                setPagination(prev => ({
                    ...prev,
                    currentPage: response.data.pageNumber,
                    totalPages: response.data.totalPages,
                    totalCount: response.data.totalCount
                }));
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách công việc');
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    useEffect(() => {
        fetchJobs(1, filters);
    }, [filters, fetchJobs]);

    const handleFilterChange = (newFilters: JobParams) => {
        setFilters(newFilters);
    };

    const handlePageChange = (page: number) => {
        fetchJobs(page, filters);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
            <Header />

            <main className="flex-1 w-full pb-20">
                {/* Hero Banner Section */}
                <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-dark">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3")' }}
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-indigo-900 via-slate-900/40 to-transparent" />

                    <div className="absolute inset-0 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start pointer-events-none">
                        <div className="flex flex-col gap-4">
                            <div className="px-6 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl inline-flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white leading-none mb-1">
                                        {pagination.totalCount.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Việc làm đang tuyển</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#f8fafc] to-transparent" />
                </div>

                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
                    <div className="flex flex-col gap-8">
                        {/* Horizontal Filters */}
                        <JobFilters onFilterChange={handleFilterChange} />

                        {/* Main Content Area */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-gray-900">
                                    {pagination.totalCount > 0 ? `Tìm thấy ${pagination.totalCount} công việc` : 'Kết quả tìm kiếm'}
                                </h2>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                        <Loader2 className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <p className="mt-6 text-gray-400 font-medium animate-pulse">Đang tìm kiếm cơ hội phù hợp...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Briefcase size={32} />
                                    </div>
                                    <p className="text-red-600 text-lg font-bold mb-6">{error}</p>
                                    <button
                                        onClick={() => fetchJobs(1, filters)}
                                        className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 hover:shadow-lg transition-all"
                                    >
                                        Thử lại ngay
                                    </button>
                                </div>
                            ) : jobs.length === 0 ? (
                                <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search size={40} />
                                    </div>
                                    <p className="text-gray-500 text-xl font-bold">Không tìm thấy công việc nào</p>
                                    <p className="text-gray-400 mt-2 font-medium">Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
                                    <button
                                        onClick={() => handleFilterChange({})}
                                        className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                                    >
                                        Xóa tất cả bộ lọc
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {jobs.map((job, index) => (
                                            <JobCard key={job.id} job={job} index={index} />
                                        ))}
                                    </div>

                                    <JobPagination
                                        currentPage={pagination.currentPage}
                                        totalPages={pagination.totalPages}
                                        onPageChange={handlePageChange}
                                    />
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

export default JobListPage;
