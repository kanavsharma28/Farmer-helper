// Universal in-app chat data and conversations for Farmer Helper
// Supports all 4 roles: Farmer, Student, Buyer, Resource Provider
// Any role can communicate two-way with any other role.

export const QUICK_CHAT_SUGGESTIONS = {
  student: [
    'Hello, I am interested in this internship opportunity.',
    'I have completed my 2nd year of B.Sc Agriculture.',
    'Is on-farm accommodation and meals provided?',
    'What are the daily field timings and working hours?',
    'When does the training batch commence?'
  ],
  farmer: [
    'Hello, please tell me about your experience.',
    'Hello, thank you for your interest in our farm.',
    'Are you available for a brief telephonic interview tomorrow?',
    'Hostel and meals are fully provided on our farm premises.',
    'Please review the required tools and field schedule.'
  ],
  buyer: [
    'Namaste! What is the available quantity and expected price per quintal?',
    'Can you provide photos of the harvest lot and moisture level?',
    'We offer same-day payment on mandi arrival and weighing.',
    'Can you arrange delivery to our warehouse in Meerut?',
    'We are ready to place a bulk purchase order.'
  ],
  provider: [
    'Namaste! The machinery is fully serviced and field-ready.',
    'Our hourly rental includes a skilled driver and diesel options.',
    'We can dispatch the tractor tomorrow morning by 6:00 AM.',
    'Please share your exact village location for transport estimation.',
    'Booking confirmed. Feel free to call us for dispatch coordination.'
  ]
};

// Preset Contacts for Direct Chat discovery
export const PRESET_ROLE_CONTACTS = [
  {
    id: 'user_farmer_01',
    userId: 'user_farmer_01',
    name: 'Rajesh Kumar',
    role: 'farmer',
    roleLabelEn: 'Farmer',
    roleLabelHi: 'किसान',
    phone: '9876543210',
    email: 'rajesh.kumar@farmerhelper.in',
    location: 'Meerut, Uttar Pradesh',
    farmName: 'Rajesh Model Farm & KisanVikas'
  },
  {
    id: 'user_student_01',
    userId: 'user_student_01',
    name: 'Aman Verma',
    role: 'student',
    roleLabelEn: 'Student',
    roleLabelHi: 'छात्र',
    phone: '9812345678',
    email: 'aman.verma@agriuni.ac.in',
    location: 'Pantnagar / Meerut',
    college: 'GB Pant University of Agriculture'
  },
  {
    id: 'user_buyer_01',
    userId: 'user_buyer_01',
    name: 'Vikram Sharma',
    businessName: 'Kisan Mandi Agro Traders',
    role: 'buyer',
    roleLabelEn: 'Buyer',
    roleLabelHi: 'खरीदार',
    phone: '9988776655',
    email: 'vikram@kisanmanditraders.com',
    location: 'Khanna Mandi / Meerut'
  },
  {
    id: 'user_provider_01',
    userId: 'user_provider_01',
    name: 'Sardar Gurpreet Singh',
    businessName: 'Krishi Seva Machine Center',
    role: 'provider',
    roleLabelEn: 'Resource Provider',
    roleLabelHi: 'संसाधन प्रदाता',
    phone: '9788665544',
    email: 'gurpreet@krishisevakendra.in',
    location: 'Meerut Rural, UP'
  }
];

