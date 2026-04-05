import { useState } from 'react';
import { useToggleLikeMutation } from '../store/apiSlice';
import { HeartIcon, ChatBubbleOvalLeftIcon, PaperAirplaneIcon, BookmarkIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, ChatBubbleOvalLeftIcon as ChatSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

const USERNAME_STYLE = "font-bold text-gray-100 mr-2 hover:underline cursor-pointer";

const PostCard = ({ post }) => {
    const [toggleLike] = useToggleLikeMutation();
    const [comment, setComment] = useState('');
    const [bookmarked, setBookmarked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [lastTap, setLastTap] = useState(0);
    const [commentsList, setCommentsList] = useState([]);
    const [reaction, setReaction] = useState(null);

    const currentUser = { id: 131, username: 'tech_enthusiast', avatar: 'https://i.pravatar.cc/150?u=131' };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setCommentsList([...commentsList, { text: comment, user: currentUser }]);
        setComment('');
    };

    // Simple pop-up: show emoji for 1.2 seconds, then hide
    const showReaction = (type) => {
        setReaction(type);
        setTimeout(() => setReaction(null), 1200);
    };

    const handleDoubleTap = () => {
        const now = Date.now();
        if (now - lastTap < 300) {
            if (!post.liked) toggleLike({ id: post.id });
            showReaction('like');
        }
        setLastTap(now);
    };

    const handleLikeClick = () => {
        const willLike = !post.liked;
        toggleLike({ id: post.id });
        showReaction(willLike ? 'like' : 'unlike');
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl mb-4 overflow-hidden border border-gray-700/40 hover:border-gray-600/50 transition-all duration-300 max-w-xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/150?u=${post.userId}`} alt="author" className="w-10 h-10 rounded-full border-2 border-gray-600/50 object-cover" />
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-100 hover:underline cursor-pointer">user_{post.userId}</span>
                        <span className="text-xs text-gray-500">Just now</span>
                    </div>
                </div>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <EllipsisHorizontalIcon className="w-5 h-5 text-gray-400 hover:text-gray-200" />
                </button>
            </div>

            {/* Title */}
            {post.title && <h3 className="px-4 pb-2 text-base font-bold text-gray-100 leading-snug">{post.title}</h3>}

            {/* Image + Reaction */}
            <div className="relative cursor-pointer" onClick={handleDoubleTap}>
                <img src={`https://picsum.photos/seed/${post.id}/600/600`} alt="post" className="w-full aspect-square object-cover" loading="lazy" />
                {reaction && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <span style={{ fontSize: '8rem', filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.6))' }}>
                            {reaction === 'like' ? '😍' : '💔'}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-4 pt-3 pb-4">

                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-4 items-center">
                        {/* Like */}
                        <button onClick={handleLikeClick} className="active:scale-125 transition-transform">
                            {post.liked
                                ? <HeartSolid className="w-6 h-6 text-red-500" />
                                : <HeartIcon className="w-6 h-6 text-gray-400 hover:text-gray-200" />}
                        </button>
                        {/* Comment toggle */}
                        <button onClick={() => setShowComments(!showComments)} className="active:scale-110 transition-transform">
                            {showComments
                                ? <ChatSolid className="w-6 h-6 text-blue-400" />
                                : <ChatBubbleOvalLeftIcon className="w-6 h-6 text-gray-400 hover:text-gray-200" />}
                        </button>
                        {/* Share */}
                        <button className="transition-transform">
                            <PaperAirplaneIcon className="w-6 h-6 text-gray-400 hover:text-gray-200" />
                        </button>
                    </div>
                    {/* Bookmark */}
                    <button onClick={() => setBookmarked(!bookmarked)} className="active:scale-110 transition-transform">
                        {bookmarked
                            ? <BookmarkSolid className="w-6 h-6 text-white" />
                            : <BookmarkIcon className="w-6 h-6 text-gray-400 hover:text-gray-200" />}
                    </button>
                </div>

                {/* Likes count */}
                <p className="font-bold text-sm text-gray-100 mb-2">{post.likes?.toLocaleString() || 0} likes</p>

                {/* Caption */}
                <div className="mb-3">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        <span className={USERNAME_STYLE}>user_{post.userId}</span>{post.body}
                    </p>
                    <p className="text-blue-400 text-sm mt-1.5 font-medium cursor-pointer hover:underline">{post.hashtags}</p>
                </div>

                {/* Comments — only shown when toggled */}
                {showComments && (
                    <div className="animate-[fadeIn_0.2s_ease-in-out]">
                        {commentsList.length > 0 && (
                            <div className="space-y-3 mb-3">
                                <p className="text-gray-500 text-xs font-medium">{commentsList.length} comment{commentsList.length > 1 ? 's' : ''}</p>
                                {commentsList.map((c, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                        <img src={c.user.avatar} alt="" className="w-6 h-6 rounded-full mt-0.5 border border-gray-700" />
                                        <p className="text-sm text-gray-300"><span className={USERNAME_STYLE}>{c.user.username}</span>{c.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <form onSubmit={handleAddComment} className="flex items-center border-t border-gray-700/50 pt-3 gap-3">
                            <img src={currentUser.avatar} className="w-7 h-7 rounded-full border border-gray-700" alt="" />
                            <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..."
                                className="flex-1 text-sm outline-none bg-transparent placeholder-gray-600 text-gray-200" />
                            <button type="submit" disabled={!comment.trim()} className="text-blue-400 font-bold text-sm hover:text-blue-300 disabled:opacity-30 transition-colors">Post</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
