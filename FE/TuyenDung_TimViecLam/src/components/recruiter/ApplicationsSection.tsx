import { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Download, 
  MoreHorizontal,
  Briefcase,
  FileText
} from 'lucide-react';
import { updateApplicationStatusApi } from '../../services/applicationService';

interface ApplicationsSectionProps {
  jobs: any[];
  allApplications: any[];
  refreshData: () => void;
}

const ApplicationsSection = ({ jobs, allApplications, refreshData }: ApplicationsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      const res = await updateApplicationStatusApi(appId, status);
      if (res.success) {
        refreshData();
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

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-black font-display text-gray-900 mb-2">Quản lý ứng viên</h1>
        <p className="text-gray-500 font-bold">Tổng cộng {allApplications.length} hồ sơ ứng tuyển</p>
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
              <option value="Approved">Đã duyệt</option>
              <option value="Rejected">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Ứng viên</th>
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
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm">Ứng viên #{app.id?.substring(0, 6)}</p>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{app.jobTitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4 font-bold text-gray-500 text-sm">
                    {new Date(app.applyDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-6 px-4">
                    <StatusBadge status={app.status || 'Pending'} />
                  </td>
                  <td className="py-6 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(!app.status || app.status === 'Pending') && (
                        <>
                          <button onClick={() => handleUpdateStatus(app.id, 'Approved')} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center">
                            <CheckCircle2 size={16} />
                          </button>
                          <button onClick={() => handleUpdateStatus(app.id, 'Rejected')} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = { 'Pending': 'bg-amber-50 text-amber-600 border-amber-100', 'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100', 'Rejected': 'bg-rose-50 text-rose-600 border-rose-100' };
  const labels: any = { 'Pending': 'Chờ duyệt', 'Approved': 'Đã duyệt', 'Rejected': 'Từ chối' };
  return (
    <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border ${styles[status] || styles['Pending']}`}>
      {labels[status] || labels['Pending']}
    </span>
  );
};

export default ApplicationsSection;
