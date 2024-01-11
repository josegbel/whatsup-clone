import React, {useCallback, useState} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Appearance,
    KeyboardAvoidingView, Platform
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {AntDesign, Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import colors from "../constants/colors";

const backgroundImage = require('../assets/images/chatbg.jpeg')
const ChatScreen = props => {

    const [messageText, setMessageText] = useState("")

    const sendMessage = useCallback(() => {
        setMessageText("")
    }, [messageText])

    return (
        <SafeAreaView edges={['right', 'left', "bottom"]} style={styles.container}>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={100}
                style={{flex: 1}}>
                <ImageBackground
                    style={styles.backgroundImage}
                    source={backgroundImage}
                    resizeMode={'cover'}/>
                <View style={styles.inputContainer}>
                    <TouchableOpacity
                        style={styles.mediaButton}
                        onPress={() => console.log()}>
                        <AntDesign name="plus" size={24} color={colors.blue}/>
                    </TouchableOpacity>
                    <TextInput
                        onChangeText={text => setMessageText(text)}
                        value={messageText}
                        onSubmitEditing={sendMessage}
                        style={styles.textBox}/>
                    {
                        messageText === "" && <TouchableOpacity
                            onPress={() => console.log()}
                            style={styles.mediaButton}>
                            <Feather name="camera" size={24} color={colors.blue}/>
                        </TouchableOpacity>
                    }

                    {
                        messageText === "" && <TouchableOpacity
                            onPress={() => console.log()}
                            style={styles.mediaButton}>
                            <MaterialCommunityIcons name="microphone-outline" size={24} color={colors.blue}/>
                        </TouchableOpacity>
                    }
                    {
                        messageText !== "" && <TouchableOpacity
                            onPress={sendMessage}
                            style={styles.mediaButton}>
                            <MaterialCommunityIcons name="send-circle" size={24} color={colors.blue}/>
                        </TouchableOpacity>
                    }
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    backgroundImage: {
        flex: 1
    },
    inputContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 10,
        height: 50
    },
    textBox: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.lightGrey,
        marginHorizontal: 15,
        paddingHorizontal: 12
    },
    mediaButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 35
    },
})

export default ChatScreen