import { useState } from 'react';

export default function QuickTimeEntryModal({ isOpen, onClose, tasks = [] }) {
    const [formData, setFormData] = useState({
        task_id: '',
        date: new Date().toISOString().split('T')[0],
        hours: '',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.task_id || !formData.hours) {
            alert('Task and hours are required');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(route('time-entries.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({
                    task_id: '',
                    date: new Date().toISOString().split('T')[0],
                    hours: '',
                    notes: '',
                });
                onClose();
                // Reload page to show new entry
                window.location.reload();
            } else {
                alert('Failed to create time entry');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const selectedTask = tasks.find(t => t.id === parseInt(formData.task_id));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg bg-white p-6 shadow-lg max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">⏱️ Quick Time Entry</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Task Selection */}
                    <div>
                        <label htmlFor="task_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Task *
                        </label>
                        <select
                            id="task_id"
                            name="task_id"
                            value={formData.task_id}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                            required
                        >
                            <option value="">-- Select a task --</option>
                            {tasks.map((task) => (
                                <option key={task.id} value={task.id}>
                                    {task.project?.client?.name} → {task.project?.name} → {task.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Task Info */}
                    {selectedTask && (
                        <div className="rounded-md bg-slate-100 p-3 text-sm">
                            <div className="text-blue-900 font-medium">{selectedTask.name}</div>
                            <div className="text-blue-700 text-xs mt-1">
                                {selectedTask.project?.client?.name} → {selectedTask.project?.name}
                            </div>
                        </div>
                    )}

                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date *
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    {/* Hours */}
                    <div>
                        <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                            Hours *
                        </label>
                        <input
                            type="number"
                            id="hours"
                            name="hours"
                            step="0.25"
                            min="0.25"
                            value={formData.hours}
                            onChange={handleChange}
                            placeholder="1.5"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">e.g., 1.5 for 1h 30min, 0.25 for 15min</p>
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="What did you work on?"
                            rows={2}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : '✓ Save'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
