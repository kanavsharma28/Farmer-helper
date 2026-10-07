// ─── Student Portal: Training & Workshops Data & Persistence Layer ────────────
// Dedicated learning module for short-term agriculture skills, workshops, webinars,
// certifications, and hands-on farm masterclasses (distinct from longer internships).

export const TRAINING_REGISTRATIONS_KEY = 'farmer_helper_training_registrations';
export const TRAINING_SAVED_KEY = 'farmer_helper_saved_training';
export const TRAINING_UPDATE_EVENT = 'farmer_helper_training_updated';

// ── 12 Required Training Categories ──────────────────────────────────────────
export const TRAINING_CATEGORIES = [
  { id: 'all', emoji: '🏛️', labelEn: 'All Programs', labelHi: 'सभी कार्यक्रम' },
  { id: 'crop_management', emoji: '🌾', labelEn: 'Crop Management', labelHi: 'फसल प्रबंधन' },
  { id: 'organic_farming', emoji: '🌿', labelEn: 'Organic Farming', labelHi: 'जैविक खेती' },
  { id: 'modern_agri', emoji: '🌱', labelEn: 'Modern Agriculture', labelHi: 'आधुनिक कृषि' },
  { id: 'agri_tech', emoji: '🤖', labelEn: 'Agri-Tech & IoT', labelHi: 'कृषि तकनीक व आईओटी' },
  { id: 'soil_fertilizer', emoji: '🧪', labelEn: 'Soil & Fertilizer', labelHi: 'मृदा व उर्वरक' },
  { id: 'irrigation', emoji: '💧', labelEn: 'Irrigation & Water', labelHi: 'सिंचाई व जल प्रबंधन' },
  { id: 'farm_machinery', emoji: '🚜', labelEn: 'Farm Machinery', labelHi: 'कृषि यंत्र व संचालन' },
  { id: 'pest_management', emoji: '🛡️', labelEn: 'Pest Management', labelHi: 'कीट व रोग प्रबंधन' },
  { id: 'agri_business', emoji: '📈', labelEn: 'Agri-Business', labelHi: 'कृषि व्यवसाय व मंडी' },
  { id: 'digital_agri', emoji: '💻', labelEn: 'Digital Agriculture', labelHi: 'डिजिटल कृषि' },
  { id: 'career_skills', emoji: '🎓', labelEn: 'Career & Skills', labelHi: 'करियर व कौशल' },
];

export const TRAINING_MODES = [
  { id: 'all', labelEn: 'All Modes', labelHi: 'सभी माध्यम' },
  { id: 'Online', labelEn: 'Online Webinar', labelHi: 'ऑनलाइन वेबिनार', icon: 'devices' },
  { id: 'Offline', labelEn: 'Offline Hands-on', labelHi: 'ऑफलाइन व्यावहारिक', icon: 'location_on' },
  { id: 'Hybrid', labelEn: 'Hybrid Program', labelHi: 'हाइब्रिड (दोनों)', icon: 'hub' },
];

export const TRAINING_LEVELS = [
  { id: 'all', labelEn: 'All Levels', labelHi: 'सभी स्तर' },
  { id: 'Beginner', labelEn: 'Beginner', labelHi: 'शुरुआती' },
  { id: 'Intermediate', labelEn: 'Intermediate', labelHi: 'मध्यम' },
  { id: 'Advanced', labelEn: 'Advanced', labelHi: 'उन्नत' },
];

