import { useState, useEffect, useRef } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import {
  Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap,
  PenLine, Camera, ExternalLink, Download, Loader2, X
} from 'lucide-react';
import { getCVByUserId, uploadAvatar, updateCVDetail } from '../services/cvService';
import { getUserId } from '../services/authService';
import type { CV } from '../types/cv';

const ProfilePage = () => {
  const [cvData, setCvData] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modals State
  const [isSaving, setIsSaving] = useState(false);
  
  // Basic Info
  const [isBasicInfoModalOpen, setIsBasicInfoModalOpen] = useState(false);
  const [draftBasicInfo, setDraftBasicInfo] = useState<Partial<CV>>({});

  // About Me
  const [isAboutMeModalOpen, setIsAboutMeModalOpen] = useState(false);
  const [draftAboutMe, setDraftAboutMe] = useState('');

  // Experience
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [draftExperiences, setDraftExperiences] = useState<CV['experiences']>([]);

  // Education
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [draftEducations, setDraftEducations] = useState<CV['educations']>([]);

  // Skills
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [draftSkills, setDraftSkills] = useState<CV['skills']>([]);

  // Avatar upload state
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsAvatarModalOpen(true);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const userId = getUserId();
      if (!userId) return;

      const response = await uploadAvatar(userId, selectedFile);
      if (response.success && response.data) {
        setCvData(prev => prev ? { ...prev, avatar: response.data as string } : prev);
        window.dispatchEvent(new Event('avatarUpdated'));
        closeAvatarModal();
      } else {
        alert('Lỗi tải ảnh: ' + response.message);
      }
    } catch (err: any) {
      alert('Đã xảy ra lỗi khi tải ảnh lên.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSection = async (dataToUpdate: Partial<CV>, closeAction: () => void) => {
    if (!cvData) return;
    const userId = getUserId();
    if (!userId) return;

    setIsSaving(true);
    try {
      const updatedCv = { ...cvData, ...dataToUpdate };

      // Clean empty string dates to null to prevent ASP.NET Core binding errors
      const sanitizeDate = (dateVal: any) => dateVal === '' ? null : dateVal;
      
      const payload: any = {
        ...updatedCv,
        dateOfBirth: sanitizeDate(updatedCv.dateOfBirth),
        uploadDate: sanitizeDate(updatedCv.uploadDate),
        experiences: updatedCv.experiences?.map(exp => ({
          ...exp,
          startDate: sanitizeDate(exp.startDate),
          endDate: sanitizeDate(exp.endDate)
        })),
        educations: updatedCv.educations?.map(edu => ({
          ...edu,
          startDate: sanitizeDate(edu.startDate),
          endDate: sanitizeDate(edu.endDate)
        }))
      };

      const response = await updateCVDetail(userId, payload);
      if (response.success) {
        setCvData(payload);
        closeAction();
      } else {
        alert('Lỗi cập nhật: ' + response.message);
      }
    } catch (err: any) {
      console.error("Lỗi cập nhật API:", err.response?.data || err);
      const backendMessage = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.message;
      alert('Đã xảy ra lỗi khi cập nhật hồ sơ: ' + (backendMessage || err.message || 'Lỗi không xác định'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAboutMe = () => handleSaveSection({ aboutMe: draftAboutMe }, () => setIsAboutMeModalOpen(false));
  const handleSaveBasicInfo = () => handleSaveSection(draftBasicInfo, () => setIsBasicInfoModalOpen(false));
  const handleSaveExperiences = () => handleSaveSection({ experiences: draftExperiences }, () => setIsExperienceModalOpen(false));
  const handleSaveEducations = () => handleSaveSection({ educations: draftEducations }, () => setIsEducationModalOpen(false));
  const handleSaveSkills = () => handleSaveSection({ skills: draftSkills }, () => setIsSkillsModalOpen(false));
  useEffect(() => {
    if (error) {
      console.error("ProfilePage error:", error);
    }
  }, [error]);

  // Removed mock user data, now using cvData directly
  useEffect(() => {
    const fetchCV = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          setError('Vui lòng đăng nhập để xem hồ sơ');
          setLoading(false);
          return;
        }

        const response = await getCVByUserId(userId);
        if (response.success && response.data) {
          setCvData(response.data);
        } else {
          setError(response.message || 'Không tìm thấy hồ sơ CV');
        }
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi tải hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Hiện tại';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />
        <main className="flex-1 w-full flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = cvData?.fullName || cvData?.title?.split(' - ')[1] || 'Ứng viên';
  const displayTitle = cvData?.title?.split(' - ')[0] || 'Chưa cập nhật chức danh';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 w-full flex flex-col pb-20">

        {/* Banner Headers (Giống HeroSection) */}
        <section className="relative w-full h-[320px]">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2669&ixlib=rb-4.0.3")', // Office background placeholder
            }}
          >
            {/* Overlay Gradient (Slate-900 + Purple tint) */}
            <div className="absolute inset-0 bg-slate-900/90 mix-blend-multiply" />
            <div className="absolute inset-0 bg-linear-to-r from-purple-900/40 to-blue-900/40" />
          </div>

          <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center pt-8">
            <h1 className="text-3xl md:text-5xl font-black font-display text-white tracking-tight leading-tight mb-[40px]">
              Hồ sơ <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">Cá nhân</span>
            </h1>
          </div>
        </section>

        {/* Profile Content Container (Overlapping the Banner) */}
        <div className="relative z-20 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-[120px]">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT COLUMN: User Summary & Actions */}
            <div className="lg:col-span-4 lg:col-start-1 flex flex-col gap-6">

              {/* Profile Card */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center group relative">
                <button 
                  onClick={() => {
                    setDraftBasicInfo({
                      fullName: cvData?.fullName || '',
                      title: cvData?.title || '',
                      phone: cvData?.phone || '',
                      address: cvData?.address || '',
                      dateOfBirth: cvData?.dateOfBirth || '',
                      github: cvData?.github || '',
                      linkedIn: cvData?.linkedIn || '',
                      website: cvData?.website || ''
                    });
                    setIsBasicInfoModalOpen(true);
                  }}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer lg:opacity-0 lg:group-hover:opacity-100 z-10"
                >
                  <PenLine size={18} />
                </button>

                {/* Avatar with floating edit button */}
                <div className="relative mb-5 group">
                  <div className="w-32 h-32 rounded-full p-1 bg-white border-2 border-indigo-100 shadow-md">
                    <img
                      src={`/images/avatar/${cvData?.avatar}` || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256'}
                      alt={displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 w-9 h-9 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Camera size={16} />
                  </button>
                </div>

                <h2 className="text-2xl font-black font-display text-gray-900 mb-1 leading-tight">{displayName} {cvData?.gender === 'Nam' ? '♂️' : cvData?.gender === 'Nữ' ? '♀️' : 'Khác'}</h2>
                <p className="text-[15px] font-medium text-indigo-600 mb-5">{displayTitle}</p>

                <div className="w-full flex gap-3 mb-6">
                  <button className="flex-1 bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer">
                    <Download size={16} />
                    Tải CV
                  </button>
                  <button className="w-11 h-11 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center transition-colors border border-gray-200 cursor-pointer text-sm font-bold">
                    Share
                  </button>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-100 mb-6"></div>

                {/* Contact Info List */}
                <div className="w-full flex flex-col gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Mail size={16} />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email</span>
                      <span className="text-sm font-semibold text-gray-800 truncate">{cvData?.email || 'Chưa cập nhật'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Phone size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Điện thoại</span>
                      <span className="text-sm font-semibold text-gray-800">{cvData?.phone || 'Chưa cập nhật'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div className="flex flex-col w-full">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Địa điểm</span>
                      <span className="text-sm font-semibold text-gray-800">{cvData?.address || 'Chưa cập nhật'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div className="flex flex-col w-full">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ngày sinh</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {cvData?.dateOfBirth ? new Date(cvData.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="w-full mt-6 pt-5 border-t border-gray-100 flex gap-3 justify-center">
                  <a href={cvData?.github || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-all text-xs font-bold">
                    GH
                  </a>
                  <a href={cvData?.linkedIn || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all text-xs font-bold">
                    IN
                  </a>
                  <a href={cvData?.website || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-purple-600 hover:border-purple-600 hover:bg-purple-50 flex items-center justify-center transition-all">
                    <ExternalLink size={18} />
                  </a>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Main Content Sections */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* Introduction Section */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 group relative">
                <button 
                  onClick={() => {
                    setDraftAboutMe(cvData?.aboutMe || '');
                    setIsAboutMeModalOpen(true);
                  }}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <PenLine size={18} />
                </button>
                <h3 className="text-xl font-bold font-display text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-2 h-6 bg-linear-to-b from-purple-500 to-blue-500 rounded-full"></div>
                  Giới thiệu bản thân
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {cvData?.aboutMe || 'Chưa có thông tin giới thiệu bản thân.'}
                </p>
              </div>

              {/* Experience Section */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 group relative">
                <button 
                  onClick={() => {
                    setDraftExperiences(cvData?.experiences || []);
                    setIsExperienceModalOpen(true);
                  }}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer lg:opacity-0 lg:group-hover:opacity-100 z-10"
                >
                  <PenLine size={18} />
                </button>
                <h3 className="text-xl font-bold font-display text-gray-900 mb-6 pb-2 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-2 h-6 bg-linear-to-b from-indigo-500 to-blue-500 rounded-full"></div>
                  Kinh nghiệm làm việc
                </h3>

                <div className="flex flex-col gap-8 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[20px] top-2 bottom-2 w-px bg-gray-200"></div>

                  {cvData?.experiences && cvData.experiences.length > 0 ? cvData.experiences.map((exp) => (
                    <div key={exp.id} className="flex gap-5 relative group/item">
                      {/* Timeline Dot */}
                      <div className="w-10 h-10 rounded-full bg-white border-4 border-indigo-100 shadow-sm flex items-center justify-center shrink-0 z-10 group-hover/item:border-indigo-200 transition-colors">
                        <div className="w-3 h-3 rounded-full bg-linear-to-r from-purple-500 to-blue-500"></div>
                      </div>

                      <div className="flex flex-col pt-1">
                        <span className="text-[13px] font-bold text-indigo-500 mb-1 uppercase tracking-wider">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                        <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                        <div className="text-[15px] font-semibold text-gray-600 flex items-center gap-2 mb-3">
                          <Briefcase size={14} className="text-gray-400" />
                          {exp.companyName}
                        </div>
                        <p className="text-[14px] text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">Chưa có kinh nghiệm làm việc.</p>
                  )}
                </div>
              </div>

              {/* Education & Skills Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                {/* Education Section */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 group relative">
                  <button 
                    onClick={() => {
                      setDraftEducations(cvData?.educations || []);
                      setIsEducationModalOpen(true);
                    }}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer lg:opacity-0 lg:group-hover:opacity-100 z-10"
                  >
                    <PenLine size={18} />
                  </button>
                  <h3 className="text-xl font-bold font-display text-gray-900 mb-6 pb-2 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-2 h-6 bg-linear-to-b from-blue-400 to-teal-400 rounded-full"></div>
                    Học vấn
                  </h3>

                  <div className="flex flex-col gap-6">
                    {cvData?.educations && cvData.educations.length > 0 ? cvData.educations.map(edu => (
                      <div key={edu.id} className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <GraduationCap size={24} />
                        </div>
                        <div className="flex flex-col pt-1">
                          <span className="text-[12px] font-bold text-blue-500 mb-0.5 uppercase tracking-wider">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                          <h4 className="text-base font-bold text-gray-900 leading-tight mb-1">{edu.major}</h4>
                          <span className="text-[14px] font-medium text-gray-600">{edu.schoolName}</span>
                          {edu.description && <span className="text-[13px] text-gray-500 mt-1">{edu.description}</span>}
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-4">Chưa có thông tin học vấn.</p>
                    )}
                  </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 group relative">
                  <button 
                    onClick={() => {
                      setDraftSkills(cvData?.skills || []);
                      setIsSkillsModalOpen(true);
                    }}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer lg:opacity-0 lg:group-hover:opacity-100 z-10"
                  >
                    <PenLine size={18} />
                  </button>
                  <h3 className="text-xl font-bold font-display text-gray-900 mb-6 pb-2 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-2 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    Kỹ năng
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {cvData?.skills && cvData.skills.length > 0 ? cvData.skills.map(skill => (
                      <span
                        key={skill.id}
                        className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition-colors cursor-default"
                        title={`Mức độ: ${skill.level}`}
                      >
                        {skill.skillName}
                      </span>
                    )) : (
                      <p className="text-gray-500 py-2">Chưa có thông tin kỹ năng.</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </main>

      {/* Upload Avatar Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 font-display">Cập nhật ảnh đại diện</h3>
              <button
                onClick={closeAvatarModal}
                disabled={isUploading}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-6 text-center">
                Vui lòng căn chỉnh hình ảnh sao cho khuôn mặt nằm ở vị trí trung tâm để có kết quả tốt nhất.
              </p>

              <div className="w-40 h-40 rounded-full border-4 border-indigo-50 shadow-lg overflow-hidden mb-6 bg-gray-50">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Camera size={40} />
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end">
              <button
                onClick={closeAvatarModal}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleUploadAvatar}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info Edit Modal */}
      {isBasicInfoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto py-10">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-900 font-display">Thông tin cá nhân</h3>
              <button onClick={() => setIsBasicInfoModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
                <input type="text" value={draftBasicInfo.fullName || ''} onChange={e => setDraftBasicInfo({...draftBasicInfo, fullName: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Chức danh</label>
                <input type="text" value={draftBasicInfo.title || ''} onChange={e => setDraftBasicInfo({...draftBasicInfo, title: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Ngày sinh</label>
                <input type="date" value={draftBasicInfo.dateOfBirth ? new Date(draftBasicInfo.dateOfBirth).toISOString().split('T')[0] : ''} onChange={e => setDraftBasicInfo({...draftBasicInfo, dateOfBirth: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
                <input type="text" value={draftBasicInfo.phone || ''} onChange={e => setDraftBasicInfo({...draftBasicInfo, phone: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Địa chỉ</label>
                <input type="text" value={draftBasicInfo.address || ''} onChange={e => setDraftBasicInfo({...draftBasicInfo, address: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2 mt-2">
                <h4 className="font-semibold text-gray-800 border-b pb-2 mb-2">Liên kết mạng xã hội</h4>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">GitHub</label>
                <input type="text" value={draftBasicInfo.github || ''} onChange={e => setDraftBasicInfo({...draftBasicInfo, github: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="https://github.com/..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">LinkedIn</label>
                <input type="text" value={draftBasicInfo.linkedIn || ''} onChange={e => setDraftBasicInfo({...draftBasicInfo, linkedIn: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Website cá nhân</label>
                <input type="text" value={draftBasicInfo.website || ''} onChange={e => setDraftBasicInfo({...draftBasicInfo, website: e.target.value})} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="https://..." />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end sticky bottom-0 z-10">
              <button onClick={() => setIsBasicInfoModalOpen(false)} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer">Hủy bỏ</button>
              <button onClick={handleSaveBasicInfo} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2">
                {isSaving ? <><Loader2 size={16} className="animate-spin" />Đang lưu...</> : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Me Edit Modal */}
      {isAboutMeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 font-display">Giới thiệu bản thân</h3>
              <button
                onClick={() => setIsAboutMeModalOpen(false)}
                disabled={isSaving}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Thông tin giới thiệu</label>
              <textarea
                value={draftAboutMe}
                onChange={(e) => setDraftAboutMe(e.target.value)}
                placeholder="Viết vài dòng giới thiệu về bản thân, kinh nghiệm và mục tiêu nghề nghiệp của bạn..."
                className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl text-gray-800 text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end">
              <button
                onClick={() => setIsAboutMeModalOpen(false)}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveAboutMe}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Experience Edit Modal */}
      {isExperienceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto py-10">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-900 font-display">Kinh nghiệm làm việc</h3>
              <button onClick={() => setIsExperienceModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto bg-gray-50/30">
              {draftExperiences.map((exp, index) => (
                <div key={exp.id || index} className="bg-white p-5 border border-gray-200 rounded-xl relative shadow-sm">
                  <button 
                    onClick={() => setDraftExperiences(draftExperiences.filter((_, i) => i !== index))}
                    className="absolute top-5 right-5 text-gray-400 hover:text-red-500 p-1 bg-gray-50 rounded-md transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Công ty</label>
                      <input type="text" value={exp.companyName || ''} onChange={e => { const newExp = [...draftExperiences]; newExp[index].companyName = e.target.value; setDraftExperiences(newExp); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Vị trí / Chức vụ</label>
                      <input type="text" value={exp.position || ''} onChange={e => { const newExp = [...draftExperiences]; newExp[index].position = e.target.value; setDraftExperiences(newExp); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-gray-700">Từ ngày</label>
                      <input type="date" value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} onChange={e => { const newExp = [...draftExperiences]; newExp[index].startDate = e.target.value; setDraftExperiences(newExp); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-gray-700">Đến ngày</label>
                      <input type="date" value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''} onChange={e => { const newExp = [...draftExperiences]; newExp[index].endDate = e.target.value || null; setDraftExperiences(newExp); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Mô tả công việc</label>
                      <textarea value={exp.description || ''} onChange={e => { const newExp = [...draftExperiences]; newExp[index].description = e.target.value; setDraftExperiences(newExp); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-24 resize-none" />
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => setDraftExperiences([...draftExperiences, { id: crypto.randomUUID(), cvId: cvData?.id || '00000000-0000-0000-0000-000000000000', companyName: '', position: '', startDate: '', endDate: null, description: '' }])} 
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                + Thêm kinh nghiệm làm việc
              </button>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end sticky bottom-0 z-10">
              <button onClick={() => setIsExperienceModalOpen(false)} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer">Hủy bỏ</button>
              <button onClick={handleSaveExperiences} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2">
                {isSaving ? <><Loader2 size={16} className="animate-spin" />Đang lưu...</> : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Education Edit Modal */}
      {isEducationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto py-10">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-900 font-display">Học vấn</h3>
              <button onClick={() => setIsEducationModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto bg-gray-50/30">
              {draftEducations.map((edu, index) => (
                <div key={edu.id || index} className="bg-white p-5 border border-gray-200 rounded-xl relative shadow-sm">
                  <button 
                    onClick={() => setDraftEducations(draftEducations.filter((_, i) => i !== index))}
                    className="absolute top-5 right-5 text-gray-400 hover:text-red-500 p-1 bg-gray-50 rounded-md transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Trường</label>
                      <input type="text" value={edu.schoolName || ''} onChange={e => { const newEdu = [...draftEducations]; newEdu[index].schoolName = e.target.value; setDraftEducations(newEdu); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Chuyên ngành</label>
                      <input type="text" value={edu.major || ''} onChange={e => { const newEdu = [...draftEducations]; newEdu[index].major = e.target.value; setDraftEducations(newEdu); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-gray-700">Từ ngày</label>
                      <input type="date" value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''} onChange={e => { const newEdu = [...draftEducations]; newEdu[index].startDate = e.target.value; setDraftEducations(newEdu); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-gray-700">Đến ngày</label>
                      <input type="date" value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''} onChange={e => { const newEdu = [...draftEducations]; newEdu[index].endDate = e.target.value; setDraftEducations(newEdu); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Mô tả thêm</label>
                      <textarea value={edu.description || ''} onChange={e => { const newEdu = [...draftEducations]; newEdu[index].description = e.target.value; setDraftEducations(newEdu); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-20 resize-none" />
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => setDraftEducations([...draftEducations, { id: crypto.randomUUID(), cvId: cvData?.id || '00000000-0000-0000-0000-000000000000', schoolName: '', major: '', startDate: '', endDate: '', description: '' }])} 
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                + Thêm học vấn
              </button>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end sticky bottom-0 z-10">
              <button onClick={() => setIsEducationModalOpen(false)} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer">Hủy bỏ</button>
              <button onClick={handleSaveEducations} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2">
                {isSaving ? <><Loader2 size={16} className="animate-spin" />Đang lưu...</> : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skills Edit Modal */}
      {isSkillsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto py-10">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-900 font-display">Kỹ năng</h3>
              <button onClick={() => setIsSkillsModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              {draftSkills.map((skill, index) => (
                <div key={skill.id || index} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input type="text" placeholder="Tên kỹ năng (VD: React, Tiếng Anh)" value={skill.skillName || ''} onChange={e => { const newSkills = [...draftSkills]; newSkills[index].skillName = e.target.value; setDraftSkills(newSkills); }} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                  <div className="w-1/3">
                    <select value={skill.level || 'Cơ bản'} onChange={e => { const newSkills = [...draftSkills]; newSkills[index].level = e.target.value; setDraftSkills(newSkills); }} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer">
                      <option value="Cơ bản">Cơ bản</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Khá">Khá</option>
                      <option value="Tốt">Tốt</option>
                      <option value="Xuất sắc">Xuất sắc</option>
                    </select>
                  </div>
                  <button onClick={() => setDraftSkills(draftSkills.filter((_, i) => i !== index))} className="text-gray-400 hover:text-red-500 p-2 bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <X size={18} />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => setDraftSkills([...draftSkills, { id: crypto.randomUUID(), cvId: cvData?.id || '00000000-0000-0000-0000-000000000000', skillName: '', level: 'Cơ bản' }])} 
                className="w-full py-3 mt-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                + Thêm kỹ năng
              </button>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end sticky bottom-0 z-10">
              <button onClick={() => setIsSkillsModalOpen(false)} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer">Hủy bỏ</button>
              <button onClick={handleSaveSkills} disabled={isSaving} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 shadow-sm shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2">
                {isSaving ? <><Loader2 size={16} className="animate-spin" />Đang lưu...</> : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProfilePage;
