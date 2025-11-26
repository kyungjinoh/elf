import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Onboarding from './Onboarding'
import LetterPage from './LetterPage'
import { onAuthStateChange, getCurrentUser } from './firebase/auth'

function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [username, setUsername] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

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
        {/* Letter Page Route - Public, accessible without onboarding */}
        <Route path="/letter/:username" element={<LetterPage />} />
        
        {/* Main App Routes */}
        <Route 
          path="*" 
          element={
            !hasCompletedOnboarding ? (
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


