import { useState, useEffect, useMemo } from 'react'

function Onboarding({ onGetStarted }) {
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [isClosingHowItWorks, setIsClosingHowItWorks] = useState(false)
  const [showUsernamePage, setShowUsernamePage] = useState(false)
  const [isClosingUsernamePage, setIsClosingUsernamePage] = useState(false)
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [isClosingProfilePage, setIsClosingProfilePage] = useState(false)
  const [showEmailPasswordPage, setShowEmailPasswordPage] = useState(false)
  const [isClosingEmailPasswordPage, setIsClosingEmailPasswordPage] = useState(false)
  const [showWelcomeBackPage, setShowWelcomeBackPage] = useState(false)
  const [isClosingWelcomeBackPage, setIsClosingWelcomeBackPage] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isReturningFromProfile, setIsReturningFromProfile] = useState(false)
  const [isReturningFromEmailPassword, setIsReturningFromEmailPassword] = useState(false)

  // Prevent body scrolling when onboarding is active
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
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

  const handleReceiveLetter = () => {
    setShowHowItWorks(true)
    setIsClosingHowItWorks(false)
  }

  const handleTriedElfBefore = () => {
    setShowWelcomeBackPage(true)
    setIsClosingWelcomeBackPage(false)
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
    // Stay on username page - just close the modal
    setShowCancelConfirm(false)
  }

  const handleCancelBack = () => {
    // Go back to the very beginning screen
    setShowCancelConfirm(false)
    setIsClosingUsernamePage(true)
    setTimeout(() => {
      setShowUsernamePage(false)
      setIsClosingUsernamePage(false)
      setShowHowItWorks(false)
      setIsClosingHowItWorks(false)
    }, 300)
  }

  const handleContinue = () => {
    setIsClosingUsernamePage(true)
    setIsReturningFromProfile(false)
    setTimeout(() => {
      setShowUsernamePage(false)
      setIsClosingUsernamePage(false)
      setShowProfilePage(true)
      setIsClosingProfilePage(false)
    }, 300)
  }

  const handleSkipProfile = () => {
    setIsClosingProfilePage(true)
    setIsReturningFromEmailPassword(false)
    setTimeout(() => {
      setShowProfilePage(false)
      setIsClosingProfilePage(false)
      setShowEmailPasswordPage(true)
      setIsClosingEmailPasswordPage(false)
    }, 300)
  }

  const handleCompleteSignup = () => {
    setIsClosingEmailPasswordPage(true)
    setTimeout(() => {
      setShowEmailPasswordPage(false)
      setIsClosingEmailPasswordPage(false)
      onGetStarted(username)
    }, 300)
  }

  const handleBackFromEmailPassword = () => {
    setIsClosingEmailPasswordPage(true)
    setIsReturningFromEmailPassword(true)
    setTimeout(() => {
      setShowEmailPasswordPage(false)
      setIsClosingEmailPasswordPage(false)
      setShowProfilePage(true)
      setIsClosingProfilePage(false)
      setTimeout(() => {
        setIsReturningFromEmailPassword(false)
      }, 300)
    }, 300)
  }

  const handleLoginComplete = () => {
    setIsClosingWelcomeBackPage(true)
    setTimeout(() => {
      setShowWelcomeBackPage(false)
      setIsClosingWelcomeBackPage(false)
      // For login, we'd need to fetch the username from the backend
      // For now, using a placeholder - you may want to store username in localStorage or fetch from API
      onGetStarted(username || 'USER')
    }, 300)
  }

  const handleBackFromWelcomeBack = () => {
    setIsClosingWelcomeBackPage(true)
    setTimeout(() => {
      setShowWelcomeBackPage(false)
      setIsClosingWelcomeBackPage(false)
    }, 300)
  }

  const handleChoosePhoto = () => {
    const fileInput = document.getElementById('profile-picture-input')
    if (fileInput) {
      fileInput.click()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setProfilePicture(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        alert('Please select an image file')
      }
    }
  }

  const handleBackFromProfile = () => {
    setIsClosingProfilePage(true)
    setIsReturningFromProfile(true)
    setTimeout(() => {
      setShowProfilePage(false)
      setIsClosingProfilePage(false)
      setShowUsernamePage(true)
      setIsClosingUsernamePage(false)
      setTimeout(() => {
        setIsReturningFromProfile(false)
      }, 300)
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
      {!showHowItWorks && !showUsernamePage && !showProfilePage && !showEmailPasswordPage && !showWelcomeBackPage && (
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
                  Receive X-mas Letter
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
                onClick={handleTriedElfBefore}
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
          className="fixed inset-0 z-50 overflow-hidden"
          style={{
            backgroundColor: '#ffcccc',
            animation: isClosingHowItWorks 
              ? 'slideOutToRight 0.3s ease-out' 
              : 'slideInFromRight 0.3s ease-out',
          }}
        >
          <div className="relative z-10 h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10 overflow-hidden">
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
                Globally, people receive an average of <span className="text-red-600 font-bold">14.3 X-mas letters</span>
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
                  Create Your X-mas Letter Link
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
                  Share Your Link and Receive X-mas Letters
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
                  View X-mas Letters in Your Inbox
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

      {/* Username, Profile Picture, Email/Password & Welcome Back Screens - Shared Background */}
      {(showUsernamePage || showProfilePage || showEmailPasswordPage || showWelcomeBackPage) && (
        <div 
          className="fixed inset-0 z-[60] overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, #ec4899, #dc2626, #f97316)',
            height: '100dvh',
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

          <div className="relative z-10 h-screen overflow-hidden">
            {/* Fixed Header - Back Button, Skip Button, Logo */}
            <div className="absolute inset-x-0 top-0 z-30 px-6 sm:px-8 pt-6 sm:pt-8">
              {/* Back Button */}
              <button
                onClick={showWelcomeBackPage ? handleBackFromWelcomeBack : showEmailPasswordPage ? handleBackFromEmailPassword : showProfilePage ? handleBackFromProfile : handleBackFromUsername}
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

              {/* Skip Button - only on profile page */}
              {showProfilePage && !showEmailPasswordPage && (
                <button
                  onClick={handleSkipProfile}
                  className="absolute top-6 sm:top-8 right-6 sm:right-8 z-20 text-white hover:text-white/80 transition-colors text-base sm:text-lg font-medium"
                >
                  skip
                </button>
              )}

              {/* Logo - Fixed */}
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
            </div>

            {/* Sliding Content Container */}
            <div className="h-full flex flex-col px-6 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12">
              {/* Spacer for fixed logo */}
              <div className="h-32 sm:h-40"></div>

            {/* Username Content - Slides */}
            {showUsernamePage && !showProfilePage && !showEmailPasswordPage && !showWelcomeBackPage && (
              <div 
                className="flex-1 flex flex-col"
                style={{
                  animation: isClosingUsernamePage 
                    ? 'slideOutToLeft 0.3s ease-out' 
                    : isReturningFromProfile
                    ? 'slideInFromLeft 0.3s ease-out'
                    : 'slideInFromRight 0.3s ease-out',
                }}
              >
                {/* Choose a username text */}
                <div className="flex flex-col items-center mb-8 sm:mb-12">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">
                    Choose a username
                  </h2>
                  <p className="text-sm sm:text-base text-white/80">
                    You can't change this afterwards!
                  </p>
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
                <div className="w-full max-w-sm mx-auto mt-auto">
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
            )}

            {/* Profile Picture Content - Slides */}
            {((showProfilePage && !showEmailPasswordPage && !showWelcomeBackPage) || isClosingProfilePage) && (
              <div 
                className="flex-1 flex flex-col"
                style={{
                  animation: isClosingProfilePage 
                    ? 'slideOutToLeft 0.3s ease-out' 
                    : isReturningFromEmailPassword
                    ? 'slideInFromLeft 0.3s ease-out'
                    : 'slideInFromRight 0.3s ease-out',
                }}
              >
                {/* Title */}
                <div className="flex justify-center mb-8 sm:mb-10">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    Choose a profile picture
                  </h2>
                </div>

                {/* Profile Picture Placeholder */}
                <div className="flex flex-col items-center mb-6 sm:mb-8">
                  <div className="relative">
                {/* Circular placeholder */}
                <button
                  onClick={handleChoosePhoto}
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: 'rgba(255, 192, 203, 0.95)',
                    border: '4px solid rgba(255, 192, 203, 0.7)',
                  }}
                >
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <svg 
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Person silhouette */}
                      <circle cx="50" cy="35" r="15" fill="rgba(255, 182, 193, 0.8)" />
                      <path 
                        d="M25 75 Q25 60 35 55 Q45 50 50 50 Q55 50 65 55 Q75 60 75 75 L25 75 Z" 
                        fill="rgba(255, 182, 193, 0.8)" 
                      />
                    </svg>
                  )}
                </button>
                    
                    {/* Plus icon button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleChoosePhoto()
                      }}
                      className="absolute bottom-0 right-0 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-pink-200"
                    >
                      <svg 
                        className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M12 4v16m8-8H4" 
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Description text */}
                  <p className="text-sm sm:text-base text-white/90 mt-6 sm:mt-8 text-center max-w-xs">
                    Your friends will see this photo when they visit your link
                  </p>
                </div>

                {/* Next Button */}
                <div className="w-full max-w-sm mx-auto mt-auto">
                  <button
                    onClick={handleSkipProfile}
                    className="w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-bold text-black text-base sm:text-lg md:text-xl"
                    style={{
                      backgroundColor: 'rgba(255, 182, 193, 0.95)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    Next
                  </button>
                </div>

                {/* Hidden file input */}
                <input
                  id="profile-picture-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Email/Password Content - Slides */}
            {showEmailPasswordPage && !showWelcomeBackPage && (
              <div 
                className="flex-1 flex flex-col"
                style={{
                  animation: isClosingEmailPasswordPage 
                    ? 'slideOutToRight 0.3s ease-out' 
                    : 'slideInFromRight 0.3s ease-out',
                }}
              >
                {/* Title */}
                <div className="flex flex-col items-center mb-8 sm:mb-10">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                    Create your account
                  </h2>
                  <p className="text-sm sm:text-base text-white/80">
                    Email will be used to manage your X-mas letter
                  </p>
                </div>

                {/* Email Input Field */}
                <div className="w-full max-w-sm mx-auto mb-4 sm:mb-6">
                  <div 
                    className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl bg-white/90 backdrop-blur-sm"
                    style={{
                      backgroundColor: 'rgba(255, 182, 193, 0.95)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full bg-transparent border-none outline-none text-gray-900 font-medium text-base sm:text-lg placeholder-gray-600"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password Input Field */}
                <div className="w-full max-w-sm mx-auto mb-6 sm:mb-8">
                  <div 
                    className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl bg-white/90 backdrop-blur-sm"
                    style={{
                      backgroundColor: 'rgba(255, 182, 193, 0.95)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-transparent border-none outline-none text-gray-900 font-medium text-base sm:text-lg placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Next/Complete Button */}
                <div className="w-full max-w-sm mx-auto mt-auto">
                  <button
                    onClick={handleCompleteSignup}
                    className="w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-bold text-black text-base sm:text-lg md:text-xl"
                    style={{
                      backgroundColor: 'rgba(255, 182, 193, 0.95)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Welcome Back Content - Slides */}
            {showWelcomeBackPage && (
              <div 
                className="flex-1 flex flex-col"
                style={{
                  animation: isClosingWelcomeBackPage 
                    ? 'slideOutToRight 0.3s ease-out' 
                    : 'slideInFromRight 0.3s ease-out',
                }}
              >
                {/* Title */}
                <div className="flex justify-center mb-8 sm:mb-10">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    Welcome Back
                  </h2>
                </div>

                {/* Email Input Field */}
                <div className="w-full max-w-sm mx-auto mb-4 sm:mb-6">
                  <div 
                    className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl bg-white/90 backdrop-blur-sm"
                    style={{
                      backgroundColor: 'rgba(255, 182, 193, 0.95)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full bg-transparent border-none outline-none text-gray-900 font-medium text-base sm:text-lg placeholder-gray-600"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password Input Field */}
                <div className="w-full max-w-sm mx-auto mb-6 sm:mb-8">
                  <div 
                    className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl bg-white/90 backdrop-blur-sm"
                    style={{
                      backgroundColor: 'rgba(255, 182, 193, 0.95)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-transparent border-none outline-none text-gray-900 font-medium text-base sm:text-lg placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Login Button */}
                <div className="w-full max-w-sm mx-auto mt-auto">
                  <button
                    onClick={handleLoginComplete}
                    className="w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-bold text-black text-base sm:text-lg md:text-xl"
                    style={{
                      backgroundColor: 'rgba(255, 182, 193, 0.95)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    Login
                  </button>
                </div>
              </div>
            )}
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
          onClick={handleConfirmBack}
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
                {/* Cancel Button - goes back to beginning */}
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

                {/* Back Button - stays on username page */}
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
        @keyframes slideOutToLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes slideOutToRight {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Onboarding

