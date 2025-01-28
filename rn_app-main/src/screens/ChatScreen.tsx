import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { Bubble, GiftedChat, IMessage, Time } from 'react-native-gifted-chat';
import { useStore } from '../store/store';
import HeaderBar from '../components/HeaderBar';
import { COLORS, FONTFAMILY } from '../theme/theme';
import OfflineScreen from '../components/OfflineScreen';
import NetInfo from '@react-native-community/netinfo';
import { ChevronDoubleDownIcon } from 'react-native-heroicons/solid'
import { chatbotcaller } from '../data/api/othersApiFetch';
import RNFS from 'react-native-fs';



export default function ChatScreen(props: any) {

  const isDarkMode = useStore((state: any) => state.isDarkMode);
  const chats = useStore((state: any) => state.chats);
  const addChat = useStore((state: any) => state.addChat);
  const chatServerLink = useStore((state: any) => state.chatServerLink);

  const user = useStore((state: any) => state.user);
  const [type, setType] = useState(false)

  const [connectionStatus, setConnectionStatus] = useState(true);


  const generateUniqueId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    const uniqueId = `${timestamp}-${random}`;
    return uniqueId;
  };

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    try {
      setType(true)
      if (chats.length == 0) {
        const tempSysObj = {
          _id: generateUniqueId(),
          createdAt: new Date(),
          text: ' Hi, I am CinePulsr Chat-Bot.',
          user: {
            _id: 2,
            avatar: require('../assets/images/chatbot.png')
          }
        }
        addChat(tempSysObj)
      }
      onSend1(chats)
    } catch (e) {
      console.log(e)
    } finally {
      setType(false)
    }

  }, []);

  const onSend1 = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  const onSend = useCallback(async (messages: IMessage[] = []) => {
    try {
      setType(true)
      const tempUsrObj = {
        _id: generateUniqueId(),
        createdAt: new Date(),
        text: messages[0].text,
        user: {
          _id: 1,
          avatar: (await RNFS.exists(`/data/user/0/com.cinepulse/files/${user.user._id}profile`))
            ? { uri: `file:///data/user/0/com.cinepulse/files/${user.user._id}profile` }
            : (user.gender == 'Male') ? require('../assets/images/user-default-male.png')
              : require('../assets/images/user-default-female.png')
        }
      }
      addChat(tempUsrObj)

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [tempUsrObj]),
      )

      const response = await chatbotcaller(messages[0].text,chatServerLink)

      const tempSysObj = {
        _id: generateUniqueId(),
        createdAt: new Date(),
        text: response[0].text,
        user: {
          _id: 2,
          avatar: require('../assets/images/chatbot.png')
        }
      }
      addChat(tempSysObj)
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [tempSysObj]),
      )

    } catch (error) {
      console.log('Error sending message:', error);
    } finally {
      setType(false)
    }
  }, []);


  const scrollToBottomComponent = () => {
    return (
      <ChevronDoubleDownIcon fill={isDarkMode ? COLORS.lightText1 : COLORS.darkText1} size={13} />
    );
  }

  const renderTime = (props: any) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: isDarkMode ? COLORS.darkText1 : COLORS.lightText1,
          },
          right: {
            color: isDarkMode ? COLORS.darkText1 : COLORS.lightText1,
          },
        }}
      />
    );
  };

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: isDarkMode ? COLORS.lightBackground : COLORS.darkBackground,
        },
        left: {
          backgroundColor: isDarkMode ? COLORS.secondaryDarkYellow : COLORS.primaryDarkOrange,
        }
      }}

      textStyle={{
        right: {
          color: isDarkMode ? COLORS.darkText1 : COLORS.lightText1,
          fontFamily: FONTFAMILY.poppins_medium,
          fontSize: 15
        },
        left: {
          color: isDarkMode ? COLORS.darkText1 : COLORS.lightText1,
          fontFamily: FONTFAMILY.poppins_medium,
          fontSize: 15
        }
      }}
    />
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    NetInfo.fetch().then((state) => {
      setConnectionStatus(state.isInternetReachable ?? false);
      //   or
      // setConnectionStatus(state.isConnected ?? false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleConnectivityChange = (state: any) => {
    setConnectionStatus(state.isConnected);
  };

  return (
    <>
      {
        !connectionStatus ?
          (
            <OfflineScreen />
          )
          : (
            <View style={{ flex: 1, backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightBackground }}>
              <StatusBar
                backgroundColor={isDarkMode ? COLORS.darkBackground : COLORS.lightBackground}
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              />
              <HeaderBar title={'Chat'} isDark={isDarkMode} props={props} />
              <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                  _id: 1,
                }}

                renderBubble={renderBubble}
                renderTime={renderTime}
                showUserAvatar={true}
                scrollToBottom
                scrollToBottomComponent={scrollToBottomComponent}
                isTyping={type}
              />

            </View>
          )
      }
    </>

  );
}

const styles = StyleSheet.create({});