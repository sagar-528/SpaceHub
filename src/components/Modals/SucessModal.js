import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {colors, typography} from '../../themes';
import {ScrollView} from 'react-native-gesture-handler';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const SucessModal = props => {
  const handleNextVideo = () => {
    props.setSucessModal(false);
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
      isVisible={props.sucessModal}
      useNativeDriverForBackdrop
      animationInTiming={600}
      onBackdropPress={() => {
        props.setSucessModal(false);
      }}
      style={{
        margin: 0,
        // zIndex: -1,
      }}>
      <View style={styles.centeredView}>
        <View style={{width: WIDTH - 50, height: HEIGHT / 2}}>
          <ImageBackground
            source={require('../../assets/Illustrations/yeah.png')}
            resizeMode="stretch"
            style={styles.modalView}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              showsVerticalScrollIndicator={false}>
              <Pressable
                onPress={handleNextVideo}
                style={{alignSelf: 'flex-end', padding: 8, marginEnd: 8}}
                hitSlop={2}>
                <Image
                  source={require('../../assets/icons/cross1.png')}
                  // style={}
                  resizeMode="contain"
                />
              </Pressable>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.bigtext}>YEAH!</Text>
                <Text style={styles.smalltext}>YOU NAILED IT</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 30,
                }}>
                <Image
                  source={require('../../assets/Illustrations/LINE.png')}
                  resizeMode="contain"
                  style={{width: WIDTH - 80}}
                />
                <Text style={styles.price}>{props.price}</Text>
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
                  marginTop: 8,
                }}>
                <Image
                  source={require('../../assets/icons/GEM.png')}
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
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  marginVertical: 20,
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
    width: WIDTH - 50,
    height: HEIGHT / 2,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  bigtext: {
    fontSize: 28,
    fontFamily: typography.secondary,
    fontWeight: '700',
    color: colors.white,
  },
  smalltext: {
    fontSize: 16,
    fontFamily: typography.primary,
    fontWeight: '500',
    color: colors.white,
    marginTop: 10,
    marginBottom: 30,
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
    paddingVertical: 10,
  },
  continue: {
    fontSize: 18,
    fontFamily: typography.primary,
    fontWeight: '500',
    color: 'yellow',
  },
});
