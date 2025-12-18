import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from './firebase/config'
import { sendMessage } from './firebase/messages'
import { trackView } from './firebase/views'

function LetterPage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [nickname, setNickname] = useState('')
  const [showMessageSent, setShowMessageSent] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [profilePictureUrl, setProfilePictureUrl] = useState('/letter.png')
  const [userMessage, setUserMessage] = useState('send me anonymous X-mas letter!')
  const [isSending, setIsSending] = useState(false)
  const hasTrackedView = useRef(false)
  
  const handleSend = async () => {
    if (!message.trim()) {
      return
    }

    setIsSending(true)
    
    try {
      // Send message to recipient's inbox
      const result = await sendMessage(username, message, nickname.trim() || null)
      
      if (result.success) {
        setShowMessageSent(true)
        setCountdown(5) // Reset countdown when message is sent
        setMessage('') // Clear the message
        setNickname('') // Clear the nickname
      } else {
        alert(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
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

  // Track view when page loads (only once per page load)
  useEffect(() => {
    const trackPageView = async () => {
      if (!username || hasTrackedView.current) return
      
      hasTrackedView.current = true
      
      try {
        await trackView(username)
      } catch (error) {
        console.error('Error tracking view:', error)
        // Don't show error to user, just log it
        hasTrackedView.current = false // Reset on error so it can retry
      }
    }

    trackPageView()
  }, [username])

  // Fetch user data (profile picture and message) based on username
  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return

      try {
        const usernameLower = username.toLowerCase().trim()
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('usernameLower', '==', usernameLower))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data()
          
          // Set profile picture
          if (userDoc.profilePictureUrl) {
            setProfilePictureUrl(userDoc.profilePictureUrl)
          }

          // Set user message (cardText) - check if it exists in Firestore
          // For now, we'll need to add cardText to the user document
          // If it doesn't exist, use the default message
          if (userDoc.cardText) {
            setUserMessage(userDoc.cardText)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Keep default values if there's an error
      }
    }

    fetchUserData()
  }, [username])

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
        className="flex flex-col items-center justify-center px-4 py-6 sm:py-8 relative"
        style={{
          minHeight: '100dvh',
          background: 'linear-gradient(to bottom, #ec4899 0%, #dc2626 25%, #f97316 100%)',
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

        {/* Message Sent Screen */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Letter Delivered Title */}
          <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 md:mb-4 lg:mb-6">
            Letter Delivered
          </h1>
          
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-8 md:mb-6 lg:mb-8 px-4">
            @{username ? username.toUpperCase() : 'USER'} + 15 Others Wants To Send You Letters!
          </h2>

          {/* Love Letter Image */}
          <div className="mb-6 sm:mb-8 md:mb-6 lg:mb-8">
            <img 
              src="/loveletter.png" 
              alt="Love Letter" 
              className="max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm mx-auto"
            />
          </div>

          {/* Receive Letter Button */}
          <div 
            className="w-full max-w-md mx-auto relative"
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
      className="flex flex-col items-center justify-start px-4 py-6 sm:py-8 md:py-6 lg:py-8 relative"
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(to bottom, #ec4899 0%, #dc2626 25%, #f97316 100%)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
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
      <div className="relative z-10 w-full max-w-xs sm:max-w-[280px] md:max-w-xs lg:max-w-sm xl:max-w-sm mb-6 sm:mb-8 md:mb-6 lg:mb-8 mt-8 sm:mt-12 md:mt-8 lg:mt-10 rounded-3xl overflow-hidden shadow-2xl">
        {/* White Header Section */}
        <div className="bg-white px-4 sm:px-6 md:px-4 lg:px-5 py-2 sm:py-3 md:py-2 lg:py-3 flex items-center gap-3 sm:gap-4 md:gap-3 lg:gap-4">
          {/* Profile Picture */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden flex-shrink-0 bg-pink-100 flex items-center justify-center">
            <img 
              src={profilePictureUrl}
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/letter.png'
              }}
            />
          </div>
          
          {/* Username and Message */}
          <div className="flex-1 min-w-0">
            <div className="text-sm sm:text-base md:text-sm lg:text-base font-semibold text-gray-900">
              @{username ? username.toUpperCase() : 'USER'}
            </div>
            <div className="text-sm sm:text-base md:text-sm lg:text-base font-bold text-gray-900 mt-0.5">
              {userMessage}
            </div>
          </div>
        </div>

        {/* Translucent Pink/Red Body */}
        <div 
          className="px-4 sm:px-6 md:px-4 lg:px-5 py-3 sm:py-4 md:py-3 lg:py-4 relative"
          style={{
            backgroundColor: 'rgba(255, 182, 193, 0.7)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Nickname Input Area */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Nickname (optional)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="py-1 pt-1 bg-transparent border-none outline-none text-gray-700 font-normal text-sm sm:text-base md:text-sm lg:text-base placeholder-gray-500 italic resize-none align-top"
              style={{ 
                verticalAlign: 'top', 
                width: '100%', 
                paddingLeft: '2%', 
                paddingRight: '2%',
                borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>
          
          {/* Text Input Area */}
          <div className="mb-2">
            <textarea
              placeholder={placeholderMessages[currentPlaceholderIndex]}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="py-2 pt-2 bg-transparent border-none outline-none text-gray-800 font-medium text-xl sm:text-2xl md:text-xl lg:text-2xl placeholder-gray-600 resize-none align-top"
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
        <div className="mb-4 sm:mb-6 md:mb-4 lg:mb-6">
          <span 
            className="text-base sm:text-lg md:text-base lg:text-lg font-semibold text-white"
          >
            🔒 anonymous x-mas letter
          </span>
        </div>

        {/* Send Button - appears when user types */}
        {message.trim() && (
          <div className="mb-6 sm:mb-8 md:mb-6 lg:mb-8 w-full px-4 text-center">
            <button 
              onClick={handleSend}
              disabled={isSending}
              className="py-4 sm:py-5 md:py-4 lg:py-5 rounded-2xl bg-black text-white font-bold text-base sm:text-lg md:text-base lg:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ width: '75%', maxWidth: '750px', margin: '0 auto' }}
            >
              {isSending ? 'Sending...' : 'Send!'}
            </button>
          </div>
        )}

        {/* Spacer for when Send button is not shown - pulls elements down by default */}
        {!message.trim() && (
          <div className="mb-6 sm:mb-8 md:mb-6 lg:mb-8"></div>
        )}
      </div>

      {/* Friends count with hand emojis - separate section */}
      <div className="relative z-10 flex items-center justify-center gap-2 mb-4 sm:mb-6 md:mb-4 lg:mb-6" style={{ marginTop: '60px' }}>
        <span className="text-2xl">👇</span>
        <span 
          className="text-sm sm:text-base md:text-sm lg:text-base font-medium text-white"
        >
          {friendCount} friends just tapped the button
        </span>
        <span className="text-2xl">👇</span>
      </div>

      {/* Bottom Section */}
      <div 
        className="relative z-10 text-center w-full px-4"
        style={{
          marginBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        
        {/* Get your own messages button */}
        <button 
          onClick={() => navigate('/')}
          className="w-full max-w-2xl mx-auto py-4 sm:py-5 md:py-4 lg:py-5 rounded-2xl bg-black text-white font-bold text-base sm:text-lg md:text-base lg:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Get your own messages!
        </button>
      </div>

    </div>
  )
}

export default LetterPage

