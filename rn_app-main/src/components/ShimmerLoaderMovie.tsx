import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { useStore } from '../store/store';
import { COLORS } from '../theme/theme';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)

export default function ShimmerLoaderMovie() {

    const dummy = [1, 2, 3, 4, 5];
    const isDarkMode = useStore((state: any) => state.isDarkMode);

    return (
        <SafeAreaView style={{ alignItems: 'center', width: screenWidth, height: screenHeight, backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground }}>
            <ShimmerPlaceHolder style={{ margin: 20, width: screenWidth - 20, height: screenWidth * 0.8 - 60, borderRadius: 10 }}
                shimmerColors={isDarkMode ? [`${COLORS.lightText2}40`, `${COLORS.lightText2}10`, `${COLORS.lightText2}40`] : [`${COLORS.darkText2}40`, `${COLORS.darkText2}10`, `${COLORS.darkText2}40`]}>
            </ShimmerPlaceHolder>

            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <ShimmerPlaceHolder style={{ margin: 15, width: screenWidth - 20, height: screenHeight * 0.05,borderRadius:5 }}
                    shimmerColors={isDarkMode ? [`${COLORS.lightText2}40`, `${COLORS.lightText2}10`, `${COLORS.lightText2}40`] : [`${COLORS.darkText2}40`, `${COLORS.darkText2}10`, `${COLORS.darkText2}40`]}>
                </ShimmerPlaceHolder>
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <ShimmerPlaceHolder style={{ margin: 15, width: screenWidth - 20, height: screenHeight * 0.05,borderRadius:5 }}
                    shimmerColors={isDarkMode ? [`${COLORS.lightText2}40`, `${COLORS.lightText2}10`, `${COLORS.lightText2}40`] : [`${COLORS.darkText2}40`, `${COLORS.darkText2}10`, `${COLORS.darkText2}40`]}>
                </ShimmerPlaceHolder>
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <ShimmerPlaceHolder style={{ margin: 15, width: screenWidth - 20, height: screenHeight * 0.05,borderRadius:5 }}
                    shimmerColors={isDarkMode ? [`${COLORS.lightText2}40`, `${COLORS.lightText2}10`, `${COLORS.lightText2}40`] : [`${COLORS.darkText2}40`, `${COLORS.darkText2}10`, `${COLORS.darkText2}40`]}>
                </ShimmerPlaceHolder>
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <ShimmerPlaceHolder style={{ margin: 15, width: screenWidth - 20, height: screenHeight * 0.05,borderRadius:5 }}
                    shimmerColors={isDarkMode ? [`${COLORS.lightText2}40`, `${COLORS.lightText2}10`, `${COLORS.lightText2}40`] : [`${COLORS.darkText2}40`, `${COLORS.darkText2}10`, `${COLORS.darkText2}40`]}>
                </ShimmerPlaceHolder>
            </View>
            <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 5,paddingVertical: 5 }}>
        {dummy.slice(0, 5).map((item: any, index: any) => {
          return (
            <ShimmerPlaceHolder
              key={index}
              style={{
                margin:10,
                width: screenWidth * 0.33,
                height: screenHeight * 0.22,
                borderRadius: 15,
              }}
              shimmerColors={isDarkMode ? [`${COLORS.lightText2}40`, `${COLORS.lightText2}10`, `${COLORS.lightText2}40`] : [`${COLORS.darkText2}40`, `${COLORS.darkText2}10`, `${COLORS.darkText2}40`]}>
            </ShimmerPlaceHolder>

          );
        })}
      </ScrollView>

        </SafeAreaView>
    )
}