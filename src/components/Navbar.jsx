// ─── Navbar (Side Navigation) — Glassmorphism Edition ──────
// Responsive navigation bar with frosted-glass look:
//   - Desktop: collapsible glass sidebar on the left
//   - Mobile: fixed glass bottom tab bar + glass top header
// Everything feels like clicking through frosted glass panels
// Shows user info in footer, click to logout

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../store/authSlice';
import { HomeIcon, HashtagIcon, BellIcon, EnvelopeIcon, PlusCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, HashtagIcon as HashSolid, BellIcon as BellSolid, EnvelopeIcon as MessageSolid, PlusCircleIcon as PlusSolid } from '@heroicons/react/24/solid';
import { USER_AVATAR } from '../constants';

// ─── Reusable Utility Classes ──────────────────────────────
const FLEX_CENTER = "flex items-center justify-center";
const TRANSITION = "transition-all duration-500 ease-in-out";

// Glass effect for the navbar containers (sidebar, top bar, bottom bar)
// Uses low-opacity white background + strong backdrop blur for frosted look
const GLASS_BG = "bg-white/[0.03] backdrop-blur-2xl";

// Border style for glass panels — subtle white edge that catches light
const GLASS_BORDER = "border border-white/[0.06]";

// Hover effect on nav items — looks like pressing into glass
const GLASS_HOVER = "hover:bg-white/[0.08] active:bg-white/[0.12] active:scale-[0.97]";

// Navigation links config — each item has a route, label, and icon pair
const NAV_LINKS = [
    { to: '/', label: 'Home', Icon: HomeIcon, ActiveIcon: HomeSolid },
    { to: '/explore', label: 'Explore', Icon: HashtagIcon, ActiveIcon: HashSolid },
    { to: '/notifications', label: 'Notifications', Icon: BellIcon, ActiveIcon: BellSolid },
    { to: '/messages', label: 'Messages', Icon: EnvelopeIcon, ActiveIcon: MessageSolid },
    { to: '/create', label: 'Create', Icon: PlusCircleIcon, ActiveIcon: PlusSolid },
    { to: '/profile', label: 'Profile', isProfile: true },  // mobile-only profile avatar
];

// ─── Avatar Component ──────────────────────────────────────
// Reusable circular avatar with glass-style border glow
const Avatar = ({ size }) => (
    <img className={`${size} rounded-full border border-white/20 object-cover shadow-sm shadow-white/5`}
        src={USER_AVATAR} alt="User" />
);

// ─── NavItem Component ─────────────────────────────────────
// Individual nav link with glass-press effect on click
const NavItem = ({ to, label, Icon, ActiveIcon, isCollapsed, isProfile }) => {
    const { pathname } = useLocation();
    const isActive = pathname === to;  // highlight if on this route

    return (
        <Link to={to} className={`group ${FLEX_CENTER} w-full h-full relative`}>
            {/* Glass button container — pressed effect on active:scale */}
            <div className={`${FLEX_CENTER} rounded-2xl transition-all duration-200 ${GLASS_HOVER}
                ${isCollapsed ? 'md:w-12 md:h-12' : 'md:w-full md:justify-start md:px-4 md:py-3'}
                ${isActive ? 'bg-white/[0.08] shadow-inner shadow-white/5' : ''}`}>

                {/* Icon container */}
                <div className={`shrink-0 ${FLEX_CENTER}`}>
                    {isProfile ? (
                        // Profile avatar — only shown on mobile bottom bar
                        <div className="md:hidden"><Avatar size="h-9 w-9" /></div>
                    ) : (
                        // Regular icon — filled+glowing when active, outline when inactive
                        isActive
                            ? <ActiveIcon className="h-7 w-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                            : <Icon className="h-7 w-7 text-gray-400 group-hover:text-white transition-colors" />
                    )}
                </div>

                {/* Label text — hidden when sidebar is collapsed */}
                {!isCollapsed && label && (
                    <span className={`ml-4 text-xl hidden md:block whitespace-nowrap transition-opacity duration-300
                        ${isActive ? "font-bold text-white" : "font-normal text-gray-300"}`}>
                        {label}
                    </span>
                )}
            </div>
        </Link>
    );
};

