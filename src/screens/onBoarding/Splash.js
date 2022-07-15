import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  PermissionsAndroid,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, typography} from '../../themes';
import {displayToast, load, loadString, save} from '../../utils';
import {Key} from '../../Constant/constant';
import {useIsFocused} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

const Splash = props => {
  const navigation = props.navigation;
  const isFocused = useIsFocused();

  useEffect(() => {
    loadString('token').then(res => {
      // console.log('token', res);
      Key.token = res
      setTimeout(() => {
        navigation.replace(res !== null ? 'BottomTab' : 'OnBoarding');
      }, 3000);
    });
  }, []);

  // useEffect(() => {
  //   load('coords').then(res => {
  //     if (res === null) {
  //       location();
  //     } else {
  //       console.log('cords');
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   location();
  // }, [isFocused]);

  // const location = async () => {
  //   if (Platform.OS === 'ios') {
  //     Geolocation.requestAuthorization('whenInUse')
  //       .then(result => {
  //         if (result === 'granted') {
  //           Geolocation.getCurrentPosition(
  //             info => {
  //               // console.log('geo location', info);
  //               save('coords', info);
  //             },
  //             error => {
  //               console.log(error.message);
  //             },
  //             {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
  //           );
  //         } else {
  //           displayToast('in error');
  //           Alert.alert(
  //             `Turn on Location Services to allow SpaceHub to determine your location.`,
  //             '',
  //             [
  //               {text: 'Go to Settings', onPress: openSetting},
  //               // {text: "Don't Use Location", onPress: () => {}},
  //             ],
  //           );
  //         }
  //       })
  //       .catch(error => console.log(error));
  //   } else {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: 'Device current location permission',
  //           message: 'Allow app to get your current location',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         Geolocation.getCurrentPosition(
  //           info => {
  //             // console.log('firsrt lat long', info);
  //             save('coords', info);
  //           },
  //           error => {
  //             console.log(error.message);
  //           },
  //           {
  //             enableHighAccuracy: false,
  //             timeout: 20000,
  //             maximumAge: 1000,
  //             forceLocationManager: true,
  //             forceRequestLocation: true,
  //           },
  //         );
  //       } else {
  //         Alert.alert(
  //           `Turn on Location Services to allow SpaceHub to determine your location.`,
  //           '',
  //           [{text: 'Go to Settings', onPress: openSetting}],
  //         );
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }
  // };

  // const openSetting = () => {
  //   Linking.openSettings().catch(() => {
  //     Alert.alert('Unable to open settings');
  //   });
  // };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{flex: 1, backgroundColor: colors.backgroundShadow}}
        source={require('../../assets/Illustrations/splashBackground.png')}
        resizeMode="cover">
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.title}>“Let’s Play House”</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: 'rgba(186, 186, 186, 1)',
    fontFamily: typography.secondary,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 71,
    lineHeight: 29,
  },
});
