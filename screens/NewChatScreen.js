import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import PageContainer from "../components/PageContainer";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../constants/colors";
import commonStyles from "../constants/commonStyles";
import { searchUsers } from "../utils/actions/userActions";
import DataItem from "../components/DataItem";
import { setStoredUsers } from "../store/usersSlice";
import ProfileImage from "../components/ProfileImage";

const NewChatScreen = (props) => {
  const dispatch = useDispatch();

  const isGroupChat = props.route.params.isGroupChat;

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState();
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const selectedUsersFlatList = useRef();

  const isGroupChatDisabled = chatName === "" || selectedUsers.length < 2;

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title="Close" onPress={() => props.navigation.goBack()} />
          </HeaderButtons>
        );
      },
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {isGroupChat && (
              <Item
                disabled={isGroupChatDisabled}
                color={isGroupChatDisabled ? colors.lightGrey : undefined}
                title="Create"
                onPress={() => {
                  props.navigation.navigate("ChatList", {
                    selectedUsers,
                    chatName,
                  });
                }}
              />
            )}
          </HeaderButtons>
        );
      },
      headerTitle: isGroupChat ? "Add Participants" : "New chat",
    });
  }, [chatName, selectedUsers]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchText || searchText === "") {
        setUsers();
        setNoResultsFound(false);
        return;
      }
      setIsLoading(true);

      const usersResult = await searchUsers(searchText);
      delete usersResult[userData.userId];
      setUsers(usersResult);

      if (Object.keys(usersResult).length === 0) {
        setNoResultsFound(true);
      } else {
        setNoResultsFound(false);
        dispatch(setStoredUsers({ newUsers: usersResult }));
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchText]);

  const userPressed = (userId) => {
    if (isGroupChat) {
      if (selectedUsers.includes(userId)) {
        setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      } else {
        setSelectedUsers([...selectedUsers, userId]);
      }
    } else {
      props.navigation.navigate("ChatList", {
        selectedUserId: userId,
      });
    }
  };

  return (
    <PageContainer>
      {isGroupChat && (
        <>
          <View style={styles.chatNameContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter a name for your chat"
                autoCorrect={false}
                onChangeText={(text) => setChatName(text)}
                autoComplete={false}
                value={chatName}
                style={styles.textBox}
              />
            </View>
          </View>
          <View style={styles.selectedUsersContainer}>
            <FlatList
              style={styles.selectedUsersList}
              data={selectedUsers}
              contentContainerStyle={{ alignItems: "center" }}
              horizontal={true}
              keyExtractor={(item) => item}
              ref={(ref) => (selectedUsersFlatList.current = ref)}
              onContentSizeChange={() =>
                selectedUsersFlatList.current.scrollToEnd()
              }
              renderItem={(itemData) => {
                const userId = itemData.item;
                const userData = storedUsers[userId];
                return (
                  <ProfileImage
                    style={styles.selectedUserStyle}
                    size={40}
                    uri={userData.profileImage}
                    showRemoveButton={true}
                    onPress={() => userPressed(userId)}
                  />
                );
              }}
            />
          </View>
        </>
      )}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={15} color={colors.lightGrey} />
        <TextInput
          placeholder="Search"
          style={styles.searchBox}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      {isLoading && (
        <View style={commonStyles.center}>
          <ActivityIndicator size={"large"} color={colors.primary} />
        </View>
      )}

      {!isLoading && !noResultsFound && users && (
        <FlatList
          data={Object.keys(users)}
          renderItem={(itemData) => {
            const userId = itemData.item;
            const userData = users[userId];

            return (
              <DataItem
                title={`${userData.firstName} ${userData.lastName}`}
                subtitle={userData.about}
                image={userData.profileImage}
                type={isGroupChat ? "checkbox" : ""}
                onPress={() => userPressed(userId)}
                isChecked={selectedUsers.includes(userId)}
              />
            );
          }}
        />
      )}

      {!isLoading && noResultsFound && (
        <View style={commonStyles.center}>
          <FontAwesome
            name="question"
            size={55}
            color={colors.lightGrey}
            style={styles.noResultsIcon}
          />
          <Text style={styles.noResultsText}>No users found!</Text>
        </View>
      )}

      {!isLoading && !users && (
        <View style={commonStyles.center}>
          <FontAwesome
            name="users"
            size={55}
            color={colors.lightGrey}
            style={styles.noResultsIcon}
          />
          <Text style={styles.noResultsText}>
            Enter a name to search for a user!
          </Text>
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: colors.extraLightGrey,
  },
  searchBox: {
    width: "100%",
    marginLeft: 8,
    fontSize: 15,
    borderBottomColor: colors.lightGrey,
  },
  noResultsIcon: {
    marginBottom: 20,
  },
  noResultsText: {
    fontFamily: "regular",
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  chatNameContainer: {
    paddingVertical: 10,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.nearlyWhite,
    borderRadius: 2,
  },
  selectedUsersContainer: {
    justifyContent: "center",
    height: 50,
  },
  selectedUsersList: {
    paddingTop: 10,
    height: "100%",
  },
  selectedUserStyle: {
    marginRight: 10,
    marginBottom: 10,
  },
  textBox: {
    fontFamily: "regular",
    letterSpacing: 0.3,
    width: "100%",
  },
});

export default NewChatScreen;
