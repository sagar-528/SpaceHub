import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  LogBox,
} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigations from './src/routes/RootNavigations';
import Animated from 'react-native-reanimated';
import {
  gestureHandlerRootHOC,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import SystemNavigationBar from 'react-native-system-navigation-bar';

const App = () => {
  useEffect(() => {
    SystemNavigationBar.navigationHide();
  }, []);

  LogBox.ignoreLogs([
    'ViewPropTypes will be removed',
    'ColorPropType will be removed',
  ]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
    {/* <View style={{flex:1}}> */}
      <StatusBar barStyle="default" translucent backgroundColor="transparent" />
      <SafeAreaProvider>
        <NavigationContainer>
          <BottomSheetModalProvider>
            <RootNavigations />
          </BottomSheetModalProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
    // </View>
  );
};

export default App;

const styles = StyleSheet.create({});
