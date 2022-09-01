import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, {useRef, useMemo, useCallback, useState, useEffect} from 'react';
import PagerView from 'react-native-pager-view';
import {colors, typography} from '../../themes';

import {Platform} from 'react-native';
import {displayToast} from '../../utils';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import {useIsFocused} from '@react-navigation/native';

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {createThumbnail} from 'react-native-create-thumbnail';
import AxiosBase from '../../services/AxioBase';

const window = Dimensions.get('screen');
const windowHeight = Dimensions.get('screen').height;

export default function SingleReelInfo({route, navigation}) {
  const {item} = route.params;

  const videoRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [like, setLike] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [thumbnail, setThumbnail] = useState('');
  const [agentImage, setAgentImage] = useState('');
  const [agentData, setAgentData] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    AxiosBase.get('app/agents/singleAgent', {
      params: {
        id: item.agentId,
      },
    })
      .then(response => {
        setAgentData(response.data.data);
        setAgentImage(response?.data?.data?.imageUrl);
      })
      .catch(error => {
        console.log('error for api', error);
      });
  }, []);

  // useEffect(() => {
  //   loadString('token')
  //     .then(response => {
  //       console.log('token', response);
  //       if (response === null) {
  //         console.log('null');
  //         setLike(false);
  //       } else {
  //         setToken(true);
  //       }
  //     })
  //     .catch(error => {
  //       console.log('error', error);
  //     });
  // }, []);

  const onError = error => {
    console.log('error', error);
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

  const handleLike = () => {
    loadString('token')
      .then(response => {
        if (response === null) {
          displayToast('Please Login First.');
        } else {
          if (like === false) {
            setLike(true);
            AxiosBase.put(
              `app/user/likedVideos?propertyId=${item._id}&flag=${true}`,
            )
              .then(response => {
                console.log('response of like', response.data.data);
                setLikeData(response.data.data.likedVideos);
                // setHook(!hook);
              })
              .catch(error => {
                console.log('error', error.response.data);
              });
          } else {
            setLike(false);
            AxiosBase.put(
              `app/user/likedVideos?propertyId=${item._id}&flag=${false}`,
            )
              .then(response => {
                setLikeData(response.data.data.likedVideos);
                // setHook(!hook);
              })
              .catch(error => {
                console.log('error', error.response.data);
              });
          }
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const handleShareVideo = async () => {
    const options = {
      message: `Hey, checkout this new property \n${item?.videoUrl}`,
    };
    try {
      const result = await Share.share(options);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('share type');
        } else {
          console.log('shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const goBackHandler = () => {
    navigation.goBack();
    // handleDismissParentModalPress()
  };

  const handleLikeHandler = () => {
    // setLiked(!liked)
    handleLike();
  };

  useEffect(() => {
    // handlePresentModalPress()
    setMediaFiles(item.image);
    if (item.isVideoPresent) {
      setMediaFiles(prev => [item.videoUrl, ...prev]);
    }
  }, []);

  const [expand, setExpand] = useState(false);

  const handleAgent = e => {
    let phoneNo = `${e.countryCode}${e.phoneNumber}`;

    if (Platform.OS === 'android') {
      phoneNo = `tel:${phoneNo}`;
    } else {
      phoneNo = `telprompt:${phoneNo}`;
    }

    Linking.openURL(phoneNo);
  };

  const handleMessageAgent = e => {
    // console.log('e', e);
    // let phoneNo = `${e.countryCode}${e.phoneNumber}`;
    const operator = Platform.select({ios: '&', android: '?'});
    Linking.openURL(`sms:${e.phoneNumber}${operator}body=hi`);
  };

  const long = item?.address?.loc?.coordinates[0];
  const lat = item?.address?.loc?.coordinates[1];

  console.log('mediaFiles', mediaFiles);

  // useEffect(() => {
  //   setPaused(false)
  // }, [isFocused])

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <ParallaxScrollView
        // backgroundColor="blue"
        contentBackgroundColor="#000"
        parallaxHeaderHeight={window.height / 1.3}
        // renderScrollComponent={() => <Animated.View />}
        // renderScrollComponent={() => <AnimatedCustomScrollView />}
        renderBackground={() => (
          <View>
            <PagerView
              style={styles.pagerView}
              initialPage={0}
              // onPageScroll={(e)=>console.log(e.nativeEvent)}
              onPageSelected={e => {
                if (item.videoUrl && e.nativeEvent.position === 0) {
                  videoRef.current.seek(0);
                }
                setPageNumber(e.nativeEvent.position + 1);
              }}>
              {mediaFiles &&
                mediaFiles.map((element, index) => (
                  <View>
                    {item.isVideoPresent && index === 0 ? (
                      <Video
                        // key={index}
                        ref={videoRef}
                        // onBuffer={onBuffer}
                        onVideoLoad={() => {
                          console.log('load');
                        }}
                        onError={onError}
                        repeat
                        resizeMode="cover"
                        paused={paused}
                        source={{
                          uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item.videoUrl}`,
                        }}
                        // poster={`https://andspace.s3.ap-south-1.amazonaws.com/${item.image}`}
                        // posterResizeMode="cover"
                        style={{
                          // width: windowWidth,
                          // height: windowHeight,
                          flex: 1,
                          // position: 'absolute',
                        }}
                        // onLoad={onLoad}
                        // onLoadStart={onLoadStart}
                        poster={thumbnail}
                        posterResizeMode="cover"
                      />
                    ) : (
                      <FastImage
                        source={{
                          uri: `https://andspace.s3.ap-south-1.amazonaws.com/${element}`,
                        }}
                        style={{flex: 1, height: '100%', width: '100%'}}
                      />
                    )}
                  </View>
                ))}
            </PagerView>
            {mediaFiles.length > 1 && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  backgroundColor: 'black',
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 2,
                }}>
                <Text style={styles.pageNumber}>
                  {pageNumber} / {mediaFiles.length}
                </Text>
              </View>
            )}
          </View>
        )}
        // renderForeground={() => (
        // <View style={{ height: 300, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        //     <Text>Hello World!</Text>
        // </View>
        // )
        // }
      >
        <View style={{backgroundColor: '#000'}}>
          <View style={{marginTop: 20}}>
            {expand === false ? (
              <View style={{flexGrow: 1, paddingHorizontal: 24}}>
                <View
                  style={{
                    ...styles.iconContainer,
                    paddingHorizontal: 0,
                    paddingTop: 0,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Admin', {
                        Details: agentData,
                        setPaused: setPaused,
                      });
                      setPaused(true);
                    }}
                    activeOpacity={0.7}>
                    <Image
                      source={{
                        uri: `https://andspace.s3.ap-south-1.amazonaws.com/${agentImage}`,
                      }}
                      resizeMode="contain"
                      style={[
                        styles.icon,
                        {
                          borderRadius: 50,
                          borderWidth: 1.5,
                          borderColor: colors.white,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleLikeHandler()}>
                    <Image
                      source={
                        like === false
                          ? require('../../assets/icons/like.png')
                          : require('../../assets/icons/redicon.png')
                      }
                      resizeMode="contain"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleShareVideo()}>
                    <Image
                      source={require('../../assets/icons/share.png')}
                      resizeMode="contain"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={goBackHandler}>
                    <Image
                      source={require('../../assets/icons/more.png')}
                      resizeMode="contain"
                      style={[styles.icon, {}]}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{...styles.details}}
                  // onPress={handlePresentModalPress}
                >
                  <View>
                    <Text style={styles.rate}>
                      £{item?.price.toLocaleString()}
                    </Text>
                  </View>
                  <Text style={[styles.buldingDetails, {paddingTop: 4}]}>
                    {item?.beds && item.beds !== 0
                      ? `${item?.beds} beds |`
                      : null}{' '}
                    {item?.bath && item?.bath !== 0
                      ? `${item?.bath} bath |`
                      : null}{' '}
                    {item?.sqft && item.sqft !== 0
                      ? `${item?.sqft} sqft`
                      : null}
                  </Text>
                  <Text style={styles.buldingDetails}>
                    {item?.address?.road}, {item?.address?.postCode},{' '}
                    {item?.address?.city}.
                  </Text>
                  <View
                    activeOpacity={0.6}
                    style={{paddingTop: 12}}
                    // onPress={handlePresentModalPress}
                  >
                    <Text
                      style={{...styles.buldingDetails, color: colors.darkSky}}>
                      Scroll for more information
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: 24}}>
                  <Text style={[styles.buldingDetails, {textAlign: 'left'}]}>
                    {item?.description}
                  </Text>
                </View>
                <View style={{marginVertical: 14}}>
                  <Text style={styles.buldingDetails}>
                    Tenure: {item?.tenure}
                  </Text>
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
                        Platform.OS === 'android'
                          ? PROVIDER_GOOGLE
                          : PROVIDER_DEFAULT
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
                        Platform.OS === 'android'
                          ? PROVIDER_GOOGLE
                          : PROVIDER_DEFAULT
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
              </View>
            )}
          </View>
        </View>
      </ParallaxScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: 'black',
          padding: 8,
          borderRadius: 50,
          position: 'absolute',
          right: 20,
          top: 20,
        }}
        onPress={goBackHandler}>
        <Image
          source={require('../../assets/icons/close.png')}
          style={{width: 24, height: 24}}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    // flex: 1,
    // height:'70%'
    height: windowHeight / 1.3,
    // width:'100%'
  },
  details: {
    paddingTop: 16,
  },
  rate: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: typography.ExtraBold,
  },
  buldingDetails: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: typography.Bold,
  },
  icon: {
    height: 32,
    width: 32,
    marginEnd: 20,
  },
  pageNumber: {
    color: colors.white,
    fontFamily: typography.Bold,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal:20,
    // paddingTop:24
  },

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
  // details: {
  //     flex: 1,
  // },
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
  // icon: {
  //     height: 28, width: 28
  // },
  likes: {
    alignSelf: 'center',
    color: colors.white,
    marginTop: 2,
  },
});
