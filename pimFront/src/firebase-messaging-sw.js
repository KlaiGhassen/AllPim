importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyBBCI5t44tZ0EeVTGFB-_pHe9WlDr_2CW0",
    authDomain: "pimnotification.firebaseapp.com",
    projectId: "pimnotification",
    storageBucket: "pimnotification.appspot.com",
    messagingSenderId: "181496279575",
    appId: "1:181496279575:web:18ea51dd30e8a076e76252",
    measurementId: "G-E1GGF7H24Z"
});
const messaging = firebase.messaging();