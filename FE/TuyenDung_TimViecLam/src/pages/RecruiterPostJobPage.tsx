import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { getUserId } from '../services/authService';
import { getMyCompanyApi } from '../services/companyService';
import { 
  getCategories, 
  getLocations, 
  getLevels, 
  getExperiences, 
  getJobTypes,
  createJobApi
} from '../services/jobService';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  PlusCircle, 
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const RecruiterPostJobPage = () => {
  const navigate = useNavigate();
  const userId = getUserId();
  const [company, setCompany] = useState<any>(null);
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
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const companyRes = await getMyCompanyApi(userId!);
      if (companyRes.success) {
        setCompany(companyRes.data);
      }

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
        companyId: company.id,
        recruiterId: userId,
        postDate: new Date().toISOString()
      };
      const res = await createJobApi(payload);
      if (res.success) {
        alert('Đăng tin tuyển dụng thành công!');
        navigate('/recruiter/manage-jobs');
      }
    } catch (error) {
      console.error("Create job error:", error);
      alert('Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Đang chuẩn bị biểu mẫu...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 font-black mb-8 hover:text-indigo-600 transition-colors group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-indigo-50 transition-all">
            <ArrowLeft size={18} />
          </div>
          Quay lại
        </button>

        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100">
          <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-50">
            <div className="w-2.5 h-10 bg-linear-to-b from-indigo-500 to-blue-500 rounded-full"></div>
            <h1 className="text-3xl font-black font-display text-gray-900">Đăng tin tuyển dụng mới</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Basic Info Section */}
            <section>
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">1</span>
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormGroup label="Tiêu đề tin tuyển dụng" error={!formData.title && "Bắt buộc"}>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: Senior Frontend Developer (ReactJS)"
                    className="form-input"
                  />
                </FormGroup>
                <FormGroup label="Danh mục nghề nghiệp">
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="form-input">
                    <option value="">Chọn danh mục</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Địa điểm làm việc">
                  <select name="locationId" value={formData.locationId} onChange={handleChange} required className="form-input">
                    <option value="">Chọn tỉnh thành</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Hình thức làm việc">
                  <select name="jobTypeId" value={formData.jobTypeId} onChange={handleChange} required className="form-input">
                    <option value="">Chọn hình thức</option>
                    {jobTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </FormGroup>
              </div>
            </section>

            {/* Requirements Section */}
            <section>
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">2</span>
                Yêu cầu & Mức lương
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormGroup label="Cấp bậc">
                  <select name="levelId" value={formData.levelId} onChange={handleChange} required className="form-input">
                    <option value="">Chọn cấp bậc</option>
                    {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </FormGroup>
                <FormGroup label="Kinh nghiệm">
                  <select name="experienceId" value={formData.experienceId} onChange={handleChange} required className="form-input">
                    <option value="">Chọn mức kinh nghiệm</option>
                    {experiences.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </FormGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FormGroup label="Lương tối thiểu ($)">
                    <input type="number" name="minSalary" value={formData.minSalary} onChange={handleChange} className="form-input" />
                  </FormGroup>
                  <FormGroup label="Lương tối đa ($)">
                    <input type="number" name="maxSalary" value={formData.maxSalary} onChange={handleChange} className="form-input" />
                  </FormGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormGroup label="Số lượng tuyển">
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min={1} className="form-input" />
                  </FormGroup>
                  <FormGroup label="Hạn nộp hồ sơ">
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required className="form-input" />
                  </FormGroup>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section>
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">3</span>
                Nội dung chi tiết
              </h3>
              <div className="space-y-8">
                <FormGroup label="Mô tả công việc">
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={6} 
                    className="form-input h-auto"
                    placeholder="Mô tả các công việc cần làm hàng ngày..."
                  />
                </FormGroup>
                <FormGroup label="Yêu cầu ứng viên">
                  <textarea 
                    name="requirement" 
                    value={formData.requirement} 
                    onChange={handleChange} 
                    rows={6} 
                    className="form-input h-auto"
                    placeholder="Các kỹ năng, bằng cấp cần thiết..."
                  />
                </FormGroup>
                <FormGroup label="Quyền lợi & Phúc lợi">
                  <textarea 
                    name="benefit" 
                    value={formData.benefit} 
                    onChange={handleChange} 
                    rows={6} 
                    className="form-input h-auto"
                    placeholder="Lương thưởng, bảo hiểm, chế độ nghỉ phép..."
                  />
                </FormGroup>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="pt-10 flex flex-col md:flex-row gap-4 border-t border-slate-50">
              <button 
                type="submit" 
                disabled={submitting}
                className="flex-1 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[20px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? <Loader2 className="animate-spin" size={24} /> : <PlusCircle size={24} />}
                {submitting ? 'Đang xử lý...' : 'Đăng tin tuyển dụng'}
              </button>
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="md:w-48 h-16 bg-slate-900 hover:bg-black text-white rounded-[20px] font-black text-lg transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>

          </form>
        </div>
      </main>

      <Footer />

      <style>{`
        .form-input {
          width: 100%;
          padding: 1rem 1.5rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          outline: none;
          font-weight: 600;
          color: #334155;
          transition: all 0.2s;
        }
        .form-input:focus {
          background-color: white;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
      `}</style>
    </div>
  );
};

const FormGroup = ({ label, children, error }: any) => (
  <div className="flex flex-col gap-2.5">
    <label className="text-sm font-black text-gray-700 ml-1 flex items-center justify-between">
      {label}
      {error && <span className="text-rose-500 text-[10px] uppercase">{error}</span>}
    </label>
    {children}
  </div>
);

export default RecruiterPostJobPage;
