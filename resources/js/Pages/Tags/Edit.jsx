import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const DEFAULT_COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#10B981', // Green
    '#14B8A6', // Teal
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6B7280', // Gray
];

export default function Edit({ tag }) {
    const { data, setData, put, processing, errors } = useForm({
        name: tag.name || '',
        color: tag.color || DEFAULT_COLORS[0],
    });

    const [customColor, setCustomColor] = useState('');

    const submit = (e) => {
        e.preventDefault();
        put(route('tags.update', tag.id));
    };

    const selectColor = (color) => {
        setData('color', color);
        setCustomColor('');
    };

    const handleCustomColorChange = (e) => {
        const color = e.target.value;
        setCustomColor(color);
        setData('color', color);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Tag: {tag.name}
                    </h2>
                    <Link
                        href={route('tags.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Tags
                    </Link>
                </div>
            }
        >
            <Head title={`Edit ${tag.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Tag Name *
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
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Color *
                                </label>

                                {/* Preset Colors */}
                                <div className="grid grid-cols-5 gap-3 mb-4">
                                    {DEFAULT_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => selectColor(color)}
                                            className={`h-12 w-full rounded-md transition-all ${
                                                data.color === color && !customColor
                                                    ? 'ring-2 ring-offset-2 ring-indigo-500'
                                                    : 'hover:scale-105'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>

                                {/* Custom Color Picker */}
                                <div className="flex items-center gap-3">
                                    <label htmlFor="custom-color" className="text-sm text-gray-600">
                                        Or choose custom:
                                    </label>
                                    <input
                                        type="color"
                                        id="custom-color"
                                        value={customColor || data.color}
                                        onChange={handleCustomColorChange}
                                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                                    />
                                    <span className="text-sm font-mono text-gray-500">
                                        {data.color.toUpperCase()}
                                    </span>
                                </div>
                                {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color}</p>}
                            </div>

                            {/* Preview */}
                            <div className="mb-6 rounded-md bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                <span
                                    className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset"
                                    style={{
                                        backgroundColor: `${data.color}20`,
                                        color: data.color,
                                        borderColor: `${data.color}40`,
                                    }}
                                >
                                    {data.name || 'Tag Name'}
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Link
                                    href={route('tags.index')}
                                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Tag'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
