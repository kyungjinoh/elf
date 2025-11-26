import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Onboarding from './Onboarding'
import LetterPage from './LetterPage'

function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [username, setUsername] = useState('')

  const handleGetStarted = (userUsername) => {
    setUsername(userUsername)
    setHasCompletedOnboarding(true)
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


