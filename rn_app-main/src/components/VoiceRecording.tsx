import { Dimensions, SafeAreaView, Text, View } from 'react-native'
import React from 'react'
import { useStore } from '../store/store';
import { COLORS } from '../theme/theme';
import LottieView from 'lottie-react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export default function VoiceRecording() {
    const isDarkMode = useStore((state: any) => state.isDarkMode);
  return (
    <SafeAreaView style={{width:screenWidth,height:screenHeight,backgroundColor:isDarkMode?COLORS.darkBackground:COLORS.lightBackground,justifyContent:'center',alignItems:'center'}}>
       <LottieView style={{width:screenWidth,height:screenWidth}} source={ require('../lottie/voice-recording-on.json')} autoPlay loop />
    </SafeAreaView>
  )
}