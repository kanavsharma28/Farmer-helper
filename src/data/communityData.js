// ─────────────────────────────────────────────────────────────────────────────
// Farmer Helper - Community Data & LocalStorage Persistence Architecture
// Supports all 4 roles: Farmer, Student, Buyer, Resource Provider
// ─────────────────────────────────────────────────────────────────────────────

export const COMMUNITY_STORAGE_KEY = 'farmer_helper_community_posts';
export const COMMUNITY_UPDATE_EVENT = 'farmer_helper_community_updated';

// ── Categories List ──────────────────────────────────────────────────────────
export const COMMUNITY_CATEGORIES = [
  { id: 'all', emoji: '🌐', labelEn: 'All Discussions', labelHi: 'सभी चर्चाएं' },
  { id: 'crops', emoji: '🌾', labelEn: 'Farming & Crops', labelHi: 'खेती और फसलें' },
  { id: 'disease', emoji: '🐛', labelEn: 'Crop Disease & Protection', labelHi: 'फसल रोग और सुरक्षा' },
  { id: 'equipment', emoji: '🚜', labelEn: 'Equipment & Resources', labelHi: 'उपकरण व साधन' },
  { id: 'market', emoji: '💰', labelEn: 'Market & Buyers', labelHi: 'बाजार व खरीदार' },
  { id: 'storage', emoji: '❄️', labelEn: 'Storage & Cold Storage', labelHi: 'भंडारण व कोल्ड स्टोरेज' },
  { id: 'finance', emoji: '📈', labelEn: 'Crop Profit & Finance', labelHi: 'फसल मुनाफा व वित्त' },
  { id: 'internship', emoji: '🎓', labelEn: 'Internship & Training', labelHi: 'इंटर्नशिप व प्रशिक्षण' },
  { id: 'tips', emoji: '💡', labelEn: 'Agriculture Tips', labelHi: 'कृषि सुझाव' },
  { id: 'schemes', emoji: '📰', labelEn: 'Government Schemes', labelHi: 'सरकारी योजनाएं' },
];

// ── Role-Aware Category Suggestions for Create Post ─────────────────────────
export const ROLE_CATEGORY_SUGGESTIONS = {
  farmer: [
    { id: 'crops', labelEn: 'Farming & Crops', emoji: '🌾' },
    { id: 'disease', labelEn: 'Crop Disease & Protection', emoji: '🐛' },
    { id: 'equipment', labelEn: 'Equipment & Resources', emoji: '🚜' },
    { id: 'market', labelEn: 'Market & Buyers', emoji: '💰' },
    { id: 'storage', labelEn: 'Storage', emoji: '❄️' },
    { id: 'schemes', labelEn: 'Government Schemes', emoji: '📰' },
  ],
  student: [
    { id: 'internship', labelEn: 'Internship & Training', emoji: '🎓' },
    { id: 'tips', labelEn: 'Agriculture Learning & Tips', emoji: '💡' },
    { id: 'crops', labelEn: 'Farming & Crops', emoji: '🌾' },
    { id: 'finance', labelEn: 'Crop Profit & Tech', emoji: '📈' },
  ],
  buyer: [
    { id: 'market', labelEn: 'Market & Buyers', emoji: '💰' },
    { id: 'crops', labelEn: 'Crop Demand & Produce', emoji: '🌾' },
    { id: 'storage', labelEn: 'Storage & Logistics', emoji: '❄️' },
    { id: 'tips', labelEn: 'Quality Requirements', emoji: '💡' },
  ],
  provider: [
    { id: 'equipment', labelEn: 'Equipment & Resources', emoji: '🚜' },
    { id: 'tips', labelEn: 'Maintenance & Service Tips', emoji: '💡' },
    { id: 'crops', labelEn: 'Farming Support', emoji: '🌾' },
    { id: 'market', labelEn: 'Resource Logistics', emoji: '💰' },
  ],
};

