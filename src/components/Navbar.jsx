
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, HashtagIcon, BellIcon, EnvelopeIcon, PlusCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, HashtagIcon as HashSolid, BellIcon as BellSolid, EnvelopeIcon as MessageSolid, PlusCircleIcon as PlusSolid } from '@heroicons/react/24/solid';

const flexCenter = "flex items-center justify-center";
const trans500 = "transition-all duration-500 ease-in-out";

const NAV_LINKS = [
    { to: '/', label: 'Home', Icon: HomeIcon, ActiveIcon: HomeSolid },
    { to: '/explore', label: 'Explore', Icon: HashtagIcon, ActiveIcon: HashSolid },
    { to: '/notifications', label: 'Notifications', Icon: BellIcon, ActiveIcon: BellSolid },
    { to: '/messages', label: 'Messages', Icon: EnvelopeIcon, ActiveIcon: MessageSolid },
    { to: '/create', label: 'Create', Icon: PlusCircleIcon, ActiveIcon: PlusSolid },
    { to: '/profile', label: 'Profile', isProfile: true },
];

const Avatar = ({ size }) => (
    <img
        className={`${size} rounded-full border border-gray-600 object-cover`}
        src="https://cdn-icons-png.flaticon.com/512/188/188987.png"
        alt="User"
    />
);

const NavItem = ({ to, label, Icon, ActiveIcon, isCollapsed, isProfile }) => {
    const { pathname } = useLocation();
    const isActive = pathname === to;

    return (
        <Link to={to} className={`group ${flexCenter} w-full h-full relative`}>
            <div className={`${flexCenter} rounded-full transition-all duration-200 active:scale-95 
        ${isCollapsed ? 'md:w-12 md:h-12' : 'md:w-full md:justify-start md:px-4 md:py-3 md:hover:bg-white/10'}`}>

                <div className={`shrink-0 ${flexCenter}`}>
                    {isProfile ? (
                        <div className="md:hidden"><Avatar size="h-9 w-9" /></div>
                    ) : (
                        isActive ? <ActiveIcon className="h-7 w-7 text-white" /> : <Icon className="h-7 w-7 text-gray-400 group-hover:text-white" />
                    )}
                </div>

                {!isCollapsed && label && (
                    <span className={`ml-4 text-xl hidden md:block whitespace-nowrap transition-opacity duration-300 ${isActive ? "font-bold text-white" : "font-normal text-gray-300"}`}>
                        {label}
                    </span>
                )}
            </div>
        </Link>
    );
};

const SideNav = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLogoHovered, setIsLogoHovered] = useState(false);

    return (
        <>
            <header className={`md:hidden fixed top-0 left-0 w-full z-50 ${flexCenter} px-4 h-14 bg-[#0f1117]/80 backdrop-blur-xl border-b border-gray-800/60`}>
                <div className="w-10" />
                <h1 className="flex-1 text-center font-black text-xl tracking-tighter text-white">SocialFeed</h1>
                <div className="w-10" />
            </header>

            <nav className={`fixed z-50 ${trans500} bottom-0 left-0 w-full h-16 flex flex-row bg-[#0f1117]/80 backdrop-blur-3xl border-t border-gray-800/60 
                      md:top-0 md:h-full md:flex-col md:justify-between md:items-start md:px-3 md:py-4 md:border-t-0 md:border-r md:border-gray-800/60 
                      ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>

                <div className={`flex flex-row md:flex-col w-full h-full md:h-auto items-center`}>

                    <div className={`hidden md:flex items-center w-full mb-6 px-3 ${isCollapsed ? 'justify-center' : 'justify-start gap-4'}`}>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            onMouseEnter={() => setIsLogoHovered(true)}
                            onMouseLeave={() => setIsLogoHovered(false)}
                            className={`relative ${flexCenter} ${trans500} rounded-full shrink-0 ${isCollapsed ? 'w-12 h-12 bg-white text-[#0f1117] shadow-lg rotate-360' : 'p-2 hover:bg-white/10 text-white'}`}
                        >
                            <div className={`absolute ${trans500} transform ${isCollapsed ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100 rotate-0'}`}>
                                <Bars3Icon className="h-7 w-7" />
                            </div>
                            <div className={`absolute ${trans500} transform ${isCollapsed ? 'opacity-100 scale-110 rotate-0' : 'opacity-0 scale-0 -rotate-180'}`}>
                                <span className="text-2xl font-black">{isLogoHovered ? 'F' : 'S'}</span>
                            </div>
                            <div className="h-7 w-7 opacity-0 pointer-events-none" />
                        </button>
                        {!isCollapsed && <span className="font-black text-xl tracking-tighter text-white hidden md:block">SocialFeed</span>}
                    </div>

                    <div className={`${flexCenter} flex-1 md:w-full flex-row md:flex-col`}>
                        {NAV_LINKS.map((link) => (
                            <div key={link.to} className={`flex-1 md:w-full ${flexCenter} ${link.isProfile ? 'md:hidden' : ''}`}>
                                <NavItem {...link} isCollapsed={isCollapsed} />
                            </div>
                        ))}
                    </div>
                </div>

                <footer className={`hidden md:flex items-center p-3 mb-2 rounded-full hover:bg-white/10 cursor-pointer ${trans500} w-full overflow-hidden ${isCollapsed ? 'md:justify-center' : ''}`}>
                    <Avatar size="h-10 w-10" />
                    <div className={`ml-3 ${trans500} overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 hidden md:block'}`}>
                        <p className="font-bold text-sm text-gray-100 truncate">John Doe</p>
                        <p className="text-gray-500 text-xs truncate">@johndoe_dev</p>
                    </div>
                </footer>
            </nav>
        </>
    );
};

export default SideNav;


