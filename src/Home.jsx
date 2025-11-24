import { useState, useRef, useEffect } from 'react'

function Home() {
  const [linkCopied, setLinkCopied] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState('/profile.png')
  const [cardText, setCardText] = useState('send a name for a friendship tbh')
  const [isEditingText, setIsEditingText] = useState(false)
  const textInputRef = useRef(null)
  const textContainerRef = useRef(null)

  const handleCopyLink = () => {
    navigator.clipboard.writeText('NGL.LINK/KINGEBERE_/TBH')
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
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

  // Generate snowflakes
  const snowflakes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    size: (Math.random() * 4 + 2) * 5,
  }))

  return (
    <div 
      className={`${isEditingText ? 'overflow-y-auto' : 'overflow-hidden'} flex flex-col relative`} 
      style={{ 
        background: 'linear-gradient(to bottom, #ffcccb, #ff6b6b)', 
        height: '100dvh',
        minHeight: '100vh',
        maxHeight: '100dvh',
        paddingTop: 'max(env(safe-area-inset-top, 0), 0px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0), 0px)',
        paddingLeft: 'max(env(safe-area-inset-left, 0), 0px)',
        paddingRight: 'max(env(safe-area-inset-right, 0), 0px)',
        boxSizing: 'border-box'
      }}
    >
      {/* Snow Effect */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {snowflakes.map((snowflake) => (
          <div
            key={snowflake.id}
            className="absolute text-white snowflake"
            style={{
              left: `${snowflake.left}%`,
              top: '-100px',
              animationDelay: `${snowflake.delay}s`,
              animationDuration: `${snowflake.duration}s`,
              fontSize: `${snowflake.size}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* ELF Header */}
      <div className="text-center py-1.5 border-b border-gray-200 flex-shrink-0 bg-white/95 backdrop-blur-sm shadow-sm">
        <img 
          src="/ELF-removebg-preview.png" 
          alt="ELF" 
          className="h-8 sm:h-10 md:h-12 mx-auto object-contain drop-shadow-sm"
        />
      </div>
      
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-4 sm:px-6 pt-2 sm:pt-3 pb-1.5 sm:pb-2 flex-shrink-0 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex-1"></div>
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-1 justify-center">
          <button className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 transition-all duration-200 hover:text-red-600 cursor-pointer">PLAY</button>
          <button className="text-lg sm:text-xl md:text-2xl font-medium text-gray-400 transition-all duration-200 hover:text-gray-600 cursor-pointer">INBOX</button>
        </div>
        <div className="flex-1 flex justify-end">
          <button className="text-gray-500 hover:text-gray-700 transition-all duration-200 cursor-pointer">
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

      {/* Main Card Carousel */}
      <div className={`px-2 sm:px-4 flex-1 flex flex-col justify-center min-h-0 ${isEditingText ? 'overflow-y-auto' : 'overflow-hidden'} pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-2 sm:pb-3 md:pb-4`}>
        <div className="relative flex-1 flex items-center min-h-0">
          {/* Card Container */}
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full h-full max-h-full">
            {/* Left card (partial) */}
            <div className="flex-shrink-0 w-12 sm:w-16 md:w-20 lg:w-24 xl:w-28"></div>
            
            {/* Main Card */}
            <div className="flex-shrink-0 w-[calc(100%-6rem)] sm:w-[calc(100%-8rem)] md:w-[calc(100%-10rem)] lg:w-[calc(100%-12rem)] xl:w-[calc(100%-14rem)] mx-1 sm:mx-2 rounded-2xl sm:rounded-3xl overflow-hidden snap-center flex flex-col h-[85%] max-h-[85%] my-auto transition-all duration-300">
              {/* Orange Top Section */}
              <div className="flex-[3] flex flex-col items-center justify-center py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 relative" style={{ backgroundColor: '#be2616' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
                {/* Profile Image */}
                <div className="flex justify-center mb-2 sm:mb-3 md:mb-4 lg:mb-5 relative z-10">
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
              <div ref={textContainerRef} className="flex-[1] flex items-center justify-center bg-white py-1.5 sm:py-2 md:py-2.5 lg:py-3 xl:py-4 px-3 sm:px-4">
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
                    className="text-center text-gray-800 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold leading-tight tracking-tight w-full bg-transparent border-b-2 border-red-500 focus:outline-none focus:border-red-600"
                    autoFocus
                  />
                ) : (
                  <p
                    onClick={handleTextFocus}
                    className="text-center text-gray-800 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold leading-tight tracking-tight cursor-text hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                  >
                    {cardText || 'send a name for a friendship tbh'}
                  </p>
                )}
              </div>
            </div>

            {/* Right card (partial) */}
            <div className="flex-shrink-0 w-12 sm:w-16 md:w-20 lg:w-24 xl:w-28"></div>
          </div>
        </div>
      </div>

      {/* Link & Share Section */}
      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 mt-2 sm:mt-3 md:mt-4 space-y-2 sm:space-y-2.5 md:space-y-3 pb-6 sm:pb-8 md:pb-10 lg:pb-12 flex-shrink-0">
        {/* Step 1: Copy Link */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-lg border border-red-100/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-5 sm:mb-6 md:mb-7 text-center tracking-tight">
            Step 1: Copy your link
          </h3>
          <div className="text-gray-600 text-xs sm:text-sm md:text-base mb-5 sm:mb-6 md:mb-7 lg:mb-8 font-mono tracking-wide text-center break-all px-2 bg-gray-50/50 rounded-lg py-2 border border-gray-200/50">
            NGL.LINK/KINGEBERE_/TBH
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full py-3.5 sm:py-4 md:py-4.5 lg:py-5 px-3 sm:px-4 rounded-3xl border-2 bg-white font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            style={{
              borderColor: '#be2616',
              color: '#be2616',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#fef2f2'
              e.target.style.borderColor = '#dc2626'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white'
              e.target.style.borderColor = '#be2616'
            }}
          >
            {linkCopied ? 'Copied!' : 'copy link'}
          </button>
        </div>

        {/* Step 2: Share Link */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 lg:p-8 shadow-lg border border-red-100/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-5 sm:mb-6 md:mb-7 text-center tracking-tight">
            Step 2: Share link on your Instagram Story
          </h3>
          <button className="w-full py-4 sm:py-4.5 md:py-5 lg:py-6 px-3 sm:px-4 rounded-3xl text-white font-semibold shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base hover:scale-105 active:scale-95 transform" style={{ background: 'linear-gradient(135deg, #be2616 0%, #dc2626 50%, #ef4444 100%)' }}>
            <div className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white/90 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
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
            <span className="drop-shadow-sm">Share!</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home

