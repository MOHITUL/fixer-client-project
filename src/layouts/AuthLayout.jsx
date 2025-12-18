import React from 'react';
import Logo from '../components/logo/Logo';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <Logo/>
            <div>
                <Outlet/>
            </div>

        </div>
    );
};

export default AuthLayout;