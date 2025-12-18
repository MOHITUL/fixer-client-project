import React from 'react';
import Footer from '../pages/shared/Footer';
import NavBar from '../pages/shared/NavBar';
import { Outlet } from 'react-router';

const RootLayout = () => {
    return (
        <div className='min-h-[calc(100vh-68px)]'>
            <NavBar></NavBar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;