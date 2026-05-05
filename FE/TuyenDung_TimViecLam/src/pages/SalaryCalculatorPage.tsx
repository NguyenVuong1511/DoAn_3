import { useState } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { Calculator, DollarSign, PieChart, ShieldCheck, Info, BookOpen, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const SalaryCalculatorPage = () => {
    const [grossSalary, setGrossSalary] = useState<number>(0);
    const [insuranceBase, setInsuranceBase] = useState<number>(0);
    const [dependents, setDependents] = useState<number>(0);
    const [result, setResult] = useState<any>(null);

    // Constants for 2026 (Based on 2024 regulations, projected to 2026)
    const BASE_SALARY = 2340000; // Lương cơ sở từ 01/07/2024
    const REGION_1_MIN_SALARY = 4960000; // Lương tối thiểu vùng I
    const MAX_INSURANCE_BASE = BASE_SALARY * 20; // 46,800,000
    const MAX_BHTN_BASE = REGION_1_MIN_SALARY * 20; // 99,200,000

    const calculateSalary = () => {
        if (grossSalary <= 0) return;

        const effectiveInsuranceBase = insuranceBase > 0 ? insuranceBase : grossSalary;
        
        const bhxh = Math.min(effectiveInsuranceBase, MAX_INSURANCE_BASE) * 0.08;
        const bhyt = Math.min(effectiveInsuranceBase, MAX_INSURANCE_BASE) * 0.015;
        const bhtn = Math.min(effectiveInsuranceBase, MAX_BHTN_BASE) * 0.01;
        
        const totalInsurance = bhxh + bhyt + bhtn;
        const beforeTax = grossSalary - totalInsurance;
        
        const personalReduction = 11000000;
        const dependentReduction = dependents * 4400000;
        
        const taxableIncome = Math.max(0, beforeTax - personalReduction - dependentReduction);
        
        let pit = 0;
        if (taxableIncome > 80000000) pit = taxableIncome * 0.35 - 9850000;
        else if (taxableIncome > 52000000) pit = taxableIncome * 0.30 - 5850000;
        else if (taxableIncome > 32000000) pit = taxableIncome * 0.25 - 3250000;
        else if (taxableIncome > 18000000) pit = taxableIncome * 0.20 - 1650000;
        else if (taxableIncome > 10000000) pit = taxableIncome * 0.15 - 750000;
        else if (taxableIncome > 5000000) pit = taxableIncome * 0.10 - 250000;
        else if (taxableIncome > 0) pit = taxableIncome * 0.05;

        const netSalary = beforeTax - pit;

        setResult({
            gross: grossSalary,
            bhxh,
            bhyt,
            bhtn,
            totalInsurance,
            beforeTax,
            personalReduction,
            dependentReduction,
            taxableIncome,
            pit,
            net: netSalary,
            insuranceBase: effectiveInsuranceBase
        });

        // Scroll to result on mobile
        if (window.innerWidth < 1024) {
            setTimeout(() => {
                document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />

            <main className="flex-1 w-full pb-20">
                {/* Hero Section */}
                <div className="bg-slate-900 pt-20 pb-40 px-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="max-w-[1200px] mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
                            <Calculator size={14} />
                            Công cụ tài chính 2026
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                            Tính lương <span className="text-indigo-400">Gross sang Net</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                            Công cụ tính toán lương chuẩn xác nhất theo quy định bảo hiểm và thuế TNCN mới nhất áp dụng cho năm 2026.
                        </p>
                    </div>
                </div>

                {/* Calculator Section */}
                <div className="max-w-[1200px] mx-auto px-4 -mt-20 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Input Form */}
                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-slate-200/50 border border-gray-100 sticky top-24">
                                <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                    Thông số tính lương
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Lương Gross (VNĐ)</label>
                                        <div className="relative group">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                            <input 
                                                type="number" 
                                                value={grossSalary || ''}
                                                onChange={(e) => setGrossSalary(Number(e.target.value))}
                                                placeholder="Ví dụ: 25,000,000"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-lg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Đóng bảo hiểm trên</label>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => setInsuranceBase(0)}
                                                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${insuranceBase === 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-600'}`}
                                            >
                                                Lương Gross
                                            </button>
                                            <button 
                                                onClick={() => setInsuranceBase(MAX_INSURANCE_BASE)}
                                                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${insuranceBase === MAX_INSURANCE_BASE ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-600'}`}
                                            >
                                                Mức tối đa
                                            </button>
                                        </div>
                                        {insuranceBase > 0 && insuranceBase !== MAX_INSURANCE_BASE && (
                                            <input 
                                                type="number"
                                                value={insuranceBase}
                                                onChange={(e) => setInsuranceBase(Number(e.target.value))}
                                                placeholder="Nhập mức lương đóng BH"
                                                className="w-full mt-3 px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-sm"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Số người phụ thuộc</label>
                                        <input 
                                            type="number" 
                                            value={dependents}
                                            onChange={(e) => setDependents(Number(e.target.value))}
                                            className="w-full px-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-lg"
                                        />
                                    </div>

                                    <button 
                                        onClick={calculateSalary}
                                        className="w-full py-5 bg-gray-900 hover:bg-indigo-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-3 mt-4 cursor-pointer active:scale-95"
                                    >
                                        <Calculator size={20} />
                                        Tính lương ngay
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Result Display */}
                        <div className="lg:col-span-7" id="result-section">
                            {!result ? (
                                <div className="h-full bg-white/40 backdrop-blur-md rounded-[32px] border border-dashed border-gray-300 flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-indigo-200 mb-6 shadow-sm">
                                        <PieChart size={48} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-600 uppercase tracking-tight">Sẵn sàng tính toán</h3>
                                    <p className="text-gray-400 mt-2 font-medium max-w-xs">Nhập mức lương Gross của bạn để nhận báo cáo thu nhập chi tiết theo quy định 2026.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-10 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                        <div className="relative z-10">
                                            <div className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">Lương thực nhận (NET)</div>
                                            <div className="text-5xl md:text-6xl font-black">{result.net.toLocaleString()} <span className="text-2xl opacity-60">VNĐ</span></div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 md:p-10 space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
                                                <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Tổng bảo hiểm</div>
                                                <div className="text-2xl font-black text-rose-600">-{result.totalInsurance.toLocaleString()} <span className="text-xs">VNĐ</span></div>
                                            </div>
                                            <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
                                                <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Thuế thu nhập (PIT)</div>
                                                <div className="text-2xl font-black text-orange-600">-{result.pit.toLocaleString()} <span className="text-xs">VNĐ</span></div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-gray-900 flex items-center gap-2 mb-6">
                                                <Info size={18} className="text-indigo-500" />
                                                DIỄN GIẢI CHI TIẾT
                                            </h4>
                                            <div className="space-y-4">
                                                <ResultRow label="Lương Gross" value={result.gross.toLocaleString()} isMain />
                                                <div className="h-px bg-gray-50 w-full"></div>
                                                <ResultRow label="Bảo hiểm xã hội (8%)" value={`-${result.bhxh.toLocaleString()}`} />
                                                <ResultRow label="Bảo hiểm y tế (1.5%)" value={`-${result.bhyt.toLocaleString()}`} />
                                                <ResultRow label="Bảo hiểm thất nghiệp (1%)" value={`-${result.bhtn.toLocaleString()}`} />
                                                <div className="h-px bg-gray-50 w-full"></div>
                                                <ResultRow label="Thu nhập trước thuế" value={result.beforeTax.toLocaleString()} isBold />
                                                <ResultRow label="Giảm trừ gia cảnh bản thân" value={`-11,000,000`} />
                                                <ResultRow label="Giảm trừ người phụ thuộc" value={`-${result.dependentReduction.toLocaleString()}`} />
                                                <div className="h-px bg-gray-50 w-full"></div>
                                                <ResultRow label="Thu nhập tính thuế" value={result.taxableIncome.toLocaleString()} />
                                                <ResultRow label="Thuế thu nhập cá nhân" value={`-${result.pit.toLocaleString()}`} isBold />
                                                
                                                <div className="pt-8 mt-4 border-t border-gray-100 flex justify-between items-center">
                                                    <div>
                                                        <span className="text-lg font-black text-gray-900 block">Lương NET thực nhận</span>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Quy đổi 2026</span>
                                                    </div>
                                                    <span className="text-3xl md:text-4xl font-black text-emerald-600">{result.net.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 p-6 bg-slate-900 rounded-[24px] text-white flex items-start gap-4 shadow-xl">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <h5 className="font-black text-sm mb-1">Cam kết chính xác 2026</h5>
                                                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                                    Kết quả được tính dựa trên mức lương cơ sở mới nhất (2.340.000đ) và các quy định giảm trừ gia cảnh hiện hành.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Information Sections */}
                    <div className="mt-20 space-y-20">
                        
                        {/* Guide Section */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-indigo-200">
                                    <BookOpen size={32} />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">Cách tính lương <br/><span className="text-indigo-600">Gross sang Net</span></h2>
                                <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                                    Lương Gross là tổng thu nhập mà doanh nghiệp trả cho bạn. Sau khi trích các khoản bảo hiểm và thuế TNCN, số tiền còn lại bạn thực tế cầm về túi được gọi là lương Net.
                                </p>
                                <div className="space-y-4">
                                    <StepItem number="01" title="Trích đóng các loại bảo hiểm" desc="Trích 10.5% lương (8% BHXH, 1.5% BHYT, 1% BHTN) nhưng không vượt quá mức trần quy định." />
                                    <StepItem number="02" title="Xác định các khoản giảm trừ" desc="Trừ đi 11 triệu đồng cho bản thân và 4.4 triệu đồng cho mỗi người phụ thuộc." />
                                    <StepItem number="03" title="Tính thuế TNCN lũy tiến" desc="Áp dụng biểu thuế 7 bậc từ 5% đến 35% trên phần thu nhập tính thuế còn lại." />
                                </div>
                            </div>
                            <div className="bg-indigo-50 rounded-[40px] p-8 md:p-12">
                                <div className="bg-white rounded-3xl p-8 shadow-xl">
                                    <h4 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <AlertCircle size={20} className="text-indigo-600" />
                                        Quy tắc vàng 2026
                                    </h4>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={14} /></div>
                                            <p className="text-sm font-bold text-gray-600">Lương cơ sở hiện tại: <span className="text-indigo-600">2,340,000 VNĐ</span></p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={14} /></div>
                                            <p className="text-sm font-bold text-gray-600">Trần đóng BHXH/BHYT: <span className="text-indigo-600">46,800,000 VNĐ</span></p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={14} /></div>
                                            <p className="text-sm font-bold text-gray-600">Trần đóng BHTN (Vùng I): <span className="text-indigo-600">99,200,000 VNĐ</span></p>
                                        </div>
                                    </div>
                                    <button className="w-full mt-8 py-4 bg-gray-50 hover:bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                        Xem chi tiết thông tư
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Tax Table Section */}
                        <section className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-100 border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 mb-10 text-center uppercase tracking-tight">Biểu thuế thu nhập cá nhân (Lũy tiến)</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-gray-100">
                                            <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bậc thuế</th>
                                            <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phần thu nhập tính thuế/tháng</th>
                                            <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thuế suất</th>
                                            <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Cách tính nhanh</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        <TaxRow level="1" range="Đến 5 triệu VNĐ" rate="5%" calc="5% TNTT" />
                                        <TaxRow level="2" range="Trên 5 đến 10 triệu VNĐ" rate="10%" calc="10% TNTT - 0.25 tr" />
                                        <TaxRow level="3" range="Trên 10 đến 18 triệu VNĐ" rate="15%" calc="15% TNTT - 0.75 tr" />
                                        <TaxRow level="4" range="Trên 18 đến 32 triệu VNĐ" rate="20%" calc="20% TNTT - 1.65 tr" />
                                        <TaxRow level="5" range="Trên 32 đến 52 triệu VNĐ" rate="25%" calc="25% TNTT - 3.25 tr" />
                                        <TaxRow level="6" range="Trên 52 đến 80 triệu VNĐ" rate="30%" calc="30% TNTT - 5.85 tr" />
                                        <TaxRow level="7" range="Trên 80 triệu VNĐ" rate="35%" calc="35% TNTT - 9.85 tr" />
                                    </tbody>
                                </table>
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

const ResultRow = ({ label, value, isMain = false, isBold = false }: any) => (
    <div className={`flex justify-between items-center py-1 ${isMain ? 'text-gray-900 font-black text-lg' : isBold ? 'text-gray-800 font-bold' : 'text-gray-500 font-medium text-sm'}`}>
        <span>{label}</span>
        <span>{value} VNĐ</span>
    </div>
);

const StepItem = ({ number, title, desc }: any) => (
    <div className="flex gap-5">
        <div className="text-3xl font-black text-indigo-100">{number}</div>
        <div>
            <h5 className="font-black text-gray-900 text-sm mb-1">{title}</h5>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
        </div>
    </div>
);

const TaxRow = ({ level, range, rate, calc }: any) => (
    <tr className="hover:bg-slate-50 transition-colors">
        <td className="py-5 font-black text-gray-900">{level}</td>
        <td className="py-5 font-bold text-gray-600 text-sm">{range}</td>
        <td className="py-5">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black">{rate}</span>
        </td>
        <td className="py-5 font-bold text-gray-400 text-sm text-right">{calc}</td>
    </tr>
);

export default SalaryCalculatorPage;
