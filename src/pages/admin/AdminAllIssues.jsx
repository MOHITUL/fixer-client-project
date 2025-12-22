import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserPlus, XCircle, ShieldCheck, Clock, AlertCircle, CheckCircle, Zap, Filter, Search } from 'lucide-react';

const AdminAllIssues = () => {
    const [issues, setIssues] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('access-token');

    const fetchData = async () => {
        try {
            const [issueRes, staffRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/admin/all-issues`, { headers: { authorization: `Bearer ${token}` } }),
                axios.get(`${import.meta.env.VITE_API_URL}/staff`, { headers: { authorization: `Bearer ${token}` } })
            ]);
            setIssues(issueRes.data);
            setStaffs(staffRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        const staffId = e.target.staff.value;
        const staff = staffs.find(s => s._id === staffId);

        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/admin/assign-staff/${selectedIssue._id}`, {
                staffId: staff._id,
                staffName: staff.name,
                staffEmail: staff.email
            }, { headers: { authorization: `Bearer ${token}` } });

            Swal.fire({
                title: 'Success!',
                text: 'Staff assigned successfully',
                icon: 'success',
                confirmButtonColor: '#3B82F6'
            });
            setShowModal(false);
            fetchData();
        } catch (err) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to assign staff',
                icon: 'error',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    const handleReject = (issue) => {
        Swal.fire({
            title: 'Reject Issue?',
            text: `Are you sure you want to reject "${issue.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, Reject',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.patch(`${import.meta.env.VITE_API_URL}/admin/reject-issue/${issue._id}`, {}, 
                        { headers: { authorization: `Bearer ${token}` } }
                    );
                    fetchData();
                    Swal.fire({
                        title: 'Rejected!',
                        text: 'Issue has been rejected.',
                        icon: 'success',
                        confirmButtonColor: '#3B82F6'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to reject issue',
                        icon: 'error',
                        confirmButtonColor: '#EF4444'
                    });
                }
            }
        });
    };

    // Filter and search logic
    const filteredIssues = issues.filter(issue => {
        const matchesSearch = issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            issue.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Calculate stats
    const stats = {
        total: issues.length,
        pending: issues.filter(i => i.status === 'pending').length,
        inProgress: issues.filter(i => i.status === 'in-progress').length,
        resolved: issues.filter(i => i.status === 'resolved').length,
        boosted: issues.filter(i => i.isBoosted).length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading issues...</p>
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
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                Manage <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Issues</span>
                            </h1>
                            <p className="text-gray-600 mt-1">Review and assign reported issues to staff</p>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 mb-8">
                    <StatCard title="Total Issues" value={stats.total} icon="📊" color="blue" />
                    <StatCard title="Pending" value={stats.pending} icon="⏳" color="amber" />
                    <StatCard title="In Progress" value={stats.inProgress} icon="🔧" color="blue" />
                    <StatCard title="Resolved" value={stats.resolved} icon="✅" color="green" />
                    <StatCard title="Boosted" value={stats.boosted} icon="⚡" color="orange" />
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by title or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            />
                        </div>

                        {/* Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none min-w-[180px]"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {/* Issues List */}
                {filteredIssues.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Issues Found</h3>
                        <p className="text-gray-600">
                            {searchTerm ? 'Try adjusting your search criteria' : 'No issues match the selected filter'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Issue</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Priority</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assigned Staff</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredIssues.map(issue => (
                                        <tr 
                                            key={issue._id} 
                                            className={`hover:bg-gray-50 transition-colors ${issue.isBoosted ? 'bg-orange-50' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {issue.isBoosted && (
                                                        <span className="inline-flex items-center gap-1 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                            <Zap size={12} />
                                                            BOOSTED
                                                        </span>
                                                    )}
                                                    <span className="font-semibold text-gray-900">{issue.title}</span>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {issue.userName || 'Anonymous'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                                    {issue.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <PriorityBadge priority={issue.priority} />
                                            </td>
                                            <td className="px-6 py-4">
                                                {issue.assignedStaff ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                                            {issue.assignedStaff.name?.charAt(0)}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{issue.assignedStaff.name}</span>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => { setSelectedIssue(issue); setShowModal(true); }} 
                                                        className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-all"
                                                    >
                                                        <UserPlus size={16}/>
                                                        Assign Staff
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={issue.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {issue.status === 'pending' && (
                                                        <button 
                                                            onClick={() => handleReject(issue)} 
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Reject issue"
                                                        >
                                                            <XCircle size={20}/>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {filteredIssues.map(issue => (
                                <div 
                                    key={issue._id} 
                                    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${issue.isBoosted ? 'ring-2 ring-orange-400' : ''}`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            {issue.isBoosted && (
                                                <span className="inline-flex items-center gap-1 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-2">
                                                    <Zap size={12} />
                                                    BOOSTED
                                                </span>
                                            )}
                                            <h3 className="font-semibold text-gray-900 mb-1">{issue.title}</h3>
                                            <p className="text-sm text-gray-500">{issue.userName || 'Anonymous'}</p>
                                        </div>
                                        <StatusBadge status={issue.status} />
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Category:</span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                                {issue.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Priority:</span>
                                            <PriorityBadge priority={issue.priority} />
                                        </div>
                                        {issue.assignedStaff && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Staff:</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                                                        {issue.assignedStaff.name?.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium">{issue.assignedStaff.name}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        {!issue.assignedStaff && (
                                            <button 
                                                onClick={() => { setSelectedIssue(issue); setShowModal(true); }} 
                                                className="flex-1 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                            >
                                                <UserPlus size={18}/>
                                                Assign
                                            </button>
                                        )}
                                        {issue.status === 'pending' && (
                                            <button 
                                                onClick={() => handleReject(issue)} 
                                                className={`${issue.assignedStaff ? 'flex-1' : ''} px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-all flex items-center justify-center gap-2`}
                                            >
                                                <XCircle size={18}/>
                                                Reject
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Results Count */}
                {filteredIssues.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Showing {filteredIssues.length} of {issues.length} issues
                    </div>
                )}

            </div>

            {/* Assign Staff Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Assign Staff Member</h3>
                                    <p className="text-sm text-gray-500 mt-1">Select a staff member for this issue</p>
                                </div>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                                >
                                    <XCircle size={20} className="text-gray-600" />
                                </button>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Issue:</p>
                                <p className="text-gray-900">{selectedIssue?.title}</p>
                            </div>

                            <form onSubmit={handleAssign} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Select Staff Member *
                                    </label>
                                    <select 
                                        name="staff" 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                                        required
                                    >
                                        <option value="">Choose a staff member...</option>
                                        {staffs.map(s => (
                                            <option key={s._id} value={s._id}>
                                                {s.name} ({s.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)} 
                                        className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-200"
                                    >
                                        Assign Staff
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

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
    const colors = {
        blue: 'from-blue-600 to-blue-500',
        green: 'from-emerald-600 to-emerald-500',
        amber: 'from-amber-500 to-orange-500',
        orange: 'from-orange-500 to-amber-500'
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

// Status Badge Component
const StatusBadge = ({ status }) => {
    const statusConfig = {
        'pending': { bg: 'bg-amber-100', text: 'text-amber-700', icon: '⏳', label: 'Pending' },
        'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🔧', label: 'In Progress' },
        'resolved': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '✅', label: 'Resolved' }
    };

    const config = statusConfig[status] || statusConfig['pending'];

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
};

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
    const priorityConfig = {
        'high': { bg: 'bg-red-100', text: 'text-red-700', label: 'High' },
        'medium': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Medium' },
        'low': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Low' }
    };

    const config = priorityConfig[priority?.toLowerCase()] || priorityConfig['low'];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
};

export default AdminAllIssues;