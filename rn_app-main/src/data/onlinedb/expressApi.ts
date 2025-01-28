import axios from 'axios';
import { serverLink } from '../../constants/index'

export const postnotification = async (movieId: string, movieTitle: string,movieGroup: string,imageUrl: string,authKey: any) => {
  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/notification/add`,
      {
        movieId,
        movieTitle,
        movieGroup,
        imageUrl
      },
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error finding email:', error);
    return null;
  }
};

export const searchnotification = async (movieId: string,movieGroup: string,authKey: any) => {
  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/notification/search`,
      {
        movieId,
        movieGroup,
      },
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error searching notification:', error);
    return null;
  }
};

export const findemail = async (email: string) => {
  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/forgotpassword/findemail`,
      {
        email: email,
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error finding email:', error);
    return null;
  }
};

export const forgotpassword = async (email: string, rstQnA: string) => {
  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/forgotpassword/verifyans`,
      {
        email: email,
        rstPswrdQnA: rstQnA
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error finding email:', error);
    return null;
  }
};

export const changeforgotpassword = async (email: string, password: string) => {
  try {
    const response = await axios.put(
      `${serverLink}/cinepulse/api/user/app/forgotpassword/change`,
      {
        email: email,
        password: password
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error finding email:', error);
    return null;
  }
};

export const verifyoldspassword = async (oldPassword: string, authKey: any) => {
  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/changepassword/verifyold`,
      {
        password: oldPassword,
      },
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error finding email:', error);
    return null;
  }
};

export const changepassword = async (password: string, authKey: any) => {
  try {
    const response = await axios.put(
      `${serverLink}/cinepulse/api/user/app/changepassword/change`,
      {
        password: password,
      },
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error finding email:', error);
    return null;
  }
};

export const userupdate = async (name: any, currentGenderValue: any, email: any, date: any, url: any, currentLanguageValue: any, currentGenreValue: any, chooseImage: any, authKey: string) => {
  try {

    const response = await axios.put(
      `${serverLink}/cinepulse/api/user/app/user/update`,
      {
        name: name,
        gender: currentGenderValue,
        email: email,
        dateOfBirth: date,
        profileImageUrl: url,
        langPref: currentLanguageValue,
        genrePref: currentGenreValue,
        chooseImage: chooseImage
      },
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.log(e)
  }
}

export const fetchaddinf = async (name: any, currentGenderValue: any, date: any, url: any, currentLanguageValue: any, currentGenreValue: any, rstQnA: any, authKey: string) => {
  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/addinf/add`,
      {
        name: name,
        gender: currentGenderValue,
        dateOfBirth: date,
        profileImageUrl: url,
        langPref: currentLanguageValue,
        genrePref: currentGenreValue,
        rstPswrdQnA: rstQnA
      },
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error creating user account:', error);
    return null
  }

}

export const signInUser = async (email: string, password: string, platform: any) => {
  const userdeviceinfo = {
    osType: platform.OS,
    andVersion: platform.constants.Release,
    andSerial: platform.constants.Serial,
    andModel: platform.constants.Model,
    andBrand: platform.constants.Brand,
    andManufacturer: platform.constants.Manufacturer,
  };
  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/signin/verify`,
      {
        email: email,
        password: password,
        userdeviceinfo: userdeviceinfo
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error creating user account:', error);
    return null
  }
};

export const offlinedatafetch = async (authKey: string) => {
  try {
    const response = await axios.get(
      `${serverLink}/cinepulse/api/user/app/offlinefetch`,
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err)
    return null
  }

}

export const createUserAccount = async (email: string, password: string, platform: any) => {
  const userdeviceinfo = {
    osType: platform.OS,
    andVersion: platform.constants.Release,
    andSerial: platform.constants.Serial,
    andModel: platform.constants.Model,
    andBrand: platform.constants.Brand,
    andManufacturer: platform.constants.Manufacturer,
  };

  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/signup/create`,
      {
        email: email,
        password: password,
        termsAndCond: true,
        key: 'thisisfakedemoencryptionkey4545545454',
        userdeviceinfo: userdeviceinfo,
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error creating user account:', error);
    return null
  }
};

export const deactivateAccount = async (authKey: string) => {
  try {
    const response = await axios.delete(
      `${serverLink}/cinepulse/api/user/app/deactivate`,
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error deactivating account:', error);
    return null;
  }
};

export const signoutAccount = async (authKey: string) => {
  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/signout`,
      {},
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error deactivating account:', error);
    return null;
  }
};

export const deleteList = async (authKey: string) => {
  try {
    const response = await axios.delete(
      `${serverLink}/cinepulse/api/user/app/savedlist/alldelete`,
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteRecentlyViewed = async (authKey: string) => {
  try {
    const response = await axios.delete(
      `${serverLink}/cinepulse/api/user/app/recentlyviewed/delete`,
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteRecentlySearch = async (authKey: string) => {
  try {
    const response = await axios.delete(
      `${serverLink}/cinepulse/api/user/app/recentlysearched/delete`,
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const changedarklight = async (authKey: string) => {
  try {
    const response = await axios.put(
      `${serverLink}/cinepulse/api/user/app/darklight/change`,
      {},
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const changevoice = async (authKey: string) => {
  try {
    const response = await axios.put(
      `${serverLink}/cinepulse/api/user/app/voicefeature/change`,
      {},
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const changenoti = async (authKey: string) => {
  try {
    const response = await axios.put(
      `${serverLink}/cinepulse/api/user/app/pushnotification/change`,
      {},
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const changegettingstarted = async (authKey: string) => {
  try {
    const response = await axios.put(
      `${serverLink}/cinepulse/api/user/app/gettingstarted/change`,
      {},
      {
        headers: {
          Authorization: `${authKey}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addmovietolist = async (
  movieId: any,
  movieTitle: any,
  movieImageLink: any,
  movieRating: any,
  movieOverview: any,
  movieReleasedDate: any,
  movieRuntime: any,
  movieCountryOfOrigin: any,
  movieLanguage: any,
  movieRevenue: any,
  movieDirector: any,
  movieProductionCompany: any,
  movieCast: any,
  movieGenre: any,
  authKey: any,
  listName: any
) => {
  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/savedlist/add?listname=${listName}`,
      {
        movieId,
        movieTitle,
        movieImageLink,
        movieRating,
        movieOverview,
        movieReleasedDate,
        movieRuntime,
        movieCountryOfOrigin,
        movieLanguage,
        movieRevenue,
        movieDirector,
        movieProductionCompany,
        movieCast,
        movieGenre,
      },
      {
        headers: {
          Authorization: authKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteMovieFromList = async (
  movieId: string,
  authKey: string,
  listName: string
) => {
  try {
    const response = await axios.delete(
      `${serverLink}/cinepulse/api/user/app/savedlist/delete?listname=${listName}&movieid=${movieId}`,
      {
        headers: {
          Authorization: authKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error deleting movie from list:', error);
    return null;
  }
}

export const addtorecentlyviewed = async (
  movieId: any,
  movieTitle: any,
  authKey: any,
) => {
  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/recentlyviewed/add`,
      {
        movieId,
        movieTitle,
      },
      {
        headers: {
          Authorization: authKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addtosearch = async (
  authKey: string,
  searchTitle: string
) => {
  try {
    const response = await axios.post(
      `${serverLink}/cinepulse/api/user/app/recentlysearched/add?searchTitle=${searchTitle}`,
      {},
      {
        headers: {
          Authorization: authKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log( error);
    // Handle error here if needed
    return null;
  }
}



