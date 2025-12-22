import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User, Mail, Phone, Edit3, Save, X, Loader2, Shield, Camera, CheckCircle } from 'lucide-react';

const AdminProfile = () => {
    const [adminData, setAdminData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [auth]);

    // Get admin details from db
    useEffect(() => {
        if (!currentUser?.email) return;

        const fetchAdmin = async () => {
            try {
                const token = localStorage.getItem('access-token');
                
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/admin-me/${currentUser.email}`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                setAdminData(res.data);
                setFormData(res.data);
            } catch (err) {
                console.error("Profile load error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmin();
    }, [currentUser]);

    // profile update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('access-token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/users/admin-update/${currentUser.email}`, formData, {
                headers: { authorization: `Bearer ${token}` }
            });
            
            setAdminData(formData);
            setIsEditing(false);
            Swal.fire({
                title: 'Success!',
                text: 'Profile updated successfully!',
                icon: 'success',
                confirmButtonColor: '#3B82F6'
            });
        } catch (err) {
            Swal.fire({
                title: 'Error!',
                text: 'Update failed. Please try again.',
                icon: 'error',
                confirmButtonColor: '#EF4444'
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        setFormData(adminData);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!adminData) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-red-100 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h3>
                    <p className="text-gray-600">Admin record not found in database.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-8 lg:px-8 lg:py-12">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                            <Shield className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                Admin <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Profile</span>
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your account settings and information</p>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-6">
                    
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center sticky top-6">
                            
                            {/* Avatar */}
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500 ring-offset-4 shadow-lg">
                                    <img 
                                        src={formData.image || adminData.image || "https://i.ibb.co/2yZ4Z3b/user.png"} 
                                        alt="Admin Avatar" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                    <span className="inline-flex items-center gap-1.5 bg-linear-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        <Shield size={14} />
                                        <span>Admin</span>
                                    </span>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="space-y-2 mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">{adminData.name}</h3>
                                <p className="text-gray-600 text-sm break-all">{adminData.email}</p>
                            </div>

                            {/* Stats */}
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="font-semibold text-gray-700">Active Status</span>
                                </div>
                            </div>

                            {/* Account Details */}
                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Mail size={16} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium text-gray-900 truncate">{adminData.email}</p>
                                    </div>
                                </div>

                                {adminData.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Phone size={16} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <p className="text-sm font-medium text-gray-900">{adminData.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Edit Profile Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                                    <p className="text-gray-600 mt-1">Update your personal details</p>
                                </div>
                                
                                {!isEditing && (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-semibold flex items-center gap-2"
                                    >
                                        <Edit3 size={18}/>
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            type="text" 
                                            disabled={!isEditing}
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            type="email"
                                            disabled 
                                            value={adminData.email} 
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            type="tel" 
                                            disabled={!isEditing}
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                </div>

                                {/* Photo URL */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Profile Photo URL
                                    </label>
                                    <div className="relative">
                                        <Camera className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            type="url" 
                                            disabled={!isEditing}
                                            value={formData.image || ''}
                                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Paste a direct link to your profile picture
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex-1 px-6 py-4 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X size={20} />
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={isUpdating}
                                            className="flex-1 px-6 py-4 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-200 hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20}/>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={20}/>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                            </form>

                            {/* Account Info */}
                            {!isEditing && (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-4">Account Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                                <CheckCircle size={14} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Administrator Access</p>
                                                <p className="text-xs text-gray-600">Full system permissions and control</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                                <CheckCircle size={14} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Verified Account</p>
                                                <p className="text-xs text-gray-600">Your email has been verified</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                                <CheckCircle size={14} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Secure Dashboard</p>
                                                <p className="text-xs text-gray-600">Protected by authentication</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminProfile;