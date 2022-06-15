import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import Reels from '../../components/Reels';
import {Loader} from '../../components/Loader';
import AxiosBase from '../../services/AxioBase';
import {useIsFocused} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

const Feed = props => {
  const navigation = props.navigation;
  const isFocused = useIsFocused();
  const feedRef = useRef();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hook, setHook] = useState(false);

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  useEffect(() => {
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
          })
          .catch(error => {
            // setLoading(false);
            console.log('error in feeds api', error.response);
          });
      } else {
        displayToast('Internet Connection Problem');
      }
    });
  }, []);

  const handleChangeIndexValue = ({index}) => {
    setCurrentIndex(index);
  };

  return (
    <SwiperFlatList
      data={feedData}
      extraData={hook}
      initialNumToRender={2}
      removeClippedSubviews={true}
      snapToAlignment="start"
      windowSize={5}
      vertical={true}
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
      decelerationRate="fast"
      // ListEmptyComponent={() => {
      //   return (
      //     <View
      //       style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      //       <Text>no data found</Text>
      //     </View>
      //   );
      // }}
    />
  );
};

export default Feed;

const styles = StyleSheet.create({});
