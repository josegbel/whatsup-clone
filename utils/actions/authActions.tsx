import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirebaseApp } from "../firebaseHelper";
import { child, getDatabase, ref, set } from "firebase/database";
import { authenticate } from "../../store/authSlice";

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
      const accessToken = result.user["stsTokenManager"].accessToken;

      const userData = await createUser(firstName, lastName, email, uid);

      dispatch(authenticate({ userData, token: accessToken }));
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
  console.log("signIn: " + email + " " + password);
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
