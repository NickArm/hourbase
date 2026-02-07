import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot password — Hourbase">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="hb-auth-form-header mb-8 space-y-2">
                <h2 className="hb-auth-form-title text-2xl font-semibold text-slate-900">
                    Reset your password
                </h2>
                <p className="hb-auth-form-subtitle text-sm text-slate-600">
                    Enter your email and we will send you a secure reset link.
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
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="hb-auth-actions flex flex-col gap-3 pt-2">
                    <PrimaryButton
                        className="hb-auth-submit w-full justify-center rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                        disabled={processing}
                    >
                        Email reset link
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
