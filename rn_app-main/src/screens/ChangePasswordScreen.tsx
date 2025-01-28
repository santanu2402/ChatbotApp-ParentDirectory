import { StatusBar, TouchableWithoutFeedback, Keyboard, StyleSheet, Text, View, Animated, TouchableOpacity, TextInput, Dimensions, Platform } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { COLORS, FONTFAMILY } from '../theme/theme';
import {LockClosedIcon, EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from 'react-native-heroicons/solid'
import Toast, { ToastMethods } from '../components/Toast/Toast';
import { changepassword, verifyoldspassword } from '../data/onlinedb/expressApi';
import { useStore } from '../store/store';
import OfflineScreen from '../components/OfflineScreen';
import NetInfo from '@react-native-community/netinfo';

const ChangePasswordScreen = (props: any) => {

  const [connectionStatus, setConnectionStatus] = useState(true);

  const authKey = useStore((state: any) => state.authKey);

  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordVerify, setOldPasswordVerify] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);



  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [rePassword, setRePassword] = useState('');
  const [rePasswordVerify, setRePasswordVerify] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [rePasswordError, setRePasswordError] = useState(false);

  const [oldPasswordClicked, setOldPasswordClicked] = useState(false);
  const [oldPasswordPassed, setOldPasswordClickedPassed] = useState(false);

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


  async function handelChange() {
    const response = await changepassword(password, authKey)
    if (response.success) {
      props.navigation.replace('SuccessErrorScreen', {
        screen: 'SettingsScreen',
        type: 'success',
        message: 'Password Change Successful'
      });
    }
    else {
      showSuccess('error', response.message)
    }
  }

  async function handelCheckOldpassword() {
    setOldPasswordClicked(true)
    const response = await verifyoldspassword(oldPassword, authKey)
    if (response.success) {
      setOldPasswordClickedPassed(true)
      showSuccess('success', 'Old Password Verified')
    } else {
      showSuccess('error', 'Verification Unsuccessful')
    }
  }

  function handleOldPassword(e: any) {
    const oldPasswordVar = e.nativeEvent.text;
    setOldPassword(oldPasswordVar);
    setOldPasswordVerify(false);
    if (oldPasswordVar === oldPassword) {
      setOldPassword(oldPasswordVar);
      setOldPasswordVerify(true);
      setOldPasswordError(false);
    }
    else {
      setRePasswordError(true);
    }
  }

  function navToFrgtPswrd() {
    props.navigation.push('ForgotPasswordScreen');
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
      {!connectionStatus ? (
        <OfflineScreen />
      ) : (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <>
            <Toast ref={toastRef} />
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
                  <Text style={{ color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_black, fontSize: 30 }}>Change  Password</Text>

                  <View style={styles.action}>
                    <LockClosedIcon fill={COLORS.primaryDarkOrange} style={styles.smallIcon} />
                    <TextInput
                      placeholder="Password"
                      style={styles.textInput}
                      onChange={e => handleOldPassword(e)}
                      secureTextEntry={showOldPassword}
                    />
                    <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                      {password.length < 1 ? null : !showPassword ? (
                        <EyeSlashIcon fill={oldPasswordVerify ? COLORS.successText : COLORS.errorText} style={{ marginRight: -10 }} size={23} />
                      ) : (
                        <EyeIcon fill={oldPasswordVerify ? COLORS.successText : COLORS.errorText} style={{ marginRight: -10 }} size={23} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {oldPassword.length < 1 ? null : oldPasswordVerify ? null : (
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

                  <View style={{ flexDirection: 'row', width: '40%', marginTop: 10, justifyContent: 'flex-end', marginLeft: '55%' }}>
                    <TouchableOpacity
                      style={[styles.inBut, { opacity: (oldPasswordError || oldPassword == '') ? 0.5 : 1 }]}
                      onPress={() => handelCheckOldpassword()}
                      disabled={oldPasswordError || oldPassword == ''}
                    >
                      <View>
                        <Text style={styles.textSign}>Verify</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {
                    (oldPassword != '' && !oldPasswordPassed && oldPasswordClicked) ? (<Text
                      style={{
                        color: COLORS.errorBackground,
                      }}>
                      <ExclamationCircleIcon
                        fill={COLORS.errorBackground} size={20} />
                      Wrong Old Password
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
                      style={[styles.inBut, { opacity: (!oldPasswordPassed || !oldPasswordClicked || oldPasswordError || passwordError || rePasswordError) ? 0.5 : 1 }]}
                      onPress={() => handelChange()}
                      disabled={!oldPasswordPassed || !oldPasswordClicked || oldPasswordError || passwordError || rePasswordError}
                    >
                      <View>
                        <Text style={styles.textSign}>Change</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ width: '85%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10. }}>
                    <TouchableOpacity onPress={() => navToFrgtPswrd()}>
                      <Text style={{ color: COLORS.secondaryDarkYellow, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>Forgot Password ?</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </>
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
export default ChangePasswordScreen
