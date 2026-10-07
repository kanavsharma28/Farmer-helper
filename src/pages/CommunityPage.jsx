import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav';
import CommunityHeader from '../components/community/CommunityHeader';
import CommunityLeftSidebar from '../components/community/CommunityLeftSidebar';
import CommunityRightSidebar from '../components/community/CommunityRightSidebar';
import CommunityPostCard from '../components/community/CommunityPostCard';
import CreatePostModal from '../components/community/CreatePostModal';
import EditPostModal from '../components/community/EditPostModal';

import {
  getStoredCommunityPosts,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  toggleLikePost,
  toggleSavePost,
  addCommentToPost,
  deleteCommentFromPost,
  COMMUNITY_UPDATE_EVENT,
  COMMUNITY_CATEGORIES,
} from '../data/communityData';

export default function CommunityPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // Resolved current authenticated user
  const currentUser = useMemo(() => ({
    id:       user?.id       || 'user_farmer_01',
    name:     user?.name     || 'Rajesh Kumar',
    role:     user?.role     || 'farmer',
    initials: user?.initials || 'RK',
    phone:    user?.phone    || '9876543210',
    location: user?.location || 'Meerut, UP',
  }), [user]);

  // ── Language & App Nav State ──────────────────────────────────────────────
  const [lang, setLang] = useState('en');
  const isEn = lang === 'en';
  const [activeNav, setActiveNav] = useState('community');

  // ── Community View & Filter State ─────────────────────────────────────────
  // Views: 'feed' | 'my-posts' | 'saved' | 'my-comments'
  const [activeView, setActiveView] = useState('feed');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'popular'

  // ── Data & Loading State ──────────────────────────────────────────────────
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // ── Modals & Notification State ───────────────────────────────────────────
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // ── Load & Sync Posts ─────────────────────────────────────────────────────
  const loadPosts = useCallback(() => {
    try {
      setIsLoading(true);
      setApiError(null);
      const loaded = getStoredCommunityPosts();
      setPosts(loaded);
    } catch (err) {
      console.error('Failed to load community posts:', err);
      setApiError(isEn ? 'Unable to load community posts. Please try again.' : 'सामुदायिक पोस्ट लोड करने में असमर्थ। पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  }, [isEn]);

  useEffect(() => {
    loadPosts();

    // Listen for cross-tab / cross-component storage updates
    const handleStorageUpdate = () => {
      loadPosts();
    };

    window.addEventListener(COMMUNITY_UPDATE_EVENT, handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener(COMMUNITY_UPDATE_EVENT, handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [loadPosts]);

  // Read URL query params on load (e.g. ?category=disease or ?filter=saved)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    const viewParam = searchParams.get('view');
    if (viewParam) {
      setActiveView(viewParam);
    }
  }, [searchParams]);


  // ── Counts for Badges ─────────────────────────────────────────────────────
  const myPostsCount = useMemo(() => {
    return posts.filter((p) => p.authorId === currentUser.id).length;
  }, [posts, currentUser.id]);

  const savedPostsCount = useMemo(() => {
    return posts.filter((p) => Array.isArray(p.savedBy) && p.savedBy.includes(currentUser.id)).length;
  }, [posts, currentUser.id]);

  const myCommentsCount = useMemo(() => {
    return posts.filter((p) =>
      Array.isArray(p.comments) && p.comments.some((c) => c.authorId === currentUser.id)
    ).length;
  }, [posts, currentUser.id]);

  // ── Filtered & Sorted Feed ────────────────────────────────────────────────
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // 1. Navigation View Filtering
    if (activeView === 'my-posts') {
      result = result.filter((p) => p.authorId === currentUser.id);
    } else if (activeView === 'saved') {
      result = result.filter((p) => Array.isArray(p.savedBy) && p.savedBy.includes(currentUser.id));
    } else if (activeView === 'my-comments') {
      result = result.filter((p) =>
        Array.isArray(p.comments) && p.comments.some((c) => c.authorId === currentUser.id)
      );
    }

    // 2. Category Filtering
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 3. Role Filtering
    if (selectedRoleFilter && selectedRoleFilter !== 'all') {
      result = result.filter((p) => p.authorRole === selectedRoleFilter);
    }

    // 4. Search Query Filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const authorMatch = p.authorName?.toLowerCase().includes(q);
        const locationMatch = p.location?.toLowerCase().includes(q);
        const categoryMatch = p.category?.toLowerCase().includes(q);
        return titleMatch || descMatch || authorMatch || locationMatch || categoryMatch;
      });
    }

    // 5. Sorting
    if (sortBy === 'popular') {
      result.sort((a, b) => {
        const scoreA = (a.likes?.length || 0) * 2 + (a.comments?.length || 0) * 3;
        const scoreB = (b.likes?.length || 0) * 2 + (b.comments?.length || 0) * 3;
        return scoreB - scoreA;
      });
    } else {
      // Default latest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [posts, activeView, selectedCategory, selectedRoleFilter, searchQuery, sortBy, currentUser.id]);

  // ── Handlers for CRUD & Interactions ──────────────────────────────────────
  const handleCreatePost = (postData) => {
    try {
      createCommunityPost(postData, currentUser);
      loadPosts();
      showToast(isEn ? 'Post published successfully!' : 'आपकी पोस्ट प्रकाशित हो गई!');
      // Switch to feed or my-posts if not already there
      if (activeView === 'saved' || activeView === 'my-comments') {
        setActiveView('my-posts');
      }
    } catch (err) {
      showToast(err.message || (isEn ? 'Unable to publish post. Please try again.' : 'पोस्ट प्रकाशित करने में असमर्थ।'));
    }
  };

  const handleEditPostSave = (postId, updatedData) => {
    try {
      updateCommunityPost(postId, updatedData, currentUser.id);
      loadPosts();
      showToast(isEn ? 'Post updated successfully!' : 'पोस्ट सफलतापूर्वक अपडेट हो गई!');
      setEditingPost(null);
    } catch (err) {
      showToast(err.message || 'Error updating post');
    }
  };

  const handleDeletePost = (postId) => {
    const confirmed = window.confirm(
      isEn ? 'Are you sure you want to delete this post?' : 'क्या आप वाकई यह पोस्ट हटाना चाहते हैं?'
    );
    if (!confirmed) return;

    try {
      deleteCommunityPost(postId, currentUser.id);
      loadPosts();
      showToast(isEn ? 'Post deleted successfully.' : 'पोस्ट हटा दी गई।');
    } catch (err) {
      showToast(err.message || 'Error deleting post');
    }
  };

  const handleToggleLike = (postId) => {
    try {
      toggleLikePost(postId, currentUser.id);
      loadPosts();
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleToggleSave = (postId) => {
    try {
      const res = toggleSavePost(postId, currentUser.id);
      loadPosts();
      if (res?.hasSaved) {
        showToast(isEn ? 'Post saved to your bookmarks!' : 'पोस्ट सहेज ली गई!');
      } else {
        showToast(isEn ? 'Post removed from saved.' : 'पोस्ट सहेजी गई सूची से हटा दी गई।');
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleAddComment = (postId, text) => {
    addCommentToPost(postId, text, currentUser);
    loadPosts();
  };

  const handleDeleteComment = (postId, commentId) => {
    try {
      deleteCommentFromPost(postId, commentId, currentUser.id);
      loadPosts();
      showToast(isEn ? 'Comment deleted.' : 'टिप्पणी हटा दी गई।');
    } catch (err) {
      showToast(err.message || 'Error deleting comment');
    }
  };

  const handleSelectTrendingTag = (tag, categoryId) => {
    setSearchQuery(tag.replace('#', ''));
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  };

  const clearAllFilters = () => {
    setActiveView('feed');
    setSelectedCategory('all');
    setSelectedRoleFilter('all');
    setSearchQuery('');
    setSortBy('latest');
  };

  const hasActiveFilters =
    activeView !== 'feed' ||
    selectedCategory !== 'all' ||
    selectedRoleFilter !== 'all' ||
    searchQuery.trim().length > 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col lg:flex-row font-sans selection:bg-primary-container selection:text-white">
      {/* ── Left Navigation Portal Sidebar ── */}
      <DashboardSidebar activeNav={activeNav} setActiveNav={setActiveNav} lang={lang} />

      {/* ── Main Canvas ── */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-8">
        <DashboardHeader lang={lang} setLang={setLang} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* ── Header ── */}
          <CommunityHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenCreatePost={() => setIsCreateModalOpen(true)}
            currentUser={currentUser}
            lang={lang}
            totalPostsCount={posts.length}
          />

          {/* ── Mobile Category & Filter Scroller (visible on < lg screens) ── */}
          <div className="lg:hidden space-y-3">
            {/* View Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {[
                { id: 'feed', labelEn: 'All Posts', labelHi: 'सभी पोस्ट' },
                { id: 'my-posts', labelEn: `My Posts (${myPostsCount})`, labelHi: `मेरी पोस्ट (${myPostsCount})` },
                { id: 'saved', labelEn: `Saved (${savedPostsCount})`, labelHi: `सहेजी गई (${savedPostsCount})` },
                { id: 'my-comments', labelEn: `Replies (${myCommentsCount})`, labelHi: `जवाब (${myCommentsCount})` },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActiveView(pill.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    activeView === pill.id
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant border border-outline-variant/30'
                  }`}
                >
                  {isEn ? pill.labelEn : pill.labelHi}
                </button>
              ))}
            </div>

            {/* Category Dropdown & Role Filter for Mobile */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-semibold text-on-surface"
              >
                {COMMUNITY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {isEn ? cat.labelEn : cat.labelHi}
                  </option>
                ))}
              </select>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-semibold text-on-surface"
              >
                <option value="all">{isEn ? 'All Roles' : 'सभी रोल'}</option>
                <option value="farmer">🌾 {isEn ? 'Farmers' : 'किसान'}</option>
                <option value="student">🎓 {isEn ? 'Students' : 'छात्र'}</option>
                <option value="buyer">🛒 {isEn ? 'Buyers' : 'खरीदार'}</option>
                <option value="provider">🚜 {isEn ? 'Providers' : 'प्रदाता'}</option>
              </select>
            </div>
          </div>

          {/* ── 3-Column Desktop Grid Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ── LEFT COLUMN: Categories & Navigation (3 cols) ── */}
            <div className="hidden lg:block lg:col-span-3 sticky top-20">
              <CommunityLeftSidebar
                activeView={activeView}
                setActiveView={setActiveView}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedRoleFilter={selectedRoleFilter}
                setSelectedRoleFilter={setSelectedRoleFilter}
                myPostsCount={myPostsCount}
                savedPostsCount={savedPostsCount}
                myCommentsCount={myCommentsCount}
                lang={lang}
              />
            </div>

            {/* ── CENTER COLUMN: Community Feed (6 cols on XL, 9 on LG) ── */}
            <div className="lg:col-span-9 xl:col-span-6 space-y-4">
              
              {/* Quick Filter Bar: Active Filter Chips & Sort Switcher */}
              <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant/30 flex items-center justify-between gap-3 flex-wrap text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">filter_list</span>
                    <span>{filteredPosts.length} {isEn ? 'Posts' : 'पोस्ट'}</span>
                  </span>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="px-2.5 py-1 rounded-lg bg-surface-container text-primary font-bold hover:bg-primary/10 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                      {isEn ? 'Clear filters' : 'फिल्टर हटाएं'}
                    </button>
                  )}
                </div>

                {/* Sort Toggle */}
                <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setSortBy('latest')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      sortBy === 'latest'
                        ? 'bg-white text-primary shadow-2xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {isEn ? 'Latest' : 'नवीनतम'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('popular')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      sortBy === 'popular'
                        ? 'bg-white text-primary shadow-2xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {isEn ? 'Popular' : 'लोकप्रिय'}
                  </button>
                </div>
              </div>

              {/* Quick Inline Create Post Prompt */}
              <div
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-primary/20 shadow-xs hover:border-primary transition-all cursor-pointer flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20">
                  {currentUser.initials}
                </div>
                <div className="flex-1 bg-surface-container-low py-2.5 px-4 rounded-2xl text-xs sm:text-sm text-on-surface-variant/70 border border-outline-variant/30 group-hover:bg-white group-hover:border-primary/40 transition-colors truncate">
                  {isEn
                    ? `Have a question or update, ${currentUser.name.split(' ')[0]}? Share with community...`
                    : `कोई सवाल या अनुभव साझा करें, ${currentUser.name.split(' ')[0]}...`}
                </div>
                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shrink-0 group-hover:bg-primary-container transition-colors hidden sm:flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>{isEn ? 'Post' : 'लिखें'}</span>
                </button>
              </div>

              {/* ── Loading State ── */}
              {isLoading && (
                <div className="bg-surface-container-lowest rounded-3xl p-12 text-center space-y-3 border border-outline-variant/30">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-on-surface-variant">
                    {isEn ? 'Loading community discussions...' : 'समुदाय चर्चाएं लोड हो रही हैं...'}
                  </p>
                </div>
              )}

              {/* ── API Error State ── */}
              {!isLoading && apiError && (
                <div className="bg-red-50 rounded-3xl p-8 text-center space-y-3 border border-red-200">
                  <span className="material-symbols-outlined text-4xl text-red-600">error</span>
                  <p className="text-sm font-bold text-red-800">{apiError}</p>
                  <button
                    type="button"
                    onClick={loadPosts}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                  >
                    {isEn ? 'Try Again' : 'पुनः प्रयास करें'}
                  </button>
                </div>
              )}

              {/* ── Posts Feed List ── */}
              {!isLoading && !apiError && filteredPosts.length > 0 && (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <CommunityPostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onToggleLike={handleToggleLike}
                      onToggleSave={handleToggleSave}
                      onAddComment={handleAddComment}
                      onDeleteComment={handleDeleteComment}
                      onEditPost={(p) => setEditingPost(p)}
                      onDeletePost={handleDeletePost}
                      lang={lang}
                      onToast={showToast}
                    />
                  ))}
                </div>
              )}

              {/* ── Empty State ── */}
              {!isLoading && !apiError && filteredPosts.length === 0 && (
                <div className="bg-surface-container-lowest rounded-3xl p-10 sm:p-14 text-center space-y-4 border border-outline-variant/30 shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-3xl">
                    🌾
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-on-surface">
                      {searchQuery
                        ? (isEn ? 'No posts found' : 'कोई पोस्ट नहीं मिली')
                        : activeView === 'my-posts'
                        ? (isEn ? 'You haven\'t published any posts yet' : 'आपने अभी तक कोई पोस्ट प्रकाशित नहीं की')
                        : activeView === 'saved'
                        ? (isEn ? 'You have no saved posts' : 'कोई सहेजी गई पोस्ट नहीं है')
                        : activeView === 'my-comments'
                        ? (isEn ? 'No comments or replies yet' : 'कोई टिप्पणी नहीं मिली')
                        : (isEn ? 'No community posts yet. Be the first to start a discussion!' : 'अभी तक कोई चर्चा नहीं है। पहले चर्चा शुरू करें!')}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
                      {searchQuery
                        ? (isEn ? `No results found for "${searchQuery}". Try a different keyword or reset filters.` : `"${searchQuery}" के लिए कोई परिणाम नहीं।`)
                        : (isEn ? 'Ask a crop question, share farming advice, post equipment availability or buyer demand.' : 'फसल प्रश्न पूछें, कृषि सलाह साझा करें, या खरीद मांग पोस्ट करें।')}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="px-4 py-2 rounded-xl border border-outline-variant/60 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        {isEn ? 'Clear Filters' : 'फिल्टर हटाएं'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span>{isEn ? 'Start a Discussion' : 'चर्चा शुरू करें'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN: Trending Topics & Active Members (3 cols) ── */}
            <div className="hidden xl:block xl:col-span-3 sticky top-20">
              <CommunityRightSidebar
                onSelectTrendingTag={handleSelectTrendingTag}
                lang={lang}
              />
            </div>
          </div>

          {/* ── Mobile Right Sidebar Content (Shown below feed on mobile/tablet) ── */}
          <div className="xl:hidden pt-4 space-y-6">
            <CommunityRightSidebar
              onSelectTrendingTag={handleSelectTrendingTag}
              lang={lang}
            />
          </div>
        </main>
      </div>

      {/* ── Mobile Navigation Bar ── */}
      <DashboardMobileNav activeNav="community" setActiveNav={() => {}} lang={lang} />

      {/* ── Create Post Modal ── */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        currentUser={currentUser}
        lang={lang}
      />

      {/* ── Edit Post Modal ── */}
      {editingPost && (
        <EditPostModal
          isOpen={Boolean(editingPost)}
          onClose={() => setEditingPost(null)}
          post={editingPost}
          onSave={handleEditPostSave}
          lang={lang}
        />
      )}

      {/* ── Floating Toast Feedback ── */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn border border-white/10">
          <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
