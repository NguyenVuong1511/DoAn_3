import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, AlignLeft, Loader2 } from 'lucide-react';
import { scheduleInterviewApi, updateInterviewApi } from '../../services/interviewService';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  onSuccess: () => void;
  existingInterview?: any;
}

const ScheduleInterviewModal = ({ isOpen, onClose, applicationId, candidateName, jobTitle, onSuccess, existingInterview }: ScheduleInterviewModalProps) => {
  const [interviewDate, setInterviewDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && existingInterview) {
      // Lấy trực tiếp 16 ký tự đầu (YYYY-MM-DDThh:mm) từ chuỗi CSDL, tránh bị lệch múi giờ khi qua đối tượng Date
      const dateStr = existingInterview.interviewDate ? existingInterview.interviewDate.substring(0, 16) : '';
      setInterviewDate(dateStr);
      setLocation(existingInterview.location || '');
      setNotes(existingInterview.notes || '');
    } else if (isOpen) {
      setInterviewDate('');
      setLocation('');
      setNotes('');
    }
  }, [isOpen, existingInterview]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewDate || !location) {
      setError('Vui lòng điền ngày phỏng vấn và địa điểm.');
      return;
    }
    
    // Ensure date is in the future
    const dateObj = new Date(interviewDate);
    if (dateObj <= new Date()) {
      setError('Thời gian phỏng vấn phải ở tương lai.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const payload = {
        applicationId,
        interviewDate: interviewDate, // Send local time string directly (YYYY-MM-DDThh:mm)
        location,
        notes
      };

      let res;
      if (existingInterview) {
        res = await updateInterviewApi(existingInterview.id, payload);
      } else {
        res = await scheduleInterviewApi(payload);
      }

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.message || 'Có lỗi xảy ra khi lưu lịch.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra từ máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={!loading ? onClose : undefined}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">{existingInterview ? 'Sửa Lịch Phỏng Vấn' : 'Tạo Lịch Phỏng Vấn'}</h2>
            <p className="text-sm font-bold text-gray-500">
              Ứng viên: <span className="text-indigo-600">{candidateName}</span> - Vị trí: <span className="text-indigo-600">{jobTitle}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            disabled={loading}
            className="w-10 h-10 rounded-2xl bg-slate-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 font-bold text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" id="schedule-form">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black text-gray-700 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" />
                Thời gian phỏng vấn <span className="text-rose-500">*</span>
              </label>
              <input 
                type="datetime-local" 
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-700 text-base"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-black text-gray-700 flex items-center gap-2">
                <MapPin size={16} className="text-indigo-500" />
                Địa điểm / Link Online <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="VD: Phòng 101, Tòa nhà X / Link Google Meet..."
                className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-700 text-base"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-black text-gray-700 flex items-center gap-2">
                <AlignLeft size={16} className="text-indigo-500" />
                Lời nhắn / Ghi chú (tùy chọn)
              </label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Vui lòng mang theo laptop khi đến phỏng vấn..."
                className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-700 text-base min-h-[120px] resize-y custom-scrollbar"
              ></textarea>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 mt-auto">
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-black text-gray-500 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit"
            form="schedule-form"
            disabled={loading}
            className="px-8 py-3 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Calendar size={18} />}
            {loading ? 'Đang lưu...' : (existingInterview ? 'Lưu thay đổi' : 'Tạo lịch phỏng vấn')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
