import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {colors, typography} from '../../themes';
import {SafeAreaView} from 'react-native-safe-area-context';
import Video from 'react-native-video';

const Agent = props => {
  const navigation = props.navigation;
  const {Details} = props.route.params;

  const videoRef = useRef(null);

  const handleAgent = e => {
    let phoneNo = `${e.countryCode}${e.phoneNumber}`;

    if (Platform.OS === 'android') {
      phoneNo = `tel:${phoneNo}`;
    } else {
      phoneNo = `telprompt:${phoneNo}`;
    }

    Linking.openURL(phoneNo);
  };

  function Item({item, index}) {
    console.log('flat', item);

    const [opacity, setOpacity] = useState(0);

    const onError = ({error}) => {
      console.log('error', error);
    };

    const onLoadStart = () => {
      setOpacity(1);
    };

    const onLoad = () => {
      // setOpacity(0);
    };

    const onBuffer = ({isBuffering}) => {
      if (isBuffering) {
        setOpacity(1);
      } else {
        setOpacity(0);
      }
    };

    return (
      <View style={{}} key={index}>
        <TouchableOpacity
          style={{marginEnd: 6}}
          key={index}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('SingleReel', {
              item: item,
              index: index,
              // navigation: navigation,
            });
          }}>
          <Image
            source={{
              uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item.image[0]}`,
            }}
            resizeMode="cover"
            style={{height: 180, width: 125}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({item, index}) => {
    return <Item item={item} index={index} />;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{backgroundColor: colors.backgroundShadow, opacity: 0.95}}>
      <View style={{flex: 1}} />
      <View>
        <View style={{alignSelf: 'center', marginTop: 24}}>
          <Image
            source={{
              uri: `https://andspace.s3.ap-south-1.amazonaws.com/${Details.imageUrl}`,
            }}
            resizeMode="cover"
            style={{height: 100, width: 100, borderRadius: 100}}
          />
        </View>
        <Text style={styles.agent}>{Details.name}</Text>
        <View style={{marginHorizontal: 68, marginVertical: 24}}>
          <TouchableOpacity
            style={styles.btnView}
            activeOpacity={0.8}
            onPress={() => handleAgent(Details)}>
            <Text style={styles.btn}>Contact</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.title}>Our Videos</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          marginVertical: 14,
        }}>
        <FlatList
          data={Details.videoUrls}
          renderItem={(item, index) => renderItem(item, index)}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          numColumns={3}
          columnWrapperStyle={{
            flex: 1,
            marginBottom: 6,
            // justifyContent: 'space-between',
            // backgroundColor: 'pink'
          }}
        />
      </View>
    </ScrollView>
  );
};

export default Agent;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // paddingHorizontal: 24,
    paddingVertical: 24,
  },
  agent: {
    fontFamily: typography.secondary,
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    marginTop: 14,
    textAlign: 'center',
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
  divider: {
    height: 1,
    backgroundColor: colors.text,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontFamily: typography.secondary,
    fontWeight: '400',
    color: colors.white,
    paddingStart: 24,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.text,
    marginBottom: 20,
  },
});
