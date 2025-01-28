import { StyleSheet, StatusBar, ScrollView, View, Text, SafeAreaView, Keyboard, ActivityIndicator, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Image, TextInput } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { imageBaseUrl } from '../constants'
import { StarIcon, MicrophoneIcon, XMarkIcon } from 'react-native-heroicons/solid'
import { useStore } from '../store/store';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY } from '../theme/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { searchMovie } from '../data/api/tmdbApiFetch';
import OfflineScreen from '../components/OfflineScreen';
import NetInfo from '@react-native-community/netinfo';
import LottieView from 'lottie-react-native';
import RecVoice from '@react-native-voice/voice';
import { debounce } from 'lodash';
import { addtosearch } from '../data/onlinedb/expressApi';
import VoiceRecording from '../components/VoiceRecording';

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

const SearchScreen = (props: any) => {

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
  const authKey = useStore((state: any) => state.authKey);
  const addUserSearchHistory = useStore((state: any) => state.addUserSearchHistory);
  const userSearchHistory = useStore((state: any) => state.userSearchHistory);
  const user = useStore((state: any) => state.user);
  const tabBarHeight = useBottomTabBarHeight();

  const isDarkMode = useStore((state: any) => state.isDarkMode);
  const adult = useStore((state: any) => state.adult);

  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [result, setResult] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalRes, setTotalRes] = useState(0)
  const [totaPg, setTotalPg] = useState(0)

  const [connectionStatus, setConnectionStatus] = useState(true);
  const [recordingOn, setRecordingOn] = useState(false);

  function handleSearch(e: any) {
    const TextVar = e.nativeEvent.text;
    setSearchKeyword(TextVar);
  }


  const searchMoviesCaller = async (key: string) => {
    try {
      setPage(1)
      setTotalPg(0)
      setTotalRes(0)
      setLoading(true)
      const params = { query: key, include_adult: adult, page: page };
      const response = await searchMovie(params);
      if (key) {
        const a = await addtosearch(authKey, key)
        await addUserSearchHistory({
          _id: `${userSearchHistory.length + 1}${user._id}`,
          createdAt: new Date().toISOString(),
          searchTitle: key,
          user: user._id
        })
      }
      setResult(response.data.results)
      setLoading(false)
      setTotalPg(response.data.total_pages)
      setTotalRes(response.data.total_results)
      Keyboard.dismiss()
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }

  const handleSearchTextDebounce = useCallback(
    debounce((key: string) => searchMoviesCaller(key), 2000),
    []
  );
  useEffect(() => {
    handleSearchTextDebounce(searchKeyword)
    console.log(searchKeyword, result)
  }, [searchKeyword]);

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


  useEffect(() => {
    RecVoice.onSpeechStart = onSpeechStart;
    RecVoice.onSpeechEnd = onSpeechEnd;
    RecVoice.onSpeechError = onSpeechError;
    RecVoice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      RecVoice.destroy().then(RecVoice.removeAllListeners)
    }
  }, [])

  const onSpeechStart = (e: any) => {
    setRecordingOn(true)
    console.log('onSpeechStart', e)
  }
  const onSpeechEnd = (e: any) => {
    setRecordingOn(false)
    console.log('onSpeechEnd', e)
  }
  const onSpeechError = (e: any) => {
    setRecordingOn(false)
    console.log('onSpeechError', e)
  }
  const onSpeechResultsHandler = (event: any) => {
    console.log(event)
    const recognizedText = event.value[0];
    setSearchKeyword(recognizedText.toLowerCase())
  };

  const startRecognizing = async () => {
    try {
      await RecVoice.start('en-US')
    } catch (err) {
      console.log(err)
    }
  }

  const stopRecognizing = async () => {
    try {
      await RecVoice.stop()
      await RecVoice.destroy()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {!connectionStatus ? (
        <OfflineScreen />
      ) :

        (
          <SafeAreaView style={isDarkMode ? styles.darksearchscreenparentcon : styles.lightsearchscreenparentcon} >
            <StatusBar
              backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />

            {
              recordingOn ? (<View style={{ zIndex: 10 }}><VoiceRecording /></View>) : (<></>)
            }

            <HeaderBar title={'Search'} isDark={isDarkMode} props={props} />

            <View style={isDarkMode ? styles.darksearchBar : styles.lightsearchBar}>
              <TextInput
                onChange={e => handleSearch(e)}
                placeholder='Search Movies'
                placeholderTextColor={isDarkMode ? COLORS.darkText2 : COLORS.lightText2}
                style={isDarkMode ? { width: '90%', margin: 2, marginLeft: 7, fontFamily: FONTFAMILY.poppins_medium, color: COLORS.lightText1, fontSize: 17 } :
                  { width: '90%', margin: 2, marginLeft: 7, fontFamily: FONTFAMILY.poppins_medium, color: COLORS.darkText1, fontSize: 17 }
                }
                value={searchKeyword}
              />
              {(searchKeyword === '') ? (
                <TouchableOpacity onPress={() => { startRecognizing() }}>
                  <MicrophoneIcon fill={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange} size={25} style={{ marginRight: 15 }} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => { setSearchKeyword('') }}>
                  <XMarkIcon fill={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange} size={25} style={{ marginRight: 15 }} />
                </TouchableOpacity>
              )}

            </View>

            <View style={{ flexDirection: 'row', margin: 5, justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={isDarkMode ? { color: COLORS.lightText1, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 } : { color: COLORS.darkText1, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 }}>{`Results: ${totalRes}`}</Text>
              <Text style={isDarkMode ? { color: COLORS.lightText1, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 } : { color: COLORS.darkText1, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 }}>{`Page: ${page}/${totaPg}`}</Text>
            </View>

            {
              loading ? (
                <View style={{ alignItems: 'center' }}>
                  <LottieView style={{ width: screenWidth, height: screenWidth }} source={require('../lottie/search-screen-loading.json')} autoPlay loop />
                </View>
              ) :
                result.length != 0 ? (
                  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                    paddingHorizontal: 15,
                    paddingBottom: tabBarHeight
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
                                      numberOfLines={6}
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
                              const params = { query: searchKeyword, include_adult: adult, page: page + 1 };
                              const response = await searchMovie(params);
                              setResult(result.concat(response.data.results))
                              setPage(page + 1)
                              setMoreLoading(false)
                            }}
                            disabled={page === totaPg}
                          >
                            <Text style={isDarkMode ? { color: COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14 } : { color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14 }}>Load More</Text>
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

const styles = StyleSheet.create({
  darksearchscreenparentcon: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: COLORS.darkBackground
  },
  lightsearchscreenparentcon: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: COLORS.lightBackground
  },
  darksearchBar: {
    margin: 10,
    width: screenWidth - 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.darkBackground,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.secondaryDarkYellow,
  },
  lightsearchBar: {
    margin: 10,
    width: screenWidth - 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.primaryDarkOrange,
  }
})

export default SearchScreen