import { useForm } from 'react-hook-form';
import { useCreatePostMutation } from '../store/apiSlice';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon, FaceSmileIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const MAX_BODY = 500;
const PAGE_WRAP = "min-h-screen bg-[#0f1117]";
const NAV_OFFSET = "pt-16 pb-20 md:pt-0 md:pb-0 md:ml-20 lg:ml-64 transition-all duration-500";
const STICKY_HEADER = "sticky top-0 z-40 bg-[#0f1117]/80 backdrop-blur-xl border-b border-gray-800/60";

// Toolbar buttons — heroicons + one custom GIF icon
const TOOLBAR_ICONS = [
    { Icon: PhotoIcon, label: 'Photo' },
    { label: 'GIF', isCustom: true },
    { Icon: FaceSmileIcon, label: 'Emoji' },
];

const CreatePost = () => {
    const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
        mode: 'onChange',
        defaultValues: { title: '', hashtag: '', body: '' }
    });

    const [createPost, { isLoading }] = useCreatePostMutation();
    const navigate = useNavigate();
    const charCount = (watch('body') || '').length;

    const onSubmit = async (data) => {
        let formattedTag = data.hashtag.trim();
        if (formattedTag && !formattedTag.startsWith('#')) formattedTag = `#${formattedTag}`;

        try {
            await createPost({ title: data.title, body: data.body, hashtags: formattedTag || '#general', userId: 1 }).unwrap();
            navigate('/');
        } catch (err) {
            console.error("Failed to create post:", err);
        }
    };

    // Character counter color
    const counterColor = charCount > MAX_BODY ? '#ef4444' : charCount > MAX_BODY * 0.8 ? '#f59e0b' : '#3b82f6';

    return (
        <div className={PAGE_WRAP}>
            <div className={NAV_OFFSET}>
                <div className="max-w-xl mx-auto">

                    {/* Header */}
                    <div className={STICKY_HEADER}>
                        <div className="flex items-center justify-between px-4 h-14">
                            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-gray-300">
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <h1 className="text-lg font-bold text-gray-100">Create Post</h1>
                            <div className="w-9" />
                        </div>
                    </div>

                    {/* Compose Area */}
                    <div className="p-4 flex gap-3">
                        <img src="https://cdn-icons-png.flaticon.com/512/188/188987.png" alt="User"
                            className="w-10 h-10 rounded-full border-2 border-gray-700 object-cover shrink-0 mt-1" />

                        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 min-w-0">

                            {/* Title input */}
                            <div className="mb-4">
                                <input type="text" {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Max 100 characters' } })}
                                    placeholder="Post title" className="w-full bg-transparent text-gray-100 text-lg font-bold placeholder-gray-600 outline-none border-b border-gray-800 pb-3 focus:border-gray-600 transition-colors" />
                                {errors.title && <p className="mt-1.5 text-xs text-red-400">{errors.title.message}</p>}
                            </div>

                            {/* Body textarea */}
                            <div className="mb-4">
                                <textarea {...register('body', { required: 'Caption is required', maxLength: { value: MAX_BODY, message: `Max ${MAX_BODY} characters` } })}
                                    rows="5" placeholder="What's happening?" className="w-full bg-transparent text-gray-200 placeholder-gray-600 outline-none resize-none leading-relaxed" />
                                {errors.body && <p className="mt-1 text-xs text-red-400">{errors.body.message}</p>}
                            </div>

                            {/* Hashtag input */}
                            <div className="mb-6 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5 border border-gray-800 focus-within:border-gray-600 transition-colors">
                                <span className="text-gray-500 text-sm font-medium">#</span>
                                <input type="text" {...register('hashtag')} placeholder="Add a hashtag"
                                    className="flex-1 bg-transparent text-gray-300 text-sm placeholder-gray-600 outline-none" />
                            </div>

                            {/* Toolbar + Submit */}
                            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                                {/* Media tool buttons */}
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
                                    {/* Character counter ring */}
                                    {charCount > 0 && (
                                        <>
                                            <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                                                <circle cx="10" cy="10" r="8" fill="none" stroke="#2d3139" strokeWidth="2" />
                                                <circle cx="10" cy="10" r="8" fill="none" stroke={counterColor} strokeWidth="2"
                                                    strokeDasharray={`${(charCount / MAX_BODY) * 50.26} 50.26`} strokeLinecap="round" className="transition-all duration-300" />
                                            </svg>
                                            {charCount > MAX_BODY * 0.8 && (
                                                <span className={`text-xs font-medium ${charCount > MAX_BODY ? 'text-red-400' : 'text-amber-400'}`}>{MAX_BODY - charCount}</span>
                                            )}
                                            <div className="w-px h-5 bg-gray-700" />
                                        </>
                                    )}
                                    {/* Submit */}
                                    <button type="submit" disabled={isLoading || !isValid}
                                        className="px-5 py-2 bg-gray-100 text-[#0f1117] font-bold text-sm rounded-full hover:bg-white disabled:opacity-40 transition-all active:scale-95">
                                        {isLoading ? 'Posting...' : 'Post'}
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
