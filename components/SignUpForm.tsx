import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import Input from "./Input";
import { Feather } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducers";
import { signUp } from "../utils/actions/authActions";
import colors from "../constants/colors";
import { useDispatch, useSelector } from "react-redux";

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
  const dispatch = useDispatch();

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputValue, inputId, validationResult: result });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  });

  const authHandler = async () => {
    try {
      setIsLoading(true);
      const action = signUp(
        formState.inputValues.firstName,
        formState.inputValues.lastName,
        formState.inputValues.email,
        formState.inputValues.password
      );
      dispatch(action);
      setError(undefined);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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

      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.primary}
          style={{ marginTop: 16 }}
        />
      ) : (
        <SubmitButton
          style={{ marginTop: 20 }}
          title="Sign up"
          disabled={!formState.formIsValid}
          onPress={authHandler}
        />
      )}
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
