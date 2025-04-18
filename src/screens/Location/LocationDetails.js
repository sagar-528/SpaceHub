import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useRef, useMemo} from 'react';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Callout,
} from 'react-native-maps';
import {colors, typography} from '../../themes';
import SearchModal from '../../components/Modals/SearchModal';
import {load, displayToast} from '../../utils';
import {Loader} from '../../components/Loader';
import {useIsFocused, StackActions} from '@react-navigation/native';
import AxiosBase from '../../services/AxioBase';
import NetInfo from '@react-native-community/netinfo';
import {Key} from '../../Constant/constant';

const LocationDetails = props => {
  const navigation = props.navigation;
  const isFocused = useIsFocused();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [longitude, setLongitude] = useState(Key.longitude); // london long
  const [longitudeDelta, setLongitudeDelta] = useState(0.1421);
  const [latitude, setLatitude] = useState(Key.latitude); // london lat
  const [latitudeDelta, setLatitudeDelta] = useState(0.1922);

  const [projects, setProjects] = useState([]);
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['100%', '100%'], []);

  useEffect(() => {
    load('coords')
      .then(response => {
        console.log('geo response', response);
        if (response) {
          setLatitude(response?.coords?.latitude);
          setLongitude(response?.coords?.longitude);
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  }, []);

  useEffect(() => {
    NetInfo.fetch().then(isConnected => {
      if (isConnected.isConnected === true) {
        AxiosBase.get('app/property/getProperty', {
          params: {
            limit: 1000000000,
            page: 0,
          },
        })
          .then(response => {
            setLoading(true);
            console.log('location response', response?.data?.data);
            setProjects(response?.data?.data);
            setLoading(false);
          })
          .catch(error => {
            setLoading(false);
            console.log('error in feeds api', error.response);
          });
      } else {
        displayToast('Internet Connection Problem');
      }
    });
  }, []);

  const mapRef = useRef(null);

  // const _onRegionChangeComplete = location => {
  //   // setMemoLatitude(location.latitude), setMemoLongitude(location.longitude);
  //   // setMemoLatitudeDelta(location.latitudeDelta),setMemoLongitudeDelta(location.longitudeDelta)
  //   // console.log(e);
  //   if (location) {
  //     console.log('change location, location: ', location)
  //     mapRef.current.animateToRegion({
  //       latitude: location.latitude,
  //       longitude: location.longitude,
  //       latitudeDelta: location.latitudeDelta,
  //       longitudeDelta: location.longitudeDelta,
  //     })
  //   }
  // };

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
      projects: projects,
      setProjects: setProjects,
    });
  };

  useEffect(() => {
    const blur = navigation.addListener('blur', () => {
      console.log('blured');
    });

    const focus = navigation.addListener('focus', () => {
      console.log('focused');
      // setLatitude(memoLatitude), setLongitude(memoLongitude);
      // setLatitudeDelta(memoLatitudeDelta),setLongitudeDelta(memoLongitudeDelta)
    });

    return blur, focus;
  }, [navigation]);

  return (
    <View style={{flex: 1}}>
      <Loader visible={loading} />
      <TouchableOpacity
        style={styles.searchView}
        onPress={() => {
          setVisible(true);
        }}
        activeOpacity={0.7}>
        <Image
          source={require('../../assets/icons/search.png')}
          style={{height: 14, width: 14}}
          resizeMode="contain"
        />
        <Text style={styles.text}>SEARCH</Text>
      </TouchableOpacity>
      {latitude && longitude && (
        <MapView
          style={styles.map}
          ref={mapRef}
          provider={
            Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          initialRegion={{
            latitude: 51.5299092,
            longitude: -0.1860307,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}
          showsUserLocation
          // mapType
        >
          {projects &&
            projects.map((item, index) => (
              <View key={index}>
                {item.propertyType === 'SOLD' ||
                item.propertyType === 'FOR SALE' ? (
                  <Marker
                    // key={item.propertyType === 'SOLD' && item.propertyType === 'FOR SALE'}

                    coordinate={{
                      latitude: item.address.loc.coordinates[1],
                      longitude: item.address.loc.coordinates[0],
                    }}
                    onPress={() => handleSingleMarker(item, index)}>
                    {/* {console.log('hi')} */}
                    <View style={{}}>
                      <TouchableOpacity>
                        <Image
                          source={
                            item.isVideoPresent
                              ? require('../../assets/icons/videoProperty.png')
                              : require('../../assets/icons/imageProperty.png')
                          }
                          style={{width: 80, height: 30, aspectRatio: 2}}
                        />
                        <View style={{position: 'absolute', left: 14, top: 4}}>
                          <Text
                            style={{
                              textAlign: 'center',

                              fontSize: 12,
                              color:
                                item.isVideoPresent === false
                                  ? 'black'
                                  : colors.white,
                            }}>
                            {`${item.currency}${nFormatter(
                              parseInt(`${item.price}`.replace(',', '')),
                            )}`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </Marker>
                ) : (
                  <></>
                )}
              </View>
            ))}
        </MapView>
      )}
      <SearchModal
        latitude={latitude}
        longitude={longitude}
        modalVisible={visible}
        setModalVisible={setVisible}
        setProjects={setProjects}
      />
    </View>
  );
};

export default LocationDetails;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    // height:'100%'
  },
  searchView: {
    flex: 1,
    position: 'absolute',
    top: 44,
    right: 24,
    backgroundColor: colors.backgroundShadow,
    opacity: 0.9,
    zIndex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderRadius: 50,
  },
  text: {
    paddingStart: 6,
    color: colors.white,
    fontFamily: typography.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
});
