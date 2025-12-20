import React from 'react';
import logo from '../../assets/icons8-fixer-44.png'
import { Link } from 'react-router';

const Logo = () => {
    return (
        <Link to='/' className='group flex items-center gap-2.5 transition-transform duration-300 hover:scale-105'>
            {/* Icon with subtle container */}
            <div className='w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 p-2 transition-all duration-300 flex items-center justify-center border border-blue-100'>
                <img 
                    src={logo} 
                    alt="CivicFix Logo" 
                    className='w-full h-full object-contain opacity-80'
                />
            </div>
            
            {/* Text Logo */}
            <span className='text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300'>
                Civic<span className='bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent'>Fix</span>
            </span>
        </Link>
    );
};

export default Logo;
