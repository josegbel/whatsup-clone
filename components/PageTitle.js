import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

export default PageTitle = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textColor,
    letterSpacing: 1,
  },
});