// ── Trending Topics ──────────────────────────────────────────────────────────
export const TRENDING_TOPICS = [
  { tag: '#WheatFarming', count: '1.4k posts', categoryId: 'crops' },
  { tag: '#CropDisease', count: '980 posts', categoryId: 'disease' },
  { tag: '#FarmerMarket', count: '850 posts', categoryId: 'market' },
  { tag: '#AgricultureInternship', count: '620 posts', categoryId: 'internship' },
  { tag: '#TractorSharing', count: '540 posts', categoryId: 'equipment' },
  { tag: '#ColdStorage', count: '410 posts', categoryId: 'storage' },
  { tag: '#SolarPumpScheme', count: '390 posts', categoryId: 'schemes' },
];

// ── Active Community Members ─────────────────────────────────────────────────
export const ACTIVE_COMMUNITY_MEMBERS = [
  {
    id: 'user_farmer_01',
    name: 'Rajesh Kumar',
    role: 'farmer',
    initials: 'RK',
    badgeText: 'Farmer',
    location: 'Meerut, UP',
    contributions: '24 posts • 82 answers',
  },
  {
    id: 'user_student_01',
    name: 'Aman Verma',
    role: 'student',
    initials: 'AV',
    badgeText: 'Student',
    location: 'GBPUAT Pantnagar',
    contributions: '18 research notes • 45 answers',
  },
  {
    id: 'user_buyer_01',
    name: 'Vikram Sharma',
    role: 'buyer',
    initials: 'VS',
    badgeText: 'Buyer',
    location: 'Kisan Mandi Traders',
    contributions: '12 mandi updates • 31 quotes',
  },
  {
    id: 'user_provider_01',
    name: 'Sardar Gurpreet Singh',
    role: 'provider',
    initials: 'GS',
    badgeText: 'Resource Provider',
    location: 'Krishi Seva Center',
    contributions: '15 listings • 39 consultations',
  },
  {
    id: 'expert_agri_01',
    name: 'Dr. R.S. Hooda',
    role: 'farmer',
    initials: 'RH',
    badgeText: 'KVK Agronomist',
    location: 'KVK Western UP',
    contributions: '110 verified solutions',
  },
];

