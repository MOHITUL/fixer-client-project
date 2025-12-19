import React from 'react';
import logo from '../../assets/icons8-fixer-44.png'
import { Link } from 'react-router';

const Logo = () => {
    return (
        <Link to='/'>
        <div className='flex items-end'>
            <img src={logo} alt="" />
            <h3 className='
text-4xl font-semibold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-300'>FIXER</h3>
        </div>
        </Link>
    );
};

export default Logo;