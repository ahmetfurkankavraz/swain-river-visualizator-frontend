import React from 'react';
import Navbar from '../../components/Navbar';

function Home({onLogout}){
    
    return (
        <div>
            <h1>Home</h1>
            <Navbar logOut={onLogout}/>
            <div className='margin-top-20'>
            </div>
        </div>
    )
}

export default Home;