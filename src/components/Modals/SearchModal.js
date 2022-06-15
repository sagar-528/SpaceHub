import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {colors, typography} from '../../themes';
import CustomPicker from '../DropDown/CustomPicker';
import Modal from 'react-native-modal';
import AxiosBase from '../../services/AxioBase';
import {displayToast} from '../../utils';
import {Amount} from '../../Constant/constant';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const SearchModal = props => {
  const [maxRange, setMaxRange] = useState();
  const [minRange, setMinRange] = useState();
  const [bed, setBed] = useState('1');

  const handleSearch = () => {
    if (maxRange !== undefined && minRange === undefined) {
      setMaxRange();
    } else if (minRange !== undefined && maxRange === undefined) {
      setMinRange();
    } else {
      AxiosBase.get('app/property/getProperty', {
        params: {
          limit: 1000000,
          page: 0,
          priceMin: minRange,
          priceMax: maxRange,
          minBeds: 1,
          maxBeds: bed,
        },
      })
        .then(response => {
          console.log('response', response?.data);
          if(response?.data?.code === 200){
            if (response?.data?.data.length !== 0) {
              console.log('data');
              props.setProjects(response?.data?.data);
              props.setModalVisible(false);
              setMaxRange();
              setMinRange();
              setBed('1');
            } else {
              console.log('error');
              props.setModalVisible(false);
              setMaxRange();
              setMinRange();
              setBed('1');
              displayToast('No Data Found.');
            }
          }else{
            displayToast(response?.data?.message)
          }
        })
        .catch(error => {
          console.log('error', error.response.data);
        });
    }
  };

  return (
    <Modal
      testID={'modal'}
      isVisible={props.modalVisible}
      useNativeDriverForBackdrop
      // swipeDirection={['down']}
      animationInTiming={800}
      onBackdropPress={() => {
        props.setModalVisible(false);
        setMaxRange();
        setMinRange();
        setBed('1');
      }}
      style={{margin: 0}}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalRoot}>
            <Text style={styles.modalTitle}>Price Range</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                props.setModalVisible(false);
                setMaxRange();
                setMinRange();
                setBed('1');
              }}>
              <Image
                source={require('../../assets/icons/close.png')}
                style={{height: 24, width: 24}}
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}>
            <View style={{marginVertical: 35}}>
              <CustomPicker
                title={'No min'}
                OPTIONS={Amount.AMOUNT}
                chooseData={minRange}
                setChooseData={e => setMinRange(e)}
              />
            </View>
            <View>
              <CustomPicker
                title={'No max'}
                OPTIONS={Amount.AMOUNT}
                chooseData={maxRange}
                setChooseData={e => setMaxRange(e)}
              />
            </View>
            <View style={{marginTop: 58}}>
              <Text style={styles.bedroom}>Bedrooms (min)</Text>
              <View style={{marginVertical: 24}}>
                <CustomPicker
                  title={'1'}
                  OPTIONS={Amount.BED}
                  chooseData={bed}
                  setChooseData={e => setBed(e)}
                />
              </View>
            </View>
            <View style={{marginTop: 30}}>
              <Text
                style={[styles.bedroom, {color: colors.darkSky, fontSize: 18}]}>
                Scroll map to show search area
              </Text>
            </View>
            <View style={{marginTop: 34}}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.darkSky,
                  borderRadius: 8,
                  marginHorizontal: 14,
                }}
                activeOpacity={0.7}
                onPress={handleSearch}>
                <Text style={styles.btnView}>Apply</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: colors.backgroundShadow,
    borderTopEndRadius: 14,
    borderTopStartRadius: 14,
    opacity: 0.95,
    width: WIDTH,
    height: HEIGHT / 1.6,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  modalRoot: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.white,
    fontSize: 20,
    fontFamily: typography.Bold,
    fontWeight: '700',
  },
  range: {
    color: colors.white,
    fontSize: 14,
    fontFamily: typography.primary,
    fontWeight: '300',
  },
  bedroom: {
    color: colors.white,
    fontSize: 16,
    fontFamily: typography.Bold,
    fontWeight: '700',
  },
  btnView: {
    alignSelf: 'center',
    paddingVertical: 12,
    fontSize: 20,
    fontFamily: typography.Bold,
    fontWeight: '600',
    color: colors.white,
  },
});
