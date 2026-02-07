import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            preserveState={false}
            preserveScroll={false}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-blue-500 text-slate-900 focus:border-blue-600'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900 focus:border-slate-300 focus:text-slate-900') +
                className
            }
        >
            {children}
        </Link>
    );
}
