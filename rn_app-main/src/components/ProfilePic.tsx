import { StyleSheet, TouchableWithoutFeedback, View, Image } from 'react-native'
import React, { useState } from 'react'
import { useStore } from '../store/store';

const ProfilePic = (props: any) => {
    const user = useStore((state: any) => state.user);
    const [imageError, setImageError] = useState(false);

    return (
        <View>
            <TouchableWithoutFeedback onPress={() => { props.props.navigation.navigate('AccountScreen') }}>
                <Image
                    style={styles.HederBarProfilePic}
                    source={imageError ? ((user.gender == 'Male') ? require('../assets/images/user-default-male.png') : require('../assets/images/user-default-female.png')) : { uri: `file:///data/user/0/com.cinepulse/files/${user.user._id}profile` }}
                    onError={() => setImageError(true)}
                />
            </TouchableWithoutFeedback>


        </View>
    )
}


const styles = StyleSheet.create({
    HederBarProfilePic: {
        width: 45,
        height: 45,
        borderRadius:50,
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    }
})
export default ProfilePic