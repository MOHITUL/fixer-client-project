import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Filter, Download, CreditCard, TrendingUp, Calendar, DollarSign } from 'lucide-react';

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
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    // Filter Logic
    useEffect(() => {
        const results = allPayments.filter(payment =>
            payment.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPayments(results);
    }, [searchTerm, allPayments]);

    // Calculate stats
    const stats = {
        totalRevenue: allPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
        totalTransactions: allPayments.length,
        avgTransaction: allPayments.length > 0 ? (allPayments.reduce((sum, p) => sum + (p.amount || 0), 0) / allPayments.length).toFixed(2) : 0,
        thisMonth: allPayments.filter(p => {
            const paymentDate = new Date(p.date);
            const now = new Date();
            return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
        }).reduce((sum, p) => sum + (p.amount || 0), 0)
    };

    const handleExport = () => {
        // Simple CSV export
        const csv = [
            ['Email', 'Transaction ID', 'Amount', 'Date', 'Status'],
            ...filteredPayments.map(p => [
                p.userEmail,
                p.transactionId,
                p.amount,
                new Date(p.date).toLocaleDateString(),
                'Success'
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">Loading payments...</p>
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
                            <CreditCard className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                Payment <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Management</span>
                            </h1>
                            <p className="text-gray-600 mt-1">Track and manage all transactions</p>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    <StatCard 
                        title="Total Revenue" 
                        value={`৳${stats.totalRevenue.toLocaleString()}`} 
                        icon={<DollarSign size={24} />}
                        linear="from-emerald-600 to-emerald-500"
                        iconBg="bg-emerald-100"
                    />
                    <StatCard 
                        title="Transactions" 
                        value={stats.totalTransactions} 
                        icon={<CreditCard size={24} />}
                        linear="from-blue-600 to-blue-500"
                        iconBg="bg-blue-100"
                    />
                    <StatCard 
                        title="Avg. Transaction" 
                        value={`৳${Number(stats.avgTransaction).toLocaleString()}`} 
                        icon={<TrendingUp size={24} />}
                        linear="from-purple-600 to-indigo-600"
                        iconBg="bg-purple-100"
                    />
                    <StatCard 
                        title="This Month" 
                        value={`৳${stats.thisMonth.toLocaleString()}`} 
                        icon={<Calendar size={24} />}
                        linear="from-amber-500 to-orange-500"
                        iconBg="bg-amber-100"
                    />
                </div>

                {/* Revenue Chart */}
                <div className="bg-white p-6 lg:p-10 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Monthly Revenue Trend</h2>
                            <p className="text-sm text-gray-500 mt-1">Track revenue growth over time</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                            <TrendingUp size={16} className="text-blue-600" />
                            <span className="text-sm font-semibold text-blue-600">Analytics</span>
                        </div>
                    </div>
                    
                    <div className="h-[300px] lg:h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearlinear id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearlinear>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis 
                                    dataKey="month" 
                                    stroke="#9CA3AF"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis 
                                    stroke="#9CA3AF"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    formatter={(value) => [`৳${value}`, 'Revenue']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke="#3B82F6" 
                                    strokeWidth={3}
                                    fill="url(#colorAmount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Search & Actions Bar */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by email or transaction ID..."
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    value={searchTerm}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleExport}
                                    className="px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-medium flex items-center gap-2"
                                >
                                    <Download size={18} />
                                    <span className="hidden sm:inline">Export</span>
                                </button>
                                <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center gap-2">
                                    <Filter size={18} />
                                    <span className="hidden sm:inline">Filter</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {filteredPayments.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Payments Found</h3>
                            <p className="text-gray-600">
                                {searchTerm ? 'Try adjusting your search criteria' : 'No payment records available'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredPayments.map((payment) => (
                                            <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{payment.userEmail}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600">
                                                        {payment.transactionId}
                                                    </code>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-emerald-600">৳ {payment.amount?.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(payment.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                                        Success
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden p-4 space-y-4">
                                {filteredPayments.map((payment) => (
                                    <div key={payment._id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 mb-1">{payment.userEmail}</p>
                                                <code className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded">
                                                    {payment.transactionId}
                                                </code>
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                                Success
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                            <span className="text-sm text-gray-600">
                                                {new Date(payment.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className="font-bold text-emerald-600 text-lg">৳{payment.amount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Results Count */}
                    {filteredPayments.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-100 text-center text-sm text-gray-600">
                            Showing {filteredPayments.length} of {allPayments.length} transactions
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ title, value, icon, linear, iconBg }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
                {React.cloneElement(icon, { className: `text-${linear.split('-')[1]}-600` })}
            </div>
        </div>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">{title}</p>
        <h3 className={`text-2xl lg:text-3xl font-bold bg-linear-to-r ${linear} bg-clip-text text-transparent`}>
            {value}
        </h3>
    </div>
);

export default PaymentPage;