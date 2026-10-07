import React, { useState } from 'react';
import { communityPosts as initialPosts, translations } from '../data/content';

export default function CommunityView({ lang }) {
  const isEn = lang === 'en';
  const t = translations[lang] || translations.en;

  const [posts, setPosts] = useState(initialPosts);
  const [newQuestion, setNewQuestion] = useState('');
  const [likedPosts, setLikedPosts] = useState({});

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newPostObj = {
      id: Date.now(),
      authorEn: 'Kisan Brother (You)',
      authorHi: 'किसान भाई (आप)',
      locationEn: 'Your Village',
      locationHi: 'आपका गांव',
      timeEn: 'Just now',
      timeHi: 'अभी',
      tagEn: 'Farmer Query',
      tagHi: 'किसान प्रश्न',
      questionEn: newQuestion,
      questionHi: newQuestion,
      expertAnswerEn: 'Thank you for asking! A KVK Agricultural Specialist will answer your question shortly.',
      expertAnswerHi: 'पूछने के लिए धन्यवाद! केवीके कृषि विशेषज्ञ शीघ्र ही आपके प्रश्न का उत्तर देंगे।',
      likes: 1,
      comments: 0,
      isVerifiedExpert: true
    };

    setPosts([newPostObj, ...posts]);
    setNewQuestion('');
  };

  const toggleLike = (id) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[id];
      setPosts((pList) =>
        pList.map((p) =>
          p.id === id ? { ...p, likes: isLiked ? p.likes + 1 : p.likes - 1 } : p
        )
      );
      return { ...prev, [id]: isLiked };
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-secondary-container/60 text-on-secondary-container px-3 py-1 rounded-full font-label-md text-xs font-semibold">
          <span className="material-symbols-outlined text-sm">groups</span>
          {isEn ? 'Kisan Community Forum' : 'किसान ज्ञान केंद्र'}
        </div>
        <h2 className="font-display-lg text-3xl sm:text-4xl font-bold text-on-surface">
          {t.communityTitle}
        </h2>
        <p className="font-body-lg text-on-surface-variant text-base sm:text-lg">
          {t.communitySub}
        </p>
      </div>

      {/* Ask Question Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-xl max-w-3xl mx-auto">
        <h3 className="font-headline-md text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          {isEn ? 'Have a question about your crop?' : 'फसल के संबंध में कोई प्रश्न है?'}
        </h3>

        <form onSubmit={handlePostSubmit} className="space-y-4">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            rows="3"
            placeholder={isEn ? "Type your crop disease or farming query here..." : "अपनी फसल की बीमारी या खेती से जुड़ा सवाल यहाँ लिखें..."}
            className="w-full bg-white border border-outline-variant rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
          ></textarea>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-white px-6 py-3 rounded-full font-label-md transition-all shadow-md active:scale-95 flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-lg">send</span>
              {t.askQuestionBtn}
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {posts.map((post) => (
          <div
            key={post.id}
            className="glass-card rounded-3xl p-6 border border-surface-variant/80 shadow-md hover:shadow-xl transition-all space-y-4"
          >
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-base border border-primary/20">
                  👨‍🌾
                </div>
                <div>
                  <div className="font-bold text-on-surface text-sm">
                    {isEn ? post.authorEn : post.authorHi}
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    {isEn ? post.locationEn : post.locationHi} • {isEn ? post.timeEn : post.timeHi}
                  </div>
                </div>
              </div>
              <span className="bg-surface-container text-primary font-semibold text-xs px-3 py-1 rounded-full border border-surface-variant">
                {isEn ? post.tagEn : post.tagHi}
              </span>
            </div>

            {/* Question text */}
            <p className="font-body-md text-on-surface text-base font-medium leading-relaxed">
              "{isEn ? post.questionEn : post.questionHi}"
            </p>

            {/* Expert Reply Box */}
            <div className="bg-surface-container-low border border-secondary/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-secondary font-bold text-xs">
                <span className="material-symbols-outlined text-base">verified</span>
                {t.expertBadge}
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
                {isEn ? post.expertAnswerEn : post.expertAnswerHi}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-6 pt-2 border-t border-surface-variant/40 text-xs font-semibold text-on-surface-variant">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  likedPosts[post.id] ? 'text-error font-bold' : 'hover:text-primary'
                }`}
              >
                <span className={`material-symbols-outlined text-lg ${likedPosts[post.id] ? 'material-fill' : ''}`}>
                  favorite
                </span>
                <span>{post.likes} {t.likes}</span>
              </button>

              <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">chat_bubble</span>
                <span>{post.comments} {t.comments}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
