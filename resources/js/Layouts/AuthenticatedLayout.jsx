import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="flex">
                <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                    <div className="flex h-full flex-col border-r border-slate-200/70 bg-white/90 px-4 pb-6 pt-6">
                        <Link href="/" className="flex items-center gap-3 px-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900">
                                <ApplicationLogo className="h-5 w-5 text-white" />
                            </span>
                            <span className="text-base font-semibold text-slate-900">
                                Hourbase
                            </span>
                        </Link>

                        <nav className="mt-8 flex flex-1 flex-col gap-1">
                            <ResponsiveNavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('clients.index')}
                                active={route().current('clients.*')}
                            >
                                Clients
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('projects.index')}
                                active={route().current('projects.*')}
                            >
                                Projects
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('tasks.index')}
                                active={route().current('tasks.*')}
                            >
                                Tasks
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('time-entries.index')}
                                active={route().current('time-entries.*')}
                            >
                                Time Entries
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('invoices.index')}
                                active={route().current('invoices.*')}
                            >
                                Invoices
                            </ResponsiveNavLink>
                            <div className="mt-4 border-t border-slate-200/70 pt-4">
                                <ResponsiveNavLink href={route('reports.time-tracking')}>
                                    Reports
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('settings.index')}>
                                    Settings
                                </ResponsiveNavLink>
                                {user.role === 'admin' && (
                                    <ResponsiveNavLink href={route('admin.users.index')}>
                                        Admin Users
                                    </ResponsiveNavLink>
                                )}
                            </div>
                        </nav>
                    </div>
                </aside>

                <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
                    <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
                        <button
                            onClick={() =>
                                setShowingNavigationDropdown(
                                    (previousState) => !previousState,
                                )
                            }
                            className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 transition duration-150 ease-in-out hover:bg-slate-100 hover:text-slate-700 focus:bg-slate-100 focus:text-slate-700 focus:outline-none lg:hidden"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    className={
                                        !showingNavigationDropdown
                                            ? 'inline-flex'
                                            : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={
                                        showingNavigationDropdown
                                            ? 'inline-flex'
                                            : 'hidden'
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        <div className="hidden text-sm font-semibold text-slate-700 lg:block">
                            {header ? 'Hourbase' : ''}
                        </div>

                        <div className="flex items-center gap-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium leading-4 text-slate-600 shadow-sm transition duration-150 ease-in-out hover:border-slate-300 hover:text-slate-900 focus:outline-none"
                                        >
                                            {user.name}

                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('settings.index')}>
                                        Settings
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('reports.time-tracking')}>
                                        Reports
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    {showingNavigationDropdown && (
                        <div className="fixed inset-0 z-40 lg:hidden">
                            <div
                                className="absolute inset-0 bg-slate-900/40"
                                onClick={() => setShowingNavigationDropdown(false)}
                            />
                            <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
                                <div className="flex items-center gap-3 px-4 py-5">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900">
                                        <ApplicationLogo className="h-5 w-5 text-white" />
                                    </span>
                                    <span className="text-base font-semibold text-slate-900">
                                        Hourbase
                                    </span>
                                </div>
                                <nav className="flex flex-1 flex-col gap-1 px-2 pb-6">
                                    <ResponsiveNavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                    >
                                        Dashboard
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route('clients.index')}
                                        active={route().current('clients.*')}
                                    >
                                        Clients
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route('projects.index')}
                                        active={route().current('projects.*')}
                                    >
                                        Projects
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route('tasks.index')}
                                        active={route().current('tasks.*')}
                                    >
                                        Tasks
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route('time-entries.index')}
                                        active={route().current('time-entries.*')}
                                    >
                                        Time Entries
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route('invoices.index')}
                                        active={route().current('invoices.*')}
                                    >
                                        Invoices
                                    </ResponsiveNavLink>
                                    <div className="mt-4 border-t border-slate-200/70 pt-4">
                                        <ResponsiveNavLink href={route('reports.time-tracking')}>
                                            Reports
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('settings.index')}>
                                            Settings
                                        </ResponsiveNavLink>
                                        {user.role === 'admin' && (
                                            <ResponsiveNavLink href={route('admin.users.index')}>
                                                Admin Users
                                            </ResponsiveNavLink>
                                        )}
                                    </div>
                                </nav>
                            </div>
                        </div>
                    )}

                    {header && (
                        <header className="border-b border-slate-200/70 bg-white/80">
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </div>
    );
}
