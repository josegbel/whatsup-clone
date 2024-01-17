import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirebaseApp } from "../firebaseHelper";
import { child, getDatabase, ref, set } from "firebase/database";
import { authenticate } from "../../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData } from "./userActions";

export const signUp = (firstName, lastName, email, password) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const { uid } = result.user;
      const { accessToken, expirationTime } = result.user["stsTokenManager"];

      const expireDate = new Date(expirationTime);

      const userData = await createUser(firstName, lastName, email, uid);

      dispatch(authenticate({ userData, token: accessToken }));
      saveDataToStorage(accessToken, uid, expireDate);
    } catch (error) {
      console.error(error);
      let message = "Something went wrong!";

      if (error.code === "auth/email-already-in-use") {
        message = "This email address is already in use!";
      }

      throw new Error(message);
    }
  };
};

export const signIn = (email, password) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      const { uid } = result.user;
      const { accessToken, expirationTime } = result.user["stsTokenManager"];
      const expireDate = new Date(expirationTime);
      const userData = await getUserData(uid);

      dispatch(authenticate({ userData, token: accessToken }));
      saveDataToStorage(accessToken, uid, expireDate);
    } catch (error) {
      console.error(error);
      let message = "Something went wrong!";

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-email"
      ) {
        message = "Invalid credentials!";
      }

      throw new Error(message);
    }
  };
};

const createUser = async (firstName, lastName, email, userId) => {
  const firstLast = `${firstName} ${lastName}`.toLowerCase();
  const userData = {
    firstName,
    lastName,
    firstLast,
    email,
    userId,
    signUpDate: new Date().toISOString(),
  };

  const dbRef = ref(getDatabase());

  const childRef = child(dbRef, `users/${userId}`);
  await set(childRef, userData);
  return userData;
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
