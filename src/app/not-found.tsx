import Link from 'next/link';
import type { Viewport } from 'next';

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
            <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
                Could not find the requested resource. It might have been moved or deleted.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
            >
                Return Home
            </Link>
        </div>
    );
}
