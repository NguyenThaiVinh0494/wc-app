import React from 'react'
import { renderFlag } from '../utils/helpers'

interface LandingPageProps {
  setActiveTab: (tab: 'landing' | 'standings' | 'fixtures' | 'knockout') => void
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col gap-12 text-white animate-slide-up">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1e2354] via-[#12132b] to-[#251b4f] p-8 md:p-12 border border-white/10 shadow-2xl flex flex-col items-center text-center gap-6 animate-powerpoint-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_60%)]"></div>
        
        <div className="relative px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-black tracking-widest uppercase animate-pulse">
          🏆 Giải đấu đang diễn ra (11/06 - 19/07/2026)
        </div>

        <h1 className="relative text-4xl md:text-6xl font-black tracking-tight leading-none text-gradient-animate drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          FIFA WORLD CUP 2026
        </h1>

        <p className="relative text-base md:text-xl font-bold tracking-widest text-yellow-400 uppercase">
          UNITED: HOA KỲ • CANADA • MEXICO
        </p>

        <p className="relative max-w-2xl text-xs md:text-sm text-gray-400 leading-relaxed font-medium">
          Lần đầu tiên trong lịch sử, ngày hội bóng đá lớn nhất hành tinh được tổ chức tại 3 quốc gia đồng chủ nhà với sự tham gia của 48 đội tuyển xuất sắc nhất, mang lại tổng cộng 104 trận cầu rực lửa.
        </p>

