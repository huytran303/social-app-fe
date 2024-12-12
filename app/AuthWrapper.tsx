// components/AuthWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from '@/setup/axios';
import { Navigation } from '@/components/navigation';
import Loading from '@/components/Loading';

const PUBLIC_ROUTES = ['/login', '/register'];

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        console.log('Current pathname:', pathname); // Debug log

        // If on public routes, skip authentication check and allow access
        if (PUBLIC_ROUTES.includes(pathname)) {
            console.log('Public route detected, allowing access'); // Debug log
            setLoading(false);
            return;
        }

        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('/auth/introspect', {
                    withCredentials: true // Ensure credentials are sent
                });

                console.log('Auth check response:', response.data);
                if (response.data?.result?.valid) {
                    setLoading(false);
                } else {
                    router.replace('/login');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                router.replace('/login');
            }
        };

        checkLoginStatus();
    }, [pathname, router]);

    if (loading) {
        return <Loading />;
    }

    // Simplified return without navigation for public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
        return <main className="flex-1 overflow-y-auto">{children}</main>;
    }

    return (
        <div className="flex h-screen">
            <Navigation />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}