import { ScrollView, StatusBar, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { imageBaseUrl } from '../constants'
import { useStore } from '../store/store';
import { COLORS, FONTFAMILY } from '../theme/theme';
import { fetchMovieDetails } from '../data/api/tmdbApiFetch';
import NetInfo from '@react-native-community/netinfo';
import { MagnifyingGlassCircleIcon, PlayCircleIcon } from 'react-native-heroicons/solid'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AccountScreen = (props: any) => {

  const [connectionStatus, setConnectionStatus] = useState(true);

  const itemsLanguage = [
    { label: 'English', value: 'en' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Bengali', value: 'bn' },
    { label: 'Tamil', value: 'ta' },
    { label: 'Telugu', value: 'te' },
    { label: 'Kannada', value: 'kn' },
    { label: 'Malayalam', value: 'ml' },
    { label: 'Punjabi', value: 'pa' },
    { label: 'Oriya', value: 'or' },
    { label: 'Japanese', value: 'ja' },
    { label: 'French', value: 'fr' },
    { label: 'Spanish', value: 'es' },
    { label: 'Korean', value: 'ko' },
    { label: 'German', value: 'de' },
    { label: 'Italian', value: 'it' },
    { label: 'Russian', value: 'ru' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Arabic', value: 'ar' },
    { label: 'Urdu', value: 'ur' },
    { label: 'Chinese', value: 'zh' },
  ]
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

  interface NewUserRecentlyViewedItem {
    __v: number;
    _id: string;
    createdAt: string; // Assuming createdAt is a string representation of date
    movieId: string;
    movieTitle: string;
    poster_path: string;
    user: string;
  }

  interface UserRecentlyViewedItem {
    __v: number;
    _id: string;
    createdAt: string; // Assuming createdAt is a string representation of date
    movieId: string;
    movieTitle: string;
    user: string;
  }
  interface UserSearchHistoryItem {
    __v: number;
    _id: string;
    createdAt: string;
    searchTitle: string;
    user: string;
  }


  const [imageError, setImageError] = useState(false);
  const [finalRecent, setFinalRecent] = useState<NewUserRecentlyViewedItem[]>([]);
  const user = useStore((state: any) => state.user);
  const isDarkMode = useStore((state: any) => state.isDarkMode);
  const userSearchHistory = useStore((state: any) => state.userSearchHistory);
  const userRecentlyViewed = useStore((state: any) => state.userRecentlyViewed);


  // // Sort userSearchHistory and userRecentlyViewed by createdAt in descending order
  // userSearchHistory.sort((a: UserSearchHistoryItem, b: UserSearchHistoryItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  // userRecentlyViewed.sort((a: UserRecentlyViewedItem, b: UserRecentlyViewedItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const [sortedSearchHistory, setSortedSearchHistory] = useState([...userSearchHistory].sort((a: UserSearchHistoryItem, b: UserSearchHistoryItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  const [sortedRecentlyViewed, setSortedRecentlyViewed] = useState([...userRecentlyViewed].sort((a: UserRecentlyViewedItem, b: UserRecentlyViewedItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };


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
  };


  async function enrichRecentlyViewedWithPosterPath(recentlyViewed: UserRecentlyViewedItem[]) {
    const enrichedRecentlyViewed = [];

    for (const item of recentlyViewed) {
      try {
        const movieDetails = (await fetchMovieDetails(item.movieId)).data;
        const posterPath = movieDetails?.poster_path;
        const enrichedItem = { ...item, poster_path: `${imageBaseUrl}${posterPath}` };
        enrichedRecentlyViewed.push(enrichedItem);
      } catch (error) {
        console.log(`Error fetching movie details for ${item.movieId}:`, error);
      }
    }

    return enrichedRecentlyViewed;
  }


  enrichRecentlyViewedWithPosterPath(sortedRecentlyViewed)
    .then(enrichedRecentlyViewed => {
      setFinalRecent(enrichedRecentlyViewed)
    })
    .catch(error => {
      console.log('Error enriching recently viewed with poster path:', error);
    });


  return (
    <View style={isDarkMode ? styles.darkaccountscreenparentcont : styles.lightaccountscreenparentcont}>
      <StatusBar
        backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isDarkMode ? styles.darkscrollcontaineraccount : styles.lightscrollcontaineraccount}
      >

        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', margin: 10, }}>

          <Image
            style={{ height: 300, width: 300, borderRadius: 60, resizeMode: 'cover' }}
            source={imageError ? ((user.gender == 'Male') ? require('../assets/images/user-default-male.png') : require('../assets/images/user-default-female.png')) : { uri: `file:///data/user/0/com.cinepulse/files/${user.user._id}profile` }}
            onError={() => setImageError(true)}
          />
        </View>

        <View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Text style={isDarkMode ? styles.darknameheadercont : styles.lightnameheadercont}>Name :</Text>
          <Text style={isDarkMode ? styles.darknametextcont : styles.lightnametextcont}>{user.name}</Text>
        </View>

        <View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Text style={isDarkMode ? styles.darknameheadercont : styles.lightnameheadercont}>Gender :</Text>
          <Text style={isDarkMode ? styles.darknametextcont : styles.lightnametextcont}>{user.gender}</Text>
        </View>

        <View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Text style={isDarkMode ? styles.darknameheadercont : styles.lightnameheadercont}>Date Of Birth :</Text>
          <Text style={isDarkMode ? styles.darknametextcont : styles.lightnametextcont}>{formatDate(new Date(user.dateOfBirth))}</Text>
        </View>

        <View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Text style={isDarkMode ? styles.darknameheadercont : styles.lightnameheadercont}>Email :</Text>
          <Text style={isDarkMode ? styles.darknametextcont : styles.lightnametextcont}>{user.user.email}</Text>
        </View>




        <View style={{ marginLeft: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text style={isDarkMode ? styles.darkgenderheadercont : styles.lightgenderheadercont}>Language :</Text>
          <View style={{ flexWrap: 'wrap' }}>
            <Text style={isDarkMode ? styles.darkgendertextcont : styles.lightgendertextcont}>   {user.langPref
              .map((code: string) => itemsLanguage.find(item => item.value === code)?.label || 'Unknown')
              .join(', ')}
            </Text>
          </View>

        </View>



        <View style={{ marginLeft: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text style={isDarkMode ? styles.darkgenderheadercont : styles.lightgenderheadercont}>Genres :</Text>
          <View style={{ flexWrap: 'wrap' }}>
            <Text style={isDarkMode ? styles.darkgendertextcont : styles.lightgendertextcont}>    {user.genrePref
              .map((code: string) => itemsGenres.find(item => item.value === code)?.label || 'Unknown')
              .join(', ')}
            </Text>
          </View>

        </View>


        {
          connectionStatus ?
            (
              <View style={{ marginLeft: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>

                <Text style={isDarkMode ? styles.darkgenderheadercont : styles.lightgenderheadercont}>Recently Viewed :</Text>
                {

                  finalRecent ?
                    (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 5 }}>
                        {finalRecent.map((item, index) => {
                          return (
                            <TouchableWithoutFeedback key={index} onPress={() => { props.navigation.push('MovieDetailsScreen', { movieId: item.movieId, movieTitle: item.movieTitle }) }}>
                              <View style={{ margin: 8, borderRadius: 15 }}>
                                <Image
                                  source={
                                    item.poster_path
                                      ? { uri: item.poster_path }
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
                                  {item.movieTitle.length > 19 ? item.movieTitle.slice(0, 19) + '..' : item.movieTitle}
                                </Text>
                              </View>
                            </TouchableWithoutFeedback>
                          );
                        })}
                      </ScrollView>
                    ) : (
                      <View><Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold } : { color: COLORS.darkText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold }}>No Data Available</Text></View>
                    )}

              </View>

            ) :
            (

              <View style={{ marginLeft: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>

                <Text style={isDarkMode ? styles.darkgenderheadercont : styles.lightgenderheadercont}>Recently Viewed :</Text>
                {

                  finalRecent ?
                    (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 5 }}>
                        {finalRecent.map((item, index) => {
                          return (
                            <View key={index}>
                              <View style={{ margin: 8, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <PlayCircleIcon fill={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange} size={18} style={{ marginRight: 2 }} />
                                <Text
                                  style={
                                    isDarkMode
                                      ? {
                                        color: COLORS.lightText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 18,
                                      }
                                      : {
                                        color: COLORS.darkText2,
                                        fontFamily: FONTFAMILY.poppins_medium,
                                        fontSize: 18,
                                      }
                                  }
                                  numberOfLines={1}
                                >
                                  {item.movieTitle}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </ScrollView>
                    ) : (
                      <View><Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold } : { color: COLORS.darkText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold }}>No Data Available</Text></View>
                    )}

              </View>

            )
        }




        <View style={{ marginLeft: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>

          <Text style={isDarkMode ? styles.darkgenderheadercont : styles.lightgenderheadercont}>Recently Searched :</Text>
          {

            sortedSearchHistory ?
              (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 5 }}>
                  {sortedSearchHistory.map((item, index) => {
                    return (
                      <View key={index}>
                        <View style={{ margin: 8, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                          <MagnifyingGlassCircleIcon fill={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange} size={18} style={{ marginRight: 2 }} />
                          <Text
                            style={
                              isDarkMode
                                ? {
                                  color: COLORS.lightText2,
                                  fontFamily: FONTFAMILY.poppins_medium,
                                  fontSize: 18,
                                }
                                : {
                                  color: COLORS.darkText2,
                                  fontFamily: FONTFAMILY.poppins_medium,
                                  fontSize: 18,
                                }
                            }
                            numberOfLines={1}
                          >
                            {item.searchTitle}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              ) : (
                <View><Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold } : { color: COLORS.darkText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold }}>No Data Available</Text></View>
              )}

        </View>


      </ScrollView>
    </View>

  )
}

const styles = StyleSheet.create({
  darkaccountscreenparentcont: {
    backgroundColor: COLORS.darkBackground,
    height: screenHeight,
    width: screenWidth
  },
  lightaccountscreenparentcont: {
    backgroundColor: COLORS.lightBackground,
    height: screenHeight,
    width: screenWidth
  },
  darkscrollcontaineraccount: {
    flexGrow: 1,
    backgroundColor: COLORS.darkBackground
  },
  lightscrollcontaineraccount: {
    flexGrow: 1,
    backgroundColor: COLORS.lightBackground
  },
  darknameheadercont: {
    color: COLORS.secondaryDarkYellow,
    fontFamily: FONTFAMILY.poppins_extrabold,
    fontSize: 20

  },
  lightnameheadercont: {
    color: COLORS.primaryDarkOrange,
    fontFamily: FONTFAMILY.poppins_extrabold,
    fontSize: 22
  },
  darknametextcont: {
    color: COLORS.lightText1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: 20,
    margin: 10
  },
  lightnametextcont: {
    color: COLORS.darkText1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: 20,
    margin: 10
  },
  darkgenderheadercont: {
    color: COLORS.secondaryDarkYellow,
    fontFamily: FONTFAMILY.poppins_extrabold,
    fontSize: 20

  },
  lightgenderheadercont: {
    color: COLORS.primaryDarkOrange,
    fontFamily: FONTFAMILY.poppins_extrabold,
    fontSize: 22
  },
  darkgendertextcont: {
    color: COLORS.lightText1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: 20,
    width: screenWidth * 0.9
  },
  lightgendertextcont: {
    color: COLORS.darkText1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: 20,
    width: screenWidth * 0.9
  },

})
export default AccountScreen
