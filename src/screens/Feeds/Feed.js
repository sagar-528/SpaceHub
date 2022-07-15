import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Dimensions,
  RefreshControl,
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

  const [hook, setHook] = useState(false);

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  useEffect(() => {
    getData();
    // setRefreshing(!refreshing)
  }, []);

  const getData = () => {
    console.log('PAGE',page);
    NetInfo.fetch().then(isConnected => {
      if (isConnected.isConnected === true) {
        AxiosBase.get('app/property/videoProperty', {
          params: {
            limit: 10,
            page: page,
            isVideoPresent: true,
          },
        })
          .then(response => {
            // setLoading(true);
            console.log('feeds response', response?.data?.data);
            let data = response?.data?.data
            if(data.length===0){
              // setFeedData([])
              // setPage(0)
              AxiosBase.get('app/property/videoProperty', {
                params: {
                  limit: 10,
                  page: 0,
                  isVideoPresent: true,
                },
              }).then(res=>{
                let initialDataToShowAtFirst = res?.data?.data
                console.log('initialDataToShowAtFirst',initialDataToShowAtFirst);
                setFeedData(initialDataToShowAtFirst);
              }).catch(err=>{
                setLoading(false)
                setRefreshing(false);
                console.log('error in feeds api', error.message);
              })
              // getData()
            }else{
              setFeedData(prev=>[...prev,...data]);
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
          .finally(() => {
            // setRefreshing(false);
            setRefreshing(!refreshing)
          });
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
  let  listener = EventRegister.addEventListener('getFeeds', () => {
    console.log('triggered,event');
    getData()
  })

    return () => {
      // unsubscribe event
      EventRegister.removeEventListener(listener)

    };
  }, [])

  const LoadMoreData=()=>{
    // alert('ghjgjhgjh')
    getData()
  }


  // console.log('resfresh',feedData);
  return (
    <View style={{flex:1}}>
      
      <SwiperFlatList
        // style={{flex:1}}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={getData} />
      }
      // extraData={refreshing}
        data={feedData}
        // windowSize={4}
        initialNumToRender={0}
        // maxToRenderPerBatch={2}
        vertical
        // removeClippedSubviews={false}
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
          />
        )}
        keyExtractor={(items, index) => {
          return items._id;
        }}
        decelerationRate={'normal'}
        onEndReached={LoadMoreData}
        onEndReachedThreshold={0.1}
        // refreshing={refreshing}
        // onRefresh={getData}
        // onViewableItemsChanged={onViewRef.current}
        // viewabilityConfig={viewConfigRef.current}
      />
      
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({});
