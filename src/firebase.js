const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyCV30y8HwGxLfSuLbuMsbXIsxTSCfkhITw",
    authDomain: "chat-room-f6e56.firebaseapp.com",
    databaseURL: "https://chat-room-f6e56.firebaseio.com",
    projectId: "chat-room-f6e56",
    storageBucket: "chat-room-f6e56.appspot.com",
    messagingSenderId: "973255375090",
    appId: "1:973255375090:web:ae6824fb413d0bf69bf86b"
};

const actionCodeSettings = {
    url: 'http://localhost:8080',
    handleCodeInApp: true,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { firebase, db, actionCodeSettings };