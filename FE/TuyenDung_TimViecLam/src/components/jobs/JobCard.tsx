import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ArrowRight, Briefcase, DollarSign, Clock } from 'lucide-react';
import type { Job } from '../../types/job';

interface JobCardProps {
    job: Job;
    index?: number;
}

const JobCard = ({ job, index = 0 }: JobCardProps) => {
    const [failedImage, setFailedImage] = useState(false);

    const formatSalary = (min: number, max: number) => {
        if (!min && !max) return "Thỏa thuận";
        const formatValue = (val: number) => {
            if (val >= 1000000) return `${(val / 1000000).toFixed(0)}tr`;
            return val.toLocaleString('vi-VN');
        };
        return `${formatValue(min)} - ${formatValue(max)}`;
    };

    const formatTimeAgo = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Vừa xong";
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} phút`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} giờ`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays} ngày`;
        return date.toLocaleDateString('vi-VN');
    };

    const getLogoUrl = (logo: string) => {
        if (!logo) return null;
        if (logo.startsWith('http')) return logo;
        return `/images/${logo}`;
    };

    const getLogoPlaceholder = (name: string) => {
        return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
    };

    const bgColors = [
        'bg-blue-600', 'bg-emerald-500', 'bg-orange-500',
        'bg-indigo-600', 'bg-rose-500', 'bg-amber-500',
        'bg-violet-600', 'bg-cyan-600', 'bg-slate-800'
    ];

    return (
        <div className="group relative bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col">
            {/* Top: Logo & Meta */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {job.companyLogo && !failedImage ? (
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-1">
                                <img
                                    src={getLogoUrl(job.companyLogo) || ''}
                                    alt={job.companyName}
                                    className="w-full h-full object-contain"
                                    onError={() => setFailedImage(true)}
                                />
                            </div>
                        ) : (
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner ${bgColors[index % bgColors.length]}`}>
                                {getLogoPlaceholder(job.companyName)}
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-[16px] line-clamp-1 group-hover:text-indigo-600 transition-colors" title={job.companyName}>
                            {job.companyName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                            <Clock size={12} />
                            <span>{formatTimeAgo(job.postDate)} trước</span>
                        </div>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-full text-gray-300 hover:text-rose-500 flex items-center justify-center transition-all cursor-pointer">
                    <Heart size={20} strokeWidth={2} />
                </button>
            </div>

            {/* Title */}
            <Link to={`/jobs/${job.id}`} className="block mb-4">
                <h4 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[56px]">
                    {job.title}
                </h4>
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
                <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-bold flex items-center gap-1.5 border border-blue-100">
                    <Briefcase size={12} />
                    {job.jobTypeName}
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-[11px] font-bold border border-orange-100">
                    Linh hoạt
                </div>
            </div>

            {/* Footer: Location & Salary */}
            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        <MapPin size={16} className="text-gray-400" />
                    </div>
                    <span className="text-sm font-semibold">{job.locationName}</span>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Mức lương</div>
                    <div className="text-[16px] font-black text-emerald-600 flex items-center gap-1">
                        <DollarSign size={14} />
                        {formatSalary(job.minSalary, job.maxSalary)}
                    </div>
                </div>
            </div>

            {/* Apply Action Overlay */}
            <Link
                to={`/jobs/${job.id}`}
                className="mt-6 w-full py-4 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-3 shadow-xl shadow-gray-900/10 hover:shadow-indigo-500/30 transition-all duration-300"
            >
                Ứng tuyển ngay
                <ArrowRight size={18} />
            </Link>
        </div>
    );
};

export default JobCard;
