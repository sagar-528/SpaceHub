import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {colors, typography} from '../../themes';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const SucessModal = props => {
  const handleNextVideo = () => {
    props.setSucessModal(false);
    props.flatRef.current.scrollToIndex({index: props.currentIndex + 1, animated: true});
  };

  return (
    <Modal
      testID={'modal'}
      isVisible={props.sucessModal}
      useNativeDriverForBackdrop
      animationInTiming={800}
      onBackdropPress={() => {
        props.setSucessModal(false);
      }}
      style={{
        margin: 0,
        // zIndex: -1,
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable
            onPress={handleNextVideo}
            style={{alignSelf: 'flex-end', padding: 4}}
            hitSlop={2}>
            <Image
              source={require('../../assets/icons/cross1.png')}
              // style={}
              resizeMode="contain"
            />
          </Pressable>
          <View style={{alignItems: 'center', marginBottom: 34}}>
            <Image
              source={require('../../assets/icons/smile.png')}
              resizeMode="contain"
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.bigtext}>Congratulations!</Text>
            <Text style={styles.smalltext}>You nailed it</Text>
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
              marginTop: 24,
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
              100
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SucessModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: 1
  },
  modalView: {
    backgroundColor: '#282828',
    opacity: 0.9,
    borderRadius: 8,
    width: WIDTH - 24,
    height: HEIGHT / 1.6,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  bigtext: {
    fontSize: 28,
    fontFamily: typography.secondary,
    fontWeight: '700',
    marginBottom: 24,
    color: colors.white,
  },
  smalltext: {
    fontSize: 16,
    fontFamily: typography.primary,
    fontWeight: '500',
    marginBottom: 40,
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
