import { StyleSheet, Text, View,Image,TouchableOpacity,Dimensions,Linking } from 'react-native'
import React,{useRef,useMemo,useCallback,useState,useEffect} from 'react'
import PagerView from 'react-native-pager-view';
import { colors, typography } from '../../themes';
import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetModal,
    BottomSheetModalProvider,
  } from '@gorhom/bottom-sheet';
import Close from '../../components/Close';
import { displayToast } from '../../utils';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image'

import MapView, {
    Marker,
    PROVIDER_GOOGLE,
    PROVIDER_DEFAULT,
  } from 'react-native-maps';

import { createThumbnail } from "react-native-create-thumbnail";
// import {
//     SharedElement,
//     createSharedElementStackNavigator,
//   } from 'react-navigation-shared-element';
import { Key } from '../../Constant/constant';


const reel_data=[
    {
        id:'1',
        image:'https://cdn.pixabay.com/photo/2019/07/26/20/52/man-4365597_1280.png'
    },
    {
        id:'2',
        image:'https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg'
    },
    {
        id:'3',
        image:'https://cdn.pixabay.com/photo/2019/07/26/20/52/man-4365597_1280.png'
    },
    {
        id:'4',
        image:'https://cdn.pixabay.com/photo/2017/03/11/11/44/man-2134881_1280.jpg'
    },
    {
        id:'5',
        image:'https://cdn.pixabay.com/photo/2016/11/29/07/16/balancing-1868051_1280.jpg'
    }

]

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

