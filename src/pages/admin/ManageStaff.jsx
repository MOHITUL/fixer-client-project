import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserPlus, Edit, Trash2, X } from 'lucide-react';

const ManageStaff = () => {
    const [staffs, setStaffs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const token = localStorage.getItem('access-token');

    const fetchStaffs = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/staff`, {
            headers: { authorization: `Bearer ${token}` }
        });
        setStaffs(res.data);
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
                Swal.fire('Updated!', 'Staff info updated.', 'success');
            } else {
                // Add New Staff
                staffData.password = form.password.value;
                await axios.post(`${import.meta.env.VITE_API_URL}/staff`, staffData, {
                    headers: { authorization: `Bearer ${token}` }
                });
                Swal.fire('Created!', 'New staff added to system.', 'success');
            }
            setIsModalOpen(false);
            setEditingStaff(null);
            fetchStaffs();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Action failed', 'error');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will remove the staff permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`${import.meta.env.VITE_API_URL}/staff/${id}`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                fetchStaffs();
                Swal.fire('Deleted!', 'Staff removed.', 'success');
            }
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Staff</h2>
                <button 
                    onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <UserPlus size={18}/> Add Staff
                </button>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffs.map(staff => (
                            <tr key={staff._id} className="border-t">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={staff.image} className="w-10 h-10 rounded-full object-cover" alt=""/>
                                    {staff.name}
                                </td>
                                <td className="p-4">{staff.email}</td>
                                <td className="p-4">{staff.phone}</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => { setEditingStaff(staff); setIsModalOpen(true); }} className="text-blue-600 mr-3"><Edit size={18}/></button>
                                    <button onClick={() => handleDelete(staff._id)} className="text-red-600"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Update Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500"><X/></button>
                        <h3 className="text-xl font-bold mb-4">{editingStaff ? 'Update Staff' : 'Add New Staff'}</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="name" defaultValue={editingStaff?.name} placeholder="Full Name" className="w-full p-2 border rounded" required />
                            <input name="email" defaultValue={editingStaff?.email} type="email" placeholder="Email" className="w-full p-2 border rounded" required disabled={editingStaff} />
                            <input name="phone" defaultValue={editingStaff?.phone} placeholder="Phone Number" className="w-full p-2 border rounded" required />
                            <input name="photo" defaultValue={editingStaff?.image} placeholder="Photo URL" className="w-full p-2 border rounded" required />
                            {!editingStaff && (
                                <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" required />
                            )}
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">
                                {editingStaff ? 'Save Changes' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStaff;