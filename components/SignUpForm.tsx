import {StyleSheet, View} from "react-native";
import Input from "./Input";
import {Feather} from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";

const SignUpForm = props => {
    return (
        <>
            <Input
                label="First Name"
                icon="user"
                iconPack={Feather}/>
            <Input
                label="Last Name"
                icon="user"
                iconPack={Feather}/>

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
                title="Sign up"
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

export default SignUpForm