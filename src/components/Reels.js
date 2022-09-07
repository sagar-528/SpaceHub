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
  PixelRatio
  // Easing
} from 'react-native';
import React, {useRef, useState, useEffect, useMemo, memo} from 'react';
import {colors, typography} from '../themes';
import {displayToast, load, loadString} from '../utils';
import AxiosBase from '../services/AxioBase';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {Easing} from 'react-native-reanimated';
import WhiteLikeSvg from '../assets/svgs/whiteLikeSvg';
import RedLikeSvg2 from '../assets/svgs/redLikeSvg2';
import GameInstruction from './Modals/GameInstruction';
import SucessModal from './Modals/SucessModal';
import FailModal from './Modals/FailModal';
import AnimatedNumbers from 'react-native-animated-numbers';
import qs from 'qs';
import {Key} from '../Constant/constant';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('window').height;

const Reels = ({
  item,
  index,
  currentIndex,
  data,
  setData,
  navigation,
  setHook,
  hook,
  swiper,
  setSwiper,
  currentVisibleIndex,
  setLikedId,
  videoPaused,
  flatRef,
}) => {
  const appState = useRef(AppState.currentState);

  //Ref
  const videoRef = useRef(null);
  const bottomSheetRef = useRef(null);

  const [pause, setPause] = useState(false);
  const [disable, setDisable] = useState(false);
  const [pagerEnabled, setPagerEnabled] = useState(false);
  const [token, setToken] = useState(false);
  const [icon, setIcon] = useState(false);

  //Game states
  const [gameInstructionModal, setGameInstructionModal] = useState(false);
  const [sucessModal, setSucessModal] = useState(false);
  const [failModal, setFailModal] = useState(false);
  const [gameMode, setGameMode] = useState(Key.gamemode);
  const [check, setCheck] = useState(0);

  //Animation
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(1));
  const [animateToNumber, setAnimateToNumber] = useState(item?.price);
  const [animateToNumberPercentage, setAnimateToNumberPercentage] = useState(
    (25 / 100) * item.price,
  );

  let sheetDuration = 200;
  const [loading, setLoading] = useState(false);

  // variables
  const snapPoints = useMemo(() => ['24%', '90%'], []);
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: sheetDuration,
    easing: Easing.linear,
  });

  const [pageNumber, setPageNumber] = useState(1);
  const [expand, setExpand] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState(
    new Animated.Value(windowHeight),
  );

  const long = item?.address?.loc?.coordinates[0];
  const lat = item?.address?.loc?.coordinates[1];

  // Video process handle for focus and blur
  useEffect(() => {
    const blur = navigation.addListener('blur', () => {
      // setCheck(0);
      setPause(true);
      setDisable(true);
      clearInterval();
    });

    const focus = navigation.addListener('focus', () => {
      // bottomSheetRef.current?.present();
      setPause(false);

      if (!!videoRef.current) {
        videoRef.current.seek(0);
      }
      setDisable(false);
    });

    // console.log('nav focus ');

    return blur, focus;
  }, [navigation]);

  useEffect(() => {
    // console.log('Appstate', appState.current);
    if (appState.current === 'active') {
      setPause(false);
      // console.log('active');
    } else {
      if (gameMode === true) {
        clearInterval();
      } else {
        // console.log('gamemode off');
      }
      setPause(true);
      setGameMode(false);
    }
  }, [currentIndex]);

  //Game mode UI Visible
  useEffect(() => {
    load('Game_Mode')
      .then(response => {
        // console.log('game mode', response);
        if (response !== null) {
          Key.gamemode = response;
          // setGameMode(Key.gamemode);
        }
      })
      .catch(error => {
        console.log('async error', error);
      });
  }, [currentIndex]);

  //Resart video
  useEffect(() => {
    setCheck(0);

    if (!!videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [currentIndex]);

  // Animated effect
  useEffect(() => {
    if (Key.gamemode === true) {
      setInterval(() => {
        if (item?.gamePrice !== undefined) {
          // console.log('number');
          let animatedNumberLength = animateToNumber.toString().length - 1;
          setAnimateToNumber(
            animateToNumber + randomWithNdigits(animatedNumberLength),
          );
        } else if (item.gamePrice === undefined) {
          let infoLenght = animateToNumberPercentage.toString().length - 1;
          // console.log('percentage number lenght', infoLenght);
          setAnimateToNumberPercentage(
            animateToNumberPercentage + randomWithNdigits(infoLenght),
          );
        }
      }, 10000);
    }

    // return setAnimateToNumber(item.gamePrice);
  }, [currentIndex]);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  function randomWithNdigits(n) {
    let start = 10 ** (n - 1);
    let end = 10 ** n - 1;
    return getRandomInt(start, end);
  }

  const onError = ({error}) => {
    console.log('error of video', index, error);
    // displayToast('error',error.localizedDescription);
  };

  function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const handleGame = e => {
    // console.log('increase', e.gamePress);

    const randomNumber = getRandomNumberBetween(1, 5);
    const percent = (25 / 100) * item.price;

    let info = {
      propertyId: item._id,
    };

    loadString('token').then(response => {
      if (response !== null && item.gamePrice !== undefined) {
        // console.log(
        //   'with token and defined game price',
        //   item.price,
        //   item.gamePrice,
        //   JSON.parse(item.price) >= JSON.parse(item.gamePrice),
        // );

        if (
          e.down == 'down'
            ? JSON.parse(item.price) >= JSON.parse(item.gamePrice)
            : JSON.parse(item.gamePrice) > JSON.parse(item.price)
        ) {
          AxiosBase.post('app/property/score', qs.stringify(info))
            .then(response => {
              // console.log('sucessfully game api', response);
              setSucessModal(true);
              setCheck(2);
            })
            .catch(error => {
              console.log('api error', error);
            });
        } else {
          setFailModal(true);
          setCheck(1);
        }
      } else if (response !== null && item.gamePrice === undefined) {
        // console.log('with token and undefined game price');
        // console.log(
        //   'play with api hit in it gameprice undefined',
        //   randomNumber,
        //   percent,
        // );
        let result;
        if (randomNumber === 1) {
          result = percent + item.price;
        } else if (randomNumber === 2) {
          result = percent - item.price;
        } else if (randomNumber === 3) {
          result = percent + item.price;
        } else if (randomNumber === 4) {
          result = percent + item.price;
        } else {
          result = percent - item.price;
        }

        if (Math.abs(result) >= item.price) {
          if (e.gamePress == 'up') {
            setSucessModal(true);
            setCheck(2);
          } else if (e.gamePress == 'down') {
            setFailModal(true);
            setCheck(1);
          }
        }
      } else {
        if (response === null && item.gamePrice !== undefined) {
          // console.log(
          //   'without token and defined game price',
          //   item.gamePrice,
          //   item.price,
          // );

          if (item.gamePrice >= item.price) {
            if (e.gamePress == 'up') {
              setSucessModal(true);
              setCheck(2);
            } else if (e.gamePress == 'down') {
              setFailModal(true);
              setCheck(1);
            }
          }
        } else if (response === null && item.gamePrice === undefined) {
          let result1;
          if (randomNumber === 1) {
            result1 = percent + item.price;
          } else if (randomNumber === 2) {
            result1 = percent - item.price;
          } else if (randomNumber === 3) {
            result1 = percent + item.price;
          } else if (randomNumber === 4) {
            result1 = percent + item.price;
          } else {
            result1 = percent - item.price;
          }

          // console.log('result and price', result1, item.price);
          if (Math.abs(result1) >= item.price) {
            if (e.gamePress == 'up') {
              setSucessModal(true);
              setCheck(2);
            } else if (e.gamePress == 'down') {
              setFailModal(true);
              setCheck(1);
            }
          }
        }
      }
    });
  };

  const onLoad = e => {
    // console.log('onLoad', index, e);
  };

  const message = `Hey, checkout this new property I found on the SpaceHub App \n https://andspace.s3.ap-south-1.amazonaws.com/${item?.videoUrl}`;

  // Share video function
  const handleShareVideo = async () => {
    const options = {
      message: message,
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

  // Like video function
  const handleLike = () => {
    setLikedId('');
    loadString('token')
      .then(response => {
        if (response === null && item.isLiked === undefined) {
          displayToast('Please Login First.');
        } else {
          let temp = [...data];
          if (item.isLiked === false) {
            // setLike(true);
            temp[index].isLiked = true;
            // setIcon(true);
            setData(temp);
            AxiosBase.put(
              `app/user/likedVideos?propertyId=${item._id}&flag=${true}`,
            )
              .then(response => {
                // console.log('response of like', response.data.data);
                // setLikeData(response.data.data.likedVideos);
                // setHook(!hook);
                // let temp = [...data]
              })
              .catch(error => {
                console.log('error', error.response.data);
              });
          } else {
            // setLike(false);
            temp[index].isLiked = false;
            // setIcon(false);
            setData(temp);
            AxiosBase.put(
              `app/user/likedVideos?propertyId=${item._id}&flag=${false}`,
            )
              .then(response => {
                // setLikeData(response.data.data.likedVideos);
                // setHook(!hook);
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

  // Pager function
  const moreHandler = () => {
    bottomSheetRef.current?.present();
    Animated.timing(animatedHeight, {
      toValue: windowHeight / 1.3,
      duration: 500,
      easing: Easing.linear,
      isInteraction: false,
    }).start();

    // fadeInView()
    setSwiper(false);
    setPagerEnabled(true);
    sheetDuration = 500;
    // pauseOnModal=false
  };

  // Disable pager function
  const DisablePagerView = () => {
    setTimeout(() => {
      Animated.timing(animatedHeight, {
        toValue: windowHeight,
        duration: 600,
        easing: Easing.linear,
        isInteraction: false,
      }).start();

      // fadeOutView()
      setSwiper(true);
      setPagerEnabled(false);

      bottomSheetRef.current?.dismiss();
      sheetDuration = 300;
    }, 500);
    // setPause(false)
  };

  //Pager scroll function
  function handleOnScroll(event) {
    const currentScreenIndex = parseInt(
      event.nativeEvent.contentOffset.x / windowWidth,
    );
    setPageNumber(currentScreenIndex + 1);
  }

  // Email agent function
  const handleEmailAgent = e => {
    Linking.openURL(`mailto:${e.email}`);
  };

  return (
    <>
      <View style={{backgroundColor: '#000', flex: 1}}>
        <Animated.View
          style={{
            backgroundColor: '#000',
            flex: 1,
            opacity: fadeAnim,
            height: animatedHeight,
          }}>
          <ScrollView
            horizontal
            contentContainerStyle={{flexGrow: 1}}
            scrollEnabled={pagerEnabled}
            pagingEnabled
            onScroll={e => handleOnScroll(e)}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            // scrollEventThrottle={5}
          >
            {item.videoWithImages &&
              item.videoWithImages.map((element, indx) => (
                <View key={indx}>
                  {indx === 0 ? (
                    <>
                      <Video
                        // key={index}
                        ref={videoRef}
                        // onBuffer={onBuffer}
                        muted={videoPaused}
                        onLoad={onLoad}
                        playWhenReady={true}
                        playInBackground={false}
                        automaticallyWaitsToMinimizeStalling={true}
                        onVideoLoad={e => {
                          console.log('load', e);
                        }}
                        onError={onError}
                        repeat
                        resizeMode="cover"
                        ignoreSilentSwitch={'ignore'}
                        paused={
                          index !== currentVisibleIndex || videoPaused || pause
                        }
                        source={{
                          uri: `https://andspace.s3.ap-south-1.amazonaws.com/${element}`,
                          type: 'mp4',
                        }}
                        style={{
                          width: windowWidth,
                          // height: windowHeight/1.30,
                          flex: 1,
                        }}
                        bufferConfig={{
                          minBufferMs: 15000,
                          maxBufferMs: 50000,
                          bufferForPlaybackMs: 2500,
                          bufferForPlaybackAfterRebufferMs: 5000,
                        }}
                        preferredForwardBufferDuration={2500}
                        // controls
                      />
                    </>
                  ) : (
                    <>
                      {pagerEnabled && (
                        <FastImage
                          source={{
                            uri: `https://andspace.s3.ap-south-1.amazonaws.com/${element}`,
                          }}
                          style={{height: '100%', width: windowWidth}}
                        />
                      )}
                    </>
                  )}
                </View>
              ))}
          </ScrollView>
          {item.videoWithImages.length > 1 && pagerEnabled && (
            <View
              style={{
                position: 'absolute',
                bottom: 20,
                right: 10,
                backgroundColor: 'black',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 2,
              }}>
              <Text style={styles.pageNumber}>
                {pageNumber} / {item.videoWithImages.length}
              </Text>
            </View>
          )}
        </Animated.View>
        {!pagerEnabled && (
          <>
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                bottom: 212,
                right: 16,
                alignItems: 'flex-end',
              }}>
              <View style={{marginBottom: 40}}>
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
              <View style={{marginBottom: 40}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    handleLike();
                  }}>
                  {item?.isLiked && item.isLiked ? (
                    <RedLikeSvg2 />
                  ) : (
                    <WhiteLikeSvg />
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginBottom:
                    // item.propertyType === 'SOLD' ||
                    // item.propertyType === 'FOR SALE'
                    //   ? 40
                    //   :
                    28,
                }}>
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
              {/* {item.propertyType === 'SOLD' ||
              item.propertyType === 'FOR SALE' ? ( */}
              <View style={{marginBottom: 28}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setGameInstructionModal(true);
                  }}>
                  <Image
                    source={require('../assets/icons/gameIcon.png')}
                    resizeMode="contain"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
              {/* ) : null} */}

              {Key.gamemode === false && item?.price !== '' ? null : (
                <View style={{left: 8}}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={{}}
                    // hitSlop={4}
                    onPress={() => handleGame({gamePress: 'up'})}>
                    <Image
                      source={require('../assets/icons/Up.png')}
                      resizeMode="contain"
                      style={{height: 70, width: 70}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={{marginBottom: 28}}
                    onPress={() => handleGame({gamePress: 'down'})}>
                    <Image
                      source={require('../assets/icons/Down.png')}
                      resizeMode="contain"
                      style={{height: 70, width: 70}}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={[styles.overcontainer]}>
              <View style={styles.rootContainer}>
                <View style={styles.row}>
                  <Pressable
                    style={styles.details}
                    onPress={() => {
                      // pauseOnModal=false
                      setDisable(true);
                      moreHandler();
                      // setPause(true)
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      {item?.price &&
                      item?.price !== '' &&
                      item?.price !== null ? (
                        Key.gamemode === false ? (
                          <Text style={styles.rate}>
                            {item?.currency.toLocaleString() +
                              item?.price.toLocaleString()}
                          </Text>
                        ) : (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={styles.rate}>
                              {item?.currency.toLocaleString()}
                            </Text>
                            <AnimatedNumbers
                              includeComma
                              animateToNumber={
                                item.gamePrice && item.gamePrice !== ''
                                  ? animateToNumber
                                  : animateToNumberPercentage
                              }
                              animationDuration={5000}
                              fontStyle={styles.rate}
                            />
                            <Image
                              source={
                                check === 1
                                  ? require('../assets/icons/cross.png')
                                  : check === 2
                                  ? require('../assets/icons/tick.png')
                                  : null
                              }
                              resizeMode="contain"
                              style={{height: 24, width: 24, marginStart: 8}}
                            />
                          </View>
                        )
                      ) : (
                        <>
                          {item?.heading &&
                          item?.heading !== '' &&
                          item?.heading !== null ? (
                            <Text style={styles.rate}>
                              {item?.heading.toLocaleString()}
                            </Text>
                          ) : (
                            <Text></Text>
                          )}
                        </>
                      )}
                      <Pressable
                        // onPress={handlePresentModalPress}
                        onPress={moreHandler}
                        // onPress={()=>setIsModalVisible(true)}
                      >
                        <Image
                          source={require('../assets/icons/info.png')}
                          resizeMode="contain"
                          style={[
                            styles.icon,
                            {marginEnd: Key.gamemode === true ? 4 : 0},
                          ]}
                        />
                      </Pressable>
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
                      {item?.address?.road}, {item?.address?.city},{' '}
                      {item?.address?.postCode}.
                    </Text>
                    {item.propertyType === 'INFORMATION' ? (
                      <View style={styles.propertyTypeContainer}>
                        <Image
                          source={require('../assets/propertyTypes/INFORMATION.png')}
                          style={styles.propertyType}
                        />
                      </View>
                    ) : (
                      <>
                        {item.propertyType === 'FOR SALE' ? (
                          <View style={styles.propertyTypeContainer}>
                            <Image
                              source={require('../assets/propertyTypes/FORSALE.png')}
                              style={styles.propertyType}
                            />
                          </View>
                        ) : (
                          <>
                            {item.propertyType === 'INSPIRATION' ? (
                              <View style={styles.propertyTypeContainer}>
                                <Image
                                  source={require('../assets/propertyTypes/INSPIRATION.png')}
                                  style={styles.propertyType}
                                />
                              </View>
                            ) : (
                              <>
                                {item.propertyType === 'SOLD' ? (
                                  <View style={styles.propertyTypeContainer}>
                                    <Image
                                      source={require('../assets/propertyTypes/SOLD.png')}
                                      style={styles.propertyType}
                                    />
                                  </View>
                                ) : (
                                  <View style={styles.propertyTypeContainer}>
                                    <Image
                                      source={require('../assets/propertyTypes/ADVERTISMENT.png')}
                                      style={styles.propertyType}
                                    />
                                  </View>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        animationConfigs={animationConfigs}
        enablePanDownToClose={false}
        backgroundStyle={{
          backgroundColor: '#282828',
          opacity: 1,
          borderRadius: 0,
        }}>
        <BottomSheetScrollView>
          <View>
            {expand === false ? (
              <View style={{paddingHorizontal: 24, paddingTop: 0}}>
                <View
                  style={{
                    ...styles.iconContainer,
                    paddingBottom: 20,
                    paddingTop: 0,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setPagerEnabled(false);
                      setSwiper(true);
                      bottomSheetRef.current?.dismiss();
                      navigation.navigate('Admin', {
                        Details: item.agentId,
                      });
                      setPause(true),
                        Animated.timing(animatedHeight, {
                          toValue: windowHeight,
                          duration: 400,
                          easing: Easing.linear,
                          isInteraction: false,
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
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleLike()}>
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
                  {pagerEnabled && (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'flex-end',
                      }}>
                      <TouchableOpacity onPress={DisablePagerView}>
                        <Image
                          source={require('../assets/icons/cross1.png')}
                          style={[styles.sheetIcon, {marginEnd: 0}]}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View style={{...styles.details}}>
                  <View>
                    {item?.price &&
                    item?.price !== '' &&
                    item?.price !== null ? (
                      <Text style={styles.rate}>
                        {item?.currency.toLocaleString() +
                          item?.price.toLocaleString()}
                      </Text>
                    ) : (
                      <>
                        {item?.heading &&
                        item?.heading !== '' &&
                        item?.heading !== null ? (
                          <Text style={styles.rate}>
                            {item?.heading.toLocaleString()}
                          </Text>
                        ) : (
                          <Text></Text>
                        )}
                      </>
                    )}
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
                    {item?.address?.road}, {item?.address?.city},{' '}
                    {item?.address?.postCode}.
                  </Text>
                  <View activeOpacity={0.6} style={{paddingTop: 12}}>
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
                      source={require('../assets/icons/expand.png')}
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
                    marginBottom: 24,
                  }}
                  activeOpacity={0.7}
                  onPress={() => handleEmailAgent(item.agentId)}>
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
                    Email Agent
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
                </View>
              </View>
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
      <SucessModal
        sucessModal={sucessModal}
        setSucessModal={setSucessModal}
        price={item.price}
        currentIndex={currentIndex}
        videoRef={videoRef}
        flatRef={flatRef}
      />
      <FailModal
        failModal={failModal}
        setFailModal={setFailModal}
        price={item.price}
        currentIndex={currentIndex}
        videoRef={videoRef}
        flatRef={flatRef}
      />
      <GameInstruction
        gameInstructionModal={gameInstructionModal}
        setGameInstructionModal={setGameInstructionModal}
        gameMode={gameMode}
        setGameMode={setGameMode}
      />
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
    backgroundColor: colors.white,
  },

  pagerView: {
    flex: 1,
    // height:'70%'
    height: windowHeight,
    // width:'100%'
  },

  sheetIcon: {
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
  },
  propertyTypeContainer: {
    marginTop: 8,
  },
  propertyType: {
    width: 140,
    height: 20,
  },
});
