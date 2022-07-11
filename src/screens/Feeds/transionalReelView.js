import { StyleSheet, Text, View,Image,Animated,TouchableOpacity } from 'react-native'
import React,{useEffect,useRef} from 'react'

// import {
//     SharedElement,
//     SharedElementTransition,
//     nodeFromRef,
    
//   } from 'react-native-shared-element';
import {
    SharedElement,
    createSharedElementStackNavigator,
  } from 'react-navigation-shared-element';

export default function TransionalReelView({route,navigation}) {
    // Scene 1
    let startAncestor;
    let startNode;

    let endAncestor;
    let endNode;

    const {reel} = route.params

    const position = new Animated.Value(0);

    console.log('REEL-ID',reel._id);
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          delay: 500,
          useNativeDriver: true,
        }).start();
      }, []);

    const goBackHandler=()=>{
        navigation.goBack()
    }
  return (
    <>
        <SharedElement id={reel._id}>
            <Image 
                style={styles.image1} 
                source={require('../../assets/Illustrations/profile1.jpeg')} 
            />
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
        </SharedElement>
    </>
  )
}

const styles = StyleSheet.create({
    image1:{
        width:'100%',
        height:200,
    },
    image2:{
        width:'100%',
        height:400,
        // flex:1
    }
})