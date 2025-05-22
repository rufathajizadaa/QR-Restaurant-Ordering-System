'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:8080/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username, password }),
                credentials: 'include',
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error('Login failed response:', errText);
                setError('Invalid credentials');
                return;
            }

            const meRes = await fetch('http://localhost:8080/api/auth/me', { credentials: 'include' });
            const contentType = meRes.headers.get('content-type');
            if (!meRes.ok || !contentType?.includes('application/json')) {
                const errText = await meRes.text();
                console.error('Error fetching /me:', errText);
                setError('Login succeeded but failed to load user info.');
                return;
            }

            const user = await meRes.json();
            const role =
                user?.roles?.[0]?.authority ||
                user?.roles?.[0] ||
                user?.authorities?.[0]?.authority;

            if (!role) {
                setError('Role not found for this user.');
                return;
            }

            if (role === 'ROLE_ADMIN') router.push('/manager');
            else if (role === 'ROLE_WAITER') router.push('/waiter');
            else if (role === 'ROLE_KITCHEN') router.push('/kitchen');
            else if (role === 'ROLE_GUEST') router.push('/menu');

        } catch (err) {
            console.error('Unexpected login error:', err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
            {/* Go Back Button */}
            <button
                onClick={() => router.back()}
                aria-label="Go back"
                className="absolute top-4 left-4 p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded shadow-md w-full max-w-md sm:p-8"
                style={{ minWidth: '280px' }}
            >
                <h2 className="text-xl sm:text-2xl mb-4 text-center font-semibold">Staff Login</h2>
                {error && <div className="text-red-500 mb-3 text-center">{error}</div>}

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 mb-3 border rounded text-sm sm:text-base"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded text-sm sm:text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded text-sm sm:text-base transition"
                >
                    Login
                </button>
            </form>
        </div>
    )
}