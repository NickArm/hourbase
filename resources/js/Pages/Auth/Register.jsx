import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Create account — Hourbase">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="hb-auth-form-header mb-8 space-y-2">
                <h2 className="hb-auth-form-title text-2xl font-semibold text-slate-900">
                    Create your Hourbase account
                </h2>
                <p className="hb-auth-form-subtitle text-sm text-slate-600">
                    Start tracking time, linking tasks, and sending invoices in minutes.
                </p>
            </div>

            <form onSubmit={submit} className="hb-auth-form space-y-5">
                <div className="hb-auth-field space-y-2">
                    <InputLabel
                        htmlFor="name"
                        value="Name"
                        className="hb-auth-label text-slate-700"
                    />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="hb-auth-input mt-1 block w-full rounded-xl border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:ring-blue-500"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-1" />
                </div>

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
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="hb-auth-field space-y-2">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="hb-auth-label text-slate-700"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="hb-auth-input mt-1 block w-full rounded-xl border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:ring-blue-500"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1"
                    />
                </div>

                <div className="hb-auth-actions flex flex-col gap-3 pt-2">
                    <PrimaryButton
                        className="hb-auth-submit w-full justify-center rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                        disabled={processing}
                    >
                        Create account
                    </PrimaryButton>
                    <Link
                        href={route('login')}
                        className="hb-auth-alt text-center text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                    >
                        Already have an account? Log in
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
