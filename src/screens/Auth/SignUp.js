import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors, typography} from '../../themes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Loader} from '../../components/Loader';
import {ScrollContainer} from '../../components/ScrollContainer';
import AxiosBase from '../../services/AxioBase';
import qs from 'qs';
import {save, saveString, loadString, displayToast} from '../../utils';
import {Key} from '../../Constant/constant';
import {useIsFocused} from '@react-navigation/native';
import Profile from '../Clients/Profile';
import NetInfo from '@react-native-community/netinfo';

const SignUp = props => {
  const navigation = props.navigation;
  const isFocused = useIsFocused();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadString('token')
      .then(res => {
        // console.log("token in bottom", res);
        if (res === null) {
          // console.log();
          setVisible(false);
        } else {
          setVisible(true);
        }
      })
      .catch(error => {
        console.log('error in async');
      });
  }, [isFocused]);

  const handleSignUp = () => {
    setLoading(true)
    const info = {
      name: name,
      email: email,
      password: password,
      deviceType: Platform.OS === 'ios' ? 'IPhone' : 'Android',
      deviceToken: 'sadasd23',
    };

    NetInfo.fetch().then(isConnected => {
      if (isConnected.isConnected === true) {
        AxiosBase.post('app/user/createUser', qs.stringify(info))
          .then(response => {
            if (response.status === 200) {
              setLoading(false)
              save('userData', response?.data?.data?.user);
              saveString(
                'token',
                response?.data?.data?.token?.access?.accessToken,
              );
              Key.token=response?.data?.data?.token?.access?.accessToken
              setEmail('');
              setName('');
              setPassword('');
              // navigation.navigate('Profile');
              setVisible(true)
            }
          })
          .catch(error => {
            setLoading(false)
            if (error.response.data.code === 400) {
              displayToast(error.response.data.message);
            }
          });
      } else {
        displayToast('Internet Connection Problem');
      }
    });
  };

  return (
    <>
      <Loader visible={loading} />
      {visible === false ? (
        <ScrollView
          style={{backgroundColor: '#282828', opacity: 0.95}}
          contentContainerStyle={styles.container}>
          {/* <Loader visible={loading} /> */}
          <ScrollContainer>
            <SafeAreaView />
            <Text style={[styles.title, {color: colors.white}]}>
              MY <Text style={{color: colors.darkSky}}>SPACE</Text>HUB ACCOUNT
            </Text>
            <View style={{flex: 1, marginTop: 58}}>
              <View style={styles.box}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  value={name}
                  onChangeText={e => setName(e)}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.text}
                  style={styles.input}
                />
              </View>
              <View style={styles.box}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={e => setEmail(e)}
                  placeholder="Enter your Email Address"
                  placeholderTextColor={colors.text}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>
              <View style={styles.box}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={e => setPassword(e)}
                  placeholder="Enter your Password"
                  placeholderTextColor={colors.text}
                  autoCapitalize="none"
                  style={styles.input}
                  secureTextEntry
                />
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.darkSky,
                    width: '100%',
                    borderRadius: 12,
                  }}
                  activeOpacity={0.7}
                  onPress={handleSignUp}>
                  <Text style={styles.btnText}>Set Up Account</Text>
                </TouchableOpacity>
                <View
                  style={{
                    marginTop: 8,
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}>
                  <Text style={styles.small}>Already have an account? </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Login');
                    }}
                    activeOpacity={0.7}>
                    <Text style={[styles.small, {color: colors.darkSky}]}>
                      Log in here
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollContainer>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <View style={{flexDirection: 'row', marginBottom: 70}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('Terms');
                }}>
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
        </ScrollView>
      ) : (
        <Profile navigation={navigation} setVisible={setVisible}/>
      )}
    </>
  );
};

export default SignUp;

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
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.darkSky,
    borderRadius: 6,
    height: 47,
    backgroundColor: colors.backgroundShadow,
    opacity: 1,
    paddingHorizontal: 12,
    color: colors.white,
    fontSize: 13,
  },
  box: {
    marginBottom: 24,
  },
  btnText: {
    fontSize: 20,
    fontFamily: typography.secondary,
    fontWeight: '600',
    color: colors.white,
    alignSelf: 'center',
    paddingVertical: 12,
  },
  form: {
    fontFamily: typography.Bold,
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkSky,
  },
  small: {
    fontSize: 12,
    fontFamily: typography.Bold,
    color: colors.text,
    fontWeight: '600',
  },
});
