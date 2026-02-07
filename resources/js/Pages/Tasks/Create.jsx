import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTagSuggestions } from '@/hooks/useTagSuggestions';

export default function Create({ projects = [], tags = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        project_id: '',
        name: '',
        description: '',
        external_url: '',
        billable: true,
        estimated_hours: '',
        due_date: '',
        status: 'to_do',
        tags: [],
    });

    const { suggestions, tagSearch, setTagSearch, showSuggestions, setShowSuggestions } = useTagSuggestions(
        data.project_id,
        tags
    );

    const submit = (e) => {
        e.preventDefault();
        post(route('tasks.store'));
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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create Task
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
            <Head title="Create Task" />

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
                                    {processing ? 'Creating...' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
