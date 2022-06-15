import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {colors, typography} from '../../themes';
import AxiosBase from '../../services/AxioBase';
import OverlayDetails from '../../components/Modals/OverlayDetails';
import Video from 'react-native-video';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import Close from '../../components/Close';
import {displayToast, loadString} from '../../utils';
import {useIsFocused} from '@react-navigation/native';

const SingleReel = props => {
  const navigation = props.navigation;
  const {item, index} = props.route.params;
  // console.log('navigation', item);

  const windowWidth = Dimensions.get('screen').width;
  const windowHeight = Dimensions.get('screen').height;

  const videoRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const isFocused = useIsFocused();

  // variables
  const snapPoints = useMemo(() => ['24%', '88%'], []);

  const [mute, setMute] = useState(false);
  const [visible, setVisible] = useState(false);
  const [agentImage, setAgentImage] = useState('');
  const [agentData, setAgentData] = useState();
  const [like, setLike] = useState(false);
  const [itemId, setItemId] = useState('');
  const [likeData, setLikeData] = useState([]);
  const [token, setToken] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [expandVisible, setExpandVisible] = useState(true);
  const [likeOpacity, setLikeOpacity] = useState(0);

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

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  return (
    <BottomSheetModalProvider>
      <View
        style={{
          width: windowWidth,
          height: windowHeight,
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
        }}>
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            top: 34,
            left: 24,
          }}>
          <TouchableOpacity
            style={{backgroundColor: 'white', borderRadius: 10}}
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={require('../../assets/icons/back.png')}
              resizeMode="contain"
              style={{height: 24, width: 24, margin: 12}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingEnd: 12,
            position: 'absolute',
            zIndex: 1,
            bottom: 212,
            right: 2,
            // backgroundColor: 'pink'
          }}>
          <View style={{marginBottom: 34}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Admin', {
                  Details: agentData,
                });
              }}
              activeOpacity={0.7}>
              <Image
                source={{
                  uri: `https://andspace.s3.ap-south-1.amazonaws.com/${agentImage}`,
                }}
                resizeMode="cover"
                style={[styles.icon, {borderRadius: 50}]}
              />
            </TouchableOpacity>
          </View>
          <View style={{}}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleLike()}>
              <Image
                source={
                  item.likeCount.length === 0
                    ? require('../../assets/icons/like.png')
                    : require('../../assets/icons/redicon.png')
                }
                resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 24, paddingBottom: 16}}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleShareVideo()}>
              <Image
                source={require('../../assets/icons/share.png')}
                resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.overcontainer]}>
          <View style={styles.rootContainer}>
            <View style={styles.row}>
              <View style={styles.details}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.rate}>
                    £{item?.price.toLocaleString()}
                  </Text>
                  <TouchableOpacity onPress={handlePresentModalPress}>
                    <Image
                      source={require('../../assets/icons/more.png')}
                      resizeMode="contain"
                      style={[styles.icon, {}]}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.buldingDetails, {paddingTop: 4}]}>
                  {item?.beds} beds | {item?.bath} bath | {item?.sqft} sqft
                </Text>
                <Text style={styles.buldingDetails}>
                  {item?.address?.road}, {item?.address?.postCode},{' '}
                  {item?.address?.city}.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={handlePresentModalPress}>
                  <Text style={styles.buldingDetails}>
                    Click for more details...
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <TouchableOpacity onPress={handlePresentModalPress}>
                <Image
                  source={require('../../assets/icons/more.png')}
                  resizeMode="contain"
                  style={styles.icon}
                />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
        {item.isVideoPresent === false ? (
          <Image
            source={{
              uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item.image[0]}`,
            }}
            resizeMode="cover"
            style={{height: '100%', width: '100%'}}
          />
        ) : (
          <Video
            videoRef={videoRef}
            onBuffer={onBuffer}
            onError={onError}
            repeat={false}
            resizeMode="cover"
            source={{
              uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item?.videoUrl}`,
            }}
            // poster={`https://andspace.s3.ap-south-1.amazonaws.com/${item.image}`}
            // posterResizeMode="cover"
            muted={mute}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
            onLoad={onLoad}
            onLoadStart={onLoadStart}
          />
        )}
        <ActivityIndicator
          animating
          size="large"
          color={colors.darkSky}
          style={[styles.activityIndicator, {opacity: opacity}]}
        />
      </View>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => {
          setVisible(false);
        }}
        onChange={e => {
          if (e === 1) {
            setExpandVisible(false);
          } else {
            setExpandVisible(true);
          }
        }}
        backgroundStyle={{
          backgroundColor: colors.backgroundShadow,
          opacity: 0.95,
        }}
        handleComponent={props => (
          <Close
            {...props}
            handleDismissModalPress={handleDismissModalPress}
            expandVisible={expandVisible}
          />
        )}>
        <BottomSheetScrollView>
          <OverlayDetails item={item} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default SingleReel;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  overcontainer: {
    position: 'absolute',
    zIndex: 999,
    bottom: 0,
    flex: 1,
    height: 210,
    width: '100%',
    backgroundColor: 'rgba(48, 48, 48, 0.11)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  rootContainer: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 12,
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
  icon: {height: 32, width: 32},
  likes: {
    alignSelf: 'center',
    color: colors.white,
  },
  activityIndicator: {
    position: 'absolute',
    alignItems: 'center',
  },
});
