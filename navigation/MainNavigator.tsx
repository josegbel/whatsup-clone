import React from 'react'
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";

import ChatListScreen from "../screens/ChatListScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatSettingsScreen from "../screens/SettingsScreen";
import ChatScreen from "../screens/ChatScreen";

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
const MainNavigator = props => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}}/>
            <Stack.Screen name="ChatSettings" component={ChatSettingsScreen}/>
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{
                headerTitle: '',
                headerBackTitle: 'Back'
            }}/>
        </Stack.Navigator>
    )
}

export default MainNavigator