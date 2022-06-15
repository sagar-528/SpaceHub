import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors} from '../themes';

const CustomMarker = props => {
  const item = props.item;
  const index = props.index;
  const navigation = props.navigation;

  const [borderWidth, setBorderWidth] = useState(0.8);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setBorderWidth(0.8);
    });
    return unsubscribe;
  }, [navigation]);

  function nFormatter(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
  }

  const handleSingleMarker = (item, index) => {
    navigation.navigate('SingleReel', {
      item: item,
      index: index,
    });
    setBorderWidth(2);
  };

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <TouchableOpacity
        style={{
          backgroundColor:
            item.isVideoPresent === false ? colors.white : colors.darkSky,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: borderWidth,
          flex: 1,
          borderRadius: 6,
        }}
        onPress={() => handleSingleMarker(item, index)}>
        <Text
          style={{
            textAlign: 'center',
            padding: 5,
            fontSize: 12,
            color: item.isVideoPresent === false ? 'black' : colors.white,
          }}>
          {`£${nFormatter(item.price)}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomMarker;

const styles = StyleSheet.create({});
