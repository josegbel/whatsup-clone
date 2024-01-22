import { Platform } from "react-native"
import * as ImagePicker from 'expo-image-picker';
import { getFirebaseApp } from "./firebaseHelper";
import { v4 as uuidv4 } from 'uuid';
import "react-native-get-random-values";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

export const launchImagePicker = async () => {

    await checkMediaPermission();

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1,1],
        quality: 1
    })

    if(!result.canceled){
        return result.assets[0].uri;
    }
}

export const uploadImage = async uri => {
    const app = getFirebaseApp();

    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(xhr.response);
        }

        xhr.onerror = function(e) {
            console.log(e)
            reject(new TypeError('Network request failed'));
        }

        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send();
    })

    const pathFolder = 'profilePics';
    const storageRef = ref(getStorage(app), `${pathFolder}/${uuidv4()}`);
    await uploadBytesResumable(storageRef, blob);
    
    const downloadURL = await getDownloadURL(storageRef);

    blob.close();

    return downloadURL;
}

const checkMediaPermission = async () => {
    if(Platform.OS !== 'web'){
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(permissionResult.granted === false){
            return Promise.reject(new Error('Permission to access gallery is required!'))
        }
    }

    return Promise.resolve();
}