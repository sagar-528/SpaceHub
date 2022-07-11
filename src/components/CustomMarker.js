import {StyleSheet, Text, TouchableOpacity, View, ImageBackground,Image} from 'react-native';
import React, {useState, useEffect,useRef,useCallback} from 'react';
import {colors} from '../themes';
import { useNavigation } from '@react-navigation/native';
import SingleReel from '../screens/SingleReel/SingleReel';


const CustomMarker = props => {
  const item = props.item;
  const index = props.index;
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);

  const [borderWidth, setBorderWidth] = useState(0.8);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     setBorderWidth(0.8);
  //   });
  //   return unsubscribe;
  // }, [navigation]);

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


  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSingleMarker = () => {
    // alert('hkjj')
    navigation.navigate('SingleReel', {
      item: item,
      index:index
    });
    setBorderWidth(2);

    // handlePresentModalPress()
    

  };

  const image = item.isVideoPresent ? require('../assets/icons/videoProperty.png') : require('../assets/icons/imageProperty.png')

  return (
    <>
    <View style={{}}>
        <TouchableOpacity
          style={{
            // backgroundColor:
            //   item.isVideoPresent === false ? colors.white : colors.darkSky,
            // alignItems: 'center',
            // justifyContent: 'center',
            // backgroundColor:'red'
            // borderWidth: borderWidth,
            // flex: 1,
            // borderRadius: 6,
          }}
          // onPress={() => handleSingleMarker()}
          // activeOpacity={0.8}
          >
          <Image source={image}  style={{width:40,height:30,aspectRatio:2}}/>
          <View style={{position:'absolute',left:14,top:4}}>
            <Text
              style={{
                textAlign: 'center',
                // padding: 6,
                // paddingBottom:12,
                fontSize: 12,
                color: item.isVideoPresent === false ? 'black' : colors.white,
              }}>
              {`£${nFormatter(item.price)}`}
            </Text>
          </View>
        </TouchableOpacity>
    </View>
    {/* <SingleReel bottomSheetRef={bottomSheetRef} item={item} navigation={navigation} index={index}/> */}
    </>
  );
};

export default CustomMarker;

const styles = StyleSheet.create({});
