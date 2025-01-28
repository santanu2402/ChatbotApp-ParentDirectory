import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { Dimensions } from 'react-native';
import { COLORS, FONTFAMILY } from '../theme/theme';
import { useStore } from '../store/store';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const OfflineScreen = () => {
  const isDarkMode=useStore((state:any)=>state.isDarkMode);

  return (
    <View style={isDarkMode ? styles.dark_offline_parent_container : styles.light_offline_parent_container}>
      <StatusBar
        backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <Text style={isDarkMode ? styles.dark_offline_screen_Upper_Text : styles.light_offline_screen_Upper_Text}>No Internet Connection</Text>


      <View style={styles.lottie_ofline_animation_container}>
        <LottieView style={styles.lottie_ofline_animation} source={require('../lottie/offlinelottieanimation.json')} autoPlay loop />
      </View>

      <Text style={isDarkMode ? styles.dark_offline_screen_middle_Text:styles.light_offline_screen_middle_Text}>You Are Offline</Text>

      {/* <Text style={isDarkMode ? styles.dark_offline_screen_bottom_Text:styles.light_offline_screen_bottom_Text}>Still You Can View Your Saved List</Text> */}

    </View>
  )
}


const styles = StyleSheet.create({

  dark_offline_parent_container: {
    height: screenHeight,
    backgroundColor: COLORS.darkBackground
  },
  light_offline_parent_container: {
    height: screenHeight,
    backgroundColor: COLORS.lightBackground
  },
  dark_offline_screen_Upper_Text: {
    color: COLORS.secondaryDarkYellow,
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_extrabold,
    fontSize: 30,
    marginTop: screenHeight * 0.05,
    marginBottom: screenHeight * 0.08,
  },
  light_offline_screen_Upper_Text: {
    color: COLORS.primaryDarkOrange,
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_extrabold,
    fontSize: 30,
    marginTop: screenHeight * 0.05,
    marginBottom: screenHeight * 0.08,
  },

  lottie_ofline_animation_container: {
    alignItems: 'center',     // Center horizontally
  },

  lottie_ofline_animation: {
    height: screenHeight * 0.5,
    width: screenWidth * 1.5
  },
  dark_offline_screen_middle_Text: {
    color: COLORS.secondaryDarkYellow,
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_extrabold,
    fontSize: 30,
  },
  light_offline_screen_middle_Text: {
    color: COLORS.primaryDarkOrange,
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_extrabold,
    fontSize: 30,
  },
  dark_offline_screen_bottom_Text: {
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.lightText2,
    fontSize: 18,
    marginTop: screenHeight * 0.043,
  },
  light_offline_screen_bottom_Text: {
    textAlign: 'center',
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.darkText2,
    fontSize: 18,
    marginTop: screenHeight * 0.043,
  }
})


export default OfflineScreen