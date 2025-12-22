import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authcontexts/AuthContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

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

    if (isLoading) return <div className="flex justify-center p-20 font-bold">Loading Stats...</div>;
    if (error) return <div className="text-red-500 text-center p-10">Error loading dashboard data.</div>;

    const chartData = [
        { name: "Pending", value: stats.pending || 0 },
        { name: "In Progress", value: stats.inProgress || 0 },
        { name: "Resolved", value: stats.resolved || 0 },
    ];

    const COLORS = ["#FBBF24", "#3B82F6", "#10B981"];

    return (
        <div className="p-6 lg:p-10 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Welcome Back, {user?.displayName}!</h2>
                <p className="text-gray-500">Here's what's happening with your reported issues.</p>
            </header>

            {/* Stats Cards*/}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
                <StatCard title="Total Submitted" value={stats.totalSubmitted} color="text-gray-900" borderColor="border-gray-900" />
                <StatCard title="Pending" value={stats.pending} color="text-amber-600" borderColor="border-amber-600" />
                <StatCard title="In Progress" value={stats.inProgress} color="text-blue-600" borderColor="border-blue-600" />
                <StatCard title="Resolved" value={stats.resolved} color="text-emerald-600" borderColor="border-emerald-600" />
                <StatCard title="Total Payments" value={`$${stats.totalPayments}`} color="text-indigo-600" borderColor="border-indigo-600" />
            </div>

            {/*Chart Section*/}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Issue Distribution</h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={chartData} 
                                    innerRadius={70} 
                                    outerRadius={100} 
                                    paddingAngle={8} 
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip cornerRadius={10} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                   <div className="bg-gray-50 p-6 rounded-full mb-4">
                        <span className="text-4xl">🚀</span>
                   </div>
                   <h3 className="text-xl font-bold">Ready to help?</h3>
                   <p className="text-gray-500 mt-2 mb-6">Found another problem in your area? Report it now and let us handle it.</p>
                   <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all">
                       Report New Issue
                   </button>
                </div>
            </div>
        </div>
    );
};

// Reusable Card 
const StatCard = ({ title, value, color, borderColor }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${borderColor}`}>
        <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">{title}</p>
        <h3 className={`text-3xl font-black mt-2 ${color}`}>{value || 0}</h3>
    </div>
);

export default CitizenDashboard;