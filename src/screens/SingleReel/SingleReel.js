import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Share,
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
import More from '../Feeds/more';
import FastImage from 'react-native-fast-image'

import {
  SharedElement,
  createSharedElementStackNavigator,
} from 'react-navigation-shared-element';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';

const windowWidth = Dimensions.get('screen').width;
  const windowHeight = Dimensions.get('screen').height;

import PagerView from 'react-native-pager-view';

const SingleReel = ({route,navigation}) => {
  // const navigation = props.navigation;
  const {item, index,projects,setProjects} = route.params;
  // console.log('navigation', item);

  

  const videoRef = useRef(null);
  // const bottomSheetRef = useRef(null);
  const isFocused = useIsFocused();

  // variables
  const snapPoints = useMemo(() => ['24%', '88%'], []);

  const [mute, setMute] = useState(false);
  const [visible, setVisible] = useState(false);
  const [agentImage, setAgentImage] = useState('');
  const [agentData, setAgentData] = useState();
  const [like, setLike] =useState(false);
  const [itemId, setItemId] = useState('');
  const [likeData, setLikeData] = useState([]);
  const [token, setToken] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [expandVisible, setExpandVisible] = useState(true);
  const [likeOpacity, setLikeOpacity] = useState(0);
  const [pageNumber, setPageNumber] = useState(1)
  // const [liked, setLiked] = useState(like)
  const [mediaFiles, setMediaFiles] = useState([])
  // const [thumbnail, setThumbnail] = useState('')
  const [paused, setPaused] = useState(false)
  const [expand, setExpand] = useState(false);

  const bottomSheetRef = useRef(null);

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
          let temp = [...projects]
          if (item.isLiked === false) {
            // setLike(true);
            temp[index].isLiked = true
                setProjects(temp)
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
            // setLike(false);
            temp[index].isLiked = false
                setData(temp)
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

  const handleLikeHandler=()=>{
    // setLike(!like)
    handleLike()
}

  const goBackHandler=()=>{
    handleDismissModalPress()
    navigation.goBack()
    
}

  useEffect(() => {
    handlePresentModalPress()
    setMediaFiles(item.image)
    // setThumbnail(`https://andspace.s3.ap-south-1.amazonaws.com/${item.image[0]}`)
    if(item.isVideoPresent){
        setMediaFiles(prev=>[item.videoUrl,...prev])
    }
    // setPause(true)
    setLike(item.isLiked)
}, [])

useEffect(() => {
  const blur = navigation.addListener('blur', () => {
      handleDismissModalPress()
      console.log('Close SHEET');
  });

  const focus = navigation.addListener('focus', () => {
      handlePresentModalPress()
  });

return blur,focus;
}, [navigation]);

const long = item?.address?.loc?.coordinates[0];
    const lat = item?.address?.loc?.coordinates[1];

  return (
    // <BottomSheetModalProvider>

      <SharedElement id={item._id} style={{flex:1,backgroundColor: 'black',}}>
          <View style={{flex:1,backgroundColor: 'black',}}>
              <View style={{flex:1,}}>
                  <PagerView 
                      style={styles.pagerView} 
                      initialPage={0}
                      // onPageScroll={(e)=>console.log(e.nativeEvent)}
                      onPageSelected={e=>{
                          if(item.isVideoPresent && e.nativeEvent.position===0){
                              videoRef.current.seek(0)
                              setPaused(false)
                          }else{
                              setPaused(true)
                          }
                          setPageNumber(e.nativeEvent.position+1)}
                      }
                      >
                      {mediaFiles && mediaFiles.map((element,index)=>
                      <View>
                          {(item.isVideoPresent && index===0) ?
                          <Video
                              // key={index}
                              ref={videoRef}
                              // onBuffer={onBuffer}
                              playInBackground={false}
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
                              flex:1
                              // position: 'absolute',
                              }}
                              // onLoad={onLoad}
                              // onLoadStart={onLoadStart}
                              poster={`https://andspace.s3.ap-south-1.amazonaws.com/${item.thumbnailName}`}
                              posterResizeMode='cover'
                          />
                          :
                          
                          <FastImage 
                              source={{uri:`https://andspace.s3.ap-south-1.amazonaws.com/${element}`}} 
                              style={{flex:1,height:'100%',width:'100%'}}
                          />
                          
                          }
                      </View>
                      )}
                  </PagerView>
                  {mediaFiles.length>1 &&
                  <View style={{
                      position:'absolute',
                      bottom:10,
                      right:10,
                      backgroundColor:'black',
                      borderRadius:12,
                      paddingHorizontal:12,
                      paddingVertical:2
                  }}>
                      <Text style={styles.pageNumber}>{pageNumber} / {mediaFiles.length}</Text>
                  </View>
                  }
              </View>
              <TouchableOpacity style={{
                  backgroundColor:'black',
                  padding:8,
                  borderRadius:50,
                  position:'absolute',
                  right:20,
                  top:20
                  }}
                  onPress={goBackHandler}
                  >
                  <Image 
                      source={require('../../assets/icons/close.png')} 
                      style={{width:24,height:24}}
                  />
              </TouchableOpacity>
              <View style={{height:'24%'}}/>
              
              <BottomSheetModal
                  ref={bottomSheetRef}
                  snapPoints={snapPoints}
                  enablePanDownToClose={false}
                  backgroundStyle={{
                  backgroundColor: '#000',
                  opacity: 1,
                  borderRadius:0
                  }}
                  >
                  <BottomSheetScrollView>
                      <View>
                          {expand === false ? (
                          <View style={{flexGrow: 1, paddingHorizontal: 24}}>
                              <View style={{...styles.iconContainer,paddingHorizontal:0,paddingTop:0}}>
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
                                  <TouchableOpacity activeOpacity={0.7} onPress={() => handleLikeHandler()}>
                                      <Image
                                          source={
                                              item.isLiked === false
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
                              <View style={{...styles.details}} 
                                  // onPress={handlePresentModalPress}
                                  >
                                  <View>
                                      <Text style={styles.rate}>
                                      £{item?.price.toLocaleString()}
                                      </Text>
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
                                      // onPress={handlePresentModalPress}
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
                                  {/* <View
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
                                  </View> */}
                              </View>
                          </View>
                          )}
                      </View>
                  </BottomSheetScrollView>
              </BottomSheetModal>
          </View>
      </SharedElement>
    // </BottomSheetModalProvider>
  );
};

export default SingleReel;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    // height:'70%'
    height:windowHeight/1.36,
    // width:'100%'
},
details: {
    paddingTop:16,
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
    marginEnd:20
},
pageNumber:{
    color:colors.white,
    fontFamily:typography.Bold
},
iconContainer:{
    flexDirection:'row',
    alignItems:'center',
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
