import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {colors} from '../themes';

const Header = props => {
  const navigation = props.navigation;

  return (
    <View style={styles.headerContainer}>
      {props.route.name !== 'Admin' ? (
        <View style={{paddingLeft: 24, paddingTop: 12, position: 'absolute'}}>
          <TouchableOpacity
            style={{backgroundColor: 'white', padding: 4, borderRadius: 6}}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/icons/back.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            paddingLeft: 24,
            paddingTop: 22,
            position: 'absolute',
            right: 0,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            activeOpacity={0.8}
            style={{alignSelf: 'flex-end', marginEnd: 24, marginBottom: 14}}>
            <Image
              source={require('../assets/icons/close.png')}
              resizeMode="contain"
              style={{height: 24, width: 24}}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    height: 54,
    backgroundColor: colors.backgroundShadow,
    opacity: 0.95
  },
});
