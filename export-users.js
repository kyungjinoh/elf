import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
// You need to set GOOGLE_APPLICATION_CREDENTIALS environment variable
// or provide service account key file path
try {
  let serviceAccount;
  
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Load from environment variable path
    serviceAccount = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
  } else {
    // Try to load from local file (check multiple possible names)
    const possiblePaths = [
      join(__dirname, 'serviceAccountKey.json'),
      join(__dirname, 'elf-app-81657-firebase-adminsdk-fbsvc-3bfe8e8e5b.json')
    ];
    
    let serviceAccountPath = null;
    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        serviceAccountPath = path;
        break;
      }
    }
    
    if (serviceAccountPath) {
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    } else {
      throw new Error('Service account key not found');
    }
  }
  
  initializeApp({
    credential: cert(serviceAccount),
    projectId: 'elf-app-81657'
  });
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
  console.log('\nTo use this script, you need to:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Click "Generate new private key" and download the JSON file');
  console.log('3. Save it as "serviceAccountKey.json" in the project root');
  console.log('4. Or set GOOGLE_APPLICATION_CREDENTIALS environment variable to the file path');
  process.exit(1);
}

const db = getFirestore();

// Function to escape CSV values
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

// Function to convert array to CSV
function arrayToCSV(data) {
  if (data.length === 0) {
    return '';
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = headers.map(escapeCSV).join(',');
  
  // Create CSV data rows
  const dataRows = data.map(row => 
    headers.map(header => escapeCSV(row[header] || '')).join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
}

// Main function to export users
async function exportUsers() {
  try {
    console.log('Fetching users from Firestore...');
    
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    if (snapshot.empty) {
      console.log('No users found in the database.');
      return;
    }
    
    console.log(`Found ${snapshot.size} users. Processing...`);
    
    const users = [];
    snapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        uid: doc.id,
        username: userData.username || '',
        usernameLower: userData.usernameLower || '',
        email: userData.email || '',
        profilePictureUrl: userData.profilePictureUrl || '',
        cardText: userData.cardText || '',
        reveal: userData.reveal || false,
        createdAt: userData.createdAt || '',
        updatedAt: userData.updatedAt || ''
      });
    });
    
    // Sort by creation date (oldest first)
    users.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    });
    
    // Convert to CSV
    const csvContent = arrayToCSV(users);
    
    // Write to file
    const outputPath = join(__dirname, 'users_export.csv');
    fs.writeFileSync(outputPath, csvContent, 'utf8');
    
    console.log(`\n✅ Successfully exported ${users.length} users to: ${outputPath}`);
    console.log(`\nCSV file contains the following columns:`);
    console.log('- uid, username, usernameLower, email, profilePictureUrl, cardText, reveal, createdAt, updatedAt');
    
  } catch (error) {
    console.error('Error exporting users:', error);
    process.exit(1);
  }
}

// Run the export
exportUsers().then(() => {
  console.log('\nExport completed!');
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

