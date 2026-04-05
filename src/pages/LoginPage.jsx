// ─── Login Page ────────────────────────────────────────────
// Glassmorphism login/signup form inspired by Twitter/X
// Supports two modes: Sign In and Sign Up (toggle with button)
// Uses Redux authSlice for authentication (no Context API)

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup, login, selectIsLoggedIn } from '../store/authSlice';
import { Navigate } from 'react-router-dom';
import { GLASS_INPUT } from '../constants';

const LoginPage = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    // Toggle between Login and Signup forms
    const [isSignup, setIsSignup] = useState(false);

    // Error message shown below the header
    const [error, setError] = useState('');

    // Form field states
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // If already logged in, redirect to home page
    if (isLoggedIn) return <Navigate to="/" replace />;

    // ─── Form Submit Handler ───────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isSignup) {
            // Validate all fields are filled
            if (!name || !username || !email || !password) {
                setError('All fields are required');
                return;
            }
            // Check for duplicate username/email in localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.username === username)) {
                setError('Username already taken');
                return;
            }
            if (users.find(u => u.email === email)) {
                setError('Email already registered');
                return;
            }
            // Create account, then auto-login
            dispatch(signup({ name, username, email, password }));
            dispatch(login({ username, password }));
        } else {
            // Validate required fields
            if (!username || !password) {
                setError('Username and password required');
                return;
            }
            // Check credentials against localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);
            if (!user) {
                setError('Invalid username or password');
                return;
            }
            dispatch(login({ username, password }));
        }
    };

    // ─── Switch between Login/Signup ───────────────────────
    const switchMode = () => {
        setIsSignup(!isSignup);
        setError('');
        setName(''); setUsername(''); setEmail(''); setPassword('');
    };

    return (
        <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background glow effects — decorative blurred circles */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]" />
            <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px]" />

            {/* Main content — centered card */}
            <div className="relative z-10 w-full max-w-md">

                {/* App Logo */}
                <div className="flex justify-center mb-8">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/10">
                        <span className="text-[#0a0c10] text-2xl font-black">S</span>
                    </div>
                </div>

                {/* Glass Card — transparent form container */}
                <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/40">

                    {/* Title — changes based on mode */}
                    <h1 className="text-3xl font-black text-white text-center mb-2 tracking-tight">
                        {isSignup ? 'Create your account' : 'Sign in to SocialFeed'}
                    </h1>
                    <p className="text-gray-500 text-sm text-center mb-8">
                        {isSignup ? 'Join the conversation today' : 'Welcome back — you\'ve been missed!'}
                    </p>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Form — all inputs use GLASS_INPUT style from constants.js (DRY) */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Name field — only shown during signup */}
                        {isSignup && (
                            <input type="text" value={name} onChange={e => setName(e.target.value)}
                                placeholder="Full name" className={GLASS_INPUT} />
                        )}

                        {/* Username field — shown in both modes */}
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                            placeholder="Username" className={GLASS_INPUT} />

                        {/* Email field — only shown during signup */}
                        {isSignup && (
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="Email address" className={GLASS_INPUT} />
                        )}

                        {/* Password field — shown in both modes */}
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="Password" className={GLASS_INPUT} />

                        {/* Submit button */}
                        <button type="submit"
                            className="w-full bg-white text-[#0a0c10] font-bold py-3.5 rounded-full hover:bg-gray-200 active:scale-[0.98] transition-all text-sm mt-2">
                            {isSignup ? 'Create account' : 'Sign in'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-white/[0.08]" />
                        <span className="text-gray-600 text-xs">or</span>
                        <div className="flex-1 h-px bg-white/[0.08]" />
                    </div>

                    {/* Toggle between Login and Signup */}
                    <p className="text-center text-gray-500 text-sm">
                        {isSignup ? 'Already have an account?' : "Don't have an account?"}
                        <button onClick={switchMode} className="text-blue-400 font-semibold ml-1.5 hover:text-blue-300 transition-colors">
                            {isSignup ? 'Sign in' : 'Sign up'}
                        </button>
                    </p>
                </div>

                {/* Footer text */}
                <p className="text-center text-gray-700 text-xs mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
