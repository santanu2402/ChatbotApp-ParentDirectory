import React from 'react'
import AvatarIcon from './AvatarIcon'
import { Link } from 'react-router-dom'

export default function NavBar() {
    return (
        <div className="roboto-medium" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div style={{ fontSize: 20, marginRight: 30 }}>  <Link to="/" className='homenavitems lightText1 roboto-medium' >Home</Link></div>
            <AvatarIcon />
        </div>

    )
}
