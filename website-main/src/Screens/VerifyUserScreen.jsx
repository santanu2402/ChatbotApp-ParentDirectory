import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import * as color from '../Assets/Colors/color'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { serverlink } from '../Constants';
import LinearLoader from '../Components/LinearLoader';
export default function VerifyUserScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${serverlink}/verifyuser`,
        {
          email: email,
          password: password,
        }
      );
      const data = response.data;
      if (data.success) {
        <Alert severity='success' style={{ margin: 'auto', maxWidth: '500px', position:'absolute',zIndex:10}}>Verification Success</Alert>
        localStorage.setItem('authKey', data.authToken);
        navigate('/profile');
      } else {
        setError("Invalid credentials. Please check your username and password.");
        clearErrorAfterTimeout();
      }
    } catch (error) {
      setError("An error occurred while logging in.");
      clearErrorAfterTimeout();
    } finally {
      setLoading(false);
    }
  }
  const clearErrorAfterTimeout = () => {
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  return (
    <div style={{ height: '100vh', backgroundColor: color.lightText2 }}>
      {error && <Alert severity="error" style={{ margin: 'auto', maxWidth: '500px' ,position:'absolute',zIndex:10}}>{error}</Alert>}
      {loading && <LinearLoader />}
      <div style={{ backgroundColor: color.darkBackground, height: '15vw', alignContent: 'center' }}>
        <div className='roboto-black' style={{ color: color.secondaryDarkYellow, fontSize: '6vw', textAlign: 'center', wordSpacing: '2vw', letterSpacing: '0.7vw' }}>VERIFY USER</div>
      </div>

      <div style={{ backgroundColor: color.lightText1, marginTop: -30, borderWidth: '2px', borderStyle: 'solid', borderColor: '#FF4F01', margin: 'auto', borderRadius: '15px', width: '30vw' }}>
        <form className="login-form" style={{ display: 'flex', flexDirection: 'column', margin: 'auto', width: '80%' }} onSubmit={handleSubmit}>
          <label className='roboto-medium' style={{ color: color.darkText1, marginTop: 30, textAlign: 'left', marginBottom: 10 }} htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Your Email"
            id="email"
            name="email"
            style={{ borderRadius: '7px', borderColor: color.darkBackground, borderWidth: 1, paddingLeft: 5, backgroundColor: 'rgba(255, 214, 1, 0.5)', height: '2vw', fontSize: '1vw' }}
          />
          <label className='roboto-medium' style={{ color: color.darkText1, marginTop: 30, textAlign: 'left', marginBottom: 10 }} htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
            id="password"
            name="password"
            style={{ borderRadius: '7px', borderColor: color.darkBackground, borderWidth: 1, paddingLeft: 5, marginBottom: 10, backgroundColor: 'rgba(255, 214, 1, 0.5)', fontSize: '1vw', height: '2vw' }}
          />
          <div className='darkText2 roboto-regular' style={{ marginTop: 15, textAlign: 'right' }}>For verification process you need to be a registered user on our app.</div>
          <div style={{ marginTop: 15, marginBottom: 20, textAlign: 'right' }}><Link to="/" className='homenavitems colorprimaryDarkOrange roboto-regular' >To register yourself Download our App.</Link></div>
          <Button variant="outlined" type="submit" style={{ width: '30%', margin: 'auto', marginBottom: 30 }} disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div>

    </div>
  )
}
