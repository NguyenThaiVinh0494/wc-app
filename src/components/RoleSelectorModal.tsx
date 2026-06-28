import React, { useState } from 'react'

interface RoleSelectorModalProps {
  handleSelectRole: (selectedRole: 'admin' | 'guest') => void
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({ handleSelectRole }) => {
  const [pin, setPin] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showPinInput, setShowPinInput] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsVerifying(true)
    
    fetch('/api/login-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pin })
    })
    .then(async res => {
      setIsVerifying(false)
      if (res.ok) {
        handleSelectRole('admin')
      } else {
        const data = await res.json()
        setErrorMsg(data.error || 'Sai mã PIN xác minh Admin!')
      }
    })
    .catch(err => {
      setIsVerifying(false)
      console.error(err)
      setErrorMsg('Không thể kết nối tới server!')
    })
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col gap-6 text-center text-white relative overflow-hidden animate-slide-up">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_60%)] pointer-events-none"></div>
        
        <div className="text-5xl select-none animate-bounce">🏆</div>
        <div className="flex flex-col">
          <h2 className="text-xl md:text-2xl font-black text-gradient-animate uppercase">World Cup 2026</h2>
          <span className="text-[10px] text-yellow-400 font-extrabold uppercase tracking-widest mt-1">Hệ Thống Quản Lý & Cập Nhật Tỉ Số</span>
        </div>

        {!showPinInput ? (
          <div className="flex flex-col gap-4 mt-2 z-10">
            <p className="text-xs text-gray-400 font-medium px-4 leading-relaxed">
              Chào mừng bạn! Vui lòng chọn chế độ truy cập. Quyền truy cập sẽ được lưu trong vòng 2 tiếng.
            </p>
            
            <button
              onClick={() => handleSelectRole('guest')}
              className="w-full py-3 bg-gradient-to-r from-teal-500/20 to-blue-500/20 border border-teal-500/30 hover:border-teal-400 text-teal-300 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-lg shadow-teal-500/5 cursor-pointer"
            >
              👀 Khách xem (View-Only)
            </button>

            <button
              onClick={() => setShowPinInput(true)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              🔐 Administrator (Cập nhật dữ liệu)
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyPin} className="flex flex-col gap-4 mt-2 z-10">
            <p className="text-xs text-gray-400 font-semibold">
              Nhập mã PIN Admin để truy cập quyền quản trị:
            </p>
            
            <input
              type="password"
              placeholder="Nhập mã PIN Admin..."
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-12 bg-black/40 border border-gray-700 rounded-xl text-center text-base font-bold text-white outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />

            {errorMsg && (
              <div className="text-xs font-bold text-red-400 bg-red-950/20 border border-red-500/20 py-2 rounded-lg">
                ❌ {errorMsg}
              </div>
            )}

            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPinInput(false)
                  setErrorMsg('')
                  setPin('')
                }}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'Đang xác minh...' : 'Xác nhận'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
