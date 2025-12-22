import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authcontexts/AuthContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Link } from "react-router";

const CitizenDashboard = () => {
    const { user } = useContext(AuthContext);

    // TanStack Query 
    const { data: stats = {}, isLoading, error } = useQuery({
        queryKey: ['citizen-stats', user?.email],
        enabled: !!user?.email, 
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/citizen-stats/${user?.email}`);
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-red-100 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h3>
                    <p className="text-gray-600">We couldn't load your dashboard data. Please try again.</p>
                </div>
            </div>
        );
    }

    const chartData = [
        { name: "Pending", value: stats.pending || 0 },
        { name: "In Progress", value: stats.inProgress || 0 },
        { name: "Resolved", value: stats.resolved || 0 },
    ];

    const COLORS = ["#F59E0B", "#3B82F6", "#10B981"];

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-8 lg:px-8 lg:py-12">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                Welcome back, <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">{user?.displayName?.split(' ')[0] || 'Citizen'}</span>!
                            </h2>
                            <p className="text-gray-600 mt-1">Here's an overview of your reported issues</p>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-12">
                    <StatCard 
                        title="Total Submitted" 
                        value={stats.totalSubmitted} 
                        icon="📊"
                        gradient="from-gray-600 to-gray-500"
                    />
                    <StatCard 
                        title="Pending" 
                        value={stats.pending} 
                        icon="⏳"
                        gradient="from-amber-500 to-orange-500"
                    />
                    <StatCard 
                        title="In Progress" 
                        value={stats.inProgress} 
                        icon="🔧"
                        gradient="from-blue-600 to-blue-500"
                    />
                    <StatCard 
                        title="Resolved" 
                        value={stats.resolved} 
                        icon="✅"
                        gradient="from-emerald-600 to-emerald-500"
                    />
                    <StatCard 
                        title="Total Payments" 
                        value={`$${stats.totalPayments || 0}`} 
                        icon="💰"
                        gradient="from-indigo-600 to-purple-600"
                    />
                </div>

                {/* Chart & CTA Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    
                    {/* Chart */}
                    <div className="lg:col-span-2 bg-white p-6 lg:p-10 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Issue Distribution</h3>
                                <p className="text-sm text-gray-500 mt-1">Track the status of all your reports</p>
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

                    {/* CTA Card */}
                    <div className="bg-linear-to-br from-blue-600 to-blue-500 p-8 lg:p-10 rounded-3xl shadow-xl text-white flex flex-col justify-between">
                        <div>
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                                <span className="text-4xl">🚀</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Ready to Make a Difference?</h3>
                            <p className="text-blue-100 leading-relaxed mb-8">
                                Spotted another issue in your community? Report it now and help us build a better city together.
                            </p>
                        </div>
                        
                        <Link 
                            to="/report-issue" 
                            className="w-full bg-white text-blue-600 px-6 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Report New Issue
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <QuickActionCard 
                        icon="📝"
                        title="My Reports"
                        description="View and manage all your submitted issues"
                        link="/my-issues"
                    />
                    <QuickActionCard 
                        icon="🗺️"
                        title="Browse Issues"
                        description="Explore issues reported in your area"
                        link="/all-issues"
                    />
                    <QuickActionCard 
                        icon="⚙️"
                        title="Settings"
                        description="Update your profile and preferences"
                        link="/settings"
                    />
                </div>

            </div>
        </div>
    );
};

// Modern Stat Card
const StatCard = ({ title, value, icon, gradient }) => (
    <div className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center text-xl shadow-md`}>
                {icon}
            </div>
        </div>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value || 0}</h3>
    </div>
);

// Quick Action Card 
const QuickActionCard = ({ icon, title, description, link }) => (
    <Link 
        to={link}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
    >
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center text-2xl transition-colors">
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{title}</h4>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
    </Link>
);

export default CitizenDashboard;