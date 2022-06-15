import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {colors, typography} from '../themes';

const Close = props => {
  return (
    <View style={{paddingTop: 24}}>
      <View style={{flex: 1, alignSelf: 'center'}}>
        {props.expandVisible === true ? (
          <TouchableOpacity activeOpacity={0.7}>
            <Image
              source={require('../assets/icons/upward.png')}
              resizeMode="contain"
              style={styles.icon}
            />
            <Text
              style={{
                fontSize: 10,
                color: colors.darkSky,
                fontFamily: typography.primary,
                textAlign: 'center'
              }}>
              swipe
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={props.handleDismissModalPress}>
            <Image
              source={require('../assets/icons/newColor.png')}
              resizeMode="contain"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flex: 1,
          alignSelf: 'flex-end',
          position: 'absolute',
          right: 24,
          top: 24,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={props.handleDismissModalPress}>
          <Image
            source={require('../assets/icons/close.png')}
            resizeMode="contain"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Close;

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
  },
});
