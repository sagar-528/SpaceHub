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
import React, {useState, useEffect} from 'react';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {colors, typography} from '../../themes';
import SearchModal from '../../components/Modals/SearchModal';
import {load, displayToast} from '../../utils';
import {Loader} from '../../components/Loader';
import {useIsFocused} from '@react-navigation/native';
import AxiosBase from '../../services/AxioBase';
import CustomMarker from '../../components/CustomMarker';
import NetInfo from '@react-native-community/netinfo';

const LocationDetails = props => {
  const navigation = props.navigation;
  const isFocused = useIsFocused();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    load('coords')
      .then(response => {
        setLatitude(response?.coords?.latitude);
        setLongitude(response?.coords?.longitude);
      })
      .catch(error => {
        console.log(error.message);
      });
  }, [isFocused]);

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
            // console.log('location response', response?.data?.data);
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
  }, [isFocused]);

  const _onRegionChangeComplete = e => {
    setLatitude(e.latitude), setLongitude(e.longitude);
  };

  return (
    <>
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
          provider={
            Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          clustering={true}
          showsUserLocation
          // mapType
        >
          {projects.map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: item.address.loc.coordinates[1],
                longitude: item.address.loc.coordinates[0],
              }}>
              <CustomMarker item={item} index={index} navigation={navigation} />
            </Marker>
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
    </>
  );
};

export default LocationDetails;

const styles = StyleSheet.create({
  map: {
    flex: 1,
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
