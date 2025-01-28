import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback, useEffect } from "react";
import { getYoutubeVideos } from '../data/api/othersApiFetch';
import YoutubePlayer from "react-native-youtube-iframe";
import { useStore } from '../store/store';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY } from '../theme/theme';
import NetInfo from '@react-native-community/netinfo';
import OfflineScreen from '../components/OfflineScreen';
import LoadingScreen from '../components/LoadingScreen';
import LottieView from 'lottie-react-native';

interface YouTubeVideoItem {
  id: {
    videoId: string;
  };
}
interface VideoDetail {
  videoId: string;
}


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const VideoScreen = (props: any) => {

  const movieId = props.route.params.movieId;
  const movieTitle = props.route.params.movieTitle;

  const isDarkMode = useStore((state: any) => state.isDarkMode);
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [loading, setLoading] = useState(false)

  const [youtubeResponse, setYoutubeResponse] = useState<VideoDetail[]>([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          getVideoCaller(),
        ]);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [props.route.params.query]);

  const getVideoCaller = async () => {
    try {
      const response = await getYoutubeVideos(props.route.params.query);
      const videoItems: VideoDetail[] = response.data.items.map((item: YouTubeVideoItem) => ({
        videoId: item.id.videoId,
      }));

      setYoutubeResponse(videoItems);
      console.log(youtubeResponse);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const onStateChange = useCallback((state: any) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    NetInfo.fetch().then((state) => {
      setConnectionStatus(state.isInternetReachable ?? false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleConnectivityChange = (state: any) => {
    setConnectionStatus(state.isConnected);
  };


  return (
    <>
      {!connectionStatus ? (
        <OfflineScreen />
      ) : loading ? (
        <LoadingScreen Message="Video Loading" />
      ) : youtubeResponse ? (

        <SafeAreaView style={isDarkMode ? styles.DarkVideoScreenContainer : styles.LightVideoScreenContainer}>
          <StatusBar
            backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />
          <HeaderBar title={movieTitle} isDark={isDarkMode} props={props} />

          <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_bold, fontSize: 25, textAlign: 'center' }}>Video Results</Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
            margin:5,
            flexGrow: 1,
          }}>

            {youtubeResponse.map((video) => (

              <View style={{borderRadius:25}}>
                <YoutubePlayer
                  key={video.videoId}
                  width={screenWidth}
                  height={screenHeight*0.3}
                  play={playing}
                  videoId={video.videoId}
                  onChangeState={onStateChange}
                />
              </View>

            ))}

          </ScrollView>
        </SafeAreaView>
      ) : (
        <View style={{ alignItems: 'center' }}>
          <LottieView
            style={{ height: screenHeight * 1, width: screenWidth * 1 }}
            source={require('../lottie/video-data-not-available.json')} autoPlay loop
          />
        </View>
      )
      }
    </>

  )
}

const styles = StyleSheet.create({
  DarkVideoScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
  }, LightVideoScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  }

})
export default VideoScreen
