import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {colors, typography} from '../../themes';
import {TextInput} from 'react-native-gesture-handler';
import AxiosBase from '../../services/AxioBase';
import qs from 'qs';
import {ScrollContainer} from '../ScrollContainer';
import { displayToast } from '../../utils';
import { Loader } from '../Loader';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const ForgotPassword = props => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false)

  const handleForgot = () => {
    const info = {
      email: email,
    };
    AxiosBase.post('app/user/forgotPassword', qs.stringify(info))
      .then(response => {
        setLoading(true)
        // console.log('response for forgot api', response.data.data);
        props.setModalVisible(false);
        setEmail('')
        setLoading(false)
        displayToast(response.data.data)
        
      })
      .catch(error => {
        console.log('error for api', error);
        props.setModalVisible(false);
        displayToast('Something went wrong')
        setEmail('')
        setLoading(false)
      });
  };

  return (
    <Modal
      testID={'modal'}
      isVisible={props.modalVisible}
      useNativeDriverForBackdrop
      // swipeDirection={['down']}
      animationInTiming={800}
      onBackdropPress={() => {
        props.setModalVisible(false);
      }}
      style={{
        margin: 0,
      }}>
        <Loader visible={loading} />
      <ScrollContainer>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalRoot}>
              <Text style={styles.modalTitle}>Forgot Password</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  props.setModalVisible(false);
                }}>
                <Image
                  source={require('../../assets/icons/close.png')}
                  style={{height: 24, width: 24}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 24}}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={e => setEmail(e)}
                placeholder="Enter your Email Address"
                placeholderTextColor={colors.white}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.darkSky,
                  borderRadius: 8,
                  marginHorizontal: 14,
                }}
                activeOpacity={0.7}
                onPress={handleForgot}>
                <Text style={styles.btnView}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollContainer>
    </Modal>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: colors.backgroundShadow,
    // borderRadius: 14,
    borderTopEndRadius: 14,
    borderTopStartRadius: 14,
    opacity: 0.95,
    width: WIDTH,
    height: HEIGHT / 2.5,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  modalRoot: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.white,
    fontSize: 20,
    fontFamily: typography.Bold,
    fontWeight: '700',
  },
  label: {
    fontFamily: typography.Bold,
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    paddingBottom: 8,
  },
  input: {
    // flex: 1,
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
  btnView: {
    alignSelf: 'center',
    paddingVertical: 12,
    fontSize: 20,
    fontFamily: typography.Bold,
    fontWeight: '600',
    color: colors.white,
  },
});
