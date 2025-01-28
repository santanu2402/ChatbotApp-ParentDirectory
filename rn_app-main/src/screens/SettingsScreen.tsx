import { StyleSheet, TouchableOpacity, StatusBar, Text, SafeAreaView, ScrollView, Linking } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/store';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY } from '../theme/theme';
import ModalMain from '../components/Modal/ModalMain';
import Toast, { ToastMethods } from '../components/Toast/Toast';

const SettingsScreen = (props: any) => {

  const [type, setType] = useState('')

  const setIsModalVisible = useStore((state: any) => state.setIsModalVisible);
  const setModalResponse = useStore((state: any) => state.setModalResponse);
  const setDescription = useStore((state: any) => state.setDescription);
  const setHeader = useStore((state: any) => state.setHeader);
  const success = useStore((state: any) => state.success);
  const setSuccess = useStore((state: any) => state.setSuccess);
  const isDarkMode = useStore((state: any) => state.isDarkMode);
  const voiceFeature = useStore((state: any) => state.voiceFeature);
  const toastRef = useRef<ToastMethods>(null);

  const showSuccess = (type: string, text: string) => {
    toastRef.current?.show({
      type: type,
      text: text,
    })
  };

  const updateProfileHandler = () => {
    props.navigation.push('UpdateAccountScreen');
  }
  const changePasswordHandler = () => {
    props.navigation.push('ChangePasswordScreen');
  }
  const themeSelectionHandler = () => {
    setType('theme')
    setHeader('Are You Sure')
    setDescription(`You are going to change your theme from ${isDarkMode ? 'dark' : 'light'} mode to ${!isDarkMode ? 'dark' : 'light'} mode`)
    setModalResponse('')
    setIsModalVisible();
  }

  const voiceFeatureHandler = () => {
    setType('voice')
    setHeader('Are You Sure')
    setDescription(`You are going to change your voice from ${voiceFeature ? 'On' : 'Off'} mode to ${!isDarkMode ? 'Off' : 'On'}`)
    setModalResponse('')
    setIsModalVisible();
  }
  const pushNotificationHandler = () => {
    setType('noti')
    setHeader('Are You Sure')
    setDescription(`You are going to change your voice from ${voiceFeature ? 'On' : 'Off'} mode to ${!voiceFeature ? 'Off' : 'On'}`)
    setModalResponse('')
    setIsModalVisible();
  }
  const clearSearchHandler = () => {
    setType('srchHist')
    setHeader('Are You Sure')
    setDescription(`You are going to delete all your Search History`)
    setModalResponse('')
    setIsModalVisible();
  }
  const clearViewingHandler = () => {
    setType('vwngHist')
    setHeader('Are You Sure')
    setDescription(`You are going to delete all your Viewing History`)
    setModalResponse('')
    setIsModalVisible();
  }
  const deleteAllListHandler = () => {
    setType('vwngList')
    setHeader('Are You Sure')
    setDescription(`You are going to delete all Saved List`)
    setModalResponse('')
    setIsModalVisible();
  }


  const deleteChatsHandler = () => {
    setType('chatList')
    setHeader('Are You Sure')
    setDescription(`You are going to delete all ChatBot Chats`)
    setModalResponse('')
    setIsModalVisible();
  }

 
  const contactSupportHandler = () => {
    Linking.openURL('https://cinepulse-nit.netlify.app/');
  }
  const provideFeedbackHandler = () => {
    Linking.openURL('https://cinepulse-nit.netlify.app/');
  }
  const reportIssueHandler = () => {
    Linking.openURL('https://cinepulse-nit.netlify.app/');
  }
  const signOutHandler = () => {
    setType('sgnout')
    setHeader('Are You Sure')
    setDescription(`You are going to Sign Out from our app`)
    setModalResponse('')
    setIsModalVisible();
  }
  const deactivateAccountHandler = async () => {
    setType('deactivate')
    setHeader('Are You Sure')
    setDescription(`You are going to Delete all your Account as well as all your saved Information`)
    setModalResponse('')
    setIsModalVisible();
  }

  useEffect(() => {
    if (success == 'true') {
      showSuccess('success', ' Success !! ')
    }
    if (success == 'false') {
      showSuccess('error', ' Failed !! ')
    }
    setSuccess('');
  }, [success]);

  return (
    <SafeAreaView style={isDarkMode ? styles.DarkSettingsScreenContainer : styles.LightSettingsScreenContainer}>
      <Toast ref={toastRef} />
      <StatusBar
        backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <ModalMain type={type} props={props} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ScrollViewFlex}>
        <HeaderBar title={'Settings'} isDark={isDarkMode} props={props} />

        <Text style={isDarkMode ? styles.DarkSettingsHeadingText : styles.LightSettingsHeadingText}>Profile Management</Text>
        <TouchableOpacity onPress={updateProfileHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Update Profile</Text></TouchableOpacity>
        <TouchableOpacity onPress={changePasswordHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Change Password</Text></TouchableOpacity>

        <Text style={isDarkMode ? styles.DarkSettingsHeadingText : styles.LightSettingsHeadingText}>App Preferences</Text>
        <TouchableOpacity onPress={themeSelectionHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Theme Selection</Text></TouchableOpacity>
        <TouchableOpacity onPress={voiceFeatureHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Voice Feature</Text></TouchableOpacity>
        <TouchableOpacity onPress={pushNotificationHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Push Notification</Text></TouchableOpacity>

        <Text style={isDarkMode ? styles.DarkSettingsHeadingText : styles.LightSettingsHeadingText}>Data Management</Text>
        <TouchableOpacity onPress={clearSearchHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Clear Search History</Text></TouchableOpacity>
        <TouchableOpacity onPress={clearViewingHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Clear Viewing History</Text></TouchableOpacity>
        <TouchableOpacity onPress={deleteAllListHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Delete All Lists</Text></TouchableOpacity>
        <TouchableOpacity onPress={deleteChatsHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Delete Chats</Text></TouchableOpacity>

        <TouchableOpacity></TouchableOpacity><Text style={isDarkMode ? styles.DarkSettingsHeadingText : styles.LightSettingsHeadingText}>Support</Text>
        <TouchableOpacity onPress={contactSupportHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Contact Support</Text></TouchableOpacity>
        <TouchableOpacity onPress={provideFeedbackHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Provide Feedback</Text></TouchableOpacity>
        <TouchableOpacity onPress={reportIssueHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Report Issues</Text></TouchableOpacity>

        <Text style={isDarkMode ? styles.DarkSettingsHeadingText : styles.LightSettingsHeadingText}>Account Management</Text>
        <TouchableOpacity onPress={signOutHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Sign Out</Text></TouchableOpacity>
        <TouchableOpacity onPress={deactivateAccountHandler}><Text style={isDarkMode ? styles.DarkSettingsText : styles.LightSettingsText}>Deactivate Your Account</Text></TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  DarkSettingsScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
  },
  LightSettingsScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  DarkSettingsHeadingText: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: -2,
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: 22,
    color: COLORS.secondaryDarkYellow,
  },
  LightSettingsHeadingText: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: -2,
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: 22,
    color: COLORS.primaryDarkOrange,
  },
  DarkSettingsText: {
    marginLeft: 20,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: 15,
    color: COLORS.lightText1,
  },
  LightSettingsText: {
    marginLeft: 20,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: 15,
    color: COLORS.darkText1,
  }
})
export default SettingsScreen