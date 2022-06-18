import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
  Share,
  ActivityIndicator,
  Platform,
  ImageBackground,
} from 'react-native';
import React, {useRef, useState, useEffect, useMemo, useCallback} from 'react';
import {colors, typography} from '../themes';
import OverlayDetails from './Modals/OverlayDetails';
import {displayToast, load, loadString} from '../utils';
import AxiosBase from '../services/AxioBase';
import Video from 'react-native-video';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import Close from './Close';
import NetInfo from '@react-native-community/netinfo';
import {useIsFocused} from '@react-navigation/native';

const Reels = ({item, index, currentIndex, navigation, setHook, hook}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const videoRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const isFocused = useIsFocused();

  // variables
  const snapPoints = useMemo(() => ['30%', '90%'], []);

  // const [mute, setMute] = useState(false);
  const [visible, setVisible] = useState(false);
  const [agentImage, setAgentImage] = useState('');
  const [agentData, setAgentData] = useState();
  const [like, setLike] = useState(false);
  // const [itemId, setItemId] = useState('');
  const [likeData, setLikeData] = useState([]);
  const [opacity, setOpacity] = useState(0);
  // const [token, setToken] = useState(false);
  const [expandVisible, setExpandVisible] = useState(true);
  // const [likeOpacity, setLikeOpacity] = useState(0);

  useEffect(() => {
    if (currentIndex !== index) {
      bottomSheetRef.current?.dismiss();
    }
  }, [currentIndex]);

  useEffect(() => {
    NetInfo.fetch().then(isConnected => {
      if (isConnected.isConnected === true) {
        AxiosBase.get('app/agents/singleAgent', {
          params: {
            id: item.agentId,
          },
        })
          .then(response => {
            // console.log("response for agent", response.data.data);
            setAgentData(response.data.data);
            setAgentImage(response?.data?.data?.imageUrl);
          })
          .catch(error => {
            console.log('error for api', error);
          });
      } else {
        displayToast('Internet Connection Problem');
      }
    });
  }, []);

  useEffect(() => {
    // console.log('ref', videoRef);
    if (!!videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [currentIndex]);

  const onError = ({error}) => {
    // console.log('error of video', error);
    displayToast(error.localizedDescription);
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

  const handleShareVideo = async () => {
    const options = {
      message:
        'Hey, checkout this new property \n`https://andspace.s3.ap-south-1.amazonaws.com/${item?.videoUrl}` ',
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
                setHook(!hook);
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
                setHook(!hook);
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

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  return (
    <>
      <View
        style={{
          width: windowWidth,
          height:
            Platform.OS === 'android' ? windowHeight * 1 - 38 : windowHeight,
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
        }}>
        <View
          style={{
            paddingEnd: 12,
            position: 'absolute',
            zIndex: 1,
            bottom: 212,
            right: 3,
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
          </View>
          <View style={{}}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleLike()}>
              <Image
                source={
                  like === false
                    ? require('../assets/icons/like.png')
                    : require('../assets/icons/redicon.png')
                }
                resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
            {item.likeCount.length === 0 ? (
              <Text style={[styles.likes, {opacity: 0}]}>
                {item.likeCount.length}
              </Text>
            ) : (
              <Text style={[styles.likes, {opacity: 1}]}>
                {item.likeCount.length}
              </Text>
            )}
          </View>
          <View style={{marginTop: 24, paddingBottom: 16}}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleShareVideo()}>
              <Image
                source={require('../assets/icons/share.png')}
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
                      source={require('../assets/icons/more.png')}
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
                  source={require('../assets/icons/more.png')}
                  resizeMode="contain"
                  style={styles.icon}
                />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
        <Video
          ref={videoRef}
          onBuffer={onBuffer}
          onVideoLoad={() => {
            console.log('load');
          }}
          onError={onError}
          repeat
          resizeMode="cover"
          paused={currentIndex === index ? false : true}
          source={{
            uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item?.videoUrl}`,
          }}
          // poster={`https://andspace.s3.ap-south-1.amazonaws.com/${item.image}`}
          // posterResizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
        />
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
        enableDismissOnClose
        onClose={() => {
          setVisible(false);
        }}
        backgroundStyle={{
          backgroundColor: colors.backgroundShadow,
          opacity: 0.95,
        }}
        onChange={e => {
          // console.log('index', e);
          if (e === 1) {
            setExpandVisible(false);
          } else {
            setExpandVisible(true);
          }
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
    </>
  );
};

export default Reels;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  overcontainer: {
    position: 'absolute',
    zIndex: 1,
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
    paddingTop: 2,
    // backgroundColor: 'pink'
  },
  activityIndicator: {
    position: 'absolute',
    alignItems: 'center',
  },
  red: {
    height: 42,
    width: 42,
    // backgroundColor:'pink'
  },
});
