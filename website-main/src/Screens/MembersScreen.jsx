import React from 'react';
import * as color from '../Assets/Colors/color';
import Lottie from 'lottie-react';
import devgrad from "../Assets/Lottie/developerbackground.json";
import mengrad from "../Assets/Lottie/mentorbackground.json";
import sirImg from "../Assets/Profilepic/sir.png";
import santanuImg from "../Assets/Profilepic/santanu.png";
import anuskaImg from "../Assets/Profilepic/anuska.png";
import isshitaImg from "../Assets/Profilepic/isshita.png";
import { Link } from 'react-router-dom';
import AvatarIcon from '../Components/AvatarIcon';

export default function MembersScreen() {
  return (
    <div style={{ height: "100vh", width: "100vw", backgroundColor: color.darkBackground, position: 'relative' }}>

      <div className="roboto-medium" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{ fontSize: 20, marginRight: 30 }}>  <Link to="/" className='homenavitems lightText1 roboto-medium' >Home</Link></div>
        <AvatarIcon />
      </div>

      <div className='roboto-bold colorsecondaryDarkYellow' style={{ fontSize: 30, letterSpacing: 2 }}>Our Team</div>
      <div className='middle'>
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: '-48px' }}>

          <div style={{ position: 'relative', height: "20vw", width: "20vw" }}>
            <Lottie className='animation' style={{ height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }} animationData={mengrad} loop={true} />
            <img src={sirImg} alt="Sir" style={{ borderRadius: '100px', height: "10vw", width: "10vw", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          </div>

          <div style={{ textAlign: 'left' }}>
            <div className='roboto-medium' style={{ color: color.secondaryDarkYellow }}>Shubhendu Banerjee, Mentor</div>
            <div className='roboto-regular' style={{ color: color.lightText1 }}>Assistant Professor, Department of CSE </div>
            <div className='roboto-regular' style={{ color: color.lightText1 }}>Narula Institute of Technology</div>
            <div> <a style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/shubhendu-banerjee-041988134/" className=' colorprimaryDarkOrange roboto-regular'>Linkedin Profile</a></div>
          </div>

        </div>
      </div>


      <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: '-80px' }}>


        <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>

          <div style={{ position: 'relative', height: "20vw", width: "20vw" }}>
            <Lottie className='animation' style={{ height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }} animationData={devgrad} loop={true} />
            <img src={santanuImg} alt="Sir" style={{ borderRadius: '100px', height: "10vw", width: "10vw", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div className='roboto-medium' style={{ color: color.secondaryDarkYellow }}>Santanu Mandal, Developer</div>
            <div className='roboto-regular' style={{ color: color.lightText1 }}>CSE Final Year Student </div>
            <div className='roboto-regular' style={{ color: color.lightText1 }}>Narula Institute of Technology</div>
            <div> <a style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/santanu-mandal-346a41238/" className=' colorprimaryDarkOrange roboto-regular'>Linkedin Profile</a></div>
          </div>

        </div>

        <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>

          <div style={{ position: 'relative', height: "20vw", width: "20vw" }}>
            <Lottie className='animation' style={{ height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }} animationData={devgrad} loop={true} />
            <img src={anuskaImg} alt="Sir" style={{ borderRadius: '100px', height: "10vw", width: "10vw", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div className='roboto-medium' style={{ color: color.secondaryDarkYellow }}>Anuska Paul, Developer</div>
            <div className='roboto-regular' style={{ color: color.lightText1 }}>CSE Final Year Student </div>
            <div className='roboto-regular' style={{ color: color.lightText1 }}>Narula Institute of Technology</div>
            <div> <a style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/anuska-paul-84b48b261/" className=' colorprimaryDarkOrange roboto-regular'>Linkedin Profile</a></div>
          </div>

        </div>

        <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>

          <div style={{ position: 'relative', height: "20vw", width: "20vw" }}>
            <Lottie className='animation' style={{ height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }} animationData={devgrad} loop={true} />
            <img src={isshitaImg} alt="Sir" style={{ borderRadius: '100px', height: "10vw", width: "10vw", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div className='roboto-medium' style={{ color: color.secondaryDarkYellow }}>Isshita Ghosh, Developer</div>
            <div className='roboto-regular' style={{ color: color.lightText1 }}>CSE Final Year Student </div>
            <div className='roboto-regular' style={{ color: color.lightText1 }}>Narula Institute of Technology</div>
            <div> <a style={{ textDecoration: 'none' }} target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/isshita-ghosh-b770a81bb/" className=' colorprimaryDarkOrange roboto-regular'>Linkedin Profile</a></div>
          </div>

        </div>

      </div>
    </div>
  );
}
