import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import ProfileImage from "../components/ProfileImage";
import PageTitle from "../components/PageTitle";
import colors from "../constants/colors";
import { getUserChats } from "../utils/actions/userActions";
import DataItem from "../components/DataItem";
import SubmitButton from "../components/SubmitButton";
import { removeUserFromChat } from "../utils/actions/chatActions";

const ContactScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const storedChats = useSelector((state) => state.chats.chatsData);
  const userData = useSelector((state) => state.auth.userData);

  const chatId = props.route.params.chatId;
  const chatData = chatId && storedChats[chatId];

  const currentUser = storedUsers[props.route.params.uid];
  const [commonChats, setCommonChats] = useState([]);

  useEffect(() => {
    const getCommonUserChats = async (userId) => {
      const currentUserChats = await getUserChats(currentUser.userId);
      setCommonChats(
        Object.values(currentUserChats).filter(
          (cid) => storedChats[cid] && storedChats[cid].isGroupChat,
        ),
      );
    };

    getCommonUserChats(currentUser.userId);
  }, []);

  const removeFromChat = useCallback(async () => {
    try {
      setIsLoading(true);

      await removeUserFromChat(userData, currentUser, chatData);

      props.navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, props.navigation]);

  return (
    <PageContainer>
      <View style={styles.topContainer}>
        <ProfileImage
          uri={currentUser.profileImage}
          size={80}
          style={{ marginBottom: 20 }}
        />
        <PageTitle text={`${currentUser.firstName} ${currentUser.lastName}`} />
        {currentUser.about && (
          <Text style={styles.about} numberOfLines={2}>
            {currentUser.about}
          </Text>
        )}
      </View>

      {commonChats.length > 0 && (
        <>
          <Text style={styles.heading}>
            {commonChats.length} {commonChats.length === 1 ? "Group" : "Groups"}{" "}
            in Common
          </Text>
          {commonChats.map((cid) => {
            const chatData = storedChats[cid];
            return (
              <DataItem
                key={cid}
                title={chatData.chatName}
                type="link"
                onPress={() =>
                  props.navigation.push("ChatScreen", { chatId: cid })
                }
                image={chatData.chatImage}
                subtitle={chatData.latestMessageText}
              />
            );
          })}
        </>
      )}

      {chatData && chatData.isGroupChat && isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <SubmitButton
          title="Remove from chat"
          color={colors.red}
          onPress={removeFromChat}
          style={{ marginTop: 20 }}
        />
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  about: {
    fontSize: 16,
    fontFamily: "medium",
    letterSpacing: 0.3,
    color: colors.grey,
  },
  heading: {
    fontSize: 18,
    fontFamily: "bold",
    letterSpacing: 0.3,
    color: colors.textColor,
    marginVertical: 8,
  },
  commonChatElement: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});

export default ContactScreen;
