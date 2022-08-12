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
import Feedback from '../screens/Supports/Feedback';
import Header from '../components/Header';
import More from '../screens/Feeds/more';
// import SingleReelInfo from '../screens/SingleReel/SingleReelInfo';
import ReelInfo from '../screens/Feeds/reelInfo';
// import TransionalReelView from '../screens/Feeds/transionalReelView';

// import { createSharedElementStackNavigator,SharedElement } from 'react-navigation-shared-element';
// import { TransitionPresets } from '@react-navigation/stack';

const Stack = createNativeStackNavigator();

// const horizontalAnimation = {
//   gestureDirection: 'horizontal',
//   headerShown: false,
//   cardStyleInterpolator: ({ current, layouts }) => {
//     return {
//       cardStyle: {
//         transform: [
//           {
//             translateX: current.progress.interpolate({
//               inputRange: [0, 1],
//               outputRange: [layouts.screen.width, 0],
//             }),
//           },
//         ],
//       },
//     };
//   },
// };

// const Stack = createNativeStackNavigator();
const RootNavigations = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      // mode="modal"
      screenOptions={{headerShown: false,}}
      >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen
        name="Admin"
        component={Agent}
        // options={{
        //   header: props => <Header {...props} />,
        //   headerShown: true,
        // }}
      />
      <Stack.Screen 
        name="More"
        component={More}
        options={{
          headerShown: false,
          // ...TransitionPresets.ModalFadeTransition,
        }}
        // sharedElements={(route) => {
        //   console.log(route,'transition route');
        //   return [route.params.item._id];
        // }}
      />
      <Stack.Screen 
        name="SingleReel" 
        component={SingleReel} 
        // sharedElements={(route) => {
        //   console.log(route,'transition route');
        //   return [route.params.item._id];
        // }}
      />
      {/* <Stack.Screen name="SingleReel" component={SingleReelInfo} /> */}
      <Stack.Screen 
        name="ReelInfo" 
        component={ReelInfo}
        // sharedElements={(route) => {
        //   console.log(route,'transition route');
        //   return [route.params.item._id];
        // }} 
      />
      {/* <Stack.Screen 
        name="TransionalReelView" 
        component={TransionalReelView} 
        // sharedElements={(route) => {
        //   console.log(route,'transition route');
        //   return [route.params.reel._id];
        // }}

      /> */}
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
      <Stack.Screen
        name="Feedback"
        component={Feedback}
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
