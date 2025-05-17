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
            // Step 1: POST /authenticate
            const res = await fetch('http://localhost:8080/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ username, password }),
                credentials: 'include', // important for cookie session
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error('Login failed response:', errText);
                setError('Invalid credentials');
                return;
            }

            // Step 2: GET /me
            const meRes = await fetch('http://localhost:8080/me', {
                credentials: 'include',
            });

            const contentType = meRes.headers.get('content-type');
            if (!meRes.ok || !contentType?.includes('application/json')) {
                const errText = await meRes.text();
                console.error('Error fetching /me:', errText);
                setError('Login succeeded but failed to load user info.');
                return;
            }

            const user = await meRes.json();
            console.log("User from /me:", user);

            // Handle roles from either field
            const role =
                user?.roles?.[0]?.authority ||
                user?.roles?.[0] ||
                user?.authorities?.[0]?.authority;

            if (!role) {
                setError('Role not found for this user.');
                return;
            }

            console.log("Detected role:", role);

            // Redirect based on role
            if (role === 'ROLE_ADMIN') {
                router.push('/manager');
            } else if (role === 'ROLE_WAITER') {
                router.push('/waiter');
            } else if (role === 'ROLE_KITCHEN') {
                router.push('/kitchen');
            } else if(role==='ROLE_GUEST'){
                router.push('/menu');
            }

        } catch (err) {
            console.error('Unexpected login error:', err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl mb-4">Staff Login</h2>
                {error && <div className="text-red-500 mb-3">{error}</div>}

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 mb-3 border rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-3 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    )
}
