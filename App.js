import 'react-native-gesture-handler'
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  LogBox,
  AppState
} from 'react-native';
import React, {useEffect,useRef} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigations from './src/routes/RootNavigations';
// import Animated from 'react-native-reanimated';
// import {
//   gestureHandlerRootHOC,
//   GestureHandlerRootView,
// } from 'react-native-gesture-handler';
import {BottomSheetModalProvider,useBottomSheetTimingConfigs} from '@gorhom/bottom-sheet';
// import SystemNavigationBar from 'react-native-system-navigation-bar';
// import { Key } from './src/Constant/constant';
// import { enableScreens } from 'react-native-screens';
// enableScreens(false);

const App = () => {

  return (
    // <GestureHandlerRootView style={{flex: 1}}>
    <View style={{flex:1}}>
      <StatusBar barStyle="default" translucent backgroundColor="transparent" />
      <SafeAreaProvider>
        <NavigationContainer>
          <BottomSheetModalProvider>
            <RootNavigations />
          </BottomSheetModalProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </View>
    // </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
