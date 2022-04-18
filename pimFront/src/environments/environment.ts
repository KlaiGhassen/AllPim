// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBBCI5t44tZ0EeVTGFB-_pHe9WlDr_2CW0",
    authDomain: "pimnotification.firebaseapp.com",
    databaseURL: "https://pimnotification-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pimnotification",
    storageBucket: "pimnotification.appspot.com",
    messagingSenderId: "181496279575",
    appId: "1:181496279575:web:18ea51dd30e8a076e76252",
    vapidKey: "BNUs0UE3CCCKpHNY2tjLzQpnLYUSSDu5uQej3RauazNSzNyi_vi_Kk_QoLs7UQEEYIrG1ndGgpq-Qt_2EC5dO64",
    
  },
  urlMedicalfollowup: 'http://localhost:3000/', //url mode dev
  urlMedicalfollowupupdate: 'http://localhost:3000/medicalFollowUp', //url mode dev
  urlGetPatient: 'http://localhost:3000/patient', //url mode dev
  urlPrescription: 'http://localhost:3000/Prescription'
  /*
  apiKey: "AIzaSyBBCI5t44tZ0EeVTGFB-_pHe9WlDr_2CW0",
    authDomain: "pimnotification.firebaseapp.com",
    projectId: "pimnotification",
    storageBucket: "pimnotification.appspot.com",
    messagingSenderId: "181496279575",
    appId: "1:181496279575:web:18ea51dd30e8a076e76252",
    measurementId: "G-E1GGF7H24Z"
  */
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
