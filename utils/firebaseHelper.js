import { initializeApp } from "firebase/app";
import { firebaseKey } from "../secrets";

export const getFirebaseApp = () => {
  const firebaseConfig = {
    apiKey: firebaseKey,
    authDomain: "whatsapp-1afe7.firebaseapp.com",
    projectId: "whatsapp-1afe7",
    storageBucket: "whatsapp-1afe7.appspot.com",
    databaseURL:
      "https://whatsapp-1afe7-default-rtdb.europe-west1.firebasedatabase.app",
    messagingSenderId: "471980257347",
    appId: "1:471980257347:web:ddb33d438ab020ca0524f6",
    measurementId: "G-CQFR1FMTJR",
  };

  return initializeApp(firebaseConfig);
};
