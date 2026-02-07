import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ tags = [] }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Tags
                    </h2>
                    <Link
                        href={route('tags.create')}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                        + New Tag
                    </Link>
                </div>
            }
        >
            <Head title="Tags" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {tags.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No tags</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new tag for organizing tasks.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('tags.create')}
                                            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                                        >
                                            + New Tag
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {tags.map((tag) => (
                                        <div
                                            key={tag.id}
                                            className="relative flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div
                                                    className="h-10 w-10 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: tag.color }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                        {tag.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {tag.tasks_count} {tag.tasks_count === 1 ? 'task' : 'tasks'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href={route('tags.edit', tag.id)}
                                                className="ml-3 text-sm font-medium text-slate-900 hover:text-indigo-500 flex-shrink-0"
                                            >
                                                Edit
                                            </Link>
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
