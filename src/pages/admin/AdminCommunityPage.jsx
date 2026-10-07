import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import {
  getAdminCommunityPosts,
  updatePostStatus,
  deletePost,
  restorePost,
  deletePostComment,
} from '../../services/adminService';

export default function AdminCommunityPage() {
  const [lang, setLang] = useState('en');
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inspectPost, setInspectPost] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDestructive: false,
  });

  const loadPosts = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const res = getAdminCommunityPosts({
        search: searchQuery,
        category: selectedCategory,
        status: selectedStatus,
        page,
        limit,
      });
      setPosts(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching community posts:', err);
      setError(err.message || 'Unable to load community posts.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedStatus, page, limit]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleStatusChange = (post, status) => {
    setConfirmModal({
      isOpen: true,
      title: `${status} Post`,
      message: `Are you sure you want to change the status of this post to "${status}"?`,
      isDestructive: status === 'Hidden',
      onConfirm: () => {
        updatePostStatus(post.id, status);
        setConfirmModal({ isOpen: false });
        loadPosts();
      },
    });
  };

  const handleDelete = (post) => {
    setConfirmModal({
      isOpen: true,
      title: 'Permanently Delete Community Post',
      message: `Delete post "${post.title}"? This action cannot be undone.`,
      isDestructive: true,
      onConfirm: () => {
        deletePost(post.id);
        setConfirmModal({ isOpen: false });
        loadPosts();
      },
    });
  };

  const handleDeleteComment = (postId, commentId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Inappropriate Comment',
      message: 'Are you sure you want to remove this comment?',
      isDestructive: true,
      onConfirm: () => {
        deletePostComment(postId, commentId);
        setConfirmModal({ isOpen: false });
        if (inspectPost && inspectPost.id === postId) {
          setInspectPost({
            ...inspectPost,
            comments: (inspectPost.comments || []).filter((c) => c.id !== commentId),
          });
        }
        loadPosts();
      },
    });
  };

  const categoryPills = [
    { id: 'all', label: 'All Topics' },
    { id: 'Pest Alert', label: 'Pest Alerts' },
    { id: 'Organic Farming', label: 'Organic Farming' },
    { id: 'Crop Advisory', label: 'Crop Advisory' },
    { id: 'Machinery', label: 'Machinery' },
  ];

  const columns = [
    {
      header: 'Author',
      key: 'author',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
            {p.authorName?.slice(0, 2).toUpperCase() || 'FH'}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-on-surface truncate">{p.authorName}</div>
            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-surface-container text-on-surface-variant capitalize">
              {p.authorRole || 'Farmer'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Post Topic & Content',
      key: 'title',
      render: (p) => (
        <div className="min-w-0 max-w-[280px]">
          <div className="font-bold text-on-surface truncate text-xs sm:text-sm">{p.title}</div>
          <div className="text-xs text-on-surface-variant line-clamp-1">{p.description}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (p) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface">
          {p.category || 'General'}
        </span>
      ),
    },
    {
      header: 'Activity',
      key: 'activity',
      render: (p) => (
        <div className="text-xs text-on-surface-variant flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-primary">
            <span className="material-symbols-outlined text-[15px]">chat_bubble</span>
            {p.comments?.length || p.repliesCount || 0}
          </span>
          <span>•</span>
          <span className="font-mono text-[11px] text-outline">{p.timeAgo || 'Recent'}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (p) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            p.status === 'Hidden'
              ? 'bg-amber-50 text-amber-800 border-amber-200/60'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
          }`}
        >
          {p.status || 'Active'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setInspectPost(p)}
            className="p-1.5 rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer"
            title="Inspect Post & Comments"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          {p.status === 'Hidden' ? (
            <button
              type="button"
              onClick={() => handleStatusChange(p, 'Active')}
              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              title="Restore Post"
            >
              <span className="material-symbols-outlined text-[18px]">undo</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleStatusChange(p, 'Hidden')}
              className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
              title="Hide Post from Forum"
            >
              <span className="material-symbols-outlined text-[18px]">visibility_off</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => handleDelete(p)}
            className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors cursor-pointer"
            title="Delete Post"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Community Forum Moderation"
      subtitle="Moderate farmer discussions, crop questions, pest queries, and farmer community posts."
      lang={lang}
      setLang={setLang}
    >
      {/* Category Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {categoryPills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => {
                setSelectedCategory(pill.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === pill.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={posts}
        keyField="id"
        isLoading={isLoading}
        error={error}
        onRetry={loadPosts}
        emptyMessage="No community discussions found."
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        searchPlaceholder="Search community posts by title, author, keyword..."
        pagination={{
          page,
          totalPages,
          total,
          limit,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* ─── Modal: Inspect Post & Moderated Comments ──────────────────────────── */}
      {inspectPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-outline-variant/40 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                  {inspectPost.authorName?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">{inspectPost.title}</h3>
                  <p className="text-xs text-on-surface-variant">By {inspectPost.authorName} ({inspectPost.authorRole})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectPost(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-xs text-on-surface leading-relaxed">
              {inspectPost.description}
            </div>

            {/* Comments List */}
            <div className="space-y-2 pt-1">
              <h4 className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">chat_bubble</span>
                Comments & Replies ({inspectPost.comments?.length || 0})
              </h4>

              {(!inspectPost.comments || inspectPost.comments.length === 0) ? (
                <p className="text-xs text-on-surface-variant py-4 text-center">No comments on this discussion.</p>
              ) : (
                inspectPost.comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 bg-surface-container-low/70 rounded-2xl border border-outline-variant/20 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-on-surface">{c.authorName || 'Community Member'}</div>
                      <p className="text-on-surface-variant mt-0.5">{c.text || c.comment}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(inspectPost.id, c.id)}
                      className="p-1 rounded-lg text-error hover:bg-error/10 shrink-0 transition-colors cursor-pointer"
                      title="Remove Comment"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setInspectPost(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-on-surface bg-white border border-outline-variant/50 hover:bg-surface-container transition-colors shadow-2xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false })}
      />
    </AdminLayout>
  );
}
