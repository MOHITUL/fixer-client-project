import React, { useContext } from 'react';
import { AuthContext } from "../../contexts/authcontexts/AuthContext"; 
import Swal from "sweetalert2";
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useRole from '../../hooks/useRole';

const CitizenProfile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const { isPremium, isBlocked, isLoading } = useRole();

    const handleUpdate = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const photo = e.target.photo.value;
        updateUserProfile({ displayName: name, photoURL: photo })
            .then(() => {
                Swal.fire({
                    title: "Success!",
                    text: "Profile updated successfully",
                    icon: "success",
                    confirmButtonColor: "#3B82F6"
                });
            })
            .catch(err => {
                Swal.fire({
                    title: "Error!",
                    text: err.message,
                    icon: "error",
                    confirmButtonColor: "#EF4444"
                });
            });
    };

    const handleSubscribe = async () => {
        const res = await axiosSecure.post('/payment-checkout-session', {
            cost: 1000,
            parcelName: "Premium Membership",
            senderEmail: user?.email,
            parcelId: "premium_sub"
        });
        if (res.data.url) window.location.href = res.data.url;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-8 lg:py-12">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        My <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Profile</span>
                    </h2>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center sticky top-6">
                            
                            {/* Blocked Warning */}
                            {isBlocked && (
                                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-2xl">🚫</span>
                                    </div>
                                    <p className="font-bold text-red-900 mb-1">Access Denied</p>
                                    <p className="text-sm text-red-700">Your account is blocked. Contact support.</p>
                                </div>
                            )}
                            
                            {/* Avatar */}
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500 ring-offset-4 shadow-lg">
                                    <img 
                                        src={user?.photoURL || "https://i.ibb.co/2yZ4Z3b/user.png"} 
                                        className="w-full h-full object-cover" 
                                        alt="User Avatar" 
                                    />
                                </div>
                                {isPremium && (
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                        <span className="inline-flex items-center gap-1.5 bg-linear-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                            <span>⭐</span>
                                            <span>Premium</span>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="space-y-2 mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                                    {user?.displayName || "User"}
                                    {isPremium && (
                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </h3>
                                <p className="text-gray-600">{user?.email}</p>
                            </div>

                            {/* Account Status */}
                            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 font-medium">Account Status</span>
                                    <span className={`px-3 py-1 rounded-full font-semibold ${
                                        isBlocked 
                                            ? 'bg-red-100 text-red-700' 
                                            : isPremium 
                                            ? 'bg-linear-to-r from-amber-400 to-yellow-500 text-white' 
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {isBlocked ? '🚫 Blocked' : isPremium ? '⭐ Premium' : '✓ Active'}
                                    </span>
                                </div>
                            </div>

                            {/* Premium Upgrade CTA */}
                            {!isPremium && !isBlocked && (
                                <div className="bg-linear-to-br from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
                                    <div className="mb-4">
                                        <span className="text-3xl">🚀</span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">Upgrade to Premium</h4>
                                    <p className="text-blue-100 text-sm mb-4">
                                        Unlock unlimited issue reports and priority support
                                    </p>
                                    <button 
                                        onClick={handleSubscribe} 
                                        className="w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg"
                                    >
                                        Subscribe - ৳1,000
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Edit Profile Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Edit Profile</h3>
                                <p className="text-gray-600">Update your personal information</p>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input 
                                        name="name" 
                                        defaultValue={user?.displayName} 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                        placeholder="Enter your full name" 
                                        disabled={isBlocked}
                                        required
                                    />
                                </div>

                                {/* Email Field (Read-only) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input 
                                        type="email"
                                        value={user?.email} 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" 
                                        disabled
                                        readOnly
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Email cannot be changed
                                    </p>
                                </div>

                                {/* Photo URL Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Photo URL
                                    </label>
                                    <input 
                                        name="photo" 
                                        defaultValue={user?.photoURL} 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                        placeholder="https://example.com/photo.jpg" 
                                        disabled={isBlocked}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Paste a direct link to your profile picture
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        disabled={isBlocked} 
                                        className="w-full px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-200 hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Update Profile
                                    </button>
                                </div>

                            </form>

                            {/* Additional Info */}
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h4 className="font-semibold text-gray-900 mb-4">Account Benefits</h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Issue Reporting</p>
                                            <p className="text-xs text-gray-600">
                                                {isPremium ? 'Unlimited reports' : 'Up to 3 free reports'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Priority Support</p>
                                            <p className="text-xs text-gray-600">
                                                {isPremium ? 'Enabled' : 'Upgrade to enable'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Real-time Tracking</p>
                                            <p className="text-xs text-gray-600">Track all your issues</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CitizenProfile;