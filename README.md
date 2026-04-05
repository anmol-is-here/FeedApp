# SocialFeed — React Social Media App

A modern social media feed application built with **React + Redux Toolkit + Tailwind CSS**, inspired by Twitter/X and Instagram.

## 🚀 Quick Start

```bash
cd feed-app
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📁 Project Structure

```
src/
├── main.jsx              # App entry point — wraps in Redux Provider
├── App.jsx               # Root component — routing + auth guard
├── constants.js          # Shared styles & constants (DRY)
├── index.css             # Global Tailwind CSS styles
│
├── store/                # Redux state management
│   ├── store.js          # Combines all reducers
│   ├── authSlice.js      # Login/signup/logout (localStorage)
│   ├── filterSlice.js    # Search, hidden posts, editing state
│   └── apiSlice.js       # API calls (RTK Query + optimistic updates)
│
├── pages/                # Page-level components (one per route)
│   ├── LoginPage.jsx     # Glassmorphism login/signup form
│   ├── FeedPage.jsx      # Home feed — shows all posts
│   ├── CreatePost.jsx    # Create/Edit post form (shared)
│   └── ExplorePage.jsx   # Search posts by hashtag
│
└── components/           # Reusable UI components
    ├── Navbar.jsx        # Responsive sidebar + bottom tab bar
    └── PostCard.jsx      # Individual post with like, comment, menu
```

---

## 🔄 How the App Works (Flow)

### 1. App Startup
```
main.jsx → Provider(store) → App.jsx → Router → ProtectedRoute
```
- `main.jsx` creates the Redux store and renders `App.jsx`
- `App.jsx` checks if user is logged in (via Redux `selectIsLoggedIn`)
- If **not logged in** → redirects to `/login`
- If **logged in** → shows Navbar + page content

### 2. Authentication Flow
```
LoginPage → dispatch(signup) → dispatch(login) → Redux state + localStorage → redirect to /
```
- User signs up → data saved to `localStorage` (no backend needed)
- User logs in → credentials checked against `localStorage`
- On success → `currentUser` saved in Redux state + `localStorage`
- On page refresh → `authSlice` loads from `localStorage` automatically
- Logout → clears Redux state + `localStorage` → redirect to `/login`

### 3. Fetching Posts
```
FeedPage loads → useGetPostsQuery() → RTK Query fetches from DummyJSON API → cached in Redux
```
- RTK Query auto-manages loading, error, and caching states
- API response is transformed to add `liked`, `likes`, and `hashtags` fields
- Posts are cached — navigating away and back doesn't re-fetch

### 4. Creating a Post
```
CreatePost form → dispatch(createPost) → API POST → optimistic cache update → redirect to /
```
- Sends `userId: 1` to DummyJSON (it only accepts IDs 1-208)
- Stores the real logged-in user's ID for ownership checks
- New post appears at the top of the feed immediately

### 5. Editing a Post
```
PostCard "Edit" → Redux setEditingPost → navigate('/create') → form pre-filled → updatePost → redirect to /
```
- Same `CreatePost.jsx` form is reused for editing (DRY)
- `editingPost` in Redux determines if form is in Edit or Create mode
- Optimistic update — UI changes instantly, API call happens in background

### 6. Liking a Post
```
Click heart / double-tap image → toggleLike mutation → optimistic update (instant UI change)
```
- Like count updates immediately without waiting for server
- If server fails, the change is rolled back (undo)
- Double-tap on image shows emoji reaction overlay

### 7. Search (Explore Page)
```
Type in search bar → Redux setSearchQuery → filter posts by hashtag → show results
```
- Search state lives in Redux (persists when navigating between pages)
- Clickable hashtag pills for quick filtering
- Shows "No results" state when no matches found

---

## 🏗️ Architecture & State Management

### Three Redux Slices

| Slice | Purpose | Persistence |
|-------|---------|-------------|
| `authSlice` | Login/signup/logout | localStorage |
| `filterSlice` | Search query, hidden posts, editing state | In-memory (resets on refresh) |
| `apiSlice` | Server data (posts from DummyJSON API) | RTK Query cache (resets on refresh) |

### Why Three Slices?
- **Separation of concerns** — API data, UI state, and auth are independent
- **Each slice handles one responsibility** — easier to debug and understand
- **Auth is simple** — no token-based auth needed for localStorage

---

## 🎨 DRY Constants

Shared styles are in `src/constants.js` to avoid repetition:

| Constant | Used By | Purpose |
|----------|---------|---------|
| `USER_AVATAR` | PostCard, Navbar, CreatePost | Logged-in user's avatar image |
| `PAGE_WRAP` | FeedPage, ExplorePage, CreatePost | Full-page dark background |
| `NAV_OFFSET` | FeedPage, ExplorePage, CreatePost | Responsive navbar spacing |
| `STICKY_HEADER` | FeedPage, ExplorePage, CreatePost | Blur-effect sticky header |
| `GLASS_INPUT` | LoginPage | Transparent input field style |

---

## 🛠️ Tech Stack

| Tech | Role |
|------|------|
| **React 18** | UI framework |
| **React Router v6** | Page navigation |
| **Redux Toolkit** | State management |
| **RTK Query** | API data fetching + caching |
| **React Hook Form** | Form validation (CreatePost) |
| **Tailwind CSS** | Utility-first styling |
| **Heroicons** | Icon library |
| **DummyJSON** | Mock REST API |

---

## ⚠️ Important Notes

1. **Mock API** — DummyJSON doesn't persist data. Created/edited/deleted posts reset on page refresh.
2. **Optimistic Updates** — UI changes appear instantly. If the API fails, changes roll back.
3. **Temporary IDs** — New posts use `Date.now()` as ID. These are session-only.
4. **Password Storage** — Passwords are stored in localStorage in plain text. This is for learning only — never do this in production!

---

## 📖 Key Concepts Used

- **Redux Toolkit** — `createSlice` for reducers, `createApi` for API
- **RTK Query** — auto-generated hooks (`useGetPostsQuery`, `useToggleLikeMutation`)
- **Optimistic Updates** — `onQueryStarted` + `updateQueryData` pattern
- **React Hook Form** — `useForm`, `register`, `watch`, `handleSubmit`
- **Protected Routes** — `ProtectedRoute` component wraps authenticated pages
- **localStorage** — persist auth data across browser sessions
- **Tailwind CSS** — utility classes for responsive, dark-themed UI
- **Glassmorphism** — `backdrop-blur` + semi-transparent backgrounds
