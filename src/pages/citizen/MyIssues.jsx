import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authcontexts/AuthContext";
import { Link } from "react-router";
import Swal from "sweetalert2"; // npm install sweetalert2

const MyIssues = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedIssue, setSelectedIssue] = useState(null);

    //Fetch Data
    const { data: issues = [], isLoading } = useQuery({
        queryKey: ['my-issues', user?.email, statusFilter],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/my-issues/${user?.email}?status=${statusFilter}`, {
                headers: { authorization: `Bearer ${localStorage.getItem('access-token')}` }
            });
            return res.data;
        }
    });

    //Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await axios.delete(`${import.meta.env.VITE_API_URL}/${id}`, {
                headers: { authorization: `Bearer ${localStorage.getItem('access-token')}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-issues']);
            Swal.fire("Deleted!", "Your issue has been removed.", "success");
        }
    });

    //Update Mutation
    const updateMutation = useMutation({
        mutationFn: async (updatedData) => {
            const { _id, ...data } = updatedData;
            return await axios.patch(`${import.meta.env.VITE_API_URL}/issues/${_id}`, data, {
                headers: { authorization: `Bearer ${localStorage.getItem('access-token')}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-issues']);
            setSelectedIssue(null);
            Swal.fire("Updated!", "Issue updated successfully.", "success");
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(id);
        });
    };

    if (isLoading) return <p className="text-center p-10">Loading your issues...</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold">My Reported Issues ({issues.length})</h2>
                
                {/* Filters */}
                <select 
                    className="select select-bordered w-full max-w-xs border-gray-300 rounded-lg p-2"
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {/* Issues Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="table w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map((issue) => (
                            <tr key={issue._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{issue.title}</td>
                                <td className="p-4">{issue.category}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                        ${issue.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                          issue.status === 'resolved' ? 'bg-green-100 text-green-700' : 
                                          'bg-blue-100 text-blue-700'}`}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td className="p-4 flex justify-center gap-2">
                                    <Link to={`/issue-details/${issue._id}`} className="btn-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-sm">Details</Link>
                                    
                                    {issue.status === 'pending' && (
                                        <button 
                                            onClick={() => setSelectedIssue(issue)}
                                            className="btn-sm bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                        >Edit</button>
                                    )}
                                    
                                    <button 
                                        onClick={() => handleDelete(issue._id)}
                                        className="btn-sm bg-red-500 text-white px-3 py-1 rounded text-sm"
                                    >Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Edit Modal --- */}
            {selectedIssue && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Edit Issue</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData);
                            updateMutation.mutate({ _id: selectedIssue._id, ...data });
                        }}>
                            <div className="space-y-4">
                                <input name="title" defaultValue={selectedIssue.title} className="w-full border p-2 rounded" placeholder="Title" required />
                                <textarea name="description" defaultValue={selectedIssue.description} className="w-full border p-2 rounded h-24" placeholder="Description" required />
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setSelectedIssue(null)} className="px-4 py-2 text-gray-500">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg">Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyIssues;