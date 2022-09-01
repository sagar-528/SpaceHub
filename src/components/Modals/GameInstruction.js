import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {colors, typography} from '../../themes';
import Switch from 'react-native-switch-pro';
import {save, load} from '../../utils';
import {useIsFocused, StackActions} from '@react-navigation/native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const GameInstruction = props => {
  const isFocused = useIsFocused();

  // useEffect(() => {
  //   load('Game_Mode')
  //     .then(response => {
  //       if (response !== null) {
  //         props.setGameMode(response);
  //       }
  //     })
  //     .catch(error => {
  //       console.log('async error', error);
  //     });
  // }, [isFocused]);

  return (
    <Modal
      testID={'modal'}
      isVisible={props.gameInstructionModal}
      useNativeDriverForBackdrop
      animationInTiming={600}
      onBackdropPress={() => {
        props.setGameInstructionModal(false);
      }}
      style={{
        margin: 0,
        // zIndex: -1,
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
            <View>
              <Text style={styles.title}>Pricing Game</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                props.setGameInstructionModal(false);
              }}>
              <Image
                source={require('../../assets/icons/cross1.png')}
                style={{height: 24, width: 24}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={[styles.title, {fontSize: 16, fontWeight: '500'}]}>
                Turn On Game
              </Text>
            </View>
            <Switch
              circleStyle={{}}
              style={{}}
              value={props.gameMode}
              width={64}
              height={34}
              circleColorActive={colors.white}
              circleColorInactive={colors.white}
              backgroundActive={'skyblue'}
              backgroundInactive="#F2F2F2"
              onSyncPress={value => {
                props.setGameMode(value);
                save('Game_Mode', value);
              }}
            />
          </View>
          <View style={{width: 300, marginTop: 24}}>
            <Text style={styles.des}>
              Is the real price{' '}
              <Text style={{color: colors.darkSky}}>heigher</Text> or{' '}
              <Text style={{color: '#f06292'}}>lower</Text> than the price
              shown?
            </Text>
          </View>
          <View>
            <Text style={[styles.des, {color: '#8bc34a', fontSize: 18}]}>
              Click for stats
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GameInstruction;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalView: {
    backgroundColor: '#282828',
    opacity: 0.9,
    borderRadius: 16,
    width: WIDTH - 80,
    height: HEIGHT / 2.8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 2.3,
    borderColor: colors.darkSky,
  },
  title: {
    fontSize: 20,
    fontFamily: typography.secondary,
    fontWeight: '700',
    marginBottom: 24,
    color: colors.white,
  },
  des: {
    fontSize: 16,
    fontFamily: typography.primary,
    fontWeight: '600',
    marginBottom: 24,
    color: colors.white,
  },
});
