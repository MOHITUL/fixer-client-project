import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LayoutDashboard, CheckCircle, Clock, XCircle, CreditCard, Users, TrendingUp } from 'lucide-react';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('access-token'); 
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin-stats`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error("Dashboard data load failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { stats, latestIssues, latestUsers, chartData } = data;

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-8 lg:px-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                            <LayoutDashboard className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                Admin <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Dashboard</span>
                            </h1>
                            <p className="text-gray-600 mt-1">Overview of system performance and activities</p>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-12">
                    <StatCard 
                        title="Total Issues" 
                        value={stats.totalIssues} 
                        icon={<LayoutDashboard size={24} />}
                        linear="from-blue-600 to-blue-500"
                        iconBg="bg-blue-100"
                    />
                    <StatCard 
                        title="Resolved" 
                        value={stats.resolvedIssues} 
                        icon={<CheckCircle size={24} />}
                        linear="from-emerald-600 to-emerald-500"
                        iconBg="bg-emerald-100"
                    />
                    <StatCard 
                        title="Pending" 
                        value={stats.pendingIssues} 
                        icon={<Clock size={24} />}
                        linear="from-amber-500 to-orange-500"
                        iconBg="bg-amber-100"
                    />
                    <StatCard 
                        title="Rejected" 
                        value={stats.rejectedIssues} 
                        icon={<XCircle size={24} />}
                        linear="from-red-600 to-red-500"
                        iconBg="bg-red-100"
                    />
                    <StatCard 
                        title="Total Payments" 
                        value={`৳${stats.totalPayment || 0}`} 
                        icon={<CreditCard size={24} />}
                        linear="from-purple-600 to-indigo-600"
                        iconBg="bg-purple-100"
                    />
                </div>

                {/* Charts & Users Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                    
                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-white p-6 lg:p-10 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Issue Distribution</h2>
                                <p className="text-sm text-gray-500 mt-1">Visual breakdown of all issues by status</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                                <TrendingUp size={16} className="text-blue-600" />
                                <span className="text-sm font-semibold text-blue-600">Analytics</span>
                            </div>
                        </div>
                        
                        <div className="h-[350px] lg:h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={chartData} 
                                        innerRadius={80} 
                                        outerRadius={120} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {chartData.map((entry, index) => (
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

                    {/* Latest Users */}
                    <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Users size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Latest Users</h2>
                                <p className="text-xs text-gray-500">Recent registrations</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {latestUsers && latestUsers.length > 0 ? (
                                latestUsers.map((user, index) => (
                                    <div 
                                        key={user.id || index} 
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No users yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Latest Issues Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 lg:p-8 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Latest Issues</h2>
                                <p className="text-sm text-gray-500 mt-1">Recently reported problems</p>
                            </div>
                            <button className="hidden sm:block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                View All →
                            </button>
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reporter</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {latestIssues && latestIssues.length > 0 ? (
                                    latestIssues.map((issue, index) => (
                                        <tr key={issue.id || index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{issue.title}</div>
                                                <div className="text-sm text-gray-500">{issue.category || 'General'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700">{issue.userName || 'Anonymous'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={issue.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(issue.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            <LayoutDashboard size={32} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No issues reported yet</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden p-4 space-y-4">
                        {latestIssues && latestIssues.length > 0 ? (
                            latestIssues.map((issue, index) => (
                                <div key={issue.id || index} className="bg-gray-50 rounded-2xl p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{issue.title}</h3>
                                            <p className="text-sm text-gray-500">{issue.category || 'General'}</p>
                                        </div>
                                        <StatusBadge status={issue.status} />
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{issue.userName || 'Anonymous'}</span>
                                        <span className="text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <LayoutDashboard size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No issues reported yet</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

// Modern Stat Card Component
const StatCard = ({ title, value, icon, linear, iconBg }) => (
    <div className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
                {React.cloneElement(icon, { className: `text-${linear.split('-')[1]}-600` })}
            </div>
        </div>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">{title}</p>
        <h3 className={`text-3xl font-bold bg-linear-to-r ${linear} bg-clip-text text-transparent`}>
            {value || 0}
        </h3>
    </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
    const statusStyles = {
        'Resolved': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '✓' },
        'resolved': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '✓' },
        'Pending': { bg: 'bg-amber-100', text: 'text-amber-700', icon: '⏳' },
        'pending': { bg: 'bg-amber-100', text: 'text-amber-700', icon: '⏳' },
        'In Progress': { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🔧' },
        'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🔧' },
        'Rejected': { bg: 'bg-red-100', text: 'text-red-700', icon: '✕' },
        'rejected': { bg: 'bg-red-100', text: 'text-red-700', icon: '✕' },
    };

    const style = statusStyles[status] || statusStyles['Pending'];

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
            <span>{style.icon}</span>
            <span className="capitalize">{status}</span>
        </span>
    );
};

export default AdminDashboard;