// Helper to normalize initials
export function getInitials(fullName) {
  if (!fullName || typeof fullName !== 'string') return 'FH';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'FH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL SEED CONVERSATIONS
// Covers ALL 6 bidirectional pairings across all 4 roles
// ─────────────────────────────────────────────────────────────────────────────
export const INITIAL_CONVERSATIONS = [
  // 1. Farmer ↔ Student (Internship Context)
  {
    id: 'conv_farmer_student_agro01',
    contextType: 'internship',
    contextId: 'agro-01',
    contextTitle: 'Farm Operations & Precision Crop Intern (खेत प्रबंधन एवं फसल इंटर्न)',
    farmName: 'Rajesh Model Farm & KisanVikas',
    // Backward compatibility fields
    internshipId: 'agro-01',
    internshipTitle: 'Farm Operations & Precision Crop Intern (खेत प्रबंधन एवं फसल इंटर्न)',
    farmerId: 'user_farmer_01',
    farmerName: 'Rajesh Kumar',
    farmerPhone: '9876543210',
    farmerRole: 'farmer',
    studentId: 'user_student_01',
    studentName: 'Aman Verma',
    studentPhone: '9812345678',
    studentEmail: 'aman.verma@agriuni.ac.in',
    studentCourse: 'B.Sc Agriculture (3rd Year)',
    studentCollege: 'GB Pant University of Agriculture',
    studentRole: 'student',
    participantIds: ['user_farmer_01', 'user_student_01'],
    participants: [
      {
        userId: 'user_farmer_01',
        role: 'farmer',
        name: 'Rajesh Kumar',
        phone: '9876543210',
        email: 'rajesh.kumar@farmerhelper.in'
      },
      {
        userId: 'user_student_01',
        role: 'student',
        name: 'Aman Verma',
        phone: '9812345678',
        email: 'aman.verma@agriuni.ac.in'
      }
    ],
    lastMessage: 'Good. We have scheduled an online interview session to discuss accommodation and field timings.',
    lastMessageTime: '10:35 AM',
    updatedAt: '25 min ago',
    unreadCounts: {
      user_farmer_01: 0,
      user_student_01: 1
    },
    unreadFarmer: 0,
    unreadStudent: 1,
    messages: [
      {
        id: 'msg_fs_1',
        conversationId: 'conv_farmer_student_agro01',
        senderId: 'user_student_01',
        senderName: 'Aman Verma',
        senderRole: 'student',
        receiverId: 'user_farmer_01',
        receiverRole: 'farmer',
        message: 'Namaste Rajesh sir! I have applied for the Farm Operations & Precision Crop internship on your farm. I am eager to join.',
        text: 'Namaste Rajesh sir! I have applied for the Farm Operations & Precision Crop internship on your farm. I am eager to join.',
        timestamp: '10:15 AM',
        createdAt: '2026-10-04T10:15:00.000Z',
        date: 'Today',
        read: true
      },
      {
        id: 'msg_fs_2',
        conversationId: 'conv_farmer_student_agro01',
        senderId: 'user_farmer_01',
        senderName: 'Rajesh Kumar',
        senderRole: 'farmer',
        receiverId: 'user_student_01',
        receiverRole: 'student',
        message: 'Namaste Aman! Welcome. I reviewed your profile. Tell me about your practical experience with drip fertigation and soil testing.',
        text: 'Namaste Aman! Welcome. I reviewed your profile. Tell me about your practical experience with drip fertigation and soil testing.',
        timestamp: '10:22 AM',
        createdAt: '2026-10-04T10:22:00.000Z',
        date: 'Today',
        read: true
      },
      {
        id: 'msg_fs_3',
        conversationId: 'conv_farmer_student_agro01',
        senderId: 'user_student_01',
        senderName: 'Aman Verma',
        senderRole: 'student',
        receiverId: 'user_farmer_01',
        receiverRole: 'farmer',
        message: 'Sir, I have completed 6-week organic farm training at Modipuram KVK and am familiar with polyhouse drip setups and daily soil moisture logging.',
        text: 'Sir, I have completed 6-week organic farm training at Modipuram KVK and am familiar with polyhouse drip setups and daily soil moisture logging.',
        timestamp: '10:28 AM',
        createdAt: '2026-10-04T10:28:00.000Z',
        date: 'Today',
        read: true
      },
      {
        id: 'msg_fs_4',
        conversationId: 'conv_farmer_student_agro01',
        senderId: 'user_farmer_01',
        senderName: 'Rajesh Kumar',
        senderRole: 'farmer',
        receiverId: 'user_student_01',
        receiverRole: 'student',
        message: 'Good. We have scheduled an online interview session to discuss accommodation and field timings.',
        text: 'Good. We have scheduled an online interview session to discuss accommodation and field timings.',
        timestamp: '10:35 AM',
        createdAt: '2026-10-04T10:35:00.000Z',
        date: 'Today',
        read: false
      }
    ]
  },

  // 2. Farmer ↔ Buyer (Farm Produce / Wholesale Context)
  {
    id: 'conv_farmer_buyer_wheat',
    contextType: 'produce',
    contextId: 'lot_wheat_01',
    contextTitle: 'Organic Sharbati Wheat — 80 Quintals',
    farmName: 'Rajesh Kumar Farm (Meerut)',
    internshipTitle: 'Organic Sharbati Wheat — 80 Quintals',
    resourceTitle: 'Kisan Mandi Agro Traders',
    farmerId: 'user_farmer_01',
    farmerName: 'Rajesh Kumar',
    farmerPhone: '9876543210',
    farmerRole: 'farmer',
    studentId: 'user_buyer_01',
    studentName: 'Vikram Sharma',
    studentPhone: '9988776655',
    studentRole: 'buyer',
    participantIds: ['user_farmer_01', 'user_buyer_01'],
    participants: [
      {
        userId: 'user_farmer_01',
        role: 'farmer',
        name: 'Rajesh Kumar',
        phone: '9876543210',
        email: 'rajesh.kumar@farmerhelper.in'
      },
      {
        userId: 'user_buyer_01',
        role: 'buyer',
        name: 'Vikram Sharma',
        businessName: 'Kisan Mandi Agro Traders',
        phone: '9988776655',
        email: 'vikram@kisanmanditraders.com'
      }
    ],
    lastMessage: 'Yes Rajesh ji, we can offer ₹2,550/quintal with immediate RTGS payment upon weighing.',
    lastMessageTime: '11:45 AM',
    updatedAt: '15 min ago',
    unreadCounts: {
      user_farmer_01: 1,
      user_buyer_01: 0
    },
    unreadFarmer: 1,
    unreadStudent: 0,
    messages: [
      {
        id: 'msg_fb_1',
        conversationId: 'conv_farmer_buyer_wheat',
        senderId: 'user_farmer_01',
        senderName: 'Rajesh Kumar',
        senderRole: 'farmer',
        receiverId: 'user_buyer_01',
        receiverRole: 'buyer',
        message: 'Namaste Vikram ji! I have 80 quintals of cleaned Sharbati Wheat ready at our farm storehouse in Meerut. Are you purchasing this week?',
        text: 'Namaste Vikram ji! I have 80 quintals of cleaned Sharbati Wheat ready at our farm storehouse in Meerut. Are you purchasing this week?',
        timestamp: '11:30 AM',
        createdAt: '2026-10-04T11:30:00.000Z',
        date: 'Today',
        read: true
      },
      {
        id: 'msg_fb_2',
        conversationId: 'conv_farmer_buyer_wheat',
        senderId: 'user_buyer_01',
        senderName: 'Vikram Sharma',
        senderRole: 'buyer',
        receiverId: 'user_farmer_01',
        receiverRole: 'farmer',
        message: 'Namaste Rajesh ji, we can offer ₹2,550/quintal with immediate RTGS payment upon weighing.',
        text: 'Namaste Rajesh ji, we can offer ₹2,550/quintal with immediate RTGS payment upon weighing.',
        timestamp: '11:45 AM',
        createdAt: '2026-10-04T11:45:00.000Z',
        date: 'Today',
        read: false
      }
    ]
  },

  // 3. Farmer ↔ Resource Provider (Equipment Rental Context)
  {
    id: 'conv_farmer_provider_tractor',
    contextType: 'resource',
    contextId: 'seed_res_01',
    contextTitle: 'Mahindra 575 DI Tractor (45 HP)',
    farmName: 'Krishi Seva Machine Center — Sardar Gurpreet Singh',
    internshipTitle: 'Mahindra 575 DI Tractor (45 HP)',
    resourceTitle: 'Mahindra 575 DI Tractor (45 HP)',
    farmerId: 'user_provider_01',
    farmerName: 'Sardar Gurpreet Singh',
    farmerPhone: '9788665544',
    farmerRole: 'provider',
    studentId: 'user_farmer_01',
    studentName: 'Rajesh Kumar',
    studentPhone: '9876543210',
    studentRole: 'farmer',
    participantIds: ['user_farmer_01', 'user_provider_01'],
    participants: [
      {
        userId: 'user_farmer_01',
        role: 'farmer',
        name: 'Rajesh Kumar',
        phone: '9876543210',
        email: 'rajesh.kumar@farmerhelper.in'
      },
      {
        userId: 'user_provider_01',
        role: 'provider',
        name: 'Sardar Gurpreet Singh',
        businessName: 'Krishi Seva Machine Center',
        phone: '9788665544',
        email: 'gurpreet@krishisevakendra.in'
      }
    ],
    lastMessage: 'Tractor is ready with rotavator. We can deliver it to your field by 6 AM tomorrow.',
    lastMessageTime: '12:10 PM',
    updatedAt: '1 hour ago',
    unreadCounts: {
      user_farmer_01: 1,
      user_provider_01: 0
    },
    unreadFarmer: 0,
    unreadStudent: 1,
    messages: [
      {
        id: 'msg_fp_1',
        conversationId: 'conv_farmer_provider_tractor',
        senderId: 'user_farmer_01',
        senderName: 'Rajesh Kumar',
        senderRole: 'farmer',
        receiverId: 'user_provider_01',
        receiverRole: 'provider',
        message: 'Namaste Gurpreet ji! I need your 45 HP Mahindra Tractor for 2 days for field plowing in village Dabathwa.',
        text: 'Namaste Gurpreet ji! I need your 45 HP Mahindra Tractor for 2 days for field plowing in village Dabathwa.',
        timestamp: '11:55 AM',
        createdAt: '2026-10-04T11:55:00.000Z',
        date: 'Today',
        read: true
      },
      {
        id: 'msg_fp_2',
        conversationId: 'conv_farmer_provider_tractor',
        senderId: 'user_provider_01',
        senderName: 'Sardar Gurpreet Singh',
        senderRole: 'provider',
        receiverId: 'user_farmer_01',
        receiverRole: 'farmer',
        message: 'Tractor is ready with rotavator. We can deliver it to your field by 6 AM tomorrow.',
        text: 'Tractor is ready with rotavator. We can deliver it to your field by 6 AM tomorrow.',
        timestamp: '12:10 PM',
        createdAt: '2026-10-04T12:10:00.000Z',
        date: 'Today',
        read: false
      }
    ]
  },

  // 4. Student ↔ Buyer (Agri-Supply Internship & Quality Standards)
  {
    id: 'conv_student_buyer_procurement',
    contextType: 'direct',
    contextId: 'direct_student_buyer',
    contextTitle: 'Mandi Procurement & Grain Quality Internship Inquiry',
    farmName: 'Kisan Mandi Agro Traders',
    internshipTitle: 'Mandi Procurement & Grain Quality Inquiry',
    resourceTitle: 'Kisan Mandi Agro Traders',
    farmerId: 'user_buyer_01',
    farmerName: 'Vikram Sharma',
    farmerPhone: '9988776655',
    farmerRole: 'buyer',
    studentId: 'user_student_01',
    studentName: 'Aman Verma',
    studentPhone: '9812345678',
    studentRole: 'student',
    participantIds: ['user_student_01', 'user_buyer_01'],
    participants: [
      {
        userId: 'user_student_01',
        role: 'student',
        name: 'Aman Verma',
        phone: '9812345678',
        email: 'aman.verma@agriuni.ac.in'
      },
      {
        userId: 'user_buyer_01',
        role: 'buyer',
        name: 'Vikram Sharma',
        businessName: 'Kisan Mandi Agro Traders',
        phone: '9988776655',
        email: 'vikram@kisanmanditraders.com'
      }
    ],
    lastMessage: 'Sure Aman, we welcome students for crop quality assessment and moisture testing training.',
    lastMessageTime: '01:20 PM',
    updatedAt: '2 hours ago',
    unreadCounts: {
      user_student_01: 1,
      user_buyer_01: 0
    },
    unreadFarmer: 0,
    unreadStudent: 1,
    messages: [
      {
        id: 'msg_sb_1',
        conversationId: 'conv_student_buyer_procurement',
        senderId: 'user_student_01',
        senderName: 'Aman Verma',
        senderRole: 'student',
        receiverId: 'user_buyer_01',
        receiverRole: 'buyer',
        message: 'Namaste Vikram sir! As a final-year B.Sc Agriculture student, I am seeking practical experience in mandi procurement and post-harvest grading.',
        text: 'Namaste Vikram sir! As a final-year B.Sc Agriculture student, I am seeking practical experience in mandi procurement and post-harvest grading.',
        timestamp: '01:05 PM',
        createdAt: '2026-10-04T13:05:00.000Z',
        date: 'Today',
        read: true
      },
      {
        id: 'msg_sb_2',
        conversationId: 'conv_student_buyer_procurement',
        senderId: 'user_buyer_01',
        senderName: 'Vikram Sharma',
        senderRole: 'buyer',
        receiverId: 'user_student_01',
        receiverRole: 'student',
        message: 'Sure Aman, we welcome students for crop quality assessment and moisture testing training.',
        text: 'Sure Aman, we welcome students for crop quality assessment and moisture testing training.',
        timestamp: '01:20 PM',
        createdAt: '2026-10-04T13:20:00.000Z',
        date: 'Today',
        read: false
      }
    ]
  },

  // 5. Student ↔ Resource Provider (Machinery Operation Apprentice)
  {
    id: 'conv_student_provider_machinery',
    contextType: 'direct',
    contextId: 'direct_student_provider',
    contextTitle: 'Farm Machinery Operation & Maintenance Training',
    farmName: 'Krishi Seva Machine Center',
    internshipTitle: 'Farm Machinery Operation Training',
    resourceTitle: 'Krishi Seva Machine Center',
    farmerId: 'user_provider_01',
    farmerName: 'Sardar Gurpreet Singh',
    farmerPhone: '9788665544',
    farmerRole: 'provider',
    studentId: 'user_student_01',
    studentName: 'Aman Verma',
    studentPhone: '9812345678',
    studentRole: 'student',
    participantIds: ['user_student_01', 'user_provider_01'],
    participants: [
      {
        userId: 'user_student_01',
        role: 'student',
        name: 'Aman Verma',
        phone: '9812345678',
        email: 'aman.verma@agriuni.ac.in'
      },
      {
        userId: 'user_provider_01',
        role: 'provider',
        name: 'Sardar Gurpreet Singh',
        businessName: 'Krishi Seva Machine Center',
        phone: '9788665544',
        email: 'gurpreet@krishisevakendra.in'
      }
    ],
    lastMessage: 'Haanji beta! You can join our workshop on Saturday to learn harvester calibrations.',
    lastMessageTime: '02:15 PM',
    updatedAt: '3 hours ago',
    unreadCounts: {
      user_student_01: 1,
      user_provider_01: 0
    },
    unreadFarmer: 0,
    unreadStudent: 1,
    messages: [
      {
        id: 'msg_sp_1',
        conversationId: 'conv_student_provider_machinery',
        senderId: 'user_student_01',
        senderName: 'Aman Verma',
        senderRole: 'student',
        receiverId: 'user_provider_01',
        receiverRole: 'provider',
        message: 'Sat Sri Akal Gurpreet uncle ji! Do you allow student visits to inspect combine harvester operations and hydraulic maintenance?',
        text: 'Sat Sri Akal Gurpreet uncle ji! Do you allow student visits to inspect combine harvester operations and hydraulic maintenance?',
        timestamp: '02:00 PM',
        createdAt: '2026-10-04T14:00:00.000Z',
        date: 'Today',
        read: true
      },
      {
        id: 'msg_sp_2',
        conversationId: 'conv_student_provider_machinery',
        senderId: 'user_provider_01',
        senderName: 'Sardar Gurpreet Singh',
        senderRole: 'provider',
        receiverId: 'user_student_01',
        receiverRole: 'student',
        message: 'Haanji beta! You can join our workshop on Saturday to learn harvester calibrations.',
        text: 'Haanji beta! You can join our workshop on Saturday to learn harvester calibrations.',
        timestamp: '02:15 PM',
        createdAt: '2026-10-04T14:15:00.000Z',
        date: 'Today',
        read: false
      }
    ]
  },

  // 6. Buyer ↔ Resource Provider (Grain Transport & Warehouse Logistics)
  {
    id: 'conv_buyer_provider_logistics',
    contextType: 'direct',
    contextId: 'direct_buyer_provider',
    contextTitle: 'Bulk Grain Logistics & Transport Squad',
    farmName: 'Krishi Seva Machine Center',
    internshipTitle: 'Grain Logistics & Fleet Coordination',
    resourceTitle: 'Krishi Seva Machine Center',
    farmerId: 'user_provider_01',
    farmerName: 'Sardar Gurpreet Singh',
    farmerPhone: '9788665544',
    farmerRole: 'provider',
    studentId: 'user_buyer_01',
    studentName: 'Vikram Sharma',
    studentPhone: '9988776655',
    studentRole: 'buyer',
    participantIds: ['user_buyer_01', 'user_provider_01'],
    participants: [
      {
        userId: 'user_buyer_01',
        role: 'buyer',
        name: 'Vikram Sharma',
        businessName: 'Kisan Mandi Agro Traders',
        phone: '9988776655',
        email: 'vikram@kisanmanditraders.com'
      },
      {
        userId: 'user_provider_01',
        role: 'provider',
        name: 'Sardar Gurpreet Singh',
        businessName: 'Krishi Seva Machine Center',
        phone: '9788665544',
        email: 'gurpreet@krishisevakendra.in'
      }
    ],
    lastMessage: 'Yes Vikram ji, we have 2 tractor-trolleys and 8 loading labourers ready for dispatch.',
    lastMessageTime: '03:10 PM',
    updatedAt: '4 hours ago',
    unreadCounts: {
      user_buyer_01: 1,
      user_provider_01: 0
    },
    unreadFarmer: 0,
    unreadStudent: 1,
    messages: [
      {
        id: 'msg_bp_1',
        conversationId: 'conv_buyer_provider_logistics',
        senderId: 'user_buyer_01',
        senderName: 'Vikram Sharma',
        senderRole: 'buyer',
        receiverId: 'user_provider_01',
        receiverRole: 'provider',
        message: 'Namaste Gurpreet ji! We are procuring 250 quintals of paddy from Modinagar farms this Thursday. Can you supply transport trolleys and 6 loaders?',
        text: 'Namaste Gurpreet ji! We are procuring 250 quintals of paddy from Modinagar farms this Thursday. Can you supply transport trolleys and 6 loaders?',
        timestamp: '02:50 PM',
        createdAt: '2026-10-04T14:50:00.000Z',
        date: 'Today',
        read: true
      },
      {
        id: 'msg_bp_2',
        conversationId: 'conv_buyer_provider_logistics',
        senderId: 'user_provider_01',
        senderName: 'Sardar Gurpreet Singh',
        senderRole: 'provider',
        receiverId: 'user_buyer_01',
        receiverRole: 'buyer',
        message: 'Yes Vikram ji, we have 2 tractor-trolleys and 8 loading labourers ready for dispatch.',
        text: 'Yes Vikram ji, we have 2 tractor-trolleys and 8 loading labourers ready for dispatch.',
        timestamp: '03:10 PM',
        createdAt: '2026-10-04T15:10:00.000Z',
        date: 'Today',
        read: false
      }
    ]
  },

  // 7. Additional Student Rahul Sharma ↔ Farmer Rajesh Kumar
  {
    id: 'conv_agro_01_rahul',
    contextType: 'internship',
    contextId: 'agro-01',
    contextTitle: 'Farm Operations & Precision Crop Intern (खेत प्रबंधन एवं फसल इंटर्न)',
    farmName: 'Rajesh Model Farm & KisanVikas',
    internshipId: 'agro-01',
    internshipTitle: 'Farm Operations & Precision Crop Intern (खेत प्रबंधन एवं फसल इंटर्न)',
    farmerId: 'user_farmer_01',
    farmerName: 'Rajesh Kumar',
    farmerPhone: '9876543210',
    farmerRole: 'farmer',
    studentId: 'user_student_03',
    studentName: 'Rahul Sharma',
    studentPhone: '9811223344',
    studentEmail: 'rahul.sharma@agriuniversity.edu',
    studentCourse: 'B.Sc Agriculture (2nd Year)',
    studentCollege: 'CCS Haryana Agricultural University',
    studentRole: 'student',
    participantIds: ['user_student_03', 'user_farmer_01'],
    participants: [
      {
        userId: 'user_farmer_01',
        role: 'farmer',
        name: 'Rajesh Kumar',
        phone: '9876543210',
        email: 'rajesh.kumar@farmerhelper.in'
      },
      {
        userId: 'user_student_03',
        role: 'student',
        name: 'Rahul Sharma',
        phone: '9811223344',
        email: 'rahul.sharma@agriuniversity.edu'
      }
    ],
    lastMessage: 'I have completed my 2nd year of B.Sc Agriculture.',
    lastMessageTime: '11:15 AM',
    updatedAt: '10 min ago',
    unreadCounts: {
      user_farmer_01: 1,
      user_student_03: 0
    },
    unreadFarmer: 1,
    unreadStudent: 0,
    messages: [
      {
        id: 'msg_r1',
        conversationId: 'conv_agro_01_rahul',
        senderId: 'user_student_03',
        senderName: 'Rahul Sharma',
        senderRole: 'student',
        receiverId: 'user_farmer_01',
        receiverRole: 'farmer',
        message: 'Hello sir, I am interested in this internship.',
        text: 'Hello sir, I am interested in this internship.',
        timestamp: '11:05 AM',
        createdAt: '2026-10-04T11:05:00.000Z',
        date: 'Today',
        read: true
      },
      {
        id: 'msg_r2',
        conversationId: 'conv_agro_01_rahul',
        senderId: 'user_farmer_01',
        senderName: 'Rajesh Kumar',
        senderRole: 'farmer',
        receiverId: 'user_student_03',
        receiverRole: 'student',
        message: 'Hello Rahul, please tell me about your experience.',
        text: 'Hello Rahul, please tell me about your experience.',
        timestamp: '11:10 AM',
        createdAt: '2026-10-04T11:10:00.000Z',
        date: 'Today',
        read: true
      },
      {
        id: 'msg_r3',
        conversationId: 'conv_agro_01_rahul',
        senderId: 'user_student_03',
        senderName: 'Rahul Sharma',
        senderRole: 'student',
        receiverId: 'user_farmer_01',
        receiverRole: 'farmer',
        message: 'I have completed my 2nd year of B.Sc Agriculture.',
        text: 'I have completed my 2nd year of B.Sc Agriculture.',
        timestamp: '11:15 AM',
        createdAt: '2026-10-04T11:15:00.000Z',
        date: 'Today',
        read: false
      }
    ]
  },

  // 8. Student Priya Sharma ↔ Farmer Rajesh Kumar
  {
    id: 'conv_agro_01_priya',
    contextType: 'internship',
    contextId: 'agro-01',
    contextTitle: 'Farm Operations & Precision Crop Intern (खेत प्रबंधन एवं फसल इंटर्न)',
    farmName: 'Rajesh Model Farm & KisanVikas',
    internshipId: 'agro-01',
    internshipTitle: 'Farm Operations & Precision Crop Intern (खेत प्रबंधन एवं फसल इंटर्न)',
    farmerId: 'user_farmer_01',
    farmerName: 'Rajesh Kumar',
    farmerPhone: '9876543210',
    farmerRole: 'farmer',
    studentId: 'user_student_02',
    studentName: 'Priya Sharma',
    studentPhone: '9876501234',
    studentEmail: 'priya.sharma@ccsuniversity.ac.in',
    studentCourse: 'M.Sc Agronomy (1st Year)',
    studentCollege: 'Chaudhary Charan Singh University',
    studentRole: 'student',
    participantIds: ['user_student_02', 'user_farmer_01'],
    participants: [
      {
        userId: 'user_farmer_01',
        role: 'farmer',
        name: 'Rajesh Kumar',
        phone: '9876543210',
        email: 'rajesh.kumar@farmerhelper.in'
      },
      {
        userId: 'user_student_02',
        role: 'student',
        name: 'Priya Sharma',
        phone: '9876501234',
        email: 'priya.sharma@ccsuniversity.ac.in'
      }
    ],
    lastMessage: 'I would like to inquire about the soil testing laboratory on the farm premises.',
    lastMessageTime: '09:40 AM',
    updatedAt: '1 hour ago',
    unreadCounts: {
      user_farmer_01: 1,
      user_student_02: 0
    },
    unreadFarmer: 1,
    unreadStudent: 0,
    messages: [
      {
        id: 'msg_p1',
        conversationId: 'conv_agro_01_priya',
        senderId: 'user_student_02',
        senderName: 'Priya Sharma',
        senderRole: 'student',
        receiverId: 'user_farmer_01',
        receiverRole: 'farmer',
        message: 'Hello Rajesh sir, I submitted my application for the agronomy internship. I would like to inquire about the soil testing laboratory on the farm premises.',
        text: 'Hello Rajesh sir, I submitted my application for the agronomy internship. I would like to inquire about the soil testing laboratory on the farm premises.',
        timestamp: '09:40 AM',
        createdAt: '2026-10-04T09:40:00.000Z',
        date: 'Today',
        read: true
      }
    ]
  }
];

// Helper to normalize conversation to universal format (defensive migration)
function normalizeConversation(c) {
  if (!c || typeof c !== 'object') return null;

  // Extract participants list
  const participantIds = Array.isArray(c.participantIds)
    ? [...c.participantIds]
    : [];

  let participants = Array.isArray(c.participants) ? [...c.participants] : [];

  // If participants are strings, convert to objects
  participants = participants.map((p) => {
    if (typeof p === 'string') {
      const match = PRESET_ROLE_CONTACTS.find((u) => u.id === p);
      return {
        userId: p,
        role: match?.role || (p === c.farmerId ? 'farmer' : 'student'),
        name: match?.name || (p === c.farmerId ? c.farmerName : c.studentName) || 'User',
        phone: match?.phone || (p === c.farmerId ? c.farmerPhone : c.studentPhone) || '',
        email: match?.email || ''
      };
    }
    return p;
  });

  // Ensure legacy farmerId and studentId are in participantIds
  if (c.farmerId && !participantIds.includes(c.farmerId)) {
    participantIds.push(c.farmerId);
  }
  if (c.studentId && !participantIds.includes(c.studentId)) {
    participantIds.push(c.studentId);
  }
  if (c.currentUserId && !participantIds.includes(c.currentUserId)) {
    participantIds.push(c.currentUserId);
  }

  // Ensure participants array matches participantIds
  participantIds.forEach((pid) => {
    if (!participants.some((p) => p?.userId === pid)) {
      const match = PRESET_ROLE_CONTACTS.find((u) => u.id === pid);
      participants.push({
        userId: pid,
        role: match?.role || (pid === c.farmerId ? 'farmer' : 'student'),
        name: match?.name || (pid === c.farmerId ? c.farmerName : c.studentName) || 'User',
        phone: match?.phone || (pid === c.farmerId ? c.farmerPhone : c.studentPhone) || '',
        email: match?.email || ''
      });
    }
  });

  return {
    ...c,
    participantIds,
    participants,
    unreadCounts: c.unreadCounts || {
      [c.farmerId || '']: c.unreadFarmer || 0,
      [c.studentId || '']: c.unreadStudent || 0
    },
    messages: Array.isArray(c.messages) ? c.messages : []
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
export const CONVERSATIONS_STORAGE_KEY = 'farmer_helper_conversations';
export const CHAT_UPDATE_EVENT = 'farmer_helper_chat_updated';

export function getStoredConversations() {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalized = parsed.map(normalizeConversation).filter(Boolean);

        // Merge any missing initial seed conversations
        const existingIds = new Set(normalized.map((c) => c.id));
        const missingSeeds = INITIAL_CONVERSATIONS.filter((seed) => !existingIds.has(seed.id));
        const merged = missingSeeds.length > 0 ? [...normalized, ...missingSeeds] : normalized;

        if (merged.length !== parsed.length || missingSeeds.length > 0) {
          saveStoredConversations(merged);
        }
        return merged;
      }
    }
  } catch (err) {
    console.error('Error reading conversations from localStorage:', err);
  }
  return INITIAL_CONVERSATIONS;
}

