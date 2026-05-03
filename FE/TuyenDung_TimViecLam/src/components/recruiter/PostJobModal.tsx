import React, { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  Loader2,
  Edit,
  Briefcase,
  MapPin,
  Target,
  DollarSign,
  Calendar,
  FileText,
  Clock
} from 'lucide-react';
import {
  getCategories,
  getLocations,
  getLevels,
  getExperiences,
  getJobTypes,
  createJobApi,
  updateJobApi
} from '../../services/jobService';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  companyId: string;
  onSuccess?: () => void;
  jobToEdit?: any;
}

const PostJobModal = ({ isOpen, onClose, userId, companyId, onSuccess, jobToEdit }: PostJobModalProps) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Metadata states
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    locationId: '',
    jobTypeId: '',
    levelId: '',
    experienceId: '',
    minSalary: 0,
    maxSalary: 0,
    quantity: 1,
    deadline: '',
    description: '',
    requirement: '',
    benefit: '',
    status: 'Active'
  });

  useEffect(() => {
    if (isOpen && jobToEdit) {
      // Flexible key finder (case-insensitive)
      const findVal = (obj: any, targetKey: string) => {
        if (!obj) return null;
        const keys = Object.keys(obj);
        const foundKey = keys.find(k => k.toLowerCase() === targetKey.toLowerCase());
        return foundKey ? obj[foundKey] : null;
      };

      setFormData({
        title: findVal(jobToEdit, 'title') || '',
        categoryId: findVal(jobToEdit, 'categoryId') || '',
        locationId: findVal(jobToEdit, 'locationId') || '',
        jobTypeId: findVal(jobToEdit, 'jobTypeId') || '',
        levelId: findVal(jobToEdit, 'levelId') || '',
        experienceId: findVal(jobToEdit, 'experienceId') || '',
        minSalary: Number(findVal(jobToEdit, 'minSalary')) || 0,
        maxSalary: Number(findVal(jobToEdit, 'maxSalary')) || 0,
        quantity: Number(findVal(jobToEdit, 'quantity')) || 1,
        deadline: (findVal(jobToEdit, 'deadline')) 
          ? new Date(findVal(jobToEdit, 'deadline')).toISOString().split('T')[0] 
          : '',
        description: findVal(jobToEdit, 'description') || '',
        requirement: findVal(jobToEdit, 'requirement') || '',
        benefit: findVal(jobToEdit, 'benefit') || '',
        status: findVal(jobToEdit, 'status') || 'Active'
      });
    } else if (isOpen && !jobToEdit) {
      setFormData({
        title: '',
        categoryId: '',
        locationId: '',
        jobTypeId: '',
        levelId: '',
        experienceId: '',
        minSalary: 0,
        maxSalary: 0,
        quantity: 1,
        deadline: '',
        description: '',
        requirement: '',
        benefit: '',
        status: 'Active'
      });
    }
  }, [isOpen, jobToEdit]);

  useEffect(() => {
    if (isOpen) {
      fetchMetadata();
      // Reset scroll when modal opens
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const [cats, locs, levs, exps, types] = await Promise.all([
        getCategories(),
        getLocations(),
        getLevels(),
        getExperiences(),
        getJobTypes()
      ]);

      setCategories(cats.data);
      setLocations(locs.data);
      setLevels(levs.data);
      setExperiences(exps.data);
      setJobTypes(types.data);
    } catch (error) {
      console.error("Fetch metadata error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Salary') || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        companyId,
        recruiterId: userId,
        postDate: jobToEdit ? (jobToEdit.postDate || jobToEdit.PostDate) : new Date().toISOString()
      };

      const res = jobToEdit
        ? await updateJobApi(jobToEdit.id, payload)
        : await createJobApi(payload);

      if (res.success) {
        alert(jobToEdit ? 'Cập nhật tin tuyển dụng thành công!' : 'Đăng tin tuyển dụng thành công!');
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Create job error:", error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-linear-to-b from-indigo-500 to-blue-500 rounded-full"></div>
            <h2 className="text-2xl font-black font-display text-gray-900">
              {jobToEdit ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-slate-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-400 font-bold">Đang tải biểu mẫu...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">

              {/* Grid 1: Basic Info */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormGroup label="Tiêu đề tin tuyển dụng" icon={<Briefcase size={16} />}>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Ví dụ: Senior React Developer" className="form-input" />
                </FormGroup>
                <FormGroup label="Danh mục" icon={<Target size={16} />}>
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="form-input">
                    <option value="">Chọn danh mục</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Địa điểm" icon={<MapPin size={16} />}>
                  <select name="locationId" value={formData.locationId} onChange={handleChange} required className="form-input">
                    <option value="">Chọn địa điểm</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Hình thức" icon={<Clock size={16} />}>
                  <select name="jobTypeId" value={formData.jobTypeId} onChange={handleChange} required className="form-input">
                    <option value="">Chọn hình thức</option>
                    {jobTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </FormGroup>
              </section>

              {/* Grid 2: Levels & Salary */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormGroup label="Cấp bậc">
                  <select name="levelId" value={formData.levelId} onChange={handleChange} required className="form-input">
                    <option value="">Chọn cấp bậc</option>
                    {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Kinh nghiệm">
                  <select name="experienceId" value={formData.experienceId} onChange={handleChange} required className="form-input">
                    <option value="">Chọn kinh nghiệm</option>
                    {experiences.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </FormGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FormGroup label="Lương từ ($)" icon={<DollarSign size={14} />}>
                    <input type="number" name="minSalary" value={formData.minSalary} onChange={handleChange} className="form-input px-4" />
                  </FormGroup>
                  <FormGroup label="Đến ($)">
                    <input type="number" name="maxSalary" value={formData.maxSalary} onChange={handleChange} className="form-input px-4" />
                  </FormGroup>
                </div>
                <FormGroup label="Hạn nộp hồ sơ" icon={<Calendar size={16} />}>
                  <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required className="form-input" />
                </FormGroup>
              </section>

              {/* Textareas */}
              <section className="space-y-8">
                <FormGroup label="Mô tả công việc" icon={<FileText size={16} />}>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="form-input h-auto py-4" placeholder="Mô tả chi tiết công việc..." />
                </FormGroup>
                <FormGroup label="Yêu cầu ứng viên">
                  <textarea name="requirement" value={formData.requirement} onChange={handleChange} rows={4} className="form-input h-auto py-4" placeholder="Kỹ năng, kinh nghiệm cần có..." />
                </FormGroup>
                <FormGroup label="Quyền lợi">
                  <textarea name="benefit" value={formData.benefit} onChange={handleChange} rows={4} className="form-input h-auto py-4" placeholder="Lương thưởng, bảo hiểm, văn hóa..." />
                </FormGroup>
              </section>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/50 flex flex-col md:flex-row gap-4 sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="md:w-32 h-14 bg-white border border-slate-200 text-gray-500 rounded-2xl font-black transition-all hover:bg-slate-100 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || loading}
            className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : (jobToEdit ? <Edit size={20} /> : <PlusCircle size={20} />)}
            {submitting ? (jobToEdit ? 'Đang cập nhật...' : 'Đang đăng tin...') : (jobToEdit ? 'Lưu thay đổi' : 'Xác nhận đăng tin')}
          </button>
        </div>

      </div>

      <style>{`
        .form-input {
          width: 100%;
          padding: 0.875rem 1.25rem;
          background-color: #f8fafc;
          border: 1.5px solid transparent;
          border-radius: 1rem;
          outline: none;
          font-weight: 700;
          font-size: 0.875rem;
          color: #334155;
          transition: all 0.2s;
        }
        .form-input:focus {
          background-color: white;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.08);
        }
      `}</style>
    </div>
  );
};

const FormGroup = ({ label, icon, children }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
      {icon}
      {label}
    </label>
    {children}
  </div>
);

export default PostJobModal;
