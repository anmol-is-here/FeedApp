import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Post'],
      // We manually add a "liked" property since the dummy API doesn't have social features
      transformResponse: (response) => 
        response.posts.map(post => ({ 
          ...post, 
          likes: post.reactions?.likes || 0, 
          liked: false,
          hashtags: post.tags ? `#${post.tags[0]}` : '#general'
        })),
    }),
    toggleLike: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body: { liked: true },
      }),
      // OPTIMISTIC UPDATE: Updates UI before the server responds
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            const post = draft.find((p) => p.id === id);
            if (post) {
              post.liked = !post.liked;
              post.likes += post.liked ? 1 : -1;
            }
          })
        );
        try {
          if (id <= 1000000) {
            await queryFulfilled;
          }
        } catch {
          patchResult.undo(); // Reverts changes if the API call fails
        }
      },
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: '/posts/add',
        method: 'POST',
        body: newPost,
      }),
      async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
        try {
          const { data: createdPost } = await queryFulfilled;
          
          dispatch(
            apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
              
              const formattedPost = {
                ...createdPost,
                hashtags: newPost.hashtags,
                id: Date.now(),
                likes: 0,
                liked: false
              };
              draft.unshift(formattedPost);
            })
          );
        } catch (err) {
          console.error("Mutation failed", err);
        }
      },
    }),
  }),
});

export const { useGetPostsQuery, useToggleLikeMutation, useCreatePostMutation } = apiSlice;