        {/* Host Countries Flags */}
        <div className="relative flex justify-center gap-6 md:gap-10 mt-4">
          <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110">
            {renderFlag('Mỹ', '🇺🇸', 'w-12 h-8 object-cover rounded shadow-md')}
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Hoa Kỳ</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110">
            {renderFlag('Canada', '🇨🇦', 'w-12 h-8 object-cover rounded shadow-md')}
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Canada</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110">
            {renderFlag('Mexico', '🇲🇽', 'w-12 h-8 object-cover rounded shadow-md')}
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Mexico</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Đội tuyển', val: '48', desc: '12 bảng đấu', color: 'from-teal-400 to-emerald-500' },
          { label: 'Trận đấu', val: '104', desc: 'Kịch tính từng giây', color: 'from-blue-400 to-indigo-500' },
          { label: 'Chủ nhà', val: '3', desc: 'Mỹ, Canada, Mexico', color: 'from-yellow-400 to-orange-500' },
          { label: 'Ngày hội', val: '39', desc: 'Ngày tranh tài rực lửa', color: 'from-pink-400 to-rose-500' },
        ].map((stat, idx) => (
          <div key={idx} className={`glass-card rounded-2xl p-5 flex flex-col items-center text-center animate-stagger delay-${(idx + 1) * 100}`}>
            <span className={`text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>{stat.val}</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider mt-1">{stat.label}</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* Quick Shortcut CTAs */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold uppercase border-l-4 border-teal-400 pl-3">Khám phá Tiện ích</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Bảng Xếp Hạng',
              desc: 'Xem thứ hạng, điểm số, hiệu số bàn thắng bại và phong độ của 48 đội bóng tại 12 bảng đấu.',
              tab: 'standings',
              icon: '📊',
              btnClass: 'bg-teal-500 hover:bg-teal-400 text-black',
              borderClass: 'border-teal-500/20 hover:border-teal-500/40'
            },
            {
              title: 'Kết Quả Thi Đấu',
              desc: 'Theo dõi chi tiết 72 trận đấu vòng bảng, ghi nhận tỉ số trực tiếp để tự động cập nhật bảng điểm.',
              tab: 'fixtures',
              icon: '⚽',
              btnClass: 'bg-green-500 hover:bg-green-400 text-black',
              borderClass: 'border-green-500/20 hover:border-green-500/40'
            },
            {
              title: 'Vòng Knockout',
              desc: 'Trải nghiệm vòng đấu loại trực tiếp kịch tính từ Vòng 1/16, Tứ kết, Bán kết đến ngôi vương vô địch.',
              tab: 'knockout',
              icon: '🏆',
              btnClass: 'bg-blue-500 hover:bg-blue-400 text-white',
              borderClass: 'border-blue-500/20 hover:border-blue-500/40'
            }
          ].map((card, idx) => (
            <div 
              key={idx} 
              className="glass-card rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl select-none">{card.icon}</span>
                <h3 className="font-extrabold text-base tracking-tight uppercase text-white">{card.title}</h3>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed flex-1">{card.desc}</p>
              <button 
                onClick={() => setActiveTab(card.tab as any)}
                className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md ${card.btnClass}`}
              >
                Truy cập ngay
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mascots Detail */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold uppercase border-l-4 border-yellow-400 pl-3">Linh vật chính thức (Official Mascots)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Tuần Lộc (Deer)', country: 'Canada', flag: '🇨🇦', desc: 'Đại diện cho sự nhanh nhẹn, bền bỉ kiên cường trước nghịch cảnh, mang đậm nét đặc trưng hoang dã của thiên nhiên Canada rộng lớn.', icon: '🦌', color: 'from-red-500/10 to-transparent border-red-500/20' },
            { name: 'Báo Hoa Mai (Leopard)', country: 'Mexico', flag: '🇲🇽', desc: 'Đại diện cho tốc độ xé gió, sự dũng mãnh huyền thoại và di sản văn hóa Maya/Aztec đầy huyền bí, rực rỡ sắc màu của đất nước Mexico.', icon: '🐆', color: 'from-green-500/10 to-transparent border-green-500/20' },
            { name: 'Đại Bàng (Eagle)', country: 'Mỹ', flag: '🇺🇸', desc: 'Đại diện cho tầm nhìn cao rộng kiêu hãnh, ý chí tự do phóng khoáng và sức mạnh khát vọng dẫn đầu của tinh thần thể thao nước Mỹ.', icon: '🦅', color: 'from-blue-500/10 to-transparent border-blue-500/20' }
          ].map((m, idx) => (
            <div key={idx} className={`glass-card bg-gradient-to-b ${m.color} rounded-2xl p-6 flex flex-col items-center text-center gap-3 animate-stagger delay-${(idx + 5) * 100}`}>
              <span className="text-5xl animate-pulse select-none">{m.icon}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm uppercase tracking-wide text-slate-800">{m.name}</span>
                {renderFlag(m.country, m.flag, "w-5 h-3.5 object-cover rounded shadow-sm shrink-0")}
              </div>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stadiums / Host Cities */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold uppercase border-l-4 border-blue-400 pl-3">Thành phố đăng cai nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { city: 'New York/New Jersey', stadium: 'Sân vận động MetLife', capacity: '82,500 chỗ ngồi', note: 'Nơi diễn ra trận Chung Kết lịch sử', icon: '🗽' },
            { city: 'Mexico City', stadium: 'Sân vận động Azteca', capacity: '87,523 chỗ ngồi', note: 'Sân đầu tiên đăng cai 3 kỳ World Cup', icon: '🏟️' },
            { city: 'Toronto', stadium: 'Sân vận động BMO Field', capacity: '45,000 chỗ ngồi', note: 'Trọng điểm bóng đá quốc gia lá phong', icon: '🍁' }
          ].map((stadium, idx) => (
            <div key={idx} className={`glass-card rounded-2xl p-5 flex flex-col gap-2 animate-stagger delay-${(idx + 8) * 100}`}>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-white uppercase tracking-wider">{stadium.city}</span>
                <span className="text-xl select-none">{stadium.icon}</span>
              </div>
              <div className="text-sm font-black text-yellow-400">{stadium.stadium}</div>
              <div className="text-[10px] text-gray-400 font-bold">{stadium.capacity}</div>
              <div className="text-[10px] text-teal-400 font-medium mt-1 italic">{stadium.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
