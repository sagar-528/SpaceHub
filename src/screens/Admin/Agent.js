import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {colors, typography} from '../../themes';
import {SafeAreaView} from 'react-native-safe-area-context';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import AxiosBase from '../../services/AxioBase';
import {displayToast} from '../../utils';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const Agent = props => {
  const navigation = props.navigation;
  const {Details, setPaused} = props.route.params;
  const [agentData, setAgentData] = useState([]);

  useEffect(() => {
    NetInfo.fetch().then(isConnected => {
      if (isConnected.isConnected === true) {
        AxiosBase.get('app/agents/singleAgent', {
          params: {
            id: Details._id,
          },
        })
          .then(response => {
            console.log('response for agent', response.data.data);
            setAgentData(response.data.data);
          })
          .catch(error => {
            console.log('error for api', error);
          });
      } else {
        displayToast('Internet Connection Problem');
      }
    });
  }, []);

  const handleAgent = e => {
    Linking.openURL(`mailto:${e.email}`);
  };

  function Item({item, index}) {
    // console.log('flat', item.image.length === 0);

    return (
      <View style={{margin: 4}} key={index}>
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('SingleReel', {
              item: item,
              index: index,
            });
          }}>
          <FastImage
            source={{
              uri: item.image.length === 0 ? `https://andspace.s3.ap-south-1.amazonaws.com/${item.thumbnailName}` : `https://andspace.s3.ap-south-1.amazonaws.com/${item.image[0]}`,
              priority: FastImage.priority.high,
            }}
            resizeMode="cover"
            style={{height: 180, width: windowWidth / 3 - 10}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({item, index}) => {
    return <Item item={item} index={index} />;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={{backgroundColor: '#282828', opacity: 0.95}}>
      {/* <View style={{flex: 1}} /> */}
      <View>
        <View style={{alignSelf: 'center', marginTop: 24}}>
          <Image
            source={{
              uri: `https://andspace.s3.ap-south-1.amazonaws.com/${Details.imageUrl}`,
            }}
            resizeMode="cover"
            style={{height: 100, width: 100, borderRadius: 100}}
          />
        </View>
        <Text style={styles.agent}>{Details.name}</Text>
        <View style={{marginVertical: 24}}>
          <TouchableOpacity
            style={styles.btnView}
            activeOpacity={0.8}
            onPress={() => handleAgent(agentData)}>
            <Text style={styles.btn}>Email Agent</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.title}>Our Videos</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          marginVertical: 14,
        }}>
        {agentData.videoUrls && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={agentData.videoUrls}
            renderItem={(item, index) => renderItem(item, index)}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            numColumns={3}
            columnWrapperStyle={{
              flex: 1,
            }}
            style={{marginHorizontal: 4}}
          />
        )}
      </View>
      <View
        style={{
          paddingLeft: 24,
          paddingTop: 22,
          position: 'absolute',
          right: 0,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            // setPaused(false)
          }}
          activeOpacity={0.8}
          style={{alignSelf: 'flex-end', marginEnd: 24, marginBottom: 14}}>
          <Image
            source={require('../../assets/icons/close.png')}
            resizeMode="contain"
            style={{height: 24, width: 24}}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Agent;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // paddingHorizontal: 24,
    paddingVertical: 24,
  },
  agent: {
    fontFamily: typography.secondary,
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    marginTop: 14,
    textAlign: 'center',
  },
  btnView: {
    backgroundColor: colors.darkSky,
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'center',
  },
  btn: {
    paddingVertical: 10,
    fontFamily: typography.secondary,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
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
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.text,
    marginBottom: 20,
  },
});
