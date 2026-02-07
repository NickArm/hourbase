import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="hb-auth min-h-screen bg-slate-50 text-slate-900">
            <div className="hb-auth-bg pointer-events-none fixed inset-0">
                <div className="hb-auth-glow absolute -top-20 right-0 h-72 w-72 rounded-full bg-slate-900/10 blur-3xl" />
                <div className="hb-auth-glow absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

            <div className="hb-auth-container relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
                <div className="hb-auth-grid grid w-full gap-10 lg:grid-cols-2">
                    <div className="hb-auth-brand hidden flex-col justify-center gap-6 lg:flex">
                        <Link href="/" className="hb-auth-logo flex items-center gap-3">
                            <div className="hb-auth-logo-mark flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900">
                                <ApplicationLogo className="hb-auth-logo-icon h-7 w-7 text-white" />
                            </div>
                            <span className="hb-auth-logo-text text-xl font-semibold text-slate-900">
                                Hourbase
                            </span>
                        </Link>

                        <div className="hb-auth-brand-copy space-y-4">
                            <h1 className="hb-auth-brand-title text-3xl font-semibold text-slate-900">
                                Built for freelancers who ship fast.
                            </h1>
                            <p className="hb-auth-brand-text text-sm leading-relaxed text-slate-600">
                                Link your tasks, track time effortlessly, and generate invoices in seconds.
                                Hourbase keeps your work organized and your billing simple.
                            </p>
                        </div>

                        <div className="hb-auth-brand-card rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                            <p className="hb-auth-brand-card-title text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Why teams choose Hourbase
                            </p>
                            <ul className="hb-auth-brand-list mt-4 space-y-3 text-sm text-slate-600">
                                <li className="hb-auth-brand-item">• Lightning-fast time entry</li>
                                <li className="hb-auth-brand-item">• Linked tasks from any tool</li>
                                <li className="hb-auth-brand-item">• Invoices with VAT & branding</li>
                            </ul>
                        </div>
                    </div>

                    <div className="hb-auth-card w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                        <div className="hb-auth-card-header mb-6 flex items-center gap-3 lg:hidden">
                            <Link href="/" className="hb-auth-card-logo flex items-center gap-3">
                                <div className="hb-auth-logo-mark flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900">
                                    <ApplicationLogo className="hb-auth-logo-icon h-6 w-6 text-white" />
                                </div>
                                <span className="hb-auth-logo-text text-lg font-semibold text-slate-900">
                                    Hourbase
                                </span>
                            </Link>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
