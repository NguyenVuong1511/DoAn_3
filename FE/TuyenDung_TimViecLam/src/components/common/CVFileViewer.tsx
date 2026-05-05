import React from 'react';
import { X, Maximize2, Download, ExternalLink, FileText } from 'lucide-react';

interface CVFileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string;
}

const CVFileViewer: React.FC<CVFileViewerProps> = ({ isOpen, onClose, fileUrl, fileName }) => {
  if (!isOpen) return null;

  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toLowerCase();
  };

  const ext = getFileExtension(fileUrl);
  const isPdf = ext === 'pdf';
  const isWord = ext === 'doc' || ext === 'docx';
  const isOnlineCV = fileUrl.startsWith('/');
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');

  // If it's an internal route (Online CV), use it as is. 
  // Otherwise, ensure absolute URL for uploaded files.
  const absoluteUrl = isOnlineCV
    ? fileUrl
    : (fileUrl.startsWith('http') ? fileUrl : `/cvs/${fileUrl}`);

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 font-display line-clamp-1">{fileName || 'Xem chi tiết CV'}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Định dạng: {ext?.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isOnlineCV && (
              <>
                <a
                  href={absoluteUrl}
                  download
                  className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  title="Tải xuống"
                >
                  <Download size={20} />
                </a>
                <button
                  onClick={() => window.open(absoluteUrl, '_blank')}
                  className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title="Mở trong cửa sổ mới"
                >
                  <ExternalLink size={20} />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewer Area */}
        <div className="flex-1 bg-slate-100 relative">
          {isOnlineCV ? (
            <iframe
              src={absoluteUrl}
              className="w-full h-full border-none"
              title="Online CV Viewer"
            />
          ) : isPdf ? (
            <iframe
              src={`${absoluteUrl}#toolbar=0`}
              className="w-full h-full border-none"
              title="PDF Viewer"
            />
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center p-8 bg-slate-900/5 overflow-auto">
              <img src={absoluteUrl} alt="CV Preview" className="max-w-full max-h-full object-contain rounded-lg shadow-md bg-white" />
            </div>
          ) : isWord ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center bg-white">
              <div className="w-24 h-24 rounded-3xl bg-blue-50 shadow-sm flex items-center justify-center text-blue-500 mb-6 border border-blue-100">
                <FileText size={48} />
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-3 font-display">Tài liệu Word (.doc / .docx)</h4>
              <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium leading-relaxed">
                Trình duyệt hiện tại không hỗ trợ xem trước định dạng tài liệu Word với độ chính xác cao. <br />Vui lòng tải xuống để xem nội dung chi tiết.
              </p>
              <a
                href={absoluteUrl}
                download
                className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-black text-[15px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2"
              >
                <Download size={20} />
                Tải xuống file {ext?.toUpperCase()}
              </a>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center bg-white">
              <div className="w-24 h-24 rounded-3xl bg-slate-50 shadow-sm flex items-center justify-center text-slate-400 mb-6 border border-slate-100">
                <FileText size={48} />
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-3 font-display">Định dạng không được hỗ trợ</h4>
              <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium leading-relaxed">
                Chúng tôi không thể hiển thị trực tiếp loại file này ngay trên trình duyệt. Vui lòng tải xuống để xem.
              </p>
              <a
                href={absoluteUrl}
                download
                className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-black text-[15px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
              >
                <Download size={20} />
                Tải xuống file
              </a>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 bg-white border-t border-gray-100 flex justify-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Maximize2 size={12} /> Nhấn ESC để đóng cửa sổ xem nhanh
          </p>
        </div>
      </div>
    </div>
  );
};

export default CVFileViewer;
