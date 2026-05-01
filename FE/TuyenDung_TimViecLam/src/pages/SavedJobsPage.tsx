import { useState, useEffect, useCallback } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import JobCard from '../components/jobs/JobCard';
import JobPagination from '../components/jobs/JobPagination';
import { getSavedJobs } from '../services/jobService';
import { getUserId } from '../services/authService';
import type { Job } from '../types/job';
import { Loader2, Heart, Search, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SavedJobsPage = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: 9
    });
    const userId = getUserId();
    const navigate = useNavigate();

    const fetchSavedJobs = useCallback(async (page: number) => {
        if (!userId) return;
        
        try {
            setLoading(true);
            const response = await getSavedJobs(userId, page, pagination.pageSize);
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
            setError(err.message || 'Không thể tải danh sách việc làm đã lưu');
        } finally {
            setLoading(false);
        }
    }, [userId, pagination.pageSize]);

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        fetchSavedJobs(1);
    }, [userId, navigate, fetchSavedJobs]);

    const handlePageChange = (page: number) => {
        fetchSavedJobs(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
            <Header />

            <main className="flex-1 w-full pb-20">
                {/* Hero Section */}
                <div className="bg-[#0f172a] relative overflow-hidden py-20">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.4),transparent_50%)]"></div>
                    </div>
                    
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <Link 
                            to="/jobs" 
                            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm mb-6 transition-colors group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Quay lại danh sách việc làm
                        </Link>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                                <Heart size={32} fill="currentColor" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white mb-2">Việc làm đã lưu</h1>
                                <p className="text-gray-400 font-medium">Bạn có {pagination.totalCount} công việc đã lưu vào danh sách yêu thích</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-indigo-500/5">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                <Loader2 className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <p className="mt-6 text-gray-400 font-bold animate-pulse">Đang tải danh sách của bạn...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-white rounded-[40px] border border-red-100 shadow-xl shadow-red-500/5">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart size={40} />
                            </div>
                            <p className="text-red-600 text-xl font-black mb-4">{error}</p>
                            <button
                                onClick={() => fetchSavedJobs(1)}
                                className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                            >
                                Thử lại ngay
                            </button>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200 shadow-sm">
                            <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Heart size={48} />
                            </div>
                            <h3 className="text-gray-900 text-2xl font-black mb-2">Danh sách trống</h3>
                            <p className="text-gray-400 font-medium max-w-md mx-auto">
                                Bạn chưa lưu công việc nào. Hãy khám phá hàng ngàn cơ hội việc làm hấp dẫn ngay bây giờ!
                            </p>
                            <Link
                                to="/jobs"
                                className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
                            >
                                <Search size={20} />
                                Khám phá việc làm ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            </main>

            <Footer />
        </div>
    );
};

export default SavedJobsPage;
