import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import TrelloImport from '@/Components/TrelloImport';
import { useState } from 'react';

export default function Index({ user, trelloIntegration = null, projects = [] }) {
    const [activeTab, setActiveTab] = useState('billing');
    const [exportType, setExportType] = useState('clients');
    const [isExporting, setIsExporting] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [restoreFile, setRestoreFile] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        default_hourly_rate: user.default_hourly_rate || '',
        currency: user.currency || 'EUR',
        vat_rate: user.vat_rate || '',
        company_name: user.company_name || '',
        tax_id: user.tax_id || '',
        address: user.address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
        country: user.country || '',
        phone: user.phone || '',
        business_email: user.business_email || '',
        bank_details: user.bank_details || '',
        logo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.update'), {
            forceFormData: true,
        });
    };

    const handleBackupDownload = () => {
        window.location.href = route('backup.download');
    };

    const handleRestore = (e) => {
        e.preventDefault();
        if (!restoreFile) return;

        const formData = new FormData();
        formData.append('backup_file', restoreFile);

        setIsRestoring(true);
        router.post(route('backup.restore'), formData, {
            onFinish: () => {
                setIsRestoring(false);
                setRestoreFile(null);
            }
        });
    };

    const handleExport = () => {
        setIsExporting(true);
        window.location.href = route('export.data', { type: exportType });
        setTimeout(() => setIsExporting(false), 2000);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Settings
                </h2>
            }
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Tabs */}
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('billing')}
                                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === 'billing'
                                        ? 'border-slate-900 text-slate-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Billing & Rates
                            </button>
                            <button
                                onClick={() => setActiveTab('business')}
                                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === 'business'
                                        ? 'border-slate-900 text-slate-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Business Details
                            </button>
                            <button
                                onClick={() => setActiveTab('branding')}
                                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === 'branding'
                                        ? 'border-slate-900 text-slate-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Branding & Logo
                            </button>
                            <button
                                onClick={() => setActiveTab('backup')}
                                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === 'backup'
                                        ? 'border-slate-900 text-slate-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Backup & Export
                            </button>
                            <button
                                onClick={() => setActiveTab('integrations')}
                                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                                    activeTab === 'integrations'
                                        ? 'border-slate-900 text-slate-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Integrations
                            </button>
                        </nav>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Billing & Rates Tab */}
                        {activeTab === 'billing' && (
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                        Billing & Rate Settings
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Default Hourly Rate */}
                                        <div>
                                            <label htmlFor="default_hourly_rate" className="block text-sm font-medium text-gray-700">
                                                Default Hourly Rate
                                            </label>
                                            <input
                                                type="number"
                                                id="default_hourly_rate"
                                                step="0.01"
                                                min="0"
                                                value={data.default_hourly_rate}
                                                onChange={(e) => setData('default_hourly_rate', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                placeholder="50.00"
                                            />
                                            {errors.default_hourly_rate && (
                                                <p className="mt-1 text-sm text-red-600">{errors.default_hourly_rate}</p>
                                            )}
                                            <p className="mt-1 text-sm text-gray-500">
                                                Your default hourly rate for new projects (can be overridden per client)
                                            </p>
                                        </div>

                                        {/* Currency */}
                                        <div>
                                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                                Currency
                                            </label>
                                            <select
                                                id="currency"
                                                value={data.currency}
                                                onChange={(e) => setData('currency', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                            >
                                                <option value="EUR">EUR (€)</option>
                                                <option value="USD">USD ($)</option>
                                                <option value="GBP">GBP (£)</option>
                                            </select>
                                            {errors.currency && (
                                                <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
                                            )}
                                        </div>

                                        {/* VAT Rate */}
                                        <div>
                                            <label htmlFor="vat_rate" className="block text-sm font-medium text-gray-700">
                                                VAT/Tax Rate (%)
                                            </label>
                                            <input
                                                type="number"
                                                id="vat_rate"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                value={data.vat_rate}
                                                onChange={(e) => setData('vat_rate', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                placeholder="24.00"
                                            />
                                            {errors.vat_rate && (
                                                <p className="mt-1 text-sm text-red-600">{errors.vat_rate}</p>
                                            )}
                                            <p className="mt-1 text-sm text-gray-500">
                                                Default VAT/tax rate for invoices (e.g., 24 for Greece, 0 for tax exemptions)
                                            </p>
                                        </div>

                                        {/* Bank Details */}
                                        <div>
                                            <label htmlFor="bank_details" className="block text-sm font-medium text-gray-700">
                                                Bank Details
                                            </label>
                                            <textarea
                                                id="bank_details"
                                                rows={4}
                                                value={data.bank_details}
                                                onChange={(e) => setData('bank_details', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                placeholder="Bank name, IBAN, SWIFT/BIC, etc."
                                            />
                                            {errors.bank_details && (
                                                <p className="mt-1 text-sm text-red-600">{errors.bank_details}</p>
                                            )}
                                            <p className="mt-1 text-sm text-gray-500">
                                                Bank account details to include in invoices
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Business Details Tab */}
                        {activeTab === 'business' && (
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                        Business Information
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Company Name */}
                                        <div>
                                            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                id="company_name"
                                                value={data.company_name}
                                                onChange={(e) => setData('company_name', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                placeholder="Your Company Ltd."
                                            />
                                            {errors.company_name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
                                            )}
                                        </div>

                                        {/* Tax ID / VAT Number */}
                                        <div>
                                            <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700">
                                                Tax ID / VAT Number
                                            </label>
                                            <input
                                                type="text"
                                                id="tax_id"
                                                value={data.tax_id}
                                                onChange={(e) => setData('tax_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                placeholder="EL123456789"
                                            />
                                            {errors.tax_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.tax_id}</p>
                                            )}
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                Street Address
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                placeholder="123 Main Street"
                                            />
                                            {errors.address && (
                                                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                            )}
                                        </div>

                                        {/* City, Postal Code, Country */}
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    value={data.city}
                                                    onChange={(e) => setData('city', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                    placeholder="Athens"
                                                />
                                                {errors.city && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    id="postal_code"
                                                    value={data.postal_code}
                                                    onChange={(e) => setData('postal_code', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                    placeholder="10431"
                                                />
                                                {errors.postal_code && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    id="country"
                                                    value={data.country}
                                                    onChange={(e) => setData('country', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                    placeholder="Greece"
                                                />
                                                {errors.country && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                placeholder="+30 210 1234567"
                                            />
                                            {errors.phone && (
                                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                            )}
                                        </div>

                                        {/* Business Email */}
                                        <div>
                                            <label htmlFor="business_email" className="block text-sm font-medium text-gray-700">
                                                Business Email
                                            </label>
                                            <input
                                                type="email"
                                                id="business_email"
                                                value={data.business_email}
                                                onChange={(e) => setData('business_email', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                placeholder="info@company.com"
                                            />
                                            {errors.business_email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.business_email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Branding & Logo Tab */}
                        {activeTab === 'branding' && (
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                        Branding & Logo
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Current Logo */}
                                        {user.logo_url && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Logo
                                                </label>
                                                <img
                                                    src={`/storage/${user.logo_url}`}
                                                    alt="Company Logo"
                                                    className="h-24 w-auto rounded border border-gray-300"
                                                />
                                            </div>
                                        )}

                                        {/* Upload New Logo */}
                                        <div>
                                            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                                                Upload Logo
                                            </label>
                                            <input
                                                type="file"
                                                id="logo"
                                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                                onChange={(e) => setData('logo', e.target.files[0])}
                                                className="mt-1 block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-md file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-indigo-50 file:text-indigo-700
                                                    hover:file:bg-indigo-100"
                                            />
                                            {errors.logo && (
                                                <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
                                            )}
                                            <p className="mt-1 text-sm text-gray-500">
                                                JPG, PNG or GIF. Max size 2MB. Will be displayed on invoices.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Backup & Export Tab */}
                        {activeTab === 'backup' && (
                            <div className="space-y-6">
                                {/* Full Backup Section */}
                                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Full System Backup
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Download a complete backup of all your data including clients, projects, tasks, time entries, invoices, and settings. You can restore this backup later if needed.
                                        </p>

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={handleBackupDownload}
                                                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                                            >
                                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Download Full Backup
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Restore Backup Section */}
                                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Restore from Backup
                                        </h3>

                                        <div className="mb-6 rounded-md bg-yellow-50 p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-yellow-800">
                                                        Warning
                                                    </h3>
                                                    <div className="mt-2 text-sm text-yellow-700">
                                                        <p>Restoring a backup will replace ALL current data. This action cannot be undone. Make sure to download a backup of your current data before proceeding.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <form onSubmit={handleRestore}>
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="restore_file" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Select Backup File
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id="restore_file"
                                                        accept=".json"
                                                        onChange={(e) => setRestoreFile(e.target.files[0])}
                                                        className="block w-full text-sm text-gray-500
                                                            file:mr-4 file:py-2 file:px-4
                                                            file:rounded-md file:border-0
                                                            file:text-sm file:font-semibold
                                                            file:bg-red-50 file:text-red-700
                                                            hover:file:bg-red-100"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={!restoreFile || isRestoring}
                                                    className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    {isRestoring ? 'Restoring...' : 'Restore Backup'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* Export Data Section */}
                                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Export Data to Excel
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Export specific data to Excel format (.xlsx) for reporting or external use.
                                        </p>

                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="export_type" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select Data to Export
                                                </label>
                                                <select
                                                    id="export_type"
                                                    value={exportType}
                                                    onChange={(e) => setExportType(e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
                                                >
                                                    <option value="clients">Clients</option>
                                                    <option value="projects">Projects (with Tasks)</option>
                                                    <option value="invoices">Invoices</option>
                                                    <option value="time-entries">Time Entries</option>
                                                </select>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleExport}
                                                disabled={isExporting}
                                                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
                                            >
                                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                {isExporting ? 'Exporting...' : 'Export to Excel'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button - Only for billing, business, and branding tabs */}
                        {activeTab !== 'backup' && activeTab !== 'integrations' && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Integrations Tab */}
                    {activeTab === 'integrations' && (
                        <div className="space-y-6">
                            <TrelloImport 
                                trelloIntegration={trelloIntegration}
                                projects={projects}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
