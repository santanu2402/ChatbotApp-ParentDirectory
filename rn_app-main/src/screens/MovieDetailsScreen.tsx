import { StyleSheet, StatusBar, ScrollView, View, SafeAreaView, TouchableOpacity, PermissionsAndroid, Dimensions, TouchableWithoutFeedback, Image, ImageBackground, Share } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { imageBaseUrl } from '../constants'
import Icon from 'react-native-vector-icons/Feather';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { ShareIcon, PlayCircleIcon, HeartIcon, ClockIcon, BookmarkIcon, QueueListIcon, StarIcon, UserCircleIcon } from 'react-native-heroicons/solid'
import { FilmIcon } from 'react-native-heroicons/outline'
import { useStore } from '../store/store';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY } from '../theme/theme';
import { fetchMovieCredits, fetchMovieDetails, fetchSimilarMovie, submitRating, } from '../data/api/tmdbApiFetch';
import OfflineScreen from '../components/OfflineScreen';
import ShimmerLoaderMovie from '../components/ShimmerLoaderMovie';
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from "react-native-linear-gradient"
import { AirbnbRating } from 'react-native-ratings';
import Toast, { ToastMethods } from '../components/Toast/Toast';
import Tts from 'react-native-tts';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { addmovietolist, addtorecentlyviewed, deleteMovieFromList } from '../data/onlinedb/expressApi';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection?: {
    backdrop_path: string;
    id: number;
    name: string;
    poster_path: string;
  };
  budget: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: Array<{
    id: number;
    logo_path?: string;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline?: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

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

interface CastDetails {
  cast: CastMember[];
  crew: CrewMember[];
}

interface UserSavedListItem {
  movieId: string;
  movieTitle: string,
  listName: string;
}

interface CastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

interface CrewMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}


interface MovieItem {
  __v: number;
  _id: string;
  movieCast: any[];
  movieCountryOfOrigin: string;
  movieDirector: string;
  movieGenre: any[];
  movieId: string;
  movieImageLink: string;
  movieLanguage: string;
  movieOverview: string;
  movieProductionCompany: any[];
  movieRating: string;
  movieReleasedDate: string;
  movieRevenue: string;
  movieRuntime: number;
  movieTitle: string;
  user: string;
}
interface GenreItem {
  id: number;
  name: string;
}

