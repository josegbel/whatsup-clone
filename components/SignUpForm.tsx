import { StyleSheet, View } from "react-native";
import Input from "./Input";
import { Feather } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import { validate } from "validate.js";
import React, { useCallback, useReducer } from "react";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducers";
import { signUp } from "../utils/actions/authActions";

const initialState = {
  inputValues: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignUpForm = (props) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputValue, inputId, validationResult: result });
    },
    [dispatchFormState]
  );

  const authHandler = () => {
    signUp(
      formState.inputValues.firstName,
      formState.inputValues.lastName,
      formState.inputValues.email,
      formState.inputValues.password
    );
  };

  return (
    <>
      <Input
        id="firstName"
        label="First Name"
        icon="user"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities.firstName}
        iconPack={Feather}
      />
      <Input
        id="lastName"
        label="Last Name"
        icon="user"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities.lastName}
        iconPack={Feather}
      />

      <Input
        id="email"
        label="Email"
        icon="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities.email}
        iconPack={Feather}
      />

      <Input
        id="password"
        label="Password"
        icon="lock"
        secureTextEntry
        autoCapitalize="none"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities.password}
        iconPack={Feather}
      />

      <SubmitButton
        style={{ marginTop: 20 }}
        title="Sign up"
        disabled={!formState.formIsValid}
        onPress={authHandler}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: " ",
  },
});

export default SignUpForm;
