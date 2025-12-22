import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/authcontexts/AuthContext";
import { Link } from "react-router";
import Swal from "sweetalert2";

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

    //Delete
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await axios.delete(`${import.meta.env.VITE_API_URL}/${id}`, {
                headers: { authorization: `Bearer ${localStorage.getItem('access-token')}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['my-issues']);
            Swal.fire({
                title: "Deleted!",
                text: "Your issue has been removed.",
                icon: "success",
                confirmButtonColor: "#3B82F6"
            });
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
            Swal.fire({
                title: "Updated!",
                text: "Issue updated successfully.",
                icon: "success",
                confirmButtonColor: "#3B82F6"
            });
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(id);
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading your issues...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-8 lg:px-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            My <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Issues</span>
                        </h2>
                        <p className="text-gray-600">
                            {issues.length} {issues.length === 1 ? 'issue' : 'issues'} reported
                        </p>
                    </div>
                    
                    {/* Filter */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Filter by:</label>
                        <select 
                            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none min-w-40"
                            onChange={(e) => setStatusFilter(e.target.value)}
                            value={statusFilter}
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {/* Issues List - Card View for Mobile, Table for Desktop */}
                {issues.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">📋</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Issues Found</h3>
                        <p className="text-gray-600 mb-6">
                            {statusFilter ? `No ${statusFilter} issues to display.` : "You haven't reported any issues yet."}
                        </p>
                        <Link 
                            to="/report-issue"
                            className="inline-block px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all"
                        >
                            Report Your First Issue
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {issues.map((issue) => (
                                        <tr key={issue._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{issue.title}</div>
                                                <div className="text-sm text-gray-500 mt-0.5">
                                                    {new Date(issue.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                                    {issue.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={issue.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link 
                                                        to={`/issue-details/${issue._id}`} 
                                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all"
                                                    >
                                                        Details
                                                    </Link>
                                                    
                                                    {issue.status === 'pending' && (
                                                        <button 
                                                            onClick={() => setSelectedIssue(issue)}
                                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={() => handleDelete(issue._id)}
                                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
                                                    >
                                                        Delete
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
                            {issues.map((issue) => (
                                <div key={issue._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{issue.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(issue.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <StatusBadge status={issue.status} />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                            {issue.category}
                                        </span>
                                    </div>
                                    
                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <Link 
                                            to={`/issue-details/${issue._id}`} 
                                            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium text-center transition-all"
                                        >
                                            Details
                                        </Link>
                                        
                                        {issue.status === 'pending' && (
                                            <button 
                                                onClick={() => setSelectedIssue(issue)}
                                                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        
                                        <button 
                                            onClick={() => handleDelete(issue._id)}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* --- Edit Modal --- */}
            {selectedIssue && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Edit Issue</h3>
                                <button 
                                    onClick={() => setSelectedIssue(null)}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const data = Object.fromEntries(formData);
                                updateMutation.mutate({ _id: selectedIssue._id, ...data });
                            }}>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input 
                                            name="title" 
                                            defaultValue={selectedIssue.title} 
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                                            placeholder="Issue title" 
                                            required 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea 
                                            name="description" 
                                            defaultValue={selectedIssue.description} 
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none" 
                                            rows="4"
                                            placeholder="Describe the issue..." 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="flex gap-3 pt-4">
                                        <button 
                                            type="button" 
                                            onClick={() => setSelectedIssue(null)} 
                                            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-200"
                                            disabled={updateMutation.isPending}
                                        >
                                            {updateMutation.isPending ? "Updating..." : "Update Issue"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    const statusStyles = {
        pending: "bg-amber-100 text-amber-700",
        "in-progress": "bg-blue-100 text-blue-700",
        resolved: "bg-emerald-100 text-emerald-700"
    };

    const statusIcons = {
        pending: "⏳",
        "in-progress": "🔧",
        resolved: "✅"
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || statusStyles.pending}`}>
            <span>{statusIcons[status]}</span>
            <span className="capitalize">{status?.replace('-', ' ')}</span>
        </span>
    );
};

export default MyIssues;