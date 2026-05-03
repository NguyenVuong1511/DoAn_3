import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) pages.push(i);
    }
    return pages;
  };

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-50 pt-6 mt-6 gap-4">
      <p className="text-sm text-gray-500 font-bold text-center sm:text-left">
        Hiển thị <span className="text-gray-900">{startItem}</span> đến <span className="text-gray-900">{endItem}</span> trong số <span className="text-gray-900">{totalItems}</span> kết quả
      </p>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-xl bg-slate-50 text-gray-500 hover:bg-slate-100 hover:text-indigo-600 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-sm font-black transition-all flex items-center justify-center cursor-pointer ${
              currentPage === page
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-50 text-gray-500 hover:bg-slate-100 hover:text-indigo-600'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-xl bg-slate-50 text-gray-500 hover:bg-slate-100 hover:text-indigo-600 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
