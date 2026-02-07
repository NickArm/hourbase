import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ProjectsReport({ projects, stats }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'planning':
                return 'bg-gray-100 text-gray-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'on_hold':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Project Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Project Reports</h1>
                        <p className="text-gray-600 mt-2">Project progress and time allocation analysis</p>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-600 font-medium">Total Projects</div>
                            <div className="text-3xl font-bold text-slate-900 mt-2">{stats.totalProjects}</div>
                            <div className="text-xs text-gray-500 mt-1">All projects</div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-600 font-medium">Active Projects</div>
                            <div className="text-3xl font-bold text-green-600 mt-2">{stats.activeProjects}</div>
                            <div className="text-xs text-gray-500 mt-1">In progress or planning</div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="text-sm text-gray-600 font-medium">Completed</div>
                            <div className="text-3xl font-bold text-purple-600 mt-2">{stats.completedProjects}</div>
                            <div className="text-xs text-gray-500 mt-1">Finished projects</div>
                        </div>
                    </div>

                    {/* Projects Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Progress</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Est. Hours</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actual Hours</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Difference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {projects.length > 0 ? (
                                    projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="text-gray-900 font-medium">{project.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {project.completedTasks}/{project.totalTasks} tasks done
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">{project.client}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                                        <div
                                                            className="bg-slate-900 h-2 rounded-full"
                                                            style={{ width: `${project.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-900">{project.estimatedHours}h</td>
                                            <td className="px-6 py-4 text-right font-semibold text-gray-900">{project.actualHours}h</td>
                                            <td className={`px-6 py-4 text-right font-semibold ${project.hoursDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {project.hoursDifference >= 0 ? '+' : ''}{project.hoursDifference}h
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            No projects found
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