export function saveStoredConversations(conversations) {
  try {
    localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations));
    // Dispatch local notification event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CHAT_UPDATE_EVENT));
    }
  } catch (err) {
    console.error('Error saving conversations to localStorage:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSAL CONVERSATION & PARTICIPANT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Check if a given userId belongs to a conversation
export function isUserInConversation(conv, userId) {
  if (!conv || !userId) return false;
  if (Array.isArray(conv.participantIds) && conv.participantIds.includes(userId)) {
    return true;
  }
  if (Array.isArray(conv.participants)) {
    return conv.participants.some((p) => {
      if (typeof p === 'string') return p === userId;
      if (p && typeof p === 'object') return p.userId === userId;
      return false;
    });
  }
  return conv.farmerId === userId || conv.studentId === userId || conv.currentUserId === userId;
}

// Extract the partner (other user) in the conversation relative to myId
export function getConversationPartner(conv, myId) {
  const fallback = {
    id: '',
    name: 'User',
    role: 'farmer',
    roleLabel: 'User',
    initials: 'FH',
    phone: '',
    email: '',
    farmName: ''
  };

  if (!conv) return fallback;

  // 1. Look inside participants array
  if (Array.isArray(conv.participants) && conv.participants.length > 0) {
    const partnerObj = conv.participants.find((p) => {
      const pid = typeof p === 'string' ? p : p?.userId;
      return pid && pid !== myId;
    });

    if (partnerObj && typeof partnerObj === 'object') {
      const name = partnerObj.name || partnerObj.businessName || 'User';
      const role = partnerObj.role || 'farmer';
      return {
        id: partnerObj.userId || '',
        name,
        role,
        roleLabel: formatRoleName(role),
        initials: getInitials(name),
        phone: partnerObj.phone || '',
        email: partnerObj.email || '',
        farmName: partnerObj.businessName || partnerObj.farmName || conv.farmName || ''
      };
    }
  }

  // 2. Fallback to legacy fields
  const isOnFarmerSide = conv.farmerId === myId;
  const partnerId = isOnFarmerSide ? conv.studentId : conv.farmerId;
  const partnerName = isOnFarmerSide
    ? (conv.studentName || 'Student Inquirer')
    : (conv.farmerName || 'Farm Host');
  const partnerRole = isOnFarmerSide
    ? (conv.studentRole || 'student')
    : (conv.farmerRole || (conv.type === 'resource' ? 'provider' : conv.type === 'buyer' ? 'buyer' : 'farmer'));
  const partnerPhone = isOnFarmerSide ? conv.studentPhone : conv.farmerPhone;

  return {
    id: partnerId || '',
    name: partnerName,
    role: partnerRole,
    roleLabel: formatRoleName(partnerRole),
    initials: getInitials(partnerName),
    phone: partnerPhone || '',
    email: conv.studentEmail || '',
    farmName: conv.farmName || ''
  };
}

export function formatRoleName(role, isEn = true) {
  const lower = String(role || '').toLowerCase();
  if (lower === 'farmer') return isEn ? 'Farmer' : 'किसान';
  if (lower === 'student') return isEn ? 'Student' : 'छात्र';
  if (lower === 'buyer') return isEn ? 'Buyer' : 'खरीदार';
  if (lower === 'provider') return isEn ? 'Resource Provider' : 'संसाधन प्रदाता';
  return isEn ? 'User' : 'उपयोगकर्ता';
}

// ─────────────────────────────────────────────────────────────────────────────
// GET OR CREATE CONVERSATION (UNIVERSAL)
// ─────────────────────────────────────────────────────────────────────────────
export function getOrCreateConversation({
  currentUser,
  targetUser,
  context = {},
  initialText = ''
}) {
  if (!currentUser?.id || !targetUser?.id) return null;

  const currentUserId = currentUser.id;
  const targetUserId = targetUser.id;

  // Don't create self-chat
  if (currentUserId === targetUserId) return null;

  const allConversations = getStoredConversations();

  // 1. Search for existing conversation between these two users
  const existing = allConversations.find((c) => {
    const hasCurrentUser = isUserInConversation(c, currentUserId);
    const hasTargetUser = isUserInConversation(c, targetUserId);

    if (hasCurrentUser && hasTargetUser) {
      // If a specific contextId was passed (like a specific internship/resource), match it if present
      if (context.id) {
        return (
          c.contextId === context.id ||
          c.internshipId === context.id ||
          c.resourceId === context.id ||
          c.produceId === context.id ||
          c.id.includes(context.id)
        );
      }
      return true;
    }
    return false;
  });

  if (existing) {
    return existing;
  }

  // 2. Create new universal conversation
  // Symmetrical sorted ID ensures order independence
  const sortedIds = [currentUserId, targetUserId].sort();
  const contextSlug = context.id ? `_${context.id}` : '';
  const convId = `conv_${sortedIds.join('_')}${contextSlug}`;

  const currentRole = currentUser.role || 'farmer';
  const targetRole = targetUser.role || 'farmer';

  const currentName = currentUser.name || currentUser.businessName || 'User';
  const targetName = targetUser.name || targetUser.businessName || 'User';

  const contextTitle = context.title || `${currentName} & ${targetName}`;
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const defaultMsg = initialText || `Namaste! Starting a direct conversation.`;

  const newConv = {
    id: convId,
    contextType: context.type || 'direct',
    contextId: context.id || null,
    contextTitle: contextTitle,
    farmName: targetUser.farmName || targetUser.businessName || context.subtitle || 'Farmer Helper Chat',
    
    // Legacy fields for complete backward compatibility
    internshipTitle: contextTitle,
    resourceTitle: contextTitle,
    farmerId: currentRole === 'farmer' ? currentUserId : (targetRole === 'farmer' ? targetUserId : currentUserId),
    farmerName: currentRole === 'farmer' ? currentName : (targetRole === 'farmer' ? targetName : currentName),
    farmerPhone: currentRole === 'farmer' ? currentUser.phone : targetUser.phone,
    farmerRole: currentRole === 'farmer' ? currentRole : targetRole,
    studentId: currentRole === 'farmer' ? targetUserId : currentUserId,
    studentName: currentRole === 'farmer' ? targetName : currentName,
    studentPhone: currentRole === 'farmer' ? targetUser.phone : currentUser.phone,
    studentRole: currentRole === 'farmer' ? targetRole : currentRole,

    participantIds: [currentUserId, targetUserId],
    participants: [
      {
        userId: currentUserId,
        role: currentRole,
        name: currentName,
        phone: currentUser.phone || '',
        email: currentUser.email || ''
      },
      {
        userId: targetUserId,
        role: targetRole,
        name: targetName,
        phone: targetUser.phone || '',
        email: targetUser.email || ''
      }
    ],

    lastMessage: defaultMsg,
    lastMessageTime: timeStr,
    updatedAt: 'Just now',
    unreadCounts: {
      [currentUserId]: 0,
      [targetUserId]: 1
    },
    unreadFarmer: currentRole === 'farmer' ? 0 : 1,
    unreadStudent: currentRole === 'farmer' ? 1 : 0,

    messages: [
      {
        id: `msg_${Date.now()}`,
        conversationId: convId,
        senderId: currentUserId,
        senderName: currentName,
        senderRole: currentRole,
        receiverId: targetUserId,
        receiverRole: targetRole,
        message: defaultMsg,
        text: defaultMsg,
        timestamp: timeStr,
        createdAt: now.toISOString(),
        date: 'Today',
        read: false
      }
    ]
  };

  const updatedList = [newConv, ...allConversations];
  saveStoredConversations(updatedList);
  return newConv;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEND MESSAGE HELPER (UNIVERSAL)
// ─────────────────────────────────────────────────────────────────────────────
export function sendMessageToConversation({
  conversations,
  conversationId,
  senderUser,
  text
}) {
  const cleanText = (text || '').trim();
  if (!cleanText || !conversationId || !senderUser?.id) return conversations;

  const conv = conversations.find((c) => c.id === conversationId);
  if (!conv) return conversations;

  const partner = getConversationPartner(conv, senderUser.id);
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMsg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    conversationId: conv.id,
    senderId: senderUser.id,
    senderName: senderUser.name || 'User',
    senderRole: senderUser.role || 'farmer',
    receiverId: partner.id,
    receiverRole: partner.role || 'farmer',
    message: cleanText,
    text: cleanText,
    timestamp: timeStr,
    createdAt: now.toISOString(),
    date: 'Today',
    read: false
  };

  const currentUnreadForPartner = conv.unreadCounts?.[partner.id] || 0;

  const updatedConversations = conversations.map((c) => {
    if (c.id !== conversationId) return c;

    return {
      ...c,
      lastMessage: cleanText,
      lastMessageTime: timeStr,
      updatedAt: 'Just now',
      unreadCounts: {
        ...(c.unreadCounts || {}),
        [senderUser.id]: 0,
        [partner.id]: currentUnreadForPartner + 1
      },
      unreadFarmer: senderUser.id === c.farmerId ? 0 : (c.unreadFarmer || 0) + 1,
      unreadStudent: senderUser.id === c.studentId ? 0 : (c.unreadStudent || 0) + 1,
      messages: [...(c.messages || []), newMsg]
    };
  });

  saveStoredConversations(updatedConversations);
  return updatedConversations;
}

// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP-STYLE MESSAGE & CONVERSATION DELETION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Check if conversation should be visible in user's active list
export function isConversationVisibleForUser(conv, userId) {
  if (!conv || !userId) return false;
  if (Array.isArray(conv.deletedFor) && conv.deletedFor.includes(userId)) {
    return false;
  }
  return isUserInConversation(conv, userId);
}

// 1. Delete message for me: hides message for current user only
export function deleteMessageForMe({ conversations, conversationId, messageId, userId }) {
  if (!conversationId || !messageId || !userId) return conversations || [];
  const list = conversations || getStoredConversations();

  const updated = list.map((c) => {
    if (c.id !== conversationId) return c;

    const msgs = (c.messages || []).map((m) => {
      if (m.id !== messageId) return m;
      const currentDeleted = Array.isArray(m.deletedFor) ? m.deletedFor : [];
      if (currentDeleted.includes(userId)) return m;
      return {
        ...m,
        deletedFor: [...currentDeleted, userId]
      };
    });

    // Recompute last visible message for current user
    const visibleMsgs = msgs.filter((m) => !m.deletedFor?.includes(userId));
    const lastVisible = visibleMsgs[visibleMsgs.length - 1];
    const lastMsgText = lastVisible
      ? (lastVisible.isDeletedForEveryone ? 'This message was deleted' : (lastVisible.message || lastVisible.text || ''))
      : '';

    return {
      ...c,
      messages: msgs,
      lastMessage: lastMsgText
    };
  });

  saveStoredConversations(updated);
  return updated;
}

// 2. Delete message for everyone: replaces content with placeholder for BOTH users (sender only)
export function deleteMessageForEveryone({ conversations, conversationId, messageId, userId }) {
  if (!conversationId || !messageId || !userId) return conversations || [];
  const list = conversations || getStoredConversations();

  const updated = list.map((c) => {
    if (c.id !== conversationId) return c;

    const msgs = (c.messages || []).map((m) => {
      if (m.id !== messageId) return m;
      // Safety check: Only sender can delete for everyone
      if (m.senderId !== userId) return m;

      return {
        ...m,
        isDeletedForEveryone: true,
        deletedAt: new Date().toISOString()
      };
    });

    return {
      ...c,
      messages: msgs,
      lastMessage: 'This message was deleted'
    };
  });

  saveStoredConversations(updated);
  return updated;
}

// 3. Clear conversation messages for current user
export function clearConversationForUser({ conversations, conversationId, userId }) {
  if (!conversationId || !userId) return conversations || [];
  const list = conversations || getStoredConversations();

  const updated = list.map((c) => {
    if (c.id !== conversationId) return c;

    const msgs = (c.messages || []).map((m) => {
      const currentDeleted = Array.isArray(m.deletedFor) ? m.deletedFor : [];
      if (currentDeleted.includes(userId)) return m;
      return {
        ...m,
        deletedFor: [...currentDeleted, userId]
      };
    });

    return {
      ...c,
      messages: msgs,
      lastMessage: ''
    };
  });

  saveStoredConversations(updated);
  return updated;
}

// 4. Remove / Delete conversation for current user (hides conversation from their list)
export function removeConversationForUser({ conversations, conversationId, userId }) {
  if (!conversationId || !userId) return conversations || [];
  const list = conversations || getStoredConversations();

  const updated = list.map((c) => {
    if (c.id !== conversationId) return c;

    const currentDeleted = Array.isArray(c.deletedFor) ? c.deletedFor : [];
    if (currentDeleted.includes(userId)) return c;

    return {
      ...c,
      deletedFor: [...currentDeleted, userId]
    };
  });

  saveStoredConversations(updated);
  return updated;
}

// Mark conversation as read
export function markConversationAsRead(conversationId, currentUserId) {
  if (!conversationId || !currentUserId) return;
  const stored = getStoredConversations();
  let changed = false;

  const updated = stored.map((c) => {
    if (c.id !== conversationId) return c;

    const unread = c.unreadCounts?.[currentUserId] || 0;
    if (unread > 0 || (c.messages || []).some((m) => m.receiverId === currentUserId && !m.read)) {
      changed = true;
      return {
        ...c,
        unreadCounts: {
          ...(c.unreadCounts || {}),
          [currentUserId]: 0
        },
        unreadFarmer: currentUserId === c.farmerId ? 0 : c.unreadFarmer,
        unreadStudent: currentUserId === c.studentId ? 0 : c.unreadStudent,
        messages: (c.messages || []).map((m) =>
          m.receiverId === currentUserId ? { ...m, read: true } : m
        )
      };
    }
    return c;
  });

  if (changed) {
    saveStoredConversations(updated);
  }
}

// Retrieve all available contacts for "+ New Chat"
export function getAllAvailableContacts(currentUserId) {
  const registeredUsersStr = typeof localStorage !== 'undefined'
    ? localStorage.getItem('farmer_helper_registered_users')
    : null;
  const registered = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];

  const combined = [...PRESET_ROLE_CONTACTS];

  registered.forEach((u) => {
    if (!combined.some((c) => c.id === u.id)) {
      combined.push({
        id: u.id,
        userId: u.id,
        name: u.name,
        role: u.role,
        roleLabelEn: formatRoleName(u.role, true),
        roleLabelHi: formatRoleName(u.role, false),
        phone: u.phone,
        email: u.email,
        location: u.location,
        farmName: u.details?.farmName || u.name
      });
    }
  });

  return combined.filter((c) => c.id !== currentUserId && c.userId !== currentUserId);
}

