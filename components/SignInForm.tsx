import {StyleSheet, View} from "react-native";
import Input from "./Input";
import {Feather} from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";

const SignInForm = props => {
    return (
        <>
            <Input
                label="Email"
                icon="mail"
                iconPack={Feather}/>

            <Input
                label="Password"
                icon="lock"
                iconPack={Feather}/>

            <SubmitButton
                style={{marginTop: 20}}
                title="Sign in"
                onPress={() => console.log("pressed")}/>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: ' '
    }
})

export default SignInForm