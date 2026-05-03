import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Video, Briefcase, Eye, Edit3 } from 'lucide-react';
import { type Interview } from '../../services/interviewService';
import Pagination from '../common/Pagination';
import ScheduleInterviewModal from './ScheduleInterviewModal';

interface InterviewsSectionProps {
  interviews: Interview[];
  refreshData?: () => void;
}

const InterviewsSection = ({ interviews, refreshData }: InterviewsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInterviewForEdit, setSelectedInterviewForEdit] = useState<Interview | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const now = new Date().getTime();
  const filteredInterviews = interviews.filter(intv => {
    const candidateName = intv.candidateName || '';
    const jobTitle = intv.jobTitle || '';
    const matchesSearch = candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || intv.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const aTime = new Date(a.interviewDate).getTime();
    const bTime = new Date(b.interviewDate).getTime();
    const aDiff = aTime - now;
    const bDiff = bTime - now;
    
    // Both in future
    if (aDiff > 0 && bDiff > 0) return aDiff - bDiff; // closest future first
    // Both in past
    if (aDiff < 0 && bDiff < 0) return bDiff - aDiff; // closest past first
    // One future, one past
    if (aDiff > 0 && bDiff < 0) return -1; // future first
    return 1;
  });

  const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage);
  const currentInterviews = filteredInterviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Scheduled':
        return <span className="text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border bg-amber-50 text-amber-600 border-amber-100">Sắp tới</span>;
      case 'Completed':
        return <span className="text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border bg-emerald-50 text-emerald-600 border-emerald-100">Đã xong</span>;
      case 'Cancelled':
        return <span className="text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border bg-rose-50 text-rose-600 border-rose-100">Đã hủy</span>;
      default:
        return <span className="text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border bg-slate-50 text-slate-600 border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black font-display text-gray-900 mb-2">Lịch phỏng vấn</h1>
          <p className="text-gray-500 font-bold">Bạn có {interviews.length} lịch phỏng vấn đã được lên kế hoạch</p>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm tên ứng viên hoặc vị trí..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-700"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-3">
            <Filter className="text-gray-400" size={18} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-transparent rounded-xl px-4 py-3 outline-none font-black text-xs text-gray-700 focus:bg-white focus:border-indigo-600 cursor-pointer min-w-[150px]"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Pending">Sắp tới</option>
              <option value="Completed">Đã xong</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interviews Table */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Ứng viên & Vị trí</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Thời gian</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Hình thức</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Trạng thái</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentInterviews.map((intv) => {
                const date = new Date(intv.interviewDate);
                const isOnline = intv.location?.toLowerCase().includes('http');

                return (
                <tr key={intv.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img 
                          src={intv.candidateAvatar ? (intv.candidateAvatar.startsWith('http') ? intv.candidateAvatar : `/images/avatar/${intv.candidateAvatar}`) : '/images/default-avatar.png'} 
                          alt="" 
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                          onError={(e: any) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(intv.candidateName || 'U'); }}
                        />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                          {intv.candidateName || 'Ứng viên chưa cập nhật tên'}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <Briefcase size={10} /> {intv.jobTitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-black text-indigo-600 flex items-center gap-1.5">
                        <Calendar size={14} className="text-indigo-400" />
                        {date.toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-[11px] font-bold text-gray-400 tracking-tight ml-5">
                        Lúc {date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    {isOnline ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wider inline-flex items-center gap-1 w-fit">
                          <Video size={12} /> Online
                        </span>
                        <a href={intv.location} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline max-w-[150px] truncate block" title={intv.location}>
                          {intv.location}
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-gray-600 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-wider inline-flex items-center gap-1 w-fit">
                          <MapPin size={12} /> Trực tiếp
                        </span>
                        <p className="text-[10px] text-gray-500 max-w-[150px] truncate" title={intv.location || 'Tại văn phòng'}>
                          {intv.location || 'Tại văn phòng công ty'}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="py-6 px-4">
                    {getStatusBadge(intv.status)}
                  </td>
                  <td className="py-6 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedInterviewForEdit(intv);
                          setIsEditModalOpen(true);
                        }}
                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center cursor-pointer"
                        title="Sửa lịch"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
              {filteredInterviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                        <Calendar size={32} />
                      </div>
                      <p className="text-gray-400 font-black">Chưa có lịch phỏng vấn nào phù hợp</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredInterviews.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {selectedInterviewForEdit && (
        <ScheduleInterviewModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedInterviewForEdit(null);
          }}
          applicationId={selectedInterviewForEdit.applicationId}
          candidateName={selectedInterviewForEdit.candidateName || 'Ứng viên'}
          jobTitle={selectedInterviewForEdit.jobTitle || 'Công việc'}
          onSuccess={() => {
            if (refreshData) refreshData();
          }}
          existingInterview={selectedInterviewForEdit}
        />
      )}
    </div>
  );
};

export default InterviewsSection;
