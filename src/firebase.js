import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyA-Gfr0ZUjz5mBXJ8Y7Wgk0Ui4XFYslRnc",
    authDomain: "driver-validation.firebaseapp.com",
    projectId: "driver-validation",
    storageBucket: "driver-validation.appspot.com",
    messagingSenderId: "357878268145",
    appId: "1:357878268145:web:f35ea0a94e3d5f9373a950"
}

firebase.initializeApp(config);

export default firebase