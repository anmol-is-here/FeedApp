// ─── Filter Slice ──────────────────────────────────────────
// Handles CLIENT-SIDE UI state (search, hidden posts, editing)
// This is separate from apiSlice which handles SERVER-SIDE data
// Everything here is local to the browser session — not saved to any server

import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        searchQuery: '',       // current search text in Explore page
        hiddenPostIds: [],     // IDs of posts the user chose to hide
        editingPost: null,     // post object being edited (or null)
    },
    reducers: {
        // Set the search query (called when user types in search bar)
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },

        // Clear the search query (called when user clicks X button)
        clearSearchQuery: (state) => {
            state.searchQuery = '';
        },

        // Add a post ID to the hidden list (called from PostCard "Hide" menu)
        hidePost: (state, action) => {
            state.hiddenPostIds.push(action.payload);
        },

        // Set the post being edited (called from PostCard "Edit" menu)
        setEditingPost: (state, action) => {
            state.editingPost = action.payload;
        },

        // Clear editing state (called after save or when leaving edit page)
        clearEditingPost: (state) => {
            state.editingPost = null;
        },
    },
});

// Export actions
export const { setSearchQuery, clearSearchQuery, hidePost, setEditingPost, clearEditingPost } = filterSlice.actions;

// ─── Selectors ─────────────────────────────────────────────

// Get current search query from state
export const selectSearchQuery = (state) => state.filter.searchQuery;

// Get list of hidden post IDs from state
export const selectHiddenPostIds = (state) => state.filter.hiddenPostIds;

// Get the post currently being edited (or null)
export const selectEditingPost = (state) => state.filter.editingPost;

// ─── Derived Data Helpers ──────────────────────────────────
// These take posts array as input (not from state) and compute filtered results

// Get unique hashtags from all posts
export const selectAllTags = (posts) =>
    posts ? [...new Set(posts.map((p) => p.hashtags).filter(Boolean))] : [];

// Get hashtags that match the current search query
export const selectMatchingTags = (posts, searchQuery) =>
    searchQuery
        ? selectAllTags(posts).filter((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : selectAllTags(posts);

// Get posts whose hashtag matches the current search query
export const selectFilteredPosts = (posts, searchQuery) =>
    !posts || !searchQuery
        ? []
        : posts.filter((p) =>
            p.hashtags?.toLowerCase().includes(searchQuery.toLowerCase())
        );

// Export reducer (registered in store.js)
export default filterSlice.reducer;
