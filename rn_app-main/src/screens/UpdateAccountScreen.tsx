import { StatusBar, Image, TouchableWithoutFeedback, Keyboard, StyleSheet, Text, View, Animated, TouchableOpacity, TextInput, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, FONTFAMILY } from '../theme/theme';
import { EnvelopeIcon, CalendarIcon, UserCircleIcon, CheckCircleIcon, ExclamationCircleIcon } from 'react-native-heroicons/solid'
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import { useStore } from '../store/store';
import DropDownPicker from 'react-native-dropdown-picker'
import DatePicker from 'react-native-date-picker'

import NetInfo from '@react-native-community/netinfo';

import OfflineScreen from '../components/OfflineScreen';
import LoadingScreen from '../components/LoadingScreen';
import { offlinedatafetch, userupdate } from '../data/onlinedb/expressApi';

import Toast, { ToastMethods } from '../components/Toast/Toast';

const UpdateAccountScreen = (props: any) => {

  const toastRef = useRef<ToastMethods>(null);

  const showSuccess = (type: string, text: string) => {
    toastRef.current?.show({
      type: type,
      text: text,
    })
  };

  const [connectionStatus, setConnectionStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const user = useStore((state: any) => state.user);
  const addUser = useStore((state: any) => state.addUser);

  useEffect(() => {

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        setKeyboardHeight(keyboardHeight);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
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

  const itemsGender = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Others', value: 'Others' },
  ]
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

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const authKey = useStore((state: any) => state.authKey);

  const [name, setName] = useState(user.name);
  const [nameVerify, setNameVerify] = useState(false);
  const [nameError, setNameError] = useState(false);

  const [email, setEmail] = useState(user.user.email);
  const [emailVerify, setEmailVerify] = useState(true);
  const [emailError, setEmailError] = useState(false);

  const [imageData, setImageData] = useState<any>();
  const [imgDownloadUrl, setImgDownloadUrl] = useState<string>('');
  const [chooseImage, setchooseimage] = useState(false);

  const [date, setDate] = useState(new Date(user.dateOfBirth))
  const [open, setOpen] = useState(false)
  const [stringDate, setStringDate] = useState(formatDate(new Date(user.dateOfBirth)))

  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [currentGenderValue, setCurrentGenderValue] = useState(user.gender);

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguageValue, setCurrentLanguageValue] = useState(user.langPref);

  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [currentGenreValue, setCurrentGenreValue] = useState(user.genrePref);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const [imageError, setImageError] = useState(false);

  const value = useState(new Animated.ValueXY({ x: -710, y: 0 }))[0];

  useEffect(() => {
    Animated.timing(value, {
      toValue: { x: screenWidth * 1.7, y: 0 },
      duration: 100000,
      useNativeDriver: false,
    }).start();
  }, []);

  const deleteImage = async () => {
    try {
      const response = await storage().ref(`/profilephoto/${authKey}_profile.jpg`).delete();
    } catch (err) {
      console.log(err);
    }
  };
  async function handelSubmit() {
    try {
      setLoading(true)

      let url = null;

      if (chooseImage && imageData) {
        await deleteImage()
        url = await uploadImage();
      }
      const response = await userupdate(name, currentGenderValue, email, date, url, currentLanguageValue, currentGenreValue, chooseImage,authKey);
      if (response.success) {
        const response2 = await offlinedatafetch(authKey);
        if (response2.success) {
          addUser(response2.data[0]);
          setLoading(false)
          props.navigation.replace('SuccessErrorScreen', {
            screen: 'AccountScreen',
            type: 'success',
            message: response.message
          });
        } else {
          setLoading(false)
          showSuccess('error', 'Failed Updating Your Profile')
        }
      }
      else {
        setLoading(false)
        showSuccess('error', response.message)
      }
    } catch (err) {
      console.log('try catch error')
      setLoading(false)
      showSuccess('error', 'Failed Updating Your Profile')
    }
  }

  function handleName(e: any) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
    setNameVerify(false);
    if (nameVar.length >= 3 || nameVar.length == 0) {
      setName(nameVar);
      setNameVerify(true);
      setNameError(false);
    } else {
      setNameError(true);
    }
  }

  function handleEmail(e: any) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
      setEmail(emailVar);
      setEmailVerify(true);
      setEmailError(false);
    }
    else {
      setEmailError(true);
    }
  }

  const pickImage = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        copyTo: 'cachesDirectory'
      });
      setImageData(response);
      setchooseimage(true);
    } catch (err) {
      console.log(err);
    }
  };

  const uploadImage = async () => {
    try {
      if (!imageData) {
        console.log('No image selected');
        return;
      }
      const response = storage().ref(`/profilephoto/${authKey}_picture.jpg`);
      const url: string = await response.getDownloadURL();
      setImgDownloadUrl(url);
      return url;
    } catch (err) {
      console.log(err);
    }
  };



  return (

    <>
      <Toast ref={toastRef} />
      {!connectionStatus ? (
        <OfflineScreen />
      ) : loading ? (
        <LoadingScreen Message="Account Creation Is In Process" />
      ) : (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ width: screenWidth, height: screenHeight, backgroundColor: COLORS.darkBackground, justifyContent: 'center', alignItems: 'center' }}>

            <StatusBar
              backgroundColor={COLORS.darkBackground}
              barStyle='light-content'
            />

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Animated.Image
                source={require('../assets/images/sign_in_up_add_inf_bg_img.png')}
                style={[{ resizeMode: 'contain' }, value.getLayout()]}
              />

              <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                  <View style={{ width: screenWidth * 0.95, height: 'auto', backgroundColor: 'rgba(8,8,8,0.6)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_black, fontSize: 30 }}>Update Information</Text>


                    <View style={styles.action}>

                      <EnvelopeIcon fill={COLORS.primaryDarkOrange} style={styles.smallIcon} />

                      <TextInput
                        placeholder="Email"
                        style={styles.textInput}
                        onChange={e => handleEmail(e)}
                        value={email}
                      />
                      {email.length < 1 ? null : emailVerify ? (
                        <CheckCircleIcon fill={COLORS.successBackground} size={20} />
                      ) : (
                        <ExclamationCircleIcon fill={COLORS.errorBackground} size={20} />
                      )}
                    </View>
                    {email.length < 1 ? null : emailVerify ? null : (
                      <Text
                        style={{
                          color: COLORS.errorBackground,
                        }}>
                        <ExclamationCircleIcon
                          fill={COLORS.errorBackground} size={20} />
                        Enter Proper Email Address
                      </Text>
                    )}


                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

                      <Image
                        style={{ height: 120, width: 120, borderRadius: 60, margin: 10, marginRight: 30, resizeMode: 'cover' }}
                        source={imageError ? ((user.gender == 'Male') ? require('../assets/images/user-default-male.png') : require('../assets/images/user-default-female.png')) : { uri: `file:///data/user/0/com.cinepulse/files/${user.user._id}profile` }}
                        onError={() => setImageError(true)}
                      />

                      <TouchableOpacity style={{ borderColor: COLORS.secondaryDarkYellow, borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }} onPress={pickImage}>
                        <Text style={{ color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_medium, margin: 5 }}>Choose Image</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.action}>
                      <UserCircleIcon fill={COLORS.secondaryDarkYellow} style={styles.smallIcon} />
                      <TextInput
                        placeholder="Name"
                        style={styles.textInput}
                        onChange={e => handleName(e)}
                        value={name}
                      />
                      {name.length >= 3 ? null : nameVerify ? (
                        <CheckCircleIcon fill={COLORS.successBackground} size={20} />
                      ) : (
                        <ExclamationCircleIcon fill={COLORS.errorBackground} size={20} />

                      )}
                    </View>
                    {name.length >= 3 || name.length == 0 ? null : nameVerify ? null : (
                      <Text
                        style={{
                          color: COLORS.errorBackground,
                        }}>
                        <ExclamationCircleIcon
                          fill={COLORS.errorBackground} size={20} />
                        Name sholud not be less then 3 characters.
                      </Text>
                    )}

                    <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '40%' }}>
                        {stringDate ? (<Text style={{ fontFamily: FONTFAMILY.poppins_medium, fontSize: 15, color: COLORS.lightText2 }}>{stringDate}</Text>) : (<Text style={{ fontFamily: FONTFAMILY.poppins_medium, fontSize: 15, color: COLORS.lightText2 }} >Date Of Birth</Text>)}
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderRadius: 10, backgroundColor: COLORS.secondaryDarkYellow }} onPress={() => setOpen(true)}>
                          <CalendarIcon
                            fill={COLORS.darkText2} size={20} />
                          <Text style={{ color: COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, margin: 5, fontSize: 15 }}>Pick Date</Text>
                        </TouchableOpacity>
                        <DatePicker
                          modal
                          open={open}
                          mode="date"
                          theme="dark"
                          textColor={COLORS.secondaryDarkYellow}
                          date={date}
                          onConfirm={(date) => {
                            setOpen(false)
                            setDate(date)
                            setStringDate(formatDate(date))
                          }}
                          onCancel={() => {
                            setOpen(false)
                          }}
                        />
                      </View>

                      <View style={{ width: '40%' }}>
                        <DropDownPicker
                          items={itemsGender}
                          open={isGenderOpen}
                          setOpen={() => setIsGenderOpen(!isGenderOpen)}
                          value={currentGenderValue}
                          setValue={(val) => setCurrentGenderValue(val)}
                          autoScroll={true}
                          dropDownDirection='TOP'
                          placeholder='Gender'
                          style={{
                            backgroundColor: COLORS.secondaryDarkYellow
                          }}
                          textStyle={{
                            color: COLORS.darkText1,
                            fontFamily: FONTFAMILY.poppins_medium,
                            fontSize: 15
                          }}
                          labelStyle={{
                            color: COLORS.darkText1,
                            fontFamily: FONTFAMILY.poppins_medium,
                          }}
                        />
                      </View>
                    </View>

                    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                      <View style={{ margin: 10 }}>
                        <Text style={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 20, color: COLORS.primaryDarkOrange, marginBottom: -5 }}>Genre Preferences</Text>
                        <Text style={{ fontFamily: FONTFAMILY.poppins_regular, fontSize: 15, color: COLORS.lightText2 }}>*Atleast 1 and Atmost 5</Text>
                        <DropDownPicker
                          items={itemsGenres}
                          open={isGenreOpen}
                          setOpen={() => setIsGenreOpen(!isGenreOpen)}
                          value={currentGenreValue}
                          setValue={(val) => setCurrentGenreValue(val)}
                          autoScroll={true}
                          dropDownDirection='TOP'
                          multiple={true}
                          min={1}
                          max={5}
                          mode='BADGE'
                          badgeColors={COLORS.darkBackground}
                          badgeDotColors={COLORS.primaryDarkOrange}
                          badgeTextStyle={{ color: COLORS.lightText2, fontFamily: FONTFAMILY.poppins_medium }}
                          placeholder='Genres'
                          style={{
                            backgroundColor: COLORS.secondaryDarkYellow
                          }}
                          textStyle={{
                            color: COLORS.darkText1,
                            fontFamily: FONTFAMILY.poppins_medium,
                            fontSize: 15
                          }}
                          labelStyle={{
                            color: COLORS.darkText1,
                            fontFamily: FONTFAMILY.poppins_medium,
                          }}
                        />
                      </View>

                      <View style={{ margin: 10 }}>
                        <Text style={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 20, color: COLORS.primaryDarkOrange, marginBottom: -5 }}>Language Preferences</Text>
                        <Text style={{ fontFamily: FONTFAMILY.poppins_regular, fontSize: 15, color: COLORS.lightText2 }}>*Atleast 1 and Atmost 5</Text>
                        <DropDownPicker
                          items={itemsLanguage}
                          open={isLanguageOpen}
                          setOpen={() => setIsLanguageOpen(!isLanguageOpen)}
                          value={currentLanguageValue}
                          setValue={(val) => setCurrentLanguageValue(val)}
                          autoScroll={true}
                          multiple={true}
                          min={1}
                          max={5}
                          mode='BADGE'
                          badgeColors={COLORS.darkBackground}
                          badgeDotColors={COLORS.primaryDarkOrange}
                          badgeTextStyle={{ color: COLORS.lightText2, fontFamily: FONTFAMILY.poppins_medium }}
                          dropDownDirection='TOP'
                          placeholder='Language'
                          style={{
                            backgroundColor: COLORS.secondaryDarkYellow
                          }}
                          textStyle={{
                            color: COLORS.darkText1,
                            fontFamily: FONTFAMILY.poppins_medium,
                            fontSize: 15
                          }}
                          labelStyle={{
                            color: COLORS.darkText1,
                            fontFamily: FONTFAMILY.poppins_medium,
                          }}
                        />
                      </View>
                    </View>

                    <View style={{ marginBottom: keyboardHeight * 2 }}>
                      <TouchableOpacity style={[styles.inBut, { margin: 10 }, { opacity: (currentGenreValue.length === 0 || currentLanguageValue.length === 0 || currentGenderValue === '' || stringDate === '' || nameError || emailError) ? 0.5 : 1 }]}
                        onPress={() => handelSubmit()}
                        disabled={currentGenreValue.length === 0 || currentLanguageValue.length === 0 || currentGenderValue === '' || stringDate === '' || nameError || emailError} >
                        <View>
                          <Text style={styles.textSign}>Submit</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>



  );
}

const styles = StyleSheet.create({
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
  },
  action: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 3,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.secondaryDarkYellow,
    backgroundColor: COLORS.lightText2,
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -9,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: 18,
    color: COLORS.darkText1
  },
  button: {
    alignItems: 'center',
    marginTop: 10,
    textAlign: 'center',
    color: COLORS.darkText2,
  },
  inBut: {
    width: '70%',
    backgroundColor: COLORS.secondaryDarkYellow,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  textSign: {
    fontSize: 20,
    fontFamily: FONTFAMILY.poppins_bold,
    color: COLORS.darkText1,
  },
})
export default UpdateAccountScreen
