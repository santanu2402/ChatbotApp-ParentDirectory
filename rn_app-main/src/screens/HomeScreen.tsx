import { LogBox, StyleSheet, StatusBar, ScrollView, View, Text, SafeAreaView, Platform, TouchableOpacity, PermissionsAndroid, Dimensions, TouchableWithoutFeedback, Image } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Carousel, { AdditionalParallaxProps, ParallaxImage } from 'react-native-snap-carousel';
import { imageBaseUrl } from '../constants'
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import { StarIcon } from 'react-native-heroicons/solid'
import { useStore } from '../store/store';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY } from '../theme/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { fetchMovieDetails, fetchNowShowingMovies, fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../data/api/tmdbApiFetch';
import OfflineScreen from '../components/OfflineScreen';
import ShimmerLoaderHome from '../components/ShimmerLoaderHome';
import NetInfo from '@react-native-community/netinfo';
import { recomendcaller } from '../data/api/othersApiFetch';
import axios from 'axios';
import { serverLink } from '../constants';

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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HomeScreen = (props: any) => {

  interface UserRecentlyViewedItem {
    __v: number;
    _id: string;
    createdAt: string;
    movieId: string;
    movieTitle: string;
    user: string;
  }
  interface RcmndItem {
    results: any[];
    total_pages: number;
    total_results: number;
  }
  LogBox.ignoreLogs(['new NativeEventEmitter']);

  const tabBarHeight = useBottomTabBarHeight();
  const carouselRef = useRef(null);

  const renderItem = ({ item }: { item: any }, parallaxProps?: AdditionalParallaxProps) => {
    return (
      <TouchableOpacity onPress={() => { props.navigation.push('MovieDetailsScreen', { movieId: item.id, movieTitle: item.title }) }}>
        <View style={styles.item}>
          <ParallaxImage
            source={
              item.backdrop_path
                ? { uri: `${imageBaseUrl}${item.backdrop_path}` }
                : require('../assets/images/default-movie-background.jpg')
            }
            containerStyle={styles.imageContainer}
            style={styles.image}
            parallaxFactor={0.4}
            {...parallaxProps}
          />

          <Text style={isDarkMode ? { color: COLORS.lightText2, marginLeft: 20, fontFamily: FONTFAMILY.poppins_medium, fontSize: 14 } : { color: COLORS.darkText2, marginLeft: 20, fontFamily: FONTFAMILY.poppins_medium, fontSize: 14 }} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={isDarkMode ? { color: COLORS.lightText2, marginLeft: 20, fontFamily: FONTFAMILY.poppins_medium, fontSize: 12 } : { color: COLORS.darkText2, marginLeft: 20, fontFamily: FONTFAMILY.poppins_medium, fontSize: 12 }} numberOfLines={1}>
              {new Date(item.release_date).getFullYear().toString()}
            </Text>
            {item.vote_average != null && (
              <Text
                style={
                  isDarkMode
                    ? {
                      color: COLORS.lightText2,
                      marginLeft: 20,
                      fontFamily: FONTFAMILY.poppins_medium,
                      fontSize: 12,
                    }
                    : {
                      color: COLORS.darkText2,
                      marginLeft: 20,
                      fontFamily: FONTFAMILY.poppins_medium,
                      fontSize: 12,
                    }
                }
                numberOfLines={1}
              >
                {item.vote_average.toFixed(1)}
                <StarIcon fill={'#D4AF37'} size={12} />
              </Text>
            )}
          </View>

        </View>

      </TouchableOpacity>
    );
  };

  const userOfflineImageList = useStore((state: any) => state.userOfflineImageList);
  const homeImageDownloadDone = useStore((state: any) => state.homeImageDownloadDone);
  const toggleHomeImageDownloadDone = useStore((state: any) => state.toggleHomeImageDownloadDone);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Downloader App Storage Permission',
          message:
            'Downloader App needs access to your storage ' +
            'so you can download files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      for (const imageData of userOfflineImageList) {
        const pictureId = imageData.pictureId || "";
        await downloadImage(imageData.url, pictureId);
      }
      toggleHomeImageDownloadDone()
    } catch (err) {
      console.warn(err);
    }
  };

  const downloadImage = (imageUrl: string, pictureId: string): Promise<string> => {
    const imagePath = `${RNFS.DocumentDirectoryPath}/${pictureId}`;

    return new Promise((resolve, reject) => {
      RNFetchBlob.config({
        path: imagePath,
      })
        .fetch('GET', imageUrl)
        .then((res) => {
          resolve(res.path());
        })
        .catch((error) => {
          console.log('Error downloading image:', error);
          reject(error);
        });
    });
  };
  useEffect(() => {
    if (!homeImageDownloadDone) requestStoragePermission()
  }, []);

  const isDarkMode = useStore((state: any) => state.isDarkMode);
  const user = useStore((state: any) => state.user);
  const adult = useStore((state: any) => state.adult);
  const setAdult = useStore((state: any) => state.setAdult);
  const userRecentlyViewed = useStore((state: any) => state.userRecentlyViewed);
  const rcmndLink = useStore((state: any) => state.rcmndLink);
  
  const setrcmndLink = useStore((state: any) => state.setrcmndLink);
  const setchatlink = useStore((state: any) => state.setchatlink);

  const [popularMovies, setpopularMovies] = useState<any[]>([]);
  const [trendingMovies, setTrendinMovies] = useState<any[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<any[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<any[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<any[]>([]);
  // const [recommendedMovies, setRecommendedMovies] = useState<any>({});
  const [recommendedMovies, setRecommendedMovies] = useState<RcmndItem>({ results: [], total_pages: 0, total_results: 0 });


  const [connectionStatus, setConnectionStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  const [sortedRecentlyViewed, setSortedRecentlyViewed] = useState([...userRecentlyViewed].sort((a: UserRecentlyViewedItem, b: UserRecentlyViewedItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
  function filterAndSortMovies(movieList: Movie[], IsAdult: boolean, genrePref: string[], langPref: string[]): Movie[] {
    let filteredMovies = IsAdult ? movieList : movieList.filter(movie => !movie.adult);
    filteredMovies.sort((a, b) => {
      const genreAScore = a.genre_ids.filter(id => genrePref.includes(id.toString())).length;
      const genreBScore = b.genre_ids.filter(id => genrePref.includes(id.toString())).length;
      const langAScore = langPref.includes(a.original_language) ? 1 : 0;
      const langBScore = langPref.includes(b.original_language) ? 1 : 0;
      const scoreComparison = (genreBScore + langBScore) - (genreAScore + langAScore);
      if (scoreComparison !== 0) {
        return scoreComparison;
      } else {
        return b.popularity - a.popularity;
      }
    });
    return filteredMovies;
  }

  const fetchPopularMoviesCaller = async () => {
    try {
      const response = await fetchPopularMovies(1);
      if (response.data) {
        setpopularMovies(filterAndSortMovies(response.data.results, adult, user.genrePref, user.langPref));
      }
    } catch (error) {
      console.log('Error fetching movies:', error);
    }
  }

  const fetchTrendingMoviesCaller = async () => {
    try {
      const response = await fetchTrendingMovies(1);
      if (response.data) {
        setTrendinMovies(filterAndSortMovies(response.data.results, adult, user.genrePref, user.langPref));
      }
    } catch (error) {
      console.log('Error fetching movies:', error);
    }
  }

  const fetchTopRatedCaller = async () => {
    try {
      const response = await fetchTopRatedMovies(1);
      if (response.data) {
        setTopRatedMovies(filterAndSortMovies(response.data.results, adult, user.genrePref, user.langPref));
      }
    } catch (error) {
      console.log('Error fetching movies:', error);
    }
  }

  const fetchUpcomingCaller = async () => {
    try {
      const response = await fetchUpcomingMovies(1);
      if (response.data) {
        setUpcomingMovies(filterAndSortMovies(response.data.results, adult, user.genrePref, user.langPref));
      }
    } catch (error) {
      console.log('Error fetching movies:', error);
    }
  }

  const fetchNowPlayingCaller = async () => {
    try {
      const response = await fetchNowShowingMovies(1);
      if (response.data) {
        setNowPlayingMovies(filterAndSortMovies(response.data.results, adult, user.genrePref, user.langPref));
      }
    } catch (error) {
      console.log('Error fetching movies:', error);
    }
  }

  const fetchRecommendedMovies = async () => {
    try {
      const transformedMovies = sortedRecentlyViewed.map(movie => ({
        id: movie.movieId,
        title: movie.movieTitle
      }));
      console.log('called from home rcmnd')
      const response: RcmndItem = await recomendcaller(transformedMovies, user.genrePref, user.langPref, 1,rcmndLink);
      const updatedResults = await Promise.all(response.results.map(async (movie: any) => {
        const { id } = movie;
        const movieDetails = (await fetchMovieDetails(id)).data;
        return {
          ...movie,
          ...movieDetails
        };
      }));
      setRecommendedMovies({
        ...response,
        results: updatedResults
      });
    } catch (error) {
      console.log('Error fetching recommended movies:', error);
    }
  };

    // const fetchChatbotLink = async () => {
    //   try {
    //     const response = await axios.get(`${serverLink}/cinepulse/api/user/app/chatbot/link`);
    //     const response2 = await axios.get(`${serverLink}/cinepulse/api/user/app/recommendation/link`);
    //     setchatlink(response.data.link.link);
    //     setrcmndLink(response2.data.link.link)
    //   } catch (err) {
    //     console.log("")
    //   }finally{
    //     fetchRecommendedMovies()
    //   }
    // };



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchPopularMoviesCaller(),
          fetchTrendingMoviesCaller(),
          fetchTopRatedCaller(),
          fetchUpcomingCaller(),
          fetchNowPlayingCaller(),
          // fetchChatbotLink()
          fetchRecommendedMovies()

        ]);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    setAdult(user.dateOfBirth);
    fetchData();
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
        <ShimmerLoaderHome />
      ) : (
        <SafeAreaView style={isDarkMode ? styles.DarkHomeScreenContainer : styles.LightHomeScreenContainer}>
          <StatusBar
            backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />
          <HeaderBar title={'Home'} isDark={isDarkMode} props={props} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: tabBarHeight
          }}>

            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={isDarkMode ? styles.darkhomeheading : styles.lighthomeheading}>Popular</Text>
                <TouchableOpacity onPress={() => { props.navigation.push('PopularScreen') }}>
                  <Text style={isDarkMode ? { color: COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 } : { color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 }}>More&gt;</Text>
                </TouchableOpacity>
              </View>
              {
                popularMovies ?
                  (
                    <View style={styles.container}>
                      <Carousel
                        ref={carouselRef}
                        sliderWidth={screenWidth}
                        sliderHeight={screenWidth * 0.8}
                        itemWidth={screenWidth - 60}
                        data={popularMovies}
                        renderItem={renderItem}
                        hasParallaxImages={true}
                      />
                    </View>
                  ) : (
                    <View><Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold } : { color: COLORS.darkText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold }}>No Data Available</Text></View>
                  )
              }
            </View>

            <View style={{ marginTop: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={isDarkMode ? styles.darkhomeheading : styles.lighthomeheading}>Trending</Text>
                <TouchableOpacity onPress={() => { props.navigation.push('TrendingScreen') }}>
                  <Text style={isDarkMode ? { color: COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 } : { color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 }}>More&gt;</Text>
                </TouchableOpacity>
              </View>
              {
                trendingMovies ?
                  (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 15 }}>
                      {trendingMovies.map((item, index) => {
                        return (
                          <TouchableWithoutFeedback key={index} onPress={() => { props.navigation.push('MovieDetailsScreen', { movieId: item.id, movieTitle: item.title }) }}>
                            <View style={{ margin: 8, borderRadius: 15 }}>
                              <Image
                                source={
                                  item.poster_path
                                    ? { uri: `${imageBaseUrl}${item.poster_path}` }
                                    : require('../assets/images/default-movie-poster.jpg')
                                }
                                style={{
                                  width: screenWidth * 0.33,
                                  height: screenHeight * 0.22,
                                  borderRadius: 15,
                                }}
                              />
                              <Text
                                style={
                                  isDarkMode
                                    ? {
                                      color: COLORS.lightText2,
                                      fontFamily: FONTFAMILY.poppins_medium,
                                      fontSize: 12,
                                    }
                                    : {
                                      color: COLORS.darkText2,
                                      fontFamily: FONTFAMILY.poppins_medium,
                                      fontSize: 12,
                                    }
                                }
                                numberOfLines={1}
                              >
                                {item.title.length > 19 ? item.title.slice(0, 19) + '..' : item.title}
                              </Text>
                              {item.vote_average != null && (
                                <Text
                                  style={
                                    isDarkMode
                                      ? {
                                        color: COLORS.lightText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 10,
                                      }
                                      : {
                                        color: COLORS.darkText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 10,
                                      }
                                  }
                                  numberOfLines={1}
                                >
                                  {item.vote_average.toFixed(1)}
                                  <StarIcon fill={'#D4AF37'} size={10} />
                                </Text>
                              )}
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <View><Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold } : { color: COLORS.darkText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold }}>No Data Available</Text></View>
                  )}
            </View>

            <View style={{ marginTop: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={isDarkMode ? styles.darkhomeheading : styles.lighthomeheading}>Top Rated</Text>
                <TouchableOpacity onPress={() => { props.navigation.push('TopRatedScreen') }}>
                  <Text style={isDarkMode ? { color: COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 } : { color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 }}>More&gt;</Text>
                </TouchableOpacity>
              </View>
              {
                topRatedMovies ?
                  (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 15 }}>
                      {topRatedMovies.map((item, index) => {
                        return (
                          <TouchableWithoutFeedback key={index} onPress={() => { props.navigation.push('MovieDetailsScreen', { movieId: item.id, movieTitle: item.title }) }}>
                            <View style={{ margin: 8, borderRadius: 15 }}>
                              <Image
                                source={
                                  item.poster_path
                                    ? { uri: `${imageBaseUrl}${item.poster_path}` }
                                    : require('../assets/images/default-movie-poster.jpg')
                                }
                                style={{
                                  width: screenWidth * 0.33,
                                  height: screenHeight * 0.22,
                                  borderRadius: 15,
                                }}
                              />
                              <Text
                                style={
                                  isDarkMode
                                    ? {
                                      color: COLORS.lightText2,
                                      fontFamily: FONTFAMILY.poppins_medium,
                                      fontSize: 12,
                                    }
                                    : {
                                      color: COLORS.darkText2,
                                      fontFamily: FONTFAMILY.poppins_medium,
                                      fontSize: 12,
                                    }
                                }
                                numberOfLines={1}
                              >
                                {item.title.length > 19 ? item.title.slice(0, 19) + '..' : item.title}
                              </Text>
                              {item.vote_average != null && (
                                <Text
                                  style={
                                    isDarkMode
                                      ? {
                                        color: COLORS.lightText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 10,
                                      }
                                      : {
                                        color: COLORS.darkText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 10,
                                      }
                                  }
                                  numberOfLines={1}
                                >
                                  {item.vote_average.toFixed(1)}
                                  <StarIcon fill={'#D4AF37'} size={10} />
                                </Text>
                              )}
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <View><Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold } : { color: COLORS.darkText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold }}>No Data Available</Text></View>
                  )}
            </View>

            <View style={{ marginTop: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={isDarkMode ? styles.darkhomeheading : styles.lighthomeheading}>Upcoming</Text>
                <TouchableOpacity onPress={() => { props.navigation.push('UpcomingScreen') }}>
                  <Text style={isDarkMode ? { color: COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 } : { color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 }}>More&gt;</Text>
                </TouchableOpacity>
              </View>
              {
                upcomingMovies ?
                  (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 15 }}>
                      {upcomingMovies.map((item, index) => {
                        return (
                          <TouchableWithoutFeedback key={index} onPress={() => { props.navigation.push('MovieDetailsScreen', { movieId: item.id, movieTitle: item.title }) }}>
                            <View style={{ margin: 8, borderRadius: 15 }}>
                              <Image
                                source={
                                  item.poster_path
                                    ? { uri: `${imageBaseUrl}${item.poster_path}` }
                                    : require('../assets/images/default-movie-poster.jpg')
                                }
                                style={{
                                  width: screenWidth * 0.33,
                                  height: screenHeight * 0.22,
                                  borderRadius: 15,
                                }}
                              />
                              <Text
                                style={
                                  isDarkMode
                                    ? {
                                      color: COLORS.lightText2,
                                      fontFamily: FONTFAMILY.poppins_medium,
                                      fontSize: 12,
                                    }
                                    : {
                                      color: COLORS.darkText2,
                                      fontFamily: FONTFAMILY.poppins_medium,
                                      fontSize: 12,
                                    }
                                }
                                numberOfLines={1}
                              >
                                {item.title.length > 19 ? item.title.slice(0, 19) + '..' : item.title}
                              </Text>
                              {item.vote_average != null && (
                                <Text
                                  style={
                                    isDarkMode
                                      ? {
                                        color: COLORS.lightText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 10,
                                      }
                                      : {
                                        color: COLORS.darkText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 10,
                                      }
                                  }
                                  numberOfLines={1}
                                >
                                  {item.vote_average.toFixed(1)}
                                  <StarIcon fill={'#D4AF37'} size={10} />
                                </Text>
                              )}
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <View><Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold } : { color: COLORS.darkText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold }}>No Data Available</Text></View>
                  )}
            </View>

            <View style={{ marginTop: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={isDarkMode ? styles.darkhomeheading : styles.lighthomeheading}>Now Playing</Text>
                <TouchableOpacity onPress={() => { props.navigation.push('NowPlayingScreen') }}>
                  <Text style={isDarkMode ? { color: COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 } : { color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 }}>More&gt;</Text>
                </TouchableOpacity>
              </View>
              {
                nowPlayingMovies ?
                  (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 15 }}>
                      {nowPlayingMovies.map((item, index) => {
                        return (
                          <TouchableWithoutFeedback key={index} onPress={() => { props.navigation.push('MovieDetailsScreen', { movieId: item.id, movieTitle: item.title }) }}>
                            <View style={{ margin: 8, borderRadius: 15 }}>
                              <Image
                                source={
                                  item.poster_path
                                    ? { uri: `${imageBaseUrl}${item.poster_path}` }
                                    : require('../assets/images/default-movie-poster.jpg')
                                }
                                style={{
                                  width: screenWidth * 0.33,
                                  height: screenHeight * 0.22,
                                  borderRadius: 15,
                                }}
                              />
                              <Text
                                style={
                                  isDarkMode
                                    ? {
                                      color: COLORS.lightText2,
                                      fontFamily: FONTFAMILY.poppins_medium,
                                      fontSize: 12,
                                    }
                                    : {
                                      color: COLORS.darkText2,
                                      fontFamily: FONTFAMILY.poppins_medium,
                                      fontSize: 12,
                                    }
                                }
                                numberOfLines={1}
                              >
                                {item.title.length > 19 ? item.title.slice(0, 19) + '..' : item.title}
                              </Text>
                              {item.vote_average != null && (
                                <Text
                                  style={
                                    isDarkMode
                                      ? {
                                        color: COLORS.lightText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 10,
                                      }
                                      : {
                                        color: COLORS.darkText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 10,
                                      }
                                  }
                                  numberOfLines={1}
                                >
                                  {item.vote_average.toFixed(1)}
                                  <StarIcon fill={'#D4AF37'} size={10} />
                                </Text>
                              )}
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      })}
                    </ScrollView>

                  ) : (
                    <View><Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold } : { color: COLORS.darkText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold }}>No Data Available</Text></View>
                  )}
            </View>

            <View style={{ marginTop: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={isDarkMode ? styles.darkhomeheading : styles.lighthomeheading}>Recommended</Text>
                <TouchableOpacity onPress={() => { props.navigation.push('RecommendedScreen') }}>
                  <Text style={isDarkMode ? { color: COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 } : { color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, marginRight: 10 }}>More&gt;</Text>
                </TouchableOpacity>
              </View>

              {
                recommendedMovies ?
                  (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 15 }}>
                      {recommendedMovies.results.map((item, index) => {
                        return (
                          <TouchableWithoutFeedback key={index} onPress={() => { props.navigation.push('MovieDetailsScreen', { movieId: item.id, movieTitle: item.title }) }}>
                            <View style={{ margin: 8, borderRadius: 15 }}>
                              <Image
                                source={
                                  item.poster_path
                                    ? { uri: `${imageBaseUrl}${item.poster_path}` }
                                    : require('../assets/images/default-movie-poster.jpg')
                                }
                                style={{
                                  width: screenWidth * 0.33,
                                  height: screenHeight * 0.22,
                                  borderRadius: 15,
                                }}
                              />
                              <Text
                                style={
                                  isDarkMode
                                    ? {
                                      color: COLORS.lightText2,
                                      fontFamily: FONTFAMILY.poppins_medium,
                                      fontSize: 12,
                                    }
                                    : {
                                      color: COLORS.darkText2,
                                      fontFamily: FONTFAMILY.poppins_medium,
                                      fontSize: 12,
                                    }
                                }
                                numberOfLines={1}
                              >
                                {item.title.length > 19 ? item.title.slice(0, 19) + '..' : item.title}
                              </Text>
                              {item.vote_average != null && (
                                <Text
                                  style={
                                    isDarkMode
                                      ? {
                                        color: COLORS.lightText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 10,
                                      }
                                      : {
                                        color: COLORS.darkText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 10,
                                      }
                                  }
                                  numberOfLines={1}
                                >
                                  {item.vote_average.toFixed(1)}
                                  <StarIcon fill={'#D4AF37'} size={10} />
                                </Text>
                              )}
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      })}
                    </ScrollView>

                  ) : (
                    <View><Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold } : { color: COLORS.darkText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold }}>No Data Available</Text></View>
                  )}

            </View>

          </ScrollView>

        </SafeAreaView>

      )}
    </>
  );
};

const styles = StyleSheet.create({
  DarkHomeScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
  },
  LightHomeScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  container: {
    flex: 1,
  },
  item: {
    width: screenWidth - 60,
    height: screenWidth * 0.8 - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    backgroundColor: 'white',
    borderRadius: 15,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
  },
  darkhomeheading: {
    margin: 10,
    color: COLORS.secondaryDarkYellow,
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: 25
  },
  lighthomeheading: {
    margin: 10,
    color: COLORS.primaryDarkOrange,
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: 25
  }


});

export default HomeScreen;