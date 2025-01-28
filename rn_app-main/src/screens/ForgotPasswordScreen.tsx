import { StatusBar, TouchableWithoutFeedback, Keyboard, StyleSheet, Text, View, Animated, TouchableOpacity, TextInput, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, FONTFAMILY } from '../theme/theme';
import { QuestionMarkCircleIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, ExclamationCircleIcon } from 'react-native-heroicons/solid'
import { changeforgotpassword, findemail, forgotpassword } from '../data/onlinedb/expressApi';
import Toast, { ToastMethods } from '../components/Toast/Toast';
import NetInfo from '@react-native-community/netinfo';
import OfflineScreen from '../components/OfflineScreen';

const ForgotPasswordScreen = (props: any) => {

  const [rstQnAPassed, setRstQnAPassed] = useState(false);
  const [emailPassed, setEmailPassed] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState(true);

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

  const [emailClicked, setEmailClicked] = useState(false);
  const [rstQnAClicked, setRstQnAClicked] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;


  const toastRef = useRef<ToastMethods>(null);

  const showSuccess = (type: string, text: string) => {
    toastRef.current?.show({
      type: type,
      text: text,
    })
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




  const value = useState(new Animated.ValueXY({ x: -710, y: 0 }))[0];

  useEffect(() => {
    Animated.timing(value, {
      toValue: { x: screenWidth * 1.7, y: 0 },
      duration: 100000,
      useNativeDriver: false,
    }).start();
  }, []);


  async function handelVerifyrstQnA() {
    setRstQnAClicked(true)
    const response = await forgotpassword(email, rstQnA);
    if (response.success) {
      setRstQnAPassed(true)
      showSuccess('success', response.message)
    } else {
      showSuccess('error', response.message)
    }
  }


  async function handelReset() {
    const response = await changeforgotpassword(email, password)
    if (response.success) {
      showSuccess('success', response.message)
      props.navigation.replace('SignInScreen')
    } else {
      showSuccess('error', response.message)
    }
  }

  async function handelFindEmail() {
    setEmailClicked(true)
    const response = await findemail(email);
    if (response.success) {
      setEmailPassed(true)
      showSuccess('success', response.message)
    } else {
      showSuccess('error', response.message)
    }
  }

  const [rstQnA, setRstQnA] = useState('');
  const [rstQnAVerify, setRstQnAVerify] = useState(false);
  const [rstQnAError, setRstQnAError] = useState(false);

  function handleRstQnA(e: any) {
    const rstQnAVar = e.nativeEvent.text;
    setRstQnA(rstQnAVar);
    setRstQnAVerify(false);
    if (rstQnAVar.length >= 3 || rstQnAVar.length == 0) {
      setRstQnA(rstQnAVar);
      setRstQnAVerify(true);
      setRstQnAError(false);
    } else {
      setRstQnAError(true);
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

  function navToCrtNwAccnt() {
    props.navigation.replace('SignUpScreen');
  }

  function navToLginOldPswrd() {
    props.navigation.replace('SignInScreen');
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

  return (
    <>
      {
      !connectionStatus ? 
      (
        <OfflineScreen />
      ) : (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

          <View style={{ width: screenWidth, height: screenHeight, backgroundColor: COLORS.darkBackground, justifyContent: 'center', alignItems: 'center' }}>
            <Toast ref={toastRef} />
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
                <Text style={{ color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_black, fontSize: 30 }}>Forgot  Password</Text>

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

                <View style={{ flexDirection: 'row', width: '40%', marginTop: 10, justifyContent: 'flex-end', marginLeft: '55%' }}>
                  <TouchableOpacity
                    style={[styles.inBut, { opacity: (emailError || email == '') ? 0.5 : 1 }]}
                    onPress={() => handelFindEmail()}
                    disabled={emailError || email == ''}
                  >
                    <View>
                      <Text style={styles.textSign}>Find</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {
                  (email != '' && !emailPassed && emailClicked) ? (<Text
                    style={{
                      color: COLORS.errorBackground,
                    }}>
                    <ExclamationCircleIcon
                      fill={COLORS.errorBackground} size={20} />
                    Email Not Exists
                  </Text>) : null
                }

                <View style={styles.action}>
                  <QuestionMarkCircleIcon fill={COLORS.primaryDarkOrange} style={styles.smallIcon} />
                  <TextInput
                    placeholder="What is Your Favourite Food?"
                    style={styles.textInput}
                    onChange={e => handleRstQnA(e)}
                  />
                  {rstQnA.length >= 3 ? null : rstQnAVerify ? (
                    <CheckCircleIcon fill={COLORS.successBackground} size={20} />
                  ) : (
                    <ExclamationCircleIcon fill={COLORS.errorBackground} size={20} />
                  )}
                </View>
                {rstQnA.length >= 3 || rstQnA.length == 0 ? null : rstQnAVerify ? null : (
                  <Text
                    style={{
                      color: COLORS.errorBackground,
                    }}>
                    <ExclamationCircleIcon
                      fill={COLORS.errorBackground} size={20} />
                    Name sholud not be less then 3 characters.
                  </Text>
                )}

                <View style={{ flexDirection: 'row', width: '40%', marginTop: 10, justifyContent: 'flex-end', marginLeft: '55%' }}>
                  <TouchableOpacity
                    style={[styles.inBut, { opacity: (rstQnAError || rstQnA == '') ? 0.5 : 1 }]}
                    onPress={() => handelVerifyrstQnA()}
                    disabled={rstQnAError || rstQnA == ''}
                  >
                    <View>
                      <Text style={styles.textSign}>Verify</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {
                  (rstQnA != '' && !rstQnAPassed && rstQnAClicked) ? (<Text
                    style={{
                      color: COLORS.errorBackground,
                    }}>
                    <ExclamationCircleIcon
                      fill={COLORS.errorBackground} size={20} />
                    Wrong Reset Password Answer
                  </Text>) : null
                }

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


                <View style={styles.button}>
                  <TouchableOpacity
                    style={[styles.inBut, { opacity: (!rstQnAPassed || !emailPassed || passwordError || rePasswordError) ? 0.5 : 1 }]}
                    onPress={() => handelReset()}
                    disabled={!rstQnAPassed || !emailPassed || passwordError || rePasswordError}
                  >
                    <View>
                      <Text style={styles.textSign}>Reset</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ width: '85%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10. }}>
                  <TouchableOpacity onPress={() => navToLginOldPswrd()}>
                    <Text style={{ color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}> Login With Old Password</Text>
                  </TouchableOpacity>
                </View>


                <View style={{ width: '85%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10. }}>
                  <TouchableOpacity onPress={() => navToCrtNwAccnt()}>
                    <Text style={{ color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>Create New Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

        </TouchableWithoutFeedback>
      )
      }
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
export default ForgotPasswordScreen
