import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors, typography} from '../../themes';
import AxiosBase from '../../services/AxioBase';
import {useNavigation} from '@react-navigation/native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';

const OverlayDetails = props => {
  const navigation = useNavigation();
  const item = props.item;

  const [expand, setExpand] = useState(false);
  const [agentData, setAgentData] = useState([]);

  useEffect(() => {
    AxiosBase.get('app/agents/singleAgent', {
      params: {
        id: item.agentId,
      },
    })
      .then(response => {
        setAgentData(response.data.data);
      })
      .catch(error => {
        console.log('error for api', error);
      });
  }, []);

  const handleAgent = e => {
    let phoneNo = `${e.countryCode}${e.phoneNumber}`;

    if (Platform.OS === 'android') {
      phoneNo = `tel:${phoneNo}`;
    } else {
      phoneNo = `telprompt:${phoneNo}`;
    }

    Linking.openURL(phoneNo);
  };

  const handleMap = (lat, long) => {
    console.log(lat, long);
    const location = `${lat},${long}`;
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`,
    });

    Linking.openURL(url);
  };

  const handleMessageAgent = e => {
    // console.log('e', e);
    // let phoneNo = `${e.countryCode}${e.phoneNumber}`;
    const operator = Platform.select({ios: '&', android: '?'});
    Linking.openURL(`sms:${e.phoneNumber}${operator}body=hi`);
  };

  const long = item?.address?.loc?.coordinates[0];
  const lat = item?.address?.loc?.coordinates[1];

  return (
    <View>
      {expand === false ? (
        <View style={{flexGrow: 1, paddingHorizontal: 24}}>
          <View style={{marginTop: 12}}>
            <Text style={styles.title}>PROPERTY DETAILS</Text>
            <Text style={styles.price}>£{item?.price.toLocaleString()}</Text>
            <Text style={[styles.buldingDetails, {paddingTop: 4}]}>
              {item?.beds} beds | {item?.bath} bath | {item?.sqft} sqft
            </Text>
            <Text style={styles.buldingDetails}>
              {item?.address?.road}, {item?.address?.postCode},{' '}
              {item?.address?.city}.
            </Text>
          </View>
          <View style={{marginTop: 24}}>
            <Text style={[styles.buldingDetails, {textAlign: 'left'}]}>
              {item?.description}
            </Text>
          </View>
          <View style={{marginVertical: 14}}>
            <Text style={styles.buldingDetails}>Tenure: {item?.tenure}</Text>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                backgroundColor: 'rgba(55, 55, 55, 0.8)',
                borderRadius: 16,
                position: 'absolute',
                zIndex: 1,
                top: 8,
                right: 8,
              }}
              activeOpacity={0.6}
              onPress={() => {
                setExpand(true);
              }}>
              <Image
                source={require('../../assets/icons/expand.png')}
                style={{height: 10, width: 10, margin: 8}}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <MapView
                style={{height: 190, width: '100%', borderRadius: 16}}
                provider={
                  Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                }
                initialRegion={{
                  latitude: lat,
                  longitude: long,
                  latitudeDelta: 0.0421,
                  longitudeDelta: 0.0421,
                }}>
                <Marker
                  coordinate={{
                    latitude: lat,
                    longitude: long,
                  }}
                />
              </MapView>
            </View>
            {/* <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={() => handleMap(lat, long)}
                activeOpacity={0.8}>
                <Image
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:black%6Clabel:G%7C${lat},${long}&key=AIzaSyBP8VeiGKaJ9BT1iP5LC329tbNcOIuaDTA`,
                  }}
                  resizeMode="cover"
                  style={{height: 190, width: '100%', borderRadius: 16}}
                />
              </TouchableOpacity>
            </View> */}
          </View>
          <TouchableOpacity
            style={{
              marginTop: 40,
              backgroundColor: colors.darkSky,
              borderRadius: 12,
            }}
            activeOpacity={0.7}
            onPress={() => handleMessageAgent(agentData)}>
            <Text
              style={[
                styles.price,
                {
                  paddingVertical: 12,
                  alignSelf: 'center',
                  fontSize: 17,
                  marginBottom: 0,
                },
              ]}>
              message agent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: 12,
              marginBottom: 24,
              backgroundColor: colors.darkSky,
              borderRadius: 12,
            }}
            activeOpacity={0.7}
            onPress={() => handleAgent(agentData)}>
            <Text
              style={[
                styles.price,
                {
                  paddingVertical: 12,
                  alignSelf: 'center',
                  fontSize: 17,
                  marginBottom: 0,
                },
              ]}>
              call agent
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flexGrow: 1, paddingHorizontal: 24}}>
          <View style={{flex: 1, marginVertical: 30}}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                backgroundColor: 'rgba(55, 55, 55, 0.8)',
                borderRadius: 16,
                position: 'absolute',
                zIndex: 1,
                top: 8,
                right: 8,
              }}
              activeOpacity={0.6}
              onPress={() => {
                setExpand(false);
              }}>
              <Image
                source={require('../../assets/icons/minimized.png')}
                style={{height: 10, width: 10, margin: 8}}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <MapView
                style={{height: 550, width: '100%', borderRadius: 16}}
                provider={
                  Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                }
                initialRegion={{
                  latitude: lat,
                  longitude: long,
                  latitudeDelta: 0.0321,
                  longitudeDelta: 0.0321,
                }}>
                <Marker
                  coordinate={{
                    latitude: lat,
                    longitude: long,
                  }}
                />
              </MapView>
            </View>
            {/* <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={() => handleMap(lat, long)}
                activeOpacity={0.8}>
                <Image
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:black%6Clabel:G%7C${lat},${long}&key=AIzaSyBP8VeiGKaJ9BT1iP5LC329tbNcOIuaDTA`,
                  }}
                  resizeMode="cover"
                  style={{height: 420, width: '100%', borderRadius: 16}}
                />
              </TouchableOpacity>
            </View> */}
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                bottom: 12,
                alignSelf: 'center',
                backgroundColor: colors.backgroundShadow,
                borderRadius: 12,
              }}>
              <Text
                style={[
                  styles.buldingDetails,
                  {
                    padding: 14,
                    color: colors.white,
                    flexShrink: 1,
                    flexWrap: 'wrap',
                  },
                ]}>
                {' '}
                {item?.address?.street}, {item?.address?.city},{' '}
                {item?.address?.state}, {item?.address?.country}.
              </Text>
            </View>
          </View>
          {/* <TouchableOpacity
            style={{
              marginVertical: 40,
              backgroundColor: colors.darkSky,
              borderRadius: 12,
            }}
            activeOpacity={0.7}
            onPress={() => handleAgent(agentData)}>
            <Text
              style={[
                styles.price,
                {
                  paddingVertical: 12,
                  alignSelf: 'center',
                  fontSize: 17,
                  marginBottom: 0,
                },
              ]}>
              contact agent
            </Text>
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
};

export default OverlayDetails;

const styles = StyleSheet.create({
  modalRoot: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    flex: 1,
  },
  rate: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: typography.ExtraBold,
  },
  buldingDetails: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: typography.Bold,
  },
  mapView: {
    height: 190,
    width: '100%',
  },
  title: {
    fontSize: 24,
    color: colors.white,
    fontFamily: typography.Bold,
    marginBottom: 16,
    fontWeight: '700',
  },
  price: {
    fontSize: 24,
    color: colors.white,
    fontFamily: typography.Bold,
    marginBottom: 16,
    fontWeight: '700',
  },
  expandMap: {
    height: 570,
    width: '100%',
  },
  icon: {height: 28, width: 28},
  likes: {
    alignSelf: 'center',
    color: colors.white,
    marginTop: 2,
  },
});
