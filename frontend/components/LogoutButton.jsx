'use client';

import { useRouter } from 'next/navigation';
import { removeToken } from '../utils/auth';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        removeToken();
        router.push('/login');
    };

    return <button onClick={handleLogout}>Logout</button>;
}
