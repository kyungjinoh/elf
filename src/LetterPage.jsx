import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function LetterPage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [showMessageSent, setShowMessageSent] = useState(false)
  const [countdown, setCountdown] = useState(5)
  
  const handleSend = () => {
    setShowMessageSent(true)
    setCountdown(5) // Reset countdown when message is sent
  }
  
  // Countdown timer
  useEffect(() => {
    if (showMessageSent && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [showMessageSent, countdown])
  
  // Auto-redirect when countdown reaches 0
  useEffect(() => {
    if (showMessageSent && countdown === 0) {
      const redirectTimer = setTimeout(() => {
        navigate('/')
      }, 200) // Small delay to ensure progress bar animation completes
      
      return () => clearTimeout(redirectTimer)
    }
  }, [showMessageSent, countdown, navigate])
  
  // Rotating placeholder messages
  const placeholderMessages = [
    "Wishing you a warm Christmas.",
    "Hope your Christmas feels gentle.",
    "Sending you soft Christmas cheer.",
    "May your Christmas be peaceful.",
    "Wishing you a calm holiday.",
    "Hope your season feels bright.",
    "Sending warm Christmas wishes.",
    "May your holiday bring comfort.",
    "Wishing you a sweet Christmas.",
    "Hope your Christmas brings joy."
  ]
  
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  
  // Dynamic friend count - random between 200-400, updates by ±10
  const [friendCount, setFriendCount] = useState(() => Math.floor(Math.random() * 201) + 200)
  
  // Rotate placeholder messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderMessages.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [placeholderMessages.length])
  
  // Update friend count by random amount between -10 and +10, keeping it between 200-400
  useEffect(() => {
    const interval = setInterval(() => {
      setFriendCount((prev) => {
        const change = Math.floor(Math.random() * 21) - 10 // Random number between -10 and +10
        const newCount = prev + change
        // Keep within 200-400 range
        return Math.max(200, Math.min(400, newCount))
      })
    }, 500 + Math.random() * 500) // Random interval between 0.5-1 seconds (faster updates)
    
    return () => clearInterval(interval)
  }, [])

  // Generate snow circles - memoized so they don't regenerate on re-render
  const snowCircles = useMemo(() => 
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20, // Increased delay range for more varied timing
      duration: 8 + Math.random() * 12, // More varied duration
      size: (Math.random() * 3 + 1) * 2,
    })), []
  )

  // Show message sent screen
  if (showMessageSent) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:py-8 relative"
        style={{
          background: 'linear-gradient(to bottom, #ec4899 0%, #dc2626 25%, #f97316 100%)',
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

        {/* Message Sent Screen */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Letter Delivered Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Letter Delivered
          </h1>
          
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">
            @{username ? username.toUpperCase() : 'USER'} + 15 Others Wants To Send You Letters!
          </h2>

          {/* Love Letter Image */}
          <div className="mb-6 sm:mb-8">
            <img 
              src="/loveletter.png" 
              alt="Love Letter" 
              className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
            />
          </div>

          {/* Receive Letter Button */}
          <div className="w-full max-w-md mx-auto relative">
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 sm:py-5 rounded-2xl bg-black text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden"
            >
              {/* Progress Bar */}
              <div 
                className="absolute bottom-0 left-0 h-1 bg-white transition-all ease-linear"
                style={{ 
                  width: `${(countdown / 5) * 100}%`,
                  transitionDuration: '1s',
                }}
              />
              <span className="relative z-10">Receive Letter</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start px-4 py-6 sm:py-8 relative"
      style={{
        background: 'linear-gradient(to bottom, #ec4899 0%, #dc2626 25%, #f97316 100%)',
      }}
    >
      {/* Status Bar (thin pink bar at top) */}
      <div className="w-full h-1 bg-pink-500 absolute top-0 left-0 z-10"></div>
      
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
      
      {/* Main Card */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-[280px] mb-6 sm:mb-8 mt-8 sm:mt-12 rounded-3xl overflow-hidden shadow-2xl">
        {/* White Header Section */}
        <div className="bg-white px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-3 sm:gap-4">
          {/* Profile Picture */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 bg-pink-100 flex items-center justify-center">
            <img 
              src="/letter.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24"%3E%3Cpath fill="white" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/%3E%3Ccircle cx="18" cy="8" r="3" fill="red"/%3E%3C/svg%3E'
              }}
            />
          </div>
          
          {/* Username and Message */}
          <div className="flex-1 min-w-0">
            <div className="text-sm sm:text-base font-semibold text-gray-900">
              @{username ? username.toUpperCase() : 'USER'}
            </div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mt-0.5">
              send me anonymous X-mas letter!
            </div>
          </div>
        </div>

        {/* Translucent Pink/Red Body */}
        <div 
          className="px-4 sm:px-6 py-3 sm:py-4 relative"
          style={{
            backgroundColor: 'rgba(255, 182, 193, 0.7)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Text Input Area */}
          <div className="mb-2">
            <textarea
              placeholder={placeholderMessages[currentPlaceholderIndex]}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="py-2 pt-2 bg-transparent border-none outline-none text-gray-800 font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl placeholder-gray-600 resize-none align-top"
              style={{ 
                verticalAlign: 'top', 
                width: '100%', 
                paddingLeft: '2%', 
                paddingRight: '2%',
                overflow: 'auto',
                minHeight: '80px',
                maxHeight: '120px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Mid Section - Padlock Emoji and Text */}
      <div className="relative z-10 flex flex-col items-center -mt-2 sm:-mt-1">
        {/* Anonymous x-mas letter text with padlock emoji */}
        <div className="mb-4 sm:mb-6">
          <span 
            className="text-base sm:text-lg font-semibold text-white"
          >
            🔒 anonymous x-mas letter
          </span>
        </div>

        {/* Send Button - appears when user types */}
        {message.trim() && (
          <div className="mb-6 sm:mb-8 w-full px-4 text-center">
            <button 
              onClick={handleSend}
              className="py-4 sm:py-5 rounded-2xl bg-black text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ width: '75%', maxWidth: '750px', margin: '0 auto' }}
            >
              Send!
            </button>
          </div>
        )}

        {/* Spacer for when Send button is not shown - pulls elements down by default */}
        {!message.trim() && (
          <div className="mb-6 sm:mb-8"></div>
        )}
      </div>

      {/* Friends count with hand emojis - separate section */}
      <div className="relative z-10 flex items-center justify-center gap-2 mb-4 sm:mb-6" style={{ marginTop: '60px' }}>
        <span className="text-2xl">👇</span>
        <span 
          className="text-sm sm:text-base font-medium text-white"
        >
          {friendCount} friends just tapped the button
        </span>
        <span className="text-2xl">👇</span>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 text-center mb-6 w-full px-4">
        
        {/* Get your own messages button */}
        <button 
          onClick={() => navigate('/')}
          className="w-full max-w-2xl mx-auto py-4 sm:py-5 rounded-2xl bg-black text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Get your own messages!
        </button>
      </div>

      {/* Terms and Privacy */}
      <div className="relative z-10 flex items-center justify-center gap-4 mt-auto pt-4 text-xs sm:text-sm" style={{ color: '#a78b5b' }}>
        <a href="#" className="hover:underline">Terms</a>
        <span>•</span>
        <a href="#" className="hover:underline">Privacy</a>
      </div>
    </div>
  )
}

export default LetterPage

