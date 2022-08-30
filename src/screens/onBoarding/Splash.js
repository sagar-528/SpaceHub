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
      Key.token = res
      setTimeout(() => {
        navigation.replace(res !== null ? 'BottomTab' : 'OnBoarding');
      }, 3000);
    });
  }, []);

  
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
