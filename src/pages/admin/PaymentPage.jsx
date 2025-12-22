import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Filter, Download } from 'lucide-react';

const PaymentPage = () => {
    const [allPayments, setAllPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem('access-token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/payments`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                setAllPayments(res.data.payments);
                setFilteredPayments(res.data.payments);
                setChartData(res.data.chartData);
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPayments();
    }, []);

    // Filter Logic
    useEffect(() => {
        const results = allPayments.filter(payment =>
            payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPayments(results);
    }, [searchTerm, allPayments]);

    if (loading) return <div className="p-10">Loading Payments...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">Payment Management</h2>

            {/* --- Payment Trend Chart --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
                
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" stroke="#8884d8" />
                            <YAxis stroke="#8884d8" />
                            <Tooltip />
                            <Area type="monotone" dataKey="amount" stroke="#4F46E5" fill="#C7D2FE" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* --- Filter & Table Section --- */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Email or Transaction ID..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                        <Filter size={18} /> More Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">User Email</th>
                                <th className="p-4 font-semibold text-gray-600">Transaction ID</th>
                                <th className="p-4 font-semibold text-gray-600">Amount</th>
                                <th className="p-4 font-semibold text-gray-600">Date</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((payment) => (
                                <tr key={payment._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{payment.userEmail}</td>
                                    <td className="p-4 font-mono text-sm text-gray-500">{payment.transactionId}</td>
                                    <td className="p-4 font-bold text-green-600">৳ {payment.amount}</td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(payment.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                            Success
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredPayments.length === 0 && (
                        <div className="p-10 text-center text-gray-500">No payment records found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;