import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Modal } from 'react-native'
import React from 'react'
import { COLORS, FONTFAMILY } from '../../theme/theme'
import { useStore } from '../../store/store';
import { changedarklight, changenoti, changevoice, deactivateAccount, deleteList, deleteRecentlySearch, deleteRecentlyViewed, signoutAccount } from '../../data/onlinedb/expressApi';

const WIDTH = Dimensions.get('window').width;
const HEIGHT_MODAL = 200;

const ModalMain = (props: any) => {
    const deleteChat = useStore((state: any) => state.deleteChat);
    const isDarkMode = useStore((state: any) => state.isDarkMode);
    const header = useStore((state: any) => state.header);
    const description = useStore((state: any) => state.description);
    const isModalVisible = useStore((state: any) => state.isModalVisible);
    const toggleVoiceFeature = useStore((state: any) => state.toggleVoiceFeature);
    const authKey = useStore((state: any) => state.authKey);
    const setIsModalVisible = useStore((state: any) => state.setIsModalVisible);
    const setModalResponse = useStore((state: any) => state.setModalResponse);
    const toggleDarkMode = useStore((state: any) => state.toggleDarkMode);
    const setSuccess = useStore((state: any) => state.setSuccess);
    const togglePushNotification = useStore((state: any) => state.togglePushNotification);
    const setLogOut = useStore((state: any) => state.setLogOut);
    const deleteAllUserSavedList = useStore((state: any) => state.deleteAllUserSavedList);
    const deleteUserRecentlyViewed = useStore((state: any) => state.deleteUserRecentlyViewed);
    const deleteUserSearchHistory = useStore((state: any) => state.deleteUserSearchHistory);

    async function handleOk(data: string) {
        if (props.type == 'theme') {
            if (data == 'ok') {
                const response = await changedarklight(authKey);
                if (response.success == true) {
                    toggleDarkMode();
                    setSuccess('true')
                    setIsModalVisible();
                }
                else {
                    setSuccess('false')
                    setIsModalVisible();
                }
            }
            if (data == 'cancel') {
                setSuccess('false')
                setIsModalVisible();
            }
        }
        else if (props.type == 'voice') {
            if (data == 'ok') {
                const response = await changevoice(authKey);
                if (response.success == true) {
                    toggleVoiceFeature()
                    setSuccess('true')
                    setIsModalVisible();
                }
                else {
                    setSuccess('false')
                    setIsModalVisible();
                }
            }
            if (data == 'cancel') {
                setSuccess('false')
                setIsModalVisible();
            }
        }

        else if (props.type == 'noti') {
            if (data == 'ok') {
                const response = await changenoti(authKey);
                if (response.success == true) {
                    togglePushNotification()
                    setSuccess('true')
                    setIsModalVisible();
                }
                else {
                    setSuccess('false')
                    setIsModalVisible();
                }
            }
            if (data == 'cancel') {
                setSuccess('false')
                setIsModalVisible();
            }
        }

        else if (props.type == 'srchHist') {

            if (data == 'ok') {
                const response = await deleteRecentlySearch(authKey);
                if (response.success == true) {
                    setSuccess('true')
                    deleteUserSearchHistory();
                    setIsModalVisible();
                }
                else {
                    setSuccess('false')
                    setIsModalVisible();
                }
            }

            if (data == 'cancel') {
                setSuccess('false')
                setIsModalVisible();
            }

        }

        else if (props.type == 'vwngHist') {


            if (data == 'ok') {
                const response = await deleteRecentlyViewed(authKey);
                if (response.success == true) {
                    setSuccess('true')
                    deleteUserRecentlyViewed();
                    setIsModalVisible();
                }
                else {
                    setSuccess('false')
                    setIsModalVisible();
                }
            }

            if (data == 'cancel') {
                setSuccess('false')
                setIsModalVisible();
            }

        }

        else if (props.type == 'vwngList') {

            if (data == 'ok') {
                const response = await deleteList(authKey);
                if (response.success == true) {
                    setSuccess('true')
                    deleteAllUserSavedList();
                    setIsModalVisible();
                }
                else {
                    setSuccess('false')
                    setIsModalVisible();
                }
            }

            if (data == 'cancel') {
                setSuccess('false')
                setIsModalVisible();
            }

        }

        else if (props.type == 'chatList') {

            if (data == 'ok') {
                deleteChat();
                setSuccess('true')
                setModalResponse('ok');
                setIsModalVisible();
            }

            if (data == 'cancel') {
                setSuccess('false')
                setIsModalVisible();
            }

        }

        else if (props.type == 'sgnout') {

            if (data == 'ok') {

                const response = await signoutAccount(authKey);
                if (response.success == true) {
                    setLogOut();
                    setIsModalVisible();
                    return props.props.navigation.replace('SuccessErrorScreen', {
                        screen: 'SignInScreen',
                        type: 'logoutsuccess',
                        message: 'Sign Out Successfully'
                    });
                }
                else {
                    setSuccess('false')
                    setIsModalVisible();
                }
            }

            if (data == 'cancel') {
                setSuccess('false')
                setIsModalVisible();
            }

        }

        else if (props.type == 'deactivate') {

            if (data == 'ok') {

                const response = await deactivateAccount(authKey);
                if (response.success == true) {
                    setLogOut();
                    setIsModalVisible();
                    return props.props.navigation.replace('SuccessErrorScreen', {
                        screen: 'SignUpScreen',
                        type: 'deactsuccess',
                        message: 'Account Deactivated Successfully'
                    });
                }
                else {
                    setSuccess('false')
                    setIsModalVisible();
                }
            }

            if (data == 'cancel') {
                setSuccess('false')
                setIsModalVisible();
            }

        }
    }
    return (
        <Modal transparent={true} animationType='fade' visible={isModalVisible} onRequestClose={() => setIsModalVisible()}>
            <TouchableOpacity onPress={() => { setIsModalVisible(); }} style={isDarkMode ? styles.darkModalContainer : styles.lightModalContainer}>
                <View style={isDarkMode ? styles.darkModalMain : styles.lightModalMain}>
                    <View style={styles.textView}>
                        <Text style={isDarkMode ? styles.darkModalHeader : styles.lightModalHeader}> {header} </Text>
                        <Text style={isDarkMode ? styles.darkModalDescription : styles.lightModalDescription}> {description} </Text>
                    </View>
                    <View style={styles.buttonView}>

                        <TouchableOpacity style={styles.yesButton} onPress={() => { handleOk('ok') }}>
                            <Text style={isDarkMode ? styles.darkModalYes : styles.lightModalYes}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => { handleOk('cancel') }}>
                            <Text style={isDarkMode ? styles.darkModalCancel : styles.lightModalCancel}>Cancel</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    darkModalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(229, 234, 242,0.4)',
    },
    lightModalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(67, 77, 91,0.4)',
    },
    darkModalMain: {
        height: HEIGHT_MODAL,
        width: WIDTH - 80,
        paddingTop: 10,
        backgroundColor: COLORS.darkBackground,
        borderRadius: 15,
    },
    lightModalMain: {
        height: HEIGHT_MODAL,
        width: WIDTH - 80,
        paddingTop: 10,
        backgroundColor: COLORS.lightBackground,
        borderRadius: 15,
    },
    textView: {
        flex: 1,
        alignItems: 'center',

    },
    darkModalHeader: {
        margin: 5,
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.lightText1,
    },
    lightModalHeader: {
        margin: 5,
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.darkText1,
    },
    darkModalDescription: {
        margin: 5,
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.lightText1,
    },
    lightModalDescription: {
        margin: 5,
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.darkText1,
    },
    buttonView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    yesButton: {
        backgroundColor: COLORS.primaryDarkOrange,
        width: '30%',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 20
    },
    darkModalYes: {
        color: COLORS.darkText2,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: 15
    },
    lightModalYes: {
        color: COLORS.lightText2,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: 15
    },
    cancelButton: {
        backgroundColor: COLORS.secondaryDarkYellow,
        width: '30%',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 20
    },
    darkModalCancel: {
        color: COLORS.darkText2,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: 15
    },
    lightModalCancel: {
        color: COLORS.darkText2,
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: 15
    }

})
export default ModalMain;