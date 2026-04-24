import { useState, useEffect, useCallback } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import JobPagination from '../components/jobs/JobPagination';
import { getJobs } from '../services/jobService';
import type { Job, JobParams } from '../types/job';
import { Loader2, Briefcase, Search, Filter } from 'lucide-react';

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
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const fetchJobs = useCallback(async (page: number, currentFilters: JobParams) => {
        try {
            setLoading(true);
            console.log('Fetching jobs with:', { ...currentFilters, pageNumber: page });
            const response = await getJobs({
                ...currentFilters,
                pageNumber: page,
                pageSize: pagination.pageSize
            });
            console.log('API Response:', response);

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
        // fetchJobs will be triggered by useEffect
    };

    const handlePageChange = (page: number) => {
        fetchJobs(page, filters);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
            <Header />

            <main className="flex-1 w-full pb-20">
                {/* Hero Banner Section - Abstract Corporate Style */}
                <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden bg-[#0f172a]">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity transition-transform duration-1000"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3")' }}
                    />

                    {/* Premium Gradient Overlays */}
                    <div className="absolute inset-0 bg-linear-to-tr from-indigo-900 via-slate-900/40 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.15)_0%,transparent_70%)]" />

                    {/* Floating Data Cards - Integrated with real API data */}
                    <div className="absolute inset-0 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start pointer-events-none">
                        <div className="flex flex-col gap-4">
                            <div className="px-6 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl inline-flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white font-display leading-none mb-1">
                                        {pagination.totalCount.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Việc làm đang tuyển</div>
                                </div>
                            </div>

                            <div className="hidden md:flex px-5 py-3 bg-indigo-500/10 backdrop-blur-lg border border-indigo-500/20 rounded-2xl items-center gap-3 w-fit">
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                                <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">
                                    Trang {pagination.currentPage} / {pagination.totalPages}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Mesh Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }} />

                    {/* Bottom Edge Blend */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#f8fafc] to-transparent" />
                </div>
                <div className="bg-white border-b border-gray-100 py-12 mb-12">
                    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 mb-4 font-display">
                                    Tìm Kiếm Việc Làm
                                </h1>
                                <p className="text-gray-500 max-w-2xl font-medium">
                                    Khám phá hàng ngàn cơ hội nghề nghiệp từ các công ty hàng đầu.
                                    Sử dụng bộ lọc để tìm công việc phù hợp nhất với bạn.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">

                                <button
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                    className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700"
                                >
                                    <Filter size={18} />
                                    Bộ lọc
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar Filters - Desktop */}
                        <aside className="hidden lg:block w-80 flex-shrink-0">
                            <JobFilters onFilterChange={handleFilterChange} />
                        </aside>

                        {/* Mobile Filters Drawer - Simple version */}
                        {showMobileFilters && (
                            <div className="lg:hidden mb-8">
                                <JobFilters onFilterChange={handleFilterChange} />
                            </div>
                        )}

                        {/* Main Content Area */}
                        <div className="flex-1">
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
                                    {/* Jobs Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {jobs.map((job, index) => (
                                            <JobCard key={job.id} job={job} index={index} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
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
