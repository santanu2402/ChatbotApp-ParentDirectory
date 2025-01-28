import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { Alert } from '@mui/material';
import * as color from '../Assets/Colors/color'
import axios from 'axios';
import { serverlink } from '../Constants';
import { Link } from 'react-router-dom';
import AvatarIcon from '../Components/AvatarIcon';
import { List, ListItem, ListItemText } from '@mui/material';

export default function UserProfileScreen() {
  // let sortedUserDetails;
  const itemsLanguage = [
    { label: 'English', value: 'en' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Bengali', value: 'bn' },
    { label: 'Tamil', value: 'ta' },
    { label: 'Telugu', value: 'te' },
    { label: 'Kannada', value: 'kn' },
    { label: 'Malayalam', value: 'ml' },
    { label: 'Punjabi', value: 'pa' },
    { label: 'Oriya', value: 'or' },
    { label: 'Japanese', value: 'ja' },
    { label: 'French', value: 'fr' },
    { label: 'Spanish', value: 'es' },
    { label: 'Korean', value: 'ko' },
    { label: 'German', value: 'de' },
    { label: 'Italian', value: 'it' },
    { label: 'Russian', value: 'ru' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Arabic', value: 'ar' },
    { label: 'Urdu', value: 'ur' },
    { label: 'Chinese', value: 'zh' },
  ]

  const itemsGenres = [
    { label: 'Action', value: '28' },
    { label: 'Adventure', value: '12' },
    { label: 'Animation', value: '16' },
    { label: 'Comedy', value: '35' },
    { label: 'Crime', value: '80' },
    { label: 'Documentary', value: '99' },
    { label: 'Drama', value: '18' },
    { label: 'Family', value: '10751' },
    { label: 'Fantasy', value: '14' },
    { label: 'History', value: '36' },
    { label: 'Horror', value: '27' },
    { label: 'Music', value: '10402' },
    { label: 'Mystery', value: '9648' },
    { label: 'Romance', value: '10749' },
    { label: 'Science Fiction', value: '878' },
    { label: 'TV Movie', value: '10770' },
    { label: 'Thriller', value: '53' },
    { label: 'War', value: '10752' },
    { label: 'Western', value: '37' },
  ];

  const [loading, setLoading] = React.useState(false);
  const [userDetails1, setUserDetails1] = React.useState();
  const [userDetails2, setUserDetails2] = React.useState();
  const [userDetails3, setUserDetails3] = React.useState();

  React.useEffect(() => { 

    const fetchData = async () => { 
      try {
        setLoading(true);
        const response = await axios.get(
          `${serverlink}/userdetails/get`,
          {
            headers: {
              Authorization: localStorage.getItem('authKey'),
            },
          }
        );
        if (response.data.success) {
          <Alert severity='success' style={{ margin: 'auto', maxWidth: '500px', position: 'absolute', zIndex: 10 }}>Success fetching user details</Alert>

          console.log(response.data.data[1])
          setUserDetails1(response.data.data[0])
          setUserDetails2(response.data.data[1])
          setUserDetails3(Object.values(response.data.data[2]).map(obj => obj))
          console.log(userDetails3[0])
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  const sortedUserDetails = React.useMemo(() => {
    if (!userDetails3) return [];
    return userDetails3.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [userDetails3]);

  return (

    <>{userDetails1 && userDetails2 && userDetails3 && (<div style={{ height: '100vh', backgroundColor: color.darkBackground }}>
      {loading && <CircularProgress size={100} style={{ position: 'absolute', zIndex: 10, top: "40vh", left: '48vw' }} />}

      <div className="roboto-medium" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{ fontSize: 20, marginRight: 30 }}>  <Link to="/" className='homenavitems lightText1 roboto-medium' >Home</Link></div>
        <AvatarIcon />
      </div>
      <div className='roboto-bold colorsecondaryDarkYellow' style={{ fontSize: 30, letterSpacing: 2 }}>User Profile</div>

      <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        <div><img style={{ height: 300, width: 300, borderStyle: 'solid', borderRadius: '30px', borderWidth: 1, borderColor: color.secondaryDarkYellow, boxShadow: '0 0 10px rgba(255, 196, 0, 0.5)' }} src={userDetails1?.profileImageUrl} /></div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div className='roboto-medium colorprimaryDarkOrange'>Name-</div>
            <div className='roboto-regular lightText2'>&nbsp;{userDetails1?.name}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div className='roboto-medium colorprimaryDarkOrange'>Email-</div>
            <div className='roboto-regular lightText2'>&nbsp;{userDetails1?.user.email}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div className='roboto-medium colorprimaryDarkOrange'>Gender-</div>
            <div className='roboto-regular lightText2'>&nbsp;{userDetails1?.gender}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div className='roboto-medium colorprimaryDarkOrange'>Date of Birth-</div>
            <div className='roboto-regular lightText2'>&nbsp;{new Date(userDetails1?.dateOfBirth).getDate()} {new Date(userDetails1?.dateOfBirth).toLocaleString('default', { month: 'long' })}, {new Date(userDetails1?.dateOfBirth).getFullYear()}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div className='roboto-medium colorprimaryDarkOrange'>Genre Preferences-</div>
            <div className='roboto-regular lightText2'>
              &nbsp;{userDetails1?.genrePref.map(pref => itemsGenres.find(item => item.value === pref)?.label).join(', ')}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div className='roboto-medium colorprimaryDarkOrange'>Language Preferences-</div>
            <div className='roboto-regular lightText2'>
              &nbsp;{userDetails1?.langPref.map(pref => itemsLanguage.find(item => item.value === pref)?.label).join(', ')}
            </div>
          </div>
        </div>


        <div>{sortedUserDetails && (<div style={{ width: '350px', height: '500px',borderStyle: 'solid', borderRadius: '30px', borderWidth: 1, borderColor: color.secondaryDarkYellow, overflowY: 'scroll', maxHeight: '500px' }}>
          <div className='roboto-bold colorprimaryDarkOrange' style={{fontSize:'20px'}}>User Activity</div>
          <List>
            {sortedUserDetails && (
              <div style={{ width: '350px', height: '500px', overflowY: 'scroll', maxHeight: '500px' }}>
                <List>
                  {sortedUserDetails.map(detail => (
                    <ListItem key={detail._id}>
                      <ListItemText className='middle roboto-medium lightText2' primary={detail.activityName} />
                    </ListItem>
                  ))}
                </List>
              </div>
            )}
          </List>
        </div>)}</div>



      </div>



    </div>)}</>

  )
}
