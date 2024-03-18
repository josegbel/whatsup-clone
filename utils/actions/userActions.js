import {
  child,
  get,
  getDatabase,
  query,
  ref,
  orderByChild,
  startAt,
  remove,
  endAt,
} from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";

export const getUserData = async (userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `users/${userId}`);
    const snapshot = await get(childRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error(error);
  }
};

export const getUserChats = async (userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `userChats/${userId}`);
    const snapshot = await get(childRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteUserChats = async (userId, key) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const chatRef = child(dbRef, `userChats/${userId}/${key}`);

    await remove(chatRef);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchUsers = async (queryText) => {
  const searchTerm = queryText.toLowerCase();

  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase());
    const userRef = child(dbRef, `users`);

    const queryRef = await query(
      userRef,
      orderByChild("firstLast"),
      startAt(searchTerm),
      endAt(searchTerm + "\uf8ff"),
    );
    const snapshot = await get(queryRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return {};
    }
  } catch (error) {
    console.error(error);
  }
};
