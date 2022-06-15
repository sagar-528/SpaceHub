import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {colors, typography} from '../../themes';
import Slides from '../../components/Slides';

const OnBoarding = props => {
  const navigation = props.navigation;
  const flatlistRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [viewableItems, setViewableItems] = useState([]);

  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    setViewableItems(viewableItems);
  });

  useEffect(() => {
    if (!viewableItems[0] || currentPage === viewableItems[0].index) return;
    setCurrentPage(viewableItems[0].index);
  }, [viewableItems]);

  const handleNext = () => {
    if (currentPage == Slides.length - 1) return;

    flatlistRef.current.scrollToIndex({
      animated: true,
      index: currentPage + 1,
    });
  };

  const renderFlatlistItem = ({item}) => {
    // console.log('item', item);
    return (
      <SafeAreaView>
        <View
          style={{
            width: Dimensions.get('screen').width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {item.key === '1' ? (
            <>
              <Image
                source={require('../../assets/Illustrations/mobile.png')}
                resizeMode="contain"
                style={{
                  height: 370,
                  width: 272,
                }}
              />
              <Image
                source={require('../../assets/Illustrations/upperArrow.png')}
                resizeMode="cover"
                style={{
                  height: 60,
                  width: 80,
                }}
              />
            </>
          ) : (
            <View style={{flexDirection: 'row', marginBottom: 44}}>
              <Image
                source={require('../../assets/Illustrations/mobile.png')}
                resizeMode="contain"
                style={{
                  height: 370,
                  width: 272,
                }}
              />
              <View
                style={{
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  right: 0,
                  bottom: -12,
                }}>
                <Image
                  source={require('../../assets/Illustrations/sideArrow.png')}
                  resizeMode="cover"
                  style={{
                    height: 90,
                    width: 60,
                  }}
                />
              </View>
            </View>
          )}
          <Text style={styles.title}>{item.description}</Text>
        </View>
      </SafeAreaView>
    );
  };

  const renderBottomSection = () => {
    return (
      <View>
        {currentPage != Slides.length - 1 ? (
          <View style={{marginHorizontal: 52}}>
            <TouchableOpacity
              style={styles.btnView}
              activeOpacity={0.8}
              onPress={handleNext}>
              <Text style={styles.btn}>next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{marginHorizontal: 52}}>
            <TouchableOpacity
              style={styles.btnView}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('BottomTab');
              }}>
              <Text style={styles.btn}>next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // console.log('current page', currentPage);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/Illustrations/onBoardBackground.png')}
        style={{flex: 1, backgroundColor: colors.backgroundShadow, paddingVertical: 50}}
        resizeMode="cover">
        <FlatList
          data={Slides}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.key}
          renderItem={renderFlatlistItem}
          ref={flatlistRef}
          onViewableItemsChanged={handleViewableItemsChanged.current}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 100}}
          initialNumToRender={1}
        />
        {renderBottomSection()}
      </ImageBackground>
    </View>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  mobile: {
    height: 505,
    width: 280,
    alignSelf: 'center',
  },
  title: {
    color: colors.text,
    fontFamily: typography.secondary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    width: 150,
  },
  btnView: {
    backgroundColor: colors.darkSky,
    alignItems: 'center',
    borderRadius: 8,
  },
  btn: {
    paddingVertical: 14,
    fontFamily: typography.secondary,
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
});
