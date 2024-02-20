import React, { useEffect } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { useSelector } from "react-redux";
import DataItem from "../components/DataItem";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import { createSelector } from "reselect";
import colors from "../constants/colors";

const ChatListScreen = (props) => {
  const selectedUser = props.route?.params?.selectedUserId;
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  // memoized selector as we are sorting the chats
  const chatsDataSelector = (state) => state.chats.chatsData;
  const sortedChatsSelector = createSelector(
    [chatsDataSelector],
    (chatsData) => {
      return Object.values(chatsData).sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      );
    },
  );
  const userChats = useSelector(sortedChatsSelector);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New chat"
              iconName="create-outline"
              onPress={() => props.navigation.navigate("NewChat")}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    const chatUsers = [selectedUser, userData.userId];

    const navigationProps = {
      newChatData: { users: chatUsers },
    };

    props.navigation.navigate("ChatScreen", navigationProps);
  }, [props.route?.params]);

  return (
    <PageContainer>
      <PageTitle text="Chats" />

      <View>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("NewChat", { isGroupChat: true })
          }
        >
          <Text style={styles.newGroupText}>New Group</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={userChats}
        renderItem={(itemData) => {
          const chatData = itemData.item;
          const chatId = chatData.key;
          console.log("chatId passed from ChatListScreen: ", chatId);

          const otherUserId = chatData.users.find(
            (uid) => uid !== userData.userId,
          );
          const otherUserData = storedUsers[otherUserId];

          if (!otherUserData) return;

          const title = `${otherUserData.firstName} ${otherUserData.lastName}`;
          const subtitle = chatData.latestMessageText || "New chat";
          const image = otherUserData.profileImage;

          return (
            <DataItem
              title={title}
              subtitle={subtitle}
              image={image}
              onPress={() =>
                props.navigation.navigate("ChatScreen", { chatId })
              }
            />
          );
        }}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  newGroupText: {
    color: colors.blue,
    fontSize: 17,
    marginBottom: 5,
  },
});

export default ChatListScreen;
