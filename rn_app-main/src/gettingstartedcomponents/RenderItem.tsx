import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native';

import { OnboardingData } from './gettingStartedScreenData'
import LottieView from 'lottie-react-native';
import { FONTFAMILY } from '../theme/theme';

import Animated, {
    Extrapolation,
    SharedValue,
    interpolate,
    useAnimatedStyle,
  } from 'react-native-reanimated';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

type Props = {
    item: OnboardingData;
    x: SharedValue<number>;
    index: number;
}

const RenderItem = ({ item,x, index }: Props) => {
    const SCREEN_WIDTH = Dimensions.get('screen').width;

    const lottieAnimationStyle = useAnimatedStyle(() => {
        const translateYAnimation = interpolate(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [200, 0, -200],
          Extrapolation.CLAMP,
        );
    
        return {
          transform: [{translateY: translateYAnimation}],
        };
      });
    
      const circleAnimation = useAnimatedStyle(() => {
        const scale = interpolate(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [1, 4, 4],
          Extrapolation.CLAMP,
        );
    
        return {
          transform: [{scale: scale}],
        };
      });


    return (
        <View style={[styles.item_container_getting_Started]}>
                  <View style={styles.circleContainer}>
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH,
              borderRadius: SCREEN_WIDTH / 2,
              backgroundColor: item.backgroundColor,
            },
            circleAnimation,
          ]}
        />
      </View>

      <Animated.View style={lottieAnimationStyle}>
        <LottieView
          source={item.animation}
          style={styles.lottie_animation_getting_started}
          autoPlay
          loop
        />
      </Animated.View>

            <Text style={[styles.item_getting_started_heading, { color: item.headingColor, fontSize: screenWidth * 0.05 }]}>{item.heading}</Text>
            <Text style={[styles.item_getting_started_text, { color: item.textColor, fontSize: screenWidth * 0.035 }]}>{item.text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    item_container_getting_Started: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: screenWidth,
        height: screenHeight,

    },
    lottie_animation_getting_started: {
        width: screenWidth * 0.9,
        height: screenWidth * 0.9,
        overflow: 'hidden'
    },
    item_getting_started_heading: {
        textAlign: 'center',
        fontFamily: FONTFAMILY.poppins_extrabold,
        marginBottom: -10,
    },
    item_getting_started_text: {
        textAlign: 'center',
        fontFamily: FONTFAMILY.poppins_bold,
        marginBottom: 300,
    },
    circleContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
})
export default RenderItem