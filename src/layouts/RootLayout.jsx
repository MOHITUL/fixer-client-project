import React from 'react';
import Footer from '../pages/shared/Footer';
import NavBar from '../pages/shared/NavBar';
import { Outlet } from 'react-router';

const RootLayout = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <NavBar></NavBar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;