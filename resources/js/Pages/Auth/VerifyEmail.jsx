import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verify email — Hourbase">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="hb-auth-form-header mb-8 space-y-2">
                <h2 className="hb-auth-form-title text-2xl font-semibold text-slate-900">
                    Verify your email
                </h2>
                <p className="hb-auth-form-subtitle text-sm text-slate-600">
                    We emailed you a verification link. Click it to activate your account.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="hb-auth-status mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={submit} className="hb-auth-form space-y-5">
                <div className="hb-auth-actions flex flex-col gap-3">
                    <PrimaryButton
                        className="hb-auth-submit w-full justify-center rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                        disabled={processing}
                    >
                        Resend verification email
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="hb-auth-link text-center text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                    >
                        Log out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
