import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  ArrowUpRight,
  AlertCircle,
  FileSearch
} from 'lucide-react';
import { useState } from 'react';
import CVFileViewer from '../common/CVFileViewer';


interface OverviewSectionProps {
  jobs: any[];
  allApplications: any[];
  stats: {
    activeJobsCount: number;
    pendingApplicationsCount: number;
    approvedApplicationsCount: number;
    soonToExpireCount: number;
  };
  onSwitchTab: (tab: string) => void;
}

const OverviewSection = ({ jobs, allApplications, stats, onSwitchTab }: OverviewSectionProps) => {
  // CV Viewer state
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerFileUrl, setViewerFileUrl] = useState('');
  const [viewerFileName, setViewerFileName] = useState('');

  const handleViewCV = (app: any) => {
    if (app.cvType === 'Online') {
      setViewerFileUrl(`/candidates/${app.candidateUserId}/cv/${app.cvId}`);
      setViewerFileName(`Online CV - ${app.candidateName}`);
      setIsViewerOpen(true);
    } else if (app.cvFileUrl) {
      setViewerFileUrl(app.cvFileUrl);
      setViewerFileName(`CV File - ${app.candidateName}`);
      setIsViewerOpen(true);
    } else {
      alert('Không tìm thấy file CV.');
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStat
          icon={<Briefcase size={24} />}
          label="Tin đang bật"
          value={stats.activeJobsCount}
          trend={stats.soonToExpireCount > 0 ? `${stats.soonToExpireCount} sắp hết hạn` : "Ổn định"}
          color="blue"
        />
        <DashboardStat
          icon={<Users size={24} />}
          label="Tổng ứng tuyển"
          value={allApplications.length}
          trend={`+${allApplications.length > 0 ? Math.round(allApplications.length * 0.1) : 0}`}
          color="purple"
        />
        <DashboardStat
          icon={<Clock size={24} />}
          label="Chờ phản hồi"
          value={stats.pendingApplicationsCount}
          trend="Cần xử lý"
          color="amber"
        />
        <DashboardStat
          icon={<CheckCircle2 size={24} />}
          label="Đã duyệt"
          value={stats.approvedApplicationsCount}
          trend={`${allApplications.length > 0 ? Math.round((stats.approvedApplicationsCount / allApplications.length) * 100) : 0}%`}
          color="emerald"
        />
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black font-display text-gray-900 flex items-center gap-3">
            <div className="w-2.5 h-8 bg-linear-to-b from-indigo-500 to-blue-500 rounded-full"></div>
            Ứng tuyển mới nhất
          </h3>
          <button
            onClick={() => onSwitchTab('candidates')}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 cursor-pointer"
          >
            Xem tất cả
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Ứng viên</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Vị trí</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Ngày nộp</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Trạng thái</th>
                <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allApplications.slice(0, 5).map((app, idx) => (
                <tr key={app.id || idx} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
                        <img className='w-full h-full object-cover'
                          src={app.candidateAvatar
                            ? (app.candidateAvatar.startsWith('http') ? app.candidateAvatar : `/images/avatar/${app.candidateAvatar}`)
                            : `https://i.pravatar.cc/150?u=${app.id}`}
                          alt="candidate"
                        />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm">{app.candidateName || `Ứng viên #${app.id?.substring(0, 4)}`}</p>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          {app.status === 'Pending' || !app.status ? 'Hồ sơ mới' : 'Đã xử lý'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <p className="font-black text-gray-700 text-sm line-clamp-1 max-w-[200px]">{app.jobTitle}</p>
                  </td>
                  <td className="py-6 px-4">
                    <p className="text-sm font-bold text-gray-500">{new Date(app.applyDate || Date.now()).toLocaleDateString('vi-VN')}</p>
                  </td>
                  <td className="py-6 px-4">
                    <StatusBadge status={app.status || 'Pending'} />
                  </td>
                  <td className="py-6 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewCV(app)}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center cursor-pointer"
                        title="Xem CV"
                      >
                        <FileSearch size={18} />
                      </button>
                      <button
                        onClick={() => window.open(`/candidates/${app.candidateUserId || app.candidateId}`, '_blank')}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center cursor-pointer"
                        title="Xem hồ sơ"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {allApplications.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400 font-black">Chưa có ứng tuyển nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Performance & Progress */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

        {/* Top Jobs */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black font-display text-gray-900 flex items-center gap-3">
              <div className="w-2.5 h-6 bg-linear-to-b from-emerald-500 to-teal-500 rounded-full"></div>
              Tin hiệu quả nhất
            </h3>
            <BarChart3 className="text-slate-300" size={24} />
          </div>
          <div className="flex flex-col gap-6">
            {[...jobs]
              .sort((a, b) => {
                const countA = allApplications.filter(app => app.jobPostId === a.id).length;
                const countB = allApplications.filter(app => app.jobPostId === b.id).length;
                return countB - countA;
              })
              .slice(0, 4)
              .map((job, idx) => {
                const jobApps = allApplications.filter(a => a.jobPostId === job.id);
                return (
                  <div key={job.id} className="flex items-center gap-5 group cursor-pointer" onClick={() => onSwitchTab('jobs')}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 transition-all group-hover:scale-110 ${idx === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-50 text-slate-400'
                      }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{job.title}</h4>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-[10px] font-black text-gray-400 flex items-center gap-1 uppercase tracking-widest">
                          <Users size={12} /> {jobApps.length} Ứng tuyển
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100">
          <h3 className="text-xl font-black font-display text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-2.5 h-6 bg-linear-to-b from-amber-500 to-orange-500 rounded-full"></div>
            Tình trạng tuyển dụng
          </h3>

          <div className="space-y-6">
            <ProgressItem label="Tin đang hoạt động" value={stats.activeJobsCount} total={jobs.length} color="bg-indigo-600" />
            <ProgressItem label="Hồ sơ đã xử lý" value={allApplications.length - stats.pendingApplicationsCount} total={allApplications.length} color="bg-emerald-500" />
            <ProgressItem label="Hồ sơ tiềm năng" value={stats.approvedApplicationsCount} total={allApplications.length} color="bg-purple-500" />
          </div>

          <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
            <AlertCircle className="text-amber-500 shrink-0" size={20} />
            <p className="text-xs font-bold text-gray-500 leading-relaxed">
              Bạn có <span className="text-amber-600">{stats.pendingApplicationsCount} hồ sơ</span> chưa phản hồi. Hãy xử lý sớm để tăng tỷ lệ thành công.
            </p>
          </div>
        </div>

      </div>

      <CVFileViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        fileUrl={viewerFileUrl}
        fileName={viewerFileName}
      />
    </div>
  );
};

/* Internal Helper Components */

const DashboardStat = ({ icon, label, value, trend, color }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 hover:-translate-y-1 transition-all group">
      <div className={`w-14 h-14 rounded-2xl ${colorMap[color]} flex items-center justify-center mb-6 shadow-sm border group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-3xl font-black text-gray-900 leading-tight font-display">{value}</h4>
        <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-2 py-1 rounded-lg border border-slate-100">
          {trend}
        </span>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
    'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
  };
  const labels: any = { 'Pending': 'Chờ duyệt', 'Approved': 'Đồng ý', 'Rejected': 'Từ chối' };
  return (
    <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border ${styles[status] || styles['Pending']}`}>
      {labels[status] || labels['Pending']}
    </span>
  );
};

const ProgressItem = ({ label, value, total, color }: any) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-black text-gray-700">{label}</span>
        <span className="text-sm font-black text-gray-900">{value}/{total}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default OverviewSection;
