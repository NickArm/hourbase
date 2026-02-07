import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Create({ clients = [], defaultVatRate = 24, defaultCurrency = 'EUR' }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        invoice_number: '',
        mydata_invoice_number: '',
        date: new Date().toISOString().split('T')[0],
        due_date: '',
        status: 'draft',
        subtotal: 0,
        vat_rate: defaultVatRate,
        vat_amount: 0,
        total_amount: 0,
        currency: defaultCurrency,
        notes: '',
        footer_notes: '',
        payment_method: '',
        payment_reference: '',
        payment_date: '',
        items: [{ description: '', quantity: 1, unit_price: 0, total: 0 }],
    });

    // Calculate totals when items or VAT rate change
    useEffect(() => {
        const subtotal = data.items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
        const vatAmount = (subtotal * parseFloat(data.vat_rate || 0)) / 100;
        const totalAmount = subtotal + vatAmount;

        setData(prev => ({
            ...prev,
            subtotal: subtotal.toFixed(2),
            vat_amount: vatAmount.toFixed(2),
            total_amount: totalAmount.toFixed(2),
        }));
    }, [data.items, data.vat_rate]);

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0, total: 0 }]);
    };

    const removeItem = (index) => {
        if (data.items.length > 1) {
            setData('items', data.items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;

        // Calculate item total
        if (field === 'quantity' || field === 'unit_price') {
            const quantity = parseFloat(newItems[index].quantity || 0);
            const unitPrice = parseFloat(newItems[index].unit_price || 0);
            newItems[index].total = (quantity * unitPrice).toFixed(2);
        }

        setData('items', newItems);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('invoices.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create Invoice
                    </h2>
                    <Link
                        href={route('invoices.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Invoices
                    </Link>
                </div>
            }
        >
            <Head title="Create Invoice" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Header Info */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
                                        Client *
                                    </label>
                                    <select
                                        id="client_id"
                                        value={data.client_id}
                                        onChange={(e) => setData('client_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select a client...</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.client_id && <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>}
                                </div>

                                <div>
                                    <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700">
                                        Invoice Number *
                                    </label>
                                    <input
                                        type="text"
                                        id="invoice_number"
                                        value={data.invoice_number}
                                        onChange={(e) => setData('invoice_number', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.invoice_number && <p className="mt-1 text-sm text-red-600">{errors.invoice_number}</p>}
                                </div>

                                <div>
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

                                <div>
                                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                                        Due Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="due_date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
                                </div>

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
                                        <option value="draft">Draft</option>
                                        <option value="issued">Issued</option>
                                        <option value="paid">Paid</option>
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>

                                <div>
                                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                        Currency *
                                    </label>
                                    <select
                                        id="currency"
                                        value={data.currency}
                                        onChange={(e) => setData('currency', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="EUR">EUR (€)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                    {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency}</p>}
                                </div>

                                <div className="col-span-2">
                                    <label htmlFor="mydata_invoice_number" className="block text-sm font-medium text-gray-700">
                                        MyData Invoice Number
                                    </label>
                                    <input
                                        type="text"
                                        id="mydata_invoice_number"
                                        value={data.mydata_invoice_number}
                                        onChange={(e) => setData('mydata_invoice_number', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Optional reference number"
                                    />
                                    {errors.mydata_invoice_number && <p className="mt-1 text-sm text-red-600">{errors.mydata_invoice_number}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="text-sm font-medium text-slate-900 hover:text-indigo-500"
                                >
                                    + Add Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {data.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-3 items-start">
                                        <div className="col-span-5">
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                placeholder="Description"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                placeholder="Qty"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.unit_price}
                                                onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                placeholder="Price"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="text"
                                                value={item.total}
                                                readOnly
                                                className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                                            />
                                        </div>
                                        <div className="col-span-1 flex items-center justify-center">
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-6 border-t border-gray-200 pt-4">
                                <div className="flex justify-end">
                                    <div className="w-64 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-medium">{data.currency} {data.subtotal}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600">VAT:</span>
                                                <span className="text-gray-600">{data.vat_rate}%</span>
                                            </div>
                                            <span className="font-medium">{data.currency} {data.vat_amount}</span>
                                        </div>
                                        <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
                                            <span>Total:</span>
                                            <span>{data.currency} {data.total_amount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="footer_notes" className="block text-sm font-medium text-gray-700">
                                        Footer Notes
                                    </label>
                                    <textarea
                                        id="footer_notes"
                                        rows={2}
                                        value={data.footer_notes}
                                        onChange={(e) => setData('footer_notes', e.target.value)}
                                        placeholder="e.g., 0% VAT - Article 39α"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href={route('invoices.index')}
                                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Invoice'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
