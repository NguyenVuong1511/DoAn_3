import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { getUserId } from '../services/authService';
import { getMyCompanyApi } from '../services/companyService';
import { getJobsByCompanyId } from '../services/jobService';
import { getApplicationsByJobApi, updateApplicationStatusApi } from '../services/applicationService';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  Loader2,
  Search,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  FileText,
  Filter,
  Download,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecruiterApplicationsPage = () => {
  const navigate = useNavigate();
  const userId = getUserId();
  const [jobs, setJobs] = useState<any[]>([]);
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');

  useEffect(() => {
    if (userId) {
      fetchApplications();
    }
  }, [userId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const companyRes = await getMyCompanyApi(userId!);
      if (companyRes.success) {
        const jobsRes = await getJobsByCompanyId(companyRes.data.id);
        if (jobsRes.success) {
          setJobs(jobsRes.data);

          const allApps: any[] = [];
          const appPromises = jobsRes.data.map(async (job) => {
            const appsRes = await getApplicationsByJobApi(job.id);
            if (appsRes.success) {
              return appsRes.data.map((app: any) => ({
                ...app,
                jobTitle: job.title
              }));
            }
            return [];
          });

          const results = await Promise.all(appPromises);
          results.forEach(apps => allApps.push(...apps));

          setAllApplications(allApps.sort((a, b) =>
            new Date(b.applyDate || 0).getTime() - new Date(a.applyDate || 0).getTime()
          ));
        }
      }
    } catch (error) {
      console.error("Fetch applications error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      const res = await updateApplicationStatusApi(appId, status);
      if (res.success) {
        setAllApplications(allApplications.map(a =>
          a.id === appId ? { ...a, status } : a
        ));
      }
    } catch (error) {
      console.error("Update status error:", error);
    }
  };

  const filteredApps = allApplications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesJob = jobFilter === 'All' || app.jobPostId === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Đang tải danh sách ứng viên...</p>
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
                  onClick={() => navigate('/recruiter/manage-jobs')}
                  badge={jobs.length}
                />
                <SidebarItem
                  icon={<Users size={20} />}
                  label="Ứng viên"
                  isActive={true}
                  badge={allApplications.length}
                />
                <SidebarItem icon={<Mail size={20} />} label="Hộp thư đến" />
                <div className="h-px bg-slate-50 my-4 mx-4"></div>
                <SidebarItem icon={<Settings size={20} />} label="Cài đặt" />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 flex flex-col gap-8">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-black font-display text-gray-900 mb-2">Quản lý ứng viên</h1>
                <p className="text-gray-500 font-bold">Tổng cộng {allApplications.length} hồ sơ ứng tuyển</p>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm vị trí ứng tuyển..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-700"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="text-gray-400" size={18} />
                  <select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    className="bg-slate-50 border border-transparent rounded-xl px-4 py-3 outline-none font-black text-xs text-gray-700 focus:bg-white focus:border-indigo-600 cursor-pointer min-w-[180px]"
                  >
                    <option value="All">Tất cả tin đăng</option>
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <Filter className="text-gray-400" size={18} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-transparent rounded-xl px-4 py-3 outline-none font-black text-xs text-gray-700 focus:bg-white focus:border-indigo-600 cursor-pointer min-w-[150px]"
                  >
                    <option value="All">Tất cả trạng thái</option>
                    <option value="Pending">Chờ duyệt</option>
                    <option value="Approved">Đồng ý</option>
                    <option value="Rejected">Từ chối</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-50">
                      <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Ứng viên</th>
                      <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Vị trí ứng tuyển</th>
                      <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Ngày nộp</th>
                      <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Trạng thái</th>
                      <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredApps.map((app) => (
                      <tr key={app.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center text-indigo-500">
                              <Users size={24} />
                            </div>
                            <div>
                              <p className="font-black text-gray-900 text-sm">Ứng viên #{app.id?.substring(0, 6)}</p>
                              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                                <FileText size={12} /> {app.cvTitle || 'Xem CV'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <p className="font-black text-gray-700 text-sm line-clamp-1 max-w-[200px]">{app.jobTitle}</p>
                        </td>
                        <td className="py-6 px-4">
                          <p className="text-sm font-bold text-gray-500">{new Date(app.applyDate).toLocaleDateString('vi-VN')}</p>
                        </td>
                        <td className="py-6 px-4">
                          <StatusBadge status={app.status || 'Pending'} />
                        </td>
                        <td className="py-6 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {(!app.status || app.status === 'Pending') && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(app.id, 'Approved')}
                                  className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                                  title="Chấp nhận"
                                >
                                  <CheckCircle2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                                  className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                                  title="Từ chối"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                            <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center">
                              <Download size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-gray-600 hover:bg-gray-100 transition-all flex items-center justify-center">
                              <MoreHorizontal size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredApps.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <p className="text-gray-400 font-black">Không có hồ sơ nào khớp với bộ lọc</p>
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
    </div>
  );
};

const SidebarItem = ({ icon, label, isActive, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group cursor-pointer ${isActive
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
        : 'text-gray-500 hover:bg-slate-50 hover:text-indigo-600'
      }`}
  >
    <div className="flex items-center gap-4">
      <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'} transition-colors`}>{icon}</span>
      <span className="font-black text-[15px]">{label}</span>
    </div>
    {badge !== undefined && badge > 0 && (
      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
        } transition-colors`}>
        {badge}
      </span>
    )}
  </button>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
    'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
  };

  const labels: any = {
    'Pending': 'Chờ duyệt',
    'Approved': 'Đã duyệt',
    'Rejected': 'Từ chối',
  };

  return (
    <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border ${styles[status] || styles['Pending']}`}>
      {labels[status] || labels['Pending']}
    </span>
  );
};

export default RecruiterApplicationsPage;
