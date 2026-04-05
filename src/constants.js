// ─── Shared Constants ──────────────────────────────────────
// These are reused across multiple pages/components (DRY principle)
// Import them wherever you need layout or styling constants

// Default avatar for the logged-in user (used in Navbar, PostCard, CreatePost)
export const USER_AVATAR = "https://cdn-icons-png.flaticon.com/512/188/188987.png";

// ─── Layout Classes ────────────────────────────────────────
// Used by FeedPage, ExplorePage, CreatePost to maintain consistent layout

// Full page dark background
export const PAGE_WRAP = "min-h-screen bg-[#0f1117]";

// Offset for navbar — adds top padding on mobile, left margin on desktop
export const NAV_OFFSET = "pt-16 pb-20 md:pt-0 md:pb-0 md:ml-20 lg:ml-64 transition-all duration-500";

// Sticky header with blur effect (used on every page)
export const STICKY_HEADER = "sticky top-0 z-40 bg-[#0f1117]/80 backdrop-blur-xl border-b border-gray-800/60";

// ─── Login Page Input Style ────────────────────────────────
// Glassmorphism input used in LoginPage (extracted to avoid repeating 4 times)
export const GLASS_INPUT = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-gray-100 placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all text-sm";
