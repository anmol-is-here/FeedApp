// ─── PostCard Component ────────────────────────────────────
// Individual post card shown in the feed — handles:
//   - Like/unlike with double-tap and button
//   - Comments section (expandable)
//   - Three-dot menu (Edit/Delete for own posts, Hide for others)
//   - Bookmark toggle
//   - Reaction animation overlay

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToggleLikeMutation, useDeletePostMutation } from '../store/apiSlice';
import { hidePost, setEditingPost } from '../store/filterSlice';
import { selectCurrentUser } from '../store/authSlice';
import { HeartIcon, ChatBubbleOvalLeftIcon, PaperAirplaneIcon, BookmarkIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, ChatBubbleOvalLeftIcon as ChatSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { USER_AVATAR } from '../constants';

// Reusable style for bold clickable usernames
const USERNAME_STYLE = "font-bold text-gray-100 mr-2 hover:underline cursor-pointer";

// Reusable style for menu buttons (Edit, Delete, Hide)
const MENU_BUTTON = "w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors";

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get logged-in user from Redux to check post ownership
    const currentUser = useSelector(selectCurrentUser);

    // RTK Query mutation hooks
    const [toggleLike] = useToggleLikeMutation();
    const [deletePost] = useDeletePostMutation();

    // Check if logged-in user owns this post (for showing Edit/Delete vs Hide)
    const isOwner = post.userId === currentUser?.id;

    // ─── Local State ───────────────────────────────────────
    const [comment, setComment] = useState('');           // current comment input
    const [bookmarked, setBookmarked] = useState(false);  // bookmark toggle
    const [showComments, setShowComments] = useState(false); // comments section visible
    const [lastTap, setLastTap] = useState(0);            // for double-tap detection
    const [commentsList, setCommentsList] = useState([]); // list of comments
    const [reaction, setReaction] = useState(null);       // reaction animation type
    const [showMenu, setShowMenu] = useState(false);      // three-dot menu visible

    const menuRef = useRef(null);  // ref to detect clicks outside menu

    // ─── Close menu when clicking outside ──────────────────
    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // ─── Event Handlers ────────────────────────────────────

    // Add a comment to the local list
    const handleAddComment = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setCommentsList([...commentsList, {
            text: comment,
            user: { username: currentUser?.username, avatar: USER_AVATAR }
        }]);
        setComment('');
    };

    // Show reaction emoji animation (auto-hides after 1.2s)
    const showReaction = (type) => {
        setReaction(type);
        setTimeout(() => setReaction(null), 1200);
    };

    // Double-tap on image to like (Instagram-style)
    const handleDoubleTap = () => {
        const now = Date.now();
        if (now - lastTap < 300) {  // two taps within 300ms
            if (!post.liked) toggleLike({ id: post.id });
            showReaction('like');
        }
        setLastTap(now);
    };

    // Single click like button
    const handleLikeClick = () => {
        const willLike = !post.liked;
        toggleLike({ id: post.id });
        showReaction(willLike ? 'like' : 'unlike');
    };

    // Edit: save post data to Redux and navigate to Create/Edit form
    const handleEdit = () => {
        dispatch(setEditingPost(post));
        setShowMenu(false);
        navigate('/create');
    };

    // Delete: remove post via API mutation (optimistic)
    const handleDelete = () => {
        deletePost(post.id);
        setShowMenu(false);
    };

    // Hide: add post ID to hidden list in Redux filter
    const handleHide = () => {
        dispatch(hidePost(post.id));
        setShowMenu(false);
    };

    // ─── Render ────────────────────────────────────────────
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl mb-4 overflow-hidden border border-gray-700/40 hover:border-gray-600/50 transition-all duration-300 max-w-xl mx-auto">

            {/* Post Header — avatar, username, menu */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    {/* Show logged-in user's avatar for own posts, random avatar for others */}
                    <img src={isOwner ? USER_AVATAR : `https://i.pravatar.cc/150?u=${post.userId}`}
                        alt="author" className="w-10 h-10 rounded-full border-2 border-gray-600/50 object-cover" />
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-100 hover:underline cursor-pointer">user_{post.userId}</span>
                        <span className="text-xs text-gray-500">Just now</span>
                    </div>
                </div>

                {/* Three-dot Menu */}
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <EllipsisHorizontalIcon className="w-5 h-5 text-gray-400 hover:text-gray-200" />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-10 bg-[#1a1d27] border border-gray-700 rounded-xl shadow-2xl py-1 min-w-[140px] z-50">
                            {isOwner ? (
                                <>
                                    <button onClick={handleEdit} className={`${MENU_BUTTON} text-gray-200`}>✏️ Edit</button>
                                    <button onClick={handleDelete} className={`${MENU_BUTTON} text-red-400`}>🗑️ Delete</button>
                                </>
                            ) : (
                                <button onClick={handleHide} className={`${MENU_BUTTON} text-gray-200`}>👁️‍🗨️ Hide post</button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Post Title */}
            {post.title && <h3 className="px-4 pb-2 text-base font-bold text-gray-100 leading-snug">{post.title}</h3>}

            {/* Post Image + Reaction Overlay */}
            <div className="relative cursor-pointer" onClick={handleDoubleTap}>
                <img src={`https://picsum.photos/seed/${post.id}/600/600`} alt="post"
                    className="w-full aspect-square object-cover" loading="lazy" />
                {/* Reaction emoji — shown briefly on double-tap */}
                {reaction && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <span style={{ fontSize: '8rem', filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.6))' }}>
                            {reaction === 'like' ? '😍' : '💔'}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="px-4 pt-3 pb-4">

                {/* Action Buttons — Like, Comment, Share, Bookmark */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-4 items-center">
                        {/* Like Button */}
                        <button onClick={handleLikeClick} className="active:scale-125 transition-transform">
                            {post.liked
                                ? <HeartSolid className="w-6 h-6 text-red-500" />
                                : <HeartIcon className="w-6 h-6 text-gray-400 hover:text-gray-200" />}
                        </button>
                        {/* Comment Toggle */}
                        <button onClick={() => setShowComments(!showComments)} className="active:scale-110 transition-transform">
                            {showComments
                                ? <ChatSolid className="w-6 h-6 text-blue-400" />
                                : <ChatBubbleOvalLeftIcon className="w-6 h-6 text-gray-400 hover:text-gray-200" />}
                        </button>
                        {/* Share (decorative) */}
                        <button className="transition-transform">
                            <PaperAirplaneIcon className="w-6 h-6 text-gray-400 hover:text-gray-200" />
                        </button>
                    </div>
                    {/* Bookmark Toggle */}
                    <button onClick={() => setBookmarked(!bookmarked)} className="active:scale-110 transition-transform">
                        {bookmarked
                            ? <BookmarkSolid className="w-6 h-6 text-white" />
                            : <BookmarkIcon className="w-6 h-6 text-gray-400 hover:text-gray-200" />}
                    </button>
                </div>

                {/* Likes Count */}
                <p className="font-bold text-sm text-gray-100 mb-2">{post.likes?.toLocaleString() || 0} likes</p>

                {/* Caption + Hashtags */}
                <div className="mb-3">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        <span className={USERNAME_STYLE}>user_{post.userId}</span>{post.body}
                    </p>
                    <p className="text-blue-400 text-sm mt-1.5 font-medium cursor-pointer hover:underline">{post.hashtags}</p>
                </div>

                {/* Comments Section — shown when toggled */}
                {showComments && (
                    <div>
                        {/* Existing Comments */}
                        {commentsList.length > 0 && (
                            <div className="space-y-3 mb-3">
                                <p className="text-gray-500 text-xs font-medium">
                                    {commentsList.length} comment{commentsList.length > 1 ? 's' : ''}
                                </p>
                                {commentsList.map((c, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                        <img src={c.user.avatar} alt="" className="w-6 h-6 rounded-full mt-0.5 border border-gray-700" />
                                        <p className="text-sm text-gray-300">
                                            <span className={USERNAME_STYLE}>{c.user.username}</span>{c.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Add Comment Form */}
                        <form onSubmit={handleAddComment} className="flex items-center border-t border-gray-700/50 pt-3 gap-3">
                            <img src={USER_AVATAR} className="w-7 h-7 rounded-full border border-gray-700" alt="" />
                            <input type="text" value={comment} onChange={e => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 text-sm outline-none bg-transparent placeholder-gray-600 text-gray-200" />
                            <button type="submit" disabled={!comment.trim()}
                                className="text-blue-400 font-bold text-sm hover:text-blue-300 disabled:opacity-30 transition-colors">
                                Post
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
