import { StyleSheet, SafeAreaView, Text, View, StatusBar, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONTFAMILY } from '../theme/theme';
import LottieView from 'lottie-react-native';

const SuccessErrorScreen = (props: any) => {
    const [screenType, setScreenType] = useState('');
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        setScreenType(props.route.params.type)
        const timer = setTimeout(() => {
            props.navigation.replace(`${props.route.params.screen}`)
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={[{ width: screenWidth, height: screenHeight },

        (screenType === 'success') ? styles.bckgrndSuccess
            : (screenType === 'error') ? styles.bckgrndError
                : (screenType === 'loginsuccess') ? styles.bckgrndLoginSuccess
                    : (screenType === 'logoutsuccess') ? styles.bckgrndLogoutSuccess
                        : (screenType === 'deactsuccess') ? styles.bckgrndDeactivateSuccess
                            : (screenType === 'acntcreationsuccess') ? styles.bckgrndAcntCrtnSuccess : null

        ]}>
            <StatusBar
                backgroundColor={
                    (screenType === 'success') ? COLORS.successBackground
                        : (screenType === 'error') ? COLORS.errorBackground
                            : (screenType === 'loginsuccess') ? COLORS.successBackground
                                : (screenType === 'logoutsuccess') ? COLORS.warningBackground
                                    : (screenType === 'deactsuccess') ? COLORS.warningBackground
                                        : (screenType === 'acntcreationsuccess') ? COLORS.successBackground : COLORS.warningBackground
                }
                barStyle='dark-content'
            />
            <Text style={

                (screenType === 'success') ? styles.textSuccess
                    : (screenType === 'error') ? styles.textError
                        : (screenType === 'loginsuccess') ? styles.textLoginSuccess
                            : (screenType === 'logoutsuccess') ? styles.textLogoutSuccess
                                : (screenType === 'deactsuccess') ? styles.textDeactivateSuccess
                                    : (screenType === 'acntcreationsuccess') ? styles.textAcntCrtnSuccess : null
            }>


                {(screenType === 'success') ? 'Success !!'
                    : (screenType === 'error') ? 'Error !!'
                        : (screenType === 'loginsuccess') ? 'Sign-In Success !!'
                            : (screenType === 'logoutsuccess') ? 'Sign-Out Success !!'
                                : (screenType === 'deactsuccess') ? 'Deactivated !!'
                                    : (screenType === 'acntcreationsuccess') ? 'Account Created !!' : ''
                }</Text>
            <View style={{ alignItems: 'center' }}>
                <LottieView style={{ width: 400, height: 400 }} source={
                    (screenType === 'success') ? require('../lottie/success-for-screen.json')
                        : (screenType === 'error') ? require('../lottie/error-for-screen.json')
                            : (screenType === 'loginsuccess') ? require('../lottie/login-successfull.json')
                                : (screenType === 'logoutsuccess') ? require('../lottie/logout-successfull.json')
                                    : (screenType === 'deactsuccess') ? require('../lottie/deactivate-sad-face.json')
                                        : (screenType === 'acntcreationsuccess') ? require('../lottie/account-created-successfully.json') : ''
                } autoPlay loop />
            </View>
            <Text style={{ color: COLORS.darkText2, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20 }}>{props.route.params.message}</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    textSuccess: {
        fontFamily: FONTFAMILY.poppins_black,
        fontSize: 50,
        margin: 20,
        color: COLORS.successText
    },
    textError: {
        fontFamily: FONTFAMILY.poppins_black,
        fontSize: 50,
        margin: 20,
        color: COLORS.errorText
    },
    textLoginSuccess: {
        fontFamily: FONTFAMILY.poppins_black,
        fontSize: 50,
        margin: 20,
        color: COLORS.successText
    },
    textLogoutSuccess: {
        fontFamily: FONTFAMILY.poppins_black,
        fontSize: 50,
        margin: 20,
        color: COLORS.warningText
    },
    textAcntCrtnSuccess: {
        fontFamily: FONTFAMILY.poppins_black,
        fontSize: 50,
        margin: 20,
        color: COLORS.successText
    },
    textDeactivateSuccess: {
        fontFamily: FONTFAMILY.poppins_black,
        fontSize: 50,
        margin: 20,
        color: COLORS.warningText
    },
    bckgrndSuccess: {
        alignItems: 'center',
        backgroundColor: COLORS.successBackground
    },
    bckgrndError: {
        alignItems: 'center',
        backgroundColor: COLORS.errorBackground
    },
    bckgrndLoginSuccess: {
        alignItems: 'center',
        backgroundColor: COLORS.successBackground
    },
    bckgrndLogoutSuccess: {
        alignItems: 'center',
        backgroundColor: COLORS.warningBackground
    },
    bckgrndAcntCrtnSuccess: {
        alignItems: 'center',
        backgroundColor: COLORS.successBackground
    },
    bckgrndDeactivateSuccess: {
        alignItems: 'center',
        backgroundColor: COLORS.warningBackground
    },

})
export default SuccessErrorScreen