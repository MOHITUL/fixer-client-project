import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../../contexts/authcontexts/AuthContext';
import Swal from 'sweetalert2';
import { Clock, MapPin, User, ShieldCheck, Zap, Edit3, Trash2, Calendar, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';
import moment from 'moment';

const AllIssuesDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('access-token');

    useEffect(() => {
        fetchIssueDetails();
    }, [id]);

    const fetchIssueDetails = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/issue-details/${id}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            setIssue(res.data);
        } catch (error) {
            console.error('Error fetching issue:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load issue details',
                icon: 'error',
                confirmButtonColor: '#EF4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBoost = async () => {
        Swal.fire({
            title: 'Boost This Issue?',
            html: `
                <div class="text-left p-4">
                    <p class="text-gray-700 mb-3">Boost this issue to high priority for:</p>
                    <div class="bg-blue-50 rounded-lg p-4 mb-3">
                        <p class="text-2xl font-bold text-blue-600">৳100</p>
                    </div>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li>✓ High priority status</li>
                        <li>✓ Faster resolution</li>
                        <li>✓ Premium visibility</li>
                    </ul>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F97316',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Pay ৳100 & Boost',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.patch(`${import.meta.env.VITE_API_URL}/issue/boost/${id}`, 
                        { paymentId: 'PAY-' + Date.now() }, 
                        { headers: { authorization: `Bearer ${token}` } }
                    );
                    
                    if (res.data.modifiedCount > 0) {
                        Swal.fire({
                            title: 'Boosted!',
                            text: 'Your issue is now high priority and will be resolved faster.',
                            icon: 'success',
                            confirmButtonColor: '#3B82F6'
                        });
                        fetchIssueDetails();
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to boost issue',
                        icon: 'error',
                        confirmButtonColor: '#EF4444'
                    });
                }
            }
        });
    };

    const handleDelete = () => {
        Swal.fire({
            title: 'Delete Issue?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${import.meta.env.VITE_API_URL}/issues/${id}`, {
                        headers: { authorization: `Bearer ${token}` }
                    });
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Issue has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#3B82F6'
                    });
                    navigate('/all-issues');
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete issue',
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
                    <p className="text-lg font-semibold text-gray-700">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 text-center max-w-md">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Issue Not Found</h3>
                    <p className="text-gray-600 mb-6">The issue you're looking for doesn't exist.</p>
                    <button 
                        onClick={() => navigate('/all-issues')}
                        className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all"
                    >
                        Browse All Issues
                    </button>
                </div>
            </div>
        );
    }

    const statusConfig = {
        'pending': { bg: 'bg-amber-100', text: 'text-amber-700' },
        'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700' },
        'resolved': { bg: 'bg-emerald-100', text: 'text-emerald-700' }
    };

    const priorityConfig = {
        'high': { bg: 'bg-red-100', text: 'text-red-700' },
        'medium': { bg: 'bg-amber-100', text: 'text-amber-700' },
        'low': { bg: 'bg-blue-100', text: 'text-blue-700' }
    };

    const status = statusConfig[issue.status?.toLowerCase()] || statusConfig['pending'];
    const priority = priorityConfig[issue.priority?.toLowerCase()] || priorityConfig['low'];
    const isOwner = user?.email === issue.userEmail;

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-8 lg:px-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/all-issues')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Issues</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Issue Card */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                            {/* Image */}
                            <div className="relative h-80 lg:h-96 bg-gray-100">
                                <img 
                                    src={issue.image} 
                                    className="w-full h-full object-cover" 
                                    alt={issue.title} 
                                />
                                {issue.isBoosted && (
                                    <div className="absolute top-6 right-6">
                                        <span className="inline-flex items-center gap-1.5 bg-linear-to-r from-orange-500 to-amber-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                            <Zap size={16} />
                                            BOOSTED
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-8 lg:p-10">
                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${priority.bg} ${priority.text}`}>
                                        {issue.priority} Priority
                                    </span>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${status.bg} ${status.text}`}>
                                        {issue.status?.replace('-', ' ')}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                    {issue.title}
                                </h1>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <User size={18} />
                                        <span className="text-sm">{issue.userName || 'Anonymous'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} />
                                        <span className="text-sm">{moment(issue.createdAt).format('MMM DD, YYYY')}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                                    <p className="text-gray-700 leading-relaxed">{issue.description}</p>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-3 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                        <MapPin className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-blue-600 uppercase">Location</p>
                                        <p className="font-medium text-gray-900">{issue.location}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isOwner && (
                                    <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-gray-100">
                                        {issue.status === 'pending' && (
                                            <button 
                                                onClick={() => navigate(`/edit-issue/${id}`)} 
                                                className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-all"
                                            >
                                                <Edit3 size={18}/>
                                                Edit Issue
                                            </button>
                                        )}
                                        <button 
                                            onClick={handleDelete}
                                            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all"
                                        >
                                            <Trash2 size={18}/>
                                            Delete
                                        </button>
                                        {!issue.isBoosted && (
                                            <button 
                                                onClick={handleBoost} 
                                                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-200"
                                            >
                                                <Zap size={18}/>
                                                Boost Issue (৳100)
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assigned Staff */}
                        {issue.assignedStaff && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                        <ShieldCheck className="text-emerald-600" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Assigned Staff</h3>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl">
                                    <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                        {issue.assignedStaff.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">{issue.assignedStaff.name}</p>
                                        <p className="text-sm text-gray-600">{issue.assignedStaff.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timeline Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Clock className="text-blue-600" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Issue Timeline</h3>
                            </div>
                            
                            {issue.timeline && issue.timeline.length > 0 ? (
                                <div className="space-y-6 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-linear-to-b before:from-blue-500 before:via-blue-300 before:to-gray-200">
                                    {issue.timeline.slice().reverse().map((entry, index) => (
                                        <div key={index} className="relative pl-12">
                                            <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center ${
                                                index === 0 ? 'bg-linear-to-br from-blue-600 to-blue-500' : 'bg-gray-300'
                                            }`}>
                                                <CheckCircle2 size={14} className="text-white"/>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <span className={`inline-block text-xs font-bold uppercase px-2 py-1 rounded-full mb-2 ${
                                                    entry.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                                                    entry.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {entry.status?.replace('-', ' ')}
                                                </span>
                                                <p className="text-sm text-gray-900 font-medium mb-2">{entry.message}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <User size={12}/>
                                                    <span>{entry.updatedBy || 'System'}</span>
                                                    <span>•</span>
                                                    <Calendar size={12}/>
                                                    <span>{moment(entry.updatedAt).format('MMM DD, h:mm A')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Clock size={32} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-sm">No timeline updates yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AllIssuesDetails;