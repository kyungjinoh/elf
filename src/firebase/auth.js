import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db, storage } from './config'
import { createDefaultWelcomeMessage } from './messages'

/**
 * Check if username is available
 */
export const checkUsernameAvailability = async (username) => {
  try {
    const usernameLower = username.toLowerCase().trim()
    
    if (!usernameLower || usernameLower.length < 3) {
      return { available: false, error: 'Username must be at least 3 characters' }
    }

    if (!/^[a-z0-9_]+$/.test(usernameLower)) {
      return { available: false, error: 'Username can only contain letters, numbers, and underscores' }
    }

    // Check if username exists in Firestore
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('usernameLower', '==', usernameLower))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      return { available: false, error: 'Username is already taken' }
    }

    return { available: true }
  } catch (error) {
    console.error('Error checking username:', error)
    return { available: false, error: 'Error checking username availability' }
  }
}

/**
 * Upload profile picture to Firebase Storage
 */
export const uploadProfilePicture = async (file, userId) => {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Please upload an image.' }
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 5MB' }
    }

    // Create storage reference
    const storageRef = ref(storage, `profile-pictures/${userId}/${Date.now()}_${file.name}`)
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file)
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return { success: true, url: downloadURL }
  } catch (error) {
    console.error('Error uploading profile picture:', error)
    return { success: false, error: 'Failed to upload profile picture' }
  }
}

/**
 * Sign up new user
 * @param {string} username - Username
 * @param {string} email - Email address
 * @param {string} password - Password
 * @param {File} profilePictureFile - Optional profile picture file (will be uploaded)
 */
export const signUp = async (username, email, password, profilePictureFile = null) => {
  try {
    // Validate inputs
    if (!username || username.trim().length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' }
    }

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' }
    }

    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' }
    }

    const usernameLower = username.toLowerCase().trim()

    // Check username availability
    const usernameCheck = await checkUsernameAvailability(username)
    if (!usernameCheck.available) {
      return { success: false, error: usernameCheck.error }
    }

    // Create user account with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Upload profile picture if provided (now we have the actual user ID)
    let profilePictureUrl = null
    if (profilePictureFile) {
      const uploadResult = await uploadProfilePicture(profilePictureFile, user.uid)
      if (uploadResult.success) {
        profilePictureUrl = uploadResult.url
      } else {
        // If upload fails, we still create the user but without profile picture
        console.warn('Profile picture upload failed:', uploadResult.error)
      }
    }

    // Create user document in Firestore
    const userDoc = {
      username: username.trim(),
      usernameLower: usernameLower,
      email: email.toLowerCase().trim(),
      profilePictureUrl: profilePictureUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await setDoc(doc(db, 'users', user.uid), userDoc)

    // Create default welcome message for new user
    try {
      await createDefaultWelcomeMessage(user.uid, username.trim())
    } catch (error) {
      // Don't fail signup if welcome message creation fails
      console.warn('Failed to create welcome message:', error)
    }

    return { 
      success: true, 
      user: {
        uid: user.uid,
        ...userDoc
      }
    }
  } catch (error) {
    console.error('Error signing up:', error)
    
    // Handle Firebase Auth errors
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, error: 'This email is already registered' }
    }
    if (error.code === 'auth/weak-password') {
      return { success: false, error: 'Password is too weak' }
    }
    if (error.code === 'auth/invalid-email') {
      return { success: false, error: 'Invalid email address' }
    }

    return { success: false, error: error.message || 'Failed to create account' }
  }
}

/**
 * Sign in existing user
 */
export const signIn = async (email, password) => {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' }
    }

    if (!password) {
      return { success: false, error: 'Please enter your password' }
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user data from Firestore
    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      return { success: false, error: 'User data not found' }
    }

    const userData = userDocSnap.data()

    return { 
      success: true, 
      user: {
        uid: user.uid,
        ...userData
      }
    }
  } catch (error) {
    console.error('Error signing in:', error)
    
    // Handle Firebase Auth errors
    if (error.code === 'auth/user-not-found') {
      return { success: false, error: 'No account found with this email' }
    }
    if (error.code === 'auth/wrong-password') {
      return { success: false, error: 'Incorrect password' }
    }
    if (error.code === 'auth/invalid-email') {
      return { success: false, error: 'Invalid email address' }
    }
    if (error.code === 'auth/too-many-requests') {
      return { success: false, error: 'Too many failed attempts. Please try again later.' }
    }

    return { success: false, error: error.message || 'Failed to sign in' }
  }
}

/**
 * Sign out current user
 */
export const logOut = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return { success: false, error: 'Failed to sign out' }
  }
}

/**
 * Get current user data
 */
export const getCurrentUser = async () => {
  try {
    const user = auth.currentUser
    if (!user) {
      return { success: false, error: 'No user signed in' }
    }

    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      return { success: false, error: 'User data not found' }
    }

    return { 
      success: true, 
      user: {
        uid: user.uid,
        ...userDocSnap.data()
      }
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return { success: false, error: 'Failed to get user data' }
  }
}

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

