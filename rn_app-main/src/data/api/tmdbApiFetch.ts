import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {apiBaseUrl,apiKey} from '../../constants'

const trendingMovieEndPoint = `${apiBaseUrl}/trending/movie/day?api_key=${apiKey}`;
const popularMovieEndPoint = `${apiBaseUrl}/movie/popular?api_key=${apiKey}`;
const topRatedMovieEndPoint=`${apiBaseUrl}/movie/top_rated?api_key=${apiKey}`;
const upcomingMovieEndPoint=`${apiBaseUrl}/movie/upcoming?api_key=${apiKey}`;
const nowPlayingMovieEndPoint=`${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;

const searchMovieEndPoint=`${apiBaseUrl}/search/movie?api_key=${apiKey}`;
const searchmovieByGenreEndPoints=`${apiBaseUrl}/discover/movie?api_key=${apiKey}`;

const movieDetailsPageEndPoint = (id: string): string => `${apiBaseUrl}/movie/${id}?api_key=${apiKey}`;
const movieDetailsCreditsEndPoint = (id: string): string => `${apiBaseUrl}/movie/${id}/credits?api_key=${apiKey}`;

const relatedOrSimilarToMovieEndPoint = (id: string): string => `${apiBaseUrl}/movie/${id}/similar?api_key=${apiKey}`;

const castDetailsEndPoints= (id: string): string => `${apiBaseUrl}/person/${id}?api_key=${apiKey}`;
const castMoviesEndPoints=(id: string): string => `${apiBaseUrl}/person/${id}/movie_credits?api_key=${apiKey}`;


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

export const fetchTrendingMovies = (page:number) => {
    const params = { page: page };
    const response= apiCall(trendingMovieEndPoint, 'GET',params)
    return response ;
};

export const fetchPopularMovies = (page:number) => {
    const params = { page: page };
    return apiCall(popularMovieEndPoint, 'GET',params);
};

export const fetchTopRatedMovies = (page:number) => {
    const params = { page: page };
    return apiCall(topRatedMovieEndPoint, 'GET',params);
};

export const fetchUpcomingMovies = (page:number) => {
    const params = { page: page };
    return apiCall(upcomingMovieEndPoint, 'GET',params);
};

export const fetchNowShowingMovies = (page:number) => {
    const params = { page: page };
    return apiCall(nowPlayingMovieEndPoint, 'GET',params);
};

export const fetchMovieDetails = (id:string) => {
    return apiCall(movieDetailsPageEndPoint(id), 'GET');
};

export const fetchMovieCredits = (id:string) => {
    return apiCall(movieDetailsCreditsEndPoint(id), 'GET');
};

export const fetchSimilarMovie = (id:string) => {
    return apiCall(relatedOrSimilarToMovieEndPoint(id), 'GET');
};

export const submitRating = async (movieId: string, ratingValue: number) => {
    const options = {
      method: 'POST',
      url: `https://api.themoviedb.org/3/movie/${movieId}/rating`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
      },
      data: `{"value":${ratingValue}}`
    };
  
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
export const fetchCastDetails = (id:string) => {
    return apiCall(castDetailsEndPoints(id), 'GET');
};

export const fetchCastMovie = (id:string) => {
    return apiCall(castMoviesEndPoints(id), 'GET');
};

export const searchMovie = (params:any) => {
    return apiCall(searchMovieEndPoint, 'GET',params);
};

export const discoverMovie = (params:any) => {

    return apiCall(searchmovieByGenreEndPoints, 'GET', params);
};
