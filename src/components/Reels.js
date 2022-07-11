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
  Modal
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
import More from '../screens/Feeds/more';
import ReelInfo from '../screens/Feeds/reelInfo';

import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import { createSharedElementStackNavigator,SharedElement } from 'react-navigation-shared-element';
import VisibilitySensor from '@svanboxel/visibility-sensor-react-native'

const Reels = ({item, index,currentIndex,data,setData,navigation, setHook, hook,currentVisibleIndex}) => {
  const windowWidth = Dimensions.get('screen').width;
  const windowHeight = Dimensions.get('screen').height;

  const videoRef = useRef(null);
  // const bottomSheetRef = useRef(null);
  // const isFocused = useIsFocused();
  const [pause, setPause] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  let pauseOnModal=true;
  const [disable, setDisable] = useState(false)


  // variables
  const snapPoints = useMemo(() => ['100%', '100%'], []);

  // const [mute, setMute] = useState(false);
  const [visible, setVisible] = useState(true);
  const [agentImage, setAgentImage] = useState('');
  const [agentData, setAgentData] = useState();
  const [like, setLike] = useState(false);
  // const [itemId, setItemId] = useState('');
  const [likeData, setLikeData] = useState([]);
  const [opacity, setOpacity] = useState(0);
  // const [token, setToken] = useState(false);
  const [expandVisible, setExpandVisible] = useState(true);
  const [isScreenFocused, setIsScreenFocused] = useState(false)
  // const [likeOpacity, setLikeOpacity] = useState(0);

  // useEffect(() => {
  //   if (currentIndex !== index) {
  //     bottomSheetRef.current?.dismiss();
  //   }
  // }, [currentIndex]);

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
      const blur = navigation.addListener('blur', () => {
        // setIsScreenFocused(false)
      setPause(true)
      setDisable(true)
      
    });

    const focus = navigation.addListener('focus', () => {
      
      setPause(false)
      if (!!videoRef.current) {
        videoRef.current.seek(0);
      }
      setDisable(false)
      // setIsScreenFocused(false)
      // videoRef.current.seek(0);
    });


  return blur, focus;
  }, [navigation]);

  // useEffect(() => {
  //   // console.log('ref', videoRef);
  //   if (!!videoRef.current) {
  //     videoRef.current.seek(0);
  //   }
  // }, [currentIndex]);

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

  const message = `Hey, checkout this new property I found on the SpaceHub App \n https://andspace.s3.ap-south-1.amazonaws.com/${item?.videoUrl}`

  const handleShareVideo = async () => {
    const options = {
      message:
      message,
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
          let temp = [...data]
          if (item.isLiked === false) {
            // setLike(true);
            temp[index].isLiked = true
                setData(temp)
            AxiosBase.put(
              `app/user/likedVideos?propertyId=${item._id}&flag=${true}`,
            )
              .then(response => {
                console.log('response of like', response.data.data);
                // setLikeData(response.data.data.likedVideos);
                setHook(!hook);
                // let temp = [...data]
                
              })
              .catch(error => {
                console.log('error', error.response.data);
              });
          } else {
            // setLike(false);
            temp[index].isLiked = false
                setData(temp)
            AxiosBase.put(
              `app/user/likedVideos?propertyId=${item._id}&flag=${false}`,
            )
              .then(response => {
                // setLikeData(response.data.data.likedVideos);
                setHook(!hook);
                // let temp = [...data]
                
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

  const moreHandler=()=>{
    // if (!!videoRef.current) {
    //   videoRef.current.seek(0);
    // }
    // setPause(true)
    pauseOnModal=false
    navigation.navigate('More',{
      item:item,
      index:index,
      agentImage:agentImage,
      agentData:agentData,
      like:like,
      handleLike:handleLike,
      handleShareVideo:handleShareVideo,
      // handleDismissParentModalPress:handleDismissModalPress,
      expandVisible:expandVisible,
      parentVisible:visible,
      setPause:setPause,
      pause:pause,
      setDisable:setDisable,
      data:data,
      setData:setData
    })
    // navigation.navigate('TransionalReelView',{reel:item})
  }

  // const handlePresentModalPress = useCallback(() => {
  //   setPause(true)
  //   // pauseOnModal = true
  //   bottomSheetRef.current?.present();
  //   if (!!videoRef.current) {
  //       videoRef.current.seek(0);
  //     }
  // }, []);

  // const handleDismissModalPress = useCallback(() => {
  //   pauseOnModal = false
  //   bottomSheetRef.current?.dismiss();
  //   setPause(false)
  // }, []);


  const checkVisible = (isVisible) => {
    if(isVisible){
      console.log('isVisible 1',isVisible);
      setPause(false)
    }else{
      console.log('isVisible 2',isVisible);
      setPause(true)
    }
  }

  // console.log('pause at reel',pause);

    useEffect(() => {
      // setIsScreenFocused(true)
      setLike(item.isLiked)
    }, [])
    

  return (
    <InViewPort 
      onChange={(isVisible) => {
        // if(!pause){
          console.log(isVisible);
          checkVisible(isVisible)
        // }
      }}
      // disabled={disable}
      >
      <View
        style={{
          width: windowWidth,
          // height: Platform.OS === 'android' ? windowHeight * 1 - 38 : windowHeight,
          height:windowHeight,
          // flex:1,
          // position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
        }}>
        <View
          style={{
            // paddingEnd: 12,
            position: 'absolute',
            zIndex: 1,
            bottom: 212,
            right: 16,
          }}>
          <View style={{marginBottom: 40,}}>
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
          <View style={{marginBottom:40,}}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleLike()}>
              <Image
                source={
                  item.isLiked === false
                    ? require('../assets/icons/like.png')
                    : require('../assets/icons/redicon.png')
                }
                // resizeMode="contain"
                style={styles.icon}
              />
            </TouchableOpacity>
            {/* {item.likeCount.length === 0 ? (
              <Text style={[styles.likes, {opacity: 0}]}>
                {item.likeCount.length}
              </Text>
            ) : (
              <Text style={[styles.likes, {opacity: 1}]}>
                {item.likeCount.length}
              </Text>
            )} */}
          </View>
          <View style={{paddingBottom:28,}}>
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
              <Pressable 
                style={styles.details} 
                onPress={()=>{
                  pauseOnModal=false
                  setDisable(true)
                  moreHandler(),
                  setPause(true)
                }}
                >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.rate}>
                    £{item?.price.toLocaleString()}
                  </Text>
                  <Pressable 
                    // onPress={handlePresentModalPress}
                    onPress={moreHandler}
                    // onPress={()=>setIsModalVisible(true)}
                    >
                      {/* <SharedElement id={item._id}> */}
                        <Image
                          source={require('../assets/icons/more.png')}
                          resizeMode="contain"
                          style={[styles.icon, {}]}
                        />
                      {/* </SharedElement> */}
                  </Pressable>
                </View>
                <Text style={[styles.buldingDetails, {paddingTop: 4}]}>
                {(item?.beds && item.beds!==0) ? `${item?.beds} beds |` : null} {(item?.bath && item?.bath!==0) ? `${item?.bath} bath |` : null} {(item?.sqft && item.sqft!==0) ? `${item?.sqft} sqft` : null} 
                </Text>
                <Text style={styles.buldingDetails}>
                  {item?.address?.road}, {item?.address?.postCode},{' '}
                  {item?.address?.city}.
                </Text>
                <View
                  activeOpacity={0.6}
                  // onPress={handlePresentModalPress}
                  >
                  <Text style={styles.buldingDetails}>
                    Click for more details...
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
        <SharedElement id={item._id} style={{flex:1,width:'100%'}}>
          <Video
            ref={videoRef}
            onBuffer={onBuffer}
            playInBackground={false}
            onVideoLoad={() => {
              console.log('load');
            }}
            onError={onError}
            repeat
            volume={10}
            // ignoreSilentSwitch="ignore"
            resizeMode="cover"
            // paused={currentIndex === index ? false : true}
            // paused={currentIndex !== currentVisibleIndex ? false:true}
            paused={pause}
            // source={{
            //   uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item?.videoUrl}`,
            // }}
            source={require('../assets/Illustrations/space_testing.mp4')}
            // poster={`https://andspace.s3.ap-south-1.amazonaws.com/${item.image}`}
            // posterResizeMode="cover"
            style={{
              width: windowWidth,
              height: windowHeight,
              position: 'absolute',
            }}
            onLoad={onLoad}
            onLoadStart={onLoadStart}
            muted={false}
          />
        </SharedElement>
        {/* <ActivityIndicator
          animating
          size="large"
          color={colors.darkSky}
          style={[styles.activityIndicator, {opacity: opacity}]}
        /> */}
      </View>
      {/* <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        enableDismissOnClose={true}
        onClose={() => {
          setVisible(false);
        }}
        backgroundStyle={{
          backgroundColor:'#000',
          opacity: 1,
          borderRadius:0,
        }}
        onChange={e => {
          console.log('index', e);
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
        )}
        >
        <BottomSheetScrollView>
          <OverlayDetails item={item} />
          <More
            item={item}
            agentImage={agentImage}
            agentData={agentData}
            like={like}
            handleLike={handleLike}
            handleShareVideo={handleShareVideo}
            handleDismissParentModalPress={handleDismissModalPress}
            navigation={navigation}
            expandVisible={expandVisible}
            parentVisible={visible}
            setPause={setPause}
            pause={pause}
          />
          <ReelInfo
            item={item}
            agentImage={agentImage}
            agentData={agentData}
            like={like}
            handleLike={handleLike}
            handleShareVideo={handleShareVideo}
            handleDismissParentModalPress={handleDismissModalPress}
            navigation={navigation}
          />
        </BottomSheetScrollView>
      </BottomSheetModal> */}
      {/* <Modal
          animationType='fade'
          transparent={true}
          visible={isModalVisible}
          avoidKeyboard={true}
          autoFocus={true}
          onRequestClose={() => setIsModalVisible(false)}
          // style={{flex:1}}
      >
        <View
            style={styles.modalView}
        // onPress={onPress}
        >
          <ReelInfo
            item={item}
            agentImage={agentImage}
            agentData={agentData}
            like={like}
            handleLike={handleLike}
            handleShareVideo={handleShareVideo}
            handleDismissParentModalPress={handleDismissModalPress}
            navigation={navigation}
            setIsModalVisible={setIsModalVisible}
          />
        </View>
        
      </Modal> */}
      
    </InViewPort>
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
    paddingTop: 10,
    paddingHorizontal: 16,
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
  modalView: {
    flex: 1,
    backgroundColor:colors.white
},
});
