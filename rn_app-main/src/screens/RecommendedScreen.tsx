import { StyleSheet, StatusBar, ScrollView, View, Text, SafeAreaView, Keyboard, ActivityIndicator, Platform, TouchableOpacity, PermissionsAndroid, Dimensions, TouchableWithoutFeedback, Image, TextInput } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';

import { imageBaseUrl } from '../constants'

import { StarIcon, MicrophoneIcon, XMarkIcon } from 'react-native-heroicons/solid'
import { useStore } from '../store/store';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY } from '../theme/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { fetchMovieDetails, searchMovie } from '../data/api/tmdbApiFetch';
import OfflineScreen from '../components/OfflineScreen';
import NetInfo from '@react-native-community/netinfo';
import LottieView from 'lottie-react-native';

import LoadingScreen from '../components/LoadingScreen';
import { fetchNowShowingMovies, fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../data/api/tmdbApiFetch';
import { recomendcaller } from '../data/api/othersApiFetch';


const itemsGenres = [
  { label: 'Action', value: '28' },
  { label: 'Adventure', value: '12' },
  { label: 'Animation', value: '16' },
  { label: 'Comedy', value: '35' },
  { label: 'Crime', value: '80' },
  { label: 'Documentary', value: '99' },
  { label: 'Drama', value: '18' },
  { label: 'Family', value: '10751' },
  { label: 'Fantasy', value: '14' },
  { label: 'History', value: '36' },
  { label: 'Horror', value: '27' },
  { label: 'Music', value: '10402' },
  { label: 'Mystery', value: '9648' },
  { label: 'Romance', value: '10749' },
  { label: 'Science Fiction', value: '878' },
  { label: 'TV Movie', value: '10770' },
  { label: 'Thriller', value: '53' },
  { label: 'War', value: '10752' },
  { label: 'Western', value: '37' },
];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;



const RecommendedScreen = (props:any) => {




  const isDarkMode = useStore((state: any) => state.isDarkMode);
  const user = useStore((state: any) => state.user);
  const adult = useStore((state: any) => state.adult);
  const rcmndLink = useStore((state: any) => state.rcmndLink);

  const userRecentlyViewed = useStore((state: any) => state.userRecentlyViewed);

  const [connectionStatus, setConnectionStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [result, setResult] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalRes, setTotalRes] = useState(0)
  const [totaPg, setTotalPg] = useState(0)

  interface UserRecentlyViewedItem {
    __v: number;
    _id: string;
    createdAt: string; // Assuming createdAt is a string representation of date
    movieId: string;
    movieTitle: string;
    user: string;
  }

  interface RcmndItem {
    results: any[];
    total_pages: number;
    total_results: number;
  }

  const [sortedRecentlyViewed, setSortedRecentlyViewed] = useState([...userRecentlyViewed].sort((a: UserRecentlyViewedItem, b: UserRecentlyViewedItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));

  const fetchRecommendedMovies = async (page:number) => {
    try {
      // Transform sortedRecentlyViewed movies into the required format
      const transformedMovies = sortedRecentlyViewed.map(movie => ({
        id: movie.movieId,
        title: movie.movieTitle
      }));
  
      console.warn('transformedMovies', transformedMovies);
  
      console.warn('called from home rcmnd')
      // Call the recomendcaller function to get recommended movies
      const response: RcmndItem = await recomendcaller(transformedMovies, user.genrePref, user.langPref, page,rcmndLink);
      console.warn('response rcmnd caller', response);
  
      // Iterate over each movie in the results array
      const updatedResults = await Promise.all(response.results.map(async (movie: any) => {
        // Extract only the id from the movie object
        const { id } = movie;
  
        // Call fetchMovieDetails to get more details about the movie
        const movieDetails = (await fetchMovieDetails(id)).data;
  
        // Replace the existing details with the new details obtained from fetchMovieDetails
        return {
          ...movie,
          ...movieDetails
        };
      }));
  
      console.log('updatedResults', updatedResults);
      // Set the recommended movies with updated details
      setTotalRes(response.total_results)
      setTotalPg(response.total_pages)
      setResult(result.concat(updatedResults))
    } catch (error) {
      console.error('Error fetching recommended movies:', error);
    }
  };




  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchRecommendedMovies(1),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    NetInfo.fetch().then((state) => {
      setConnectionStatus(state.isInternetReachable ?? false);
      //   or
      // setConnectionStatus(state.isConnected ?? false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleConnectivityChange = (state: any) => {
    setConnectionStatus(state.isConnected);
    console.log(state);
  };






  return (
    <>
      {!connectionStatus ? (
        <OfflineScreen />
      ) : loading ? (
        <LoadingScreen Message="Recommended Movies Loading" />
      ) : (
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground
        }}>
          <StatusBar
            backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />
          <HeaderBar title='Recommended' isDark={isDarkMode} props={props} />


          <View style={{ flexDirection: 'row', margin: 5, justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={isDarkMode ? { color: COLORS.lightText1, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 } : { color: COLORS.darkText1, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 }}>{`Results: ${totalRes}`}</Text>
            <Text style={isDarkMode ? { color: COLORS.lightText1, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 } : { color: COLORS.darkText1, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 }}>{`Page: ${page}/${totaPg}`}</Text>
          </View>


          {result.length != 0 ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
              paddingHorizontal: 15,
              marginBottom:10,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {
                  result.map((item: any, index: any) => {
                    return (
                      <TouchableWithoutFeedback
                        key={index}
                        onPress={() => { props.navigation.push('MovieDetailsScreen', { movieId: item.id, movieTitle: item.title }) }}
                      >
                        <View style={{ width: screenWidth - 20, height: screenHeight * 0.25, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 12, marginBottom: 12 }}>

                          <View style={{ width: screenWidth * 0.33, height: screenHeight * 0.25 }}>
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
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                              <Text style={isDarkMode ? { color: COLORS.lightText2, marginLeft: 5, fontFamily: FONTFAMILY.poppins_medium, fontSize: 13 } : { color: COLORS.darkText2, marginLeft: 5, fontFamily: FONTFAMILY.poppins_medium, fontSize: 13 }} numberOfLines={1}>
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
                                        fontSize: 13,
                                      }
                                      : {
                                        color: COLORS.darkText2,
                                        marginLeft: 20,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 13,
                                      }
                                  }
                                  numberOfLines={1}
                                >
                                  {item.vote_average.toFixed(1)}
                                  <StarIcon fill={'#D4AF37'} size={13} />
                                </Text>
                              )}
                            </View>
                          </View>

                          <View style={{ width: screenWidth - (25 + screenWidth * 0.33), height: screenHeight * 0.25, justifyContent: 'flex-start' }}>
                            <Text
                              style={{
                                color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange,
                                fontFamily: FONTFAMILY.poppins_medium,
                                fontSize: 15,
                                marginBottom: 5,
                              }}
                              numberOfLines={1}
                            >
                              {item.title.length > 25 ? item.title.slice(0, 25) + '..' : item.title}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={{
                                  color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1,
                                  fontFamily: FONTFAMILY.poppins_medium,
                                  fontSize: 12,
                                  marginBottom: 5,
                                  flexWrap: 'wrap'
                                }}
                                numberOfLines={2}
                              >
                                {item.genres
                                  .map((code: any) => code.name|| 'Unknown')
                                  .join(', ')}
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={{
                                  color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2,
                                  fontFamily: FONTFAMILY.poppins_medium,
                                  fontSize: 12,
                                  marginBottom: 5,
                                }}
                                numberOfLines={7}
                              >
                                {item.overview}
                              </Text>
                            </View>

                          </View>

                        </View>

                      </TouchableWithoutFeedback>
                    )
                  })
                }
              </View>

              <View style={{ alignSelf: 'center' }}>


                {
                  !moreLoading ? (
                    <TouchableOpacity
                      onPress={async () => {
                        setMoreLoading(true)        
                        fetchRecommendedMovies(page+1)
                        setMoreLoading(false)
                        setPage(page + 1)
                      }}
                      disabled={page === totaPg}
                    >
                      <Text style={isDarkMode ? { color: COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14 } : { color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14 }}>{(page === totaPg)?'End':'Load More'}</Text>
                    </TouchableOpacity>
                  ) : (
                    <ActivityIndicator size="small" color={isDarkMode ? COLORS.lightText2 : COLORS.darkText2} />
                  )
                }

              </View>



            </ScrollView>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <LottieView style={{ width: screenWidth, height: screenWidth }} source={require('../lottie/no-data-found.json')} autoPlay loop />
            </View>
          )



          }
        </SafeAreaView>


      )
      }
    </>
  )
}


const styles = StyleSheet.create({})
export default RecommendedScreen