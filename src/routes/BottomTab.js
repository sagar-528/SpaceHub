import { StyleSheet, Text, View, Image, StatusBar,Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors } from "../themes";
import LocationDetails from "../screens/Location/LocationDetails";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Feed from "../screens/Feeds/Feed";
import Profile from "../screens/Clients/Profile";
import { Key } from "../Constant/constant";
import SignUp from "../screens/Auth/SignUp";
import Login from "../screens/Auth/Login";
import LikeVideos from "../screens/LikeVideos/LikeVideos";
import More from "../screens/Feeds/more";

const ProfileStack = createNativeStackNavigator();
function ProfileScreen() {
  
  return (
    <ProfileStack.Navigator
      initialRouteName={"SignUp"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name="Login" component={Login} />
      <ProfileStack.Screen name="SignUp" component={SignUp} />
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="LikeVideos" component={LikeVideos} />
    </ProfileStack.Navigator>
  );
}

const HomeStack = createNativeStackNavigator()
function HomeScreen(){
  return(
    <HomeStack.Navigator initialRouteName="Feeds" >
      <HomeStack.Screen 
        name="Feeds"
        component={Feed}
        options={{
          headerShown: false
        }}
      />
      
    </HomeStack.Navigator>
  )
}

const Tab = createBottomTabNavigator();
const BottomTab = () => {
  const unactiveFeedsIcon = require("../assets/icons/unacctiveFeed.png");
  const unactiveMapIcon = require("../assets/icons/unacctiveLocation.png");
  const unactiveProfileIcon = require("../assets/icons/unacctiveProfile.png");
  const activeFeedIcon = require("../assets/icons/activeFeed.png");
  const activeMapIcon = require("../assets/icons/activeLocation.png");
  const activeProfileIcon = require("../assets/icons/activeProfile.png");


  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 66,
          paddingTop:6,
          position: "absolute",
          // alignItems:'center',
          bottom: Platform.OS==='android' ? 16 : 16,
          right: 16,
          left: 16,
          borderRadius: 24,
          backgroundColor: colors.backgroundShadow,
          opacity: 0.7,
          borderTopWidth: 0,
          // zIndex: 1
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName={'HomeScreen'}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={[styles.tabBarIconWrapper]}>
              <Image
                style={styles.icon}
                source={focused ? activeFeedIcon : unactiveFeedsIcon}
              />
              {focused ? (
                <View
                  style={{
                    height: 4,
                    width: 4,
                    backgroundColor: colors.darkSky,
                    borderRadius: 2,
                    marginTop: 4,
                  }}
                />
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={LocationDetails}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={[styles.tabBarIconWrapper]}>
              <Image
                style={styles.icon}
                source={focused ? activeMapIcon : unactiveMapIcon}
              />
              {focused ? (
                <View
                  style={{
                    height: 4,
                    width: 4,
                    backgroundColor: colors.darkSky,
                    borderRadius: 2,
                    marginTop: 2,
                  }}
                />
              ) : null}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={[styles.tabBarIconWrapper]}>
              <Image
                style={styles.icon}
                source={focused ? activeProfileIcon : unactiveProfileIcon}
              />
              {focused ? (
                <View
                  style={{
                    height: 4,
                    width: 4,
                    backgroundColor: colors.darkSky,
                    borderRadius: 2,
                    marginTop: 4,
                  }}
                />
              ) : null}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabBarIconWrapper: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    flex: 1,
    position: 'absolute',
    top: 16,
    // backgroundColor: 'pink'
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode:'contain'
  },
});
