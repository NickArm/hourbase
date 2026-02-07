import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTagSuggestions } from '@/hooks/useTagSuggestions';

export default function Edit({ task, projects = [], tags = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        project_id: task.project_id || '',
        name: task.name || '',
        description: task.description || '',
        external_url: task.external_url || '',
        billable: task.billable ?? true,
        paid: task.paid ?? false,
        estimated_hours: task.estimated_hours || '',
        due_date: task.due_date || '',
        status: task.status || 'to_do',
        tags: task.tags?.map(tag => tag.id) || [],
    });

    const { suggestions, tagSearch, setTagSearch, showSuggestions, setShowSuggestions } = useTagSuggestions(
        data.project_id,
        tags
    );
    const [showPaidConfirmation, setShowPaidConfirmation] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        put(route('tasks.update', task.id));
    };

    const toggleTag = (tagId) => {
        const currentTags = data.tags || [];
        if (currentTags.includes(tagId)) {
            setData('tags', currentTags.filter(id => id !== tagId));
        } else {
            setData('tags', [...currentTags, tagId]);
        }
    };

    const addTagFromSearch = (tagId) => {
        toggleTag(tagId);
        setTagSearch('');
        setShowSuggestions(false);
    };

    const handlePaidChange = (checked) => {
        if (checked && !data.paid) {
            // Show confirmation when checking paid
            setShowPaidConfirmation(true);
        } else {
            // Allow unchecking without confirmation
            setData('paid', checked);
        }
    };

    const confirmPaid = () => {
        setData('paid', true);
        setShowPaidConfirmation(false);
    };

    const cancelPaid = () => {
        setShowPaidConfirmation(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Task: {task.name}
                    </h2>
                    <Link
                        href={route('tasks.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Tasks
                    </Link>
                </div>
            }
        >
            <Head title={`Edit ${task.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="mb-6">
                                <label htmlFor="project_id" className="block text-sm font-medium text-gray-700">
                                    Project *
                                </label>
                                <select
                                    id="project_id"
                                    value={data.project_id}
                                    onChange={(e) => setData('project_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    required
                                >
                                    <option value="">Select a project...</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.client?.name} → {project.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.project_id && <p className="mt-1 text-sm text-red-600">{errors.project_id}</p>}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Task Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="external_url" className="block text-sm font-medium text-gray-700">
                                    External URL (Notion, Trello, Jira, etc.)
                                </label>
                                <input
                                    type="url"
                                    id="external_url"
                                    value={data.external_url}
                                    onChange={(e) => setData('external_url', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="https://..."
                                />
                                <p className="mt-1 text-sm text-gray-500">Link to task in external project management system</p>
                                {errors.external_url && <p className="mt-1 text-sm text-red-600">{errors.external_url}</p>}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Task details..."
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div className="mb-6 grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="estimated_hours" className="block text-sm font-medium text-gray-700">
                                        Estimated Hours
                                    </label>
                                    <input
                                        type="number"
                                        id="estimated_hours"
                                        step="0.5"
                                        min="0"
                                        value={data.estimated_hours}
                                        onChange={(e) => setData('estimated_hours', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.estimated_hours && <p className="mt-1 text-sm text-red-600">{errors.estimated_hours}</p>}
                                </div>

                                <div>
                                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        id="due_date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
                                </div>
                            </div>

                            <div className="mb-6 grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        Status *
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="to_do">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>

                                <div className="flex items-center pt-7">
                                    <input
                                        type="checkbox"
                                        id="billable"
                                        checked={data.billable}
                                        onChange={(e) => setData('billable', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="billable" className="ml-2 block text-sm text-gray-700">
                                        Billable
                                    </label>
                                </div>

                                <div className="flex items-center pt-7">
                                    <input
                                        type="checkbox"
                                        id="paid"
                                        checked={data.paid}
                                        onChange={(e) => handlePaidChange(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                                    />
                                    <label htmlFor="paid" className="ml-2 block text-sm text-gray-700">
                                        Paid
                                    </label>
                                </div>
                            </div>

                            {tags.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags
                                    </label>

                                    {/* Tag search input */}
                                    <div className="relative mb-3">
                                        <input
                                            type="text"
                                            placeholder="Search tags..."
                                            value={tagSearch}
                                            onChange={(e) => {
                                                setTagSearch(e.target.value);
                                                setShowSuggestions(true);
                                            }}
                                            onFocus={() => setShowSuggestions(true)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                        />

                                        {/* Suggestions dropdown */}
                                        {showSuggestions && suggestions.length > 0 && (
                                            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
                                                {suggestions.map((tag) => (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        onClick={() => addTagFromSearch(tag.id)}
                                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span
                                                                className="inline-block w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: tag.color }}
                                                            />
                                                            {tag.name}
                                                        </span>
                                                        {(data.tags || []).includes(tag.id) && (
                                                            <span className="text-slate-900">✓</span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected tags */}
                                    {(data.tags || []).length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {(data.tags || []).map((tagId) => {
                                                const tag = tags.find(t => t.id === tagId);
                                                return tag ? (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        onClick={() => toggleTag(tag.id)}
                                                        className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-2 ring-offset-1"
                                                        style={{
                                                            backgroundColor: `${tag.color}20`,
                                                            color: tag.color,
                                                            borderColor: tag.color,
                                                        }}
                                                    >
                                                        {tag.name}
                                                        <span className="ml-1">×</span>
                                                    </button>
                                                ) : null;
                                            })}
                                        </div>
                                    )}

                                    {/* Available tags */}
                                    {!showSuggestions && (
                                        <div className="flex flex-wrap gap-2">
                                            {tags.filter(tag => !(data.tags || []).includes(tag.id)).map((tag) => (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => toggleTag(tag.id)}
                                                    className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset opacity-60 hover:opacity-100 transition-all"
                                                    style={{
                                                        backgroundColor: `${tag.color}20`,
                                                        color: tag.color,
                                                        borderColor: tag.color,
                                                    }}
                                                >
                                                    {tag.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3">
                                <Link
                                    href={route('tasks.index')}
                                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Task'}
                                </button>
                            </div>
                        </form>

                        {/* Time Entries Section */}
                        <div className="border-t border-gray-200 px-6 py-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Time Entries</h3>
                                {!data.paid && (
                                    <Link
                                        href={route('time-entries.create', { task_id: task.id })}
                                        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                                    >
                                        + Add Time Entry
                                    </Link>
                                )}
                            </div>

                            {task.time_entries && task.time_entries.length > 0 ? (
                                <div className="space-y-2">
                                    {task.time_entries.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {new Date(entry.date).toLocaleDateString('el-GR')}
                                                </p>
                                                {entry.description && (
                                                    <p className="text-xs text-gray-600 mt-1">{entry.description}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 ml-4">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {entry.hours}h
                                                </span>
                                                {!data.paid && (
                                                    <Link
                                                        href={route('time-entries.edit', entry.id)}
                                                        className="text-sm text-slate-900 hover:text-slate-700 font-medium"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="border-t border-gray-200 pt-3 mt-4">
                                        <p className="text-sm font-semibold text-gray-900">
                                            Total: {(task.time_entries.reduce((sum, entry) => sum + parseFloat(entry.hours || 0), 0).toFixed(2))}h
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg text-center">
                                    {data.paid ? (
                                        'No time entries yet.'
                                    ) : (
                                        <>No time entries yet. <Link href={route('time-entries.create', { task_id: task.id })} className="text-slate-900 hover:text-slate-700 font-medium">Add one now</Link></>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Paid Confirmation Dialog */}
            {showPaidConfirmation && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={cancelPaid}></div>

                        {/* Center the modal */}
                        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                                        Επιβεβαίωση Πληρωμής
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Αν επισημάνετε αυτό το task ως Paid:
                                        </p>
                                        <ul className="mt-2 text-sm text-gray-500 list-disc list-inside space-y-1">
                                            <li>Δεν θα μπορεί να συμπεριληφθεί σε τιμολόγιο</li>
                                            <li>Δεν θα μπορείτε να προσθέσετε νέα time entries</li>
                                            <li>Δεν θα μπορείτε να επεξεργαστείτε υπάρχοντα time entries</li>
                                        </ul>
                                        <p className="mt-3 text-sm font-medium text-gray-700">
                                            Είστε σίγουροι ότι θέλετε να συνεχίσετε;
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    type="button"
                                    onClick={confirmPaid}
                                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:w-auto"
                                >
                                    Επιβεβαίωση
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelPaid}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Ακύρωση
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
