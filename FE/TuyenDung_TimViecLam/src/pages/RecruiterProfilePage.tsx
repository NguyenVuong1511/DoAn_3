import { useState } from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import {
  MapPin, Users, Globe, Mail,
  ExternalLink, Share2, Briefcase, Heart, CheckCircle2,
  ChevronRight
} from 'lucide-react';

const RecruiterProfilePage = () => {
  // Mock company data
  const [company] = useState({
    name: 'VNG Corporation',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=257&h=257',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
    industry: 'Công nghệ thông tin / Internet',
    size: '1000+ nhân viên',
    website: 'https://vng.com.vn',
    location: 'Z06 Đường số 13, Phường Tân Thuận Đông, Quận 7, TP. HCM',
    email: 'tuyendung@vng.com.vn',
    phone: '028 3962 3888',
    about: 'VNG là công ty công nghệ hàng đầu Việt Nam, được thành lập năm 2004. Với sứ mệnh "Kiến tạo công nghệ và Phát triển con người. Vì một cuộc sống tốt đẹp hơn", VNG tập trung phát triển các sản phẩm, dịch vụ internet đáp ứng tối đa nhu cầu của người dùng Internet Việt Nam và khẳng định vị thế trên trường quốc tế.',
    culture: [
      'Môi trường làm việc năng động, sáng tạo và cởi mở.',
      'Cơ sở vật chất hiện đại, tích hợp khu giải trí, phòng gym, hồ bơi (VNG Campus).',
      'Cơ hội phát triển bản thân với các chương trình đào tạo nội bộ chất lượng.',
      'Đội ngũ nhân sự đầy nhiệt huyết và tài năng từ nhiều quốc gia.'
    ],
    benefits: [
      'Bảo hiểm sức khỏe toàn diện (VNG Care) cho nhân viên và người thân',
      'Laptop, thiết bị làm việc chuẩn quốc tế',
      'Căn tin phục vụ bữa ăn miễn phí, chất lượng cao',
      'Các CLB thể thao, eSports được tài trợ hoạt động'
    ],
    jobs: [
      { id: 1, title: 'Senior React Engineer', type: 'Toàn thời gian', location: 'Trụ sở chính (Quận 7)', salary: 'Thoả thuận' },
      { id: 2, title: 'Product Manager', type: 'Toàn thời gian', location: 'Trụ sở chính (Quận 7)', salary: 'Lên đến $3000' },
      { id: 3, title: 'Data Scientist', type: 'Toàn thời gian', location: 'Hà Nội', salary: 'Lên đến $2500' }
    ]
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 w-full flex flex-col pb-20">

        {/* Cover Photo */}
        <section className="relative w-full h-[320px] md:h-[400px]">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${company.cover})` }}
          >
            <div className="absolute inset-0 bg-slate-900/40" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent" />
          </div>
        </section>

        {/* Floating Content Area */}
        <div className="relative z-20 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-[80px]">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT COLUMN: Company Info */}
            <div className="lg:col-span-4 lg:col-start-1 flex flex-col gap-6">

              <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center sm:items-start text-center sm:text-left">

                {/* Logo */}
                <div className="w-32 h-32 rounded-2xl p-2 bg-white border border-gray-100 shadow-md -mt-16 mb-5 shrink-0 relative flex items-center justify-center overflow-hidden">
                  <img src={company.logo} alt={company.name} className="w-full object-contain" />
                </div>

                <h1 className="text-2xl md:text-3xl font-black font-display text-gray-900 mb-2">{company.name}</h1>
                <p className="text-[15px] font-medium text-indigo-600 mb-6">{company.industry}</p>

                <div className="w-full flex gap-3 mb-6">
                  <button className="flex-1 bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white py-3 rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5">
                    <Heart size={18} />
                    Theo dõi
                  </button>
                  <button className="w-12 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center transition-colors border border-gray-200 cursor-pointer">
                    <Share2 size={18} />
                  </button>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6"></div>

                {/* Company Details List */}
                <div className="w-full flex flex-col gap-5 text-left">
                  <div className="flex items-start gap-3">
                    <Users className="text-gray-400 mt-0.5 shrink-0" size={18} />
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Quy mô</span>
                      <span className="text-sm font-semibold text-gray-900">{company.size}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="text-gray-400 mt-0.5 shrink-0" size={18} />
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Website</span>
                      <a href={company.website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                        {company.website.replace('https://', '')}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 mt-0.5 shrink-0" size={18} />
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Email liên hệ</span>
                      <span className="text-sm font-semibold text-gray-900">{company.email}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-0.5 shrink-0" size={18} />
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Trụ sở chính</span>
                      <span className="text-sm font-semibold text-gray-900 leading-relaxed">{company.location}</span>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="w-full mt-6 pt-6 border-t border-gray-100 flex gap-3 justify-center">
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors font-bold text-xs">
                    FB
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-colors font-bold text-xs">
                    IN
                  </a>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: About & Jobs */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* About Section */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
                <h3 className="text-xl font-bold font-display text-gray-900 mb-5 pb-2 flex items-center gap-3">
                  <div className="w-2 h-6 bg-linear-to-b from-indigo-500 to-blue-500 rounded-full"></div>
                  Giới thiệu công ty
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px] mb-8">
                  {company.about}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Culture */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-indigo-500" />
                      Văn hóa nổi bật
                    </h4>
                    <ul className="flex flex-col gap-3">
                      {company.culture.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5"></span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award size={18} className="text-purple-500" />
                      Phúc lợi nhân viên
                    </h4>
                    <ul className="flex flex-col gap-3">
                      {company.benefits.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5"></span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Active Jobs Section */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
                <div className="flex justify-between items-center mb-6 pb-2">
                  <h3 className="text-xl font-bold font-display text-gray-900 flex items-center gap-3">
                    <div className="w-2 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    Tuyển dụng ({company.jobs.length})
                  </h3>
                  <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group">
                    Xem tất cả
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <div className="flex flex-col gap-4">
                  {company.jobs.map(job => (
                    <div key={job.id} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-slate-50 transition-colors group cursor-pointer">
                      <div className="flex flex-col">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">{job.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end w-full sm:w-auto mt-2 sm:mt-0">
                        <span className="font-bold text-indigo-600 mb-2 sm:mb-0">{job.salary}</span>
                        <button className="w-full sm:w-auto px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-sm hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer">
                          Ứng tuyển
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

// Add a mock component for missing lucide icon in this scope
function Award({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="7"></circle>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
  );
}

export default RecruiterProfilePage;
