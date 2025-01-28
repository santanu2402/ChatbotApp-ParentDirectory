import * as React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Dimensions, Text, View, Pressable } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import LoadingScreen from '../components/LoadingScreen'
import { useStore } from '../store/store';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY } from '../theme/theme';
import Carousel, { AdditionalParallaxProps, ParallaxImage } from 'react-native-snap-carousel';
import RNFS from 'react-native-fs';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import LottieView from 'lottie-react-native';
import { Modal, Portal, Button } from 'react-native-paper';
import Toast, { ToastMethods } from '../components/Toast/Toast';
import { deleteMovieFromList } from '../data/onlinedb/expressApi';
import NetInfo from '@react-native-community/netinfo';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface UserSavedItem {
  __v: number;
  _id: string;
  listName: string;
  movieId: string;
  movieTitle: string;
  user: string;
  createdAt:string;
}

const ListScreen = (props: any) => {

  const [connectionStatus, setConnectionStatus] = React.useState(true);
  React.useEffect(() => {
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
    console.log(state);
  };


  const toastRef = React.useRef<ToastMethods>(null);

  const showSuccess = (type: string, text: string) => {
    toastRef.current?.show({
      type: type,
      text: text,
    })
  };

  const [modalId, setModalId] = React.useState('');
  const [modalTitle, setModalTitle] = React.useState('');


  const [visible, setVisible] = React.useState(false);
  const [delLoad, setDelLoad] = React.useState(false);
  const showModal = (movieId:string,movieTitle:string) => {
    setModalId(movieId)
    setModalTitle(movieTitle)
    setVisible(true)};
  const hideModal = () => setVisible(false);




  const [filterFavSavedList, setFilterFavSavedList] = React.useState<UserSavedItem[]>([]);
  const [filterWatSavedList, setFilterWatSavedList] = React.useState<UserSavedItem[]>([]);
  const [filterAlrSavedList, setFilterAlrSavedList] = React.useState<UserSavedItem[]>([]);


  const imageExistenceMap = new Map<string, boolean>();
  const tabBarHeight = useBottomTabBarHeight();
  const carouselRef = React.useRef(null);


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


const pressDelHandler= async (listName:string)=>{
  try{
    setDelLoad(true)
    hideModal()

    const response = await deleteMovieFromList(modalId, authKey, listName)
    if (response.success) {
      deleteMovieFromUserSavedList(modalId, listName)
      await deleteImage(modalId)
      showSuccess('success',`${modalTitle} Deleted Successfully.`)
    }
    else{
      showSuccess('error',`${modalTitle} Unable To Delete.`)
    }

  }catch(e){
    console.log(e)
  }finally{
    setDelLoad(false)
  }

  
  console.log('yes pressed',listName,modalId,modalTitle)
  
}


  const renderItem = ({ item }: { item: any }, parallaxProps?: AdditionalParallaxProps) => {
    const imageSource = imageExistenceMap.get(item.movieId)
      ? { uri: `file:///data/user/0/com.cinepulse/files/${item.movieId}` }
      : require('../assets/images/default-movie-background.jpg');

    console.log('call from renderitem', imageSource)

    return (

      <>
      
        {
          visible ?
            (
              <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={
                  isDarkMode ? {
                    zIndex: 10,
                    alignItems:'center',
                    justifyContent:'center',
                    alignSelf: 'center',
                    height: screenWidth * 0.5,
                    width: screenWidth * 0.75,
                    backgroundColor: COLORS.darkBackground,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: COLORS.secondaryDarkYellow
                  } : {
                    zIndex: 10,
                    alignItems:'center',
                    justifyContent:'center',
                    alignSelf: 'center',
                    height: screenWidth * 0.5,
                    width: screenWidth * 0.75,
                    backgroundColor: COLORS.lightBackground,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: COLORS.primaryDarkOrange
                  }
                }>
                  <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20, borderBottomWidth: 1, borderBottomColor: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange,marginBottom:10 }}>Are You Sure</Text>

                  <Text style={{ marginLeft:5,marginRight:5,textAlign: 'center', color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, fontSize: 17 }}>{`Do You Want To Delete ${modalTitle} from ${item.listName === 'favourites' ? 'Favourites' : item.listName === 'watchlist' ? 'Watchlist' : 'Already Watched'}`}</Text>

                  <View style={{ margin: 10 }}>


                    <Button
                      style={{alignSelf:'center' }}
                      labelStyle={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 20  }}
                      buttonColor={isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange}
                      textColor={isDarkMode ? COLORS.darkText1 : COLORS.lightText1}
                      loading={delLoad}
                      icon="trash-can-outline"
                      mode="contained"
                      onPress={() => {
                        pressDelHandler(item.listName)
                      }}>
                      Yes
                    </Button>

                  </View>
                </Modal>
              </Portal>)
            :
            (
              <Pressable  onLongPress={()=>{(connectionStatus)?showModal(item.movieId,item.movieTitle):console.error('Internet Connection Needed')}} onPress={() => { props.navigation.push('MovieDetailsScreen', { movieId: item.movieId, movieTitle: item.movieTitle }) }}>

                <View style={styles.item}>
                  <ParallaxImage
                    source={{ uri: `file:///data/user/0/com.cinepulse/files/${item.movieId}` }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                  />

                  <Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 } : { color: COLORS.darkText2, marginLeft: 20, fontFamily: FONTFAMILY.poppins_medium, fontSize: 14 }} numberOfLines={1}>
                    {item.movieTitle}
                  </Text>
                  {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
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
              </View> */}

                </View>

              </Pressable>
            )
        }



      </>



    );
  };

  const [value, setValue] = React.useState('');

  const isDarkMode = useStore((state: any) => state.isDarkMode);
  const user = useStore((state: any) => state.user);
  const userSavedList = useStore((state: any) => state.userSavedList);
  const deleteMovieFromUserSavedList = useStore((state: any) => state.deleteMovieFromUserSavedList);
  const authKey = useStore((state: any) => state.authKey);


  React.useEffect(() => {
const filteredFavList = userSavedList
  .filter((item: UserSavedItem) => item.listName === 'favourites')
  .sort((a: UserSavedItem, b: UserSavedItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
const filteredWatchList = userSavedList
  .filter((item: UserSavedItem) => item.listName === 'watchlist')
  .sort((a: UserSavedItem, b: UserSavedItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
const filteredAlreadyList = userSavedList
  .filter((item: UserSavedItem) => item.listName === 'already')
  .sort((a: UserSavedItem, b: UserSavedItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
setFilterFavSavedList(filteredFavList);
setFilterWatSavedList(filteredWatchList);
setFilterAlrSavedList(filteredAlreadyList);
  }, [userSavedList])

  return (
    <>
      {
        filterFavSavedList.length > 0 && filterWatSavedList.length > 0 && filterAlrSavedList.length > 0 ?
          (<SafeAreaView style={{ marginBottom: tabBarHeight, backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground, flex: 1, alignItems: 'center' }}>

            <StatusBar
              backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <Toast ref={toastRef} />
            <HeaderBar title={'Saved List'} isDark={isDarkMode} props={props} />

            <SegmentedButtons
              density='regular'
              theme={{ colors: isDarkMode ? { secondaryContainer: COLORS.secondaryDarkYellow } : { secondaryContainer: `${COLORS.primaryDarkOrange}30` } }}
              value={value}
              onValueChange={setValue}
              buttons={[
                {
                  icon: 'heart',
                  value: 'fav',
                  label: 'Favourite',
                  checkedColor: isDarkMode ? COLORS.darkText1 : COLORS.lightText1,
                  uncheckedColor: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange,
                },
                {
                  icon: 'clock',
                  value: 'wat',
                  label: 'Watch-List',
                  checkedColor: isDarkMode ? COLORS.darkText1 : COLORS.lightText1,
                  uncheckedColor: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange
                },
                {
                  icon: 'bookmark',
                  value: 'alr',
                  label: 'Watched',
                  checkedColor: isDarkMode ? COLORS.darkText1 : COLORS.lightText1,
                  uncheckedColor: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange
                },
              ]}
            />
            <Text style={{ textAlign: 'center', color: isDarkMode ? COLORS.lightText1 : COLORS.darkText1, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>{value === 'fav' ? 'Favourites' : value === 'wat' ? 'Watchlist' : 'Already Watched'}</Text>
            {
              value === 'fav' ?
                (
                  <View>
                    {
                      filterFavSavedList ?
                        (
                          <View style={styles.container}>
                            <Carousel
                              ref={carouselRef}
                              sliderWidth={screenWidth}
                              sliderHeight={screenWidth * 0.8}
                              itemWidth={screenWidth - 60}
                              data={filterFavSavedList}
                              renderItem={renderItem}
                              hasParallaxImages={true}
                            />
                          </View>
                        ) : (
                          <View><Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold } : { color: COLORS.darkText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold }}>No Data Available</Text></View>
                        )
                    }
                  </View>)
                : value === 'wat' ?
                  (
                    <View>
                      {
                        filterWatSavedList ?
                          (
                            <View style={styles.container}>
                              <Carousel
                                ref={carouselRef}
                                sliderWidth={screenWidth}
                                sliderHeight={screenWidth * 0.8}
                                itemWidth={screenWidth - 60}
                                data={filterWatSavedList}
                                renderItem={renderItem}
                                hasParallaxImages={true}
                              />
                            </View>
                          ) : (
                            <View><Text style={isDarkMode ? { color: COLORS.lightText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold } : { color: COLORS.darkText2, textAlign: 'center', fontFamily: FONTFAMILY.poppins_bold }}>No Data Available</Text></View>
                          )
                      }
                    </View>
                  )
                  :
                  (
                    <View>
                      {
                        filterAlrSavedList ?
                          (
                            <View style={styles.container}>
                              <Carousel
                                ref={carouselRef}
                                sliderWidth={screenWidth}
                                sliderHeight={screenWidth * 0.8}
                                itemWidth={screenWidth - 60}
                                data={filterAlrSavedList}
                                renderItem={renderItem}
                                hasParallaxImages={true}
                              />
                            </View>
                          ) : (
                            <View style={{ alignItems: 'center' }}>
                              <LottieView style={{ width: screenWidth, height: screenWidth }} source={require('../lottie/no-data-found.json')} autoPlay loop />
                            </View>
                          )
                      }
                    </View>)}
          </SafeAreaView>)
          :
          (<LoadingScreen Message='Loading Your Lists...' />)

      }
    </>



  )
}


const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 15,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
  },
  container: {
    width: screenWidth,
    height: screenHeight
  },
  item: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.7,
  },

})
export default ListScreen