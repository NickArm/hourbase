import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ projects = [] }) {
    const getStatusColor = (status) => {
        const colors = {
            planning: 'bg-slate-100 text-slate-900 ring-slate-900/20',
            active: 'bg-green-50 text-green-700 ring-green-600/20',
            on_hold: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
            completed: 'bg-gray-50 text-gray-600 ring-gray-500/10',
        };
        return colors[status] || 'bg-gray-50 text-gray-600 ring-gray-500/10';
    };

    const formatStatus = (status) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Projects
                    </h2>
                    <Link
                        href={route('projects.create')}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                        + New Project
                    </Link>
                </div>
            }
        >
            <Head title="Projects" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {projects.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('projects.create')}
                                            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                                        >
                                            + New Project
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="relative flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {project.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">{project.client?.name}</p>
                                                </div>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(project.status)}`}
                                                >
                                                    {formatStatus(project.status)}
                                                </span>
                                            </div>

                                            {project.description && (
                                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                                    {project.description}
                                                </p>
                                            )}

                                            <div className="mt-4 space-y-2 text-sm">
                                                {project.estimated_hours && (
                                                    <div className="flex items-center text-gray-500">
                                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Est: {project.estimated_hours}h
                                                    </div>
                                                )}
                                                {project.start_date && (
                                                    <div className="flex items-center text-gray-500">
                                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {new Date(project.start_date).toLocaleDateString()}
                                                        {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                                                <span className="text-sm text-gray-500">
                                                    {project.tasks_count} {project.tasks_count === 1 ? 'task' : 'tasks'}
                                                </span>
                                                <Link
                                                    href={route('projects.edit', project.id)}
                                                    className="text-sm font-medium text-slate-900 hover:text-indigo-500"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
