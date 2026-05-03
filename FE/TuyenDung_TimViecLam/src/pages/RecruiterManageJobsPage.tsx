import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { getUserId } from '../services/authService';
import { getMyCompanyApi } from '../services/companyService';
import { getJobsByCompanyId, deleteJobApi, toggleJobStatusApi } from '../services/jobService';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  Settings, 
  PlusCircle, 
  ChevronRight,
  Loader2,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Filter
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PostJobModal from '../components/recruiter/PostJobModal';

const RecruiterManageJobsPage = () => {
  const navigate = useNavigate();
  const userId = getUserId();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchJobs();
    }
  }, [userId]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const companyRes = await getMyCompanyApi(userId!);
      if (companyRes.success) {
        setCompany(companyRes.data);
        const jobsRes = await getJobsByCompanyId(companyRes.data.id);
        if (jobsRes.success) {
          setJobs(jobsRes.data);
        }
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (jobId: string) => {
    try {
      const res = await toggleJobStatusApi(jobId);
      if (res.success) {
        setJobs(jobs.map(j => j.id === jobId ? { ...j, status: j.status === 'Active' ? 'Inactive' : 'Active' } : j));
      }
    } catch (error) {
      console.error("Toggle status error:", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này không?')) {
      try {
        const res = await deleteJobApi(jobId);
        if (res.success) {
          setJobs(jobs.filter(j => j.id !== jobId));
        }
      } catch (error) {
        console.error("Delete job error:", error);
      }
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Đang tải danh sách tin...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3">
             <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 sticky top-10">
              <div className="flex flex-col gap-2">
                <SidebarItem 
                  icon={<LayoutDashboard size={20} />} 
                  label="Tổng quan" 
                  onClick={() => navigate('/recruiter/dashboard')}
                />
                <SidebarItem 
                  icon={<Briefcase size={20} />} 
                  label="Tin tuyển dụng" 
                  isActive={true}
                  badge={jobs.length}
                />
                <SidebarItem 
                  icon={<Users size={20} />} 
                  label="Ứng viên" 
                  onClick={() => navigate('/recruiter/applications')}
                />
                <SidebarItem 
                  icon={<Calendar size={20} />} 
                  label="Lịch phỏng vấn" 
                />
                <div className="h-px bg-slate-50 my-4 mx-4"></div>
                <SidebarItem 
                  icon={<Settings size={20} />} 
                  label="Cài đặt tài khoản" 
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 flex flex-col gap-8">
            
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-black font-display text-gray-900 mb-2">Quản lý tin đăng</h1>
                <p className="text-gray-500 font-bold">Bạn đang có {jobs.length} tin tuyển dụng trong hệ thống</p>
              </div>
              <button 
                onClick={() => setIsPostJobModalOpen(true)}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:-translate-y-1 cursor-pointer"
              >
                <PlusCircle size={20} />
                Đăng tin mới
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm tiêu đề tin đăng..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-700"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="text-gray-400" size={18} />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-transparent rounded-xl px-6 py-3 outline-none font-black text-gray-700 focus:bg-white focus:border-indigo-600 cursor-pointer"
                >
                  <option value="All">Tất cả trạng thái</option>
                  <option value="Active">Đang hoạt động</option>
                  <option value="Inactive">Đã ẩn</option>
                </select>
              </div>
            </div>

            {/* Jobs List Table */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-50">
                      <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Tin đăng</th>
                      <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Ngày đăng</th>
                      <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Hạn nộp</th>
                      <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Trạng thái</th>
                      <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-6 px-4">
                          <div>
                            <p className="font-black text-gray-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">{job.title}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{job.jobTypeName}</span>
                              <span className="text-gray-200">•</span>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{job.locationName}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <p className="text-sm font-bold text-gray-500">{new Date(job.postDate).toLocaleDateString('vi-VN')}</p>
                        </td>
                        <td className="py-6 px-4">
                          <p className={`text-sm font-bold ${new Date(job.deadline) < new Date() ? 'text-rose-500' : 'text-gray-500'}`}>
                            {new Date(job.deadline).toLocaleDateString('vi-VN')}
                          </p>
                        </td>
                        <td className="py-6 px-4">
                          <button 
                            onClick={() => handleToggleStatus(job.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                              job.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {job.status === 'Active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            {job.status === 'Active' ? 'Hoạt động' : 'Đã ẩn'}
                          </button>
                        </td>
                        <td className="py-6 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center">
                              <Eye size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all flex items-center justify-center">
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteJob(job.id)}
                              className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredJobs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <p className="text-gray-400 font-black">Không tìm thấy tin tuyển dụng phù hợp</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {company && (
        <PostJobModal 
          isOpen={isPostJobModalOpen}
          onClose={() => setIsPostJobModalOpen(false)}
          userId={userId!}
          companyId={company.id}
          onSuccess={fetchJobs}
        />
      )}
    </div>
  );
};

const SidebarItem = ({ icon, label, isActive, onClick, badge }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group cursor-pointer ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
        : 'text-gray-500 hover:bg-slate-50 hover:text-indigo-600'
    }`}
  >
    <div className="flex items-center gap-4">
      <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'} transition-colors`}>{icon}</span>
      <span className="font-black text-[15px]">{label}</span>
    </div>
    {badge !== undefined && badge > 0 && (
      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
      } transition-colors`}>
        {badge}
      </span>
    )}
  </button>
);

export default RecruiterManageJobsPage;
