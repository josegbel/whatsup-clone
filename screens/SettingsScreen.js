import React, { useCallback, useReducer, useState } from "react";
import { StyleSheet, ActivityIndicator, Text, ScrollView } from "react-native";
import PageTitle from "../components/PageTitle";
import PageContainer from "../components/PageContainer";
import { Feather, FontAwesome } from "@expo/vector-icons";
import Input from "../components/Input";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducers";
import { useDispatch, useSelector } from "react-redux";
import SubmitButton from "../components/SubmitButton";
import colors from "../constants/colors";
import {
  updateUserDetailsOnBackend,
  userLogout,
} from "../utils/actions/authActions";
import { updateSignedInUserData } from "../store/authSlice";
import ProfileImage from "../components/ProfileImage";

const SettingsScreen = (props) => {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const firstName = userData.firstName || "";
  const lastName = userData.lastName || "";
  const email = userData.email || "";
  const about = userData.about || "";

  const initialState = {
    inputValues: {
      firstName,
      lastName,
      email,
      about,
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState();

  const saveHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedValues = formState.inputValues;
      await updateUserDetailsOnBackend(userData.userId, updatedValues);
      dispatch(updateSignedInUserData({ newData: updatedValues }));
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      setError(undefined);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputValue, inputId, validationResult: result });
    },
    [dispatchFormState],
  );

  const hasChanges = useCallback(() => {
    const currentValues = formState.inputValues;
    const hasChanges =
      currentValues.firstName !== firstName ||
      currentValues.lastName !== lastName ||
      currentValues.email !== email ||
      currentValues.about !== about;

    return hasChanges;
  }, [formState, firstName, lastName, email, about]);

  return (
    <PageContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <PageTitle text="Settings" />

        <ProfileImage
          uri={userData.profilePicture}
          userId={userData.userId}
          size={80}
        />

        <Input
          id="firstName"
          label="First Name"
          icon="user"
          onInputChanged={inputChangedHandler}
          initialValue={userData.firstName}
          errorText={formState.inputValidities["firstName"]}
          iconPack={Feather}
        />
        <Input
          id="lastName"
          label="Last Name"
          icon="user"
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities["lastName"]}
          iconPack={Feather}
          initialValue={userData.lastName}
        />

        <Input
          id="email"
          label="Email"
          icon="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities["email"]}
          iconPack={Feather}
          initialValue={userData.email}
        />

        <Input
          id="about"
          label="About"
          icon="user-o"
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities["about"]}
          iconPack={FontAwesome}
          multiline={true}
        />

        {showSuccessMessage && (
          <Text style={{ color: colors.primary }}>
            Changes saved successfully!
          </Text>
        )}

        {isLoading ? (
          <ActivityIndicator
            size={"small"}
            color={colors.primary}
            style={{ marginTop: 16 }}
          />
        ) : (
          hasChanges() && (
            <SubmitButton
              style={{ marginTop: 20 }}
              title="Save"
              disabled={!formState.formIsValid}
              onPress={saveHandler}
            />
          )
        )}

        <SubmitButton
          style={{ marginTop: 20 }}
          title="Logout"
          color={colors.red}
          onPress={() => dispatch(userLogout())}
        />
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    alignItems: "center",
  },
});

export default SettingsScreen;
