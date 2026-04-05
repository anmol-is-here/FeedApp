import { useState } from 'react';
import { useGetPostsQuery } from '../store/apiSlice';
import PostCard from '../components/PostCard';
import { MagnifyingGlassIcon, XMarkIcon, HashtagIcon } from '@heroicons/react/24/outline';

const PAGE_WRAP = "min-h-screen bg-[#0f1117]";
const NAV_OFFSET = "pt-16 pb-20 md:pt-0 md:pb-0 md:ml-20 lg:ml-64 transition-all duration-500";
const STICKY_HEADER = "sticky top-0 z-40 bg-[#0f1117]/80 backdrop-blur-xl border-b border-gray-800/60";

const ExplorePage = () => {
    const { data: posts, isLoading, isError } = useGetPostsQuery();
    const [searchQuery, setSearchQuery] = useState('');

    // Get unique hashtags from posts
    const allTags = posts ? [...new Set(posts.map(p => p.hashtags).filter(Boolean))] : [];

    // Filter tags and posts by search
    const matchingTags = searchQuery
        ? allTags.filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        : allTags;

    const filteredPosts = !posts || !searchQuery ? [] :
        posts.filter(p => p.hashtags?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className={PAGE_WRAP}>
            <div className={NAV_OFFSET}>

                {/* Header */}
                <div className={STICKY_HEADER}>
                    <div className="max-w-xl mx-auto px-4">
                        <div className="flex items-center h-14">
                            <h1 className="text-xl font-black text-gray-100 tracking-tight hidden md:block">Explore</h1>
                        </div>

                        {/* Search Bar */}
                        <div className="pb-3">
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-full px-4 py-2.5 border border-gray-700/40 focus-within:border-gray-500 transition-colors">
                                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search hashtags..."
                                    className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 outline-none text-sm"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                                        <XMarkIcon className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tag Pills — show all when no search, show matching when searching */}
                        {matchingTags.length > 0 && (
                            <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide">
                                {matchingTags.map(tag => (
                                    <button key={tag} onClick={() => setSearchQuery(tag)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-all duration-300 ${searchQuery === tag
                                                ? 'bg-gray-100 text-[#0f1117] border-gray-100'
                                                : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                                            }`}>
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="max-w-xl mx-auto px-2 sm:px-4 py-4">
                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-200 rounded-full animate-spin" />
                        </div>
                    )}

                    {isError && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 font-medium">Failed to load posts</p>
                            <p className="text-gray-600 text-sm mt-1">Please try again later</p>
                        </div>
                    )}

                    {/* Empty state — no search yet */}
                    {!isLoading && !isError && !searchQuery && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <HashtagIcon className="w-12 h-12 text-gray-600 mb-4" />
                            <p className="text-gray-400 font-medium">Search by hashtag</p>
                            <p className="text-gray-600 text-sm mt-1">Tap a tag above or type to search</p>
                        </div>
                    )}

                    {/* No results */}
                    {!isLoading && !isError && searchQuery && filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 font-medium">No posts found for "{searchQuery}"</p>
                            <p className="text-gray-600 text-sm mt-1">Try a different hashtag</p>
                        </div>
                    )}

                    {/* Post results */}
                    {filteredPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;
