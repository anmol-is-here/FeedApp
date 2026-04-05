// ─── App.jsx ───────────────────────────────────────────────
// Root component — sets up routing and authentication guard
// Routes:
//   /login   → public (LoginPage, no navbar)
//   /        → protected (FeedPage, with navbar)
//   /create  → protected (CreatePost, with navbar)
//   /explore → protected (ExplorePage, with navbar)

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from './store/authSlice';
import Navbar from './components/Navbar';
import FeedPage from './pages/FeedPage';
import CreatePost from './pages/CreatePost';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';

// ─── Auth Guard ────────────────────────────────────────────
// Wraps protected routes — redirects to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route — login page (no navbar shown) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes — wrapped with auth guard + navbar */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-[#0f1117]">
              <Navbar />
              <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/explore" element={<ExplorePage />} />
              </Routes>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
