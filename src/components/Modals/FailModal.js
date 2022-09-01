import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  ImageBackground,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {colors, typography} from '../../themes';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const FailModal = props => {
  const handleNextVideo = () => {
    props.setFailModal(false);
    // setTimeout(() => {
    //   props.flatRef.current.scrollToIndex({
    //     index: props.currentIndex + 1,
    //     animated: true,
    //     viewOffset: 1,
    //   });
    // }, 1000);
  };

  return (
    <Modal
      testID={'modal'}
      isVisible={props.failModal}
      useNativeDriverForBackdrop
      animationInTiming={800}
      onBackdropPress={() => {
        props.setFailModal(false);
      }}
      style={{
        margin: 0,
        // zIndex: -1,
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable
            onPress={() => handleNextVideo()}
            style={{alignSelf: 'flex-end', padding: 4}}
            hitSlop={2}>
            <Image
              source={require('../../assets/icons/cross1.png')}
              // style={}
              resizeMode="contain"
            />
          </Pressable>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../assets/icons/sad.png')}
              resizeMode="contain"
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.bigtext}>Oops!</Text>
            <Text style={styles.smalltext}>Better Luck Next Time</Text>
            <Text style={styles.text1}>ACTUAL LISTING PRICE</Text>
          </View>
          <ImageBackground
            source={require('../../assets/icons/button.png')}
            resizeMode="cover"
            style={{height: 52}}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.price}>{props.price}</Text>
            </View>
          </ImageBackground>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 8,
            }}>
            <Image
              source={require('../../assets/icons/coin.png')}
              resizeMode="center"
              style={{width: 44, height: 44}}
            />
            <Text
              style={{
                fontSize: 16,
                color: colors.white,
                marginHorizontal: 24,
                fontFamily: typography.primary,
                fontWeight: '500',
              }}>
              X
            </Text>
            <Text
              style={{
                fontSize: 24,
                color: colors.white,
                fontFamily: typography.secondary,
                fontWeight: '600',
              }}>
              0
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FailModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    // zIndex: 1
  },
  modalView: {
    backgroundColor: '#282828',
    opacity: 0.9,
    borderRadius: 8,
    width: WIDTH - 80,
    height: HEIGHT / 2.1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 2.3,
    borderColor: colors.darkSky,
  },
  bigtext: {
    fontSize: 28,
    fontFamily: typography.secondary,
    fontWeight: '700',
    // marginBottom: 24,
    color: colors.white,
  },
  smalltext: {
    fontSize: 16,
    fontFamily: typography.primary,
    fontWeight: '500',
    marginVertical: 6,
    color: colors.white,
  },
  text1: {
    fontSize: 18,
    fontFamily: typography.primary,
    fontWeight: '600',
    marginBottom: 24,
    color: colors.white,
  },
  price: {
    fontSize: 20,
    fontFamily: typography.primary,
    fontWeight: '800',
    color: colors.white,
  },
});
