import React, { useState } from 'react';
import { ROLE_LABELS } from '../../data/navigationConfig';
import { COMMUNITY_CATEGORIES, formatTimeAgo } from '../../data/communityData';

export default function CommunityPostCard({
  post,
  currentUser,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onDeleteComment,
  onEditPost,
  onDeletePost,
  lang = 'en',
  onToast,
}) {
  const isEn = lang === 'en';
  const isAuthor = currentUser?.id && post.authorId === currentUser.id;

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const hasLiked = currentUser?.id && Array.isArray(post.likes) && post.likes.includes(currentUser.id);
  const hasSaved = currentUser?.id && Array.isArray(post.savedBy) && post.savedBy.includes(currentUser.id);
  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
  const commentsList = Array.isArray(post.comments) ? post.comments : [];
  const commentsCount = commentsList.length;

  const authorRoleConfig = ROLE_LABELS[post.authorRole] || ROLE_LABELS.farmer;
  const categoryConfig = COMMUNITY_CATEGORIES.find((c) => c.id === post.category) || {
    id: post.category,
    emoji: '🌾',
    labelEn: post.category,
    labelHi: post.category,
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      onAddComment(post.id, commentText);
      setCommentText('');
      if (onToast) {
        onToast(isEn ? 'Comment posted successfully!' : 'टिप्पणी सफलतापूर्वक जोड़ी गई!');
      }
    } catch (err) {
      if (onToast) {
        onToast(err.message || 'Error posting comment');
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/community#${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      if (onToast) {
        onToast(isEn ? 'Post link copied to clipboard!' : 'पोस्ट लिंक कॉपी किया गया!');
      }
    } else {
      if (onToast) {
        onToast(isEn ? `Share: ${url}` : `साझा करें: ${url}`);
      }
    }
    setShowMenu(false);
  };

  const handleReport = () => {
    setShowMenu(false);
    if (onToast) {
      onToast(isEn ? 'Thank you. Post flagged for moderation.' : 'धन्यवाद। समीक्षा के लिए पोस्ट रिपोर्ट की गई।');
    }
  };

  return (
    <article
      id={post.id}
      className="bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-outline-variant/30 shadow-xs hover:shadow-sm transition-all duration-200 space-y-4"
    >
      {/* ── Author Header & Meta ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with role-colored outline */}
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs border-2 ${
              post.authorRole === 'student'
                ? 'bg-blue-50 text-blue-700 border-blue-400'
                : post.authorRole === 'buyer'
                ? 'bg-amber-50 text-amber-800 border-amber-400'
                : post.authorRole === 'provider'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                : 'bg-green-50 text-primary border-primary'
            }`}
          >
            {post.authorInitials || 'FH'}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-on-surface truncate">
                {post.authorName}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${authorRoleConfig.badgeBg} ${authorRoleConfig.badgeText} border-current/20`}
              >
                <span className="material-symbols-outlined text-[13px] leading-none">
                  {authorRoleConfig.icon}
                </span>
                <span>{isEn ? authorRoleConfig.en : authorRoleConfig.hi}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-on-surface-variant/80 mt-0.5 flex-wrap">
              <span>{formatTimeAgo(post.createdAt, isEn)}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── More Options Dropdown ── */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Options"
          >
            <span className="material-symbols-outlined text-lg">more_vert</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-9 w-40 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/40 py-1.5 z-20 text-xs font-semibold">
              {isAuthor ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onEditPost(post);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    {isEn ? 'Edit Post' : 'संपादित करें'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onDeletePost(post.id);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-red-50 text-red-600"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    {isEn ? 'Delete Post' : 'हटाएं'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleReport}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  {isEn ? 'Report Post' : 'रिपोर्ट करें'}
                </button>
              )}
              <button
                type="button"
                onClick={handleShare}
                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container text-on-surface border-t border-outline-variant/20 mt-1 pt-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                {isEn ? 'Share Link' : 'लिंक साझा करें'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Category Badge ── */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-container-low border border-outline-variant/30 text-on-surface">
          <span>{categoryConfig.emoji}</span>
          <span>{isEn ? categoryConfig.labelEn : categoryConfig.labelHi}</span>
        </span>
      </div>

      {/* ── Post Content: Title & Description ── */}
      <div className="space-y-2">
        <h3 className="font-bold text-base sm:text-lg text-on-surface leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-on-surface-variant whitespace-pre-line leading-relaxed">
          {post.description}
        </p>
      </div>

      {/* Optional Post Image */}
      {post.image && (
        <div className="rounded-2xl overflow-hidden border border-outline-variant/30 max-h-80 bg-surface-container-low">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto object-cover max-h-80"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* ── Interaction Buttons: Like, Comment, Save, Share ── */}
      <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2 text-xs font-semibold">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like Button */}
          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              hasLiked
                ? 'bg-red-50 text-red-600 font-bold border border-red-200'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] transition-transform active:scale-125 ${
                hasLiked ? 'text-red-600 font-variation-fill' : ''
              }`}
            >
              favorite
            </span>
            <span>{likesCount}</span>
            <span className="hidden sm:inline">{isEn ? 'Likes' : 'पसंद'}</span>
          </button>

          {/* Comment Button */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              showComments
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            <span>{commentsCount}</span>
            <span className="hidden sm:inline">{isEn ? 'Comments' : 'टिप्पणियां'}</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={() => onToggleSave(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              hasSaved
                ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
            title={hasSaved ? 'Remove from Saved' : 'Save Post'}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                hasSaved ? 'text-amber-700 font-variation-fill' : ''
              }`}
            >
              bookmark
            </span>
            <span className="hidden sm:inline">{hasSaved ? (isEn ? 'Saved' : 'सहेजा') : (isEn ? 'Save' : 'सहेजें')}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          title="Share post"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          <span className="hidden sm:inline">{isEn ? 'Share' : 'साझा'}</span>
        </button>
      </div>

      {/* ── Expandable Comments Section ── */}
      {showComments && (
        <div className="pt-3 border-t border-outline-variant/20 space-y-4 animate-fadeIn">
          {/* Comments List */}
          {commentsList.length > 0 ? (
            <div className="space-y-3">
              {commentsList.map((comment) => {
                const commentRole = ROLE_LABELS[comment.authorRole] || ROLE_LABELS.farmer;
                const isCommentAuthor = currentUser?.id && comment.authorId === currentUser.id;

                return (
                  <div
                    key={comment.id}
                    className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                          {comment.authorInitials || 'FH'}
                        </div>
                        <span className="font-bold text-on-surface">{comment.authorName}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${commentRole.badgeBg} ${commentRole.badgeText}`}
                        >
                          {isEn ? commentRole.en : commentRole.hi}
                        </span>
                        <span className="text-on-surface-variant/70 text-[10px]">
                          {formatTimeAgo(comment.createdAt, isEn)}
                        </span>
                      </div>

                      {/* Delete comment if author or post owner */}
                      {(isCommentAuthor || isAuthor) && (
                        <button
                          type="button"
                          onClick={() => onDeleteComment(post.id, comment.id)}
                          className="text-outline hover:text-red-600 transition-colors p-1"
                          title="Delete comment"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      )}
                    </div>

                    <p className="text-on-surface-variant leading-relaxed pl-8">
                      {comment.text}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant/70 text-center py-2">
              {isEn ? 'No comments yet. Be the first to reply!' : 'अभी तक कोई टिप्पणी नहीं है। पहले उत्तरदाता बनें!'}
            </p>
          )}

          {/* Comment Input Composer */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                isEn
                  ? `Reply as ${currentUser?.name || 'User'} (${authorRoleConfig.en})...`
                  : `जवाब लिखें (${currentUser?.name || 'उपयोगकर्ता'})...`
              }
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !commentText.trim()}
              className="px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs shadow-xs hover:bg-primary-container disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span className="hidden sm:inline">{isEn ? 'Post' : 'भेजें'}</span>
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
