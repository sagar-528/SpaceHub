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

  const [hook, setHook] = useState(false);

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  useEffect(() => {
    getData();
    // setRefreshing(!refreshing)
  }, []);

  const getData = () => {
    NetInfo.fetch().then(isConnected => {
      if (isConnected.isConnected === true) {
        AxiosBase.get('app/property/videoProperty', {
          params: {
            limit: 1000000000,
            page: 0,
            isVideoPresent: true,
          },
        })
          .then(response => {
            // setLoading(true);
            // console.log('feeds response', response?.data?.data);
            setFeedData(response?.data?.data);
            // if(response?.data?.data.length>0){
            //   for(i=0;i<response?.data?.data.length;i++){
            //     // setVideoRefs(prev=>[...prev,videoRef])
            //     // setPaused(prev=>[...prev,true])
            //   }
            // }
            setLoading(false);
            // setRefreshing(!refreshing)
          })
          .catch(error => {
            setLoading(false);
            setRefreshing(false);
            // setRefreshing(!refreshing)
            console.log('error in feeds api', error.response);
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
    // const temp = [...paused]
    // paused.map((item,indx)=>{
    //   if(indx===index){
    //     temp[index] = false
    //     // setPaused(temp)
    //   }else{
    //     temp[index] = true
    //     // setPaused(temp)
    //   }
    // })
    // setPaused(temp)
  };


  // const _onViewableItemsChanged=(props)=>{
  //   console.log('_onViewableItemsChanged',props)
  //   const changed = props.changed
  //   const temp = [...paused]
  //   changed.forEach(item=>{
  //     const cell = videoRefs[item.index]
  //     console.log('cellpre',item);
  //     if(cell){
  //       if(item.isViewable){
  //         console.log('cell',cell);
  //         // cell.current.setNativeProps({ paused: false })
  //         // temp[item.index] = false
  //         // setPaused(temp)
          
  //       }else{
  //         // cell.current.setNativeProps({ paused: true })
  //         // temp[item.index] = true
  //         // setPaused(temp)
  //       }
  //     }
  //   })
  // }

  // const onViewRef = React.useRef((viewableItems)=> {
  //   if (viewableItems && viewableItems.length > 0) {
  //     setCurrentVisibleIndex(viewableItems[0].index);
  // }
  // })

  // const _onViewableItemsChanged = ({ viewableItems, changed }) => {
  //   if (viewableItems && viewableItems.length > 0) {
  //       setCurrentVisibleIndex(viewableItems[0].index);
  //   }
  // };

  // const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

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


  // console.log('resfresh',feedData);
  return (
    <View style={{flex:1}}>
      
      <SwiperFlatList
        // style={{flex:1}}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={getData} />
      }
      extraData={refreshing}
        data={feedData}
        windowSize={4}
        initialNumToRender={0}
        maxToRenderPerBatch={2}
        vertical
        removeClippedSubviews={false}
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
        refreshing={refreshing}
        // onRefresh={getData}
        // onViewableItemsChanged={onViewRef.current}
        // viewabilityConfig={viewConfigRef.current}
      />
      
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({});
