import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, typography} from '../../themes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {clear, load, remove} from '../../utils';
import {Key} from '../../Constant/constant';

const Profile = props => {
  const navigation = props.navigation;
  const setVisible = props.setVisible
  const [userName, setUserName] = useState('');

  useEffect(() => {
    load('userData')
      .then(response => {
        setUserName(response.name);
      })
      .catch(error => {
        console.log('error in async');
      });
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Do you want to Logout?', [
      {
        text: 'Cancel',
        onPress: () => {
          // console.log("Cancel Pressed");
        },
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          remove('token', 'userData');
          Key.token=''
          navigation.navigate('SignUp');
          setVisible(false)
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{backgroundColor: '#282828', opacity: 0.95}}
      contentContainerStyle={styles.container}>
      <SafeAreaView />
      <Text style={[styles.title, {color: colors.white}]}>
        MY <Text style={{color: colors.darkSky}}>SPACE</Text>HUB ACCOUNT
      </Text>
      <View style={{flex: 1, marginTop: 58}}>
        <Text style={styles.label}>Account</Text>
        <View style={styles.box}>
          <View style={styles.view}>
            <View style={styles.row}>
              <Text style={styles.userName}>{userName}</Text>
              <TouchableOpacity activeOpacity={0.6} onPress={handleLogout}>
                <Text
                  style={[styles.userName, {color: 'rgba(154, 154, 154, 1)'}]}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.view}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                navigation.navigate('LikeVideos');
              }}
              activeOpacity={0.6}>
              <Text style={styles.userName}>Liked Videos</Text>
              <Image
                source={require('../../assets/icons/Vector.png')}
                resizeMode="contain"
                style={{height: 16, width: 16}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.view}>
            <Pressable 
              style={styles.row}
              onPress={() => {
                navigation.navigate('Feedback');
              }}
              >
              <Text style={styles.userName}>Feedback</Text>
              <Image
                source={require('../../assets/icons/Vector.png')}
                resizeMode="contain"
                style={{height: 16, width: 16}}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.view}>
            <Pressable 
              style={styles.row}
              onPress={() => {
                navigation.navigate('LeaderBorad')
              }}
              >
              <Text style={styles.userName}>Game Mode</Text>
              <Image
                source={require('../../assets/icons/Vector.png')}
                resizeMode="contain"
                style={{height: 16, width: 16}}
              />
            </Pressable>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View style={{flexDirection: 'row', marginBottom: 70}}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('Terms');
              }}
              >
              <Text style={styles.form}>Terms Of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('Support');
              }}>
              <Text style={[styles.form, {marginStart: 45}]}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontFamily: typography.ExtraBold,
    fontSize: 22,
    fontWeight: '800',
  },
  label: {
    fontFamily: typography.Bold,
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    paddingBottom: 18,
  },
  box: {
    marginBottom: 45,
  },
  view: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.darkSky,
    borderRadius: 6,
    height: 47,
    backgroundColor: colors.backgroundShadow,
    opacity: 1,
    paddingHorizontal: 12,
  },
  userName: {
    fontFamily: typography.Bold,
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  form: {
    fontFamily: typography.Bold,
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkSky,
  },
});