// ── Comprehensive Master Training & Workshops Dataset ────────────────────────
export const TRAINING_PROGRAMS = [
  {
    id: 'train-01',
    title: 'Modern Polyhouse & Hydroponics 7-Day Bootcamp',
    titleHi: 'आधुनिक पॉलीहाउस एवं हाइड्रोपोनिक्स 7-दिवसीय बूटकैंप',
    badge: '7-Day Intensive Bootcamp',
    badgeColor: 'bg-secondary-container/40 text-on-secondary-container',
    category: 'modern_agri',
    categoryLabelEn: 'Modern Agriculture',
    categoryLabelHi: 'आधुनिक कृषि',
    type: 'bootcamp',
    mode: 'Offline',
    skillLevel: 'Intermediate',
    fee: '₹1,500',
    isFree: false,
    description: 'Learn climate-controlled farming, nutrient dosing formulas, drip layout setup, and high-yield cherry tomato / bell pepper harvesting.',
    descriptionHi: 'पॉलीहाउस में नियंत्रित वातावरण खेती, पोषक तत्व घोल निर्माण, ड्रिप प्रणाली और शिमला मिर्च-चेरी टमाटर की उच्च उपज खेती सीखें।',
    overview: 'This comprehensive 7-day residential bootcamp offers hands-on operational training inside commercial polyhouses. Students learn structure fabrication, ventilation controls, substrate selection (cocopeat + perlite), and automated nutrient dosing.',
    location: 'Lucknow Center, Uttar Pradesh',
    address: 'UP State Horticulture & Greenhouse Research Station, Rehmankhera, Lucknow',
    dates: '12 Oct - 18 Oct 2026',
    date: '2026-10-12',
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    duration: '7 Days (Daily 9 AM - 4 PM)',
    seatsLeft: 18,
    totalSeats: 30,
    registeredCount: 12,
    accreditation: 'Authorized by UP State Agri Board',
    provider: 'UP State Agricultural Development Council',
    organizerName: 'UP State Agricultural Development Council',
    organizerRole: 'institution',
    instructorId: 'inst_dr_sharma',
    instructorName: 'Dr. V. K. Sharma',
    instructorBio: 'Senior Protected Cultivation Specialist with 20+ years of greenhouse consulting across North India.',
    icon: 'nature_people',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    certificateAvailable: true,
    certificateStatus: 'Certificate Eligible',
    certificateTitle: 'Certified Polyhouse & Hydroponics Practitioner',
    registrationDeadline: '10 Oct 2026',
    eligibility: 'Open to B.Sc/M.Sc Agriculture, Horticulture, Botany students, and progressive young farmers',
    includes: 'Course kit, protective gear, lunch, and study manual',
    onlineLink: '',
    whatYouWillLearn: [
      'Live assembly and structure calculation for high-tunnel polyhouses',
      'Nutrient dosing A/B solutions preparation and EC/pH sensor balancing',
      'Irrigation automation and misting system maintenance',
      'Field visit to 10-acre commercial export greenhouse facility',
      'Detailed economics, capital subsidy calculation, and bankable project DPR'
    ],
    topicsCovered: [
      'Greenhouse engineering and poly-film physics',
      'Coco-peat conditioning and sterilization',
      'Nutrient Film Technique (NFT) and Dutch Bucket systems',
      'Integrated pest management in closed enclosures',
      'Harvesting, grading, and cold chain handling'
    ],
    highlights: [
      'Live assembly of high-tunnel polyhouse structures',
      'Nutrient dosing A/B solutions preparation and EC/pH balancing',
      'Field visit to 10-acre commercial export greenhouse',
      'Official certificate co-signed by State Horticulture Directorate'
    ]
  },
  {
    id: 'train-02',
    title: 'Soil Health Card & Bio-inputs Masterclass',
    titleHi: 'मृदा स्वास्थ्य कार्ड एवं जैव-उर्वरक मास्टरक्लास',
    badge: 'Government Sponsored Workshop',
    badgeColor: 'bg-primary-fixed text-on-primary-fixed-variant',
    category: 'soil_fertilizer',
    categoryLabelEn: 'Soil & Fertilizer',
    categoryLabelHi: 'मृदा व उर्वरक',
    type: 'workshop',
    mode: 'Offline',
    skillLevel: 'Beginner',
    fee: 'FREE',
    isFree: true,
    description: 'Hands-on chemical and digital soil sample collection, NPK micro-nutrient testing, and on-farm bio-fertilizer production kits.',
    descriptionHi: 'मिट्टी के नमूने लेने की वैज्ञानिक विधि, डिजिटल मृदा परीक्षण किट संचालन और खेत पर जैविक खाद निर्माण का व्यावहारिक प्रशिक्षण।',
    overview: 'Supported by ICAR and Department of Agriculture, this 3-day practical program trains students to operate digital soil testing mini-labs (Mrida Parikshak) and interpret Soil Health Cards for farmers.',
    location: 'Meerut Krishi Vigyan Kendra, UP',
    address: 'Sardar Vallabhbhai Patel University of Agriculture Campus, Modipuram, Meerut',
    dates: '20 Oct - 22 Oct 2026',
    date: '2026-10-20',
    startTime: '10:00 AM',
    endTime: '03:30 PM',
    duration: '3 Days (Full-time)',
    seatsLeft: 8,
    totalSeats: 25,
    registeredCount: 17,
    accreditation: 'Supported by Department of Agriculture & ICAR',
    provider: 'Krishi Vigyan Kendra (KVK) Meerut',
    organizerName: 'Krishi Vigyan Kendra (KVK) Meerut',
    organizerRole: 'kvk',
    instructorId: 'user_farmer_01',
    instructorName: 'Dr. Suresh Patel & Rajesh Kumar (Lead Farmer)',
    instructorBio: 'Principal Scientist (Soil Health, ICAR) partnering with progressive farmer Rajesh Kumar for on-field validation.',
    icon: 'science',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    certificateAvailable: true,
    certificateStatus: 'Certificate Eligible',
    certificateTitle: 'Soil Testing Technician & Soil Health Analyst',
    registrationDeadline: '18 Oct 2026',
    eligibility: 'B.Sc/M.Sc Agriculture, Rural Development, or active agri-diploma students',
    includes: 'Complimentary digital soil test starter kit, field manual, and soil sampling auger',
    onlineLink: '',
    whatYouWillLearn: [
      'GPS-tagged zigzag soil core sampling methodology across varied field contours',
      'Rapid optical and colorimetric testing of Nitrogen, Phosphorus, Potassium and Organic Carbon',
      'Preparation of bio-inoculants: Trichoderma, Rhizobium, and Phosphate Solubilizing Bacteria (PSB)',
      'Interpreting Soil Health Card data into customized fertilizer recommendations'
    ],
    topicsCovered: [
      'Soil physical properties and infiltration test',
      'Electronic EC/pH calibration',
      'Secondary and micronutrient deficiency identification',
      'Commercial production of vermicompost and liquid bio-fertilizers'
    ],
    highlights: [
      'GPS-tagged zigzag soil core sampling methodology',
      'Rapid testing using digital Soil Health diagnostic kits',
      'Preparation of Trichoderma, Rhizobium, and PSB bio-cultures',
      'Govt Certificate enabling community soil testing kiosks'
    ]
  },
  {
    id: 'train-03',
    title: 'Agri-Drone Pilot & Micro-Spraying Masterclass',
    titleHi: 'कृषि ड्रोन पायलट एवं सूक्ष्म छिड़काव प्रशिक्षण',
    badge: 'DGCA Aligned Certification',
    badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
    category: 'agri_tech',
    categoryLabelEn: 'Agri-Tech & IoT',
    categoryLabelHi: 'कृषि तकनीक व आईओटी',
    type: 'training',
    mode: 'Hybrid',
    skillLevel: 'Intermediate',
    fee: '₹2,500',
    isFree: false,
    description: 'Simulator and live open-field drone flight training, nozzle calibration for pesticide reduction, and drone maintenance protocols.',
    descriptionHi: 'सिम्युलेटर व खेत में ड्रोन उड़ान प्रशिक्षण, नोजल कैलिब्रेशन और फसल पर 80% पानी की बचत के साथ कीटनाशक छिड़काव तकनीक।',
    overview: 'Conducted jointly with certified drone instructors, this hybrid 5-day course includes 2 days of online aerodynamics & DGCA regulation lectures, followed by 3 days of intensive field flight hours in Karnal.',
    location: 'Karnal Demo Farm, Haryana (Field) + Online Live',
    address: 'National Agri-Tech Flight Park, Sector 4, Karnal, Haryana',
    dates: '25 Oct - 29 Oct 2026',
    date: '2026-10-25',
    startTime: '09:30 AM',
    endTime: '04:30 PM',
    duration: '5 Days (Hybrid)',
    seatsLeft: 12,
    totalSeats: 20,
    registeredCount: 8,
    accreditation: 'Certified by Drone Federation of India & Agri Skill Council',
    provider: 'Bharat Drones Agricultural Center',
    organizerName: 'Bharat Drones Agricultural Center',
    organizerRole: 'institution',
    instructorId: 'inst_capt_rao',
    instructorName: 'Capt. R. S. Rao & Eng. Ananya Sen',
    instructorBio: 'DGCA Certified Drone Flight Instructor with 1,200+ agricultural spraying flight hours.',
    icon: 'flight_takeoff',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    certificateAvailable: true,
    certificateStatus: 'Certificate Eligible',
    certificateTitle: 'Agricultural Drone Operations Specialist',
    registrationDeadline: '22 Oct 2026',
    eligibility: '10+2 / Diploma / Degree in any discipline with minimum 18 years of age (Aadhaar required)',
    includes: 'Flight simulator license, pilot logbook, PPE safety kit, and lunch on field days',
    onlineLink: 'https://meet.farmerhelper.in/drone-pilot-cohort',
    whatYouWillLearn: [
      '10+ hours on DGCA certified agricultural flight simulators with varied wind/obstacle profiles',
      'Precision droplet spray calibration for 80% water and 30% chemical savings',
      'LiPo smart battery maintenance, safety precautions, and fail-safe Return-to-Launch (RTL)',
      'Multispectral crop health mapping (NDVI) to detect stress before it is visible to human eyes'
    ],
    topicsCovered: [
      'Aviation regulations and airspace classification in India',
      'Centrifugal atomizers and ultra-low-volume nozzles',
      'Mission planning software (QGroundControl & DroneDeploy)',
      'Field battery charging and generator handling'
    ],
    highlights: [
      '10+ hours on DGCA certified agricultural flight simulators',
      'Precision droplet spray calibration for 80% water savings',
      'Battery safety, fail-safe RTL procedures, and maintenance',
      'Assistance in applying for Remote Pilot Certificate (RPC)'
    ]
  },
  {
    id: 'train-04',
    title: 'Commercial Dairy Herd Management & Quality Testing',
    titleHi: 'व्यावसायिक डेयरी प्रबंधन एवं दुग्ध गुणवत्ता परीक्षण',
    badge: 'NDRI Adjacent Masterclass',
    badgeColor: 'bg-secondary-container text-on-secondary-container',
    category: 'agri_business',
    categoryLabelEn: 'Agri-Business',
    categoryLabelHi: 'कृषि व्यवसाय व मंडी',
    type: 'training',
    mode: 'Offline',
    skillLevel: 'Beginner',
    fee: '₹1,200',
    isFree: false,
    description: 'Modern automated milking operations, silage preparation, veterinary first aid, and adulteration testing in raw milk.',
    descriptionHi: 'स्वचालित मिल्किंग मशीन संचालन, साइलेज (हरा चारा संरक्षण), प्राथमिक पशु चिकित्सा और दूध में मिलावट जांच का प्रशिक्षण।',
    overview: 'Organized with the Progressive Dairy Farmers Association, this course equips students with practical herd management skills: computerized milk recording, estrus detection, and hygienic cold-chain logistics.',
    location: 'Ludhiana Dairy Complex, Punjab',
    address: 'PDFA Training Farm, Jagraon Road, Ludhiana, Punjab',
    dates: '02 Nov - 06 Nov 2026',
    date: '2026-11-02',
    startTime: '08:30 AM',
    endTime: '01:30 PM',
    duration: '5 Days (Morning & Evening sessions)',
    seatsLeft: 14,
    totalSeats: 30,
    registeredCount: 16,
    accreditation: 'Endorsed by Punjab Dairy Development Board',
    provider: 'Progressive Dairy Farmers Association (PDFA)',
    organizerName: 'Progressive Dairy Farmers Association (PDFA)',
    organizerRole: 'institution',
    instructorId: 'inst_dr_dhillon',
    instructorName: 'Dr. H. S. Dhillon (Senior Dairy Vet)',
    instructorBio: 'Former Chief Veterinary Officer with 25 years in livestock nutrition and dairy farm automation.',
    icon: 'pets',
    image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    certificateAvailable: true,
    certificateStatus: 'Certificate Eligible',
    certificateTitle: 'Certified Commercial Dairy Manager',
    registrationDeadline: '30 Oct 2026',
    eligibility: 'Students of Dairy, Veterinary, Agriculture, Biotechnology, or prospective dairy entrepreneurs',
    includes: 'Daily dairy product testing samples, herd health checklist, and certificate',
    onlineLink: '',
    whatYouWillLearn: [
      'Hands-on operation of herringbone & tandem milking machines with CIP sanitization',
      'Silage bunker preparation with high-energy corn and lactic acid inoculants',
      'Electronic milk fat and SNF testing with ultrasonic Milkotesters and adulteration kits',
      'Preventive disease management, CMT California Mastitis testing, and biosecurity'
    ],
    topicsCovered: [
      'Cattle and buffalo breed identification & selective breeding',
      'Total Mixed Ration (TMR) formulation for high yielders',
      'Calf rearing and colostrum feeding protocols',
      'Milk chilling units and bulk milk cooler (BMC) sanitation'
    ],
    highlights: [
      'Hands-on operation of herringbone & tandem milking machines',
      'Silage pit preparation with corn and inoculants',
      'Electronic milk fat and SNF testing with Milkotester',
      'Preventive disease management and mastitis screening'
    ]
  },
  {
    id: 'train-05',
    title: 'Natural & Zero-Budget Organic Farming Workshop',
    titleHi: 'प्राकृतिक एवं शून्य बजट जैविक खेती कार्यशाला',
    badge: 'Hands-on Field Workshop',
    badgeColor: 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30',
    category: 'organic_farming',
    categoryLabelEn: 'Organic Farming',
    categoryLabelHi: 'जैविक खेती',
    type: 'workshop',
    mode: 'Offline',
    skillLevel: 'Beginner',
    fee: 'FREE',
    isFree: true,
    description: 'Learn preparation of Jeevamrit, Beejamrit, neemastra, crop mulching, and PGS-India organic certification documentation.',
    descriptionHi: 'जीवामृत, बीजामृत, नीमास्त्र तैयार करना, आच्छादन (मल्चिंग) और पीजीएस-इंडिया जैविक प्रमाणीकरण के नियमों की पूरी समझ।',
    overview: 'Hosted directly at Rajesh Kumar’s certified natural farm in Meerut, this practical masterclass demonstrates how students can establish chemical-free farming models with local indigenous cow inputs.',
    location: 'Meerut Model Farm, Uttar Pradesh',
    address: 'Sharma Krishi Natural Farm, Kharkhauda Block, Meerut, UP',
    dates: '16 Oct 2026',
    date: '2026-10-16',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    duration: '1 Day (4 Hours Practical)',
    seatsLeft: 10,
    totalSeats: 35,
    registeredCount: 25,
    accreditation: 'Farmer Helper Farmer-to-Student Mentorship',
    provider: 'Sharma Krishi Model Farm',
    organizerName: 'Rajesh Kumar (Lead Progressive Farmer)',
    organizerRole: 'farmer',
    instructorId: 'user_farmer_01',
    instructorName: 'Rajesh Kumar (Farmer / Training Provider)',
    instructorBio: 'Award-winning natural farmer with 10+ years experience in bio-inputs and multi-layer cropping.',
    icon: 'eco',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a46?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    certificateAvailable: true,
    certificateStatus: 'Certificate Eligible',
    certificateTitle: 'Natural Farming Field Apprentice Certificate',
    registrationDeadline: '15 Oct 2026',
    eligibility: 'All college students interested in sustainable agriculture and organic certification',
    includes: 'Live preparation kit, natural farm lunch, and organic recipe guide',
    onlineLink: '',
    whatYouWillLearn: [
      'Live formulation of Jeevamrit (liquid culture) and Ghanjeevamrit (solid)',
      'Seed protection using cow-urine and lime-based Beejamrit',
      'Intercropping legumes to naturally fix atmospheric nitrogen',
      'Understanding the PGS-India group certification paper trail for farmers'
    ],
    topicsCovered: [
      'Four pillars of natural farming (Jeevamrit, Beejamrit, Acchadana, Whapasa)',
      'Botanical pest repellents: Agniastra, Brahmastra, Dashparni ark',
      'Direct-to-consumer organic marketing and premium pricing',
      'Soil biology and earthworm activity enhancement'
    ],
    highlights: [
      'Direct on-farm training by progressive farmer Rajesh Kumar',
      'Live preparation of Jeevamrit and botanical extracts',
      'Free participation for student members',
      'Networking with local organic growers'
    ]
  },
  {
    id: 'train-06',
    title: 'Precision Micro-Irrigation & Solar Pumping Webinar',
    titleHi: 'सूक्ष्म सिंचाई एवं सोलर पंपिंग राष्ट्रीय वेबिनार',
    badge: 'National Online Webinar',
    badgeColor: 'bg-blue-500/15 text-blue-800 border border-blue-500/30',
    category: 'irrigation',
    categoryLabelEn: 'Irrigation & Water',
    categoryLabelHi: 'सिंचाई व जल प्रबंधन',
    type: 'webinar',
    mode: 'Online',
    skillLevel: 'Beginner',
    fee: 'FREE',
    isFree: true,
    description: 'Design principles for inline drip systems, venturi injectors for fertigation, and solar PV water pumping economics.',
    descriptionHi: 'ड्रिप सिंचाई डिजाइन, वेंच्युरी फर्टिगेशन तकनीक और पीएम-कुसुम सोलर पंप के तकनीकी व आर्थिक पहलुओं पर ऑनलाइन वेबिनार।',
    overview: 'Join leading agricultural engineers from Jain Irrigation and PM-KUSUM consultants for a live interactive webinar covering hydraulic design, dripper spacing, filtration systems, and solar pump sizing.',
    location: 'Online (Live Zoom / Google Meet)',
    address: 'Virtual Interactive Webinar Platform',
    dates: '24 Oct 2026',
    date: '2026-10-24',
    startTime: '03:00 PM',
    endTime: '05:30 PM',
    duration: '2.5 Hours (Online Live)',
    seatsLeft: 120,
    totalSeats: 250,
    registeredCount: 130,
    accreditation: 'Supported by National Water Mission & Agri University Network',
    provider: 'AgriTech Water Innovations Forum',
    organizerName: 'AgriTech Water Innovations Forum',
    organizerRole: 'institution',
    instructorId: 'inst_eng_mehta',
    instructorName: 'Er. Alok Mehta (Chief Irrigation Architect)',
    instructorBio: 'Micro-irrigation consultant with projects across Rajasthan, Maharashtra, and Uttar Pradesh.',
    icon: 'water_drop',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    certificateAvailable: true,
    certificateStatus: 'Certificate Eligible',
    certificateTitle: 'Digital Certificate in Micro-Irrigation Design',
    registrationDeadline: '23 Oct 2026',
    eligibility: 'Open to all students, faculty, and young agriculturalists across India',
    includes: 'Digital slide decks, irrigation sizing calculators (Excel), and e-certificate',
    onlineLink: 'https://meet.farmerhelper.in/micro-irrigation-mastery',
    whatYouWillLearn: [
      'Hydraulic calculation of flow rate, head loss, and pressure regulation in drip lines',
      'Selection of screen, disc, and sand media filters based on water source quality',
      'Fertigation scheduling with Venturi and fertilizer dosing tanks',
      'Solar PV array calculation for 3HP, 5HP, and 7.5HP submersible pumps under PM-KUSUM'
    ],
    topicsCovered: [
      'Inline vs online PC drippers for orchards vs row crops',
      'Acid treatment for chemical unclogging of emitters',
      'Automation valves with moisture sensor feedback',
      'Subsidies and state portal application processes'
    ],
    highlights: [
      'Live Q&A with top irrigation design engineers',
      'Excel-based drip design tool provided free to attendees',
      'Instant e-certificate upon webinar completion',
      'Interactive polls and real-world farm case studies'
    ]
  },
  {
    id: 'train-07',
    title: 'Integrated Pest Management (IPM) & Biological Controls',
    titleHi: 'एकीकृत कीट प्रबंधन (आईपीएम) एवं जैविक नियंत्रण',
    badge: 'ICAR Accredited Workshop',
    badgeColor: 'bg-emerald-500/15 text-emerald-800',
    category: 'pest_management',
    categoryLabelEn: 'Pest Management',
    categoryLabelHi: 'कीट व रोग प्रबंधन',
    type: 'workshop',
    mode: 'Hybrid',
    skillLevel: 'Intermediate',
    fee: '₹500',
    isFree: false,
    description: 'Pheromone traps, yellow sticky cards, entomopathogenic fungi (Beauveria bassiana), and safe chemical timing for pesticide reduction.',
    descriptionHi: 'फेरोमोन ट्रैप, जैविक फफूंद (ब्यूवेरिया बासियाना) का प्रयोग और कीटनाशकों का न्यूनतम व सुरक्षित उपयोग सीखने की कार्यशाला।',
    overview: 'Practical workshop focusing on reducing chemical residue in food crops. Students scout field plots, identify predatory insects vs pest larvae, and deploy biocontrol agents.',
    location: 'Pantnagar Research Field, Uttarakhand + Online',
    address: 'College of Agriculture, GB Pant University, Pantnagar',
    dates: '28 Oct - 30 Oct 2026',
    date: '2026-10-28',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    duration: '3 Days',
    seatsLeft: 15,
    totalSeats: 40,
    registeredCount: 25,
    accreditation: 'National Institute of Plant Health Management (NIPHM)',
    provider: 'Plant Protection Society of India',
    organizerName: 'Plant Protection Society of India',
    organizerRole: 'institution',
    instructorId: 'inst_dr_priya',
    instructorName: 'Dr. Priya Nambiar (Senior Entomologist)',
    instructorBio: 'IPM trainer specializing in cotton bollworm and fall armyworm biological control.',
    icon: 'pest_control',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    certificateAvailable: true,
    certificateStatus: 'Certificate Eligible',
    certificateTitle: 'Certified IPM Field Scout',
    registrationDeadline: '26 Oct 2026',
    eligibility: 'Agriculture, Entomology, Zoology, and Horticulture students',
    includes: 'Insect identification pocket guide, hand magnifier, and certificate',
    onlineLink: 'https://meet.farmerhelper.in/ipm-scouting-workshop',
    whatYouWillLearn: [
      'Identification of natural beneficial predators: Ladybird beetles, Chrysoperla, and spiders',
      'Standard Economic Threshold Levels (ETL) for key Indian rabi crops',
      'Mass multiplication of Beauveria bassiana and Metarhizium anisopliae',
      'Safe sprayer calibration and drift reduction technologies'
    ],
    topicsCovered: [
      'Pest surveillance protocols and trap density per hectare',
      'Resistance management against synthetic insecticides',
      'Bio-safety and residue testing guidelines (MRL limits)',
      'Farmer advisory preparation using mobile scouting apps'
    ],
    highlights: [
      'Real field scouting inside university experimental plots',
      'Microscope identification sessions in entomology laboratory',
      'Complimentary pocket magnifier and insect guide',
      'Certification recognized by agri-input companies'
    ]
  },
  {
    id: 'train-08',
    title: 'Agri-Business Startup & FPO Management Bootcamp',
    titleHi: 'कृषि व्यवसाय स्टार्टअप एवं एफपीओ प्रबंधन बूटकैंप',
    badge: 'NABARD Aligned Program',
    badgeColor: 'bg-purple-500/15 text-purple-800 border border-purple-500/30',
    category: 'agri_business',
    categoryLabelEn: 'Agri-Business',
    categoryLabelHi: 'कृषि व्यवसाय व मंडी',
    type: 'bootcamp',
    mode: 'Online',
    skillLevel: 'Intermediate',
    fee: 'FREE',
    isFree: true,
    description: 'Farmer Producer Organization (FPO) formation, business plan drafting, cold-storage finance under AIF, and direct mandi linkages.',
    descriptionHi: 'एफपीओ गठन, एग्री-स्टार्टअप बिजनेस प्लान निर्माण, कृषि अवसंरचना कोष (AIF) और प्रत्यक्ष मंडी लिंकेज पर केंद्रित ऑनलाइन बूटकैंप।',
    overview: 'This 2-day weekend bootcamp empowers agriculture students to venture into entrepreneurship: establishing FPOs, collective procurement of inputs, value addition, and raising collateral-free loans.',
    location: 'Online Live Interactive Program',
    address: 'Virtual Startup Incubator Hall',
    dates: '07 Nov - 08 Nov 2026',
    date: '2026-11-07',
    startTime: '10:00 AM',
    endTime: '01:30 PM',
    duration: '2 Days (3.5 Hours/Day)',
    seatsLeft: 60,
    totalSeats: 150,
    registeredCount: 90,
    accreditation: 'Supported by National Agri-Business Incubator',
    provider: 'Agripreneurs Bharat Network',
    organizerName: 'Agripreneurs Bharat Network',
    organizerRole: 'institution',
    instructorId: 'inst_sanjay_verma',
    instructorName: 'Sanjay Verma (FPO Advisor & Angel Investor)',
    instructorBio: 'Helped incubate 45+ FPOs across Uttar Pradesh and Bihar with cumulative ₹18 Cr turnover.',
    icon: 'business_center',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    certificateAvailable: true,
    certificateStatus: 'Certificate Eligible',
    certificateTitle: 'Agri-Business & FPO Management Certificate',
    registrationDeadline: '05 Nov 2026',
    eligibility: 'All college students, MBA Agri-Business candidates, and prospective founders',
    includes: 'Startup pitch deck template, FPO bylaws handbook, and financial model sheet',
    onlineLink: 'https://meet.farmerhelper.in/fpo-startup-bootcamp',
    whatYouWillLearn: [
      'Step-by-step company registration for Producer Companies under Companies Act',
      'Drafting bankable Detailed Project Reports (DPR) for Agriculture Infrastructure Fund (AIF)',
      'Designing primary processing lines (sorting, grading, packaging) for pulses and grains',
      'Negotiating purchase contracts with wholesale institutional buyers'
    ],
    topicsCovered: [
      'Equity grant and credit guarantee schemes by SFAC and NABARD',
      'Working capital management and GST compliance in agricultural trade',
      'Digital e-NAM portal trading and electronic warehouse receipts (e-NWR)',
      'Pitching to impact angel investors and venture capital funds'
    ],
    highlights: [
      'Free participation with complete financial model templates',
      'Live pitch session with feedback from angel investors',
      'Opportunity to intern with high-growth agri-startups',
      'Verified digital credential for your LinkedIn profile'
    ]
  }
];

