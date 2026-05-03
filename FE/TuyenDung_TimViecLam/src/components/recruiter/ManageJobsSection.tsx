import { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  ToggleRight, 
  ToggleLeft, 
  Eye, 
  Edit, 
  Trash2,
  PlusCircle
} from 'lucide-react';
import { deleteJobApi, toggleJobStatusApi } from '../../services/jobService';

interface ManageJobsSectionProps {
  jobs: any[];
  refreshData: () => void;
  onOpenPostJob: () => void;
}

const ManageJobsSection = ({ jobs, refreshData, onOpenPostJob }: ManageJobsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleToggleStatus = async (jobId: string) => {
    try {
      const res = await toggleJobStatusApi(jobId);
      if (res.success) {
        refreshData();
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
          refreshData();
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

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black font-display text-gray-900 mb-2">Quản lý tin đăng</h1>
          <p className="text-gray-500 font-bold">Bạn đang có {jobs.length} tin tuyển dụng trong hệ thống</p>
        </div>
        <button 
          onClick={onOpenPostJob}
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

      {/* Table */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Tin đăng</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Ngày đăng</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-4">
                    <p className="font-black text-gray-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">{job.title}</p>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{job.jobTypeName}</span>
                  </td>
                  <td className="py-6 px-4 font-bold text-gray-500 text-sm">
                    {new Date(job.postDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-6 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleStatus(job.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                          job.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {job.status === 'Active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {job.status === 'Active' ? 'Bật' : 'Ẩn'}
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-amber-600 transition-all flex items-center justify-center">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteJob(job.id)}
                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center"
                      >
                        <Trash2 size={18} />
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

export default ManageJobsSection;
