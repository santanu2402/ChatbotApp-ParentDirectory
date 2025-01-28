import { StyleSheet, TouchableWithoutFeedback,Text, View } from 'react-native'
import { COLORS, FONTFAMILY, FONTSIZE } from '../theme/theme'
import { Cog8ToothIcon } from 'react-native-heroicons/solid';
import ProfilePic from './ProfilePic'

import React from 'react'

interface HeaderBarProps {
    title?: string;
    isDark?: boolean;
    props?:any;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title, isDark, props }) => {
    return (
      <View style={isDark ? styles.DarkHeaderContainer : styles.LightHeaderContainer}>
        <Text style={isDark ? styles.DarkHeaderTitleText : styles.LightHeaderHeaderTitleText}>{title}</Text>
        <View style={styles.HeaderContainerRightSide}>
          {title !== 'Settings' && (
            <TouchableWithoutFeedback onPress={() => props.navigation.navigate('SettingsScreen')}>
              <Cog8ToothIcon fill={isDark ? COLORS.lightText1 : COLORS.darkText1} size={28} />
            </TouchableWithoutFeedback>
          )}
          <ProfilePic props={props} />
        </View>
      </View>
    );
  };


const styles = StyleSheet.create({
    DarkHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.darkBackground,
        marginBottom:10,
    },
    LightHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.lightBackground,
        marginBottom:10,
    },
    DarkHeaderTitleText: {
        flex: 4,
        marginLeft:10,
        color: COLORS.lightText1,
        fontFamily: FONTFAMILY.poppins_bold,
        fontSize: 22
    },
    LightHeaderHeaderTitleText: {
        flex: 4,
        marginLeft:10,
        color: COLORS.darkText1,
        fontFamily: FONTFAMILY.poppins_bold,
        fontSize: FONTSIZE.size_24
    },
    HeaderContainerRightSide: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})
export default HeaderBar