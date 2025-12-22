import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/authcontexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ClipboardList, CheckCircle, Clock, AlertCircle, Calendar, TrendingUp, User } from 'lucide-react';

const StaffDashboard = () => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('access-token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/staff-stats/${user.email}`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 text-center max-w-md">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Data Available</h3>
                    <p className="text-gray-600">Unable to load dashboard data.</p>
                </div>
            </div>
        );
    }

    const COLORS = ['#F59E0B', '#3B82F6', '#10B981'];

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-8 lg:px-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {user?.displayName?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                Welcome back, <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">{user?.displayName?.split(' ')[0] || 'Staff'}</span>!
                            </h2>
                            <p className="text-gray-600 mt-1">Here's what's happening with your assigned issues</p>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
                    <StatCard 
                        icon={<ClipboardList size={24} />}
                        label="Total Assigned" 
                        value={data.stats.totalAssigned} 
                        linear="from-blue-600 to-blue-500"
                        iconBg="bg-blue-100"
                    />
                    <StatCard 
                        icon={<CheckCircle size={24} />}
                        label="Resolved" 
                        value={data.stats.resolvedCount} 
                        linear="from-emerald-600 to-emerald-500"
                        iconBg="bg-emerald-100"
                    />
                    <StatCard 
                        icon={<Clock size={24} />}
                        label="In Progress" 
                        value={data.stats.inProgressCount} 
                        linear="from-amber-500 to-orange-500"
                        iconBg="bg-amber-100"
                    />
                    <StatCard 
                        icon={<AlertCircle size={24} />}
                        label="Pending" 
                        value={data.stats.pendingCount} 
                        linear="from-red-600 to-red-500"
                        iconBg="bg-red-100"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    
                    {/* Performance Chart */}
                    <div className="lg:col-span-2 bg-white p-6 lg:p-10 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Performance Overview</h3>
                                <p className="text-sm text-gray-500 mt-1">Your issue resolution breakdown</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                                <TrendingUp size={16} className="text-blue-600" />
                                <span className="text-sm font-semibold text-blue-600">Statistics</span>
                            </div>
                        </div>
                        
                        <div className="h-[350px] lg:h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={data.chartData} 
                                        innerRadius={80} 
                                        outerRadius={120} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {data.chartData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={50}
                                        iconType="circle"
                                        wrapperStyle={{
                                            paddingTop: '20px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Today's Tasks */}
                    <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Today's Tasks</h3>
                                <p className="text-xs text-gray-500 mt-1">Active assignments</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Calendar size={20} className="text-blue-600" />
                            </div>
                        </div>
                        
                        <div className="space-y-3 max-h-[450px] overflow-y-auto custom-scrollbar">
                            {data.todayTasks && data.todayTasks.length > 0 ? (
                                data.todayTasks.map((task) => (
                                    <TaskCard key={task._id} task={task} />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle size={32} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">All caught up!</p>
                                    <p className="text-sm text-gray-400 mt-1">No tasks for today</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <QuickStatCard 
                        icon="🎯"
                        title="Completion Rate"
                        value={data.stats.totalAssigned > 0 ? `${Math.round((data.stats.resolvedCount / data.stats.totalAssigned) * 100)}%` : '0%'}
                        description="Issues successfully resolved"
                    />
                    <QuickStatCard 
                        icon="⚡"
                        title="Active Tasks"
                        value={data.stats.inProgressCount + data.stats.pendingCount}
                        description="Currently in your queue"
                    />
                    <QuickStatCard 
                        icon="📊"
                        title="Total Handled"
                        value={data.stats.totalAssigned}
                        description="All time assignments"
                    />
                </div>

            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #3B82F6;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #2563EB;
                }
            `}</style>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon, label, value, linear, iconBg }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
                {React.cloneElement(icon, { className: `text-${linear.split('-')[1]}-600` })}
            </div>
        </div>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">{label}</p>
        <h3 className={`text-3xl font-bold bg-linear-to-r ${linear} bg-clip-text text-transparent`}>
            {value || 0}
        </h3>
    </div>
);

// Task Card Component
const TaskCard = ({ task }) => {
    const priorityConfig = {
        'high': { color: 'bg-red-500', badge: 'bg-red-100 text-red-700' },
        'medium': { color: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
        'low': { color: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' }
    };

    const statusConfig = {
        'pending': { bg: 'bg-amber-100', text: 'text-amber-700' },
        'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700' },
        'resolved': { bg: 'bg-emerald-100', text: 'text-emerald-700' }
    };

    const priority = priorityConfig[task.priority?.toLowerCase()] || priorityConfig['low'];
    const status = statusConfig[task.status?.toLowerCase()] || statusConfig['pending'];

    return (
        <div className="group bg-gray-50 hover:bg-blue-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer">
            <div className="flex items-start gap-3">
                <div className={`w-1 h-full ${priority.color} rounded-full shrink-0`}></div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 uppercase font-medium">{task.category}</span>
                        <span className="text-gray-300">•</span>
                        <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${priority.badge}`}>
                            {task.priority}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${status.bg} ${status.text}`}>
                            {task.status?.replace('-', ' ')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Quick Stat Card Component
const QuickStatCard = ({ icon, title, value, description }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-3">
            <span className="text-3xl">{icon}</span>
            <div>
                <h4 className="font-semibold text-gray-900">{title}</h4>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
        </div>
        <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
);

export default StaffDashboard;