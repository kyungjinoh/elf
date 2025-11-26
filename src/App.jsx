import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Onboarding from './Onboarding'
import LetterPage from './LetterPage'
import SchoolPage from './SchoolPage'
import { onAuthStateChange, getCurrentUser } from './firebase/auth'

function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [username, setUsername] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isMobile, setIsMobile] = useState(true)

  // Detect if device is mobile (phone only, not iPad/desktop)
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      
      // Check if it's an iPad (iPadOS 13+ reports as MacIntel with touch)
      const isIPad = /iPad/.test(userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      
      // Allow only mobile phones (width < 768px and not iPad)
      // Block iPad (any width) and desktop/laptop (width >= 768px)
      const isMobile = width < 768 && !isIPad
      
      setIsMobile(isMobile)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)
    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])

  const handleGetStarted = (userUsername) => {
    setUsername(userUsername)
    setHasCompletedOnboarding(true)
  }

  // Check if user is already logged in on mount and preload images
  useEffect(() => {
    let hasFinishedLoading = false
    
    // Always preload link.png and letter.png
    const linkImagePromise = new Promise((resolve) => {
      const linkImage = new Image()
      linkImage.onload = resolve
      linkImage.onerror = resolve
      linkImage.src = '/link.png'
    })

    const letterImagePromise = new Promise((resolve) => {
      const letterImage = new Image()
      letterImage.onload = resolve
      letterImage.onerror = resolve
      letterImage.src = '/letter.png'
    })

    // Check authentication
    const unsubscribe = onAuthStateChange(async (user) => {
      if (hasFinishedLoading) return // Prevent multiple calls
      
      const imagesToLoad = [linkImagePromise, letterImagePromise]
      
      if (user) {
        // User is signed in, get their data
        try {
          const result = await getCurrentUser()
          if (result.success && result.user.username) {
            setUsername(result.user.username)
            setHasCompletedOnboarding(true)
            
            // Cache profile picture if available
            if (result.user.profilePictureUrl) {
              localStorage.setItem('profilePictureUrl', result.user.profilePictureUrl)
              
              // Preload the profile picture
              imagesToLoad.push(
                new Promise((resolve) => {
                  const profileImage = new Image()
                  profileImage.onload = resolve
                  profileImage.onerror = resolve
                  profileImage.src = result.user.profilePictureUrl
                })
              )
            }
          }
        } catch (error) {
          console.error('Error getting current user:', error)
        }
      } else {
        // User is signed out
        setHasCompletedOnboarding(false)
        setUsername('')
        localStorage.removeItem('profilePictureUrl')
      }

      // Wait for all images to load before ending loading screen
      await Promise.all(imagesToLoad)
      hasFinishedLoading = true
      setIsCheckingAuth(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center"
        style={{
          background: 'linear-gradient(to bottom, #ec4899 0%, #dc2626 25%, #f97316 100%)',
        }}
      >
        <img 
          src="/ELF-removebg-preview.png" 
          alt="ELF" 
          className="h-24 w-auto sm:h-32 md:h-40 object-contain drop-shadow-2xl animate-pulse"
          style={{
            filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))',
          }}
        />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Letter Page Route - Public, accessible on all devices */}
        <Route path="/letter/:username" element={<LetterPage />} />
        
        {/* School Page Route - Public, accessible on all devices */}
        <Route path="/school/:schoolName" element={<SchoolPage />} />
        
        {/* Main App Routes - Mobile only */}
        <Route 
          path="*" 
          element={
            !isMobile ? (
              // Show mobile-only message for desktop/iPad on main app routes
              <div 
                className="fixed inset-0 flex items-center justify-center px-4"
                style={{
                  background: 'linear-gradient(to bottom, #ec4899 0%, #dc2626 25%, #f97316 100%)',
                }}
              >
                <div className="text-center max-w-md">
                  <img 
                    src="/ELF-removebg-preview.png" 
                    alt="ELF" 
                    className="h-32 w-auto mx-auto mb-8 object-contain drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))',
                    }}
                  />
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    Please use mobile to view
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 drop-shadow-md">
                    This app is optimized for mobile devices. Please open it on your phone for the best experience.
                  </p>
                  <div className="mt-8 text-6xl animate-bounce">📱</div>
                </div>
              </div>
            ) : !hasCompletedOnboarding ? (
              <Onboarding onGetStarted={handleGetStarted} />
            ) : (
              <Home username={username} />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App


