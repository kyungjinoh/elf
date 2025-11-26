import { collection, addDoc, query, where, getDocs, doc } from 'firebase/firestore'
import { db } from './config'

/**
 * Get or create a unique visitor ID (stored in localStorage)
 */
const getVisitorId = () => {
  let visitorId = localStorage.getItem('elf_visitor_id')
  if (!visitorId) {
    // Generate a unique ID
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('elf_visitor_id', visitorId)
  }
  return visitorId
}

// Track ongoing view operations to prevent duplicates
const ongoingViewOperations = new Map()

/**
 * Track a view when someone visits a user's letter page
 * Only creates one view per unique visitor per user
 */
export const trackView = async (username) => {
  try {
    if (!username) {
      return { success: false, error: 'Username is required' }
    }

    // Get unique visitor ID
    const visitorId = getVisitorId()

    // Create a unique key for this operation
    const operationKey = `${username}_${visitorId}`
    
    // If there's already an ongoing operation for this username+visitor, wait for it
    if (ongoingViewOperations.has(operationKey)) {
      return await ongoingViewOperations.get(operationKey)
    }

    // Create a promise for this operation
    const operationPromise = (async () => {
      try {
        // Find user by username
        const usernameLower = username.toLowerCase().trim()
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('usernameLower', '==', usernameLower))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          return { success: false, error: 'User not found' }
        }

        const userDoc = querySnapshot.docs[0]
        const userId = userDoc.id

        // Check if this visitor has already viewed this user's page
        const viewsRef = collection(db, 'views')
        const existingViewQuery = query(
          viewsRef,
          where('userId', '==', userId),
          where('visitorId', '==', visitorId)
        )
        const existingViewSnapshot = await getDocs(existingViewQuery)

        // If visitor has already viewed, don't do anything
        if (!existingViewSnapshot.empty) {
          return { 
            success: true, 
            viewId: existingViewSnapshot.docs[0].id,
            isNew: false
          }
        }

        // Create new view document only for first-time visitors
        const now = new Date()
        const timestamp = now.getTime()
        const viewData = {
          userId: userId,
          username: username,
          visitorId: visitorId,
          createdAt: now.toISOString(),
          timestamp: timestamp
        }

        const docRef = await addDoc(viewsRef, viewData)
        return { 
          success: true, 
          viewId: docRef.id,
          isNew: true
        }
      } finally {
        // Remove from ongoing operations after a short delay
        setTimeout(() => {
          ongoingViewOperations.delete(operationKey)
        }, 1000)
      }
    })()

    // Store the promise
    ongoingViewOperations.set(operationKey, operationPromise)
    
    return await operationPromise
  } catch (error) {
    console.error('Error tracking view:', error)
    return { success: false, error: 'Failed to track view' }
  }
}

/**
 * Get all views for the current user
 */
export const getViews = async (userId) => {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required', views: [] }
    }

    const viewsRef = collection(db, 'views')
    const q = query(
      viewsRef, 
      where('userId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)

    const views = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      views.push({
        id: doc.id,
        ...data
      })
    })

    // Remove duplicates - keep only the most recent view per visitor
    const uniqueViews = {}
    views.forEach(view => {
      const key = view.visitorId || view.id // Use visitorId if available, otherwise use document ID
      if (!uniqueViews[key] || (view.timestamp || (view.createdAt ? new Date(view.createdAt).getTime() : 0)) > 
          (uniqueViews[key].timestamp || (uniqueViews[key].createdAt ? new Date(uniqueViews[key].createdAt).getTime() : 0))) {
        uniqueViews[key] = view
      }
    })

    // Convert back to array and sort by createdAt (newest first)
    const uniqueViewsArray = Object.values(uniqueViews)
    uniqueViewsArray.sort((a, b) => {
      const timeA = a.timestamp || (a.createdAt ? new Date(a.createdAt).getTime() : 0)
      const timeB = b.timestamp || (b.createdAt ? new Date(b.createdAt).getTime() : 0)
      return timeB - timeA // Descending order (newest first)
    })

    return { success: true, views: uniqueViewsArray }
  } catch (error) {
    console.error('Error getting views:', error)
    return { success: false, error: error.message || 'Failed to get views', views: [] }
  }
}

/**
 * Format time ago string
 */
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Unknown time'
  
  const now = new Date().getTime()
  const viewTime = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp
  const diff = now - viewTime
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else {
    return 'Just now'
  }
}

