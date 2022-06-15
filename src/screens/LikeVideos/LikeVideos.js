import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {colors, typography} from '../../themes';
import AxiosBase from '../../services/AxioBase';
import {Loader} from '../../components/Loader';
import Video from 'react-native-video';
import {displayToast} from '../../utils';
import NetInfo from '@react-native-community/netinfo';

const LikeVideos = props => {
  const navigation = props.navigation;

  const [likeVideoData, setLikeVideoData] = useState([]);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    NetInfo.fetch().then(isConnected => {
      if (isConnected.isConnected === true) {
        AxiosBase.get('app/user/likedListings')
          .then(response => {
            setLoading(true);
            console.log('feeds response like', response?.data?.data);
            setLikeVideoData(response?.data?.data);
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

  function Item({item, index}) {
    const [opacity, setOpacity] = useState(0);

    const onError = error => {
      console.log('error', error);
      // displayToast('The request timed out.')
    };

    const onLoadStart = () => {
      setOpacity(1);
    };

    const onLoad = () => {
      setOpacity(0);
    };

    const onBuffer = ({isBuffering}) => {
      if (isBuffering) {
        setOpacity(1);
      } else {
        setOpacity(0);
      }
    };

    const handleDisLike = (item, index) => {
      console.log('item', item);
      AxiosBase.put(`app/user/likedVideos?propertyId=${item._id}&flag=${false}`)
        .then(response => {
          // console.log('remove from like screen', response?.data?.data);
          let data = likeVideoData.filter((item, idx) => idx !== index);
          setLikeVideoData(data);
        })
        .catch(error => {
          console.log('error', error.response.data);
        });
    };

    return (
      <View style={{}} key={index}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            position: 'absolute',
            zIndex: 1,
            bottom: 2,
            flex: 1,
            right: 8,
          }}
          onPress={() => handleDisLike(item, index)}>
          <Image
            source={require('../../assets/icons/redicon.png')}
            resizeMode="contain"
            style={styles.icon}
          />
        </TouchableOpacity>
        <View style={{marginHorizontal: 8}}>
          <Video
            videoRef={videoRef}
            onBuffer={onBuffer}
            onError={onError}
            paused={true}
            resizeMode="cover"
            source={{
              uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item?.videoUrl}`,
            }}
            poster={`https://andspace.s3.ap-south-1.amazonaws.com/${item.image}`}
            posterResizeMode="cover"
            muted={true}
            style={{
              width: 125,
              height: 180,
            }}
            onLoad={onLoad}
            onLoadStart={onLoadStart}
          />
          {/* <ActivityIndicator
            animating
            size="large"
            color={colors.darkSky}
            style={[styles.activityIndicator, {opacity: opacity}]}
          /> */}
        </View>
      </View>
    );
  }

  const renderItem = ({item, index}) => {
    return <Item item={item} index={index} />;
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <View style={{marginTop: 47, flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={0.8}
          style={{alignSelf: 'flex-end', marginEnd: 24, marginBottom: 14}}>
          <Image
            source={require('../../assets/icons/close.png')}
            resizeMode="contain"
            style={{height: 24, width: 24}}
          />
        </TouchableOpacity>
        <View style={styles.divider} />
        <Text style={styles.title}>Liked Videos</Text>
        <View>
          <FlatList
            data={likeVideoData}
            renderItem={(item, index) => renderItem(item, index)}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            numColumns={3}
            columnWrapperStyle={{
              flex: 1,
              // justifyContent: 'space-between',
              marginBottom: 14,
              flexWrap: 'wrap',
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default LikeVideos;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.backgroundShadow,
    opacity: 0.95,
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
    marginBottom: 14,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  icon: {width: 24, length: 24},
});
