import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { getUserId } from '../services/authService';
import { getMyCompanyApi } from '../services/companyService';
import { getJobsByCompanyId } from '../services/jobService';
import { getApplicationsByCompanyApi } from '../services/applicationService';
import { getInterviewsByCompanyApi, type Interview } from '../services/interviewService';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  Settings,
  PlusCircle,
  Loader2,
  Search,
  Bell
} from 'lucide-react';
import PostJobModal from '../components/recruiter/PostJobModal';

// Sub-sections
import OverviewSection from '../components/recruiter/OverviewSection';
import ManageJobsSection from '../components/recruiter/ManageJobsSection';
import ApplicationsSection from '../components/recruiter/ApplicationsSection';
import InterviewsSection from '../components/recruiter/InterviewsSection';

const RecruiterDashboardPage = () => {
  const userId = getUserId();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const companyRes = await getMyCompanyApi(userId!);
      if (companyRes.success) {
        setCompany(companyRes.data);
        const jobsRes = await getJobsByCompanyId(companyRes.data.id);
        if (jobsRes.success) {
          const fetchedJobs = jobsRes.data;
          setJobs(fetchedJobs);

          const appsRes = await getApplicationsByCompanyApi(companyRes.data.id);
          if (appsRes.success) {
            setAllApplications(appsRes.data);
          }

          const intvRes = await getInterviewsByCompanyApi(companyRes.data.id);
          if (intvRes.success) {
            setInterviews(intvRes.data);
          }
        }
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculated Stats for Overview
  const stats = {
    activeJobsCount: jobs.filter(j => j.status === 'Active').length,
    pendingApplicationsCount: allApplications.filter(a => a.status === 'Pending' || !a.status).length,
    approvedApplicationsCount: allApplications.filter(a => a.status === 'Approved').length,
    soonToExpireCount: jobs.filter(j => {
      const deadline = new Date(j.deadline);
      const today = new Date();
      const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 7;
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500 font-bold text-lg">Đang đồng bộ dữ liệu quản trị...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Welcome Section (Only show on Overview or minimized) */}
        {activeTab === 'overview' && (
          <section className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 mb-10 flex flex-col md:flex-row justify-between items-center gap-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[24px] bg-indigo-50 p-1 border-2 border-indigo-100 shadow-xl shadow-indigo-500/5">
                <img src={company?.logo ? (company.logo.startsWith('http') ? company.logo : `/images/${company.logo}`) : 'https://placehold.co/100x100?text=Logo'} alt="Logo" className="w-full h-full object-contain rounded-[20px]" />
              </div>
              <div>
                <h1 className="text-3xl font-black font-display text-gray-900 mb-2">Chào {company?.name}! 👋</h1>
                <p className="text-gray-500 font-bold">Chào mừng quay trở lại với trung tâm quản trị</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none h-14 w-14 bg-slate-50 text-gray-400 rounded-2xl flex items-center justify-center border border-slate-200/50 cursor-pointer hover:bg-slate-100 transition-colors"><Search size={20} /></button>
              <button className="flex-1 md:flex-none h-14 w-14 bg-slate-50 text-gray-400 rounded-2xl flex items-center justify-center border border-slate-200/50 cursor-pointer relative hover:bg-slate-100 transition-colors">
                <Bell size={20} />
                {stats.pendingApplicationsCount > 0 && <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></div>}
              </button>
              <button onClick={() => setIsPostJobModalOpen(true)} className="flex-1 md:flex-none h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1 cursor-pointer">
                <PlusCircle size={20} /> Đăng tin mới
              </button>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 sticky top-10">
              <div className="flex flex-col gap-2">
                <SidebarItem icon={<LayoutDashboard size={20} />} label="Tổng quan" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <SidebarItem icon={<Briefcase size={20} />} label="Tin tuyển dụng" isActive={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} badge={jobs.length} />
                <SidebarItem icon={<Users size={20} />} label="Ứng viên" isActive={activeTab === 'candidates'} onClick={() => setActiveTab('candidates')} badge={allApplications.length} />
                <SidebarItem icon={<Calendar size={20} />} label="Lịch phỏng vấn" isActive={activeTab === 'interviews'} onClick={() => setActiveTab('interviews')} badge={interviews.length} />
                <div className="h-px bg-slate-50 my-4 mx-4"></div>
                <SidebarItem icon={<Settings size={20} />} label="Cài đặt tài khoản" />
              </div>
            </div>
          </aside>

          {/* Dynamic Content Section */}
          <div className="lg:col-span-9">
            {activeTab === 'overview' && <OverviewSection jobs={jobs} allApplications={allApplications} stats={stats} onSwitchTab={setActiveTab} />}
            {activeTab === 'jobs' && (
              <ManageJobsSection 
                jobs={jobs} 
                allApplications={allApplications}
                refreshData={fetchDashboardData} 
                onOpenPostJob={() => setIsPostJobModalOpen(true)}
                userId={userId!}
                companyId={company.id}
              />
            )}
            {activeTab === 'candidates' && <ApplicationsSection jobs={jobs} allApplications={allApplications} refreshData={fetchDashboardData} />}
            {activeTab === 'interviews' && <InterviewsSection interviews={interviews} refreshData={fetchDashboardData} />}
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
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};

const SidebarItem = ({ icon, label, isActive, onClick, badge }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group cursor-pointer ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-gray-500 hover:bg-slate-50 hover:text-indigo-600'}`}>
    <div className="flex items-center gap-4">
      <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'} transition-colors`}>{icon}</span>
      <span className="font-black text-[15px]">{label}</span>
    </div>
    {badge !== undefined && badge > 0 && (
      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-gray-500 group-hover:bg-indigo-50'} transition-colors`}>
        {badge}
      </span>
    )}
  </button>
);

export default RecruiterDashboardPage;
