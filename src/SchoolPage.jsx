import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function SchoolPage() {
  const { schoolName } = useParams()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(7)

  // Decode school name from URL
  const decodedSchoolName = schoolName ? decodeURIComponent(schoolName) : '[학교이름]'

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [countdown])
  
  // Auto-redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      const redirectTimer = setTimeout(() => {
        navigate('/')
      }, 200) // Small delay to ensure progress bar animation completes
      
      return () => clearTimeout(redirectTimer)
    }
  }, [countdown, navigate])

  // Generate snow circles - memoized so they don't regenerate on re-render
  const snowCircles = useMemo(() => 
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 8 + Math.random() * 12,
      size: (Math.random() * 3 + 1) * 2,
    })), []
  )

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen px-4 py-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #ec4899 0%, #dc2626 25%, #f97316 100%)',
        minHeight: '100dvh',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Snow Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
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

      {/* Top Text */}
      <div className="text-center mb-8 mt-4 relative z-10">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
          Oops! You Missed A Message
        </h1>
        <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-lg">
          From Someone in {decodedSchoolName}
        </h2>
      </div>

      {/* Love Letter Image */}
      <div className="mb-8 sm:mb-12 relative z-10">
        <img 
          src="/loveletter.png" 
          alt="Love Letter" 
          className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
          }}
        />
      </div>

      {/* Receive Letter Button */}
      <div 
        className="w-full max-w-md mx-auto relative z-10"
        style={{
          marginBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 sm:py-5 md:py-4 lg:py-5 rounded-2xl bg-black text-white font-bold text-base sm:text-lg md:text-base lg:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden"
        >
          {/* Progress Bar */}
          <div 
            className="absolute bottom-0 left-0 h-1 bg-white transition-all ease-linear"
            style={{ 
              width: `${(countdown / 7) * 100}%`,
              transitionDuration: '1s',
            }}
          />
          <span className="relative z-10">Receive letter from your friends</span>
        </button>
      </div>
    </div>
  )
}

export default SchoolPage
