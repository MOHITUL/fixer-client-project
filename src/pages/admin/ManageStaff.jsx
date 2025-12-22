import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserPlus, Edit, Trash2, X, Users, Mail, Phone, Image } from 'lucide-react';

const ManageStaff = () => {
    const [staffs, setStaffs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('access-token');

    const fetchStaffs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/staff`, {
                headers: { authorization: `Bearer ${token}` }
            });
            setStaffs(res.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStaffs(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const staffData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            photo: form.photo.value,
        };

        try {
            if (editingStaff) {
                // Update Staff
                await axios.patch(`${import.meta.env.VITE_API_URL}/staff/${editingStaff._id}`, staffData, {
                    headers: { authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    title: 'Updated!',
                    text: 'Staff info updated successfully.',
                    icon: 'success',
                    confirmButtonColor: '#3B82F6'
                });
            } else {
                // Add New Staff
                staffData.password = form.password.value;
                await axios.post(`${import.meta.env.VITE_API_URL}/staff`, staffData, {
                    headers: { authorization: `Bearer ${token}` }
                });
                Swal.fire({
                    title: 'Created!',
                    text: 'New staff added to system.',
                    icon: 'success',
                    confirmButtonColor: '#3B82F6'
                });
            }
            setIsModalOpen(false);
            setEditingStaff(null);
            form.reset();
            fetchStaffs();
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Action failed',
                icon: 'error',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    const handleDelete = (id, name) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `This will remove ${name} permanently!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${import.meta.env.VITE_API_URL}/staff/${id}`, {
                        headers: { authorization: `Bearer ${token}` }
                    });
                    fetchStaffs();
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Staff member removed.',
                        icon: 'success',
                        confirmButtonColor: '#3B82F6'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete staff member',
                        icon: 'error',
                        confirmButtonColor: '#EF4444'
                    });
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading staff...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-8 lg:px-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <header className="mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                                <Users className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                    Manage <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Staff</span>
                                </h1>
                                <p className="text-gray-600 mt-1">{staffs.length} staff members</p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
                            className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-200 hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <UserPlus size={20}/>
                            Add New Staff
                        </button>
                    </div>
                </header>

                {/* Staff List */}
                {staffs.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Staff Members Yet</h3>
                        <p className="text-gray-600 mb-6">Get started by adding your first staff member</p>
                        <button 
                            onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
                            className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all inline-flex items-center gap-2"
                        >
                            <UserPlus size={20}/>
                            Add First Staff
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Staff Member</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {staffs.map(staff => (
                                        <tr key={staff._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100">
                                                        <img 
                                                            src={staff.image || "https://i.ibb.co/2yZ4Z3b/user.png"} 
                                                            className="w-full h-full object-cover" 
                                                            alt={staff.name}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{staff.name}</div>
                                                        <div className="text-sm text-gray-500">Staff Member</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{staff.email}</td>
                                            <td className="px-6 py-4 text-gray-600">{staff.phone}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => { setEditingStaff(staff); setIsModalOpen(true); }} 
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit staff"
                                                    >
                                                        <Edit size={18}/>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(staff._id, staff.name)} 
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete staff"
                                                    >
                                                        <Trash2 size={18}/>
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
                            {staffs.map(staff => (
                                <div key={staff._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0">
                                            <img 
                                                src={staff.image || "https://i.ibb.co/2yZ4Z3b/user.png"} 
                                                className="w-full h-full object-cover" 
                                                alt={staff.name}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 mb-1">{staff.name}</h3>
                                            <p className="text-sm text-gray-600 mb-1">{staff.email}</p>
                                            <p className="text-sm text-gray-600">{staff.phone}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <button 
                                            onClick={() => { setEditingStaff(staff); setIsModalOpen(true); }} 
                                            className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Edit size={18}/>
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(staff._id, staff.name)} 
                                            className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={18}/>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </div>

            {/* Add/Update Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {editingStaff ? 'Update Staff Member' : 'Add New Staff Member'}
                                </h3>
                                <button 
                                    onClick={() => { setIsModalOpen(false); setEditingStaff(null); }}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                                >
                                    <X size={20} className="text-gray-600" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            name="name" 
                                            defaultValue={editingStaff?.name}
                                            placeholder="John Doe" 
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            name="email" 
                                            defaultValue={editingStaff?.email}
                                            type="email" 
                                            placeholder="john@example.com" 
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-50 disabled:cursor-not-allowed" 
                                            required 
                                            disabled={editingStaff}
                                        />
                                    </div>
                                    {editingStaff && (
                                        <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            name="phone" 
                                            defaultValue={editingStaff?.phone}
                                            placeholder="+1 234 567 8900" 
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Photo URL */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Photo URL *
                                    </label>
                                    <div className="relative">
                                        <Image className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            name="photo" 
                                            defaultValue={editingStaff?.image}
                                            placeholder="https://example.com/photo.jpg" 
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Password - Only for new staff */}
                                {!editingStaff && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Password *
                                        </label>
                                        <input 
                                            name="password" 
                                            type="password" 
                                            placeholder="Enter secure password" 
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                            required 
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Minimum 6 characters recommended</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        className="w-full px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-200 hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        {editingStaff ? (
                                            <>
                                                <Edit size={20} />
                                                Save Changes
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus size={20} />
                                                Create Account
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStaff;