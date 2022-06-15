import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screens/onBoarding/Splash';
import OnBoarding from '../screens/onBoarding/OnBoarding';
import BottomTab from './BottomTab';
import Agent from '../screens/Admin/Agent';
import SingleReel from '../screens/SingleReel/SingleReel';
import TermsOfServices from '../screens/Supports/TermsOfServices';
import Support from '../screens/Supports/Support';
import Header from '../components/Header';

const Stack = createNativeStackNavigator();
const RootNavigations = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen
        name="Admin"
        component={Agent}
        options={{
          header: props => <Header {...props} />,
          headerShown: true,
        }}
      />
      <Stack.Screen name="SingleReel" component={SingleReel} />
      <Stack.Screen
        name="Terms"
        component={TermsOfServices}
        options={{
          header: props => <Header {...props} />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Support"
        component={Support}
        options={{
          header: props => <Header {...props} />,
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigations;

const styles = StyleSheet.create({});
