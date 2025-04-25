const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Set custom claims for user roles
exports.setUserRole = functions.https.onCall(async (data, context) => {
  // Check if the request is made by an authenticated user
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  // Only allow admins to set roles for other users
  // For the first admin, you'll need to set this manually in Firebase Console
  const callerUid = context.auth.uid;
  const callerUserRecord = await admin.auth().getUser(callerUid);
  const callerCustomClaims = callerUserRecord.customClaims || {};
  
  // If caller is not an admin and trying to set someone else's role
  if (!callerCustomClaims.role === 'admin' && data.uid !== callerUid) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set roles for other users.'
    );
  }

  // Validate role
  if (data.role !== 'admin' && data.role !== 'user') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Role must be either "admin" or "user".'
    );
  }

  try {
    // Set custom user claims
    await admin.auth().setCustomUserClaims(data.uid, {
      role: data.role
    });

    // Update user document in Firestore
    await admin.firestore().collection('users').doc(data.uid).set({
      role: data.role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new functions.https.HttpsError('internal', 'Error setting user role.');
  }
});

// Create a user document when a new user signs up
exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
  try {
    // Set default role as 'user'
    await admin.auth().setCustomUserClaims(user.uid, {
      role: 'user'
    });

    // Create a user document in Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return null;
  } catch (error) {
    console.error('Error creating user document:', error);
    return null;
  }
});