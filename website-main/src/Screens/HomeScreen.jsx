import React from 'react'
import Lottie from "lottie-react";
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import './css/home.css'

import play from "../Assets/Lottie/playbutton.json";
import popcorn from "../Assets/Lottie/popcorn.json"
import logovideo from "../Assets/Video/finallogoanimation.mp4"

import * as color from '../Assets/Colors/color'

import AndroidOutlinedIcon from '@mui/icons-material/AndroidOutlined';

import AvatarIcon from '../Components/AvatarIcon';
import MainFeaturesCarousel from '../Components/MainFeaturesCarousel';
import FeedbackCarousel from '../Components/FeedbackCarousel';


export default function HomeScreen() {

    const downloadApk = () => {
        // Replace 'your-apk-filename.apk' with the actual filename of your APK file
        const apkUrl = '../src/Assets/Cinepulse.apk';
        window.open(apkUrl);
    }

    return (
        <div style={{ backgroundColor: color.darkBackground }}>


            <div className="roboto-medium" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <AvatarIcon />
            </div>


            <div style={{ width: '100vw', height: '100vh', alignContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <ReactPlayer
                        width='30%'
                        height='30%'
                        playing
                        loop
                        muted
                        url={logovideo}
                    />

                    <div style={{ margin: 20 }}>
                        <div style={{ marginBottom: 50, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Lottie animationData={popcorn} style={{ width: 200, height: 200 }} loop={true} />
                            <div className='roboto-black lightText2' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'start' }}>
                                <h1>Unlock Your</h1>
                                <h1>Cinematic Experience....</h1>
                            </div>
                        </div>


                        <div>
                            <a href="/Cinepulse.apk" download>
                                <Button variant="outlined" startIcon={<AndroidOutlinedIcon />}>
                                    Download For Android
                                </Button>
                            </a>
                            {/* <Button variant="outlined" onClick={() => downloadApk()}  startIcon={<AndroidOutlinedIcon />}>Download For Android </Button> */}
                        </div>
                    </div>

                    <Lottie animationData={play} style={{ margin: -50, width: 500, height: 500 }} loop={true} />
                </div>
            </div>
            <div style={{ marginTop: -50 }}>
                <div className='roboto-bold colorsecondaryDarkYellow' style={{ fontSize: 30, letterSpacing: 2, marginBottom: 20 }}>Features</div>
                <MainFeaturesCarousel />
            </div>
            <div style={{ marginTop: 50 }}>
                <div className='roboto-bold colorsecondaryDarkYellow' style={{ fontSize: 30, letterSpacing: 2, marginBottom: 20 }}>Feedbacks</div>
                <FeedbackCarousel />
            </div>


            <div style={{ marginTop: 50, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <div>
                    <div style={{ textAlign: 'center', color: color.primaryDarkOrange, fontSize: '20px' }} className='roboto-medium'>Our</div>
                    <div> <a style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer" href="https://cinepulse-terms-and-condition.netlify.app/" className='homenavitems lightText1 roboto-regular'>Terms and Condition</a></div>
                    <div> <a style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer" href="https://cinepulse-policies.netlify.app/" className='homenavitems lightText1 roboto-regular'>Privacy Policies</a></div>
                    <div> <Link style={{ textDecoration: 'none' }} to="/members" className='homenavitems lightText1 roboto-regular' >Team</Link></div>
                    <div> <Link style={{ textDecoration: 'none' }} to="/working" className='homenavitems lightText1 roboto-regular' >Working</Link></div>
                </div>

                <div>
                    <div style={{ textAlign: 'center', color: color.primaryDarkOrange, fontSize: '20px' }} className='roboto-medium'>Contact</div>
                    <div className='lightText1 roboto-regular'>www.cinepulse.com</div>
                    <div className='lightText1 roboto-regular'>cinepulsegroup@gmail.com</div>
                    <div className='lightText1 roboto-regular'>Kolkata, India</div>
                </div>
            </div>

            <footer className='lightText1 roboto-regular' style={{ marginTop: 15, textAlign: 'center' }}>

                <i class="fa-solid fa-heart fa-beat-fade" style={{ color: '#ff0000' }}></i>
                {' '}
                from CinePulse Team
            </footer>


        </div>
    )
}
