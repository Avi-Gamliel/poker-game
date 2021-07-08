import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const app = firebase.initializeApp({

    apiKey: "AIzaSyABHunScu9i2pnJvNPhD6M3bm3fplUPv64",
    authDomain: "poker-game-ce3d2.firebaseapp.com",
    projectId: "poker-game-ce3d2",
    storageBucket: "poker-game-ce3d2.appspot.com",
    messagingSenderId: "537336957834",
    appId: "1:537336957834:web:9acd171057a742f6075673"

})
export const auth = app.auth();
export const db = firebase.firestore();


export default app




