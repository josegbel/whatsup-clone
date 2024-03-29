import { StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../constants/colors";
import React from "react";

const Input = (props) => {
  const onChangeText = (text) => {
    setValue(text);
    props.onInputChanged(props.id, text);
  };

  const [value, setValue] = React.useState(props.initialValue);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.inputContainer}>
        {props.icon && (
          <props.iconPack
            name={props.icon}
            size={props.iconSize || 24}
            style={styles.icon}
          />
        )}
        <TextInput
          {...props}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText[0]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  icon: {
    marginRight: 10,
    color: colors.grey,
  },
  input: {
    flex: 1,
    color: colors.textColor,
    fontFamily: "regular",
    letterSpacing: 0.3,
    paddingTop: 0,
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: colors.nearlyWhite,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 2,
    alignItems: "center",
  },
  label: {
    marginVertical: 8,
    fontFamily: "bold",
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  errorContainer: { marginVertical: 5 },
  errorText: {
    color: "red",
    fontSize: 13,
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
});

export default Input;
