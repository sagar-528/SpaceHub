import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {colors, typography} from '../../themes';
import Slides from '../../components/Slides';

import {displayToast, load, loadString, save} from '../../utils';
import Geolocation from 'react-native-geolocation-service';
import {Key} from '../../Constant/constant';

const OnBoarding = props => {
  const navigation = props.navigation;
  const flatlistRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [viewableItems, setViewableItems] = useState([]);

  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    setViewableItems(viewableItems);
  });

  useEffect(() => {
    if (!viewableItems[0] || currentPage === viewableItems[0].index) return;
    setCurrentPage(viewableItems[0].index);
  }, [viewableItems]);

  const handleNext = () => {
    if (currentPage == Slides.length - 1) return;

    if (currentPage !== 2) {
      flatlistRef.current.scrollToIndex({
        animated: true,
        index: currentPage + 1,
      });
    }
  };

  const location = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse')
        .then(result => {
          if (result === 'granted') {
            Geolocation.getCurrentPosition(
              info => {
                console.log('geo location', info);
                save('coords', info);
                Key.latitude = info?.coords?.latitude;
                Key.longitude = info?.coords?.longitude;
              },
              error => {
                console.log(error.message);
              },
              {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
            );
          } else {
            displayToast('in error');
            Alert.alert(
              `Turn on Location Services to allow SpaceHub to determine your location.`,
              '',
              [
                {text: 'Go to Settings', onPress: openSetting},
                // {text: "Don't Use Location", onPress: () => {}},
              ],
            );
          }
        })
        .catch(error => console.log(error));
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Device current location permission',
            message: 'Allow app to get your current location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            info => {
              // console.log('firsrt lat long', info);
              save('coords', info);
            },
            error => {
              console.log(error.message);
            },
            {
              enableHighAccuracy: false,
              timeout: 20000,
              maximumAge: 1000,
              forceLocationManager: true,
              forceRequestLocation: true,
            },
          );
        } else {
          Alert.alert(
            `Turn on Location Services to allow SpaceHub to determine your location.`,
            '',
            [{text: 'Go to Settings', onPress: openSetting}],
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };

  const renderFlatlistItem = ({item}) => {
    // console.log('item', item);
    return (
      <SafeAreaView>
        <View
          style={{
            width: Dimensions.get('screen').width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {item.key === '1' ? (
            <>
              <Image
                source={require('../../assets/Illustrations/mobile.png')}
                resizeMode="contain"
                style={{
                  height: 370,
                  width: 272,
                }}
              />
              <Image
                source={require('../../assets/Illustrations/upperArrow.png')}
                resizeMode="cover"
                style={{
                  height: 60,
                  width: 80,
                }}
              />
            </>
          ) : (
            <>
              {item.key === '2' ? (
                <View style={{flexDirection: 'row', marginBottom: 44}}>
                  <Image
                    source={require('../../assets/Illustrations/mobile.png')}
                    resizeMode="contain"
                    style={{
                      height: 370,
                      width: 272,
                    }}
                  />
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      position: 'absolute',
                      right: 0,
                      bottom: -12,
                    }}>
                    <Image
                      source={require('../../assets/Illustrations/sideArrow.png')}
                      resizeMode="cover"
                      style={{
                        height: 90,
                        width: 60,
                      }}
                    />
                  </View>
                </View>
              ) : (
                <View style={{flexDirection: 'row', marginBottom: 44}}>
                  <View>
                    <ImageBackground
                      source={require('../../assets/Illustrations/mobile.png')}
                      resizeMode="contain"
                      style={{
                        height: 370,
                        width: 272,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View style={{marginBottom: 40}}>
                        <Image
                          source={require('../../assets/Illustrations/locationPopUp.png')}
                          resizeMode="contain"
                          style={{
                            height: 200,
                            width: 100,
                          }}
                        />
                      </View>
                    </ImageBackground>
                  </View>
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      position: 'absolute',
                      right: 0,
                      bottom: -12,
                    }}>
                    <Image
                      source={require('../../assets/Illustrations/sideArrow.png')}
                      resizeMode="cover"
                      style={{
                        height: 90,
                        width: 60,
                      }}
                    />
                  </View>
                </View>
              )}
            </>
          )}
          <Text style={styles.title}>{item.description}</Text>
        </View>
      </SafeAreaView>
    );
  };

  const renderBottomSection = () => {
    return (
      <View>
        {currentPage != Slides.length - 1 ? (
          <View style={{marginHorizontal: 52}}>
            <TouchableOpacity
              style={styles.btnView}
              activeOpacity={0.8}
              onPress={handleNext}>
              <Text style={styles.btn}>next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{marginHorizontal: 52}}>
            <TouchableOpacity
              style={styles.btnView}
              activeOpacity={0.8}
              onPress={() => {
                location();
                navigation.navigate('BottomTab');
              }}>
              <Text style={styles.btn}>next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotContainer}>
        <View
          style={{
            ...styles.dot,
            backgroundColor:
              currentPage === 0 ? '#fff' : 'rgba(255,255,255,0.6)',
            margin: 4,
          }}
        />
        <View
          style={{
            ...styles.dot,
            backgroundColor:
              currentPage === 1 ? '#fff' : 'rgba(255,255,255,0.6)',
            margin: 4,
          }}
        />
        <View
          style={{
            ...styles.dot,
            backgroundColor:
              currentPage === 2 ? '#fff' : 'rgba(255,255,255,0.6)',
            margin: 4,
          }}
        />
      </View>
    );
  };

  // console.log('current page', currentPage);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/Illustrations/onBoardBackground.png')}
        style={{
          flex: 1,
          backgroundColor: colors.backgroundShadow,
          paddingVertical: 50,
        }}
        resizeMode="cover">
        <FlatList
          data={Slides}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.key}
          renderItem={renderFlatlistItem}
          ref={flatlistRef}
          onViewableItemsChanged={handleViewableItemsChanged.current}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 100}}
          initialNumToRender={1}
        />
        {renderDots()}
        {renderBottomSection()}
      </ImageBackground>
    </View>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  mobile: {
    height: 505,
    width: 280,
    alignSelf: 'center',
  },
  title: {
    color: colors.text,
    fontFamily: typography.secondary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 52,
    // width: 150,
  },
  btnView: {
    backgroundColor: colors.darkSky,
    alignItems: 'center',
    borderRadius: 8,
  },
  btn: {
    paddingVertical: 14,
    fontFamily: typography.secondary,
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
