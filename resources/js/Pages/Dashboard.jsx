import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import QuickTimeEntryModal from '@/Components/QuickTimeEntryModal';

export default function Dashboard({ stats, recentTimeEntries, tasks = [] }) {
    const [showQuickEntry, setShowQuickEntry] = useState(false);
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Quick Stats */}
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">Active Clients</div>
                                <div className="mt-2 text-3xl font-bold text-gray-900">{stats.activeClients}</div>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">Active Projects</div>
                                <div className="mt-2 text-3xl font-bold text-gray-900">{stats.activeProjects}</div>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">Tasks To Do</div>
                                <div className="mt-2 text-3xl font-bold text-gray-900">{stats.tasksToDo}</div>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">Hours This Week</div>
                                <div className="mt-2 text-3xl font-bold text-gray-900">{stats.hoursThisWeek}</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setShowQuickEntry(true)}
                                    className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                                >
                                    ⏱️ Quick Time Entry
                                </button>
                                <Link
                                    href={route('time-entries.create')}
                                    className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    + Log Time
                                </Link>
                                <Link
                                    href={route('tasks.create')}
                                    className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    + New Task
                                </Link>
                                <Link
                                    href={route('clients.create')}
                                    className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    + New Client
                                </Link>
                                <Link
                                    href={route('projects.create')}
                                    className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    + New Project
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Time Entries */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Time Entries</h3>
                            {recentTimeEntries.length > 0 ? (
                                <div className="space-y-3">
                                    {recentTimeEntries.map((entry) => (
                                        <div key={entry.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                                            <div>
                                                <div className="font-medium text-gray-900">{entry.task.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {entry.task.project.name} · {entry.task.project.client.name}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-gray-900">{entry.hours}h</div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(entry.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No time entries yet. <Link href={route('time-entries.create')} className="text-slate-900 hover:text-indigo-500">Log your first entry</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <QuickTimeEntryModal
                isOpen={showQuickEntry}
                onClose={() => setShowQuickEntry(false)}
                tasks={tasks}
            />
        </AuthenticatedLayout>
    );
}
