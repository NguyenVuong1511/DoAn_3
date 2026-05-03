import React, { useState, useEffect, useRef } from 'react';
import { X, Send, CheckCircle2, Loader2, AlertCircle, FileUp, UserCircle2, UploadCloud } from 'lucide-react';
import { getCVByUserId, uploadCVFile } from '../../services/cvService';
import { applyJobApi } from '../../services/applicationService';

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  userId: string;
  onSuccess: () => void;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ isOpen, onClose, jobId, jobTitle, companyName, companyLogo, userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cvInfo, setCvInfo] = useState<any>(null);
  const [cvType, setCvType] = useState<'Online' | 'File'>('Online');
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchCvInfo();
    }
  }, [isOpen, userId]);

  const fetchCvInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCVByUserId(userId);
      if (res.success) {
        setCvInfo(res.data);
        if (res.data.fileUrl) {
          setCvType('File');
        } else {
          setCvType('Online');
        }
      } else {
        setError('Không tìm thấy thông tin CV. Vui lòng cập nhật profile hoặc tải file lên.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi tải thông tin CV.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Chỉ chấp nhận file PDF, DOC hoặc DOCX.');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const res = await uploadCVFile(userId, file);
      if (res.success) {
        // Refresh CV info to get the new fileUrl
        await fetchCvInfo();
        setCvType('File');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải file lên.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvInfo || !cvInfo.id || cvInfo.id === '00000000-0000-0000-0000-000000000000') {
      setError('Bạn cần có CV để ứng tuyển. Hãy tạo CV Online hoặc tải file lên.');
      return;
    }

    if (cvType === 'File' && !cvInfo.fileUrl) {
      setError('Bạn chưa có file CV. Vui lòng chọn CV Online hoặc tải file lên.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await applyJobApi({
        candidateId: cvInfo.candidateId || userId,
        jobPostId: jobId,
        cvId: cvInfo.id,
        coverLetter: coverLetter,
        cvType: cvType
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi nộp đơn.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black font-display text-gray-900">
              Ứng tuyển <span className="text-indigo-600">Vị trí</span>
            </h3>
            <p className="text-gray-500 text-sm font-medium mt-1">Gửi hồ sơ của bạn đến nhà tuyển dụng</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all cursor-pointer text-gray-400 hover:text-gray-900 hover:shadow-sm">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Job Summary */}
          <div className="mb-8 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-indigo-100 p-1 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={companyLogo ? `/images/${companyLogo}` : 'https://placehold.co/100x100?text=Job'}
                alt="Job"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=Logo'; }}
              />
            </div>
            <div>
              <div className="font-black text-gray-900 text-lg leading-tight mb-1">{jobTitle}</div>
              <div className="text-indigo-600 font-bold text-sm uppercase tracking-wider">{companyName}</div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* CV Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Chọn loại hồ sơ</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                  Tải CV mới
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </div>

              {loading ? (
                <div className="h-32 rounded-[24px] border-2 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CV Online Option */}
                  <div
                    onClick={() => setCvType('Online')}
                    className={`relative p-5 rounded-[24px] border-2 cursor-pointer transition-all ${cvType === 'Online'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-500/10'
                      : 'border-gray-100 hover:border-indigo-200 bg-white shadow-sm'
                      }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cvType === 'Online' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <UserCircle2 size={28} />
                      </div>
                      <div>
                        <div className="font-black text-gray-900">CV Online</div>
                        <div className="text-xs text-gray-500 font-medium leading-relaxed">Sử dụng thông tin hồ sơ đã tạo trên UpWork</div>
                      </div>
                    </div>
                    {cvType === 'Online' && (
                      <div className="absolute top-4 right-4 text-indigo-600">
                        <CheckCircle2 size={20} fill="currentColor" className="text-white" />
                        <CheckCircle2 size={20} className="absolute inset-0" />
                      </div>
                    )}
                  </div>

                  {/* CV File Option */}
                  <div
                    onClick={() => cvInfo?.fileUrl && setCvType('File')}
                    className={`relative p-5 rounded-[24px] border-2 transition-all ${!cvInfo?.fileUrl ? 'opacity-50 grayscale cursor-not-allowed border-gray-100 bg-gray-50/50' :
                      cvType === 'File'
                        ? 'border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-500/10'
                        : 'border-gray-100 hover:border-emerald-200 bg-white shadow-sm cursor-pointer'
                      }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cvType === 'File' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <FileUp size={28} />
                      </div>
                      <div>
                        <div className="font-black text-gray-900">File CV</div>
                        <div className="text-xs text-gray-500 font-medium leading-relaxed truncate">
                          {cvInfo?.fileUrl ? `File: ${cvInfo.fileUrl.split('_').pop()}` : 'Chưa tải file CV lên'}
                        </div>
                      </div>
                    </div>
                    {cvType === 'File' && (
                      <div className="absolute top-4 right-4 text-emerald-500">
                        <CheckCircle2 size={20} fill="currentColor" className="text-white" />
                        <CheckCircle2 size={20} className="absolute inset-0" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="text-sm font-black text-gray-700 mb-2 uppercase tracking-widest flex items-center justify-between">
                Thư giới thiệu
                <span className="text-[10px] text-gray-400 font-bold lowercase">không bắt buộc</span>
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                placeholder="Ví dụ: Tôi rất ấn tượng với vị trí này và tin rằng kỹ năng của mình sẽ đóng góp tốt cho quý công ty..."
                className="w-full px-5 py-4 rounded-[24px] border-2 border-gray-100 focus:border-indigo-600 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300 resize-none shadow-sm"
              />
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl font-black text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || uploading || !cvInfo || !cvInfo.id}
              className="flex-2 py-4 px-6 rounded-2xl font-black text-white bg-linear-to-r from-indigo-600 to-violet-600 shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              Xác nhận ứng tuyển
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
