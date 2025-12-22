import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../contexts/authcontexts/AuthContext';
import { Settings2, Filter, ArrowRightCircle } from 'lucide-react';

const AssignedIssues = () => {
    const { user } = useContext(AuthContext);
    const [issues, setIssues] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const token = localStorage.getItem('access-token');

    const fetchIssues = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/staff/assigned-issues/${user.email}`, {
            headers: { authorization: `Bearer ${token}` }
        });
        setIssues(res.data);
    };

    useEffect(() => {
        if (user?.email) fetchIssues();
    }, [user]);

    // স্ট্যাটাস পরিবর্তনের লজিক (স্টেপ বাই স্টেপ)
    const getNextStatusOptions = (currentStatus) => {
        switch (currentStatus) {
            case 'pending': return ['in-progress'];
            case 'in-progress': return ['working'];
            case 'working': return ['resolved'];
            case 'resolved': return ['closed'];
            default: return [];
        }
    };

    const handleStatusChange = async (id, currentStatus, newStatus) => {
        if (!newStatus) return;

        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/staff/update-status/${id}`, {
                newStatus,
                message: `Staff changed status from ${currentStatus} to ${newStatus}`
            }, { headers: { authorization: `Bearer ${token}` } });

            Swal.fire({
                title: 'Success!',
                text: `Status updated to ${newStatus}`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            fetchIssues();
        } catch (err) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    // ফিল্টারিং লজিক
    const filteredIssues = issues.filter(issue => {
        const statusMatch = filterStatus === "all" || issue.status === filterStatus;
        const priorityMatch = filterPriority === "all" || issue.priority === filterPriority;
        return statusMatch && priorityMatch;
    });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                    <Settings2 className="text-blue-600" /> Assigned Issues
                </h2>

                {/* --- Filters --- */}
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                        <Filter size={16} className="text-gray-400" />
                        <select onChange={(e) => setFilterStatus(e.target.value)} className="outline-none text-sm font-medium">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In-Progress</option>
                            <option value="working">Working</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                        <select onChange={(e) => setFilterPriority(e.target.value)} className="outline-none text-sm font-medium">
                            <option value="all">All Priority</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- Issues Table --- */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
                        <tr>
                            <th className="p-4">Title & Info</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Current Status</th>
                            <th className="p-4">Update Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredIssues.map(issue => (
                            <tr key={issue._id} className={`${issue.isBoosted ? 'bg-orange-50/40' : 'hover:bg-gray-50'}`}>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {issue.isBoosted && <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Boosted</span>}
                                        <p className="font-bold text-gray-800">{issue.title}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{issue.category} • Submitted: {new Date(issue.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${issue.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {issue.priority.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="capitalize text-sm font-medium flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${issue.status === 'resolved' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        {issue.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {issue.status === 'closed' ? (
                                        <span className="text-gray-400 text-xs flex items-center gap-1 italic"><ArrowRightCircle size={14}/> Finalized</span>
                                    ) : (
                                        <select 
                                            value=""
                                            onChange={(e) => handleStatusChange(issue._id, issue.status, e.target.value)}
                                            className="bg-blue-50 text-blue-700 text-xs font-bold p-2 rounded-lg border border-blue-100 outline-none cursor-pointer hover:bg-blue-100"
                                        >
                                            <option value="" disabled>Change Status</option>
                                            {getNextStatusOptions(issue.status).map(opt => (
                                                <option key={opt} value={opt}>Move to {opt.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredIssues.length === 0 && (
                    <div className="p-10 text-center text-gray-500">No assigned issues found matching the criteria.</div>
                )}
            </div>
        </div>
    );
};

export default AssignedIssues;