export default function More({route,navigation}) {
    const {item,agentImage,agentData,like,handleLike,handleShareVideo,parentVisible,handleDismissParentModalPress,setPause,pause,setDisable,data,setData,index} = route.params

    const bottomSheetRef = useRef(null);
    const videoRef = useRef(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [visible, setVisible] = useState(false);
    const [liked, setLiked] = useState(false)
    const [mediaFiles, setMediaFiles] = useState([])
    const [thumbnail, setThumbnail] = useState('')
    const [paused, setPaused] = useState(false)

    const snapPoints = useMemo(() => ['24%', '90%'], []);
    // const [expandVisible, setExpandVisible] = useState(true);

    const handlePresentModalPress = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const handleDismissModalPress = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    const goBackHandler=()=>{
        handleDismissModalPress()
        navigation.goBack()
        setDisable(false)
        // handleDismissModalPress()
        // handleDismissParentModalPress()

        setPause(false)
        setPaused(true) //current
    }

    const handleLikeHandler=()=>{
        // let temp = [...data]
        handleLike()
        if(Key.token!==''){

            setLiked(!liked)
        }
        // if(item.isLiked){
        //     temp[index].isLiked = false
        //     setData(temp)
        // }else{
        //     temp[index].isLiked = true
        //     setData(temp)
        // }

    }

    const onError = ({error}) => {
        // console.log('error of video', error);
        displayToast(error.localizedDescription);
    };

    useEffect(() => {
        handlePresentModalPress()
        setMediaFiles(item.image)
        // setThumbnail(`https://andspace.s3.ap-south-1.amazonaws.com/${item.image[0]}`)
        if(item.isVideoPresent){
            setMediaFiles(prev=>[item.videoUrl,...prev])
        }
        setPause(true)
    }, [])


    const [expand, setExpand] = useState(false);

    const handleAgent = e => {
        let phoneNo = `${e.countryCode}${e.phoneNumber}`;

        if (Platform.OS === 'android') {
        phoneNo = `tel:${phoneNo}`;
        } else {
        phoneNo = `telprompt:${phoneNo}`;
        }

        Linking.openURL(phoneNo);
    };

    const handleMessageAgent = e => {
        // console.log('e', e);
        // let phoneNo = `${e.countryCode}${e.phoneNumber}`;
        const operator = Platform.select({ios: '&', android: '?'});
        Linking.openURL(`sms:${e.phoneNumber}${operator}body=hi`);
    };

    const long = item?.address?.loc?.coordinates[0];
    const lat = item?.address?.loc?.coordinates[1];


    useEffect(() => {
        // const blur = navigation.addListener('blur', () => {
        //     handleDismissModalPress()
        //     console.log('Close SHEET');
        // });
  
        const focus = navigation.addListener('focus', () => {
            // videoRef.current.seek(0)
            setPaused(false)
            handlePresentModalPress()
        });
  
    return focus;
    }, [navigation]);
    console.log('pause',pause);


    useEffect(() => {
      setLiked(item.isLiked)
    }, [])


    useEffect(() => {
        if(item.isVideoPresent){
            console.log(item.videoUrl,);
            createThumbnail({
                url:`https://andspace.s3.ap-south-1.amazonaws.com/${item.videoUrl}`,
                timeStamp: 10000,
            })
                .then(response => {
                    setThumbnail(response.path)
                    console.log('thubnail path',response.path);
                    
                })
                .catch(err => console.log('ERROR==',err));
        }
    }, [])
    

  return (
      
      <View style={{flex:1,backgroundColor: 'black',}}>
            <View style={{flex:1,backgroundColor: 'black',}}>
                {/* <SharedElement id={item._id} style={{flex:1,backgroundColor: 'black',}}> */}
                <PagerView 
                    style={styles.pagerView} 
                    initialPage={0}
                    // onPageScroll={(e)=>console.log(e.nativeEvent)}
                    onPageSelected={e=>{
                        if(item.isVideoPresent && e.nativeEvent.position===0){
                            videoRef.current.seek(0)
                            setPaused(false)
                        }else{
                            setPaused(true)
                        }
                        setPageNumber(e.nativeEvent.position+1)}
                    }
                    >
                    {mediaFiles && mediaFiles.map((element,index)=>
                    <View>
                        {(item.isVideoPresent && index===0) ?
                        <Video
                            // key={index}
                            ref={videoRef}
                            // onBuffer={onBuffer}
                            playInBackground={false}
                            onVideoLoad={() => {
                            console.log('load');
                            }}
                            onError={onError}
                            repeat
                            resizeMode="cover"
                            paused={paused}
                            source={{
                            uri: `https://andspace.s3.ap-south-1.amazonaws.com/${item.videoUrl}`,
                            }}
                            // source={require('../../assets/Illustrations/space_testing.mp4')}
                            // poster={`https://andspace.s3.ap-south-1.amazonaws.com/${item.image}`}
                            // posterResizeMode="cover"
                            style={{
                            // width: windowWidth,
                            // height: windowHeight,
                            flex:1
                            // position: 'absolute',
                            }}
                            // onLoad={onLoad}
                            // onLoadStart={onLoadStart}
                            poster={thumbnail}
                            posterResizeMode='cover'
                        />
                        :
                        
                        <FastImage 
                            source={{uri:`https://andspace.s3.ap-south-1.amazonaws.com/${element}`}} 
                            style={{flex:1,height:'100%',width:'100%'}}
                        />
                        
                        }
                    </View>
                    )}
                </PagerView>
                {/* </SharedElement> */}
                {mediaFiles.length>1 &&
                <View style={{
                    position:'absolute',
                    bottom:10,
                    right:10,
                    backgroundColor:'black',
                    borderRadius:12,
                    paddingHorizontal:12,
                    paddingVertical:2
                }}>
                    <Text style={styles.pageNumber}>{pageNumber} / {mediaFiles.length}</Text>
                </View>
                }
            </View>
            <TouchableOpacity style={{
                backgroundColor:'black',
                padding:8,
                borderRadius:50,
                position:'absolute',
                right:20,
                top:20
                }}
                onPress={goBackHandler}
                >
                <Image 
                    source={require('../../assets/icons/close.png')} 
                    style={{width:24,height:24}}
                />
            </TouchableOpacity>
            <View style={{height:'24%'}}/>
            
            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                backgroundStyle={{
                backgroundColor: '#000',
                opacity: 1,
                borderRadius:0
                }}
                >
                <BottomSheetScrollView>
                    <View>
                        {expand === false ? (
                        <View style={{flexGrow: 1, paddingHorizontal: 24}}>
                            <View style={{...styles.iconContainer,paddingHorizontal:0,paddingTop:0}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('Admin', {
                                        Details: agentData,
                                        videoRef:videoRef
                                        });
                                        setPaused(true)
                                        handleDismissModalPress()
                                    }}
                                    activeOpacity={0.7}>
                                    <Image
                                        source={{
                                        uri: `https://andspace.s3.ap-south-1.amazonaws.com/${agentImage}`,
                                        }}
                                        resizeMode="contain"
                                        style={[
                                        styles.icon,
                                        {
                                            borderRadius: 50,
                                            borderWidth: 1.5,
                                            borderColor: colors.white,
                                        },
                                        ]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => handleLikeHandler()}>
                                    <Image
                                        source={
                                            !liked
                                            ? require('../../assets/icons/like.png')
                                            : require('../../assets/icons/redicon.png')
                                        }
                                        resizeMode="contain"
                                        style={styles.icon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => handleShareVideo()}>
                                    <Image
                                        source={require('../../assets/icons/share.png')}
                                        resizeMode="contain"
                                        style={styles.icon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={goBackHandler}>
                                    <Image
                                        source={require('../../assets/icons/more.png')}
                                        resizeMode="contain"
                                        style={[styles.icon, {}]}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{...styles.details}} 
                                // onPress={handlePresentModalPress}
                                >
                                <View>
                                    <Text style={styles.rate}>
                                    £{item?.price.toLocaleString()}
                                    </Text>
                                </View>
                                <Text style={[styles.buldingDetails, {paddingTop: 4}]}>
                                {(item?.beds && item.beds!==0) ? `${item?.beds} beds |` : null} {(item?.bath && item?.bath!==0) ? `${item?.bath} bath |` : null} {(item?.sqft && item.sqft!==0) ? `${item?.sqft} sqft` : null} 
                                </Text>
                                <Text style={styles.buldingDetails}>
                                    {item?.address?.road}, {item?.address?.postCode},{' '}
                                    {item?.address?.city}.
                                </Text>
                                <View
                                    activeOpacity={0.6}
                                    style={{paddingTop:12}}
                                    // onPress={handlePresentModalPress}
                                    >
                                    <Text style={{...styles.buldingDetails,color:colors.darkSky}}>
                                        Scroll for more information
                                    </Text>
                                </View>
                            </View>
                            <View style={{marginTop: 24}}>
                                <Text style={[styles.buldingDetails, {textAlign: 'left'}]}>
                                {item?.description}
                                </Text>
                            </View>
                            <View style={{marginVertical: 14}}>
                                <Text style={styles.buldingDetails}>Tenure: {item?.tenure}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    backgroundColor: 'rgba(55, 55, 55, 0.8)',
                                    borderRadius: 16,
                                    position: 'absolute',
                                    zIndex: 1,
                                    top: 8,
                                    right: 8,
                                }}
                                activeOpacity={0.6}
                                onPress={() => {
                                    setExpand(true);
                                }}>
                                <Image
                                    source={require('../../assets/icons/expand.png')}
                                    style={{height: 10, width: 10, margin: 8}}
                                    resizeMode="cover"
                                />
                                </TouchableOpacity>
                                <View style={{flex: 1}}>
                                    <MapView
                                        style={{height: 190, width: '100%', borderRadius: 16}}
                                        provider={
                                        Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                                        }
                                        initialRegion={{
                                        latitude: lat,
                                        longitude: long,
                                        latitudeDelta: 0.0421,
                                        longitudeDelta: 0.0421,
                                        }}>
                                        <Marker
                                        coordinate={{
                                            latitude: lat,
                                            longitude: long,
                                        }}
                                        />
                                    </MapView>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={{
                                marginTop: 40,
                                backgroundColor: colors.darkSky,
                                borderRadius: 12,
                                }}
                                activeOpacity={0.7}
                                onPress={() => handleMessageAgent(agentData)}>
                                <Text
                                style={[
                                    styles.price,
                                    {
                                    paddingVertical: 12,
                                    alignSelf: 'center',
                                    fontSize: 17,
                                    marginBottom: 0,
                                    },
                                ]}>
                                message agent
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                marginTop: 12,
                                marginBottom: 24,
                                backgroundColor: colors.darkSky,
                                borderRadius: 12,
                                }}
                                activeOpacity={0.7}
                                onPress={() => handleAgent(agentData)}>
                                <Text
                                style={[
                                    styles.price,
                                    {
                                    paddingVertical: 12,
                                    alignSelf: 'center',
                                    fontSize: 17,
                                    marginBottom: 0,
                                    },
                                ]}>
                                call agent
                                </Text>
                            </TouchableOpacity>
                        </View>
                        ) : (
                        <View style={{flexGrow: 1, paddingHorizontal: 24}}>
                            <View style={{flex: 1, marginVertical: 30}}>
                                <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    backgroundColor: 'rgba(55, 55, 55, 0.8)',
                                    borderRadius: 16,
                                    position: 'absolute',
                                    zIndex: 1,
                                    top: 8,
                                    right: 8,
                                }}
                                activeOpacity={0.6}
                                onPress={() => {
                                    setExpand(false);
                                }}>
                                <Image
                                    source={require('../../assets/icons/minimized.png')}
                                    style={{height: 10, width: 10, margin: 8}}
                                    resizeMode="cover"
                                />
                                </TouchableOpacity>
                                <View style={{flex: 1}}>
                                    <MapView
                                        style={{height: 550, width: '100%', borderRadius: 16}}
                                        provider={
                                        Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                                        }
                                        initialRegion={{
                                        latitude: lat,
                                        longitude: long,
                                        latitudeDelta: 0.0321,
                                        longitudeDelta: 0.0321,
                                        }}>
                                        <Marker
                                        coordinate={{
                                            latitude: lat,
                                            longitude: long,
                                        }}
                                        />
                                    </MapView>
                                </View>
                                <View
                                style={{
                                    position: 'absolute',
                                    zIndex: 1,
                                    bottom: 12,
                                    alignSelf: 'center',
                                    backgroundColor: colors.backgroundShadow,
                                    borderRadius: 12,
                                }}>
                                    <Text
                                        style={[
                                        styles.buldingDetails,
                                        {
                                            padding: 14,
                                            color: colors.white,
                                            flexShrink: 1,
                                            flexWrap: 'wrap',
                                        },
                                        ]}>
                                        {' '}
                                        {item?.address?.street}, {item?.address?.city},{' '}
                                        {item?.address?.state}, {item?.address?.country}.
                                    </Text>
                                </View>
                            </View>
                        </View>
                        )}
                    </View>
                </BottomSheetScrollView>
            </BottomSheetModal>
        </View>
    
  )
}

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
        // height:'70%'
        height:windowHeight/1.36,
        // width:'100%'
    },
    details: {
        paddingTop:16,
    },
    rate: {
        color: colors.white,
        fontSize: 24,
        fontWeight: '800',
        fontFamily: typography.ExtraBold,
    },
    buldingDetails: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
        fontFamily: typography.Bold,
    },
    icon: {
        height: 32, 
        width: 32,
        marginEnd:20
    },
    pageNumber:{
        color:colors.white,
        fontFamily:typography.Bold
    },
    iconContainer:{
        flexDirection:'row',
        alignItems:'center',
        // paddingHorizontal:20,
        // paddingTop:24
    },

    modalRoot: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    // details: {
    //     flex: 1,
    // },
    rate: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '800',
        fontFamily: typography.ExtraBold,
    },
    buldingDetails: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
        fontFamily: typography.Bold,
    },
    mapView: {
        height: 190,
        width: '100%',
    },
    title: {
        fontSize: 24,
        color: colors.white,
        fontFamily: typography.Bold,
        marginBottom: 16,
        fontWeight: '700',
    },
    price: {
        fontSize: 24,
        color: colors.white,
        fontFamily: typography.Bold,
        marginBottom: 16,
        fontWeight: '700',
    },
    expandMap: {
        height: 570,
        width: '100%',
    },
    // icon: {
    //     height: 28, width: 28
    // },
    likes: {
        alignSelf: 'center',
        color: colors.white,
        marginTop: 2,
    },
    
})