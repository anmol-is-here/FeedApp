// ─── Feed Page (Home) ──────────────────────────────────────
// The main home feed — shows all posts from the API
// Hidden posts are filtered out using hiddenPostIds from Redux

import { useSelector } from 'react-redux';
import { useGetPostsQuery } from '../store/apiSlice';
import { selectHiddenPostIds } from '../store/filterSlice';
import PostCard from '../components/PostCard';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { PAGE_WRAP, NAV_OFFSET, STICKY_HEADER } from '../constants';

const FeedPage = () => {
    // Fetch all posts from the API (RTK Query auto-caches this)
    const { data: posts, isLoading, isError } = useGetPostsQuery();

    // Get list of post IDs the user chose to hide
    const hiddenIds = useSelector(selectHiddenPostIds);

    // Filter out hidden posts
    const visiblePosts = posts?.filter(p => !hiddenIds.includes(p.id));

    return (
        <div className={PAGE_WRAP}>
            <div className={NAV_OFFSET}>

                {/* Page Header */}
                <div className={STICKY_HEADER}>
                    <div className="max-w-xl mx-auto px-4 flex items-center h-14">
                        <h1 className="text-xl font-black text-gray-100 tracking-tight">Home</h1>
                    </div>
                </div>

                {/* Feed Content */}
                <div className="max-w-xl mx-auto px-2 sm:px-4 py-4">

                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-200 rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="flex flex-col items-center py-20">
                            <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-4" />
                            <p className="text-gray-400 font-medium">Failed to load feed</p>
                            <p className="text-gray-600 text-sm mt-1">Please try again later</p>
                        </div>
                    )}

                    {/* Empty State — no posts available */}
                    {!isLoading && !isError && visiblePosts?.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 font-medium">No posts yet</p>
                            <p className="text-gray-600 text-sm mt-1">Be the first to share something</p>
                        </div>
                    )}

                    {/* Render each post as a PostCard */}
                    {!isLoading && !isError && visiblePosts?.map(post => <PostCard key={post.id} post={post} />)}
                </div>
            </div>
        </div>
    );
};

export default FeedPage;
