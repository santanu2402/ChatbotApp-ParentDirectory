import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import AccountScreen from './src/screens/AccountScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CastDetailsScreen from './src/screens/CastDetailsScreen';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import NowPlayingScreen from './src/screens/NowPlayingScreen';
import PopularScreen from './src/screens/PopularScreen';
import RecommendedScreen from './src/screens/RecommendedScreen';
import TrendingScreen from './src/screens/TrendingScreen';
import VideoScreen from './src/screens/VideoScreen';
import AdditionalInformationScreen from './src/screens/AdditionalInformationScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import GettingStartedScreen from './src/screens/GettingStartedScreen';
import SuccessErrorScreen from './src/screens/SuccessErrorScreen';
import UpdateAccountScreen from './src/screens/UpdateAccountScreen';
import TopRatedScreen from './src/screens/TopRatedScreen';
import UpcomingScreen from './src/screens/UpcomingScreen';
import BackgroundFetch from "react-native-background-fetch";
import { fetchTrendingMovies, fetchUpcomingMovies } from './src/data/api/tmdbApiFetch';
import { useStore } from './src/store/store';
import { imageBaseUrl } from './src/constants';
import axios from 'axios';
import notifee, { AndroidStyle } from '@notifee/react-native';
import { postnotification, searchnotification } from './src/data/onlinedb/expressApi';
import {serverLink} from './src/constants'

let upcomingMovie: Movie;
let trendingMovie: Movie;
const Stack = createNativeStackNavigator();
const config = {
  screens: {
    MovieDetailsScreen: {
      path: "movie/:movieId/:movieTitle",
      parse: {
        movieId: (id: string) => id,
        movieTitle: (title: string) => title
      },
      stringify: {
        movieId: (id: string) => id,
        movieTitle: (title: string) => title
      }
    }
  }
};


interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const App = (): React.JSX.Element => {
  LogBox.ignoreLogs(['new NativeEventEmitter']);

  const pushNotification = useStore((state: any) => state.pushNotification);
  const authKey = useStore((state: any) => state.authKey);
  const setrcmndLink = useStore((state: any) => state.setrcmndLink);
  const setchatlink = useStore((state: any) => state.setchatlink);
  const fetchTrendingMoviesCaller = async () => {
    try {
      const response = await fetchTrendingMovies(1);
      if (response.data) {
        trendingMovie = response.data.results[0];
      }
    } catch (error) {
      console.log('Error fetching movies:', error);
    }
  }

  const fetchUpcomingCaller = async () => {
    try {
      const response = await fetchUpcomingMovies(1);
      if (response.data) {
        upcomingMovie = response.data.results[0];
      }
    } catch (error) {
      console.log('Error fetching movies:', error);
    }
  }

useEffect(()=>{
  const fetchChatbotLink = async () => {
    try {
      const response = await axios.get(`${serverLink}/cinepulse/api/user/app/chatbot/link`);
      const response2 = await axios.get(`${serverLink}/cinepulse/api/user/app/recommendation/link`);
      setchatlink(response.data.link.link);
      setrcmndLink(response2.data.link.link)
    } catch (err) {
      console.log("")
    }
  };

  fetchChatbotLink();

},[])

  async function onDisplayNotification(title: string, body: string, url: string) {
    await notifee.requestPermission()
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
        style: { type: AndroidStyle.BIGPICTURE, picture: url },
      },
    });
  }

  useEffect(() => {
    const initBackgroundFetch = async () => {
      const onEvent = async (taskId: any) => {
        console.log('[BackgroundFetch] task: ', taskId);
        BackgroundFetch.finish(taskId);
      }

      const onTimeout = async (taskId: any) => {
        console.log('[BackgroundFetch] TIMEOUT task: ', taskId);
        BackgroundFetch.finish(taskId);
      }

      let status = await BackgroundFetch.configure({ minimumFetchInterval: 15 }, onEvent, onTimeout);
      console.log('[BackgroundFetch] configure status: ', status);
      await Promise.all([
        fetchTrendingMoviesCaller(),
        fetchUpcomingCaller(),
      ]);

      if (upcomingMovie && trendingMovie) {
        const upcomingMovieData = {
          movieId: upcomingMovie.id.toString(),
          movieTitle: upcomingMovie.title,
          movieGroup: 'upcoming',
          imageUrl: `${imageBaseUrl}${upcomingMovie.poster_path}`
        };

        const trendingMovieData = {
          movieId: trendingMovie.id.toString(),
          movieTitle: trendingMovie.title,
          movieGroup: 'trending',
          imageUrl: `${imageBaseUrl}${trendingMovie.poster_path}`
        };
        const isMovieExists = async (movieId: any, movieGroup: any) => {
          if (authKey) {
            console.log(movieId, movieGroup, authKey)
            const response = await searchnotification(movieId, movieGroup, authKey)
            if (response.success) {
              if (response.message === 'found') {
                return true;
              }
              else {
                return false;
              }
            } else {
              return false;
            }
          }
        };

        let counter = 0;

        function runNotifications() {
          if (counter % 2 != 0) {
            if (!isMovieExists(upcomingMovieData.movieId, upcomingMovieData.movieGroup)) {
              postnotification(upcomingMovieData.movieId.toString(), upcomingMovieData.movieTitle, upcomingMovieData.movieGroup, upcomingMovieData.imageUrl, authKey)
              onDisplayNotification('Get Ready for a Cinematic Spectacle!', ` Get ready for ${upcomingMovieData.movieTitle}! Open CinePulse to explore this epic cinematic masterpiece!`, upcomingMovieData.imageUrl);
            }
          } else {
            if (!isMovieExists(trendingMovieData.movieId, trendingMovieData.movieGroup)) {
              postnotification(trendingMovieData.movieId.toString(), trendingMovieData.movieTitle, trendingMovieData.movieGroup, trendingMovieData.imageUrl, authKey)
              onDisplayNotification('Dive into a Trending Cinematic Spectacle!', `${trendingMovieData.movieTitle}" is already trending! Open CinePulse now to catch all the details and experience the excitement!`, trendingMovieData.imageUrl);
            }
          }
          counter = (counter + 1) % 10;
        }
        if (pushNotification) {
          runNotifications();
        }
      }
    };

    initBackgroundFetch();

    return () => {
      BackgroundFetch.stop();
    };
  }, []);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer linking={{ prefixes: ["cinepulse://app"], config }}>
          <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>

            <Stack.Screen
              name='SplashScreen'
              component={SplashScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='BottomTab'
              component={BottomTabNavigator}
              options={{ animation: 'fade' }}
            ></Stack.Screen>

            <Stack.Screen
              name='AccountScreen'
              component={AccountScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='SettingsScreen'
              component={SettingsScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='CastDetailsScreen'
              component={CastDetailsScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='MovieDetailsScreen'
              component={MovieDetailsScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='NowPlayingScreen'
              component={NowPlayingScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='RecommendedScreen'
              component={RecommendedScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='PopularScreen'
              component={PopularScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='TopRatedScreen'
              component={TopRatedScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='TrendingScreen'
              component={TrendingScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='UpcomingScreen'
              component={UpcomingScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='VideoScreen'
              component={VideoScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='AdditionalInformationScreen'
              component={AdditionalInformationScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='ChangePasswordScreen'
              component={ChangePasswordScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='ForgotPasswordScreen'
              component={ForgotPasswordScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='SignInScreen'
              component={SignInScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='SignUpScreen'
              component={SignUpScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='GettingStartedScreen'
              component={GettingStartedScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='UpdateAccountScreen'
              component={UpdateAccountScreen}
              options={{ animation: 'fade_from_bottom' }}
            ></Stack.Screen>

            <Stack.Screen
              name='SuccessErrorScreen'
              component={SuccessErrorScreen}
              options={{ animation: 'fade' }}
            ></Stack.Screen>

          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;