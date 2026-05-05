import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ToggleRight,
  ToggleLeft,
  Edit,
  Trash2,
  PlusCircle,
  Eye
} from 'lucide-react';
import { deleteJobApi, toggleJobStatusApi } from '../../services/jobService';
import PostJobModal from './PostJobModal';
import Pagination from '../common/Pagination';

interface ManageJobsSectionProps {
  jobs: any[];
  allApplications: any[];
  refreshData: () => void;
  onOpenPostJob: () => void;
  userId: string;
  companyId: string;
}

const ManageJobsSection = ({ jobs, allApplications, refreshData, onOpenPostJob, userId, companyId }: ManageJobsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingJob, setEditingJob] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleToggleStatus = async (jobId: string) => {
    try {
      const res = await toggleJobStatusApi(jobId);
      if (res.success) {
        (refreshData as any)(true);
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
          (refreshData as any)(true);
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

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Hạn nộp</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Ứng tuyển</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentJobs.map((job) => {
                const appCount = allApplications.filter(app => app.jobPostId === job.id).length;
                const deadlineDate = new Date(job.deadline);
                const isExpired = deadlineDate < new Date();

                return (
                  <tr key={job.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-4">
                      <p className="font-black text-gray-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">{job.title}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{job.jobTypeName}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{job.locationName}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        {job.status === 'Pending' && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[9px] font-black uppercase tracking-wider border border-amber-100">Chờ duyệt</span>
                        )}
                        {job.status === 'Rejected' && (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[9px] font-black uppercase tracking-wider border border-rose-100">Bị từ chối</span>
                        )}
                        {job.status === 'Active' && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-wider border border-emerald-100">Hiển thị</span>
                        )}
                        {job.status === 'Inactive' && (
                          <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-wider border border-slate-100">Đã ẩn</span>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-bold text-gray-600">{new Date(job.postDate).toLocaleDateString('vi-VN')}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Đã đăng</p>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col gap-0.5">
                        <p className={`text-sm font-bold ${isExpired ? 'text-rose-500' : 'text-indigo-600'}`}>
                          {deadlineDate.toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                          {isExpired ? 'Hết hạn' : 'Hạn chót'}
                        </p>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                          {appCount}
                        </div>
                        <span className="text-xs font-bold text-gray-400">Hồ sơ</span>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                          title="Xem trên website"
                          className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center cursor-pointer border border-transparent hover:border-indigo-100"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => job.status !== 'Rejected' && job.status !== 'Pending' && handleToggleStatus(job.id)}
                          disabled={job.status === 'Rejected' || job.status === 'Pending'}
                          title={job.status === 'Rejected' ? 'Bị Admin từ chối' : (job.status === 'Pending' ? 'Đang chờ duyệt' : (job.status === 'Active' ? 'Ẩn tin' : 'Hiện tin'))}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                            job.status === 'Rejected' || job.status === 'Pending' 
                            ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50' 
                            : job.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 cursor-pointer' 
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 cursor-pointer'
                          }`}
                        >
                          {job.status === 'Active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                        <button
                          onClick={() => job.status !== 'Rejected' && setEditingJob(job)}
                          disabled={job.status === 'Rejected' || job.status === 'Pending'}
                          className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-transparent transition-all ${
                            job.status === 'Rejected' || job.status === 'Pending'
                            ? 'text-slate-300 cursor-not-allowed opacity-50'
                            : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-100 cursor-pointer'
                          }`}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => job.status !== 'Rejected' && handleDeleteJob(job.id)}
                          disabled={job.status === 'Rejected' || job.status === 'Pending'}
                          className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-transparent transition-all ${
                            job.status === 'Rejected' || job.status === 'Pending'
                            ? 'text-slate-300 cursor-not-allowed opacity-50'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 cursor-pointer'
                          }`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredJobs.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <PostJobModal
        isOpen={!!editingJob}
        onClose={() => setEditingJob(null)}
        userId={userId}
        companyId={companyId}
        onSuccess={refreshData}
        jobToEdit={editingJob}
      />
    </div>
  );
};

export default ManageJobsSection;