// ── Initial Seed Posts Across All 4 Roles ───────────────────────────────────
export const INITIAL_COMMUNITY_POSTS = [
  {
    id: 'post_001',
    authorId: 'user_farmer_01',
    authorName: 'Rajesh Kumar',
    authorRole: 'farmer',
    authorInitials: 'RK',
    authorLocation: 'Meerut, Uttar Pradesh',
    title: 'How can I control early yellow rust spots appearing on Sharbati Wheat?',
    description: 'Noticed slight yellow powder streaks on leaf tips in our 5-acre farm after the recent foggy morning dew. Looking for verified spray advice or bio-fungicide options that work quickly before the infection spreads to adjacent plots.',
    category: 'disease',
    location: 'Meerut, UP',
    image: '',
    likes: ['user_student_01', 'user_provider_01', 'user_buyer_01', 'expert_agri_01'],
    savedBy: ['user_student_01'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: 'comment_001_1',
        postId: 'post_001',
        authorId: 'user_student_01',
        authorName: 'Aman Verma',
        authorRole: 'student',
        authorInitials: 'AV',
        text: 'Namaste Rajesh ji! As per ICAR plant pathology advisory, 1 ml Propiconazole 25% EC (Tilt) per liter of water is highly effective when sprayed on a clear sunny afternoon. Ensure complete leaf coverage.',
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      },
      {
        id: 'comment_001_2',
        postId: 'post_001',
        authorId: 'user_provider_01',
        authorName: 'Sardar Gurpreet Singh',
        authorRole: 'provider',
        authorInitials: 'GS',
        text: 'Brother Rajesh, we have 2 drone sprayers stationed in Meerut rural right now. It can cover your entire 5 acres in 25 minutes with precise misting. Message me if you need immediate assistance.',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'post_002',
    authorId: 'user_student_01',
    authorName: 'Aman Verma',
    authorRole: 'student',
    authorInitials: 'AV',
    authorLocation: 'Pantnagar / Meerut',
    title: 'Soil Microbiome & Precision Drip Irrigation Field Research Findings',
    description: 'We recently concluded a 4-week on-field trial comparing root zone microbiome health under subsurface drip irrigation versus conventional flood irrigation. Observed 32% freshwater savings and 18% higher nitrogen uptake in organic wheat plots.',
    category: 'internship',
    location: 'Pantnagar Agri Farm',
    image: '',
    likes: ['user_farmer_01', 'user_buyer_01'],
    savedBy: ['user_farmer_01'],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: 'comment_002_1',
        postId: 'post_002',
        authorId: 'user_farmer_01',
        authorName: 'Rajesh Kumar',
        authorRole: 'farmer',
        authorInitials: 'RK',
        text: 'Very encouraging research Aman beta! Does this subsurface drip also prevent weed germination in the inter-row space? Would love to test it in our next season.',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'comment_002_2',
        postId: 'post_002',
        authorId: 'user_student_01',
        authorName: 'Aman Verma',
        authorRole: 'student',
        authorInitials: 'AV',
        text: 'Yes Rajesh ji! Because topsoil stays dry, weed seed germination was reduced by 60% compared to conventional flooding.',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'post_003',
    authorId: 'user_buyer_01',
    authorName: 'Vikram Sharma',
    authorRole: 'buyer',
    authorInitials: 'VS',
    authorLocation: 'Kisan Mandi Agro Traders, Meerut',
    title: 'Direct Farm-Gate Procurement: Buying 2,500 Quintals of Sharbati Wheat & Basmati 1121',
    description: 'Kisan Mandi Agro Traders is now contracting direct purchase for 2,500 quintals of Sharbati Wheat (Moisture < 12%) and Pusa 1121 Basmati. Immediate spot payment via RTGS within 24 hours of on-site grain moisture inspection. Transport arranged from farm gate for orders > 50 quintals.',
    category: 'market',
    location: 'Khanna Mandi & Western UP',
    image: '',
    likes: ['user_farmer_01', 'user_provider_01'],
    savedBy: ['user_farmer_01', 'user_provider_01'],
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14h ago
    updatedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: 'comment_003_1',
        postId: 'post_003',
        authorId: 'user_farmer_01',
        authorName: 'Rajesh Kumar',
        authorRole: 'farmer',
        authorInitials: 'RK',
        text: 'Vikram ji, what is the offered spot rate per quintal for moisture below 11% for certified Sharbati grain?',
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'comment_003_2',
        postId: 'post_003',
        authorId: 'user_buyer_01',
        authorName: 'Vikram Sharma',
        authorRole: 'buyer',
        authorInitials: 'VS',
        text: 'Rajesh ji, today spot quote is ₹2,480/quintal for Grade-A clean lot with immediate weighing at farm.',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'post_004',
    authorId: 'user_provider_01',
    authorName: 'Sardar Gurpreet Singh',
    authorRole: 'provider',
    authorInitials: 'GS',
    authorLocation: 'Krishi Seva Machine Center',
    title: 'High-Capacity Combine Harvesters & Laser Land Levelers Available for Rabi Window',
    description: 'Getting ready for the upcoming wheat harvesting window. We have 3 John Deere combine harvesters and 2 GPS-guided laser land levelers serviced, greased, and ready with trained drivers. Offering group booking discounts for farmer clusters.',
    category: 'equipment',
    location: 'Meerut Rural, UP',
    image: '',
    likes: ['user_farmer_01', 'user_buyer_01'],
    savedBy: ['user_farmer_01'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1d ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      {
        id: 'comment_004_1',
        postId: 'post_004',
        authorId: 'user_farmer_01',
        authorName: 'Rajesh Kumar',
        authorRole: 'farmer',
        authorInitials: 'RK',
        text: 'Sardar ji, are advance dates available for the last week of March? Our village cluster has about 40 acres ready at once.',
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'comment_004_2',
        postId: 'post_004',
        authorId: 'user_provider_01',
        authorName: 'Sardar Gurpreet Singh',
        authorRole: 'provider',
        authorInitials: 'GS',
        text: 'Ji bilkul! For 40 acres cluster we give 10% discount and dedicate 2 machines exclusively to avoid any weather risk.',
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'post_005',
    authorId: 'user_farmer_01',
    authorName: 'Rajesh Kumar',
    authorRole: 'farmer',
    authorInitials: 'RK',
    authorLocation: 'Meerut, Uttar Pradesh',
    title: 'PM-KUSUM Solar Pump Subsidy 2026: Application Guide & Step-by-Step Experience',
    description: 'Sharing my personal experience getting a 60% capital subsidy on a 7.5 HP AC Solar Agricultural Pump under PM-KUSUM Component-B. Required documents: Land Khatauni, Aadhaar, bank passbook, and electricity discom NOC. The online portal approval took 22 days.',
    category: 'schemes',
    location: 'Western UP',
    image: '',
    likes: ['user_student_01', 'user_provider_01', 'user_buyer_01'],
    savedBy: ['user_student_01', 'user_provider_01'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2d ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [],
  },
  {
    id: 'post_006',
    authorId: 'user_buyer_01',
    authorName: 'Vikram Sharma',
    authorRole: 'buyer',
    authorInitials: 'VS',
    authorLocation: 'Kisan Mandi Agro Traders',
    title: 'Cold Storage & Hermetic Bag Solutions to Minimize Potato & Onion Spoilage',
    description: 'Summer heat is approaching and potato seed sprout rot is a major issue in non-climate warehouses. Recommended to store at 2°C–4°C with 90% relative humidity. For smaller lots, hermetic Purdue triple-layer bags prevent sprout loss without chemical sprays.',
    category: 'storage',
    location: 'Meerut & Hapur Belt',
    image: '',
    likes: ['user_farmer_01'],
    savedBy: ['user_farmer_01'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3d ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [],
  },
];

// ── LocalStorage Helpers ─────────────────────────────────────────────────────

export function getStoredCommunityPosts() {
  try {
    const raw = localStorage.getItem(COMMUNITY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_POSTS));
      return INITIAL_COMMUNITY_POSTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_POSTS));
      return INITIAL_COMMUNITY_POSTS;
    }
    return parsed;
  } catch (err) {
    console.error('Error loading community posts from localStorage:', err);
    return INITIAL_COMMUNITY_POSTS;
  }
}

export function saveStoredCommunityPosts(posts) {
  try {
    localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(posts));
    window.dispatchEvent(new CustomEvent(COMMUNITY_UPDATE_EVENT, { detail: { posts } }));
  } catch (err) {
    console.error('Error saving community posts to localStorage:', err);
  }
}