// ── LocalStorage Registration & Saved Items Helpers ──────────────────────────

export function getStoredTrainingPrograms() {
  return TRAINING_PROGRAMS;
}

export function getTrainingById(id) {
  return TRAINING_PROGRAMS.find((p) => p.id === id) || null;
}

export function getStudentRegistrations(studentId) {
  try {
    const raw = localStorage.getItem(TRAINING_REGISTRATIONS_KEY);
    if (!raw) {
      // Seed initial sample registrations for demo student Aman Verma
      const initial = [
        {
          id: 'reg_demo_01',
          trainingId: 'train-02',
          trainingTitle: 'Soil Health Card & Bio-inputs Masterclass',
          studentId: 'user_student_01',
          studentName: 'Aman Verma',
          studentEmail: 'aman.verma@agriuni.ac.in',
          studentPhone: '9812345678',
          college: 'GB Pant University of Agriculture',
          course: 'B.Sc Agriculture (Hons)',
          registeredAt: '2026-09-20T10:00:00Z',
          mode: 'Offline',
          location: 'Meerut Krishi Vigyan Kendra, UP',
          date: '20 Oct - 22 Oct 2026',
          status: 'Confirmed',
          statusHi: 'पुष्टि हुई',
          tabStatus: 'upcoming',
          certificateStatus: 'Certificate Eligible',
          certificateId: '',
          onlineLink: '',
        },
        {
          id: 'reg_demo_02',
          trainingId: 'train-05',
          trainingTitle: 'Natural & Zero-Budget Organic Farming Workshop',
          studentId: 'user_student_01',
          studentName: 'Aman Verma',
          studentEmail: 'aman.verma@agriuni.ac.in',
          studentPhone: '9812345678',
          college: 'GB Pant University of Agriculture',
          course: 'B.Sc Agriculture (Hons)',
          registeredAt: '2026-09-05T14:30:00Z',
          mode: 'Offline',
          location: 'Sharma Krishi Model Farm, Meerut, UP',
          date: '10 Sep 2026',
          status: 'Completed',
          statusHi: 'सफलतापूर्वक पूर्ण',
          tabStatus: 'completed',
          certificateStatus: 'Certificate Issued',
          certificateId: 'FH-CERT-NAT-2026-8941',
          issuedDate: '12 Sep 2026',
          onlineLink: '',
        }
      ];
      localStorage.setItem(TRAINING_REGISTRATIONS_KEY, JSON.stringify(initial));
      return initial.filter((r) => !studentId || r.studentId === studentId);
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r) => !studentId || r.studentId === studentId);
  } catch (err) {
    console.error('Error reading training registrations:', err);
    return [];
  }
}

