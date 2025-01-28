import { StyleSheet, Text } from 'react-native'
import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import LottieView from 'lottie-react-native';
import { Dimensions } from 'react-native';
import { COLORS, FONTFAMILY } from '../../theme/theme';
const screenWidth = Dimensions.get('screen').width;
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withDelay,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';

export interface ToastMethods {
    show: (options: { type: string; text: string }) => void;
}

const Toast = forwardRef(({ }, ref): React.JSX.Element => {
    const toastTopAnimation = useSharedValue(-100);
    const [showing, setShowing] = useState(true)
    const [ToastType, setToastType] = useState('success');
    const [Message, setMessage] = useState('Hello, this is a toast message!')

    const TOP_VALUE = 60;

    const show = useCallback(({ type, text }: { type: string; text: string}) => {
        setShowing(true);
        setToastType(type);
        setMessage(text);
        toastTopAnimation.value = withSequence(
            withTiming(TOP_VALUE),
            withDelay(
                3000,
                withTiming(-100, undefined, (finished) => {
                    if (finished !== undefined) {
                        runOnJS(setShowing)(false);
                    }
                }),
            ),
        );
    }, [TOP_VALUE, toastTopAnimation]);


    const animatedTopStyles = useAnimatedStyle(() => {
        return {
            top: toastTopAnimation.value,
        };
    });

    useImperativeHandle(ref, () => ({
        show: (options: { type: string; text: string}) => show(options),
    }), [show]);

    return (
        <>
            {
                showing && (
  
                    <Animated.View style={[styles.toastContainer,
                    ToastType === 'success' ? styles.successToastContainer :
                        ToastType === 'info' ? styles.infoToastContainer :
                            ToastType === 'warning' ? styles.warningToastContainer :
                                styles.errorToastContainer, animatedTopStyles
                    ]}>
                        <LottieView style={styles.lottie_toast_animation} source={ToastType === 'success' ? require('../../lottie/success-lottie-animation.json') : ToastType === 'info' ? require('../../lottie/info-lottie-animation.json') : ToastType === 'warning' ? require('../../lottie/warning-lottie-animation.json') : require('../../lottie/error-lottie-animation.json')} autoPlay loop />

                        <Text style={ToastType === 'success' ? styles.successToastText :
                            ToastType === 'info' ? styles.infoToastText :
                                ToastType === 'warning' ? styles.warningToastText :
                                    styles.errorToastText}>
                            {`${Message}`}
                        </Text>
                    </Animated.View>

                )
            }

        </>

    );
})

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 40,
        width: screenWidth * 0.9,
        padding: 10,
        borderRadius: 18,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor:COLORS.successBackground,
        zIndex: 9999
    },
    successToastContainer: {
        color: COLORS.successText,
        backgroundColor: COLORS.successBackground,
        borderColor: COLORS.successText

    },
    infoToastContainer: {
        color: COLORS.infoText,
        backgroundColor: COLORS.infoBackground,
        borderColor: COLORS.infoText
    },
    warningToastContainer: {
        color: COLORS.warningText,
        backgroundColor: COLORS.warningBackground,
        borderColor: COLORS.warningText
    },
    errorToastContainer: {
        color: COLORS.errorText,
        backgroundColor: COLORS.errorBackground,
        borderColor: COLORS.errorText
    },
    lottie_toast_animation: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    successToastText: {
        fontFamily: FONTFAMILY.poppins_regular,
        marginLeft: 10,
        fontSize: 18,
        color: COLORS.successText,
    },
    infoToastText: {
        fontFamily: FONTFAMILY.poppins_regular,
        marginLeft: 10,
        fontSize: 18,
        color: COLORS.infoText,
    },
    warningToastText: {
        fontFamily: FONTFAMILY.poppins_regular,
        marginLeft: 10,
        fontSize: 18,
        color: COLORS.warningText,
    },
    errorToastText: {
        fontFamily: FONTFAMILY.poppins_regular,
        marginLeft: 10,
        fontSize: 18,
        color: COLORS.errorText,
    }

})
export default Toast