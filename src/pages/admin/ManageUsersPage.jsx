import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserX, CheckCircle, Info } from 'lucide-react';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/citizens`, {
                headers: { authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading users", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBlock = (user) => {
        const isBlocking = user.status !== 'blocked';
        
        Swal.fire({
            title: `Are you sure?`,
            text: `You want to ${isBlocking ? 'Block' : 'Unblock'} ${user.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isBlocking ? '#d33' : '#3085d6',
            cancelButtonColor: '#aaa',
            confirmButtonText: `Yes, ${isBlocking ? 'Block' : 'Unblock'}!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('access-token');
                    await axios.patch(`${import.meta.env.VITE_API_URL}/users/status/${user._id}`, 
                        { status: isBlocking ? 'blocked' : 'active' },
                        { headers: { authorization: `Bearer ${token}` } }
                    );
                    
                    Swal.fire('Updated!', `User has been ${isBlocking ? 'blocked' : 'unblocked'}.`, 'success');
                    fetchUsers(); // Refresh the list
                } catch (error) {
                    Swal.fire('Error', 'Something went wrong!', 'error');
                }
            }
        });
    };

    const showSubscriptionInfo = (user) => {
        Swal.fire({
            title: 'Subscription Details',
            html: `
                <div class="text-left">
                    <p><b>Plan:</b> ${user.subscriptionPlan || 'Free'}</p>
                    <p><b>Status:</b> ${user.isSubscribed ? '✅ Active' : '❌ Inactive'}</p>
                    <p><b>Expiry:</b> ${user.expiryDate || 'N/A'}</p>
                </div>
            `,
            icon: 'info'
        });
    };

    if (loading) return <div className="p-10 text-center">Loading Citizens...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Manage Citizens</h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 border-b">User</th>
                            <th className="p-4 border-b">Email</th>
                            <th className="p-4 border-b">Subscription</th>
                            <th className="p-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50 transition border-b">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={user.image} alt="" className="w-10 h-10 rounded-full border" />
                                    <span className={`font-medium ${user.status === 'blocked' ? 'text-red-500' : ''}`}>
                                        {user.name} {user.status === 'blocked' && '(Blocked)'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">{user.email}</td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => showSubscriptionInfo(user)}
                                        className="flex items-center gap-1 text-blue-600 hover:underline"
                                    >
                                        <Info size={16}/> View Info
                                    </button>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleToggleBlock(user)}
                                        className={`px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition ${
                                            user.status === 'blocked' 
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                        }`}
                                    >
                                        {user.status === 'blocked' ? <CheckCircle size={18}/> : <UserX size={18}/>}
                                        {user.status === 'blocked' ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsersPage;