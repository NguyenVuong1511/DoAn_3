import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import type { Company } from '../../types/companies';

interface CompanyCardProps {
    company: Company;
    index: number;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, index }) => {
    const getLogoPlaceholder = (name: string) => {
        return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
    };

    const bgColors = [
        'bg-blue-600', 'bg-emerald-500', 'bg-orange-500',
        'bg-indigo-600', 'bg-rose-500', 'bg-amber-500',
        'bg-violet-600', 'bg-cyan-600', 'bg-slate-800'
    ];

    return (
        <div className="group relative bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
            {/* Top: Logo & Info */}
            <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                    {company.logo ? (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5 shadow-sm group-hover:border-indigo-100 transition-colors">
                            <img 
                                src={company.logo.startsWith('http') ? company.logo : `/images/${company.logo}`} 
                                alt={company.name}
                                className="w-full h-full object-contain rounded-[12px]"
                            />
                        </div>
                    ) : (
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner ${bgColors[index % bgColors.length]}`}>
                            {getLogoPlaceholder(company.name)}
                        </div>
                    )}
                    {company.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            <ShieldCheck size={12} />
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <h3 className="font-black text-gray-900 text-xl leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {company.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-black uppercase tracking-wider mt-1.5">
                        <Building2 size={12} className="text-gray-300" />
                        <span>{company.industry || 'Đang cập nhật'}</span>
                    </div>
                </div>
            </div>

            {/* Tags/Badges */}
            <div className="flex flex-wrap gap-2 mb-8">
                {company.industry && (
                    <div className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] font-bold border border-indigo-100">
                        {company.industry}
                    </div>
                )}
                {company.size && (
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100">
                        {company.size} Nhân viên
                    </div>
                )}
            </div>

            {/* Info Items */}
            <div className="space-y-3 mb-8">
                {company.address && (
                    <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100/50">
                            <MapPin size={16} className="text-gray-400" />
                        </div>
                        <span className="text-sm font-bold text-gray-600 line-clamp-1">{company.address}</span>
                    </div>
                )}
                <div className="flex items-center gap-3 text-gray-500">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100/50">
                        <Globe size={16} className="text-gray-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-600 line-clamp-1">{company.website?.replace(/^https?:\/\//, '') || 'Đang cập nhật'}</span>
                </div>
            </div>

            {/* Action Button */}
            <Link 
                to={`/companies/${company.id}`}
                className="mt-auto w-full py-4 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-3 shadow-xl shadow-gray-900/10 hover:shadow-indigo-500/30 transition-all duration-300"
            >
                Chi tiết công ty
                <ArrowRight size={18} />
            </Link>
        </div>
    );
};

export default CompanyCard;
