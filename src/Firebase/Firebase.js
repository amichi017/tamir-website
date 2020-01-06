import firebase from 'firebase/app';
import firestoreModuleInit from './Firestore'


const firebaseConfig = {
    apiKey: "AIzaSyDEaOcHtrnBB3GQ12z1nR9qRNfwEIsNrFo",
    authDomain: "tamir-db.firebaseapp.com",
    databaseURL: "https://tamir-db.firebaseio.com",
    projectId: "tamir-db",
    storageBucket: "tamir-db.appspot.com",
    messagingSenderId: "463912944330",
    appId: "1:463912944330:web:2a447f8b8212da82"
};
firebase.initializeApp(firebaseConfig);

const firestoreModule = firestoreModuleInit()

export { firestoreModule }