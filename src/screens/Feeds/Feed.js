import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Dimensions,
} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import Reels from '../../components/Reels';
import {Loader} from '../../components/Loader';
import AxiosBase from '../../services/AxioBase';
import {useIsFocused} from '@react-navigation/native';
import Video from 'react-native-video';
import NetInfo from '@react-native-community/netinfo';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Feed = props => {
  const navigation = props.navigation;
  const isFocused = useIsFocused();
  const videoRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  const [hook, setHook] = useState(false);

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  useEffect(() => {
    getData();
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
            console.log('feeds response', response?.data?.data);
            setFeedData(response?.data?.data);
            // setLoading(false);
            setRefreshing(false)
          })
          .catch(error => {
            // setLoading(false);
            setRefreshing(false);
            console.log('error in feeds api', error.response);
          })
          .finally(() => {
            setRefreshing(false);
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


  console.log('resfresh', refreshing);
  return (
    <SwiperFlatList
      data={feedData}
      windowSize={4}
      initialNumToRender={0}
      maxToRenderPerBatch={2}
      vertical
      removeClippedSubviews
      onChangeIndex={handleChangeIndexValue}
      renderItem={({item, index}) => (
        <Reels
          item={item}
          index={index}
          currentIndex={currentIndex}
          navigation={navigation}
          setHook={setHook}
          hook={hook}
        />
      )}
      keyExtractor={(items, index) => {
        return items._id;
      }}
      decelerationRate={'normal'}
      refreshing={refreshing}
      onRefresh={getData}
    />
  );
};

export default Feed;

const styles = StyleSheet.create({});
