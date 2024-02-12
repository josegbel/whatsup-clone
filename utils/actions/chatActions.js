import { child, getDatabase, push, ref } from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";
import { async } from "validate.js";

export const createChat = async (loggedInUserId, chatData) => {
  const newChatData = {
    ...chatData,
    createdBy: loggedInUserId,
    updatedBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const app = getFirebaseApp();
  const dbRef = ref(getDatabase(app));
  const newChat = await push(child(dbRef, "chats"), newChatData);

  const chatUsers = newChatData.users;
  for (let icons = 0; icons < chatUsers.length; icons++) {
    const userId = chatUsers[icons];
    await push(child(dbRef, `userChats/${userId}`), newChat.key);
  }

  return newChat.key;
};
