import * as firebase from 'firebase/app'
import 'firebase/database'

let config = {
    apiKey: "AIzaSyCcAA-aownqfbMYUw6KYUMboxvLGjL6DJo",
    authDomain: "airplanes-on-a-grid.firebaseapp.com",
    databaseURL: "https://airplanes-on-a-grid.firebaseio.com",
    projectId: "airplanes-on-a-grid",
    storageBucket: "airplanes-on-a-grid.appspot.com",
    messagingSenderId: "653896723601",
    appId: "1:653896723601:web:0a6df08045003c186ea330",
    measurementId: "G-23L0WFZLBD"
}

firebase.initializeApp(config)

export default firebase