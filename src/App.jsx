import { useState } from 'react'
import Home from './Home'
import Onboarding from './Onboarding'

function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  const handleGetStarted = () => {
    setHasCompletedOnboarding(true)
  }

  if (!hasCompletedOnboarding) {
    return <Onboarding onGetStarted={handleGetStarted} />
  }

  return <Home />
}

export default App


