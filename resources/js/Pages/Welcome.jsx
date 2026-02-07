import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <div className="hb-landing min-h-screen bg-slate-50 text-slate-900">
            <Head title="Hourbase — Track time. Link work. Get paid.">
                <meta
                    name="description"
                    content="Modern time tracking for freelancers. Link tasks from any tool, track hours, and create invoices instantly. Simple, fast, efficient."
                />
                <meta
                    name="keywords"
                    content="time tracking software, freelance time tracker, project time tracking, invoice generator, billable hours tracker, time tracking app for freelancers, notion time tracking, trello time tracking, track time by project, freelance invoicing software, client billing software, hourly rate calculator, time entry software, project management time tracker"
                />
                <meta property="og:title" content="Hourbase — Track time. Link work. Get paid." />
                <meta
                    property="og:description"
                    content="Modern time tracking for freelancers. Link tasks from any tool, track hours, and create invoices instantly. Simple, fast, efficient."
                />
            </Head>

            <div className="hb-landing-bg pointer-events-none fixed inset-0">
                <div className="hb-landing-glow absolute -top-24 right-0 h-80 w-80 rounded-full bg-slate-900/10 blur-3xl" />
                <div className="hb-landing-glow absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

            <header className="hb-landing-header relative z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
                <div className="hb-landing-header-inner mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/" className="hb-landing-logo flex items-center gap-3">
                        <div className="hb-landing-logo-mark flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
                            <ApplicationLogo className="hb-landing-logo-icon h-6 w-6 text-white" />
                        </div>
                        <span className="hb-landing-logo-text text-lg font-semibold text-slate-900">
                            Hourbase
                        </span>
                    </Link>

                    <nav className="hb-landing-nav flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="hb-landing-nav-link rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="hb-landing-nav-link rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="hb-landing-nav-cta rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="hb-landing-main relative z-10">
                <section className="hb-landing-hero mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center">
                    <div className="hb-landing-hero-copy flex flex-1 flex-col gap-6">
                        <span className="hb-landing-badge inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-900">
                            Modern time tracking for freelancers
                        </span>
                        <h1 className="hb-landing-title text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                            Track time. Link work. Get paid.
                        </h1>
                        <p className="hb-landing-subtitle text-lg text-slate-600">
                            Hourbase keeps your time, tasks, and invoices in one fast workspace. Link tasks from Notion, Trello, Jira, or any tool, track hours effortlessly, and send polished invoices in seconds.
                        </p>
                        <div className="hb-landing-actions flex flex-wrap gap-3">
                            <Link
                                href={route('register')}
                                className="hb-landing-primary-cta rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                            >
                                Start free
                            </Link>
                            <Link
                                href={route('login', { demo: 1 })}
                                className="hb-landing-secondary-cta rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                            >
                                View demo
                            </Link>
                        </div>
                        <div className="hb-landing-stats grid gap-4 sm:grid-cols-3">
                            <div className="hb-landing-stat rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                                <p className="hb-landing-stat-value text-2xl font-semibold text-slate-900">1-click</p>
                                <p className="hb-landing-stat-label text-sm text-slate-500">time entry</p>
                            </div>
                            <div className="hb-landing-stat rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                                <p className="hb-landing-stat-value text-2xl font-semibold text-slate-900">3 min</p>
                                <p className="hb-landing-stat-label text-sm text-slate-500">to invoice</p>
                            </div>
                            <div className="hb-landing-stat rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                                <p className="hb-landing-stat-value text-2xl font-semibold text-slate-900">100%</p>
                                <p className="hb-landing-stat-label text-sm text-slate-500">billable clarity</p>
                            </div>
                        </div>
                    </div>

                    <div className="hb-landing-hero-card flex flex-1">
                        <div className="hb-landing-card w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                            <div className="hb-landing-card-header flex items-center justify-between">
                                <div className="hb-landing-card-title">
                                    <p className="hb-landing-card-label text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        This week
                                    </p>
                                    <p className="hb-landing-card-value text-2xl font-semibold text-slate-900">
                                        28h 30m
                                    </p>
                                </div>
                                <span className="hb-landing-card-pill rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                                    86% billable
                                </span>
                            </div>

                            <div className="hb-landing-card-body mt-6 space-y-4">
                                {[
                                    { name: 'Product sprint', hours: '12h 15m', status: 'In progress' },
                                    { name: 'Client onboarding', hours: '8h 20m', status: 'Review' },
                                    { name: 'Invoice prep', hours: '8h 00m', status: 'Done' },
                                ].map((item) => (
                                    <div
                                        key={item.name}
                                        className="hb-landing-card-row flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                    >
                                        <div className="hb-landing-card-row-info">
                                            <p className="hb-landing-card-row-title text-sm font-semibold text-slate-900">
                                                {item.name}
                                            </p>
                                            <p className="hb-landing-card-row-sub text-xs text-slate-500">
                                                {item.status}
                                            </p>
                                        </div>
                                        <span className="hb-landing-card-row-hours text-sm font-semibold text-slate-700">
                                            {item.hours}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="hb-landing-card-footer mt-6 flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
                                <p className="hb-landing-card-footer-text text-sm font-semibold text-slate-900">
                                    Invoice ready
                                </p>
                                <span className="hb-landing-card-footer-amount text-sm font-semibold text-slate-900">
                                    €2,480
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="hb-landing-features mx-auto w-full max-w-6xl px-6 pb-16">
                    <div className="hb-landing-features-header mb-10 text-center">
                        <p className="hb-landing-features-kicker text-sm font-semibold uppercase tracking-wide text-slate-900">
                            Built for speed
                        </p>
                        <h2 className="hb-landing-features-title mt-2 text-3xl font-semibold text-slate-900">
                            Everything you need to bill confidently
                        </h2>
                    </div>

                    <div className="hb-landing-features-grid grid gap-6 md:grid-cols-3">
                        {[
                            {
                                title: 'Link tasks from any tool',
                                description:
                                    'Attach Notion, Trello, Jira, or any URL to keep context right where you track time.',
                            },
                            {
                                title: 'Fast time entry',
                                description:
                                    'Log hours in seconds with smart defaults and quick actions built for daily use.',
                            },
                            {
                                title: 'Invoices in one click',
                                description:
                                    'Convert billable tasks into polished invoices with totals, VAT, and branding.',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="hb-landing-feature-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <h3 className="hb-landing-feature-title text-lg font-semibold text-slate-900">
                                    {feature.title}
                                </h3>
                                <p className="hb-landing-feature-text mt-3 text-sm text-slate-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="hb-landing-cta mx-auto w-full max-w-6xl px-6 pb-20">
                    <div className="hb-landing-cta-card flex flex-col items-center justify-between gap-6 rounded-3xl bg-slate-900 px-8 py-10 text-center text-white md:flex-row md:text-left">
                        <div className="hb-landing-cta-copy">
                            <h3 className="hb-landing-cta-title text-2xl font-semibold">
                                Ready to bill with confidence?
                            </h3>
                            <p className="hb-landing-cta-text mt-2 text-sm text-slate-200">
                                Start tracking in seconds and ship invoices the same day.
                            </p>
                        </div>
                        <Link
                            href={route('register')}
                            className="hb-landing-cta-button rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                        >
                            Create your account
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="hb-landing-footer border-t border-slate-200/70 bg-white/80">
                <div className="hb-landing-footer-inner mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-slate-500 md:flex-row">
                    <span className="hb-landing-footer-brand">© 2026 Hourbase</span>
                    <span className="hb-landing-footer-tagline">Your time, organized.</span>
                </div>
            </footer>
        </div>
    );
}

