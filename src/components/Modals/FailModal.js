import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
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
      animationInTiming={600}
      onBackdropPress={() => {
        props.setFailModal(false);
      }}
      style={{
        margin: 0,
        // zIndex: -1,
      }}>
      <View style={styles.centeredView}>
        <ImageBackground
          source={require('../../assets/Illustrations/ohno.png')}
          resizeMode="stretch"
          style={styles.modalView}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}>
            <Pressable
              onPress={handleNextVideo}
              style={{alignSelf: 'flex-end', padding: 8, marginEnd: 12}}
              hitSlop={2}>
              <Image
                source={require('../../assets/icons/cross1.png')}
                style={{height: 24, width: 24}}
                resizeMode="contain"
              />
            </Pressable>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.bigtext}>OH NO!</Text>
              <Text style={styles.smalltext}>YOU MISSED IT</Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                // marginBottom: 30,
              }}>
              <Image
                source={require('../../assets/Illustrations/LINE.png')}
                resizeMode="contain"
                style={{width: WIDTH - 80}}
              />
              <Text style={styles.price}>{props.currency} {props.price}</Text>
              <Image
                source={require('../../assets/Illustrations/LINE.png')}
                resizeMode="contain"
                style={{width: WIDTH - 80}}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                marginVertical: 4
              }}>
              <Image
                source={require('../../assets/icons/GEM.png')}
                resizeMode="contain"
                style={{width: 34, height: 34}}
              />
              <Text
                style={{
                  fontSize: 24,
                  color: '#89C8BF',
                  marginHorizontal: 24,
                  fontFamily: typography.primary,
                  fontWeight: '500',
                }}>
                X
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  color: '#89C8BF',
                  fontFamily: typography.secondary,
                  fontWeight: '600',
                }}>
                0
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flex: 1,
                // marginVertical: 20,
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onPress={handleNextVideo}>
              <Text style={styles.continue}>Continue</Text>
              <Image
                source={require('../../assets/icons/ARROW.png')}
                resizeMode="contain"
                style={{height: 18, width: 18, marginStart: 8}}
              />
            </TouchableOpacity>
          </ScrollView>
        </ImageBackground>
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
    width: WIDTH - 100,
    height: HEIGHT / 2.6,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  bigtext: {
    fontSize: 28,
    fontFamily: typography.secondary,
    fontWeight: '800',
    color: colors.white,
  },
  smalltext: {
    fontSize: 16,
    fontFamily: typography.secondary,
    fontWeight: '600',
    color: '#89C8BF',
    marginVertical: 6
  },
  text1: {
    fontSize: 18,
    fontFamily: typography.primary,
    fontWeight: '600',
    // marginBottom: 24,
    color: colors.white,
  },
  price: {
    fontSize: 20,
    fontFamily: typography.primary,
    fontWeight: '800',
    color: colors.white,
    paddingVertical: 10,
  },
  continue: {
    fontSize: 18,
    fontFamily: typography.primary,
    fontWeight: '500',
    color: 'yellow',
  },
});
