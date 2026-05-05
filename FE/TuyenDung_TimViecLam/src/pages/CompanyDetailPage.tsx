import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { getCompanyByIdApi } from '../services/companyService';
import { getJobsByCompanyId } from '../services/jobService';
import type { Company } from '../types/companies';
import { 
    Loader2, MapPin, Globe, Users, Building2, Briefcase, 
    ChevronLeft, Mail, Phone, ExternalLink, CheckCircle2, 
    Sparkles, ChevronRight, Award
} from 'lucide-react';
import JobPagination from '../components/jobs/JobPagination';

const CompanyDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company | null>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination for jobs
    const [currentPage, setCurrentPage] = useState(1);
    const JOBS_PER_PAGE = 4;

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [compRes, jobsRes] = await Promise.all([
                    getCompanyByIdApi(id),
                    getJobsByCompanyId(id)
                ]);

                if (compRes.success) {
                    setCompany(compRes.data);
                } else {
                    setError(compRes.message);
                }

                if (jobsRes.success) {
                    setJobs(jobsRes.data);
                }
            } catch (err: any) {
                setError(err.message || 'Không thể tải thông tin công ty');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const formatSalary = (min: number, max: number) => {
        if (!min && !max) return 'Thỏa thuận';
        const formatValue = (val: number) => {
            if (val >= 1000000) return `${(val / 1000000).toFixed(0)}tr`;
            if (val >= 1000) return `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
            return val.toString();
        };
        return `${formatValue(min)} - ${formatValue(max)}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-bold text-lg">Đang tải hồ sơ công ty...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500 border border-red-100">
                        <Building2 size={48} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">{error || 'Không tìm thấy thông tin công ty'}</h2>
                    <Link to="/companies" className="flex items-center gap-2 text-indigo-600 font-black hover:gap-3 transition-all mt-4">
                        <ChevronLeft size={20} />
                        Quay lại danh sách công ty
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const activeJobs = jobs.filter(job => job.status === 'Active');

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />

            <main className="flex-1 w-full flex flex-col pb-20">
                {/* Cover Photo */}
                <section className="relative w-full h-[350px] md:h-[450px]">
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${company.cover ? (company.cover.startsWith('http') ? company.cover : `/images/${company.cover}`) : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070'})` }}
                    >
                        <div className="absolute inset-0 bg-slate-900/40" />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 to-transparent" />
                    </div>
                </section>

                {/* Floating Content Area */}
                <div className="relative z-20 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-[100px]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN: Company Info */}
                        <div className="lg:col-span-4 lg:col-start-1 flex flex-col gap-6">
                            <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col items-center sm:items-start text-center sm:text-left">
                                {/* Logo */}
                                <div className="w-40 h-40 rounded-[32px] p-4 bg-white border border-gray-100 shadow-xl -mt-24 mb-6 shrink-0 relative flex items-center justify-center overflow-hidden">
                                    <img
                                        src={company.logo ? (company.logo.startsWith('http') ? company.logo : `/images/${company.logo}`) : 'https://placehold.co/200x200?text=Logo'}
                                        alt={company.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">{company.name}</h1>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-[15px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">{company.industry || 'Lĩnh vực công nghệ'}</span>
                                    {company.isVerified && <CheckCircle2 size={20} className="text-blue-500" />}
                                </div>

                                <div className="w-full h-px bg-slate-100 mb-8"></div>

                                {/* Company Details List */}
                                <div className="w-full flex flex-col gap-6 text-left">
                                    <DetailItem
                                        icon={<Users size={20} className="text-indigo-500" />}
                                        label="Quy mô"
                                        value={company.size || 'Đang cập nhật'}
                                    />
                                    <DetailItem
                                        icon={<Globe size={20} className="text-indigo-500" />}
                                        label="Website"
                                        value={company.website || 'Đang cập nhật'}
                                        isLink
                                    />
                                    <DetailItem
                                        icon={<Mail size={20} className="text-indigo-500" />}
                                        label="Email liên hệ"
                                        value={company.email || 'Đang cập nhật'}
                                    />
                                    <DetailItem
                                        icon={<Phone size={20} className="text-indigo-500" />}
                                        label="Số điện thoại"
                                        value={company.phone || 'Đang cập nhật'}
                                    />
                                    <DetailItem
                                        icon={<MapPin size={20} className="text-indigo-500" />}
                                        label="Trụ sở chính"
                                        value={company.address || 'Đang cập nhật'}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: About & Jobs */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            {/* About Section */}
                            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 relative">
                                <div className="absolute top-8 right-8">
                                    <Sparkles className="text-indigo-200" size={32} />
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 mb-8 pb-2 flex items-center gap-3">
                                    <div className="w-2.5 h-8 bg-linear-to-b from-indigo-500 to-blue-500 rounded-full"></div>
                                    Giới thiệu công ty
                                </h3>

                                <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed text-lg mb-10 italic">
                                    {company.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: company.description.replace(/\n/g, '<br/>') }} />
                                    ) : (
                                        <p>Chưa có thông tin giới thiệu chi tiết cho doanh nghiệp này.</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                                    {/* Culture */}
                                    <div className="bg-slate-50/50 p-6 rounded-[24px] border border-slate-100">
                                        <h4 className="font-black text-gray-900 mb-5 flex items-center gap-3 uppercase tracking-wider text-sm">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            Văn hóa nổi bật
                                        </h4>
                                        <p className="text-gray-600 leading-relaxed text-sm font-medium">
                                            {company.culture || 'Đang cập nhật...'}
                                        </p>
                                    </div>

                                    {/* Benefits */}
                                    <div className="bg-purple-50/30 p-6 rounded-[24px] border border-purple-100/50">
                                        <h4 className="font-black text-gray-900 mb-5 flex items-center gap-3 uppercase tracking-wider text-sm">
                                            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                                                <Award size={18} />
                                            </div>
                                            Phúc lợi nhân viên
                                        </h4>
                                        <p className="text-gray-600 leading-relaxed text-sm font-medium">
                                            {company.benefits || 'Đang cập nhật...'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Active Jobs Section */}
                            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                        <div className="w-2.5 h-8 bg-linear-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                                        Việc làm đang tuyển ({activeJobs.length})
                                    </h3>
                                </div>

                                {activeJobs.length === 0 ? (
                                    <div className="py-20 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                                        <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-gray-400 font-bold text-lg">Công ty hiện chưa đăng tin tuyển dụng nào</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {activeJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE).map(job => (
                                                <Link
                                                    key={job.id}
                                                    to={`/jobs/${job.id}`}
                                                    className="group p-6 rounded-[24px] border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-600/5 transition-all relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-indigo-50/50 to-transparent rounded-bl-full group-hover:scale-150 transition-transform duration-500" />

                                                    <div className="relative z-10">
                                                        <h4 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors mb-3 line-clamp-1">{job.title}</h4>
                                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-bold text-gray-400">
                                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
                                                                <Briefcase size={12} /> {job.jobTypeName}
                                                            </span>
                                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
                                                                <MapPin size={12} /> {job.locationName}
                                                            </span>
                                                        </div>
                                                        <div className="mt-5 pt-5 border-t border-slate-50 flex justify-between items-center">
                                                            <span className="text-emerald-600 font-black text-sm">
                                                                {formatSalary(job.minSalary, job.maxSalary)}
                                                            </span>
                                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                <ChevronRight size={16} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        <JobPagination
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(activeJobs.length / JOBS_PER_PAGE)}
                                            onPageChange={(page) => setCurrentPage(page)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

const DetailItem = ({ icon, label, value, isLink }: { icon: React.ReactNode, label: string, value: string, isLink?: boolean }) => (
    <div className="flex items-start gap-4 group">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            {icon}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</span>
            {isLink && value !== 'Đang cập nhật' ? (
                <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-[15px] font-black text-indigo-600 hover:underline flex items-center gap-1 truncate">
                    {value.replace(/^https?:\/\//, '')}
                    <ExternalLink size={12} />
                </a>
            ) : (
                <span className="text-[15px] font-black text-gray-900 truncate leading-tight">{value}</span>
            )}
        </div>
    </div>
);

export default CompanyDetailPage;
