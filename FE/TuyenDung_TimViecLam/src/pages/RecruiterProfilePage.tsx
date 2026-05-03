import { useState, useEffect, useRef } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { getUserId } from '../services/authService';
import {
  getMyCompanyApi,
  updateCompanyApi,
  uploadCompanyLogoApi,
  uploadCompanyCoverApi,
  type Company
} from '../services/companyService';
import { getJobsByCompanyId } from '../services/jobService';
import {
  MapPin, Users, Globe, Mail, Phone,
  ExternalLink, AlertCircle, Briefcase, CheckCircle2,
  ChevronRight, Edit3, Save, X, Loader2, Camera, Award, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RecruiterProfilePage = () => {
  const userId = getUserId();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Company | null>(null);
  const [saving, setSaving] = useState(false);

  // Logo upload state
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Cover upload state
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userId) {
      fetchCompanyData();
    }
  }, [userId]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const res = await getMyCompanyApi(userId!);
      if (res.success) {
        setCompany(res.data);
        setEditForm(res.data);
        // Fetch jobs for this company
        const jobsRes = await getJobsByCompanyId(res.data.id);
        if (jobsRes.success) {
          setJobs(jobsRes.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch company data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditForm(company);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(company);
  };

  const handleSave = async () => {
    if (!editForm) return;
    try {
      setSaving(true);
      const res = await updateCompanyApi(editForm);
      if (res.success) {
        setCompany(editForm);
        setIsEditing(false);
      } else {
        alert(res.message);
      }
    } catch (error: any) {
      alert(error.message || "Lỗi khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Image Upload Handlers
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedLogoFile(file);
      setLogoPreviewUrl(URL.createObjectURL(file));
      setIsLogoModalOpen(true);
    }
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedCoverFile(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
      setIsCoverModalOpen(true);
    }
  };

  const closeLogoModal = () => {
    setIsLogoModalOpen(false);
    setSelectedLogoFile(null);
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogoPreviewUrl(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const closeCoverModal = () => {
    setIsCoverModalOpen(false);
    setSelectedCoverFile(null);
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverPreviewUrl(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const handleUploadLogo = async () => {
    if (!selectedLogoFile || !company) {
      console.log("Missing file or company", { selectedLogoFile, company });
      return;
    }
    setIsUploadingLogo(true);
    try {
      console.log("Uploading logo for company:", company.id);
      const res = await uploadCompanyLogoApi(company.id, selectedLogoFile);
      console.log("Upload logo response:", res);
      if (res.success) {
        setCompany(prev => prev ? { ...prev, logo: res.data } : null);
        setEditForm(prev => prev ? { ...prev, logo: res.data } : null);
        closeLogoModal();
      } else {
        alert(res.message);
      }
    } catch (error: any) {
      console.error("Upload logo error:", error);
      alert("Lỗi khi tải logo: " + error.message);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleUploadCover = async () => {
    if (!selectedCoverFile || !company) {
      console.log("Missing cover file or company", { selectedCoverFile, company });
      return;
    }
    setIsUploadingCover(true);
    try {
      console.log("Uploading cover for company:", company.id);
      const res = await uploadCompanyCoverApi(company.id, selectedCoverFile);
      console.log("Upload cover response:", res);
      if (res.success) {
        setCompany(prev => prev ? { ...prev, cover: res.data } : null);
        setEditForm(prev => prev ? { ...prev, cover: res.data } : null);
        closeCoverModal();
      } else {
        alert(res.message);
      }
    } catch (error: any) {
      console.error("Upload cover error:", error);
      alert("Lỗi khi tải ảnh bìa: " + error.message);
    } finally {
      setIsUploadingCover(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500 font-bold text-lg">Đang tải hồ sơ công ty...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Không tìm thấy thông tin công ty</h2>
          <p className="text-gray-500 mb-8 text-center max-w-md">Vui lòng liên hệ quản trị viên hoặc kiểm tra lại tài khoản nhà tuyển dụng của bạn.</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">Thử lại</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 w-full flex flex-col pb-20">
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={logoInputRef}
          onChange={handleLogoChange}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={coverInputRef}
          onChange={handleCoverChange}
          accept="image/*"
          className="hidden"
        />

        {/* Cover Photo */}
        <section className="relative w-full h-[350px] md:h-[450px]">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${company.cover ? (company.cover.startsWith('http') ? company.cover : `/images/${company.cover}`) : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070'})` }}
          >
            <div className="absolute inset-0 bg-slate-900/40" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 to-transparent" />
          </div>

          {isEditing && (
            <button
              onClick={() => {
                console.log("Cover input clicked");
                coverInputRef.current?.click();
              }}
              className="absolute bottom-8 right-8 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-white/30 transition-all cursor-pointer"
            >
              <Camera size={20} />
              Thay đổi ảnh bìa
            </button>
          )}
        </section>

        {/* Floating Content Area */}
        <div className="relative z-20 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-[100px]">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT COLUMN: Company Info */}
            <div className="lg:col-span-4 lg:col-start-1 flex flex-col gap-6">

              <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col items-center sm:items-start text-center sm:text-left">

                {/* Logo */}
                <div className="w-40 h-40 rounded-[32px] p-4 bg-white border border-gray-100 shadow-xl -mt-24 mb-6 shrink-0 relative flex items-center justify-center overflow-hidden group">
                  <img
                    src={company.logo ? (company.logo.startsWith('http') ? company.logo : `/images/${company.logo}`) : 'https://placehold.co/200x200?text=Logo'}
                    alt={company.name}
                    className="w-full h-full object-contain"
                  />
                  {isEditing && (
                    <div
                      onClick={() => {
                        console.log("Logo input clicked");
                        logoInputRef.current?.click();
                      }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera size={32} className="text-white" />
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="w-full space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Tên công ty</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm?.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Ngành nghề</label>
                      <input
                        type="text"
                        name="industry"
                        value={editForm?.industry || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl md:text-4xl font-black font-display text-gray-900 mb-2 leading-tight">{company.name}</h1>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-[15px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">{company.industry || 'Lĩnh vực công nghệ'}</span>
                      {company.isVerified && <CheckCircle2 size={20} className="text-blue-500" />}
                    </div>
                  </>
                )}

                <div className="w-full flex gap-3 mb-8 mt-5">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-base font-black shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                      >
                        {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Lưu thay đổi
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-16 h-16 bg-white hover:bg-slate-50 text-gray-600 rounded-2xl flex items-center justify-center transition-colors border-2 border-gray-100 cursor-pointer"
                      >
                        <X size={24} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl text-base font-black shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-1"
                    >
                      <Edit3 size={20} />
                      Chỉnh sửa hồ sơ
                    </button>
                  )}
                </div>

                <div className="w-full h-px bg-slate-100 mb-8"></div>

                {/* Company Details List */}
                <div className="w-full flex flex-col gap-6 text-left">
                  <DetailItem
                    icon={<Users size={20} className="text-indigo-500" />}
                    label="Quy mô"
                    value={company.size || '50-100 nhân viên'}
                    isEditing={isEditing}
                    name="size"
                    editValue={editForm?.size}
                    onChange={handleChange}
                  />
                  <DetailItem
                    icon={<Globe size={20} className="text-indigo-500" />}
                    label="Website"
                    value={company.website || 'https://vng.com.vn'}
                    isEditing={isEditing}
                    name="website"
                    editValue={editForm?.website}
                    onChange={handleChange}
                    isLink
                  />
                  <DetailItem
                    icon={<Mail size={20} className="text-indigo-500" />}
                    label="Email liên hệ"
                    value={company.email || 'hr@company.com'}
                    isEditing={isEditing}
                    name="email"
                    editValue={editForm?.email}
                    onChange={handleChange}
                  />
                  <DetailItem
                    icon={<Phone size={20} className="text-indigo-500" />}
                    label="Số điện thoại"
                    value={company.phone || '028 1234 5678'}
                    isEditing={isEditing}
                    name="phone"
                    editValue={editForm?.phone}
                    onChange={handleChange}
                  />
                  <DetailItem
                    icon={<MapPin size={20} className="text-indigo-500" />}
                    label="Trụ sở chính"
                    value={company.address || 'Quận 7, TP. HCM'}
                    isEditing={isEditing}
                    name="address"
                    editValue={editForm?.address}
                    onChange={handleChange}
                    isTextArea
                  />
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: About & Jobs */}
            <div className="lg:col-span-8 flex flex-col gap-8">

              {/* About Section */}
              <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 relative">
                <div className="absolute top-8 right-8">
                  <Sparkles className="text-indigo-200" size={32} />
                </div>

                <h3 className="text-2xl font-black font-display text-gray-900 mb-8 pb-2 flex items-center gap-3">
                  <div className="w-2.5 h-8 bg-linear-to-b from-indigo-500 to-blue-500 rounded-full"></div>
                  Giới thiệu công ty
                </h3>

                {isEditing ? (
                  <textarea
                    name="description"
                    value={editForm?.description || ''}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Viết vài dòng giới thiệu về sứ mệnh và giá trị của công ty..."
                    className="w-full px-6 py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-gray-700 leading-relaxed"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed text-lg mb-10 italic">
                    "{company.description || 'Chưa có thông tin giới thiệu cho công ty này.'}"
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                  {/* Culture */}
                  <div className="bg-slate-50/50 p-6 rounded-[24px] border border-slate-100">
                    <h4 className="font-black text-gray-900 mb-5 flex items-center gap-3 uppercase tracking-wider text-sm">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                        <CheckCircle2 size={18} />
                      </div>
                      Văn hóa nổi bật
                    </h4>
                    {isEditing ? (
                      <textarea
                        name="culture"
                        value={editForm?.culture || ''}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Mô tả văn hóa làm việc (ví dụ: Năng động, Cởi mở...)"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                      />
                    ) : (
                      <p className="text-gray-600 leading-relaxed text-sm font-medium">
                        {company.culture || 'Đang cập nhật...'}
                      </p>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="bg-purple-50/30 p-6 rounded-[24px] border border-purple-100/50">
                    <h4 className="font-black text-gray-900 mb-5 flex items-center gap-3 uppercase tracking-wider text-sm">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                        <Award size={18} />
                      </div>
                      Phúc lợi nhân viên
                    </h4>
                    {isEditing ? (
                      <textarea
                        name="benefits"
                        value={editForm?.benefits || ''}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Các phúc lợi (ví dụ: Bảo hiểm, Thưởng, Du lịch...)"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                      />
                    ) : (
                      <p className="text-gray-600 leading-relaxed text-sm font-medium">
                        {company.benefits || 'Đang cập nhật...'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Jobs Section */}
              <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black font-display text-gray-900 flex items-center gap-3">
                    <div className="w-2.5 h-8 bg-linear-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                    Tin tuyển dụng đang bật ({jobs.length})
                  </h3>
                  <Link to="/recruiter/jobs" className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
                    Quản lý tin
                    <ChevronRight size={16} />
                  </Link>
                </div>

                {jobs.length === 0 ? (
                  <div className="py-20 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                    <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold text-lg">Công ty chưa đăng tin tuyển dụng nào</p>
                    <button className="mt-4 text-indigo-600 font-black hover:underline cursor-pointer">Đăng tin ngay</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map(job => (
                      <Link
                        key={job.id}
                        to={`/jobs/${job.id}`}
                        className="group p-6 rounded-[24px] border border-gray-100 bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-600/5 transition-all relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-indigo-50/50 to-transparent rounded-bl-full group-hover:scale-150 transition-transform duration-500" />

                        <div className="relative z-10">
                          <h4 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors mb-3 line-clamp-1">{job.title}</h4>
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-bold text-gray-400">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
                              <Briefcase size={12} /> {job.jobTypeName}
                            </span>
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
                              <MapPin size={12} /> {job.locationName}
                            </span>
                          </div>
                          <div className="mt-5 pt-5 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-indigo-600 font-black text-sm">
                              {job.minSalary && job.maxSalary ? `$${job.minSalary} - $${job.maxSalary}` : 'Thỏa thuận'}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              <ChevronRight size={16} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Upload Logo Modal */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 font-display">Cập nhật logo công ty</h3>
              <button onClick={closeLogoModal} disabled={isUploadingLogo} className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-6 text-center">Logo sẽ hiển thị trên các tin tuyển dụng và hồ sơ công ty.</p>
              <div className="w-40 h-40 rounded-[32px] border-4 border-indigo-50 shadow-lg overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-4">
                {logoPreviewUrl ? (
                  <img src={logoPreviewUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                ) : (
                  <Camera size={40} className="text-gray-300" />
                )}
              </div>
              <button
                onClick={() => logoInputRef.current?.click()}
                className="mb-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors cursor-pointer"
              >
                Chọn ảnh khác
              </button>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end">
              <button onClick={closeLogoModal} disabled={isUploadingLogo} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">Hủy bỏ</button>
              <button onClick={handleUploadLogo} disabled={isUploadingLogo} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2">
                {isUploadingLogo ? <><Loader2 size={16} className="animate-spin" /> Đang lưu...</> : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Cover Modal */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 font-display">Cập nhật ảnh bìa</h3>
              <button onClick={closeCoverModal} disabled={isUploadingCover} className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-6">Ảnh bìa giúp hồ sơ công ty chuyên nghiệp hơn. Khuyên dùng ảnh phong cảnh hoặc văn phòng.</p>
              <div className="w-full aspect-video rounded-2xl border-4 border-indigo-50 shadow-lg overflow-hidden bg-gray-50">
                {coverPreviewUrl ? (
                  <img src={coverPreviewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={48} className="text-gray-300" />
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                >
                  Chọn ảnh khác
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end">
              <button onClick={closeCoverModal} disabled={isUploadingCover} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">Hủy bỏ</button>
              <button onClick={handleUploadCover} disabled={isUploadingCover} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2">
                {isUploadingCover ? <><Loader2 size={16} className="animate-spin" /> Đang lưu...</> : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing: boolean;
  name: string;
  editValue?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isLink?: boolean;
  isTextArea?: boolean;
}

const DetailItem = ({ icon, label, value, isEditing, name, editValue, onChange, isLink, isTextArea }: DetailItemProps) => (
  <div className="flex items-start gap-4 group">
    <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <div className="flex flex-col flex-1 min-w-0">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</span>
      {isEditing ? (
        isTextArea ? (
          <textarea
            name={name}
            value={editValue || ''}
            onChange={onChange}
            className="w-full px-4 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
            rows={2}
          />
        ) : (
          <input
            type="text"
            name={name}
            value={editValue || ''}
            onChange={onChange}
            className="w-full px-4 py-2 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
          />
        )
      ) : (
        isLink ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-[15px] font-black text-indigo-600 hover:underline flex items-center gap-1 truncate">
            {value.replace(/^https?:\/\//, '')}
            <ExternalLink size={12} />
          </a>
        ) : (
          <span className="text-[15px] font-black text-gray-900 truncate leading-tight">{value}</span>
        )
      )}
    </div>
  </div>
);

export default RecruiterProfilePage;
