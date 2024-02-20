import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../constants/colors";
import { AntDesign } from "@expo/vector-icons";

const ReplyTo = (props) => {
  const { text, user, onCancel } = props;
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1} style={styles.text}>
          {text}
        </Text>
      </View>
      <TouchableOpacity onPress={onCancel}>
        <AntDesign name="closecircleo" size={24} color={colors.blue} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f0f0fd",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
    padding: 10,
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    color: colors.blue,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
  },
});

export default ReplyTo;
