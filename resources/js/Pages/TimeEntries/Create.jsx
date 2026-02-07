import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Create({ tasks = [], task_id = null }) {
    const { data, setData, post, processing, errors } = useForm({
        task_id: task_id ? parseInt(task_id) : '',
        date: new Date().toISOString().split('T')[0],
        hours: '',
        notes: '',
    });

    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        if (task_id) {
            const task = tasks.find(t => t.id === parseInt(task_id));
            if (task) {
                setData('task_id', parseInt(task_id));
                setSelectedTask(task);
            }
        }
    }, [task_id, tasks]);

    const handleTaskChange = (e) => {
        const taskId = e.target.value;
        setData('task_id', taskId ? parseInt(taskId) : '');
        const task = tasks.find(t => t.id === parseInt(taskId));
        setSelectedTask(task);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('time-entries.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Log Time Entry
                    </h2>
                    <Link
                        href={route('time-entries.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Time Entries
                    </Link>
                </div>
            }
        >
            <Head title="Log Time Entry" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            {/* Task Selection */}
                            <div className="mb-6">
                                <label htmlFor="task_id" className="block text-sm font-medium text-gray-700">
                                    Task *
                                </label>
                                <select
                                    id="task_id"
                                    value={data.task_id}
                                    onChange={handleTaskChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    required
                                >
                                    <option value="">Select a task...</option>
                                    {tasks.map((task) => (
                                        <option key={task.id} value={task.id}>
                                            {task.project?.client?.name} → {task.project?.name} → {task.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.task_id && <p className="mt-1 text-sm text-red-600">{errors.task_id}</p>}
                            </div>

                            {/* External URL Display */}
                            {selectedTask && selectedTask.external_url && (
                                <div className="mb-6 rounded-md bg-slate-100 p-4">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-slate-900">External Reference</p>
                                            <a
                                                href={selectedTask.external_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-slate-900 hover:text-slate-700 underline"
                                            >
                                                {selectedTask.external_url}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Date */}
                            <div className="mb-6">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                            </div>

                            {/* Hours */}
                            <div className="mb-6">
                                <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                                    Hours *
                                </label>
                                <input
                                    type="number"
                                    id="hours"
                                    step="0.25"
                                    min="0.25"
                                    max="24"
                                    value={data.hours}
                                    onChange={(e) => setData('hours', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="e.g., 2.5"
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">Enter hours in decimal format (e.g., 1.5 for 1 hour 30 minutes)</p>
                                {errors.hours && <p className="mt-1 text-sm text-red-600">{errors.hours}</p>}
                            </div>

                            {/* Notes */}
                            <div className="mb-6">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    rows={4}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Optional notes about this time entry..."
                                />
                                {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-3">
                                <Link
                                    href={route('time-entries.index')}
                                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Time Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
