import { Dimensions, Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState, useEffect } from "react";

import { useStore } from '../store/store';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY } from '../theme/theme';
import NetInfo from '@react-native-community/netinfo';
import OfflineScreen from '../components/OfflineScreen';
import LoadingScreen from '../components/LoadingScreen';
import { fetchCastDetails, fetchCastMovie } from '../data/api/tmdbApiFetch';
import { imageBaseUrl } from '../constants';
import { StarIcon } from 'react-native-heroicons/solid';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CastDetailsScreen = (props: any) => {

  const castId = props.route.params.castId
  
  
  const [castDetails, setCastDetails] = useState<any>({})
  const [castMovies, setCastMovies] = useState<any[]>([])

  const isDarkMode = useStore((state: any) => state.isDarkMode);
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await Promise.all([
          fetchCastDetailsCaller(),
          fetchCastMovieCaller()
        ]);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, [props.route.params.castId]);

  const fetchCastDetailsCaller = async () => {
    try {
      const response = await fetchCastDetails(castId);
      setCastDetails(response.data);
    } catch (error) {
      console.log('Error fetching cast details:', error);
    }
  };

  const fetchCastMovieCaller = async () => {
    try {
      const response = await fetchCastMovie(castId);
      setCastMovies(response.data.cast);
    } catch (error) {
      console.log('Error fetching cast movies:', error);
    }
  };


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
        <LoadingScreen Message="Cast Details Loading" />
      ) : (
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground
        }}>
          <StatusBar
            backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />
          <HeaderBar title='Cast Details' isDark={isDarkMode} props={props} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
            margin: 5,
            flexGrow: 1,
          }}>

            <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
              <Image
                source={
                  castDetails?.profile_path
                    ? { uri: `${imageBaseUrl}${castDetails?.profile_path}` }
                    : require('../assets/images/cast-default.png')
                }

                style={{ borderRadius: 50, borderWidth: 1, height: screenWidth * 0.8, width: screenWidth * 0.8, borderColor: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, resizeMode: 'cover' }}
              />
            </View>

            <View style={{ margin: 5, alignItems: 'center' }}>
              <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24 }}>{castDetails?.name}</Text>
              <Text style={{ marginTop: -5, color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_medium, fontSize: 17 }}>{castDetails?.place_of_birth}</Text>
            </View>

            <View style={{ marginHorizontal: 7, margin: 5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', alignContent: 'center', backgroundColor: isDarkMode ? `${COLORS.lightBackground}30` : `${COLORS.darkBackground}30`, borderRadius: 20, borderColor: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, borderWidth: 2 }}>

              {/* <View style={{ borderRightWidth: 1, margin: 5, borderRightColor: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, justifyContent: 'center', alignContent: 'center' }}> */}
              <View style={{ alignContent: 'center', justifyContent: 'center', margin: 5 }}>
                <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, fontSize: 14 }}>Gender</Text>
                <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 13 }}>{(castDetails?.gender == 2) ? 'Male' : 'Female'}</Text>
              </View>

              {/* <View style={{ borderRightWidth: 1, margin: 5, borderRightColor: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, justifyContent: 'center', alignContent: 'center' }}> */}
              <View style={{ alignContent: 'center', justifyContent: 'center', margin: 5 }}>
                <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, fontSize: 14 }}>Date Of Birth</Text>
                <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 13 }}>{castDetails?.birthday ? new Date(castDetails.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</Text>
              </View>

              {/* <View style={{ borderRightWidth: 1, margin: 5, borderRightColor: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, justifyContent: 'center', alignContent: 'center' }}> */}
              <View style={{ alignContent: 'center', justifyContent: 'center', margin: 5 }}>
                <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, fontSize: 14 }}>Known For</Text>
                <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 13 }}>{castDetails?.known_for_department}</Text>
              </View>

              <View style={{ alignContent: 'center', justifyContent: 'center', margin: 5 }}>
                <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, fontSize: 14 }}>Popularity</Text>
                <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 13 }}>{castDetails?.popularity}</Text>
              </View>

            </View>

            <View style={{ margin: 5 }}>
              <Text style={{ textAlign: 'left', color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_medium, fontSize: 18 }}>Biography</Text>
              <Text style={{ textAlign: 'justify', color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 }}>{(castDetails.biography) ? castDetails.biography : 'N.A'}</Text>
            </View>

            <View style={{ margin: 5 }}>
              <Text style={{ textAlign: 'left', color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_medium, fontSize: 18 }}>{(castDetails?.gender==2)?'His Movies':(castDetails?.gender==1)?'Her Movies':'Movies'}</Text>
            
              {
                  castMovies ?
                    (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 15 }}>
                        {castMovies.map((item, index) => {
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
      )
      }
    </>
  )
}




export default CastDetailsScreen
