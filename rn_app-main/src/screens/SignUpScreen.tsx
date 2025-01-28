import { StatusBar, TouchableWithoutFeedback, Keyboard, StyleSheet, Text, View, Animated, TouchableOpacity, TextInput, Dimensions, Platform, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONTFAMILY } from '../theme/theme';
import NetInfo from '@react-native-community/netinfo';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, ExclamationCircleIcon } from 'react-native-heroicons/solid'
import { createUserAccount } from '../data/onlinedb/expressApi';
import OfflineScreen from '../components/OfflineScreen';
import LoadingScreen from '../components/LoadingScreen';
import { useStore } from '../store/store';
const SignUpScreen = (props: any) => {

  const setAuthKey=useStore((state:any)=>state.setAuthKey);
  const toggleSignIn=useStore((state:any)=>state.toggleSignIn);

  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [rePassword, setRePassword] = useState('');
  const [rePasswordVerify, setRePasswordVerify] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [rePasswordError, setRePasswordError] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  const platform = Platform;

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const value = useState(new Animated.ValueXY({ x: -710, y: 0 }))[0];


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
    Animated.timing(value, {
      toValue: { x: screenWidth * 1.7, y: 0 },
      duration: 100000,
      useNativeDriver: false,
    }).start();
  }, []);

  async function handleSubmit(email: string, password: string, platform: any) {
    try {
      setLoading(true);
      const response = await createUserAccount(email, password, platform);
      setAuthKey(response.authToken);
      toggleSignIn()
      setLoading(false);
      if (response.success == true) {
        return props.navigation.replace('SuccessErrorScreen',{    
        screen:'AdditionalInformationScreen',
        type:'acntcreationsuccess',
        message:'Account Created Successfully'});
      } else {
        return props.navigation.replace('SuccessErrorScreen',{    
          screen:'SignUpScreen',
          type:'error',
          message:'Account Cretion Failed'});
      }
    } catch (error) {
      setLoading(false);
      return props.navigation.replace('SuccessErrorScreen',{    
        screen:'SignUpScreen',
        type:'error',
        message:'Server Error! Please Try Again Later'});
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

  function handleRePassword(e: any) {
    const rePasswordVar = e.nativeEvent.text;
    setRePassword(rePasswordVar);
    setRePasswordVerify(false);
    if (rePasswordVar === password) {
      setRePassword(rePasswordVar);
      setRePasswordVerify(true);
      setRePasswordError(false);
    }
    else {
      setRePasswordError(true);
    }
  }

  function handlePassword(e: any) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(false);
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}/.test(passwordVar)) {
      setPassword(passwordVar);
      setPasswordVerify(true);
      setPasswordError(false);
    }
    else {
      setPasswordError(true);
    }
  }

  function handelTrmsandpolicy() {
    Linking.openURL('https://cinepulse-terms-and-condition.netlify.app/');
  }

  function navToSignIn() {
    props.navigation.replace('SignInScreen');
  }

  return (
    <>
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

              <View style={{ width: screenWidth * 0.95, height: 'auto', position: 'absolute', backgroundColor: 'rgba(8,8,8,0.6)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_black, fontSize: 30 }}>Sign Up</Text>

                <View style={styles.action}>

                  <EnvelopeIcon fill={COLORS.primaryDarkOrange} style={styles.smallIcon} />

                  <TextInput
                    placeholder="Email"
                    style={styles.textInput}
                    onChange={e => handleEmail(e)}
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

                <View style={styles.action}>
                  <LockClosedIcon fill={COLORS.primaryDarkOrange} style={styles.smallIcon} />
                  <TextInput
                    placeholder="Password"
                    style={styles.textInput}
                    onChange={e => handlePassword(e)}
                    secureTextEntry={showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {password.length < 1 ? null : !showPassword ? (
                      <EyeSlashIcon fill={passwordVerify ? COLORS.successText : COLORS.errorText} style={{ marginRight: -10 }} size={23} />
                    ) : (
                      <EyeIcon fill={passwordVerify ? COLORS.successText : COLORS.errorText} style={{ marginRight: -10 }} size={23} />
                    )}
                  </TouchableOpacity>
                </View>
                {password.length < 1 ? null : passwordVerify ? null : (
                  <Text
                    style={{
                      color: COLORS.errorBackground,
                    }}>
                    <ExclamationCircleIcon
                      fill={COLORS.errorBackground} size={20} />
                    Password should Contain
                    Uppercase, Lowercase, Number, Symbol and 8 or more characters.
                  </Text>
                )}

                <View style={styles.action}>
                  <LockClosedIcon fill={COLORS.primaryDarkOrange} style={styles.smallIcon} />
                  <TextInput
                    placeholder="Re-Enter Password"
                    style={styles.textInput}
                    onChange={e => handleRePassword(e)}
                    secureTextEntry={showRePassword}
                  />
                  <TouchableOpacity onPress={() => setShowRePassword(!showRePassword)}>
                    {rePassword.length < 1 ? null : !showRePassword ? (
                      <EyeSlashIcon fill={passwordVerify ? COLORS.successText : COLORS.errorText} style={{ marginRight: -10 }} size={23} />
                    ) : (
                      <EyeIcon fill={passwordVerify ? COLORS.successText : COLORS.errorText} style={{ marginRight: -10 }} size={23} />
                    )}
                  </TouchableOpacity>
                </View>
                {rePassword.length < 1 ? null : rePasswordVerify ? null : (
                  <Text
                    style={{
                      color: COLORS.errorBackground,
                    }}>
                    <ExclamationCircleIcon
                      fill={COLORS.errorBackground} size={20} />
                    Password Do Not Matched.
                  </Text>
                )}

                <View style={{ width: '90%', alignItems: 'center', margin: 5 }}>
                  <Text style={{ color: COLORS.lightText2, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15, textAlign: 'center' }}>
                    By creating an account, you are accepting and agreeing to our
                  </Text>
                  <TouchableOpacity onPress={() => handelTrmsandpolicy()}>
                    <Text style={{ color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>Terms And Condition and Privacy Policy</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity
                    style={[styles.inBut, { opacity: (emailError || passwordError || rePasswordError) ? 0.5 : 1 }]}
                    onPress={() => handleSubmit(email, password, platform)}
                    disabled={emailError || passwordError || rePasswordError}
                  >
                    <View>
                      <Text style={styles.textSign}>Submit</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ width: '85%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', margin: 10 }}>
                  <Text style={{ color: COLORS.lightText2, fontFamily: FONTFAMILY.poppins_medium, fontSize: 17 }}>
                    Already Have An Account?
                    {'    '}
                  </Text>
                  <TouchableOpacity onPress={() => navToSignIn()}>
                    <Text style={{ color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_medium, fontSize: 18 }}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

        </TouchableWithoutFeedback>

      )}
    </>
  )
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
    marginTop: 15,
    marginLeft: 5,
    marginRight: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.primaryDarkOrange,
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
export default SignUpScreen