// ─── SideNav (Main Component) ──────────────────────────────
const SideNav = () => {
    const user = useSelector(selectCurrentUser);    // logged-in user info
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);     // sidebar collapsed state
    const [isLogoHovered, setIsLogoHovered] = useState(false); // logo hover animation

    return (
        <>
            {/* ─── Mobile Top Header ─────────────────────────────
                Frosted glass bar at top of screen (mobile only)
                Shows app name centered with glass background */}
            <header className={`md:hidden fixed top-0 left-0 w-full z-50 ${FLEX_CENTER} px-4 h-14
                ${GLASS_BG} ${GLASS_BORDER} border-t-0 border-x-0
                shadow-lg shadow-black/20`}>
                <div className="w-10" />
                {/* App name with subtle text glow */}
                <h1 className="flex-1 text-center font-black text-xl tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                    SocialFeed
                </h1>
                <div className="w-10" />
            </header>

            {/* ─── Navigation Bar ────────────────────────────────
                Mobile: frosted glass bottom tab bar
                Desktop: frosted glass sidebar (collapsible)
                Both have translucent background + strong backdrop blur */}
            <nav className={`fixed z-50 ${TRANSITION}
                bottom-0 left-0 w-full h-16 flex flex-row
                ${GLASS_BG} shadow-lg shadow-black/30
                border-t border-white/[0.06]
                md:top-0 md:h-full md:flex-col md:justify-between md:items-start md:px-3 md:py-4
                md:border-t-0 md:border-r md:border-white/[0.06]
                md:shadow-[4px_0_30px_rgba(0,0,0,0.3)]
                ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>

                <div className="flex flex-row md:flex-col w-full h-full md:h-auto items-center">

                    {/* ─── Logo / Collapse Toggle (desktop only) ──────
                        Glass button that morphs between hamburger and logo */}
                    <div className={`hidden md:flex items-center w-full mb-6 px-3 ${isCollapsed ? 'justify-center' : 'justify-start gap-4'}`}>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            onMouseEnter={() => setIsLogoHovered(true)}
                            onMouseLeave={() => setIsLogoHovered(false)}
                            className={`relative ${FLEX_CENTER} ${TRANSITION} rounded-2xl shrink-0
                                ${isCollapsed
                                    ? 'w-12 h-12 bg-white/90 text-[#0f1117] shadow-lg shadow-white/20'
                                    : `p-2 text-white ${GLASS_HOVER}`
                                }`}
                        >
                            {/* Hamburger icon — visible when sidebar is expanded */}
                            <div className={`absolute ${TRANSITION} transform ${isCollapsed ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100 rotate-0'}`}>
                                <Bars3Icon className="h-7 w-7" />
                            </div>
                            {/* Logo letter — visible when collapsed, shifts S↔F on hover */}
                            <div className={`absolute ${TRANSITION} transform ${isCollapsed ? 'opacity-100 scale-110 rotate-0' : 'opacity-0 scale-0 -rotate-180'}`}>
                                <span className="text-2xl font-black">{isLogoHovered ? 'F' : 'S'}</span>
                            </div>
                            {/* Invisible placeholder to maintain button size */}
                            <div className="h-7 w-7 opacity-0 pointer-events-none" />
                        </button>
                        {/* App name — hidden when sidebar is collapsed */}
                        {!isCollapsed && (
                            <span className="font-black text-xl tracking-tighter text-white hidden md:block drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                                SocialFeed
                            </span>
                        )}
                    </div>

                    {/* ─── Navigation Links ──────────────────────────
                        Each link has glass hover + active press effect */}
                    <div className={`${FLEX_CENTER} flex-1 md:w-full flex-row md:flex-col gap-1`}>
                        {NAV_LINKS.map((link) => (
                            <div key={link.to} className={`flex-1 md:w-full ${FLEX_CENTER} ${link.isProfile ? 'md:hidden' : ''}`}>
                                <NavItem {...link} isCollapsed={isCollapsed} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── User Profile Footer ───────────────────────
                    Glass card at bottom of sidebar — click to logout
                    Shows avatar, name, and @username */}
                <footer onClick={() => { dispatch(logout()); navigate('/login'); }}
                    className={`hidden md:flex items-center p-3 mb-2 rounded-2xl cursor-pointer
                        ${TRANSITION} ${GLASS_HOVER}
                        bg-white/[0.04] border border-white/[0.06]
                        w-full overflow-hidden
                        ${isCollapsed ? 'md:justify-center' : ''}`}>
                    <Avatar size="h-10 w-10" />
                    {/* User name & username — hidden when sidebar is collapsed */}
                    <div className={`ml-3 ${TRANSITION} overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 hidden md:block'}`}>
                        <p className="font-bold text-sm text-gray-100 truncate">{user?.name || 'User'}</p>
                        <p className="text-gray-500 text-xs truncate">@{user?.username || 'user'}</p>
                    </div>
                </footer>
            </nav>
        </>
    );
};

export default SideNav;
