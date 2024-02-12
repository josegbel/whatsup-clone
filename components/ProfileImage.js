import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import { launchImagePicker, uploadImage } from "../utils/imagePickerHelper";
import { updateUserDetailsOnBackend } from "../utils/actions/authActions";
import { useDispatch } from "react-redux";
import { updateSignedInUserData } from "../store/authSlice";

const ProfileImage = (props) => {
  const userId = props.userId;

  const source = props.uri
    ? { uri: props.uri }
    : require("../assets/images/userImage.jpeg");

  const [image, setImage] = useState(source);
  const [isLoading, setIsLoading] = useState(false);

  const showEditButton = props.showEditButton && props.showEditButton === true;

  const dispatch = useDispatch();

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();

      if (!tempUri) return;

      setIsLoading(true);
      const uploadUrl = await uploadImage(tempUri);
      if (!uploadUrl) throw new Error("Error uploading image");

      const newData = { profileImage: uploadUrl };
      await updateUserDetailsOnBackend(userId, newData);
      dispatch(updateSignedInUserData({ newData }));

      setImage({ uri: tempUri });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const Container = showEditButton ? TouchableOpacity : View;

  return (
    <Container onPress={pickImage}>
      {isLoading ? (
        <View
          height={props.size}
          width={props.size}
          styles={styles.loadingContainer}
        >
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <Image
          style={{
            ...styles.image,
            ...{ width: props.size, height: props.size },
          }}
          source={image}
          alt={props.alt}
          {...props}
        />
      )}

      {showEditButton && !isLoading && (
        <View style={styles.editIconContainer}>
          <FontAwesome name="pencil" size={15} color="black" />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    borderColor: colors.grey,
    borderWidth: 1,
  },
  editIconContainer: {
    position: "absolute",
    bottom: -10,
    right: -10,
    backgroundColor: colors.lightGrey,
    borderRadius: 50,
    padding: 8,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileImage;
