import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {colors, typography} from '../../themes';
import AxiosBase from '../../services/AxioBase';
import {Loader} from '../../components/Loader';
// import Video from 'react-native-video';
import {displayToast} from '../../utils';
import NetInfo from '@react-native-community/netinfo';
import FastImage from 'react-native-fast-image'
import { useIsFocused,useRoute } from '@react-navigation/native';
import CrossIconSvg from '../../assets/svgs/crossIconSvg';
import RedLikeSvg from '../../assets/svgs/redLikeSvg';
// import {Key} from '../../Constant/constant';
import { EventRegister } from 'react-native-event-listeners'


const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const LikeVideos = props => {
  const navigation = props.navigation;

  const [likeVideoData, setLikeVideoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const route = useRoute()


  const videoRef = useRef(null);

  useEffect(() => {
    NetInfo.fetch().then(isConnected => {
      if (isConnected.isConnected === true) {
        AxiosBase.get('app/user/likedListings')
          .then(response => {
            setLoading(true);
            console.log('feeds response like', response?.data?.data);
            setLikeVideoData(response?.data?.data);
            setLoading(false);
          })
          .catch(error => {
            setLoading(false);
            console.log('error in feeds api', error.response);
          });
      } else {
        displayToast('Internet Connection Problem');
      }
    });
  }, [isFocused]);

  // useEffect(() => {
    
  //   const blur = navigation.addListener('blur', () => {
  //     // let nav = navigation.getState()
  //     // console.log('NAV',nav);
  //     console.log('ROUTE',route);
  //       navigation.goBack()
  //   });

  // return blur ;
  // }, [navigation]);

  function Item({item, index}) {
    const handleDisLike = (item, index) => {
      // console.log('item', item);
      AxiosBase.put(`app/user/likedVideos?propertyId=${item._id}&flag=${false}`)
        .then(response => {
          console.log('remove from like screen', response?.data?.data);
          let data = likeVideoData.filter((item, idx) => idx !== index);
          setLikeVideoData(data);
          
          EventRegister.emit('updateFeeds',item._id)
        })
        .catch(error => {
          console.log('error', error.response.data);
        });
    };

    return (
      <View style={{
          margin:4,
          // flex:1
          }} 
          key={index}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            position: 'absolute',
            zIndex: 1,
            bottom: 2,
            flex: 1,
            right: 8,
          }}
          onPress={() => handleDisLike(item, index)}>
          {/* <Image
            source={require('../../assets/icons/redicon.png')}
            // resizeMode="contain"
            style={styles.icon}
          /> */}
          <RedLikeSvg/>
        </TouchableOpacity>
        <TouchableOpacity
          // style={{margin: 6,}}
          key={index}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('SingleReel', {
              item: item,
              index: index,
              // navigation: navigation,
            });
          }}>
            {item.isVideoPresent ?
              <FastImage
                source={{
                  uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item.thumbnailName}`,
                  priority: FastImage.priority.high
                }}
                resizeMode="cover"
                style={{height: 180, width:(windowWidth/3)-10}}
              />
              :
              <FastImage
                source={{
                  uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item.image[0]}`,
                  priority: FastImage.priority.high
                }}
                resizeMode="cover"
                style={{height: 180, width:(windowWidth/3)-10}}
              />
            }
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({item, index}) => {
    return <Item item={item} index={index} />;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{backgroundColor: colors.backgroundShadow, opacity: 0.95}}>
      <Loader visible={loading} />
      <View style={{marginTop: 47, flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={0.8}
          style={{alignSelf: 'flex-end', marginEnd: 24, marginBottom: 14}}>
          {/* <Image
            source={require('../../assets/icons/close.png')}
            // resizeMode="contain"
            style={{height: 24, width: 24}}
          /> */}
          <CrossIconSvg width={24} height={24}/>
        </TouchableOpacity>
        <View style={styles.divider} />
        <Text style={styles.title}>Liked Videos</Text>
        <View
          style={{
            flex: 1,
            marginVertical: 10,
          }}>
          <FlatList
            data={likeVideoData}
            renderItem={(item, index) => renderItem(item, index)}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            numColumns={3}
            columnWrapperStyle={{
              flex: 1,
              // marginBottom: 4,
            }}
            style={{marginHorizontal:4}}
            // columnWrapperStyle={{justifyContent:'space-between'}}
            // style={{marginHorizontal:4,flex:1}}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default LikeVideos;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: colors.backgroundShadow,
    // opacity: 0.95,
    // paddingVertical: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.text,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontFamily: typography.secondary,
    fontWeight: '400',
    color: colors.white,
    paddingStart: 24,
    marginBottom: 14,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  icon: {width: 24, length: 24},
});
