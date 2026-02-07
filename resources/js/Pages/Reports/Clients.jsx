import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ClientsReport({ clients, stats }) {
    return (
        <AuthenticatedLayout>
            <Head title="Client Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Client Reports</h1>
                        <p className="text-gray-600 mt-2">Client profitability and time allocation</p>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-600 font-medium">Total Clients</div>
                            <div className="text-3xl font-bold text-slate-900 mt-2">{stats.totalClients}</div>
                            <div className="text-xs text-gray-500 mt-1">All clients</div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-600 font-medium">Active Clients</div>
                            <div className="text-3xl font-bold text-green-600 mt-2">{stats.activeClients}</div>
                            <div className="text-xs text-gray-500 mt-1">Active status</div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-600 font-medium">Total Hours</div>
                            <div className="text-3xl font-bold text-purple-600 mt-2">{stats.totalHours}h</div>
                            <div className="text-xs text-gray-500 mt-1">All time entries</div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-600 font-medium">Est. Revenue</div>
                            <div className="text-3xl font-bold text-orange-600 mt-2">${stats.totalRevenue}</div>
                            <div className="text-xs text-gray-500 mt-1">Billable hours only</div>
                        </div>
                    </div>

                    {/* Clients Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Projects</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Total Hours</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Billable Hours</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Hourly Rate</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Est. Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {clients.length > 0 ? (
                                    clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="text-gray-900 font-medium">{client.name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                                    client.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {client.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-900">{client.projectCount}</td>
                                            <td className="px-6 py-4 text-right text-gray-900">{client.totalHours}h</td>
                                            <td className="px-6 py-4 text-right font-semibold text-gray-900">{client.billableHours}h</td>
                                            <td className="px-6 py-4 text-right text-gray-900">${client.hourlyRate}</td>
                                            <td className="px-6 py-4 text-right font-semibold text-orange-600">${client.estimatedRevenue}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            No clients found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
