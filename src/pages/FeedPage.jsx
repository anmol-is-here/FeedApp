import { useGetPostsQuery } from '../store/apiSlice';
import PostCard from '../components/PostCard';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const PAGE_WRAP = "min-h-screen bg-[#0f1117]";
const NAV_OFFSET = "pt-16 pb-20 md:pt-0 md:pb-0 md:ml-20 lg:ml-64 transition-all duration-500";
const STICKY_HEADER = "sticky top-0 z-40 bg-[#0f1117]/80 backdrop-blur-xl border-b border-gray-800/60";

const FeedPage = () => {
    const { data: posts, isLoading, isError } = useGetPostsQuery();

    return (
        <div className={PAGE_WRAP}>
            <div className={NAV_OFFSET}>

                {/* Header */}
                <div className={STICKY_HEADER}>
                    <div className="max-w-xl mx-auto px-4 flex items-center h-14">
                        <h1 className="text-xl font-black text-gray-100 tracking-tight">Home</h1>
                    </div>
                </div>

                {/* Feed */}
                <div className="max-w-xl mx-auto px-2 sm:px-4 py-4">
                    {/* Loading */}
                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-200 rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Error */}
                    {isError && (
                        <div className="flex flex-col items-center py-20">
                            <ExclamationCircleIcon className="w-12 h-12 text-red-400 mb-4" />
                            <p className="text-gray-400 font-medium">Failed to load feed</p>
                            <p className="text-gray-600 text-sm mt-1">Please try again later</p>
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && !isError && posts?.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 font-medium">No posts yet</p>
                            <p className="text-gray-600 text-sm mt-1">Be the first to share something</p>
                        </div>
                    )}

                    {/* Posts */}
                    {!isLoading && !isError && posts?.map(post => <PostCard key={post.id} post={post} />)}
                </div>
            </div>
        </div>
    );
};

export default FeedPage;
