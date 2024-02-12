import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import React from "react";
import ProfileImage from "./ProfileImage";
import colors from "../constants/colors";

const DataItem = (props) => {
  const { title, subtitle, image } = props;

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <ProfileImage uri={image} size={40} />

        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBlockColor: colors.extraLightGrey,
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 50,
  },
  textContainer: {
    marginLeft: 14,
  },
  title: {
    fontFamily: "medium",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: "medium",
    color: colors.grey,
    letterSpacing: 0.3,
  },
});

export default DataItem;
