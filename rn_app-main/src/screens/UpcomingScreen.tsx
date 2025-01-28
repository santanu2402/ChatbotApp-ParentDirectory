import { StyleSheet, StatusBar, ScrollView, View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Image } from 'react-native';
import React, { useEffect, useState  } from 'react';
import { imageBaseUrl } from '../constants'
import { StarIcon } from 'react-native-heroicons/solid'
import { useStore } from '../store/store';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY } from '../theme/theme';
import OfflineScreen from '../components/OfflineScreen';
import NetInfo from '@react-native-community/netinfo';
import LottieView from 'lottie-react-native';
import LoadingScreen from '../components/LoadingScreen';
import { fetchUpcomingMovies } from '../data/api/tmdbApiFetch';


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

const UpcomingScreen = (props:any) => {

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


  const isDarkMode = useStore((state: any) => state.isDarkMode);
  const user = useStore((state: any) => state.user);
  const adult = useStore((state: any) => state.adult);
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [result, setResult] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalRes, setTotalRes] = useState(0)
  const [totaPg, setTotalPg] = useState(0)
  const fetchUpcomingCaller = async () => {
    try {
      const response = await fetchUpcomingMovies(1);
      if (response.data) {
        setResult(filterAndSortMovies(response.data.results, adult, user.genrePref, user.langPref));
        setTotalPg(response.data.total_pages)
        setTotalRes(response.data.total_results)
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchUpcomingCaller(),
        ]);
      } catch (error) {
        console.log("Error fetching data:", error);
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
      <LoadingScreen Message="Upcoming Movies Loading" />
    ) : (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground
      }}>
        <StatusBar
          backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <HeaderBar title='Upcoming' isDark={isDarkMode} props={props} />

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
                              {item.genre_ids
                                .map((code: number) => itemsGenres.find(item => item.value === code.toString())?.label || 'Unknown')
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
                      const response = await fetchUpcomingMovies(page + 1);
                      setResult(result.concat((filterAndSortMovies(response.data.results, adult, user.genrePref, user.langPref))))
                      setPage(page + 1)
                      setMoreLoading(false)
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
export default UpcomingScreen