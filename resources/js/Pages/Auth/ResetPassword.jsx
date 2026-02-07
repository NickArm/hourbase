import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset password — Hourbase">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="hb-auth-form-header mb-8 space-y-2">
                <h2 className="hb-auth-form-title text-2xl font-semibold text-slate-900">
                    Set a new password
                </h2>
                <p className="hb-auth-form-subtitle text-sm text-slate-600">
                    Choose a strong password to secure your Hourbase account.
                </p>
            </div>

            <form onSubmit={submit} className="hb-auth-form space-y-5">
                <div className="hb-auth-field space-y-2">
                    <InputLabel htmlFor="email" value="Email" className="hb-auth-label text-slate-700" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="hb-auth-input mt-1 block w-full rounded-xl border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:ring-blue-500"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="hb-auth-field space-y-2">
                    <InputLabel htmlFor="password" value="Password" className="hb-auth-label text-slate-700" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="hb-auth-input mt-1 block w-full rounded-xl border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:ring-blue-500"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
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
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="hb-auth-input mt-1 block w-full rounded-xl border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:ring-blue-500"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
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
                        Reset password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
