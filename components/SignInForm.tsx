import { StyleSheet, View } from "react-native";
import Input from "./Input";
import { Feather } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import React, { useCallback, useReducer } from "react";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducers";
import { signIn } from "../utils/actions/authActions";

const initialState = {
  inputValues: {
    email: "",
    password: "",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const SignInForm = (props) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, inputValue, validationResult: result });
    },
    [dispatchFormState]
  );

  const authHandler = () => {
    signIn(formState.inputValues.email, formState.inputValues.password);
  };

  return (
    <>
      <Input
        id="email"
        keyboardType="email-address"
        autoCapitalize="none"
        label="Email"
        icon="mail"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities.email}
        iconPack={Feather}
      />

      <Input
        id="password"
        secureTextEntry
        autoCapitalize="none"
        label="Password"
        icon="lock"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities.password}
        iconPack={Feather}
      />

      <SubmitButton
        style={{ marginTop: 20 }}
        title="Sign in"
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

export default SignInForm;
