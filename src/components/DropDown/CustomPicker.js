import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Pressable,
  Text,
} from 'react-native';
import CustomModalPicker from './CustomModalPicker';
import {colors} from '../../themes';

export default function CustomPicker(props) {
  const {OPTIONS, chooseData, setChooseData, title} = props;

  const [isVisible, setIsVisible] = useState(false);

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

  const changeModalVisibility = bool => {
    setIsVisible(bool);
    // console.log(bool, 'condition for modal');
  };

  const setData = option => {
    // console.log(option, 'set');
    setChooseData(option);
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {title !== '1' ? (
          <>
            <Text style={styles.range}>{title}</Text>
            {chooseData === undefined ? (
              <TouchableOpacity
                onPress={() => {
                  setIsVisible(true);
                }}
                activeOpacity={0.7}>
                <Image
                  source={require('../../assets/icons/newColor.png')}
                  resizeMode="contain"
                  style={{height: 16, width: 16, marginStart: 40}}
                />
              </TouchableOpacity>
            ) : (
              <Text style={styles.price}>£{nFormatter(chooseData)}</Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.range}>{chooseData}</Text>
            <TouchableOpacity
              onPress={() => {
                setIsVisible(true);
              }}
              activeOpacity={0.7}>
              <Image
                source={require('../../assets/icons/newColor.png')}
                resizeMode="contain"
                style={{height: 16, width: 16, marginStart: 40}}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
      {/* {console.log('option', OPTIONS)} */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        avoidKeyboard={true}
        autoFocus={true}
        onRequestClose={() => setIsVisible(false)}>
        <CustomModalPicker
          changeModalVisibility={changeModalVisibility}
          setData={setData}
          OPTIONS={OPTIONS}
          title={title}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems:'center'
  },
  range: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    fontWeight: '300',
  },
  price: {
    marginStart: 40,
    color: colors.darkSky,
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    fontWeight: '700',
  },
});
