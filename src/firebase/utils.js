/**
 * Get user's IP address using a free IP detection service
 */
export const getUserIP = async () => {
  try {
    // Try multiple IP detection services for reliability
    const services = [
      'https://api.ipify.org?format=json',
      'https://api64.ipify.org?format=json',
      'https://ipapi.co/json/'
    ]

    for (const service of services) {
      try {
        const response = await fetch(service, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          // Different services return IP in different formats
          const ip = data.ip || data.query || data.origin
          if (ip) {
            return ip
          }
        }
      } catch (error) {
        // Try next service if this one fails
        continue
      }
    }
    
    // If all services fail, return null
    return null
  } catch (error) {
    console.error('Error getting user IP:', error)
    return null
  }
}

