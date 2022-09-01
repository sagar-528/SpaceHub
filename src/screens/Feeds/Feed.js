import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useMemo,
  useCallback,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Image,
  AppState,
} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import Reels from '../../components/Reels';
import {Loader} from '../../components/Loader';
import AxiosBase from '../../services/AxioBase';
import {useIsFocused} from '@react-navigation/native';
import Video from 'react-native-video';
import NetInfo from '@react-native-community/netinfo';
import {Key} from '../../Constant/constant';
import {EventRegister} from 'react-native-event-listeners';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {load, displayToast} from '../../utils';
import {Set} from 'immutable';
import {typography} from '../../themes';
import DeviceInfo from 'react-native-device-info';
import {useFocusEffect} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Feed = props => {
  const navigation = props.navigation;
  const flatRef = useRef(null);
  const isFocused = useIsFocused();
  const videoRef = useRef(null);
  const [videoRefs, setVideoRefs] = useState([]);
  const [paused, setPaused] = useState([]);
  const [notFirstTime, setNotFirstTime] = useState(false);

  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0)
  const [feedData, setFeedData] = useState([]);
  const [errorStatus, setErrorStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [refreshing, setRefreshing] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [swiper, setSwiper] = useState(true);
  const [selectedItems, setSelectedItems] = useState(Set());
  const [likedId, setLikedId] = useState(''); // updating from liked screen
  const [firstTimeFocused, setFirstTimeFocused] = useState(true);

  const _isMounted = useRef(true);

  const [hook, setHook] = useState(false);

  useEffect(() => {
    StatusBar.setHidden(true);

    getData();
    // setRefreshing(!refreshing)

    load('coords')
      .then(response => {
        console.log('geo response', response);
        if (response) {
          Key.latitude = response?.coords?.latitude;
          Key.longitude = response?.coords?.longitude;
        }
      })
      .catch(error => {
        console.log(error.message);
      });

    return () => {
      // ComponentWillUnmount in Class Component
      _isMounted.current = false;
    };
  }, []);

  const getData = () => {
    console.log('PAGE', page);
    NetInfo.fetch().then(isConnected => {
      if (isConnected.isConnected === true) {
        setLoading(true);
        AxiosBase.get('app/property/videoProperty', {
          params: {
            // limit: 10,
            // page: page,
            isVideoPresent: true,
            deviceToken: DeviceInfo.getDeviceId(),
          },
        })
          .then(response => {
            setLoading(false);
            console.log(`feeds response${page}`, response?.data?.data);
            let data = response?.data?.data;
            const newObject = data.map(obj => ({
              ...obj,
              videoWithImages: [obj.videoUrl, ...obj.image],
            }));
            setFeedData(prev => [...prev, ...newObject]);
            setLoading(false);
            setPage(page + 1);
            setErrorStatus(0);
          })
          .catch(error => {
            setLoading(false);
            setRefreshing(false);
            console.log('error in feeds api', error);
            setErrorStatus(1);
          });
      } else {
        setRefreshing(false);
        displayToast('Internet Connection Problem');
      }
    });
  };

  useEffect(() => {
    // subscribe event
    let listener = EventRegister.addEventListener('updateFeeds', id => {
      setLikedId(id);
      const updatedItemIndex = feedData.findIndex(obj => obj._id === likedId);
      // feedData.map((item)=>console.log('logggggg111',item))
      console.log('updatedItemIndex', updatedItemIndex);
    });

    return () => {
      // unsubscribe event
      EventRegister.removeEventListener(listener);
    };
  }, []);

  useEffect(() => {
    console.log('updating LIKED ID', likedId);
    
    if (likedId !== '') {  
      const updatedItemIndex = feedData.findIndex(obj => obj._id === likedId);
      feedData.map((item)=>console.log('logggggg111',item))
      console.log('updatedItemIndex', updatedItemIndex);
      if (updatedItemIndex !== -1) {
        let temp = [...feedData];
        temp[updatedItemIndex].isLiked = false;
        setFeedData(temp);
      }
    }
  }, [likedId]);

  const updateItem = id => {
    const updatedItemIndex = feedData.findIndex(obj => obj._id === id);
    feedData.map(item => console.log('logggggg111', item));
    console.log('updatedItemIndex', updatedItemIndex);
    let temp = [...feedData];
    temp[updatedItemIndex].isLiked = false;
    setFeedData(temp);
  };

  const LoadMoreData = () => {
    // alert('ghjgjhgjh')
    if (!loading) {
      getData();
    }
    setNotFirstTime(true);
  };

  function _renderFooter() {
    if (loading) {
      return (
        <View style={{height: 20, marginTop: 12}}>
          <ActivityIndicator size={30} />
        </View>
      );
    } else {
      return null;
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(true);

  const _onViewableItemsChanged = ({viewableItems, changed}) => {
    if (viewableItems && viewableItems.length > 0) {
      console.log('currentVisibleIndex', viewableItems[0].index);
      setCurrentVisibleIndex(viewableItems[0].index);
    }
  };

  // const windowSize = feedData.length > 42 ? feedData.length / 2 : 21;

  const handleChangeIndexValue = ({index}) => {
    setCurrentIndex(index);
  };

  function _renderItem({item, index}) {
    return (
      <Reels
        // id={item._id}
        // selected={selectedItems.has(item.isLiked)}
        // onClick={onClick}
        item={item}
        index={index}
        currentIndex={currentIndex}
        currentVisibleIndex={currentVisibleIndex}
        navigation={navigation}
        setHook={setHook}
        hook={hook}
        loading={loading}
        data={feedData}
        setData={setFeedData}
        flatRef={flatRef}
        // refreshing={refreshing}
        // setRefreshing={setRefreshing}
        swiper={swiper}
        setSwiper={setSwiper}
        setLikedId={setLikedId} // to clear the id if pressed again for like
        videoPaused={videoPaused}
      />
    );
  }

  function EmptyListMessage() {
    if (loading) {
      return null;
    } else if (errorStatus === 0 && feedData.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: windowHeight / 3,
          }}>
          <Text style={{fontFamily: typography.Bold, fontSize: 20}}>
            No data found
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: windowHeight / 3,
          }}>
          <Text style={{fontFamily: typography.Bold, fontSize: 16}}>
            Server Down :( Please try after sometimes
          </Text>
        </View>
      );
    }
  }

  const keyExtractor = useCallback((item, index) => {
    return item._id + index.toString();
  }, []);

  const [videoPaused, toggleVideoPaused] = useState(false);
  const [appActive, setAppActive] = useState(false);

  const handleAppStateChange = nextAppState => {
    console.log('App nextAppState', nextAppState);
    if (nextAppState === 'active') {
      setAppActive(true);
    } else {
      setAppActive(false);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);

  useEffect(() => {
    if (!firstTimeFocused) {
      appActive ? toggleVideoPaused(false) : toggleVideoPaused(true);
    } else {
      setFirstTimeFocused(false);
    }
  }, [appActive]);
  const [pause, setPause] = useState(true);

  console.log('_isMounted.current', _isMounted.current);

  return (
    <View style={{flex: 1, backgroundColor: '#282828'}}>
      <SwiperFlatList
        disableVirtualization={false}
        legacyImplementation={true}
        overScrollMode="never"
        scrollEnabled={swiper}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={getData} />
        }
        ref={flatRef}
        data={feedData}
        windowSize={2}
        maxToRenderPerBatch={1}
        removeClippedSubviews={true}
        initialNumToRender={1}
        updateCellsBatchingPeriod={100}
        vertical
        onChangeIndex={handleChangeIndexValue}
        renderItem={_renderItem}
        keyExtractor={(item, index) => keyExtractor(item, index)}
        decelerationRate={'fast'}
        onEndReached={LoadMoreData}
        onEndReachedThreshold={0.2}
        onViewableItemsChanged={_onViewableItemsChanged}
        ListFooterComponent={_renderFooter}
        ListEmptyComponent={EmptyListMessage}
      />
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({});

// first optional solution

// windowSize={4}
// initialNumToRender={0}
// maxToRenderPerBatch={1}
// removeClippedSubviews

// 2ndworkign solution without viewpager
// windowSize={windowSize}
// maxToRenderPerBatch={3}
// removeClippedSubviews={true}
// initialNumToRender={3}
