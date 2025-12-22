import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LayoutDashboard, CheckCircle, Clock, XCircle, CreditCard, Users } from 'lucide-react';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const AdminDashboard = () => {
    const [data, setData] = useState(null);

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
        }
    };
    fetchAdminData();
}, []);

    if (!data) return <div className="p-10">Loading...</div>;

    const { stats, latestIssues, latestUsers, chartData } = data;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <LayoutDashboard /> Admin Dashboard
            </h1>

            {/* --- Stats Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <StatCard title="Total Issues" value={stats.totalIssues} icon={<LayoutDashboard color="blue"/>} />
                <StatCard title="Resolved" value={stats.resolvedIssues} icon={<CheckCircle color="green"/>} />
                <StatCard title="Pending" value={stats.pendingIssues} icon={<Clock color="orange"/>} />
                <StatCard title="Rejected" value={stats.rejectedIssues} icon={<XCircle color="red"/>} />
                <StatCard title="Payments" value={stats.totalPayment} icon={<CreditCard color="purple"/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Chart Section --- */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Issue Distribution</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* --- Latest Users --- */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Users size={20}/> Latest Registered Users
                    </h2>
                    <ul className="divide-y divide-gray-200">
                        {latestUsers.map(user => (
                            <li key={user.id} className="py-3 flex justify-between">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-gray-500">{user.email}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* --- Latest Issues Table --- */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Latest Issues</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-3">Title</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {latestIssues.map(issue => (
                            <tr key={issue.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{issue.title}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-sm ${issue.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-500">{issue.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Reusable Card Component
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 font-medium uppercase">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
    </div>
);

export default AdminDashboard;