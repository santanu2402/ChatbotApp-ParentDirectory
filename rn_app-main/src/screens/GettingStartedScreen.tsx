import { FlatList, StyleSheet, View, ViewToken } from 'react-native'
import React from 'react'
import Animated, { useAnimatedRef, useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated'
import RenderItem from '../gettingstartedcomponents/RenderItem'
import gettingStartedScreenData, { OnboardingData } from '../gettingstartedcomponents/gettingStartedScreenData'
import Pagination from '../gettingstartedcomponents/Pagination'
import CustomButton from '../gettingstartedcomponents/CustomButton'

const GettingStartedScreen = (props:any) => {
    const flatListRef = useAnimatedRef<FlatList<OnboardingData>>();
    const x = useSharedValue(0);
    const flatListIndex = useSharedValue(0);
    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems[0].index !== null) {
            flatListIndex.value = viewableItems[0].index;
        }
    }
    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            x.value = event.contentOffset.x;
        },
    });

    return (
        <View style={styles.container}>
            <Animated.FlatList
                ref={flatListRef}
                onScroll={onScroll}
                data={gettingStartedScreenData}
                renderItem={({ item, index }) => {
                    return <RenderItem item={item} index={index} x={x} />;
                }}
                keyExtractor={item => item.id.toString()}
                scrollEventThrottle={16}
                horizontal={true}
                bounces={false}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    minimumViewTime: 300,
                    viewAreaCoveragePercentThreshold: 10,
                }}

            />
            <View style={styles.bottomContainer}>
                <Pagination data={gettingStartedScreenData} x={x} />
                <CustomButton props={props} flatListRef={flatListRef} flatListIndex={flatListIndex} dataLength={gettingStartedScreenData.length} x={x} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        marginHorizontal: 30,
        paddingVertical: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }

});

export default GettingStartedScreen
