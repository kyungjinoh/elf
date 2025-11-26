import { useState, useRef, useEffect } from 'react'

function Home({ username: propUsername = '' }) {
  const [linkCopied, setLinkCopied] = useState(false)
  const [showSharePopup, setShowSharePopup] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState('/letter.png')
  const [cardText, setCardText] = useState('Send me X-mas letter!')
  const [isEditingText, setIsEditingText] = useState(false)
  const [showViewers, setShowViewers] = useState(false)
  const [isClosingViewers, setIsClosingViewers] = useState(false)
  const [showInbox, setShowInbox] = useState(false)
  const [isClosingInbox, setIsClosingInbox] = useState(false)
  const [navBarHeight, setNavBarHeight] = useState(0)
  const textInputRef = useRef(null)
  const textContainerRef = useRef(null)
  const navBarRef = useRef(null)

  // Get domain address from current location (includes port number)
  const websiteAddress = typeof window !== 'undefined' ? window.location.host : ''
  const username = propUsername || 'USER'

  // Generate dynamic link
  const userLink = `${websiteAddress}/letter/${username}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(userLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 1000)
    // Show share popup after a short delay
    setTimeout(() => {
      setShowSharePopup(true)
    }, 500)
  }

  const handleCloseSharePopup = () => {
    setShowSharePopup(false)
  }

  const handleShare = () => {
    // Copy link to clipboard
    navigator.clipboard.writeText(userLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 1000)
    // Show share popup after a short delay
    setTimeout(() => {
      setShowSharePopup(true)
    }, 500)
  }

  const handleViewersClick = () => {
    setIsClosingViewers(false)
    setShowViewers(true)
  }

  const handleCloseViewers = () => {
    setIsClosingViewers(true)
    setTimeout(() => {
      setShowViewers(false)
      setIsClosingViewers(false)
    }, 150) // Fast animation duration
  }

  const handleInboxClick = () => {
    setIsClosingInbox(false)
    setShowInbox(true)
  }

  const handleCloseInbox = () => {
    setIsClosingInbox(true)
    setTimeout(() => {
      setShowInbox(false)
      setIsClosingInbox(false)
    }, 300) // Faster animation duration
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImageUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTextChange = (e) => {
    setCardText(e.target.textContent || e.target.value)
  }

  const handleTextBlur = () => {
    setIsEditingText(false)
  }

  const handleTextFocus = () => {
    setIsEditingText(true)
    // Scroll the input into view after a short delay to ensure it's rendered
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      } else if (textContainerRef.current) {
        textContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      }
    }, 100)
  }

  useEffect(() => {
    if (isEditingText && textInputRef.current) {
      // Scroll into view when editing starts
      setTimeout(() => {
        textInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      }, 300)
    }
  }, [isEditingText])

  useEffect(() => {
    const updateNavBarHeight = () => {
      if (navBarRef.current) {
        setNavBarHeight(navBarRef.current.offsetHeight)
      }
    }
    updateNavBarHeight()
    window.addEventListener('resize', updateNavBarHeight)
    return () => window.removeEventListener('resize', updateNavBarHeight)
  }, [])

  // Generate snow circles
  const snowCircles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    size: (Math.random() * 3 + 1) * 2, // Smaller circles
  }))

  return (
    <div 
      className={`${isEditingText ? 'overflow-y-auto' : 'overflow-hidden'} flex flex-col relative`} 
      style={{ 
        background: 'linear-gradient(to bottom, #ffcccb, #ff6b6b)', 
        minHeight: '100dvh',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        boxSizing: 'border-box'
      }}
    >
      {/* Snow Effect - positioned below nav bar, behind all elements */}
      <div className="absolute top-12 sm:top-14 md:top-16 left-0 right-0 bottom-0 pointer-events-none z-0 overflow-hidden">
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

      {/* Top Navigation */}
      <nav ref={navBarRef} className="flex items-center justify-between px-4 sm:px-6 pt-2 sm:pt-3 pb-1.5 sm:pb-2 flex-shrink-0 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm relative z-10">
        <div className="flex-1 flex items-center">
          <img 
            src="/ELF-removebg-preview.png" 
            alt="ELF" 
            className="h-6 sm:h-7 md:h-8 object-contain drop-shadow-sm"
          />
        </div>
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-1 justify-center">
          <button 
            onClick={handleCloseInbox}
            className={`text-lg sm:text-xl md:text-2xl transition-all duration-200 cursor-pointer ${showInbox ? 'font-medium text-gray-400 hover:text-gray-600' : 'font-bold text-gray-900 hover:text-red-600'}`}
          >
            PLAY
          </button>
          <button 
            onClick={handleInboxClick}
            className={`text-lg sm:text-xl md:text-2xl transition-all duration-200 cursor-pointer ${showInbox ? 'font-bold text-gray-900' : 'font-medium text-gray-400 hover:text-gray-600'}`}
          >
            INBOX
          </button>
        </div>
        <div className="flex-1 flex justify-end">
          <button 
            onClick={handleViewersClick}
            className="text-gray-500 hover:text-gray-700 transition-all duration-200 cursor-pointer"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          </button>
        </div>
      </nav>

      {/* Link Copied Confirmation Overlay */}
      {linkCopied && (
        <>
          {/* Dark Backdrop - appears instantly */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-none"></div>
          
          {/* Confirmation Card - animated */}
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            style={{
              animation: 'fadeInSlideUp 0.3s ease-out',
            }}
          >
            <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-gray-200/50 backdrop-blur-sm min-w-[140px] sm:min-w-[160px] md:min-w-[180px] pointer-events-auto">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
                <span className="text-lg sm:text-xl md:text-2xl">🔗</span>
                <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Link copied!</span>
              </div>
              <div className="flex justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-700" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Share Popup - Instagram Story Style - Full Screen */}
      {showSharePopup && (
        <div 
          className="fixed inset-0 z-[70] overflow-hidden"
          style={{
            animation: 'slideUpFromBottomFull 0.4s ease-out',
            opacity: 1,
            backgroundImage: 'url(/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >

          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleCloseSharePopup}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content Container - Full Screen */}
          <div 
            className="relative w-full h-full flex flex-col items-center justify-between px-6 sm:px-8 py-12 sm:py-16"
            style={{
              minHeight: '100dvh',
              paddingTop: 'env(safe-area-inset-top, 0)',
              paddingBottom: 'env(safe-area-inset-bottom, 0)',
            }}
          >
            {/* Top Section - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              {/* Profile Image Circle */}
              <div className="relative z-10 mb-6 sm:mb-8">
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23ddd" rx="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EUser%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
              </div>

              {/* Main Text */}
              <h2 className="relative z-10 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-10 md:mb-12 drop-shadow-lg px-4">
                {cardText.toLowerCase().startsWith('send me') ? (
                  <>
                    Send me<br />
                    {cardText.substring(8).trim() || 'X-mas letter!'}
                  </>
                ) : (
                  <>
                    Send me<br />
                    {cardText || 'X-mas letter!'}
                  </>
                )}
              </h2>

              {/* Link Button */}
              <div className="relative z-10 w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] mb-6 sm:mb-8 md:mb-10">
                <div className="w-full rounded-xl sm:rounded-2xl py-2.5 sm:py-3 md:py-3.5 px-3 sm:px-4 md:px-5 flex items-center justify-center gap-1.5 sm:gap-2 border-2 border-dashed border-white">
                  <span className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center gap-1.5">
                    <span>Paste</span>
                    <img src="/link.png" alt="Link" className="h-6 w-auto sm:h-7 md:h-8 object-contain" />
                    <span>here</span>
                  </span>
                </div>
              </div>

              {/* Upward Arrows */}
              <div className="relative z-10 flex gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
                {[1, 2, 3].map((i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white drop-shadow-lg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Bottom Section - Fixed at Bottom */}
            <div className="relative z-10 w-full flex flex-col items-center gap-2 sm:gap-3 -mt-8 sm:-mt-10 md:-mt-12">
              {/* ELF Logo and anonymous x-mas letter */}
              <div className="text-center">
                <img 
                  src="/ELF-removebg-preview.png" 
                  alt="ELF" 
                  className="h-8 sm:h-10 md:h-12 object-contain mx-auto mb-2 drop-shadow-md"
                />
                <p className="text-white/90 text-sm sm:text-base md:text-lg drop-shadow-md">
                  anonymous x-mas letter
                </p>
              </div>

              {/* Screenshot instruction with dark background */}
              <div className="w-screen bg-black py-3 sm:py-4 md:py-5 -mx-6 sm:-mx-8">
                <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold drop-shadow-md text-center">
                  Screenshot and post in your story
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Views Screen */}
      {showViewers && (
        <div 
          className="fixed inset-0 bg-white overflow-y-auto"
          style={{
            zIndex: 60,
            animation: isClosingViewers 
              ? 'slideOutToRight 0.15s ease-in' 
              : 'slideInFromRight 0.3s ease-out',
          }}
        >
          {/* Top Navigation */}
          <nav className="flex items-center justify-between px-4 sm:px-6 pt-2 sm:pt-3 pb-2 sm:pb-3 border-b border-gray-200 bg-white sticky top-0 z-10">
            <button 
              onClick={handleCloseViewers}
              className="text-gray-900 hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Recent Views</h1>
            <div className="w-6"></div> {/* Spacer for centering */}
          </nav>

          {/* View Notifications List */}
          <div className="py-2">
            {[
              { time: '33 minutes ago' },
              { time: '35 minutes ago' },
              { time: '2 hours ago' },
              { time: '2 hours ago' },
              { time: '2 hours ago' },
              { time: '2 hours ago' },
              { time: '4 hours ago' },
            ].map((view, index) => (
              <div 
                key={index}
                className="flex items-center px-4 sm:px-6 py-5 sm:py-6 md:py-7 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* Avatar Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 overflow-hidden">
                  <img 
                    src="/eyes.png" 
                    alt="Eyes" 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      // Fallback to placeholder if image doesn't exist
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23ddd" rx="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EUser%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium" style={{ color: '#be2616' }}>New view!</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{view.time}</p>
                </div>

                {/* Chevron */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INBOX Screen */}
      {showInbox && (
        <div 
          className="fixed left-0 right-0 z-50"
          style={{
            top: navBarHeight > 0 ? `${navBarHeight}px` : '3rem',
            bottom: 0,
            height: navBarHeight > 0 ? `calc(100dvh - ${navBarHeight}px)` : 'calc(100dvh - 3rem)',
            maxHeight: navBarHeight > 0 ? `calc(100dvh - ${navBarHeight}px)` : 'calc(100dvh - 3rem)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            animation: isClosingInbox 
              ? 'slideOutToRight 0.3s ease-out' 
              : 'slideInFromRight 0.3s ease-out',
          }}
        >
          {/* Bottom Gradient Fade */}
          <div 
            className="fixed bottom-0 left-0 right-0 h-32 sm:h-40 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to top, rgba(255, 204, 203, 1) 0%, rgba(255, 204, 203, 0.8) 30%, rgba(255, 204, 203, 0) 100%)',
            }}
          ></div>
          
          {/* Message Grid */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-6 md:pt-8 pb-16 sm:pb-20">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {/* Active/Unread Messages (Top 6) */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`active-${index}`}
                  className="aspect-square rounded-xl flex items-center justify-center shadow-md"
                  style={{
                    background: 'linear-gradient(to bottom, #ec4899, #f97316)',
                  }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src="/loveletter.png"
                      alt="Love Letter"
                      className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23ddd" rx="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ELetter%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Inactive/Read Messages (Bottom 9) */}
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={`inactive-${index}`}
                  className="aspect-square rounded-xl bg-gray-200 flex items-center justify-center shadow-sm"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src="/loveletter.png"
                      alt="Love Letter"
                      className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain opacity-70"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23ddd" rx="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ELetter%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Card Carousel */}
      <div 
        className={`px-2 sm:px-4 flex-1 flex flex-col justify-center min-h-0 ${isEditingText ? 'overflow-y-auto' : 'overflow-hidden'} pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-2 sm:pb-3 md:pb-4 relative z-10`}
        style={{
          transform: isClosingInbox ? 'translateX(0)' : (showInbox ? 'translateX(100%)' : 'translateX(0)'),
          animation: isClosingInbox ? 'slideInFromLeft 0.3s ease-out' : 'none',
        }}
      >
        <div className="relative flex-1 flex items-center justify-center min-h-0">
          {/* Main Card - Not draggable */}
          <div 
            className="w-[calc(100%-6rem)] sm:w-[calc(100%-8rem)] md:w-[calc(100%-10rem)] lg:w-[calc(100%-12rem)] xl:w-[calc(100%-14rem)] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-[92%] max-h-[92%] transition-all duration-300 shadow-lg"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
            onMouseMove={(e) => {
              const card = e.currentTarget
              const rect = card.getBoundingClientRect()
              const x = e.clientX - rect.left
              const y = e.clientY - rect.top
              const centerX = rect.width / 2
              const centerY = rect.height / 2
              const rotateX = (y - centerY) / 20
              const rotateY = (centerX - x) / 20
              card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
            }}
          >
              {/* Orange Top Section */}
              <div className="flex-[3] flex flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-12 xl:py-14 relative" style={{ background: 'linear-gradient(to bottom, #be2616 0%, #dc2626 50%, #f97316 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
                {/* Profile Image */}
                <div className="flex justify-center mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 relative z-10">
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-full bg-white/20 blur-xl"></div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="profile-image-input"
                    />
                    <label htmlFor="profile-image-input" className="cursor-pointer">
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full object-cover border-4 border-white shadow-2xl relative z-10 transition-transform duration-300 hover:scale-105 group-hover:opacity-90"
                        onError={(e) => {
                          // Fallback to placeholder if image doesn't exist
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23ddd" rx="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EUser%3C/text%3E%3C/svg%3E'
                        }}
                      />
                      <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* White Bottom Section */}
              <div ref={textContainerRef} className="flex-[0.75] flex items-center justify-center bg-white py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 px-3 sm:px-4">
                {isEditingText ? (
                  <input
                    ref={textInputRef}
                    type="text"
                    value={cardText}
                    onChange={(e) => setCardText(e.target.value)}
                    onBlur={handleTextBlur}
                    onFocus={handleTextFocus}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.target.blur()
                      }
                    }}
                    className="text-center text-gray-800 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-relaxed tracking-tight w-full bg-transparent border-b-2 border-red-500 focus:outline-none focus:border-red-600"
                    autoFocus
                  />
                ) : (
                  <p
                    onClick={handleTextFocus}
                    className="text-center text-gray-800 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-relaxed tracking-tight cursor-text hover:bg-gray-50 rounded px-2 py-1 transition-colors break-words"
                  >
                    {cardText || 'Send me X-mas letter!'}
                  </p>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* Link & Share Section */}
      <div 
        className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 mt-2 sm:mt-3 md:mt-4 space-y-2 sm:space-y-2.5 md:space-y-3 pb-6 sm:pb-8 md:pb-10 lg:pb-12 flex-shrink-0 relative z-10"
        style={{
          transform: isClosingInbox ? 'translateX(0)' : (showInbox ? 'translateX(100%)' : 'translateX(0)'),
          animation: isClosingInbox ? 'slideInFromLeft 0.3s ease-out' : 'none',
        }}
      >
        {/* Step 1: Copy Link */}
        <div className="backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg border border-red-200/60 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]" style={{ backgroundColor: 'rgba(255, 204, 203, 0.85)' }}>
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5 text-center tracking-tight">
            Step 1: Copy your link
          </h3>
          <div className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4 md:mb-5 lg:mb-6 font-sans font-medium tracking-wide text-center break-all px-2 rounded-lg py-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
            {userLink}
          </div>
          <div className="flex justify-center">
            <div 
              className="w-1/2 sm:w-2/5 md:w-1/3 rounded-3xl p-[3px] transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #be2616 0%, #dc2626 50%, #ef4444 100%)',
              }}
            >
              <button
                onClick={handleCopyLink}
                className="w-full py-1.5 sm:py-2 md:py-2.5 lg:py-3 px-3 sm:px-4 rounded-3xl bg-white font-semibold transition-all duration-300 text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                style={{
                  color: '#be2616',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fef2f2'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white'
                }}
              >
                <span className="text-base sm:text-lg md:text-xl">🔗</span>
                <span>{linkCopied ? 'Copied!' : 'copy link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Share Link */}
        <div className="backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-lg border border-red-200/60 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]" style={{ backgroundColor: 'rgba(255, 204, 203, 0.85)' }}>
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-5 sm:mb-6 md:mb-7 text-center tracking-tight">
            Step 2: Share link on your Story
          </h3>
          <div className="flex justify-center">
            <button 
              onClick={handleShare}
              className="w-1/2 sm:w-2/5 md:w-1/3 py-2.5 sm:py-3 md:py-3.5 lg:py-4 px-3 sm:px-4 rounded-3xl text-white font-semibold shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transform" 
              style={{ background: 'linear-gradient(135deg, #be2616 0%, #dc2626 50%, #ef4444 100%)' }}
            >
              <div className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full border-2 border-white/90 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="drop-shadow-sm text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">Share!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home