// ── CRUD and Interaction Operations ──────────────────────────────────────────

export function createCommunityPost(postData, currentUser) {
  if (!postData.title?.trim() || !postData.description?.trim() || !postData.category) {
    throw new Error('Title, description and category are required.');
  }

  const posts = getStoredCommunityPosts();
  const newPost = {
    id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    authorId: currentUser?.id || 'anonymous_user',
    authorName: currentUser?.name || 'Community Member',
    authorRole: currentUser?.role || 'farmer',
    authorInitials: currentUser?.initials || 'FH',
    authorLocation: currentUser?.location || '',
    title: postData.title.trim(),
    description: postData.description.trim(),
    category: postData.category,
    location: postData.location?.trim() || currentUser?.location || '',
    image: postData.image || '',
    likes: [],
    savedBy: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
  };

  const updatedPosts = [newPost, ...posts];
  saveStoredCommunityPosts(updatedPosts);
  return newPost;
}

export function updateCommunityPost(postId, updatedData, currentUserId) {
  const posts = getStoredCommunityPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) {
    throw new Error('Post not found.');
  }

  const existingPost = posts[index];
  if (existingPost.authorId !== currentUserId) {
    throw new Error('Unauthorized: You can only edit your own posts.');
  }

  const updatedPost = {
    ...existingPost,
    title: updatedData.title?.trim() || existingPost.title,
    description: updatedData.description?.trim() || existingPost.description,
    category: updatedData.category || existingPost.category,
    location: updatedData.location !== undefined ? updatedData.location : existingPost.location,
    image: updatedData.image !== undefined ? updatedData.image : existingPost.image,
    updatedAt: new Date().toISOString(),
  };

  posts[index] = updatedPost;
  saveStoredCommunityPosts(posts);
  return updatedPost;
}