export function registerForTraining({ trainingId, studentUser, notes = '' }) {
  if (!trainingId || !studentUser?.id) return { success: false, error: 'Missing required registration details' };

  try {
    const raw = localStorage.getItem(TRAINING_REGISTRATIONS_KEY);
    const existing = raw ? JSON.parse(raw) : [];

    // Duplicate registration prevention check
    const alreadyRegistered = existing.some(
      (r) => r.trainingId === trainingId && r.studentId === studentUser.id && r.status !== 'Cancelled'
    );

    if (alreadyRegistered) {
      return {
        success: false,
        error: 'You are already registered for this training program.',
        alreadyRegistered: true,
      };
    }

    const training = getTrainingById(trainingId);
    if (!training) {
      return { success: false, error: 'Training program not found' };
    }

    const newRegistration = {
      id: `reg_${Date.now()}`,
      trainingId,
      trainingTitle: training.title,
      studentId: studentUser.id,
      studentName: studentUser.name || 'Aman Verma',
      studentEmail: studentUser.email || 'student@agriuni.ac.in',
      studentPhone: studentUser.phone || '9812345678',
      college: studentUser.details?.college || 'Agricultural University',
      course: studentUser.details?.course || 'B.Sc Agriculture',
      registeredAt: new Date().toISOString(),
      mode: training.mode,
      location: training.location,
      date: training.dates || training.date,
      status: 'Confirmed',
      statusHi: 'पुष्टि हुई',
      tabStatus: 'upcoming',
      certificateStatus: training.certificateAvailable ? 'Certificate Eligible' : 'No Certificate',
      certificateId: '',
      onlineLink: training.onlineLink || '',
      notes,
    };

    const updated = [newRegistration, ...existing];
    localStorage.setItem(TRAINING_REGISTRATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(TRAINING_UPDATE_EVENT, { detail: { newRegistration } }));

    return { success: true, registration: newRegistration };
  } catch (err) {
    console.error('Error recording training registration:', err);
    return { success: false, error: 'Registration could not be completed. Please try again.' };
  }
}

