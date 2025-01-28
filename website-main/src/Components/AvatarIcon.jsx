import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ReportIcon from '@mui/icons-material/Report';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { serverlink } from '../Constants';

import defalutuni from '../Assets/Images/default-user-pic-adr-info.png'
import usermale from '../Assets/Images/user-default-male.png'
import userfemale from '../Assets/Images/user-default-female.png'



export default function AvatarIcon() {
    const navigate = useNavigate();
    const [profileImageUrl, setProfileImageUrl] = React.useState('');
    async function fetchUserDetails() {
        try {
            const headers = {
                'Authorization': localStorage.getItem('authKey'),
            };
            const response = await axios.get(`${serverlink}/userdetails/get`, { headers });
            const { success, data, message } = response.data;
            if (success) {
                localStorage.setItem('profileImageUrl', data.userDetails1.profileImageUrl)
                setProfileImageUrl(data.userDetails1.profileImageUrl)
                return response.data;
            }
            if (success) {
                console.log('User details:', data);
            } else {
                console.error('Failed to fetch user details:', message);
            }
        } catch (error) {
            console.error('Failed to fetch user details:', error.message);
        }
    }

    React.useEffect(() => {
        if (!localStorage.getItem('profileImageUrl') && !profileImageUrl) {
            fetchUserDetails();
        }
    }, []);



    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleLogIn = () => {
        navigate('/user/verify')
        setAnchorEl(null);
    };

    const handleProfile = () => {
        setAnchorEl(null);
        (localStorage.getItem('authKey'))?navigate('/profile'):navigate('/user/verify');
    };

    const handleFeedback = () => {
        setAnchorEl(null);
        (localStorage.getItem('authKey'))?navigate('/feedback_reports'):navigate('/user/verify');
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        localStorage.removeItem("authKey");
    };



    return (
        <React.Fragment>
            <IconButton
                onClick={handleClick}
                color="inherit"
                aria-controls="profile-menu"
                aria-haspopup="true"
            >

                {/* <Avatar alt="User Avatar" src={localStorage.getItem('profileImageUrl') || profileImageUrl || (fetchUserDetails().data.userDetails1.gender === 'Male') ? usermale : (fetchUserDetails().data.userDetails1.gender === 'Female') ? userfemale : defalutuni} /> */}
                <Avatar alt="User Avatar" src={localStorage.getItem('profileImageUrl') || profileImageUrl ||  defalutuni} />

            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleFeedback}>
                    <ListItemIcon>
                        <RateReviewIcon fontSize="small" />
                    </ListItemIcon>
                    Feedback
                </MenuItem>
                <MenuItem onClick={handleFeedback}>
                    <ListItemIcon>
                        <ReportIcon fontSize="small" />
                    </ListItemIcon>
                    Report
                </MenuItem>
                {
                    (localStorage.getItem('authKey')) ? (
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Log-Out
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={handleLogIn}>
                            <ListItemIcon>
                                <LoginIcon fontSize="small" />
                            </ListItemIcon>
                            Log-In
                        </MenuItem>
                    )
                }
            </Menu>
        </React.Fragment>
    );
}
