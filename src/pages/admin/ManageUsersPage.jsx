import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserX, CheckCircle, Info, Users, Search, Shield, Crown } from 'lucide-react';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBlock = (user) => {
        const isBlocking = user.status !== 'blocked';
        
        Swal.fire({
            title: `Are you sure?`,
            text: `You want to ${isBlocking ? 'Block' : 'Unblock'} ${user.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isBlocking ? '#EF4444' : '#3B82F6',
            cancelButtonColor: '#6B7280',
            confirmButtonText: `Yes, ${isBlocking ? 'Block' : 'Unblock'}!`,
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('access-token');
                    await axios.patch(`${import.meta.env.VITE_API_URL}/users/status/${user._id}`, 
                        { status: isBlocking ? 'blocked' : 'active' },
                        { headers: { authorization: `Bearer ${token}` } }
                    );
                    
                    Swal.fire({
                        title: 'Updated!',
                        text: `User has been ${isBlocking ? 'blocked' : 'unblocked'}.`,
                        icon: 'success',
                        confirmButtonColor: '#3B82F6'
                    });
                    fetchUsers();
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Something went wrong!',
                        icon: 'error',
                        confirmButtonColor: '#EF4444'
                    });
                }
            }
        });
    };

    const showSubscriptionInfo = (user) => {
        const isPremium = user.role === 'premium' || user.subscriptionPlan === 'Premium';
        
        Swal.fire({
            title: 'Subscription Details',
            html: `
                <div class="text-left space-y-3 p-4">
                    <div class="flex items-center justify-between py-2 border-b">
                        <span class="font-semibold text-gray-700">User:</span>
                        <span class="text-gray-900">${user.name}</span>
                    </div>
                    <div class="flex items-center justify-between py-2 border-b">
                        <span class="font-semibold text-gray-700">Plan:</span>
                        <span class="font-bold ${isPremium ? 'text-amber-600' : 'text-gray-600'}">
                            ${isPremium ? '⭐ Premium' : '📋 Free'}
                        </span>
                    </div>
                    <div class="flex items-center justify-between py-2 border-b">
                        <span class="font-semibold text-gray-700">Status:</span>
                        <span class="${user.isSubscribed ? 'text-green-600' : 'text-red-600'} font-medium">
                            ${user.isSubscribed ? '✅ Active' : '❌ Inactive'}
                        </span>
                    </div>
                    <div class="flex items-center justify-between py-2">
                        <span class="font-semibold text-gray-700">Expiry:</span>
                        <span class="text-gray-900">${user.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>
            `,
            icon: 'info',
            confirmButtonColor: '#3B82F6',
            width: '500px'
        });
    };

    // Filter users based on search and status
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || 
                            (filterStatus === 'blocked' && user.status === 'blocked') ||
                            (filterStatus === 'active' && user.status !== 'blocked') ||
                            (filterStatus === 'premium' && user.role === 'premium');
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: users.length,
        active: users.filter(u => u.status !== 'blocked').length,
        blocked: users.filter(u => u.status === 'blocked').length,
        premium: users.filter(u => u.role === 'premium').length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-8 lg:px-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                            <Users className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                Manage <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Citizens</span>
                            </h1>
                            <p className="text-gray-600 mt-1">View and manage all registered users</p>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    <StatCard title="Total Users" value={stats.total} icon="👥" color="blue" />
                    <StatCard title="Active" value={stats.active} icon="✅" color="green" />
                    <StatCard title="Blocked" value={stats.blocked} icon="🚫" color="red" />
                    <StatCard title="Premium" value={stats.premium} icon="⭐" color="amber" />
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            />
                        </div>

                        {/* Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none min-w-[160px]"
                        >
                            <option value="all">All Users</option>
                            <option value="active">Active Only</option>
                            <option value="blocked">Blocked Only</option>
                            <option value="premium">Premium Only</option>
                        </select>
                    </div>
                </div>

                {/* Users Table/Cards */}
                {filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Users Found</h3>
                        <p className="text-gray-600">
                            {searchTerm ? 'Try adjusting your search criteria' : 'No users match the selected filter'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plan</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100">
                                                        <img 
                                                            src={user.image || "https://i.ibb.co/2yZ4Z3b/user.png"} 
                                                            alt={user.name}
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-gray-900">{user.name}</span>
                                                            {user.role === 'premium' && (
                                                                <Crown size={16} className="text-amber-500" />
                                                            )}
                                                        </div>
                                                        {user.status === 'blocked' && (
                                                            <span className="text-xs text-red-600 font-medium">Blocked Account</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <UserStatusBadge status={user.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <PlanBadge role={user.role} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => showSubscriptionInfo(user)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View subscription info"
                                                    >
                                                        <Info size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleBlock(user)}
                                                        className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
                                                            user.status === 'blocked' 
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }`}
                                                    >
                                                        {user.status === 'blocked' ? <CheckCircle size={18}/> : <UserX size={18}/>}
                                                        {user.status === 'blocked' ? 'Unblock' : 'Block'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {filteredUsers.map(user => (
                                <div key={user._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0">
                                            <img 
                                                src={user.image || "https://i.ibb.co/2yZ4Z3b/user.png"} 
                                                alt={user.name}
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                                                {user.role === 'premium' && (
                                                    <Crown size={16} className="text-amber-500 flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 truncate mb-2">{user.email}</p>
                                            <div className="flex items-center gap-2">
                                                <UserStatusBadge status={user.status} />
                                                <PlanBadge role={user.role} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => showSubscriptionInfo(user)}
                                            className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Info size={18} />
                                            Info
                                        </button>
                                        <button
                                            onClick={() => handleToggleBlock(user)}
                                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                                user.status === 'blocked' 
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                        >
                                            {user.status === 'blocked' ? <CheckCircle size={18}/> : <UserX size={18}/>}
                                            {user.status === 'blocked' ? 'Unblock' : 'Block'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Results Count */}
                {filteredUsers.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                )}

            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
    const colors = {
        blue: 'from-blue-600 to-blue-500',
        green: 'from-emerald-600 to-emerald-500',
        red: 'from-red-600 to-red-500',
        amber: 'from-amber-500 to-yellow-500'
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{icon}</span>
            </div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">{title}</p>
            <h3 className={`text-3xl font-bold bg-linear-to-r ${colors[color]} bg-clip-text text-transparent`}>
                {value}
            </h3>
        </div>
    );
};

// User Status Badge 
const UserStatusBadge = ({ status }) => {
    if (status === 'blocked') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <Shield size={12} />
                Blocked
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle size={12} />
            Active
        </span>
    );
};

// Plan Badge 
const PlanBadge = ({ role }) => {
    if (role === 'premium') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-amber-400 to-yellow-500 text-white">
                <Crown size={12} />
                Premium
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            Free
        </span>
    );
};

export default ManageUsersPage;