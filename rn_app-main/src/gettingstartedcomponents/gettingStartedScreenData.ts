import {AnimationObject} from 'lottie-react-native';

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  heading: string,
  headingColor: string,
  text: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require('../lottie/movie-getting-screen-1.json'),
    heading: 'Movie Insights at Your Fingertips',
    headingColor: '#FF4F01',
    text: `Explore our app's wealth of movie details and related videos. Effortlessly navigate a vast movie dataset to find your favorites and discover new gems.`,
    textColor: '#FF6B2A',
    backgroundColor: '#FFFBD4',
  },
  {
    id: 2,
    animation: require('../lottie/list-getting-screen-2.json'),
    heading:'Personalized Movie Lists, Anywhere, Anytime',
    headingColor:'#9400FF',
    text: 'Elevate your movie experience by creating offline lists for favorites, watched, and watchlist. Tailor your film journey with ease, no matter where you are.',
    textColor: '#9C1AFB',
    backgroundColor: '#F7ECFF',
  },
  {
    id: 3,
    animation: require('../lottie/robot-getting-screen-3.json'),
    heading: 'Movie Magic at Your Command',
    headingColor:'#00AFBA',
    text: 'Chat with our movie specialist chatbot for instant answers and recommendations. Unleash the power of knowledge about any movie, anytime.',
    textColor: '#00C1CD',
    backgroundColor: '#E9FFFE',
  }
];

export default data;