export function cancelRegistration(registrationId, studentId) {
  try {
    const raw = localStorage.getItem(TRAINING_REGISTRATIONS_KEY);
    if (!raw) return false;
    const existing = JSON.parse(raw);
    const updated = existing.map((r) => {
      if (r.id === registrationId && (!studentId || r.studentId === studentId)) {
        return {
          ...r,
          status: 'Cancelled',
          statusHi: 'रद्द किया गया',
          tabStatus: 'cancelled',
        };
      }
      return r;
    });

    localStorage.setItem(TRAINING_REGISTRATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(TRAINING_UPDATE_EVENT, { detail: { cancelledId: registrationId } }));
    return true;
  } catch (err) {
    console.error('Error cancelling registration:', err);
    return false;
  }
}

export function isStudentRegistered(trainingId, studentId) {
  if (!trainingId || !studentId) return false;
  const registrations = getStudentRegistrations(studentId);
  return registrations.some((r) => r.trainingId === trainingId && r.status !== 'Cancelled');
}

// ── Saved Training Programs (Bookmarks) ──────────────────────────────────────

export function getSavedTrainingIds(studentId) {
  try {
    const raw = localStorage.getItem(TRAINING_SAVED_KEY);
    if (!raw) return ['train-01']; // seed one bookmark
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed[studentId] || [];
    }
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (err) {
    console.error('Error reading saved training IDs:', err);
    return [];
  }
}

export function toggleSaveTraining(trainingId, studentId) {
  if (!trainingId || !studentId) return false;
  try {
    const raw = localStorage.getItem(TRAINING_SAVED_KEY);
    let store = {};
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && !Array.isArray(parsed)) store = parsed;
      } catch {
        store = {};
      }
    }
    const currentList = store[studentId] || [];
    const isSaved = currentList.includes(trainingId);
    let nextList;
    if (isSaved) {
      nextList = currentList.filter((id) => id !== trainingId);
    } else {
      nextList = [trainingId, ...currentList];
    }
    store[studentId] = nextList;
    localStorage.setItem(TRAINING_SAVED_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent(TRAINING_UPDATE_EVENT, { detail: { studentId, savedIds: nextList } }));
    return !isSaved; // returns new saved status
  } catch (err) {
    console.error('Error toggling saved training:', err);
    return false;
  }
}

export function isTrainingSaved(trainingId, studentId) {
  const ids = getSavedTrainingIds(studentId);
  return ids.includes(trainingId);
}
