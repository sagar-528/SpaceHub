import React, {useState, useEffect, useRef,memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Image
} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import Reels from '../../components/Reels';
import {Loader} from '../../components/Loader';
import AxiosBase from '../../services/AxioBase';
import {useIsFocused} from '@react-navigation/native';
import Video from 'react-native-video';
import NetInfo from '@react-native-community/netinfo';
import { Key } from '../../Constant/constant';
import { EventRegister } from 'react-native-event-listeners'
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { load,displayToast } from '../../utils';
import { Set } from "immutable";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Feed = props => {
  const navigation = props.navigation;
  const isFocused = useIsFocused();
  const videoRef = useRef(null);
  const [videoRefs, setVideoRefs] = useState([])
  const [paused, setPaused] = useState([])

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0)
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [page, setPage] = useState(0)
  const [swiper, setSwiper] = useState(true)
  const [selectedItems, setSelectedItems] = useState(Set());
  const [likedId, setLikedId] = useState('') // updating from liked screen


  const [hook, setHook] = useState(false);

  
  useEffect(() => {
    StatusBar.setHidden(true);
    
    getData();
    // setRefreshing(!refreshing)

    load('coords')
      .then(response => {
        console.log('geo response',response);
        if(response){
          Key.latitude = response?.coords?.latitude
          Key.longitude = response?.coords?.longitude
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  }, []);

  const getData = () => {
    console.log('PAGE',page);
    NetInfo.fetch().then(isConnected => {
      if (isConnected.isConnected === true) {
        setLoading(true)
        AxiosBase.get('app/property/videoProperty', {
          params: {
            // limit: 10,
            // page: page,
            isVideoPresent: true,
          },
        })
          .then(response => {
            setLoading(false);
            // console.log('feeds response', response?.data?.data);
            let data = response?.data?.data
            if(data.length===0){
              // setFeedData([])
              // setPage(0)
              // AxiosBase.get('app/property/videoProperty', {
              //   params: {
              //     limit: 10,
              //     page: 0,
              //     isVideoPresent: true,
              //   },
              // }).then(res=>{
              //   let initialDataToShowAtFirst = res?.data?.data
              //   console.log('initialDataToShowAtFirst',initialDataToShowAtFirst);
              //   setFeedData(initialDataToShowAtFirst);
              // }).catch(err=>{
              //   setLoading(false)
              //   setRefreshing(false);
              //   console.log('error in feeds api', error.message);
              // })
              // getData()
            }else{
              setFeedData(prev=>[...prev,...data]);
              // setFeedData(data);
              setLoading(false);
              setPage(page+1)
              // setRefreshing(!refreshing)
            }
          })
          .catch(error => {
            setLoading(false);
            setRefreshing(false);
            // setRefreshing(!refreshing)
            console.log('error in feeds api', error.message);
          })
          // .finally(() => {
          //   // setRefreshing(false);
          //   setLoading(false);
          //   setRefreshing(!refreshing)
          // });
      } else {
        setRefreshing(false);
        displayToast('Internet Connection Problem');
      }
    });
  };

  const handleChangeIndexValue = ({index}) => {
    setCurrentIndex(index);
  };


  useEffect(() => {
    // subscribe event
  let  listener = EventRegister.addEventListener('updateFeeds', (id) => {
    setLikedId(id)
    const updatedItemIndex = feedData.findIndex(obj => obj._id === likedId)
    // feedData.map((item)=>console.log('logggggg111',item))
    console.log('updatedItemIndex',updatedItemIndex);
    // getData()
  })

    return () => {
      // unsubscribe event
      EventRegister.removeEventListener(listener)

    };
  }, [])

  useEffect(() => {
    console.log('updating LIKED ID',likedId);
    if(likedId!==''){
      const updatedItemIndex = feedData.findIndex(obj => obj._id === likedId)
      // feedData.map((item)=>console.log('logggggg111',item))
      console.log('updatedItemIndex',updatedItemIndex);
      let temp = [...feedData]
      temp[updatedItemIndex].isLiked = false
      setFeedData(temp)
    }
  }, [likedId])
  


  // const updateItem=(id)=>{
  //   const updatedItemIndex = feedData.findIndex(obj => obj._id === id)
  //   feedData.map((item)=>console.log('logggggg111',item))
  //   console.log('updatedItemIndex',updatedItemIndex);
  //   let temp = [...feedData]
  //   temp[updatedItemIndex].isLiked = false
  //   setFeedData(temp)
  // }

  const LoadMoreData=()=>{
    // alert('ghjgjhgjh')
    if(!loading){
      getData()
    }
  }

  const _renderFooter=()=>{
    return(
      <View style={{height:20,marginTop:12}}>
        <ActivityIndicator size={30}/>
      </View>
    )
  }

  const windowSize = feedData.length > 50 ? feedData.length / 2 : 21;

  // const onClickUseCallBack = React.useCallback(
  //   id => {
  //     setSelectedItems((selectedItems) => {
  //       const newSelectedItems = selectedItems.has(id)
  //         ? selectedItems.delete(id)
  //         : selectedItems.add(id);

  //       return newSelectedItems
  //     });
  //   },
  //   []
  // );

  function itemEq(prevItem, nextItem) {
    return prevItem.id === nextItem.id && prevItem.isLiked === nextItem.isLiked;
  }

  const MemoizedItem = memo(Reels,itemEq);

  const Items = ({ data, selectedItems, }) => {
    // const windowSize = feedData.length > 50 ? feedData.length / 2 : 21;
    // const [hook, setHook] = useState(false);
    // const [currentIndex, setCurrentIndex] = useState(0);
    console.log("rendering items");
    // Replace <Item /> with <MemoizedItem /> or <MemoizedItem2 /> to see effect
    // const handleChangeIndexValue = ({index}) => {
    //   setCurrentIndex(index);
    // };
    const _renderItem = ({ item,index }) => (
      <MemoizedItem
        id={index}
        // title={`${item.name.title} ${item.name.first} ${item.name.last}`}
        // avatarUrl={item.picture.thumbnail}
        selected={selectedItems.has(item.isLiked)}
        // onClick={onClick}
        item={item}
        index={index}
        // cellRef={videoRefs[index]}
        // paused={paused[index]}
        // currentIndex={currentIndex}
        // currentVisibleIndex={currentVisibleIndex}
        navigation={navigation}
        setHook={setHook}
        hook={hook}
        data={data}
        setData={setFeedData}
        // refreshing={refreshing}
        // setRefreshing={setRefreshing}
        swiper={swiper}
        setSwiper={setSwiper}
      />
    );
    return (
      <SwiperFlatList
        // style={{flex:1}}
        scrollEnabled={swiper}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={getData} />
      }
      // extraData={refreshing}
        data={feedData}
        // windowSize={101}
        maxToRenderPerBatch={windowSize}
        // removeClippedSubviews={true}
        // initialNumToRender={5}
        vertical
        // onChangeIndex={handleChangeIndexValue}
        // renderItem={({item, index}) => (
        //   <Reels
        //     item={item}
        //     index={index}
        //     // cellRef={videoRefs[index]}
        //     // paused={paused[index]}
        //     currentIndex={currentIndex}
        //     currentVisibleIndex={currentVisibleIndex}
        //     navigation={navigation}
        //     setHook={setHook}
        //     hook={hook}
        //     data={feedData}
        //     setData={setFeedData}
        //     refreshing={refreshing}
        //     setRefreshing={setRefreshing}
        //     swiper={swiper}
        //     setSwiper={setSwiper}
        //   />
        // )}
        renderItem={_renderItem}
        keyExtractor={(items, index) => {
          return index;
        }}
        decelerationRate={'fast'}
        onEndReached={LoadMoreData}
        onEndReachedThreshold={0.2}
        // refreshing={refreshing}
        // onRefresh={getData}
        // onViewableItemsChanged={onViewRef.current}
        // viewabilityConfig={viewConfigRef.current}
        ListFooterComponent={_renderFooter}
      />
    );
  };

  const _onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems && viewableItems.length > 0) {
      console.log('currentVisibleIndex',viewableItems[0].index);
        setCurrentVisibleIndex(viewableItems[0].index)
    }
  };


  console.log('resfresh',feedData);
  return (
    // <BottomSheetModalProvider>

        <View style={{flex:1}}>
          
          <SwiperFlatList
            // style={{flex:1}}
            scrollEnabled={swiper}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={getData} />
          }
          // extraData={refreshing}
            data={feedData}
            // windowSize={101}
            maxToRenderPerBatch={windowSize}
            // removeClippedSubviews={false}
            // initialNumToRender={5}
            vertical
            onChangeIndex={handleChangeIndexValue}
            renderItem={({item, index}) => (
              <Reels
                item={item}
                index={index}
                // cellRef={videoRefs[index]}
                // paused={paused[index]}
                currentIndex={currentIndex}
                currentVisibleIndex={currentVisibleIndex}
                navigation={navigation}
                setHook={setHook}
                hook={hook}
                data={feedData}
                setData={setFeedData}
                refreshing={refreshing}
                setRefreshing={setRefreshing}
                swiper={swiper}
                setSwiper={setSwiper}
                setLikedId={setLikedId} // to clear the id if pressed again for like
              />
            )}
            // renderItem={_renderItem}
            keyExtractor={(item, index) => {
              return item._id+index;
            }}
            decelerationRate={'fast'}
            onEndReached={LoadMoreData}
            onEndReachedThreshold={0.1}
            // refreshing={refreshing}
            // onRefresh={getData}
            onViewableItemsChanged={_onViewableItemsChanged}
            // viewabilityConfig={viewConfigRef.current}
            ListFooterComponent={_renderFooter}
          />
          
        </View>
    // </BottomSheetModalProvider>
  );
};

export default Feed;

const styles = StyleSheet.create({});
