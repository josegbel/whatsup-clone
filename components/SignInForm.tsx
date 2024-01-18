import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import Input from "./Input";
import { Feather } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducers";
import { signIn } from "../utils/actions/authActions";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";

const isTestMode = true;

const initialState = {
  inputValues: {
    email: isTestMode ? "qq@qq.com" : "",
    password: isTestMode ? "qqqqqqqq" : "",
  },
  inputValidities: {
    email: isTestMode,
    password: isTestMode,
  },
  formIsValid: isTestMode,
};

const SignInForm = (props) => {
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, inputValue, validationResult: result });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      setError(undefined);
      await dispatch(action);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input
        id="email"
        keyboardType="email-address"
        autoCapitalize="none"
        label="Email"
        icon="mail"
        initialValue={formState.inputValues.email}
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
        initialValue={formState.inputValues.password}
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
          title="Sign in"
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

export default SignInForm;
