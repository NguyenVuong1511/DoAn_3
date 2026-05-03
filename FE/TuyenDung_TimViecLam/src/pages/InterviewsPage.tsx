import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { getUserId } from '../services/authService';
import { getCandidateInterviewsApi, type Interview } from '../services/interviewService';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Info,
  ChevronRight, Loader2, AlertCircle,
  Video, Building2
} from 'lucide-react';
import { format, isAfter, isBefore, addHours } from 'date-fns';

const InterviewsPage = () => {
  const navigate = useNavigate();
  const userId = getUserId();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const res = await getCandidateInterviewsApi(userId);
        if (res.success) {
          setInterviews(res.data);
        } else {
          setError(res.message);
        }
      } catch (err: any) {
        setError(err.message || 'Không thể tải lịch phỏng vấn');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [userId, navigate]);

  const getInterviewStatus = (interview: Interview) => {
    const date = new Date(interview.interviewDate);
    const now = new Date();
    const isPast = isBefore(date, now);
    const isSoon = isAfter(date, now) && isBefore(date, addHours(now, 24));

    if (interview.status === 'Cancelled') {
      return {
        label: 'Đã hủy',
        class: 'bg-red-50 text-red-600 border-red-100',
        icon: <AlertCircle size={14} />
      };
    }

    if (isPast) {
      return {
        label: 'Đã diễn ra',
        class: 'bg-slate-100 text-slate-500 border-slate-200',
        icon: <Clock size={14} />
      };
    }

    if (isSoon) {
      return {
        label: 'Sắp diễn ra',
        class: 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse',
        icon: <Timer size={14} />
      };
    }

    return {
      label: 'Đang chờ',
      class: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      icon: <Calendar size={14} />
    };
  };

  const Timer = ({ size, className }: { size: number, className?: string }) => (
    <Clock size={size} className={className} />
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 w-full py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-black font-display text-gray-900 tracking-tight">
              Lịch <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">Phỏng vấn</span>
            </h1>
            <p className="text-gray-500 mt-3 text-lg font-medium">Quản lý và theo dõi các buổi phỏng vấn sắp tới của bạn.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500 font-bold">Đang tải lịch hẹn...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-[40px] p-12 text-center shadow-xl border border-red-50">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
              >
                Thử lại
              </button>
            </div>
          ) : interviews.length === 0 ? (
            <div className="bg-white rounded-[40px] p-20 text-center shadow-xl border border-gray-100">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-300">
                <Calendar size={48} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Bạn chưa có lịch phỏng vấn nào</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Khi nhà tuyển dụng mời bạn phỏng vấn, lịch hẹn sẽ xuất hiện tại đây.</p>
              <Link
                to="/applied-jobs"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                Xem việc đã ứng tuyển
                <ChevronRight size={20} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {interviews.map((interview) => {
                const status = getInterviewStatus(interview);
                const isOnline = interview.location?.toLowerCase().includes('http');

                return (
                  <div
                    key={interview.id}
                    className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all flex flex-col md:flex-row gap-8 relative overflow-hidden group"
                  >
                    {/* Status side bar */}
                    <div className={`absolute top-0 left-0 bottom-0 w-2 ${status.class.split(' ')[2].replace('border-', 'bg-')}`}></div>

                    {/* Left: Date info */}
                    <div className="md:w-48 shrink-0 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-indigo-600 font-black text-4xl mb-1">
                        {format(new Date(interview.interviewDate), 'dd')}
                      </div>
                      <div className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-3">
                        Tháng {format(new Date(interview.interviewDate), 'MM')}
                      </div>
                      <div className="w-full h-px bg-slate-200 mb-3"></div>
                      <div className="flex items-center gap-2 text-gray-900 font-black">
                        <Clock size={16} className="text-indigo-500" />
                        {format(new Date(interview.interviewDate), 'HH:mm')}
                      </div>
                    </div>

                    {/* Middle: Job & Company */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.class}`}>
                          {status.icon}
                          {status.label}
                        </span>
                        {isOnline && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                            <Video size={14} />
                            Phỏng vấn Online
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {interview.jobTitle}
                      </h3>

                      <div className="flex items-center gap-4 text-gray-500 font-bold mb-6">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={16} className="text-slate-400" />
                          {interview.companyName}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                            {isOnline ? <Video size={20} className="text-indigo-500" /> : <MapPin size={20} className="text-indigo-500" />}
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5">Địa điểm / Link</div>
                            {isOnline ? (
                              <a href={interview.location} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline break-all">
                                Tham gia phỏng vấn
                              </a>
                            ) : (
                              <div className="text-gray-700 font-bold">{interview.location || 'Chưa cập nhật'}</div>
                            )}
                          </div>
                        </div>

                        {interview.notes && (
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                              <Info size={20} className="text-indigo-500" />
                            </div>
                            <div>
                              <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5">Ghi chú từ nhà tuyển dụng</div>
                              <div className="text-gray-700 font-bold line-clamp-2">{interview.notes}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="md:w-48 shrink-0 flex flex-col justify-center gap-3">
                      <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                        Xác nhận tham gia
                      </button>
                      <Link
                        to={`/jobs/${interview.jobTitle}`} // Should be application detail or similar
                        className="w-full py-4 bg-slate-100 text-gray-700 rounded-2xl font-black text-center hover:bg-slate-200 transition-all"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InterviewsPage;
