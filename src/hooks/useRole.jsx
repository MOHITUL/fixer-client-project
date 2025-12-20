import React, { useContext } from 'react';
import { AuthContext } from '../contexts/authcontexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useRole = () => {
    const {user, loading} = useContext(AuthContext);

    const {data: role, isLoading} = useQuery({
        queryKey: ["role", user?.email],
        enabled: !!user?.email &&  !loading,
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/role/${user.email}`);
            return res.data.role;
        },
    });
    return {role, isLoading};
};

export default useRole;