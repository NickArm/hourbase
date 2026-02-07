import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ tasks = [] }) {
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [showBulkTagDialog, setShowBulkTagDialog] = useState(false);
    const [bulkTags, setBulkTags] = useState([]);
    const [bulkAction, setBulkAction] = useState('assign');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');
    const { flash } = usePage().props;

    useEffect(() => {
        console.log('Flash message received:', flash);
        if (flash?.error) {
            setValidationError(flash.error);
            setIsSubmitting(false); // Reset submit state
        }
    }, [flash]);

    const getStatusColor = (status) => {
        const colors = {
            to_do: 'bg-gray-50 text-gray-700 ring-gray-600/20',
            in_progress: 'bg-slate-100 text-slate-900 ring-slate-900/20',
            done: 'bg-green-50 text-green-700 ring-green-600/20',
        };
        return colors[status] || 'bg-gray-50 text-gray-600 ring-gray-500/10';
    };

    const formatStatus = (status) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const calculateTotalHours = (timeEntries) => {
        if (!timeEntries || timeEntries.length === 0) return 0;
        return timeEntries.reduce((sum, entry) => sum + parseFloat(entry.hours || 0), 0).toFixed(2);
    };

    const handleCreateInvoice = async () => {
        setValidationError('');

        // Get selected tasks
        const selected = tasks.filter(t => selectedTasks.includes(t.id));

        // Check if any task is already paid
        const paidTasks = selected.filter(t => t.paid);
        if (paidTasks.length > 0) {
            setValidationError(`${paidTasks.length} task(s) είναι ήδη πληρωμένα και δεν μπορούν να συμπεριληφθούν σε τιμολόγιο`);
            return;
        }

        // Check if all tasks belong to the same client
        const clientIds = [...new Set(selected.map(t => t.project?.client?.id).filter(Boolean))];
        if (clientIds.length === 0) {
            setValidationError('Τα επιλεγμένα tasks πρέπει να ανήκουν σε πελάτη');
            return;
        }
        if (clientIds.length > 1) {
            setValidationError('Όλα τα επιλεγμένα tasks πρέπει να ανήκουν στον ίδιο πελάτη');
            return;
        }

        // Check if any task is already in an invoice
        const tasksInInvoice = selected.filter(t => t.invoice_id);
        if (tasksInInvoice.length > 0) {
            setValidationError(`${tasksInInvoice.length} task(s) βρίσκονται ήδη σε τιμολόγιο`);
            return;
        }

        setIsSubmitting(true);

        router.post(route('invoices.create-from-tasks'), {
            task_ids: selectedTasks,
        }, {
            onError: (errors) => {
                console.error('Invoice creation error:', errors);
                setValidationError(errors.message || Object.values(errors)[0] || 'Παρουσιάστηκε σφάλμα');
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    const toggleTaskSelection = (taskId) => {
        setSelectedTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const toggleAllTasks = () => {
        setSelectedTasks(
            selectedTasks.length === tasks.length
                ? []
                : tasks.map(task => task.id)
        );
    };

    const handleBulkTagSubmit = async (e) => {
        e.preventDefault();
        if (selectedTasks.length === 0 || bulkTags.length === 0) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(route('tasks.bulk-assign-tags'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    task_ids: selectedTasks,
                    tag_ids: bulkTags,
                    action: bulkAction,
                }),
            });

            if (response.ok) {
                // Reload page to refresh
                window.location.reload();
            } else {
                alert('Failed to apply tags');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-slate-900">
                        Tasks
                    </h2>
                    <Link
                        href={route('tasks.create')}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                        + New Task
                    </Link>
                </div>
            }
        >
            <Head title="Tasks" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {tasks.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('tasks.create')}
                                            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                                        >
                                            + New Task
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Bulk actions bar */}
                                    {selectedTasks.length > 0 && (
                                        <div className="mb-4 rounded-lg bg-slate-100 p-4 border border-slate-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm font-medium text-blue-900">
                                                        {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                                                    </div>
                                                    {validationError && (
                                                        <div className="text-sm text-red-600 mt-1">{validationError}</div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleCreateInvoice}
                                                        disabled={isSubmitting}
                                                        className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
                                                    >
                                                        {isSubmitting ? 'Creating...' : 'Create Invoice'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowBulkTagDialog(true)}
                                                        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                                                    >
                                                        Add Tags
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedTasks([]);
                                                            setValidationError('');
                                                        }}
                                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bulk tag dialog */}
                                    {showBulkTagDialog && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                            <div className="rounded-lg bg-white p-6 shadow-lg max-w-md w-full mx-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Tags</h3>
                                                <form onSubmit={handleBulkTagSubmit}>
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Action
                                                        </label>
                                                        <select
                                                            value={bulkAction}
                                                            onChange={(e) => setBulkAction(e.target.value)}
                                                            className="w-full rounded-md border-slate-200 shadow-sm focus:border-slate-500 focus:ring-blue-500 sm:text-sm"
                                                        >
                                                            <option value="assign">Assign tags</option>
                                                            <option value="remove">Remove tags</option>
                                                        </select>
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Select Tags
                                                        </label>
                                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                                            {Array.from(new Set(tasks.flatMap(t => t.tags || []))).map((tag) => (
                                                                <label key={tag.id} className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={bulkTags.includes(tag.id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setBulkTags([...bulkTags, tag.id]);
                                                                            } else {
                                                                                setBulkTags(bulkTags.filter(id => id !== tag.id));
                                                                            }
                                                                        }}
                                                                        className="h-4 w-4 rounded border-slate-300 text-slate-900"
                                                                    />
                                                                    <span
                                                                        className="ml-2 text-sm font-medium flex items-center gap-2"
                                                                        style={{ color: tag.color }}
                                                                    >
                                                                        <span
                                                                            className="inline-block w-3 h-3 rounded-full"
                                                                            style={{ backgroundColor: tag.color }}
                                                                        />
                                                                        {tag.name}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting || bulkTags.length === 0}
                                                            className="flex-1 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                                        >
                                                            {isSubmitting ? 'Applying...' : 'Apply'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowBulkTagDialog(false);
                                                                setBulkTags([]);
                                                            }}
                                                            className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedTasks.length === tasks.length && tasks.length > 0}
                                                onChange={toggleAllTasks}
                                                className="h-4 w-4 rounded border-slate-300 text-slate-900"
                                            />
                                            <span className="text-sm text-slate-600">
                                                {selectedTasks.length === 0 ? 'Select all' : `${selectedTasks.length}/${tasks.length} selected`}
                                            </span>
                                        </div>

                                        {tasks.map((task) => (
                                            <div key={task.id}>
                                                <div
                                                    className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-sm transition-all ${
                                                        selectedTasks.includes(task.id)
                                                            ? 'bg-slate-100 border-slate-300'
                                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTasks.includes(task.id)}
                                                        onChange={() => toggleTaskSelection(task.id)}
                                                        className="h-4 w-4 rounded border-slate-300 text-slate-900"
                                                    />

                                                    <div className={`flex-1 ${(!task.tags || task.tags.length === 0) ? 'flex items-center' : ''}`}>
                                                        <div className="flex items-center gap-3 w-full">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="text-sm font-semibold text-slate-900">
                                                                        {task.name}
                                                                    </h3>
                                                                    {task.url && (
                                                                        <a
                                                                            href={task.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                                                                            title={task.url}
                                                                        >
                                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                            </svg>
                                                                        </a>
                                                                    )}
                                                                    {task.billable && (
                                                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                                            Billable
                                                                        </span>
                                                                    )}
                                                                    {task.paid && (
                                                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                                            Paid
                                                                        </span>
                                                                    )}
                                                                    {!task.paid && task.invoice_id && task.invoice_status === 'paid' && (
                                                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                                            Paid
                                                                        </span>
                                                                    )}
                                                                    {!task.paid && task.invoice_id && task.invoice_status !== 'paid' && (
                                                                        <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">
                                                                            In Invoice
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {task.project && (
                                                                    <div className="mt-1 text-xs text-slate-500">
                                                                        {task.project.name}
                                                                        {task.project.client && (
                                                                            <> · {task.project.client.name}</>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {task.tags && task.tags.length > 0 && (
                                                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                                                        {task.tags.map((tag) => (
                                                                            <span
                                                                                key={tag.id}
                                                                                className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset"
                                                                                style={{
                                                                                    backgroundColor: `${tag.color}20`,
                                                                                    color: tag.color,
                                                                                    borderColor: `${tag.color}40`,
                                                                                }}
                                                                            >
                                                                                {tag.name}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {!task.paid && (
                                                                <Link
                                                                    href={route('time-entries.create', { task_id: task.id })}
                                                                    className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-900 ring-1 ring-inset ring-slate-900/20 hover:bg-blue-100 transition-colors"
                                                                >
                                                                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                    Add Time
                                                                </Link>
                                                            )}
                                                            <div className="text-base font-bold text-slate-900 whitespace-nowrap">
                                                                {calculateTotalHours(task.time_entries)}h
                                                            </div>
                                                        </div>

                                                        <div className="ml-4">
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${getStatusColor(task.status)}`}
                                                            >
                                                                {formatStatus(task.status)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="ml-4">
                                                        <Link
                                                            href={route('tasks.edit', task.id)}
                                                            className="text-sm font-medium text-slate-900 hover:text-slate-700"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
