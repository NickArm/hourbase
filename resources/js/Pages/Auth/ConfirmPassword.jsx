import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm password — Hourbase">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="hb-auth-form-header mb-8 space-y-2">
                <h2 className="hb-auth-form-title text-2xl font-semibold text-slate-900">
                    Confirm your password
                </h2>
                <p className="hb-auth-form-subtitle text-sm text-slate-600">
                    This is a secure area. Please confirm your password to continue.
                </p>
            </div>

            <form onSubmit={submit} className="hb-auth-form space-y-5">
                <div className="hb-auth-field space-y-2">
                    <InputLabel htmlFor="password" value="Password" className="hb-auth-label text-slate-700" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="hb-auth-input mt-1 block w-full rounded-xl border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:ring-blue-500"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="hb-auth-actions flex flex-col gap-3 pt-2">
                    <PrimaryButton
                        className="hb-auth-submit w-full justify-center rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                        disabled={processing}
                    >
                        Confirm password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
