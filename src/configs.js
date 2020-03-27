import * as firebase from 'firebase';
 
var config = {
    apiKey: "AIzaSyBECHn24gaIdniW7y1poJMweaNvF_kug0Q",
    authDomain: "fir-reaxt.firebaseapp.com",
    databaseURL: "https://fir-reaxt.firebaseio.com",
    projectId: "firebase-reaxt",
    storageBucket: "firebase-reaxt.appspot.com",
    messagingSenderId: "252340335412",
    appId: "1:252340335412:web:1c8855a0c65a3acf30eb61"
  };
    firebase.initializeApp(config);

export default firebase;