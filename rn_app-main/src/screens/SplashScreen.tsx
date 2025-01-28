import {SafeAreaView, Dimensions, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useStore } from '../store/store';
import Video from 'react-native-video';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SplashScreen = (props: any) => {

  const user = useStore((state: any) => state.user);

  const signInDone = useStore((state: any) => state.signInDone);

  const addInfoDone = useStore((state: any) => state.addInfoDone);

  const offlineDataFetchDone = useStore((state: any) => state.offlineDataFetchDone);
  const toggleOfflineDataFetch = useStore((state: any) => state.toggleOfflineDataFetch);
  const gettingStartedDone = useStore((state: any) => state.gettingStartedDone);

  const authKey = useStore((state: any) => state.authKey);

  const [durationLimit, setDurationLimit] = useState(false);

  const minTimeDuration = async () => {
    const delay = () => new Promise(resolve => setTimeout(resolve, 5000));
    await delay();
    setDurationLimit(true);
  };

  const navToScreen = () => {
    if (durationLimit) {
      if (!signInDone) {
        return props.navigation.replace('SignUpScreen');
      }

      if (!addInfoDone) {
        return props.navigation.replace('AdditionalInformationScreen');
      }

      if (!offlineDataFetchDone) {
        const offlineDataFetch = async (authKey: any) => {
          toggleOfflineDataFetch();
        };
        offlineDataFetch(authKey);
        return;
      }

      if (!gettingStartedDone) {
        return props.navigation.replace('GettingStartedScreen');
      }

      props.navigation.replace('BottomTab');
    }
  };

  useEffect(() => {
    minTimeDuration();
  }, []);

  useEffect(() => {
    navToScreen();
  }, [durationLimit]);


  return (
    <SafeAreaView style={{ backgroundColor: '#0f0f0f', height: screenHeight, width: screenWidth }}>
      <StatusBar
        backgroundColor={'#0f0f0f'}
        barStyle={'light-content'}
      />

      <Video
        source={require('../assets/images/SplashScreen.mp4')}
        repeat={true}
        resizeMode='cover'
        style={{
          height: screenHeight,
          width: screenWidth
        }}
      />

    </SafeAreaView>
  );
};

export default SplashScreen;