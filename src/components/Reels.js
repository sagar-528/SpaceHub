import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
  Share,
  Platform,
  Animated,
  ScrollView,
  Linking,
  AppState,
  // Easing
} from 'react-native';
import React, {useRef, useState, useEffect, useMemo, useCallback,memo} from 'react';
import {colors, typography} from '../themes';
import OverlayDetails from './Modals/OverlayDetails';
import {displayToast, load, loadString} from '../utils';
import AxiosBase from '../services/AxioBase';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image'
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheetTimingConfigs
} from '@gorhom/bottom-sheet';
import Close from './Close';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import { Easing } from 'react-native-reanimated';
import WhiteLikeSvg from '../assets/svgs/whiteLikeSvg';
import RedLikeSvg2 from '../assets/svgs/redLikeSvg2';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('window').height;

const Reels = ({item, index,currentIndex,data,setData,navigation, setHook, hook,swiper,setSwiper,currentVisibleIndex,setLikedId,videoPaused}) => {


  const appState = useRef(AppState.currentState)
  const videoRef = useRef(null);
  // const pageRef = useRef(null)
  const bottomSheetRef = useRef(null);
  // const isFocused = useIsFocused();
  const [pause, setPause] = useState(false)
  const [disable, setDisable] = useState(false)
  const [pagerEnabled, setPagerEnabled] = useState(false)
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(1))
  let sheetDuration = 300
  const [loading, setLoading] = useState(false)
  // let fadeAnim = new Animated.Value(1)


  // variables
  const snapPoints = useMemo(() => ['24%', '90%'], []);
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: sheetDuration,
    easing: Easing.linear,
  });

  const [pageNumber, setPageNumber] = useState(1)
  const [expand, setExpand] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState(new Animated.Value(windowHeight))

  const long = item?.address?.loc?.coordinates[0];
  const lat = item?.address?.loc?.coordinates[1];

  useEffect(() => {
      const blur = navigation.addListener('blur', () => {
        // setIsScreenFocused(false)
      setPause(true)
      setDisable(true)
      
    });

    const focus = navigation.addListener('focus', () => {
      // bottomSheetRef.current?.present();
      setPause(false)
      if (!!videoRef.current) {
        videoRef.current.seek(0);
      }
      setDisable(false)
    });

    console.log('nav focus ');


  return blur, focus;
  }, [navigation]);

  useEffect(() => {
    // console.log('ref', videoRef);
    if (!!videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [currentIndex]);

  const onError = ({error}) => {
    console.log('error of video', index,error);
    // displayToast('error',error.localizedDescription);
  };

  const onLoadStart = () => {
    // setOpacity(1);
    console.log('onLoadStart',index);
  };

  const onLoad = (e) => {
    // setOpacity(0);
    console.log('onLoad',index,e);
    
  };

  const onBuffer = ({isBuffering}) => {
    if (isBuffering) {
      // setOpacity(1);
      console.log('buffering',index,isBuffering);
      setLoading(true)
    } else {
      // setOpacity(0);
      console.log('bufferingno',index,isBuffering);
      setLoading(false)
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
    setLikedId('')
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

    bottomSheetRef.current?.present();
    Animated.timing(animatedHeight, {
      toValue: windowHeight/1.30,
      duration:700,
      easing:Easing.linear,
      isInteraction:false
    }).start();

    
    // fadeInView()
    setSwiper(false)
    setPagerEnabled(true)
    sheetDuration = 700
    // pauseOnModal=false

  }

  const DisablePagerView = () => {
    setTimeout(() => {
      Animated.timing(animatedHeight, {
        toValue: windowHeight,
        duration:600,
        easing:Easing.linear,
        isInteraction:false
      }).start();
  
      // fadeOutView()
      setSwiper(true)
      setPagerEnabled(false)
      
      bottomSheetRef.current?.dismiss();
      sheetDuration = 300
    }, 500);
    // setPause(false)

    
  }


  function handleOnScroll(event){
    const currentScreenIndex = parseInt(event.nativeEvent.contentOffset.x/windowWidth)
    setPageNumber(currentScreenIndex+1)
  }

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
    const operator = Platform.select({ios: '&', android: '?'});
    Linking.openURL(`sms:${e.phoneNumber}${operator}body=hi`);
  };


  

  return (
    <>
    <View
        style={{backgroundColor:'#000',flex:1,}}
        >
          <Animated.View style={{
            backgroundColor:'#000',
            flex:1,
            opacity:fadeAnim,
            height:animatedHeight
            }}>
            <ScrollView 
              horizontal 
              contentContainerStyle={{flexGrow:1,}}
              scrollEnabled={pagerEnabled}
              pagingEnabled
              onScroll={(e)=>handleOnScroll(e)}
              contentInsetAdjustmentBehavior='automatic'
              // scrollEventThrottle={5}
              >  
              {item.videoWithImages && item.videoWithImages.map((element,indx)=>
               <View key={indx}>
                    {(indx===0) ?
                    <>
                    
                      <Video
                          // key={index}
                          ref={videoRef}
                          // onBuffer={onBuffer}
                          muted={videoPaused}
                          onLoad={onLoad}
                          playWhenReady={true}
                          // onLoadStart={onLoadStart}
                          // playWhenInactive={true}
                          // onAudioFocusChanged={(e)=>console.log('onAudioFocusChanged',e)}
                          // onProgress={(e)=>console.log('onProgree',e)}
                          playInBackground={false}
                          // preventsDisplaySleepDuringVideoPlayback={false}
                          automaticallyWaitsToMinimizeStalling={true}
                          onVideoLoad={(e) => {
                          console.log('load',e);
                          }}
                          onError={onError}
                          repeat
                          resizeMode="cover"
                          // paused={pause}
                          paused={((index !== currentVisibleIndex || videoPaused) || pause)}
                          source={{
                          uri: `https://andspace.s3.ap-south-1.amazonaws.com/${element}`,
                          type:'mp4'
                          }}
                          // source={require('../assets/Illustrations/space_testing.mp4')}
                          // poster={`https://andspace.s3.ap-south-1.amazonaws.com/${item.image}`}
                          // posterResizeMode="cover"
                          style={{
                          width: windowWidth,
                          // height: windowHeight/1.30,
                          flex:1
                          // position: 'absolute',
                          }}
                          // onLoad={onLoad}
                          // onLoadStart={onLoadStart}
                          // poster={`https://andspace.s3.ap-south-1.amazonaws.com/${item.thumbnailName}`}
                          // posterResizeMode='cover'
                      />
                      
                      
                    </>
                   
                    :
                    <>
                    {pagerEnabled &&
                      <FastImage 
                          source={{uri:`https://andspace.s3.ap-south-1.amazonaws.com/${element}`}} 
                          style={{height:'100%',width:windowWidth}}
                      />
                    }
                    </>
                    
                    }
                    
                </View>
              
              )}
            
            </ScrollView>
            {/* <Carousel
              ref={pageRef}
              data={item.videoWithImages}
              renderItem={_renderItem}
              sliderWidth={windowWidth}
              itemWidth={windowWidth}
            /> */}
            {item.videoWithImages.length>1 && pagerEnabled &&
                <View style={{
                    position:'absolute',
                    bottom:20,
                    right:10,
                    backgroundColor:'black',
                    borderRadius:12,
                    paddingHorizontal:12,
                    paddingVertical:2
                }}>
                    <Text style={styles.pageNumber}>{pageNumber} / {item.videoWithImages.length}</Text>
                </View>
                }
          </Animated.View>
          {!pagerEnabled &&

            <>
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
                      Details: item.agentId,
                    });
                  }}
                  activeOpacity={0.7}>
                  <Image
                    source={{
                      uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item.agentId.imageUrl}`,
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
                  {/* <Image
                    source={
                      item.isLiked === false
                        ? require('../assets/icons/like.png')
                        : require('../assets/icons/redicon.png')
                    }
                    // resizeMode="contain"
                    style={styles.icon}
                  /> */}
                  {item.isLiked === false ?
                  <WhiteLikeSvg />
                  :
                  <RedLikeSvg2 />
                  }
                </TouchableOpacity>
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
                      // pauseOnModal=false
                      setDisable(true)
                      moreHandler()
                      // setPause(true)
                    }}
                    >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        {(item?.price && item?.price!=='' && item?.price!==null) ?
                        <Text style={styles.rate}>
                          
                          {item?.currency.toLocaleString()+item?.price.toLocaleString()}
                          
                        </Text>
                        :
                        <>
                        {(item?.heading && item?.heading!=='' && item?.heading!==null) ?
                        <Text style={styles.rate}>
                          
                          {item?.heading.toLocaleString()}
                          
                        </Text>
                        :
                        <Text></Text>
                        }
                        </>
                        }
                      <Pressable 
                        // onPress={handlePresentModalPress}
                        onPress={moreHandler}
                        // onPress={()=>setIsModalVisible(true)}
                        >
                            <Image
                              source={require('../assets/icons/more.png')}
                              resizeMode="contain"
                              style={[styles.icon, {}]}
                            />
                      </Pressable>
                    </View>
                    <Text style={[styles.buldingDetails, {paddingTop: 4}]}>
                    {(item?.beds && item.beds!==0) ? `${item?.beds} beds |` : null} {(item?.bath && item?.bath!==0) ? `${item?.bath} bath |` : null} {(item?.sqft && item.sqft!==0) ? `${item?.sqft} sqft` : null} 
                    </Text>
                    <Text style={styles.buldingDetails}>
                      {item?.address?.road}, {item?.address?.city},{' '}
                      {item?.address?.postCode}.
                    </Text>
                    {item.propertyType==='INFORMATION' ?
                    <View style={styles.propertyTypeContainer}>
                      <Image source={require('../assets/propertyTypes/INFORMATION.png')} style={styles.propertyType}/>
                    </View>
                    :
                    <>
                    {item.propertyType==='FOR SALE' ?
                    <View style={styles.propertyTypeContainer}>
                      <Image source={require('../assets/propertyTypes/FORSALE.png')} style={styles.propertyType}/>
                    </View>
                    :
                    <>
                    {item.propertyType==='INSPIRATION' ?
                    <View style={styles.propertyTypeContainer}>
                      <Image source={require('../assets/propertyTypes/INSPIRATION.png')} style={styles.propertyType}/>
                    </View>
                    :
                    <>
                    {item.propertyType==='SOLD' ?
                    <View style={styles.propertyTypeContainer}>
                      <Image source={require('../assets/propertyTypes/SOLD.png')} style={styles.propertyType}/>
                    </View>
                    :
                    <View style={styles.propertyTypeContainer}>
                      <Image source={require('../assets/propertyTypes/ADVERTISMENT.png')} style={styles.propertyType}/>
                    </View>
                    }
                    </>
                    }
                    </>
                    }
                    </>
                    }
                  </Pressable>
                </View>
              </View>
            </View>
            </>
          }
          {pagerEnabled &&
          <>
          <TouchableOpacity style={{
              backgroundColor:'black',
              padding:8,
              borderRadius:50,
              position:'absolute',
              right:20,
              top:20
              }}
              onPress={DisablePagerView}
              >
              <Image 
                  source={require('../assets/icons/close.png')} 
                  style={{width:24,height:24}}
              />
          </TouchableOpacity>
          </>
          }
          
          
      </View>
      <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                animationConfigs={animationConfigs}
                enablePanDownToClose={false}
                backgroundStyle={{
                backgroundColor: '#000',
                opacity: 1,
                borderRadius:0,
                }}
                >
                <BottomSheetScrollView>
                    <View>
                        {expand === false ? (
                        <View style={{paddingHorizontal: 24,paddingTop:0}}>
                            <View style={{...styles.iconContainer,paddingBottom:20,paddingTop:0}}>
                                <TouchableOpacity
                                    onPress={() => {
                                      setPagerEnabled(false)
                                      setSwiper(true)
                                      bottomSheetRef.current?.dismiss();
                                        navigation.navigate('Admin', {
                                        Details: item.agentId,
                                        });
                                        setPause(true),
                                        Animated.timing(animatedHeight, {
                                          toValue: windowHeight,
                                          duration:400,
                                          easing:Easing.linear,
                                          isInteraction:false
                                        }).start();
                                    }}
                                    activeOpacity={0.7}>
                                    <Image
                                        source={{
                                        uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item.agentId.imageUrl}`,
                                        }}
                                        resizeMode="contain"
                                        style={[
                                        styles.sheetIcon,
                                        {
                                            borderRadius: 50,
                                            borderWidth: 1.5,
                                            borderColor: colors.white,
                                        },
                                        ]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => handleLike()}>
                                    <Image
                                        source={
                                            !item.isLiked
                                            ? require('../assets/icons/like.png')
                                            : require('../assets/icons/redicon.png')
                                        }
                                        resizeMode="contain"
                                        style={styles.sheetIcon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => handleShareVideo()}>
                                    <Image
                                        source={require('../assets/icons/share.png')}
                                        resizeMode="contain"
                                        style={styles.sheetIcon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                  DisablePagerView()
                                  }}>
                                    <Image
                                        source={require('../assets/icons/more.png')}
                                        resizeMode="contain"
                                        style={[styles.sheetIcon, {}]}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{...styles.details}} 
                                >
                                <View>
                                {(item?.price && item?.price!=='' && item?.price!==null) ?
                                <Text style={styles.rate}>
                                  
                                  {item?.currency.toLocaleString()+item?.price.toLocaleString()}
                                  
                                </Text>
                                :
                                <>
                                {(item?.heading && item?.heading!=='' && item?.heading!==null) ?
                                <Text style={styles.rate}>
                                  
                                  {item?.heading.toLocaleString()}
                                  
                                </Text>
                                :
                                <Text></Text>
                                }
                                </>
                                }
                                </View>
                                <Text style={[styles.buldingDetails, {paddingTop: 4}]}>
                                {(item?.beds && item.beds!==0) ? `${item?.beds} beds |` : null} {(item?.bath && item?.bath!==0) ? `${item?.bath} bath |` : null} {(item?.sqft && item.sqft!==0) ? `${item?.sqft} sqft` : null} 
                                </Text>
                                <Text style={styles.buldingDetails}>
                                    {item?.address?.road}, {item?.address?.city},{' '}
                                    {item?.address?.postCode}.
                                </Text>
                                <View
                                    activeOpacity={0.6}
                                    style={{paddingTop:12}}
                                    >
                                    <Text style={{...styles.buldingDetails,color:colors.darkSky}}>
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
                                    source={require('../assets/icons/expand.png')}
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
                            </View>
                            <TouchableOpacity
                                style={{
                                marginTop: 40,
                                backgroundColor: colors.darkSky,
                                borderRadius: 12,
                                }}
                                activeOpacity={0.7}
                                onPress={() => handleMessageAgent(item.agentId)}>
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
                                onPress={() => handleAgent(item.agentId)}>
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
                                    source={require('../assets/icons/minimized.png')}
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
                            </View>
                        </View>
                        )}
                    </View>
                </BottomSheetScrollView>
          </BottomSheetModal>
      </>
  );
};

export default memo(Reels);

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

  pagerView: {
    flex: 1,
    // height:'70%'
    height:windowHeight,
    // width:'100%'
  },
  
  sheetIcon: {
    height: 32, 
    width: 32,
    marginEnd:20
  },
  pageNumber:{
      color:colors.white,
      fontFamily:typography.Bold
  },
  iconContainer:{
      flexDirection:'row',
      // alignItems:'center',
      // paddingHorizontal:20,
      // paddingTop:24
  },
  propertyTypeContainer:{
    marginTop:8
  },
  propertyType:{
    width:140,
    height:20
  }
});
