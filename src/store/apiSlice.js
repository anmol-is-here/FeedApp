// ─── API Slice ─────────────────────────────────────────────
// Handles all SERVER-SIDE communication using RTK Query
// Uses DummyJSON API (https://dummyjson.com) as a mock backend
// All endpoints use OPTIMISTIC UPDATES — UI updates instantly before server responds
//
// Note: DummyJSON is a mock API — it accepts requests but doesn't actually save data
// So data resets on page refresh. The optimistic updates make it feel real during the session.

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({

    // ─── GET POSTS ───────────────────────────────────────
    // Fetches all posts from the API and transforms them for our app
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Post'],
      // Transform: add 'liked' and 'hashtags' fields that the API doesn't provide
      transformResponse: (response) =>
        response.posts.map(post => ({
          ...post,
          likes: post.reactions?.likes || 0,   // extract likes count
          liked: false,                         // default: not liked
          hashtags: post.tags ? `#${post.tags[0]}` : '#general'  // convert tags array to hashtag string
        })),
    }),

    // ─── TOGGLE LIKE ─────────────────────────────────────
    // Likes/unlikes a post with optimistic update
    toggleLike: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body: { liked: true },
      }),
      // Optimistic update: toggle like in cache BEFORE server responds
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // Update the cached posts list immediately
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            const post = draft.find((p) => p.id === id);
            if (post) {
              post.liked = !post.liked;                    // toggle liked state
              post.likes += post.liked ? 1 : -1;           // increment or decrement count
            }
          })
        );
        try {
          // Only await API for real posts (id <= 1000000)
          // Posts created in this session have Date.now() IDs (very large numbers)
          if (id <= 1000000) await queryFulfilled;
        } catch {
          patchResult.undo();  // revert if API fails
        }
      },
    }),

    // ─── CREATE POST ─────────────────────────────────────
    // Creates a new post via API, then adds it to the cached list
    createPost: builder.mutation({
      query: (newPost) => ({
        url: '/posts/add',
        method: 'POST',
        body: newPost,
      }),
      // After API responds, add the new post to the top of the cached list
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        try {
          const { data: createdPost } = await queryFulfilled;

          // Add to cache with our custom fields
          dispatch(
            apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
              const formattedPost = {
                ...createdPost,
                userId: newPost.realUserId || newPost.userId,  // use logged-in user's ID
                hashtags: newPost.hashtags,    // keep our hashtag format
                id: Date.now(),               // unique ID for this session
                likes: 0,                     // new post starts with 0 likes
                liked: false,                 // not liked by default
              };
              draft.unshift(formattedPost);   // add to top of feed
            })
          );
        } catch (err) {
          console.error("Create post failed", err);
        }
      },
    }),

    // ─── DELETE POST ─────────────────────────────────────
    // Removes a post with optimistic update
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      // Optimistic: remove from cache immediately
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            const index = draft.findIndex((p) => p.id === id);
            if (index !== -1) draft.splice(index, 1);  // remove post from array
          })
        );
        try {
          if (id <= 1000000) await queryFulfilled;  // only await for real posts
        } catch {
          patchResult.undo();  // revert if API fails
        }
      },
    }),

    // ─── UPDATE POST ─────────────────────────────────────
    // Updates a post's title, body, and hashtags with optimistic update
    updatePost: builder.mutation({
      query: ({ id, title, body }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: { title, body },
      }),
      // Optimistic: update in cache immediately
      async onQueryStarted({ id, title, body, hashtags }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            const post = draft.find((p) => p.id === id);
            if (post) {
              post.title = title;
              post.body = body;
              if (hashtags) post.hashtags = hashtags;  // update hashtag if provided
            }
          })
        );
        try {
          if (id <= 1000000) await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

// Export hooks — auto-generated by RTK Query based on endpoint names
// Use these in components: const { data } = useGetPostsQuery()
export const {
  useGetPostsQuery,
  useToggleLikeMutation,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation
} = apiSlice;
