import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, DollarSign, Users,
  Award, Layers, ChevronLeft, Heart, Share2, Send,
  Building2, Globe, Phone, Info, Loader2, AlertCircle,
  ArrowRight
} from 'lucide-react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { getJobById } from '../services/jobService';
import { toggleSavedJob, checkIsSaved } from '../services/jobService';
import { getUserId } from '../services/authService';
import type { Job } from '../types/job';
import { format } from 'date-fns';
import ApplyJobModal from '../components/jobs/ApplyJobModal';
import { checkIfAppliedApi } from '../services/applicationService';
import { CheckCircle2 } from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = getUserId();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getJobById(id);
        if (res.success) {
          setJob(res.data);
          // Check if saved
          if (userId) {
            const savedRes = await checkIsSaved(userId, id);
            if (savedRes.success) setIsSaved(savedRes.data);
          }
        } else {
          setError(res.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải thông tin việc làm');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();

    const checkApplication = async () => {
      if (userId && id) {
        try {
          setCheckingApplication(true);
          const res = await checkIfAppliedApi(userId, id);
          if (res.success) setIsApplied(res.applied);
        } catch (err) {
          console.error('Lỗi kiểm tra trạng thái ứng tuyển:', err);
        } finally {
          setCheckingApplication(false);
        }
      }
    };

    checkApplication();
    window.scrollTo(0, 0);
  }, [id, userId]);

  const handleToggleSave = async () => {
    if (!userId) {
      navigate('/login');
      return;
    }
    if (!id || saving) return;

    try {
      setSaving(true);
      const res = await toggleSavedJob(userId, id);
      if (res.success) {
        setIsSaved(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyClick = () => {
    if (!userId) {
      navigate('/login');
      return;
    }
    if (isApplied) return;
    setIsModalOpen(true);
  };

  const isClosed = job?.status !== 'Active';

  const handleApplySuccess = () => {
    setIsApplied(true);
  };

  const formatSalary = (min: number, max: number) => {
    if (min === 0 && max === 0) return 'Thỏa thuận';
    return `${(min / 1000000).toFixed(0)} - ${(max / 1000000).toFixed(0)} triệu`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-gray-500 font-bold animate-pulse">Đang tải thông tin việc làm...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[40px] p-10 text-center shadow-xl border border-red-50 shadow-red-500/5">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">{error || 'Không tìm thấy việc làm'}</h2>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
            >
              <ChevronLeft size={20} />
              Quay lại danh sách
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />

      <main className="flex-1 w-full pb-24">
        {/* Hero Header Section */}
        <div className="bg-dark relative overflow-hidden pt-20 pb-32">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.4),transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.3),transparent_50%)]"></div>
          </div>

          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm mb-8 transition-colors group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Tất cả việc làm
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex items-start gap-6 md:gap-8">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-[30px] bg-white p-2 shadow-2xl shadow-black/50 shrink-0">
                  <img
                    src={job.companyLogo ? `/images/${job.companyLogo}` : 'https://placehold.co/200x200?text=Company'}
                    alt={job.companyName}
                    className="w-full h-full object-contain rounded-[20px]"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://placehold.co/200x200?text=Logo';
                    }}
                  />
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                      {job.jobTypeName}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      {job.experienceName}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-400 font-medium">
                    <Link to={`/company/${job.companyId}`} className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                      <Building2 size={18} className="text-indigo-400" />
                      {job.companyName}
                    </Link>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-rose-400" />
                      {job.locationName}
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-black text-lg">
                      <DollarSign size={20} />
                      {formatSalary(job.minSalary, job.maxSalary)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {isClosed && (
                  <div className="px-6 py-3 bg-rose-500/20 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-300 mb-2">
                    <AlertCircle size={20} />
                    <span className="font-bold text-sm">Tin tuyển dụng này đã ngừng nhận hồ sơ</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleSave}
                  disabled={saving}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${isSaved
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                >
                  {saving ? <Loader2 size={24} className="animate-spin" /> : <Heart size={24} fill={isSaved ? 'currentColor' : 'none'} />}
                </button>
                <button
                  onClick={handleApplyClick}
                  disabled={isApplied || checkingApplication || isClosed}
                  className={`flex-1 lg:flex-none px-10 h-14 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 group ${isApplied
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30 cursor-default'
                    : isClosed
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-80'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30 cursor-pointer'
                    }`}
                >
                  {checkingApplication ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : isApplied ? (
                    <>
                      <CheckCircle2 size={20} />
                      Đã ứng tuyển
                    </>
                  ) : isClosed ? (
                    <>
                      <AlertCircle size={20} />
                      Ngừng nhận hồ sơ
                    </>
                  ) : (
                    <>
                      Ứng tuyển ngay
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Information Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-8 rounded-[40px] shadow-xl shadow-indigo-500/5 border border-gray-100">
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Cấp bậc</p>
                  <div className="flex items-center gap-2 text-gray-900 font-black">
                    <Layers size={18} className="text-orange-500" />
                    {job.levelName}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Kinh nghiệm</p>
                  <div className="flex items-center gap-2 text-gray-900 font-black">
                    <Award size={18} className="text-indigo-500" />
                    {job.experienceName}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Số lượng</p>
                  <div className="flex items-center gap-2 text-gray-900 font-black">
                    <Users size={18} className="text-blue-500" />
                    {job.quantity} người
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Hết hạn</p>
                  <div className="flex items-center gap-2 text-gray-900 font-black">
                    <Clock size={18} className="text-rose-500" />
                    {format(new Date(job.deadline), 'dd/MM/yyyy')}
                  </div>
                </div>
              </div>

              {/* Main Content Card */}
              <div className="bg-white rounded-[40px] shadow-xl shadow-indigo-500/5 border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-12 space-y-12">
                  {/* Job Description */}
                  <section>
                    <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                      Mô tả công việc
                    </h2>
                    <div className="text-gray-600 font-medium leading-relaxed whitespace-pre-line text-lg">
                      {job.description}
                    </div>
                  </section>

                  {/* Requirements */}
                  <section>
                    <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-2 h-8 bg-emerald-600 rounded-full"></div>
                      Yêu cầu ứng viên
                    </h2>
                    <div className="text-gray-600 font-medium leading-relaxed whitespace-pre-line text-lg">
                      {job.requirement}
                    </div>
                  </section>

                  {/* Benefits */}
                  <section>
                    <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                      Quyền lợi được hưởng
                    </h2>
                    <div className="text-gray-600 font-medium leading-relaxed whitespace-pre-line text-lg">
                      {job.benefit}
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-8">
              {/* Company Info Card */}
              <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-indigo-500/5 border border-gray-100 sticky top-24">
                <h3 className="text-xl font-black text-gray-900 mb-6">Về công ty</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-16 rounded-lg bg-gray-50 border border-gray-100">
                    <img
                      src={job.companyLogo ? `/images/${job.companyLogo}` : 'https://placehold.co/100x100?text=Logo'}
                      alt={job.companyName}
                      className="w-full h-full object-cover rounded-lg p-1"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://placehold.co/100x100?text=Logo';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 line-clamp-1">{job.companyName}</h4>
                    <Link to={`/company/${job.companyId}`} className="text-indigo-600 text-sm font-bold hover:underline">
                      Xem trang công ty
                    </Link>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-gray-400 mt-1 shrink-0" />
                    <p className="text-gray-600 text-sm font-medium">{job.locationName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-gray-400 shrink-0" />
                    <p className="text-gray-600 text-sm font-medium">www.example.com</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-gray-400 shrink-0" />
                    <p className="text-gray-600 text-sm font-medium">028 XXXX XXXX</p>
                  </div>
                </div>

                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-4">
                  <div className="flex items-center gap-3 text-indigo-700">
                    <Info size={20} />
                    <span className="font-black">Lưu ý bảo mật</span>
                  </div>
                  <p className="text-indigo-600/80 text-xs font-medium leading-relaxed">
                    Bạn nên cẩn trọng trước các lời mời yêu cầu nộp phí hoặc thông tin tài khoản ngân hàng.
                    UpWork không bao giờ yêu cầu ứng viên nộp phí.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <button className="w-full h-14 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-3">
                    <Share2 size={20} />
                    Chia sẻ việc làm
                  </button>
                  <Link to="/jobs" className="w-full h-14 bg-gray-50 text-gray-400 rounded-2xl font-black hover:bg-gray-100 transition-all flex items-center justify-center gap-3 group">
                    Xem thêm việc làm khác
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {job && userId && (
        <ApplyJobModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          jobId={job.id}
          jobTitle={job.title}
          companyName={job.companyName}
          companyLogo={job.companyLogo}
          userId={userId}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

export default JobDetailPage;