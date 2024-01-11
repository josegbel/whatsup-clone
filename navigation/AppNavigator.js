import React from 'react'
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ChatListScreen from "../screens/ChatListScreen";
import SettingsScreen from "../screens/SettingsScreen";
import {Ionicons} from "@expo/vector-icons";
import ChatSettingsScreen from "../screens/SettingsScreen";


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{headerTitle: ''}}>
            <Tab.Screen name="ChatList" component={ChatListScreen} options={{
                tabBarLabel: 'Chats',
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="chatbubbles" size={size} color={color}/>
                ),
            }}/>
            <Tab.Screen name="Settings" component={SettingsScreen} options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="cog-outline" size={size} color={color}/>
                )
            }}/>
        </Tab.Navigator>
    )
}


const AppNavigator = props => {
    return <NavigationContainer>

        <Stack.Navigator>
            <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}}/>
            <Stack.Screen name="ChatSettings" component={ChatSettingsScreen}/>
        </Stack.Navigator>

    </NavigationContainer>
}

export default AppNavigator