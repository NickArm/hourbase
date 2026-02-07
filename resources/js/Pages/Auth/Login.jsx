import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const { url } = usePage();

    useEffect(() => {
        const query = url.includes('?') ? url.split('?')[1] : '';
        const params = new URLSearchParams(query);
        if (params.get('demo') === '1') {
            setData('email', 'demo@example.com');
            setData('password', 'Password');
        }
    }, [url, setData]);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in — Hourbase">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="hb-auth-form-header mb-8 space-y-2">
                <h2 className="hb-auth-form-title text-2xl font-semibold text-slate-900">
                    Welcome back
                </h2>
                <p className="hb-auth-form-subtitle text-sm text-slate-600">
                    Log in to track time, manage projects, and send invoices faster.
                </p>
            </div>

            {status && (
                <div className="hb-auth-status mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="hb-auth-form space-y-5">
                <div className="hb-auth-field space-y-2">
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="hb-auth-label text-slate-700"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="hb-auth-input mt-1 block w-full rounded-xl border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:ring-blue-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="hb-auth-field space-y-2">
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="hb-auth-label text-slate-700"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="hb-auth-input mt-1 block w-full rounded-xl border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:ring-blue-500"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="hb-auth-options flex items-center justify-between">
                    <label className="hb-auth-remember flex items-center gap-2 text-sm text-slate-600">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="hb-auth-remember-text">Remember me</span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="hb-auth-link text-sm font-semibold text-slate-900 transition hover:text-slate-900"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="hb-auth-actions flex flex-col gap-3 pt-2">
                    <PrimaryButton
                        className="hb-auth-submit w-full justify-center rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>
                    <Link
                        href={route('register')}
                        className="hb-auth-alt text-center text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                    >
                        New to Hourbase? Create an account
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
