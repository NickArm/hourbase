import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function TimeTracking({ hoursPerDay, hoursPerWeek, hoursPerProject, hoursPerClient, stats, dateRange }) {
    const [dates, setDates] = useState({
        startDate: dateRange?.startDate || new Date().toISOString().split('T')[0],
        endDate: dateRange?.endDate || new Date().toISOString().split('T')[0],
    });

    const handleFilter = () => {
        const params = new URLSearchParams({
            start_date: dates.startDate,
            end_date: dates.endDate,
        });
        window.location.href = route('reports.time-tracking') + '?' + params.toString();
    };
    return (
        <AuthenticatedLayout>
            <Head title="Time Tracking Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Time Tracking Reports</h1>
                        <p className="text-gray-600 mt-2">Detailed analytics of your time tracking</p>
                    </div>

                    {/* Date Range Filter */}
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <div className="flex flex-wrap gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={dates.startDate}
                                    onChange={(e) => setDates({...dates, startDate: e.target.value})}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={dates.endDate}
                                    onChange={(e) => setDates({...dates, endDate: e.target.value})}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500"
                                />
                            </div>
                            <button
                                onClick={handleFilter}
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                                Apply Filter
                            </button>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-600 font-medium">Selected Period</div>
                            <div className="text-3xl font-bold text-slate-900 mt-2">{stats.totalHours}h</div>
                            <div className="text-xs text-gray-500 mt-1">Total hours logged</div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-600 font-medium">Daily Average</div>
                            <div className="text-3xl font-bold text-green-600 mt-2">{stats.averagePerDay}h</div>
                            <div className="text-xs text-gray-500 mt-1">Average per day</div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-600 font-medium">Period</div>
                            <div className="text-sm font-mono text-gray-900 mt-2">{dates.startDate} to {dates.endDate}</div>
                            <div className="text-xs text-gray-500 mt-1">Selected date range</div>
                        </div>
                    </div>

                    {/* Hours per Project */}
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hours by Project</h2>
                        {hoursPerProject.length > 0 ? (
                            <div className="space-y-3">
                                {hoursPerProject.map((project, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-gray-900 font-medium">{project.name}</p>
                                            <div className="mt-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-slate-900 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min(
                                                            (project.hours / Math.max(...hoursPerProject.map(p => p.hours))) * 100,
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <p className="text-gray-900 font-semibold">{project.hours}h</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No time entries this month</p>
                        )}
                    </div>

                    {/* Hours per Client */}
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hours by Client</h2>
                        {hoursPerClient.length > 0 ? (
                            <div className="space-y-3">
                                {hoursPerClient.map((client, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-gray-900 font-medium">{client.name}</p>
                                            <div className="mt-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min(
                                                            (client.hours / Math.max(...hoursPerClient.map(c => c.hours))) * 100,
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <p className="text-gray-900 font-semibold">{client.hours}h</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No time entries this month</p>
                        )}
                    </div>

                    {/* Hours per Week */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hours by Week</h2>
                        {hoursPerWeek.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {hoursPerWeek.map((week, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded p-4 text-center">
                                        <p className="text-sm text-gray-600">{week.week}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">{week.hours}h</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No time entries this month</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
