import React from 'react'
import { StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeIcon, MagnifyingGlassIcon, ListBulletIcon, ChatBubbleBottomCenterIcon } from 'react-native-heroicons/solid';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ListScreen from '../screens/ListScreen';
import ChatScreen from '../screens/ChatScreen';

const BottomTab = createBottomTabNavigator();

import { useStore } from '../store/store';

import { COLORS } from '../theme/theme';


const BottomTabNavigator = () => {
    const isDarkMode = useStore((state: any) => state.isDarkMode);



    return (
        <BottomTab.Navigator screenOptions={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: isDarkMode ? styles.dark_tabBarStyle : styles.light_tabBarStyle,
        }}>

            <BottomTab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (<HomeIcon color="" fill={!isDarkMode ? (focused ? COLORS.primaryDarkOrange : COLORS.darkText2) : (focused ? COLORS.secondaryDarkYellow : COLORS.lightText1)} size={40} />),
                }}
            ></BottomTab.Screen>

            <BottomTab.Screen
                name='Search'
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (<MagnifyingGlassIcon fill={!isDarkMode ? (focused ? COLORS.primaryDarkOrange : COLORS.darkText2) : (focused ? COLORS.secondaryDarkYellow : COLORS.lightText1)} size={40} />),
                }}
            ></BottomTab.Screen>

            <BottomTab.Screen
                name='List'
                component={ListScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (<ListBulletIcon color="" fill={!isDarkMode ? (focused ? COLORS.primaryDarkOrange : COLORS.darkText2) : (focused ? COLORS.secondaryDarkYellow : COLORS.lightText1)} size={40} />),
                }}
            ></BottomTab.Screen>

            {/* <BottomTab.Screen
                name='Chat'
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (<ChatBubbleBottomCenterIcon color="" fill={!isDarkMode ? (focused ? COLORS.primaryDarkOrange : COLORS.darkText2) : (focused ? COLORS.secondaryDarkYellow : COLORS.lightText1)} size={40} />),
                }}
            ></BottomTab.Screen> */}

<BottomTab.Screen
    name='Chat'
    component={ChatScreen}
    options={{
        tabBarIcon: ({ focused, color, size }) => (
            <ChatBubbleBottomCenterIcon color="" fill={!isDarkMode ? (focused ? COLORS.primaryDarkOrange : COLORS.darkText2) : (focused ? COLORS.secondaryDarkYellow : COLORS.lightText1)} size={40} />
        ),
        tabBarStyle: { display: 'none' }, // Hide the tab bar for ChatScreen
    }}
></BottomTab.Screen>


        </BottomTab.Navigator>
    )
}


const styles = StyleSheet.create({
    dark_tabBarStyle: {
        height: 80,
        position: 'absolute',
        backgroundColor: COLORS.darkBackground,
        borderTopWidth: 0,
        elevation: 0,
        borderTopColor: 'transparent'
    },
    light_tabBarStyle: {
        height: 80,
        position: 'absolute',
        backgroundColor: COLORS.lightBackground,
        borderTopWidth: 0,
        elevation: 0,
        borderTopColor: 'transparent'
    },


})
export default BottomTabNavigator