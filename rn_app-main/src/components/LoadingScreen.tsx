import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React,{useEffect,useState} from 'react'
import LottieView from 'lottie-react-native';
import { Dimensions } from 'react-native';
import { COLORS, FONTFAMILY } from '../theme/theme';
import { useStore } from '../store/store';
import { BlurView } from "@react-native-community/blur";


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
interface LoadingScreenProps {
    Message: string;
}
const LoadingScreen: React.FC<LoadingScreenProps> = ({ Message }) => {
    const isDarkMode = useStore((state: any) => state.isDarkMode);

    const [showHangOnMessage, setShowHangOnMessage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHangOnMessage(true);
        }, 5000);

        return () => clearTimeout(timer); // Cleanup the timer on component unmount

    }, []);
    return (
        <View style={isDarkMode ? styles.dark_loading_parent_container : styles.light_loading_parent_container}>
            <StatusBar
                backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />

            <View style={styles.lottie_loading_upper_animation_container}>
                <LottieView style={styles.lottie_loading_upper_animation} source={require('../lottie/top-loading.json')} autoPlay loop />
            </View>

            <View style={styles.lottie_loading_middle_animation_container}>
                <LottieView style={styles.lottie_loading_middle_animation} source={isDarkMode ? require('../lottie/light_loading_animation.json') : require('../lottie/dark_loading_animation.json')} autoPlay loop />
            </View>

            <View style={styles.loading_blur_container}>
                <View >

                    <BlurView
                        style={styles.loading_blur_absolute}
                        blurType={isDarkMode ?'xlight':'extraDark'}
                        blurAmount={20}
                    />
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <LottieView style={styles.lottie_loading_message_animation} source={require('../lottie/message-loading.json')} autoPlay loop />
                        <Text style={isDarkMode ? styles.dark_loading_blur_container_text : styles.light_loading_blur_container_text}>
                            {Message}
                        </Text>
                    </View>
                </View>
            </View>

            <Text style={showHangOnMessage ? (isDarkMode ? styles.dark_loading_bottom_text : styles.light_loading_bottom_text) : { display: 'none' }}>
                Taking More Than Usual, Hang On!
            </Text>

        </View>
    )
}

const styles = StyleSheet.create({
    light_loading_parent_container: {
        height: screenHeight,
        backgroundColor: COLORS.lightBackground
    },
    dark_loading_parent_container: {
        height: screenHeight,
        backgroundColor: COLORS.darkBackground
    },
    lottie_loading_upper_animation_container: {
        alignItems: 'center',
    },
    lottie_loading_upper_animation: {
        height: screenHeight * 1,
        width: screenWidth * 1,
        marginTop: - screenHeight * 0.44,
        marginBottom: - screenHeight * 0.42
    },
    lottie_loading_middle_animation_container: {
        alignItems: 'center',
    },
    lottie_loading_middle_animation: {
        height: screenHeight * 1,
        width: screenWidth * 0.8,
        marginTop: - screenHeight * 0.31,
        marginBottom: - screenHeight * 0.31
    },
    loading_blur_container: {
        justifyContent: "center",
        alignItems: "center",
        flexWrap: 'wrap',
        overflow: 'hidden',
        marginTop: 30,
        margin: 20,
        borderRadius: 10
    },
    loading_blur_absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },

    light_loading_blur_container_text: {
        margin: 10,
        textAlignVertical:'center',
        textAlign: 'center',
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.lightText1,
        fontSize: 17,
    },
    dark_loading_blur_container_text: {
        textAlignVertical:'center',
        margin: 10,
        textAlign: 'center',
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.darkText1,
        fontSize: 17,
    },
    lottie_loading_message_animation: {
        height: screenHeight * 0.1,
        width: screenWidth * 0.1,
    },
    dark_loading_bottom_text:{
        margin: 5,
        textAlign: 'center',
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.lightText2,
        fontSize: 15,
    },
    light_loading_bottom_text:{
        margin: 5,
        textAlign: 'center',
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.darkText2,
        fontSize: 15,
    }

})
export default LoadingScreen