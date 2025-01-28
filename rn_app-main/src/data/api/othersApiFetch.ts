import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {youtubeApiBaseUrl,youtubeApiKey} from '../../constants'

const youtubeVideoEndPoint=`${youtubeApiBaseUrl}?key=${youtubeApiKey}`;

const apiCall = async (
    endpoint: string, 
    method: string, 
    params?: any, 
    body?: any, 
    headers?: any
): Promise<AxiosResponse<any>> => {
    const options: AxiosRequestConfig = {
        method: method,
        url: endpoint,
        params: params || {},
        data: body,
        headers: headers
    };
    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        console.error(error);
        return {} as AxiosResponse<any>;
    }
};

export const getYoutubeVideos = (keyword: string) => {
    const params = { q: keyword, type: 'video' };
    return apiCall(youtubeVideoEndPoint, 'GET', params);
};

export const recomendcaller = async (
  movies: any[],
  genrePref: string[],
  langPref: string[],
  page: number,
  server:string
) => {
  try {
    console.log("movies",movies)
    const genrePrefNum: number[] = genrePref.map(str => parseInt(str));
    const response = await axios.post(
      `${server}/api/recommend_movies?page=${page}`,
      {
        movies: movies,
        genrePref: genrePrefNum,
        langPref: langPref,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.warn('responsedata',response.data)
    return response.data;
    
  } catch (error) {
    console.log(error);
    return null;
  }
};





  export const chatbotcaller = async (
    message: string,
    server:string
  ) => {
    try {
      const response = await axios.post(
        `${server}/webhooks/rest/webhook`,
        {
          sender: 'user',
          message: message,
        },
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };