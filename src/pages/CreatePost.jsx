// ─── Create/Edit Post Page ─────────────────────────────────
// Shared form for BOTH creating new posts and editing existing posts
// Mode is determined by whether editingPost exists in Redux:
//   - editingPost = null  → Create mode (title: "Create Post", button: "Post")
//   - editingPost = {...} → Edit mode (title: "Edit Post", button: "Save", form pre-filled)

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useCreatePostMutation, useUpdatePostMutation } from '../store/apiSlice';
import { selectEditingPost, clearEditingPost } from '../store/filterSlice';
import { selectCurrentUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon, FaceSmileIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { PAGE_WRAP, NAV_OFFSET, STICKY_HEADER, USER_AVATAR } from '../constants';

// Maximum characters allowed in post body
const MAX_BODY = 500;

// Toolbar button config — icons shown below the body textarea
const TOOLBAR_ICONS = [
    { Icon: PhotoIcon, label: 'Photo' },
    { label: 'GIF', isCustom: true },
    { Icon: FaceSmileIcon, label: 'Emoji' },
];

const CreatePost = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get editing post from Redux (null if creating new)
    const editingPost = useSelector(selectEditingPost);
    const currentUser = useSelector(selectCurrentUser);
    const isEditMode = !!editingPost;

    // React Hook Form setup
    const { register, handleSubmit, watch, reset, formState: { errors, isValid } } = useForm({
        mode: 'onChange',
        defaultValues: { title: '', hashtag: '', body: '' }
    });

    // Pre-fill form fields when editing an existing post
    useEffect(() => {
        if (editingPost) {
            reset({
                title: editingPost.title || '',
                body: editingPost.body || '',
                hashtag: editingPost.hashtags?.replace('#', '') || ''
            });
        }
    }, [editingPost, reset]);

    // RTK Query mutation hooks
    const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

    // Track character count for the body field
    const charCount = (watch('body') || '').length;
    const isLoading = isCreating || isUpdating;

    // ─── Submit Handler ────────────────────────────────────
    const onSubmit = async (data) => {
        // Format hashtag — add # prefix if missing
        let formattedTag = data.hashtag.trim();
        if (formattedTag && !formattedTag.startsWith('#')) formattedTag = `#${formattedTag}`;

        try {
            if (isEditMode) {
                // EDIT: optimistic update (no await needed — UI updates instantly)
                updatePost({ id: editingPost.id, title: data.title, body: data.body, hashtags: formattedTag || editingPost.hashtags });
                dispatch(clearEditingPost());
            } else {
                // CREATE: send userId:1 to API (DummyJSON only accepts 1-208)
                // realUserId stores the actual logged-in user's ID for ownership checks
                await createPost({ title: data.title, body: data.body, hashtags: formattedTag || '#general', userId: 1, realUserId: currentUser?.id }).unwrap();
            }
            navigate('/');  // redirect to home feed
        } catch (err) {
            console.error("Failed:", err);
        }
    };

    // ─── Back Button ───────────────────────────────────────
    const handleBack = () => {
        if (isEditMode) dispatch(clearEditingPost());  // clear edit state
        navigate(-1);  // go back in browser history
    };

    // Character counter color — changes from blue → yellow → red as you approach the limit
    const counterColor = charCount > MAX_BODY ? '#ef4444' : charCount > MAX_BODY * 0.8 ? '#f59e0b' : '#3b82f6';

    return (
        <div className={PAGE_WRAP}>
            <div className={NAV_OFFSET}>
                <div className="max-w-xl mx-auto">

                    {/* Page Header — shows "Create Post" or "Edit Post" */}
                    <div className={STICKY_HEADER}>
                        <div className="flex items-center justify-between px-4 h-14">
                            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-gray-300">
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <h1 className="text-lg font-bold text-gray-100">{isEditMode ? 'Edit Post' : 'Create Post'}</h1>
                            <div className="w-9" /> {/* spacer for centering */}
                        </div>
                    </div>

                    {/* Compose Area */}
                    <div className="p-4 flex gap-3">
                        {/* User Avatar */}
                        <img src={USER_AVATAR} alt="User"
                            className="w-10 h-10 rounded-full border-2 border-gray-700 object-cover shrink-0 mt-1" />

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 min-w-0">

                            {/* Title Input */}
                            <div className="mb-4">
                                <input type="text" {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Max 100 characters' } })}
                                    placeholder="Post title" className="w-full bg-transparent text-gray-100 text-lg font-bold placeholder-gray-600 outline-none border-b border-gray-800 pb-3 focus:border-gray-600 transition-colors" />
                                {errors.title && <p className="mt-1.5 text-xs text-red-400">{errors.title.message}</p>}
                            </div>

                            {/* Body Textarea */}
                            <div className="mb-4">
                                <textarea {...register('body', { required: 'Caption is required', maxLength: { value: MAX_BODY, message: `Max ${MAX_BODY} characters` } })}
                                    rows="5" placeholder="What's happening?" className="w-full bg-transparent text-gray-200 placeholder-gray-600 outline-none resize-none leading-relaxed" />
                                {errors.body && <p className="mt-1 text-xs text-red-400">{errors.body.message}</p>}
                            </div>

                            {/* Hashtag Input */}
                            <div className="mb-6 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5 border border-gray-800 focus-within:border-gray-600 transition-colors">
                                <span className="text-gray-500 text-sm font-medium">#</span>
                                <input type="text" {...register('hashtag')} placeholder="Add a hashtag"
                                    className="flex-1 bg-transparent text-gray-300 text-sm placeholder-gray-600 outline-none" />
                            </div>

                            {/* Toolbar + Submit Row */}
                            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                                {/* Media Buttons (decorative) */}
                                <div className="flex gap-1">
                                    {TOOLBAR_ICONS.map(({ Icon, label, isCustom }) => (
                                        <button key={label} type="button" className="p-2 rounded-full text-blue-400 hover:bg-blue-400/10 transition-colors">
                                            {isCustom
                                                ? <span className="text-xs font-bold border border-blue-400 rounded px-1">GIF</span>
                                                : <Icon className="w-5 h-5" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Character Counter Ring */}
                                    {charCount > 0 && (
                                        <>
                                            <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                                                <circle cx="10" cy="10" r="8" fill="none" stroke="#2d3139" strokeWidth="2" />
                                                <circle cx="10" cy="10" r="8" fill="none" stroke={counterColor} strokeWidth="2"
                                                    strokeDasharray={`${(charCount / MAX_BODY) * 50.26} 50.26`} strokeLinecap="round" className="transition-all duration-300" />
                                            </svg>
                                            {/* Show remaining characters when near limit */}
                                            {charCount > MAX_BODY * 0.8 && (
                                                <span className={`text-xs font-medium ${charCount > MAX_BODY ? 'text-red-400' : 'text-amber-400'}`}>{MAX_BODY - charCount}</span>
                                            )}
                                            <div className="w-px h-5 bg-gray-700" />
                                        </>
                                    )}

                                    {/* Submit Button — label changes based on mode */}
                                    <button type="submit" disabled={isLoading || !isValid}
                                        className="px-5 py-2 bg-gray-100 text-[#0f1117] font-bold text-sm rounded-full hover:bg-white disabled:opacity-40 transition-all active:scale-95">
                                        {isLoading ? 'Saving...' : isEditMode ? 'Save' : 'Post'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
