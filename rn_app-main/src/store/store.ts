// email: 'example@email.com',
// name: 'John Doe',
// gender: 'Male',
// dateOfBirth: new Date('1990-01-01'),
// profileImageUrl: 'file:///data/user/0/com.cinepulse/files/profile.jpg',
// langPref: ['English', 'Spanish'],
// genrePref: ['Action', 'Drama'],
// rstPswrdQnA: 'What is your favorite color?',

import { create } from 'zustand';
import { produce } from 'immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const useStore = create(
  persist(
    (set, get) => ({
      authKey: '', // String value
      signInDone: false,
      addInfoDone: false,
      offlineDataFetchDone: false,
      gettingStartedDone: false,
      user: {
      },
      isDarkMode: true,
      voiceFeature: true,
      pushNotification: true,
      adult: false,
      chatServerLink: '',
      setchatlink: (data: string) => set(produce(state => {
        state.chatServerLink = data;
      })),
      rcmndLink:'',
      setrcmndLink: (data: string) => set(produce(state => {
        state.rcmndLink = data;
      })),
      userRecentlyViewed: [], // Array of objects
      userSearchHistory: [], // Array of objects
      userSavedList: [], // Array of objects
      userOfflineMovieDetails: [], // Array of objects

      userNotification: [],
      addUserNotification: (data: any) => set(produce(state => {
        state.userNotification.push(data);
      })),

      homeImageDownloadDone: false,
      userOfflineImageList: [], // Array of objects
      downloadedImageList: [],

      conterCacheMovie: 0,
      cacheMovie: [], // Array of objects
      chats: [], // Array of objects, one object is {"ques":"","res":""}

      header: '',
      description: '',
      isModalVisible: false,
      modalResponse: '',
      success: '',


      addChat: (data: any) => set(produce(state => {
        state.chats.push(data);
      })),
      appendChat: (data: any) => set(produce(state => {
        state.chats.append(data);
      })),

      setuserRecentlyViewed: (data: any) => set(produce(state => {
        state.userRecentlyViewed = data;
      })),

      setuserSearchHistory: (data: any) => set(produce(state => {
        state.userSearchHistory = data;
      })),
      setuserSavedList: (data: any) => set(produce(state => {
        state.userSavedList = data;
      })),
      setuserOfflineMovieDetails: (data: any) => set(produce(state => {
        state.userOfflineMovieDetails = data;
      })),
      setuserNotification: (data: any) => set(produce(state => {
        state.userNotification = data;
      })),
      setuserOfflineImageList: (data: any) => set(produce(state => {
        state.userOfflineImageList = data;
      })),


      setSuccess: (data: string) => set(produce(state => {
        state.success = data;
      })),

      setHeader: (data: string) => set(produce(state => {
        state.header = data;
      })),
      setDescription: (data: string) => set(produce(state => {
        state.description = data;
      })),
      setIsModalVisible: () => set(produce(state => {
        state.isModalVisible = !state.isModalVisible;
      })),
      setModalResponse: (data: string) => set(produce(state => {
        state.modalResponse = data;
      })),

      deleteChat: () => set(produce(state => {
        state.chats = [];
      })),


      // // to add user details
      addUser: (userData: any) => set(produce((state) => {
        console.log('inside user details')
        console.log('before setting user', state.user)
        state.user = userData
        console.log('after setting user', state.user)
      })),

      // // to delete user details
      // deleteUser: () => set(produce((state) => {
      //   state.user = [];
      // })),

      // // to update specific above-mentioned user details
      // updateUser: (updatedUserData: any) => set(produce((state) => {
      //   // Provide the logic to update specific user details here
      //   // For example, you might want to find the user by ID and update the details
      //   // state.user = updatedUserData;
      // })),
      setIsDarkMode: (data: boolean) => set(produce((state) => {
        state.isDarkMode = data
      })),
      setisAddInfoDone: (data: boolean) => set(produce((state) => {
        state.addInfoDone = data
      })),
      setgettingStartedDone: (data: boolean) => set(produce((state) => {
        state.gettingStartedDone = data
      })),
      setvoiceFeature: (data: boolean) => set(produce((state) => {
        state.voiceFeature = data
      })),
      setpushNotification: (data: boolean) => set(produce((state) => {
        state.pushNotification = data
      })),

      setLogOut: () => set(produce(state => {
        state.authKey = '';
        state.signInDone = false;
        state.addInfoDone = false;
        state.offlineDataFetchDone = false;
        state.gettingStartedDone = false;
        state.user = {};
        state.isDarkMode = true;
        state.voiceFeature = true;
        state.age = 0;
        state.userRecentlyViewed = [];
        state.userSearchHistory = [];
        state.userSavedList = [];
        state.userOfflineMovieDetails = [];
        state.homeImageDownloadDone = false;
        state.userOfflineImageList = [];
        state.downloadedImageList = [];
        state.conterCacheMovie = 0;
        state.cacheMovie = [];
        state.chats = [];
        if (state.homeImageDownloadDone == true) {
          state.toggleHomeImageDownloadDone()
        }
      })),

      setAuthKey: (authKey: string) => set(produce(state => {
        state.authKey = authKey;
      })),
      deleteAuthKey: () => set(produce(state => {
        state.authKey = '';
      })),
      toggleSignIn: () => set(produce(state => {
        state.signInDone = !state.signInDone;
      })),
      toggleAddInfo: () => set(produce(state => {
        state.addInfoDone = !state.addInfoDone;
      })),
      toggleOfflineDataFetch: () => set(produce(state => {
        state.offlineDataFetchDone = !state.offlineDataFetchDone;
      })),
      toggleGettingStarted: () => set(produce(state => {
        state.gettingStartedDone = !state.gettingStartedDone;
      })),
      toggleDarkMode: () => set(produce(state => {
        state.isDarkMode = !state.isDarkMode;
      })),
      toggleVoiceFeature: () => set(produce(state => {
        state.voiceFeature = !state.voiceFeature;
      })),

      togglePushNotification: () => set(produce(state => {
        state.pushNotification = !state.pushNotification;
      })),
      toggleHomeImageDownloadDone: () => set(produce(state => {
        state.homeImageDownloadDone = !state.homeImageDownloadDone;
      })),
      setAdult: (dob: string) => set(produce(state => {
        // Parse date of birth without considering the time
        const dateOfBirth: Date = new Date(dob);
        dateOfBirth.setHours(0, 0, 0, 0); // Set time to midnight

        // Create the current date with time set to midnight
        const currentDate: Date = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set time to midnight

        // Calculate the age in years directly
        const ageInYears: number = currentDate.getFullYear() - dateOfBirth.getFullYear();

        // Adjust the age if the birthdate hasn't occurred yet this year
        if (
          currentDate.getMonth() < dateOfBirth.getMonth() ||
          (currentDate.getMonth() === dateOfBirth.getMonth() &&
            currentDate.getDate() < dateOfBirth.getDate())
        ) {
          if (ageInYears - 1 >= 18) {
            state.adult = true
          }
          else {
            state.adult = false
          }
        } else {
          if (ageInYears >= 18) {
            state.adult = true
          }
          else {
            state.adult = false
          }
        }
      })),
      addUserRecentlyViewed: (data: object) => set(produce(state => {
        // const createdAt = new Date(Date.now());
        state.userRecentlyViewed.push(data);
      })),
      deleteUserRecentlyViewed: () => set(produce(state => {
        state.userRecentlyViewed = [];
      })),
      addUserSearchHistory: (data: object) => set(produce(state => {
        state.userSearchHistory.push(data);
      })),
      deleteUserSearchHistory: () => set(produce(state => {
        state.userSearchHistory = [];
      })),
      addUserSavedList: (data: object) => set(produce(state => {
        state.userSavedList.push(data);
      })),
      deleteAllUserSavedList: () => set(produce(state => {
        state.userSavedList = [];
      })),
      deleteMovieFromUserSavedList: (id: string, listName: string) => set(produce((state) => {
        // Find the index of the object with the matching movieId
        const indexToDelete = state.userSavedList.findIndex((item: any) => item.movieId === id && item.listName == listName);

        // If the movieId is found in the array, remove the corresponding object
        if (indexToDelete !== -1) {
          state.userSavedList.splice(indexToDelete, 1);
        }
      })),
      addUserOfflineMovieDetails: (data: object) => set(produce(state => {
        state.userOfflineMovieDetails.push(data);
      })),
      deleteAllUserOfflineMovieDetails: () => set(produce(state => {
        state.userOfflineMovieDetails = [];
      })),
      deleteMovieFromUserOfflineMovieDetails: (id: string) => set(produce((state) => {
        // Find the index of the object with the matching movieId
        const indexToDelete = state.userOfflineMovieDetails.findIndex((item: any) => item.movieId === id);

        // If the movieId is found in the array, remove the corresponding object
        if (indexToDelete !== -1) {
          state.userOfflineMovieDetails.splice(indexToDelete, 1);
        }
      })),
      addUserOfflineImageList: (data: object) => set(produce(state => {
        state.userOfflineImageList.push(data);
      })),
      deleteAllUserOfflineImageList: () => set(produce(state => {
        state.userOfflineImageList = [];
      })),
      deleteMovieFromUserOfflineImageList: (id: string) => set(produce((state) => {
        // Find the index of the object with the matching pictureId
        const indexToDelete = state.userOfflineImageList.findIndex((item: any) => item.pictureId === id);

        // If the pictureId is found in the array, remove the corresponding object
        if (indexToDelete !== -1) {
          state.userOfflineImageList.splice(indexToDelete, 1);
        }
      })),
      addDownloadedImageList: (data: object) => set(produce(state => {
        state.downloadedImageList.push(data);
      })),
      deleteDownloadedImageList: () => set(produce(state => {
        state.downloadedImageList = [];
      })),
      deleteOneDownloadedImageList: (id: string) => set(produce((state) => {
        // Find the index of the object with the matching pictureId
        const indexToDelete = state.downloadedImageList.findIndex((item: any) => item.pictureId === id);

        // If the pictureId is found in the array, remove the corresponding object
        if (indexToDelete !== -1) {
          state.downloadedImageList.splice(indexToDelete, 1);
        }
      })),
      circularIncrementCounterCacheMovie: () => set(produce(state => {
        state.conterCacheMovie = (state.conterCacheMovie + 1) % 10;
      })),
      setCacheMovie: (data: object) => set(produce(state => {
        state.cacheMovie[state.conterCacheMovie] = data;
      })),
    }),
    {
      name: 'cinepulse-app',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);