export function deleteCommunityPost(postId, currentUserId) {
  const posts = getStoredCommunityPosts();
  const existingPost = posts.find((p) => p.id === postId);
  if (!existingPost) {
    throw new Error('Post not found.');
  }

  if (existingPost.authorId !== currentUserId) {
    throw new Error('Unauthorized: You can only delete your own posts.');
  }

  const updatedPosts = posts.filter((p) => p.id !== postId);
  saveStoredCommunityPosts(updatedPosts);
  return true;
}

export function toggleLikePost(postId, currentUserId) {
  if (!currentUserId) return null;
  const posts = getStoredCommunityPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return null;

  const post = posts[index];
  const likes = Array.isArray(post.likes) ? [...post.likes] : [];
  const hasLiked = likes.includes(currentUserId);

  const updatedLikes = hasLiked
    ? likes.filter((id) => id !== currentUserId)
    : [...likes, currentUserId];

  post.likes = updatedLikes;
  posts[index] = { ...post };
  saveStoredCommunityPosts(posts);
  return { hasLiked: !hasLiked, likesCount: updatedLikes.length };
}

export function toggleSavePost(postId, currentUserId) {
  if (!currentUserId) return null;
  const posts = getStoredCommunityPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return null;

  const post = posts[index];
  const savedBy = Array.isArray(post.savedBy) ? [...post.savedBy] : [];
  const hasSaved = savedBy.includes(currentUserId);

  const updatedSaved = hasSaved
    ? savedBy.filter((id) => id !== currentUserId)
    : [...savedBy, currentUserId];

  post.savedBy = updatedSaved;
  posts[index] = { ...post };
  saveStoredCommunityPosts(posts);
  return { hasSaved: !hasSaved };
}

export function addCommentToPost(postId, commentText, currentUser) {
  if (!commentText?.trim()) {
    throw new Error('Comment text cannot be empty.');
  }

  const posts = getStoredCommunityPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) {
    throw new Error('Post not found.');
  }

  const newComment = {
    id: `comment_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    postId,
    authorId: currentUser?.id || 'anonymous_user',
    authorName: currentUser?.name || 'Community Member',
    authorRole: currentUser?.role || 'farmer',
    authorInitials: currentUser?.initials || 'FH',
    text: commentText.trim(),
    createdAt: new Date().toISOString(),
  };

  const post = posts[index];
  post.comments = [...(post.comments || []), newComment];
  posts[index] = { ...post };
  saveStoredCommunityPosts(posts);
  return newComment;
}

export function deleteCommentFromPost(postId, commentId, currentUserId) {
  const posts = getStoredCommunityPosts();
  const postIndex = posts.findIndex((p) => p.id === postId);
  if (postIndex === -1) return false;

  const post = posts[postIndex];
  const comment = (post.comments || []).find((c) => c.id === commentId);
  if (!comment) return false;

  // Only comment owner or post owner can delete comment
  if (comment.authorId !== currentUserId && post.authorId !== currentUserId) {
    throw new Error('Unauthorized: You can only delete your own comments.');
  }

  post.comments = post.comments.filter((c) => c.id !== commentId);
  posts[postIndex] = { ...post };
  saveStoredCommunityPosts(posts);
  return true;
}

// ── Time Formatter Helper ────────────────────────────────────────────────────
export function formatTimeAgo(dateString, isEn = true) {
  try {
    const past = new Date(dateString).getTime();
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - past) / 1000));

    if (diffSec < 60) {
      return isEn ? 'Just now' : 'अभी';
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return isEn ? `${diffMin}m ago` : `${diffMin} मिनट पहले`;
    }
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) {
      return isEn ? `${diffHr}h ago` : `${diffHr} घंटे पहले`;
    }
    const diffDays = Math.floor(diffHr / 24);
    if (diffDays < 7) {
      return isEn ? `${diffDays}d ago` : `${diffDays} दिन पहले`;
    }
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) {
      return isEn ? `${diffWeeks}w ago` : `${diffWeeks} हफ्ते पहले`;
    }
    return new Date(dateString).toLocaleDateString();
  } catch {
    return isEn ? 'Recently' : 'हाल ही में';
  }
}
