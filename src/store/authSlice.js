// ─── Auth Slice ────────────────────────────────────────────
// Handles user authentication (signup, login, logout)
// Data is stored in localStorage so it persists across page refreshes
// This slice is SEPARATE from the API slice — it only manages local auth state

import { createSlice } from '@reduxjs/toolkit';

// ─── Initial State ─────────────────────────────────────────
// On app start, check if a user is already saved in localStorage
const savedUser = JSON.parse(localStorage.getItem('currentUser'));

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: savedUser || null,  // logged-in user object (or null)
        isLoggedIn: !!savedUser,         // true if user exists in localStorage
    },
    reducers: {
        // ─── Signup ────────────────────────────────────────
        // Creates a new user and saves to localStorage
        // Does NOT auto-login — LoginPage dispatches login() separately
        signup: (state, action) => {
            const { name, username, email, password } = action.payload;

            // Get all registered users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Don't create duplicate users
            if (users.find(u => u.username === username || u.email === email)) return;

            // Create new user with unique ID (timestamp)
            const newUser = { id: Date.now(), name, username, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
        },

        // ─── Login ─────────────────────────────────────────
        // Finds the user in localStorage and sets them as currentUser
        login: (state, action) => {
            const { username, password } = action.payload;

            // Look up user from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Remove password before storing in Redux state (security)
                const { password: _, ...safeUser } = user;
                state.currentUser = safeUser;
                state.isLoggedIn = true;
                // Save to localStorage so user stays logged in after refresh
                localStorage.setItem('currentUser', JSON.stringify(safeUser));
            }
        },

        // ─── Logout ────────────────────────────────────────
        // Clears user from Redux state and localStorage
        logout: (state) => {
            state.currentUser = null;
            state.isLoggedIn = false;
            localStorage.removeItem('currentUser');
        },
    },
});

// Export actions (used in components via dispatch)
export const { signup, login, logout } = authSlice.actions;

// Export selectors (used in components via useSelector)
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

// Export reducer (registered in store.js)
export default authSlice.reducer;
