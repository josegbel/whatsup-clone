import React from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "../constants/colors";

const Bubble = (props) => {
  const { text, type } = props;

  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };
  const wrapperStyle = { ...styles.wrapperStyle };

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
      bubbleStyle.marginTop = 10;
      bubbleStyle.maxWidth = "80%";
      break;
    case "received":
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.backgroundColor = "white";
      bubbleStyle.marginTop = 10;
      bubbleStyle.maxWidth = "80%";
      break;
    default:
      break;
  }

  return (
    <View style={wrapperStyle}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
    borderColor: "#e2dacc",
    borderWidth: 1,
  },
  text: {
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
});

export default Bubble;