const MovieDetailsScreen = (props: any) => {

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [visible2, setVisible2] = React.useState(false);

  const showModal2 = () => setVisible2(true);
  const hideModal2 = () => setVisible2(false);

  const [fabLoad, setFavLoad] = React.useState(false);
  const [watLoad, setWatLoad] = React.useState(false);
  const [alrLoad, setAlrLoad] = React.useState(false);

  const [fabAdded, setFabAdded] = React.useState(false);
  const [watAdded, setWatAdded] = React.useState(false);
  const [alrAdded, setAlrAdded] = React.useState(false);


  let toSpeak = ''

  const movieId = props.route.params.movieId
  const movieTitle = decodeURIComponent(props.route.params.movieTitle)
  const share = `https://cinepulse-share.netlify.app/#/${movieId}/${encodeURIComponent(movieTitle)}`;
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(0)

  const [offlineMovieDetailsItem, setOfflineMovieDetailsItem] = useState<MovieItem | null>(null);

  const [dn, setdn] = useState(false)

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [castDetails, setCastDetails] = useState<CastDetails>({ cast: [], crew: [] });
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  const isDarkMode = useStore((state: any) => state.isDarkMode);
  const authKey = useStore((state: any) => state.authKey);
  const user = useStore((state: any) => state.user);
  const adult = useStore((state: any) => state.adult);
  const voiceFeature = useStore((state: any) => state.voiceFeature);
  const addUserOfflineMovieDetails = useStore((state: any) => state.addUserOfflineMovieDetails);
  const addUserOfflineImageList = useStore((state: any) => state.addUserOfflineImageList);

  const addUserSavedList = useStore((state: any) => state.addUserSavedList);
  const deleteMovieFromUserSavedList = useStore((state: any) => state.deleteMovieFromUserSavedList);

  const userRecentlyViewed = useStore((state: any) => state.userRecentlyViewed);
  const addUserRecentlyViewed = useStore((state: any) => state.addUserRecentlyViewed);

  const userSavedList = useStore((state: any) => state.userSavedList);
  const userOfflineMovieDetails = useStore((state: any) => state.userOfflineMovieDetails);
  const userOfflineImageList = useStore((state: any) => state.userOfflineImageList);

  useEffect(() => {
    const handleSearchMovie = (movieId: any) => {
      const foundMovie = userOfflineMovieDetails.find((movie: MovieItem) => movie.movieId == movieId);
      console.log('foundMovie', foundMovie);
      if (foundMovie) {
        setOfflineMovieDetailsItem(foundMovie);
      }
    };
    handleSearchMovie(movieId);
  }, [movieId]);

  function hasMovieId(movieId: any) {
    return userOfflineMovieDetails.some((movie: MovieItem) => movie.movieId == movieId);
  }

  const requestStoragePermission = async (Url: string, pictureId: string) => {
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
      const isExists = await RNFS.exists(`/data/user/0/com.cinepulse/files/${pictureId}`);
      if (!isExists) {
        await downloadImage(Url, pictureId);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const deleteImage = async (movieId: string) => {
    try {
      const isExists = await RNFS.exists(`/data/user/0/com.cinepulse/files/${movieId}`);
      if (isExists) {
        await RNFS.unlink(`/data/user/0/com.cinepulse/files/${movieId}`);
        console.log('File deleted successfully:', `/data/user/0/com.cinepulse/files/${movieId}`);
      }
    } catch (error) {
      console.log('Error deleting file:', error);
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
          console.log('The file saved to ', res.path());
          resolve(res.path());
        })
        .catch((error) => {
          console.log('Error downloading image:', error);
          reject(error);
        });
    });
  };

  const toastRef = useRef<ToastMethods>(null);
  const showSuccess = (type: string, text: string) => {
    toastRef.current?.show({
      type: type,
      text: text,
    })
  };

  const isReleased = (releaseDateString: any) => {
    if (releaseDateString) {
      const releaseDate = new Date(releaseDateString);
      return releaseDate <= new Date();
    }
    return false;
  };

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


  const fetchMovieDetailsCaller = async () => {
    try {
      const response = await fetchMovieDetails(movieId);
      if (response.data) {
        setMovieDetails(response.data);
      }
    } catch (error) {
      console.log('Error fetching movie details:', error);
    }
  }

  const fetchMovieCreditsCaller = async () => {
    try {
      const response = await fetchMovieCredits(movieId);
      if (response.data) {
        setCastDetails(response.data);
      }
    } catch (error) {
      console.log('Error fetching movie details:', error);
    }
  }

  const fetchSimilarMovieCaller = async () => {
    try {
      const response = await fetchSimilarMovie(movieId);
      if (response.data) {
        setSimilarMovies(filterAndSortMovies(response.data.results, adult, user.genrePref, user.langPref));
      }
    } catch (error) {
      console.log('Error fetching movie details:', error);
    }
  }

  const videoButtonCaller = () => {
    let videoQuery = movieTitle + ' ';
    if (movieDetails && castDetails && castDetails.cast && castDetails.cast.length >= 2) {
      const releaseYear = new Date(movieDetails.release_date).getFullYear().toString();
      const languages = movieDetails.spoken_languages.map(language => language.english_name).join(' ');
      const castNames = castDetails.cast.slice(0, 2).map(castMember => castMember.name).join(' ');
      videoQuery += `${releaseYear} ${languages} ${castNames}`;
    }
    props.navigation.push('VideoScreen', { movieId: movieId, movieTitle: movieTitle, query: videoQuery })
  }

  const submitRatingCaller = async () => {
    try {
      const response = await submitRating(movieId, rating);
      if (response.success) {
        showSuccess('success', `Rating Submitted: ${rating}`)
      } else {
        showSuccess('error', 'Rating Submission Failed')
      }
    } catch (error) {
      showSuccess('error', 'Rating Submission Failed')
    }
  }


  useEffect(() => {

    const movieId = props.route.params.movieId;

    const favFound = userSavedList.some((item: UserSavedListItem) => item.movieId === movieId && item.listName === 'favourites');
    if (favFound) setFabAdded(true);

    const watFound = userSavedList.some((item: UserSavedListItem) => item.movieId === movieId && item.listName === 'watchlist');
    if (watFound) setWatAdded(true);

    const alrFound = userSavedList.some((item: UserSavedListItem) => item.movieId === movieId && item.listName === 'already');
    if (alrFound) setAlrAdded(true);
  }, [props.route.params.movieId, userSavedList]);



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
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchMovieDetailsCaller(),
          fetchMovieCreditsCaller(),
          fetchSimilarMovieCaller(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setdn(true)
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await addtorecentlyviewed(movieId, movieTitle, authKey)
        await addUserRecentlyViewed({
          _id: `${(userRecentlyViewed.length) + 1}${user._id}`,
          createdAt: new Date().toISOString(),
          movieId: movieId,
          movieTitle: movieTitle,
          user: user._id
        })
      } catch (error) {
        console.log('movie recently viewed added')
      }
    };
    fetchData();
  }, [movieId]);


  useEffect(() => {
    if (dn && movieDetails && castDetails && movieDetails) {
      const currentDate = new Date();
      const releaseDate = movieDetails?.release_date ? new Date(movieDetails?.release_date) : null;

      const releaseStatus = releaseDate
        ? releaseDate < currentDate
          ? 'It was released on ' + releaseDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : 'is set to be released on ' + releaseDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : '';

      toSpeak = `
  ${movieDetails?.title} is a ${movieDetails?.genres?.length ? (movieDetails.genres.length > 3 ? movieDetails.genres.slice(0, 3).map(genre => genre.name).join(', ') : movieDetails.genres.map(genre => genre.name).join(', ')) : ''} film, ${releaseStatus}. ${movieDetails?.vote_average && movieDetails?.vote_average > 0 ? `and is rated ${movieDetails?.vote_average} on TMDB.` : ''}. ${movieDetails?.runtime ? `The movie runs for about ${Math.floor(movieDetails?.runtime / 60)} hours ${movieDetails?.runtime % 60} minutes.` : ''} ${movieDetails?.overview ? `Here's a quick overview: ${movieDetails?.overview}` : ''} ${movieDetails?.budget && movieDetails?.budget > 0 ? `The movie had a budget of ${(movieDetails.budget / 1000000).toFixed(2)} Million Dollar` : ''} ${movieDetails?.revenue && movieDetails?.revenue > 0 ? `and generated revenue of ${(movieDetails.revenue / 1000000).toFixed(2)} Million Dollar.` : ''} ${castDetails.cast.length > 3 ? `The top three cast members are ${castDetails.cast.slice(0, 3).map(cast => cast.name).join(', ')}.` : `The cast includes ${castDetails.cast.map(cast => cast.name).join(', ')}.`} ${castDetails?.crew.find(person => person.department === 'Directing' && person.job === 'Director') ? `It was directed by ${castDetails?.crew.find(person => person.department === 'Directing' && person.job === 'Director')!.name}.` : ''} ${movieDetails?.production_companies?.length && movieDetails.production_companies.length > 1 ? `Production houses involved include ${movieDetails.production_companies.map(company => company.name).join(', ')}.` : ''} ${similarMovies.length > 0 ? `Similar movies include ${similarMovies.slice(0, 2).map(movie => movie.title).join(' and ')}.` : ''}`;

      if (voiceFeature) {
        Tts.getInitStatus().then(() => {
          Tts.speak(toSpeak
          );
        });
      }
    }
    return () => { Tts.stop(); }
  }, [dn])

  const addToListCaller = async (listname: string) => {
    try {
      if (listname === 'favourites') {
        setFavLoad(true)
      }
      else if (listname === 'watchlist') {
        setWatLoad(true)
      }
      else if (listname === 'already') {
        setAlrLoad(true)
      }

      let moviedirector = ''
      castDetails?.crew.map((member, index) => {
        if (member.department === "Directing" && member.job === "Director") {
          moviedirector = member.name;
        }
      });
      const response = await addmovietolist(movieId, movieTitle, `${imageBaseUrl}${movieDetails?.poster_path}`, movieDetails?.vote_average, movieDetails?.overview, movieDetails?.release_date, movieDetails?.runtime, movieDetails?.production_countries.map(country => country.name).join(', '), movieDetails?.spoken_languages.map(language => language.english_name).join(', '), movieDetails?.revenue, moviedirector, movieDetails?.production_companies, castDetails?.cast.slice(0, 10), movieDetails?.genres, authKey, listname)
      if (response.success) {
        addUserOfflineMovieDetails({
          _id: `${userOfflineMovieDetails.length + 1}${user._id}`,
          movieId: movieId,
          movieTitle: movieTitle,
          movieImageLink: `${imageBaseUrl}${movieDetails?.poster_path}`,
          movieRating: movieDetails?.vote_average,
          movieOverview: movieDetails?.overview,
          movieReleasedDate: movieDetails?.release_date,
          movieRuntime: movieDetails?.runtime,
          movieCountryOfOrigin: movieDetails?.production_countries.map(country => country.name).join(', '),
          movieLanguage: movieDetails?.spoken_languages.map(language => language.english_name).join(', '),
          movieRevenue: movieDetails?.revenue,
          movieDirector: moviedirector,
          movieProductionCompany: movieDetails?.production_companies,
          movieCast: castDetails?.cast.slice(0, 10),
          movieGenre: movieDetails?.genres,
        })
        addUserSavedList({ _id: `${userSavedList.length + 1}${user._id}`, listName: listname, movieId, movieTitle, createdAt: new Date().toISOString(), user: user._id })

        addUserOfflineImageList({ _id: `${userOfflineImageList.length + 1}${user._id}`, pictureId: movieId, url: `${imageBaseUrl}${movieDetails?.poster_path}`, user: user._id })

        await requestStoragePermission(`${imageBaseUrl}${movieDetails?.poster_path}`, movieId)


      }
    } catch (error) {
      console.log('failed')
    } finally {
      if (listname === 'favourites') {
        setFavLoad(false)
        setFabAdded(true)
      }
      else if (listname === 'watchlist') {
        setWatLoad(false)
        setWatAdded(true)
      }
      else if (listname === 'already') {
        setAlrLoad(false)
        setAlrAdded(true)
      }
    }
  }

  const dltFrmLstCaller = async (listname: string) => {
    try {
      if (listname === 'favourites') {
        setFavLoad(true)
      }
      else if (listname === 'watchlist') {
        setWatLoad(true)
      }
      else if (listname === 'already') {
        setAlrLoad(true)
      }

      const response = await deleteMovieFromList(movieId, authKey, listname)
      if (response.success) {
        deleteMovieFromUserSavedList(movieId, listname)
        await deleteImage(movieId)
        if (listname === 'favourites') {
          setFabAdded(false)
        } else if (listname === 'watchlist') {

          setWatAdded(false)
        } else if (listname === 'already') {
          setAlrAdded(false)
        }
      }
    } catch (error) {
      console.log('error')
    } finally {

      if (listname === 'favourites') {
        setFavLoad(false)
      } else if (listname === 'watchlist') {

        setWatLoad(false)
      } else if (listname === 'already') {
        setAlrLoad(false)
      }
    }
  }
  const [imageSource, setImageSource] = useState({ uri: `file:///data/user/0/com.cinepulse/files/${movieId}` });

  const shareCaller = async () => {
    try {
      const result = await Share.share({
        message: share,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          showSuccess('success', 'Shared via ${result.activityType}')
        } else {
          showSuccess('success', 'Shared')
        }
      } else if (result.action === Share.dismissedAction) {
        showSuccess('error', 'Share dismissed')
      }
    } catch (error) {
      showSuccess('error', 'Error in Sharing')
    }
  }

  return (
    <>
      {!connectionStatus ? (
        hasMovieId(movieId) ? (
          <SafeAreaView style={isDarkMode ? styles.darkmoviescreenparentcon : styles.lightmoviescreenparentcon} >
            <StatusBar
              backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <HeaderBar title={movieTitle} isDark={isDarkMode} props={props} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
              paddingBottom: 2
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>

                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Image
                    source={imageSource}
                    onError={() => {
                      setImageSource(require('../assets/images/default-movie-poster.jpg'));
                    }}
                    style={{
                      width: screenWidth * 0.44,
                      height: screenWidth * 0.6,
                      borderRadius: 15,
                    }}
                  />
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 16, marginRight: 10 }}>Rating:</Text>
                    <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 }}>{offlineMovieDetailsItem?.movieRating && offlineMovieDetailsItem?.movieRating.includes('.')
                      ? offlineMovieDetailsItem?.movieRating.split('.')[0] + '.' + offlineMovieDetailsItem?.movieRating.split('.')[1].charAt(0)
                      : offlineMovieDetailsItem?.movieRating
                    }</Text>
                    <StarIcon fill={'#D4AF37'} size={17} style={{ marginLeft: 3, marginBottom: 5 }} />
                  </View>
                </View>

                <View style={{ marginLeft: 17, flexDirection: 'row', flexWrap: 'wrap', width: screenWidth * 0.5 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 18, marginRight: 10 }}>Runtime:</Text>
                    <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 17 }}>
                      {offlineMovieDetailsItem?.movieRuntime !== undefined
                        ? `${Math.floor(offlineMovieDetailsItem.movieRuntime / 60)}h ${offlineMovieDetailsItem.movieRuntime % 60}m`
                        : 'NA'
                      }</Text>
                  </View>

                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 18, marginRight: 10 }}>Released Date:</Text>
                    <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 17 }}>
                      {offlineMovieDetailsItem?.movieReleasedDate && (
                        new Date(offlineMovieDetailsItem.movieReleasedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      )}</Text>

                  </View>

                  <View style={{}}>
                    <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 18, marginRight: 10 }}>Genres:</Text>
                    <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 17 }}>
                      {offlineMovieDetailsItem?.movieGenre.map((genre: GenreItem) => genre.name).join(', ')}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ marginTop: 5, alignItems: 'center' }}>
                <Text style={{ fontFamily: FONTFAMILY.poppins_medium, fontSize: 15, marginLeft: 9, marginRight: 9, textAlign: 'justify', color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2 }}>{offlineMovieDetailsItem?.movieOverview}</Text>
              </View>

              <View style={{ marginTop: 5 }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginTop: 5, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Spoken Languages:</Text>
                <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, marginLeft: 10, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 }}>{offlineMovieDetailsItem?.movieLanguage}</Text>
              </View>



              <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Revenue:</Text>
                <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, marginLeft: 10, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>${(offlineMovieDetailsItem?.movieRevenue ? (parseFloat(offlineMovieDetailsItem.movieRevenue) / 1000000).toFixed(2) : 'N/A')}M</Text>
              </View>


              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Directed By:</Text>
                <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, marginLeft: 10, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>{offlineMovieDetailsItem?.movieDirector}</Text>
              </View>

              <View style={{ marginTop: 5 }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginTop: 5, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Cast:</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 15 }}>
                  {
                    offlineMovieDetailsItem?.movieCast && offlineMovieDetailsItem?.movieCast.slice(0, 20).map((person, index) => {
                      return (
                        <View key={index} style={{ flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                          <UserCircleIcon fill={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange} size={17} style={{ marginRight: 5 }} />
                          <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_medium, fontSize: 16 }}>{person.character.length > 10 ? person.character.slice(0, 10) + '..' : person.character}{', '}{person.name}</Text>
                        </View>
                      )
                    })
                  }
                </ScrollView>
              </View>

              <View style={{ marginTop: 5 }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginTop: 5, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Production Companies:</Text>
                <View>
                  {
                    offlineMovieDetailsItem && offlineMovieDetailsItem.movieProductionCompany ? (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 15 }}>
                        {offlineMovieDetailsItem.movieProductionCompany.map((company, index) => {
                          return (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <FilmIcon fill={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange} size={17} style={{ marginRight: 5 }} />
                              <Text style={{ color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, fontSize: 16, marginRight: 10 }}>{company.name}</Text>
                            </View>
                          );
                        })
                        }
                      </ScrollView>
                    ) : (
                      <Text style={{ textAlign: 'center', marginTop: 10 }}>Production companies not available</Text>
                    )}
                </View>
              </View>

              <View style={{ marginTop: 5, flexWrap: 'wrap' }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginTop: 5, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Production Countries:</Text>
                <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, marginLeft: 10, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 }}>{offlineMovieDetailsItem?.movieCountryOfOrigin}</Text>
              </View>

              <View style={{ marginTop: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange }}>
                <Icon name="wifi-off" size={18} color={isDarkMode ? COLORS.darkText1 : COLORS.lightText1} />
                <Text style={{ marginLeft: 10, color: isDarkMode ? COLORS.darkText1 : COLORS.lightText1, fontFamily: FONTFAMILY.poppins_bold, fontSize: 17 }}>You Are Seeing An Offline Version</Text>
              </View>

            </ScrollView>
          </SafeAreaView>
        ) : (
          <OfflineScreen />
        )
      ) : loading ? (
        <ShimmerLoaderMovie />
      ) : (
        <>
          <Toast ref={toastRef} />
          <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={
              isDarkMode ? {
                zIndex: 10,
                alignSelf: 'center',
                height: screenWidth * 0.75,
                width: screenWidth * 0.9,
                backgroundColor: COLORS.darkBackground,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: COLORS.secondaryDarkYellow
              } : {
                zIndex: 10,
                alignSelf: 'center',
                height: screenWidth * 0.8,
                width: screenWidth * 0.9,
                backgroundColor: COLORS.lightBackground,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: COLORS.primaryDarkOrange
              }
            }>
              <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_bold, fontSize: 23 }}>Manage Your list</Text>

              <View style={{ margin: 10 }}>

                <Button
                  style={{ margin: 10 }}
                  labelStyle={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 15 }}
                  buttonColor={fabAdded ? COLORS.primaryDarkOrange : COLORS.secondaryDarkYellow}
                  rippleColor={!fabAdded ? `${COLORS.primaryDarkOrange}50` : `${COLORS.secondaryDarkYellow}50`}
                  textColor={!fabAdded ? COLORS.darkText1 : COLORS.lightText1}
                  loading={fabLoad}
                  icon="heart"
                  mode="contained"
                  onPress={() => {
                    if (fabAdded) {
                      dltFrmLstCaller('favourites')
                    }
                    else {
                      addToListCaller('favourites')
                    }
                  }}>
                  {!fabAdded ? 'Add To Favourites' : 'Delete From Favourites'}
                </Button>

                <Button
                  style={{ margin: 10 }}
                  labelStyle={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 15 }}
                  buttonColor={watAdded ? COLORS.primaryDarkOrange : COLORS.secondaryDarkYellow}
                  rippleColor={!watAdded ? `${COLORS.primaryDarkOrange}50` : `${COLORS.secondaryDarkYellow}50`}
                  textColor={!watAdded ? COLORS.darkText1 : COLORS.lightText1}
                  loading={watLoad}
                  icon="clock"
                  mode="contained"
                  onPress={() => {
                    if (watAdded) {
                      dltFrmLstCaller('watchlist')
                    }
                    else {
                      addToListCaller('watchlist')
                    }
                  }}>
                  {!watAdded ? 'Add To Watchlist' : 'Delete From Watchlist'}
                </Button>

                <Button
                  style={{ margin: 10 }}
                  labelStyle={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 15 }}
                  buttonColor={alrAdded ? COLORS.primaryDarkOrange : COLORS.secondaryDarkYellow}
                  rippleColor={!alrAdded ? `${COLORS.primaryDarkOrange}50` : `${COLORS.secondaryDarkYellow}50`}
                  textColor={!alrAdded ? COLORS.darkText1 : COLORS.lightText1}
                  loading={alrLoad}
                  icon="bookmark"
                  mode="contained"
                  onPress={() => {
                    if (alrAdded) {
                      dltFrmLstCaller('already')
                    }
                    else {
                      addToListCaller('already')
                    }
                  }}>
                  {!alrAdded ? 'Add To Already Watched' : 'Delete From Already Watched'}
                </Button>

              </View>


            </Modal>

          </Portal>

          <Portal>
            <Modal visible={visible2} onDismiss={hideModal2} contentContainerStyle={
              isDarkMode ? {
                zIndex: 10,
                alignSelf: 'center',
                height: screenWidth * 0.5,
                width: screenWidth * 0.75,
                backgroundColor: COLORS.darkBackground,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: COLORS.secondaryDarkYellow
              } : {
                zIndex: 10,
                alignSelf: 'center',
                height: screenWidth * 0.5,
                width: screenWidth * 0.75,
                backgroundColor: COLORS.lightBackground,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: COLORS.primaryDarkOrange
              }
            }>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_bold, fontSize: 23 }}>Share</Text>
                <IoniconsIcon name="heart" size={28} color={'red'} />
              </View>
              <View style={{ backgroundColor: isDarkMode ? `${COLORS.primaryDarkOrange}30` : `${COLORS.secondaryDarkYellow}30`, margin: 5, borderRadius: 10 }}>
                <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15, textAlign: 'center' }}>{share}</Text>
              </View>


              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                <Button
                  style={{ margin: 10 }}
                  labelStyle={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 15 }}
                  buttonColor={watAdded ? COLORS.primaryDarkOrange : COLORS.secondaryDarkYellow}
                  rippleColor={!watAdded ? `${COLORS.primaryDarkOrange}50` : `${COLORS.secondaryDarkYellow}50`}
                  textColor={!watAdded ? COLORS.darkText1 : COLORS.lightText1}
                  loading={watLoad}
                  icon="share"
                  mode="contained"
                  onPress={() => {
                    shareCaller();
                  }}>
                  Share
                </Button>
              </View>

            </Modal>
          </Portal>


          <SafeAreaView style={isDarkMode ? styles.darkmoviescreenparentcon : styles.lightmoviescreenparentcon} >
            <StatusBar
              backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <HeaderBar title={movieTitle} isDark={isDarkMode} props={props} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
              paddingBottom: 10
            }}>

              <View>
                <ImageBackground
                  style={{ alignSelf: 'center', width: screenWidth, height: screenWidth * 0.6 }}
                  source={
                    movieDetails?.backdrop_path
                      ? { uri: `${imageBaseUrl}${movieDetails.backdrop_path}` }
                      : require('../assets/images/default-movie-background.jpg')
                  }>
                  {isDarkMode ? (
                    <LinearGradient
                      colors={['#00000000', '#000000']}
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <LinearGradient
                      colors={['#FFFFFF00', '#FFFFFF']}
                      style={{ flex: 1 }}
                    />
                  )}
                </ImageBackground>

                <View style={{ alignItems: 'flex-end', top: -screenWidth * 0.09 }}>

                  <View style={{ flexDirection: 'row' }}>

                    <TouchableOpacity>
                      <ShareIcon fill={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange} size={25} style={{ marginRight: 7.5, marginLeft: 7.5 }} onPress={showModal2} />
                    </TouchableOpacity>
                    {
                      watAdded ? (
                        <TouchableOpacity>
                          <ClockIcon fill={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange} size={23} style={{ marginRight: 7.5, marginLeft: 7.5 }} onPress={showModal} disabled={!connectionStatus} />
                        </TouchableOpacity>
                      ) : (<></>)
                    }
                    {
                      alrAdded ? (
                        <TouchableOpacity>
                          <BookmarkIcon fill={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange} size={23} style={{ marginRight: 7.5, marginLeft: 7.5 }} onPress={showModal} disabled={!connectionStatus} />
                        </TouchableOpacity>
                      ) : (<></>)
                    }
                    {
                      fabAdded ? (
                        <TouchableOpacity>
                          <HeartIcon fill={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange} size={23} style={{ marginRight: 7.5, marginLeft: 7.5 }} onPress={showModal} disabled={!connectionStatus} />
                        </TouchableOpacity>
                      ) : (<></>)
                    }
                    {
                      (!fabAdded && !watAdded && !alrAdded) ? (
                        <TouchableOpacity>
                          <QueueListIcon fill={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange} size={23} style={{ marginRight: 7.5, marginLeft: 7.5 }} onPress={showModal} disabled={!connectionStatus} />
                        </TouchableOpacity>
                      ) : (<></>)
                    }
                  </View>
                </View>

                <View style={{ flexDirection: 'row', left: screenWidth * 0.45 + 5, top: -screenWidth * 0.05 }}>
                  <View style={{ marginRight: screenWidth * 0.07 }}>
                    {isReleased(movieDetails?.release_date) ? (
                      <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14 }}>Released</Text>
                    ) : (
                      <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14 }}>Yet to be released</Text>
                    )}
                  </View>

                  <View style={{ marginRight: screenWidth * 0.07 }}>
                    <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14 }}>
                      {movieDetails?.release_date ? new Date(movieDetails.release_date).getFullYear().toString() : ''}
                    </Text>
                  </View>

                  <View >
                    <Text style={{
                      color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2,
                      fontFamily: FONTFAMILY.poppins_regular,
                      fontSize: 14
                    }}>
                      {movieDetails?.runtime !== undefined
                        ? `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m`
                        : 'NA'
                      }
                    </Text>
                  </View>

                </View>

                <View style={{ flexDirection: 'row', left: screenWidth * 0.45 + 5, top: -screenWidth * 0.05, alignItems: 'center' }}>
                  <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 16, marginRight: 10 }}>Rating:</Text>
                  <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 }}>{movieDetails?.vote_average.toFixed(1)}</Text>
                  <StarIcon fill={'#D4AF37'} size={17} style={{ marginLeft: 3, marginBottom: 5 }} />
                </View>

                <View style={{ left: screenWidth * 0.45 + 5, top: -screenWidth * 0.05, marginTop: 10, alignContent: 'center' }}>
                  <TouchableOpacity onPress={() => { videoButtonCaller() }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '40%', borderRadius: 20, borderWidth: 2, borderColor: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange }}>
                      <PlayCircleIcon fill={isDarkMode ? COLORS.lightText1 : COLORS.darkText1} size={30} style={{ marginLeft: 3, marginBottom: 5 }} />
                      <Text style={{ color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, fontSize: 17, marginLeft: 8 }}>Play Videos</Text>
                    </View>
                  </TouchableOpacity>
                </View>


                <Image
                  source={
                    movieDetails?.poster_path
                      ? { uri: `${imageBaseUrl}${movieDetails.poster_path}` }
                      : require('../assets/images/default-movie-poster.jpg')
                  }
                  style={{
                    marginTop: -screenWidth * 0.62,
                    marginLeft: 15,
                    width: screenWidth * 0.4,
                    height: screenHeight * 0.3,
                    borderRadius: 15,
                  }}
                />

              </View>

              <View style={{ marginTop: 10, alignItems: 'center' }}>
                <Text style={{ fontFamily: FONTFAMILY.poppins_medium, fontSize: 14, marginLeft: 9, marginRight: 9, textAlign: 'justify', color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2 }}>{movieDetails?.overview}</Text>
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginTop: 5, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Genres:</Text>
                <View style={{ flexDirection: 'row', marginLeft: 10, flexWrap: 'wrap' }}>
                  {movieDetails?.genres.map(genre => (
                    <View key={genre.id} style={{ backgroundColor: isDarkMode ? `${COLORS.secondaryDarkYellow}20` : `${COLORS.primaryDarkOrange}20`, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, marginRight: 10 }}>
                      <Text style={{ color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_regular }}>{genre.name}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginTop: 5, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Spoken Languages:</Text>
                <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, marginLeft: 10, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 }}>{movieDetails?.spoken_languages.map(language => language.english_name).join(', ')}</Text>
              </View>

              <View style={{ marginBottom: 10 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Released Date:</Text>
                  <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, marginLeft: 10, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>{movieDetails?.release_date ? new Date(movieDetails.release_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Budget:</Text>
                  <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, marginLeft: 10, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>${(movieDetails?.budget ? (movieDetails.budget / 1000000).toFixed(2) : 'N/A')}M</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Revenue:</Text>
                  <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, marginLeft: 10, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>${(movieDetails?.revenue ? (movieDetails.revenue / 1000000).toFixed(2) : 'N/A')}M</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Directed By:</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {castDetails.crew &&
                      castDetails.crew.map((member, index) => {
                        if (member.department === "Directing" && member.job === "Director") {
                          return (
                            <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, marginLeft: 10, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }} key={index}>{member.name}</Text>
                          );
                        }
                        return null;
                      })}
                  </View>
                </View>

              </View>

              <View style={{ marginBottom: 10, flexWrap: 'wrap' }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginTop: 5, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Production Countries:</Text>
                <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, marginLeft: 10, fontFamily: FONTFAMILY.poppins_regular, fontSize: 15 }}>{movieDetails?.production_countries.map(country => country.name).join(', ')}</Text>
              </View>


              <View style={{ marginBottom: 10 }}>

                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginTop: 5, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Top Cast:</Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 15 }}>

                  {
                    castDetails.cast && castDetails.cast.slice(0, 20).map((person, index) => {
                      return (
                        <TouchableOpacity key={index} style={{ margin: 5, alignItems: 'center' }} onPress={() => { props.navigation.push('CastDetailsScreen', { castId: person.id, castName: person.name }) }}>
                          <Image
                            source={
                              person.profile_path
                                ? { uri: `${imageBaseUrl}${person.profile_path}` }
                                : require('../assets/images/cast-default.png')
                            }
                            style={{
                              width: 100,
                              height: 100,
                              borderRadius: 50,
                              resizeMode: 'cover'
                            }}
                          />
                          <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_medium, fontSize: 12 }}>{person.character.length > 10 ? person.character.slice(0, 10) + '..' : person.character}</Text>
                          <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 12 }}>{person.name.length > 10 ? person.name.slice(0, 10) + '..' : person.name}</Text>

                        </TouchableOpacity>
                      )
                    })
                  }

                </ScrollView>
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginTop: 5, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Production Companies:</Text>
                <View>
                  {movieDetails && movieDetails.production_companies && movieDetails.production_countries ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 15 }}>
                      {movieDetails.production_companies.map((company, index) => {
                        const countryName = movieDetails.production_countries.find(country => country.iso_3166_1 === company.origin_country)?.name;
                        return (
                          <View key={index} style={{ margin: 10, flexDirection: 'row' }}>
                            <Image
                              source={company.logo_path ? { uri: `https://image.tmdb.org/t/p/w200${company.logo_path}` } : require('../assets/images/default-pro-com.jpg')}
                              style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 1, marginRight: 10, borderColor: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, resizeMode: 'contain' }}
                            />
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                              <Text style={{ color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, fontSize: 13 }}>{company.name}</Text>
                              <Text style={{ color: isDarkMode ? COLORS.lightText2 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 12 }}>{countryName}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>Production companies not available</Text>
                  )}
                </View>
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginTop: 5, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Rate:</Text>

                <View>
                  <AirbnbRating
                    count={5}
                    defaultRating={0}
                    onFinishRating={(rating: any) => { setRating(rating * 2) }}
                    reviewSize={14}
                    ratingContainerStyle={{ width: screenWidth - 80, alignSelf: 'center' }}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 10 }}>
                    <Text style={{ color: isDarkMode ? COLORS.lightText1 : COLORS.darkText2, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14 }}>Your Rating: {rating}</Text>
                    <TouchableOpacity onPress={() => { submitRatingCaller() }}>
                      <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_regular, fontSize: 14 }}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>


              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, marginTop: 5, marginLeft: 10, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>Similar:</Text>
                {
                  similarMovies ?
                    (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 15 }}>
                        {similarMovies.map((item, index) => {
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
        </>
      )}
    </>
  )
}


const styles = StyleSheet.create({
  darkmoviescreenparentcon: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: COLORS.darkBackground
  },
  lightmoviescreenparentcon: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: COLORS.lightBackground
  },
})
export default MovieDetailsScreen