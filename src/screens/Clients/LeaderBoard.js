import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CrossIconSvg from '../../assets/svgs/crossIconSvg';
import {colors, typography} from '../../themes';
import Switch from 'react-native-switch-pro';
import {load, save} from '../../utils/storage';
import {useIsFocused} from '@react-navigation/native';
import AxiosBase from '../../services/AxioBase';

const LeaderBoard = props => {
  const navigation = props.navigation;
  const isFocused = useIsFocused();

  const [gameMode, setGameMode] = useState(false);
  const [leadeBoardData, setLeadeBoardData] = useState([]);

  useEffect(() => {
    load('Game_Mode')
      .then(res => {
        console.log('async response', res);
        if (res !== null) {
          setGameMode(res);
        }
      })
      .catch(error => {
        console.log('async error', error);
      });
  }, [isFocused]);

  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
    AxiosBase.get('app/property/score')
      .then(response => {
        console.log('response from game', response.data.data);
        // setLeadeBoardData(response.data?.data);
        setLeadeBoardData(response.data.data);
      })
      .catch(error => {
        console.log('error in api', error);
      });
    })
    
    return focus

  }, [navigation]);

  function renderItem({item, index}) {
    return (
      <View
        style={{
          minHeight: 52,
          borderWidth: 1,
          borderColor: 'grey',
          borderRadius: 8,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            // justifyContent: 'space-around'
          }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={[styles.flattxt, {marginEnd: 10}]}>1</Text>
            <Text style={styles.flattxt}>{item.user.name}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../assets/icons/coin.png')}
              resizeMode="contain"
              style={{height: 24, width: 24, marginEnd: 10}}
            />
            <Text style={styles.flattxt}>{item.score}</Text>
          </View>
        </View>
      </View>
    );
  }

  console.log('====================================');
  console.log('leader', leadeBoardData);
  console.log('====================================');
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{backgroundColor: '#282828', opacity: 0.95}}>
      <View style={{marginTop: 47, flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={0.8}
          style={{alignSelf: 'flex-end', marginEnd: 24, marginBottom: 14}}>
          <CrossIconSvg width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.title}>GAME MODE</Text>
        <View style={styles.switchView}>
          <Text style={styles.switchTxt}>Switch On Pricing Mode</Text>
          <Switch
            circleStyle={{}}
            style={{}}
            value={gameMode}
            width={64}
            height={34}
            circleColorActive={colors.white}
            circleColorInactive={colors.white}
            backgroundActive={'skyblue'}
            backgroundInactive="#F2F2F2"
            onSyncPress={value => {
              setGameMode(value);
              save('Game_Mode', value);
            }}
          />
        </View>
        <Text style={[styles.switchTxt, {paddingStart: 24}]}>World stats</Text>
        <FlatList
          data={leadeBoardData}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          ItemSeparatorComponent={() => {
            return <View style={{marginBottom: 20}} />;
          }}
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingVertical: 24,
          }}
        />
      </View>
    </ScrollView>
  );
};

export default LeaderBoard;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: typography.secondary,
    fontWeight: '600',
    color: colors.white,
    paddingStart: 24,
    // marginBottom: 14,
  },
  switchTxt: {
    fontFamily: typography.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19,
    color: colors.white,
  },
  switchView: {
    marginVertical: 34,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flattxt: {
    fontFamily: typography.primary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
    color: colors.white,
  },
});
