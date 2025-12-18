import { collection, addDoc, query, where, getDocs, updateDoc, doc, orderBy, limit } from 'firebase/firestore'
import { db } from './config'
import { getUserIP } from './utils'

/**
 * Send a message to a user's inbox
 */
export const sendMessage = async (recipientUsername, messageText, nickname = null) => {
  try {
    if (!messageText || !messageText.trim()) {
      return { success: false, error: 'Message cannot be empty' }
    }

    if (!recipientUsername) {
      return { success: false, error: 'Recipient username is required' }
    }

    // Get user's IP address
    const userIP = await getUserIP()

    // Find recipient user by username
    const usernameLower = recipientUsername.toLowerCase().trim()
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('usernameLower', '==', usernameLower))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return { success: false, error: 'User not found' }
    }

    const recipientDoc = querySnapshot.docs[0]
    const recipientId = recipientDoc.id

    // Create message document in messages collection
    const messagesRef = collection(db, 'messages')
    const messageData = {
      recipientId: recipientId,
      recipientUsername: recipientUsername,
      message: messageText.trim(),
      read: false,
      createdAt: new Date().toISOString(),
      ipAddress: userIP || null, // Store IP address
      nickname: nickname || null, // Store nickname (optional)
    }

    const docRef = await addDoc(messagesRef, messageData)

    return { 
      success: true, 
      messageId: docRef.id 
    }
  } catch (error) {
    console.error('Error sending message:', error)
    return { success: false, error: 'Failed to send message' }
  }
}

/**
 * Get all messages for the current user
 */
export const getMessages = async (userId) => {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' }
    }

    const messagesRef = collection(db, 'messages')
    
    // Query without orderBy first (to avoid index requirement)
    // We'll sort in JavaScript instead
    const q = query(
      messagesRef, 
      where('recipientId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)

    const messages = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      messages.push({
        id: doc.id,
        ...data
      })
    })

    // Sort by createdAt in JavaScript (newest first)
    messages.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA // Descending order (newest first)
    })

    console.log('Fetched messages:', messages.length) // Debug log
    return { success: true, messages }
  } catch (error) {
    console.error('Error getting messages:', error)
    // Return empty array instead of failing completely
    return { success: false, error: error.message || 'Failed to get messages', messages: [] }
  }
}

/**
 * Mark a message as read
 */
export const markMessageAsRead = async (messageId) => {
  try {
    if (!messageId) {
      return { success: false, error: 'Message ID is required' }
    }

    const messageRef = doc(db, 'messages', messageId)
    await updateDoc(messageRef, {
      read: true,
      readAt: new Date().toISOString()
    })

    return { success: true }
  } catch (error) {
    console.error('Error marking message as read:', error)
    return { success: false, error: 'Failed to mark message as read' }
  }
}

/**
 * Get unread message count
 */
export const getUnreadCount = async (userId) => {
  try {
    if (!userId) {
      return { success: false, count: 0 }
    }

    const messagesRef = collection(db, 'messages')
    const q = query(
      messagesRef, 
      where('recipientId', '==', userId),
      where('read', '==', false)
    )
    const querySnapshot = await getDocs(q)

    return { success: true, count: querySnapshot.size }
  } catch (error) {
    console.error('Error getting unread count:', error)
    return { success: false, count: 0 }
  }
}

/**
 * Create a default welcome message for a new user
 */
export const createDefaultWelcomeMessage = async (userId, username) => {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' }
    }

    const messagesRef = collection(db, 'messages')
    const messageData = {
      recipientId: userId,
      recipientUsername: username || 'User',
      message: 'Welcome to ELF! This is your first letter. Share your link to receive more anonymous X-mas letters!',
      read: false,
      createdAt: new Date().toISOString(),
      isSystemMessage: true, // Mark as system message
      ipAddress: null, // System messages don't have IP
    }

    const docRef = await addDoc(messagesRef, messageData)

    return { 
      success: true, 
      messageId: docRef.id 
    }
  } catch (error) {
    console.error('Error creating default welcome message:', error)
    return { success: false, error: 'Failed to create welcome message' }
  }
}

