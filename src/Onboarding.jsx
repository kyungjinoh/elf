import { useState } from 'react'

function Onboarding({ onGetStarted }) {
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [isClosingHowItWorks, setIsClosingHowItWorks] = useState(false)
  const [showUsernamePage, setShowUsernamePage] = useState(false)
  const [isClosingUsernamePage, setIsClosingUsernamePage] = useState(false)
  const [username, setUsername] = useState('')
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Generate snow circles
  const snowCircles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    size: (Math.random() * 3 + 1) * 2,
  }))

  const handleReceiveLetter = () => {
    setShowHowItWorks(true)
    setIsClosingHowItWorks(false)
  }

  const handleNext = () => {
    setShowHowItWorks(false)
    setIsClosingHowItWorks(false)
    setShowUsernamePage(true)
    setIsClosingUsernamePage(false)
  }

  const handleBackFromUsername = () => {
    setShowCancelConfirm(true)
  }

  const handleConfirmBack = () => {
    setShowCancelConfirm(false)
    setIsClosingUsernamePage(true)
    setTimeout(() => {
      setShowUsernamePage(false)
      setIsClosingUsernamePage(false)
      setShowHowItWorks(true)
      setIsClosingHowItWorks(false)
    }, 300)
  }

  const handleCancelBack = () => {
    setShowCancelConfirm(false)
  }

  const handleContinue = () => {
    setIsClosingUsernamePage(true)
    setTimeout(() => {
      setShowUsernamePage(false)
      setIsClosingUsernamePage(false)
      onGetStarted()
    }, 300)
  }

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #ec4899 0%, #dc2626 25%, #f97316 100%)',
        minHeight: '100dvh',
      }}
    >
      {/* Snow Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {snowCircles.map((circle) => (
          <div
            key={circle.id}
            className="absolute snowflake rounded-full bg-white"
            style={{
              left: `${circle.left}%`,
              top: '-100px',
              animationDelay: `${circle.delay}s`,
              animationDuration: `${circle.duration}s`,
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Logo with animation */}
      {!showHowItWorks && !showUsernamePage && (
        <>
          <div className="flex-1 flex items-center justify-center mb-auto pt-20 sm:pt-24 relative z-10">
            <div
              style={{
                animation: 'fadeInScale 1s ease-out',
              }}
            >
              <img 
                src="/ELF-removebg-preview.png" 
                alt="ELF" 
                className="h-24 w-auto sm:h-32 md:h-40 object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))',
                }}
              />
            </div>
          </div>

          {/* Receive Letter Button with gradient border effect */}
          <div className="w-full px-6 sm:px-8 pb-16 sm:pb-20 md:pb-24 relative z-10">
            <div
              style={{
                animation: 'fadeInUp 1s ease-out 0.3s both',
              }}
            >
              <button
                onClick={handleReceiveLetter}
                className="w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-white shadow-2xl hover:shadow-3xl active:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
                }}
              >
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 relative z-10">
                  Receive Letter
                </span>
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                  }}
                />
              </button>

              {/* I've tried ELF before button */}
              <button
                onClick={onGetStarted}
                className="w-full mt-4 sm:mt-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-transparent border-2 border-white/50 text-white hover:bg-white/10 active:bg-white/20 transition-all duration-300 hover:border-white/80"
              >
                <span className="text-base sm:text-lg md:text-xl font-semibold">
                  I've tried ELF before
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* How ELF Works Screen */}
      {showHowItWorks && !showUsernamePage && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{
            backgroundColor: '#ffcccc',
            animation: isClosingHowItWorks 
              ? 'slideOutToRight 0.3s ease-out' 
              : 'slideInFromRight 0.3s ease-out',
          }}
        >
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
            <div className="w-full max-w-md flex flex-col items-center">
            {/* Title */}
            <div className="mb-5 sm:mb-6 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight uppercase">
                How to use elf
              </h1>
            </div>

            {/* Stat */}
            <div className="w-full mb-6 sm:mb-8 text-center">
              <p className="text-base sm:text-lg md:text-xl text-gray-700 font-semibold inline-block px-3 sm:px-4 py-2 sm:py-2.5">
                Globally, people receive an average of <span className="text-red-600 font-bold">14.3 letters</span>
              </p>
            </div>

            {/* Instruction Panels */}
            <div className="w-full max-w-xs mx-auto space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {/* Step 1 */}
              <div 
                className="rounded-3xl sm:rounded-[2rem] p-4 sm:p-5 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-4 sm:gap-5 bg-white border border-pink-100 hover:border-pink-200"
              >
                <div 
                  className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-white text-lg sm:text-xl shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                  }}
                >
                  1
                </div>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex-1">
                  Create Your Letter Link
                </p>
              </div>

              {/* Step 2 */}
              <div 
                className="rounded-3xl sm:rounded-[2rem] p-4 sm:p-5 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-4 sm:gap-5 bg-white border border-pink-100 hover:border-pink-200"
              >
                <div 
                  className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-white text-lg sm:text-xl shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                  }}
                >
                  2
                </div>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex-1">
                  Share Your Link and Receive Letters
                </p>
              </div>

              {/* Step 3 */}
              <div 
                className="rounded-3xl sm:rounded-[2rem] p-4 sm:p-5 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-4 sm:gap-5 bg-white border border-pink-100 hover:border-pink-200"
              >
                <div 
                  className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-white text-lg sm:text-xl shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                  }}
                >
                  3
                </div>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex-1">
                  View Letters in Your Inbox
                </p>
              </div>
            </div>

            {/* NEXT Button */}
            <div className="w-full flex justify-center">
              <button
                onClick={handleNext}
                className="w-2/3 sm:w-1/2 md:w-2/5 py-4 sm:py-5 rounded-full shadow-2xl hover:shadow-3xl active:shadow-xl transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #f97316)',
                }}
              >
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white uppercase relative z-10">
                  NEXT
                </span>
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #fb923c)',
                  }}
                />
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Choose Username Screen */}
      {showUsernamePage && (
        <div 
          className="fixed inset-0 z-[60] overflow-y-auto"
          style={{
            background: 'linear-gradient(to bottom, #ec4899, #dc2626, #f97316)',
            animation: isClosingUsernamePage 
              ? 'slideOutToRight 0.3s ease-out' 
              : 'slideInFromRight 0.3s ease-out',
            minHeight: '100dvh',
          }}
        >
          {/* Snow Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {snowCircles.map((circle) => (
              <div
                key={circle.id}
                className="absolute snowflake rounded-full bg-white"
                style={{
                  left: `${circle.left}%`,
                  top: '-100px',
                  animationDelay: `${circle.delay}s`,
                  animationDuration: `${circle.duration}s`,
                  width: `${circle.size}px`,
                  height: `${circle.size}px`,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 min-h-screen flex flex-col px-6 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12">
            {/* Back Button */}
            <button
              onClick={handleBackFromUsername}
              className="absolute top-6 sm:top-8 left-6 sm:left-8 z-20 text-white hover:text-white/80 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 sm:h-7 sm:w-7" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex justify-center mt-8 sm:mt-12 mb-8 sm:mb-12">
              <img 
                src="/ELF-removebg-preview.png" 
                alt="ELF" 
                className="h-16 w-auto sm:h-20 md:h-24 object-contain"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))',
                }}
              />
            </div>

            {/* Choose a username text */}
            <div className="flex justify-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                Choose a username
              </h2>
            </div>

            {/* Input Field */}
            <div className="w-full max-w-sm mx-auto mb-6 sm:mb-8">
              <div 
                className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl bg-white/90 backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(255, 182, 193, 0.95)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-gray-600 font-semibold text-lg sm:text-xl">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=""
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 font-medium text-base sm:text-lg placeholder-gray-400"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="w-full max-w-sm mx-auto">
              <button
                onClick={handleContinue}
                className="w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-bold text-black text-base sm:text-lg md:text-xl"
                style={{
                  backgroundColor: 'rgba(255, 182, 193, 0.95)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={handleCancelBack}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'fadeInScale 0.2s ease-out',
            }}
          >
            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-3">
                Cancel Signing Up
              </h3>
              
              {/* Message */}
              <p className="text-base sm:text-lg text-gray-600 text-center mb-6">
                This action is irreversible.
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                {/* Cancel Button */}
                <button
                  onClick={handleCancelBack}
                  className="w-full py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#dc2626',
                  }}
                >
                  Cancel
                </button>

                {/* Back Button */}
                <button
                  onClick={handleConfirmBack}
                  className="w-full py-3 sm:py-4 rounded-2xl font-semibold text-white text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #f97316)',
                  }}
                >
                  <span className="relative z-10">Back</span>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #fb923c)',
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Onboarding

