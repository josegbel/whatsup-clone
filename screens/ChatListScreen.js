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
  const selectedUserList = props.route?.params?.selectedUsers;
  const chatName = props.route?.params?.chatName;

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
              onPress={() =>
                props.navigation.navigate("NewChat", { isGroupChat: false })
              }
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedUser && !selectedUserList) {
      return;
    }

    let chatData;
    let navigationProps;

    if (selectedUser) {
      chatData = userChats.find(
        (cd) => !cd.isGroupChat && cd.users.includes(selectedUser),
      );
    }

    if (chatData) {
      navigationProps = { chatId: chatData.key };
    } else {
      const chatUsers = selectedUserList || [selectedUser];
      if (!chatUsers.includes(userData.userId)) {
        chatUsers.push(userData.userId);
      }

      navigationProps = {
        newChatData: {
          users: chatUsers,
          isGroupChat: selectedUserList !== undefined,
        },
      };
    }

    if (chatName) {
      navigationProps.newChatData.chatName = chatName;
    }

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
          const isGroupChat = chatData.isGroupChat;

          let title = "";
          const subtitle = chatData.latestMessageText || "New chat";
          let image = "";

          const otherUserId = chatData.users.find(
            (uid) => uid !== userData.userId,
          );
          const otherUserData = storedUsers[otherUserId];

          if (!otherUserData) return;

          if (isGroupChat) {
            title = chatData.chatName;
            image = chatData.chatImage;
          } else {
            title = `${otherUserData.firstName} ${otherUserData.lastName}`;
            image = otherUserData.profileImage;
          }

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
