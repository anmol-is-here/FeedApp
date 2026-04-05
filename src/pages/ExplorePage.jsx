// ─── Explore Page ──────────────────────────────────────────
// Search-based page — users search by hashtag to find posts
// Uses Redux filterSlice for search state (persists across navigation)

import { useSelector, useDispatch } from 'react-redux';
import { useGetPostsQuery } from '../store/apiSlice';
import { selectSearchQuery, setSearchQuery, clearSearchQuery, selectMatchingTags, selectFilteredPosts, selectHiddenPostIds } from '../store/filterSlice';
import PostCard from '../components/PostCard';
import { MagnifyingGlassIcon, XMarkIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { PAGE_WRAP, NAV_OFFSET, STICKY_HEADER } from '../constants';

const ExplorePage = () => {
    const dispatch = useDispatch();

    // Fetch all posts from API
    const { data: posts, isLoading, isError } = useGetPostsQuery();

    // Get search query and hidden post IDs from Redux
    const searchQuery = useSelector(selectSearchQuery);
    const hiddenIds = useSelector(selectHiddenPostIds);

    // Derive filtered data using helper selectors from filterSlice
    const matchingTags = selectMatchingTags(posts, searchQuery);       // tags that match search
    const filteredPosts = selectFilteredPosts(posts, searchQuery)      // posts that match search
        .filter(p => !hiddenIds.includes(p.id));                       // exclude hidden posts

    return (
        <div className={PAGE_WRAP}>
            <div className={NAV_OFFSET}>

                {/* Page Header + Search */}
                <div className={STICKY_HEADER}>
                    <div className="max-w-xl mx-auto px-4">
                        {/* Title (hidden on mobile) */}
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
                                    onChange={e => dispatch(setSearchQuery(e.target.value))}
                                    placeholder="Search hashtags..."
                                    className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 outline-none text-sm"
                                />
                                {/* Clear button — shown only when there's text */}
                                {searchQuery && (
                                    <button onClick={() => dispatch(clearSearchQuery())} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                                        <XMarkIcon className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Hashtag Tag Pills — clickable filters */}
                        {matchingTags.length > 0 && (
                            <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide">
                                {matchingTags.map(tag => (
                                    <button key={tag} onClick={() => dispatch(setSearchQuery(tag))}
                                        className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-all duration-300 ${searchQuery === tag
                                            ? 'bg-gray-100 text-[#0f1117] border-gray-100'           // active tag
                                            : 'border-gray-700 text-gray-400 hover:border-gray-500'   // inactive tag
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

                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-200 rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 font-medium">Failed to load posts</p>
                            <p className="text-gray-600 text-sm mt-1">Please try again later</p>
                        </div>
                    )}

                    {/* Empty State — no search query entered yet */}
                    {!isLoading && !isError && !searchQuery && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <HashtagIcon className="w-12 h-12 text-gray-600 mb-4" />
                            <p className="text-gray-400 font-medium">Search by hashtag</p>
                            <p className="text-gray-600 text-sm mt-1">Tap a tag above or type to search</p>
                        </div>
                    )}

                    {/* No Results — searched but nothing found */}
                    {!isLoading && !isError && searchQuery && filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 font-medium">No posts found for "{searchQuery}"</p>
                            <p className="text-gray-600 text-sm mt-1">Try a different hashtag</p>
                        </div>
                    )}

                    {/* Filtered Post Results */}
                    {filteredPosts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;
