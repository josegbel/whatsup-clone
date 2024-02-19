import React, { useRef, useMemo } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback, Image } from "react-native";
import colors from "../constants/colors";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import uuid from 'react-native-uuid';
import * as Clipboard from "expo-clipboard";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { starMessage } from "../utils/actions/chatActions";
import { useSelector } from "react-redux";

const MenuItem = props => {

  const Icon = props.iconPack ?? Feather;

  return (
    <MenuOption onSelect={props.onSelect}>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuItemText}>{props.text}</Text>
        <Icon name={props.icon} size={18} color={colors.darkGrey} />
      </View>
    </MenuOption>
  )
}

const formatAmPm = (dateString) => {
  const date = new Date(dateString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
return hours + ":" + minutes + " " + ampm;
}

const Bubble = (props) => {
  const { text, type, messageId, userId, chatId, date, setReply, replyingTo, name, imageUrl } = props;

  const storedUsers = useSelector(state => state.users.storedUsers);
  const starredMessages = useSelector(state => state.messages.starredMessages[chatId] ?? {});

  const bubbleStyle = { ...styles.bubble };
  const textStyle = { ...styles.text };
  const wrapperStyle = { ...styles.wrapper };

  const menuRef = useRef(null)
  const id = useRef(uuid.v4())

  const replyingToUser = replyingTo && storedUsers[replyingTo.sentBy]

  let Container = View;
  let isUserMessage = false

  switch (type) {
    case "system":
      textStyle.color = "#65644A";
      bubbleStyle.marginTop = 10;
      bubbleStyle.backgroundColor = colors.beige;
      bubbleStyle.alignItems = "center";
      break;
    case "error":
      textStyle.color = "white";
      bubbleStyle.marginTop = 10;
      bubbleStyle.backgroundColor = colors.red;
      bubbleStyle.alignItems = "center";
      break;
    case "sent":
      wrapperStyle.justifyContent = "flex-end";
      bubbleStyle.backgroundColor = "#E7FED6";
      bubbleStyle.marginTop = 5;
      bubbleStyle.maxWidth = "80%";
      Container = TouchableWithoutFeedback
      isUserMessage = true
      break;
    case "received":
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.backgroundColor = "white";
      bubbleStyle.marginTop = 5;
      bubbleStyle.maxWidth = "80%";
      Container = TouchableWithoutFeedback
      isUserMessage = true
      break;
    case "reply":
      bubbleStyle.backgroundColor = "#00000009";
      bubbleStyle.borderWidth = 0,
      bubbleStyle.borderLeftWidth = 4,
      bubbleStyle.borderLeftColor = colors.blue,
      bubbleStyle.padding = 10;
      bubbleStyle.marginBottom = 5;
      break;
    default:
      break;
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text);
  }

  const isStarred = isUserMessage && starredMessages[messageId] !== undefined

  return (
    <View style={wrapperStyle}>
      <Container 
        style={{width: '100%'}}
        onLongPress={()=> menuRef.current.props.ctx.menuActions.openMenu(id.current)}
      >
        <View style={bubbleStyle}>
          {
            replyingTo && 
            <Bubble
              text={replyingTo.text}
              type="reply"
              name={`${replyingToUser?.firstName} ${replyingToUser?.lastName}`}
              messageId={replyingTo.key}
              userId={replyingTo.sentBy}
              chatId={chatId}
            />
          }
          { type === 'reply' &&
            <Text style={styles.name}>{name}</Text>
          }
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {
            imageUrl && 
            <Image
              source={{uri: imageUrl}}
              style={{width: 200, height: 200}}
            />
          }
            {
              !imageUrl && <Text style={textStyle}>{text}</Text>
            }
            { date &&
            <View style={styles.timeContainer}>
              {isStarred && <FontAwesome name="star" size={18} color={colors.grey} style={{marginRight:5}}/>}
              <Text style={styles.time}>{formatAmPm(date)}</Text>
            </View>
            }
          </View>

          <Menu ref={menuRef} name={id.current}>
            <MenuTrigger />
            <MenuOptions>
              <MenuItem onSelect={()=>copyToClipboard()} text="Copy" icon={'copy'} />
              <MenuItem onSelect={()=>starMessage(messageId, chatId, userId)} text={`${isStarred ? 'Unstar' : 'Star'} message`}  icon={isStarred ? 'star' : 'star-o'} iconPack={FontAwesome} />
              <MenuItem onSelect={setReply} text={"Reply"}  icon={'arrow-left-circle'} />
              <MenuItem onSelect={() => console.log('Delete')} text="Delete"  icon={'delete'} />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bubble: {
    backgroundColor: "white",
    borderRadius: 6,
    padding: 5,
    borderColor: "#e2dacc",
    borderWidth: 1,
  },
  text: {
    fontFamily: "regular",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  name: {
    color: colors.blue,
    fontFamily: "bold",
    marginBottom: 5,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  menuItemContainer: {
    padding: 5,
    flexDirection: "row",
  },
  timeContainer: {
    flexDirection: "row",
    marginLeft: 15,
    marginTop: 6,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    
  },
  menuItemText: {
    flex: 1,
    fontFamily: "regular",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  time: { 
    fontFamily: "regular", 
    fontSize: 12, 
    color: colors.grey, 
    letterSpacing: 0.3,
  }
});

export default Bubble;
