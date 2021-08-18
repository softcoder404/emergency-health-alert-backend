const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({ 
  privateKey: process.env.PRIVATE_KEY,
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL, 
 //serviceAccount,
  databaseURL: 'https://emergency-alert-system-641b6.firebaseio.com',
  storageBucket: 'gs://emergency-alert-system-641b6.appspot.com'
})

const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket();


module.exports = { admin, db, storage, bucket }

