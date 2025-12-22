import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router';
import { AuthContext } from '../../contexts/authcontexts/AuthContext';
import Swal from 'sweetalert2';
import { Search, MapPin, ThumbsUp, Eye, Filter, Zap, AlertCircle } from 'lucide-react';

const AllIssues = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ category: 'all', status: 'all', priority: 'all' });

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const { category, status, priority } = filters;
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/all-issues?search=${search}&category=${category}&status=${status}&priority=${priority}`);
            setIssues(res.data);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => fetchIssues(), 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search, filters]);

    const handleUpvote = async (id, issueEmail) => {
        if (!user) return navigate('/login');
        if (user.email === issueEmail) {
            return Swal.fire({
                title: 'Not Allowed',
                text: "You can't upvote your own issue!",
                icon: 'error',
                confirmButtonColor: '#EF4444'
            });
        }

        try {
            const token = localStorage.getItem('access-token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/issues/upvote/${id}`, {}, {
                headers: { authorization: `Bearer ${token}` }
            });
            fetchIssues();
        } catch (err) {
            Swal.fire({
                title: 'Info',
                text: err.response?.data?.message || 'Something went wrong',
                icon: 'info',
                confirmButtonColor: '#3B82F6'
            });
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-8 lg:px-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <header className="mb-10">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                            Browse <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Issues</span>
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore reported issues in your community and support the ones that matter to you
                        </p>
                    </div>
                </header>

                {/* Search & Filter Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8">
                    <div className="flex flex-col gap-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search issues by title or location..." 
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                            />
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">Category</label>
                                <select 
                                    onChange={(e) => setFilters({...filters, category: e.target.value})} 
                                    value={filters.category}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="Roads">🚗 Roads & Transport</option>
                                    <option value="Drainage">💧 Drainage</option>
                                    <option value="Waste">🗑️ Waste Management</option>
                                    <option value="Lighting">💡 Street Lighting</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">Status</label>
                                <select 
                                    onChange={(e) => setFilters({...filters, status: e.target.value})} 
                                    value={filters.status}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">⏳ Pending</option>
                                    <option value="in-progress">🔧 In Progress</option>
                                    <option value="resolved">✅ Resolved</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">Priority</label>
                                <select 
                                    onChange={(e) => setFilters({...filters, priority: e.target.value})} 
                                    value={filters.priority}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                                >
                                    <option value="all">All Priorities</option>
                                    <option value="high">🔴 High</option>
                                    <option value="medium">🟡 Medium</option>
                                    <option value="low">🟢 Low</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                {!loading && issues.length > 0 && (
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{issues.length}</span> issue{issues.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}

                {/* Issues Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                                <div className="h-48 bg-gray-200 animate-pulse"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : issues.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Issues Found</h3>
                        <p className="text-gray-600 mb-6">
                            {search || filters.category !== 'all' || filters.status !== 'all' 
                                ? 'Try adjusting your search or filters' 
                                : 'No issues have been reported yet'}
                        </p>
                        {user && (
                            <Link 
                                to="/report-issue"
                                className="inline-block px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all"
                            >
                                Report First Issue
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {issues.map(issue => (
                            <IssueCard 
                                key={issue._id} 
                                issue={issue} 
                                user={user} 
                                onUpvote={handleUpvote}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

// Issue Card Component
const IssueCard = ({ issue, user, onUpvote }) => {
    const statusConfig = {
        'pending': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
        'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
        'resolved': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Resolved' }
    };

    const priorityConfig = {
        'high': { bg: 'bg-red-100', text: 'text-red-700', label: 'High' },
        'medium': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Medium' },
        'low': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Low' }
    };

    const status = statusConfig[issue.status?.toLowerCase()] || statusConfig['pending'];
    const priority = priorityConfig[issue.priority?.toLowerCase()] || priorityConfig['low'];
    const hasUpvoted = issue.upvotedBy?.includes(user?.email);

    return (
        <div className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative ${
            issue.isBoosted 
                ? 'ring-2 ring-orange-400 shadow-lg shadow-orange-100' 
                : 'border-gray-100 hover:border-blue-200'
        }`}>
            {/* Boosted Badge */}
            {issue.isBoosted && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        <Zap size={12} />
                        BOOSTED
                    </span>
                </div>
            )}
            
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <img 
                    src={issue.image} 
                    alt={issue.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            {/* Content */}
            <div className="p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${priority.bg} ${priority.text}`}>
                        {priority.label}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${status.bg} ${status.text}`}>
                        {status.label}
                    </span>
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                    {issue.title}
                </h3>
                
                {/* Location */}
                <div className="flex items-center text-gray-600 text-sm gap-1.5 mb-5">
                    <MapPin size={16} className="shrink-0" />
                    <span className="line-clamp-1">{issue.location}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                    <button 
                        onClick={() => onUpvote(issue._id, issue.userEmail)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                            hasUpvoted 
                                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                                : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                    >
                        <ThumbsUp size={16} className={hasUpvoted ? 'fill-current' : ''} />
                        <span>{issue.upvotes || 0}</span>
                    </button>
                    
                    <Link 
                        to={`/issue-details/${issue._id}`}
                        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                    >
                        <Eye size={16} />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AllIssues;