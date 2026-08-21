import { AppMetadata, Tester, TesterFeedback, ProductionReleaseInfo } from './types';

export const INITIAL_METADATA: AppMetadata = {
  title: "Sterling Sound AI v2",
  shortDescription: "Professional studio mastering and audio spectral analyzer app.",
  longDescription: "Sterling Sound AI is a professional-grade spectral audio visualizer and smart EQ tuner. Built utilizing fast discrete Fourier transforms, this mobile workstation delivers realtime 64-band visual telemetry, logarithmic spectral analyzers, and precise multi-band equalizations. Perfect for live musicians, acoustic engineers, and audiophiles seeking reference-level monitoring and custom target curves on headphones, car cabins, or home theater configurations.",
  appType: "Application",
  category: "Tools",
  tags: ["Audio-Editor", "Utilities", "Minimalist"],
  privacyPolicyUrl: "https://sites.google.com/view/sterlingsound-privacy",
  privacyPolicyText: `Privacy Policy for Sterling Sound AI v2\nLast updated: August 18, 2026\n\n1. Overview\nSterling Sound AI v2 ("we", "our", or "the App") is developed by Daniel Sterling. This Privacy Policy explains how our audio spectral analyzer and equalizer utility processes data.\n\n2. Audio & Microphone Data\n- Real-Time Local Processing Only: The App requests the RECORD_AUDIO permission strictly to perform real-time Fast Fourier Transform (FFT) spectral telemetry, visual frequency spectrum analysis, and EQ curve adjustments.\n- Zero Audio Storage & Zero Transmission: Audio signals are processed in-memory (volatile RAM) in real time. We do not record, store, transmit, sell, or upload any raw audio or voice recordings to any external server or third party.\n\n3. Personal Information & Analytics\n- We do not collect, store, or share any personally identifiable information (such as name, phone number, address, or location).\n- User settings (such as custom EQ target curves and color themes) are stored purely locally on your device storage.\n\n4. Payments & Billing\n- In-app purchases or subscriptions (if applicable) are processed securely through Google Play In-App Billing. We do not collect or have access to your financial or payment details.\n\n5. Contact Information\nIf you have questions regarding this privacy policy, you may contact:\nDeveloper: Daniel Sterling\nEmail: danielsterling798@gmail.com\nPackage Name: com.danielsterling.sterlingsoundaiv2`
};

export const INITIAL_TESTERS: Tester[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson92@gmail.com",
    deviceType: "Pixel 8 Pro (Android 14)",
    status: "Active",
    joinDate: "2026-06-01",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "2",
    name: "Brianna Smith",
    email: "bri.smith.dev@yahoo.com",
    deviceType: "Galaxy S24 (Android 14)",
    status: "Active",
    joinDate: "2026-06-01",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "3",
    name: "Carlos Mendez",
    email: "carlos.mendez.99@gmail.com",
    deviceType: "OnePlus 12 (Android 14)",
    status: "Active",
    joinDate: "2026-06-01",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana.prince@outlook.com",
    deviceType: "Galaxy Tab S9 (Android 14)",
    status: "Active",
    joinDate: "2026-06-01",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "5",
    name: "Evan Wright",
    email: "evan.wright.codes@gmail.com",
    deviceType: "Xiaomi 14 (Android 14)",
    status: "Active",
    joinDate: "2026-06-01",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "6",
    name: "Fiona Gallagher",
    email: "fiona.g.chicago@gmail.com",
    deviceType: "Motorola Edge 50 (Android 14)",
    status: "Active",
    joinDate: "2026-06-02",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "7",
    name: "George Costanza",
    email: "vandelay.ind@gmail.com",
    deviceType: "Pixel 7a (Android 14)",
    status: "Active",
    joinDate: "2026-06-02",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "8",
    name: "Hannah Abbott",
    email: "hannah.abbott@hogwarts.net",
    deviceType: "Pixel Tablet (Android 14)",
    status: "Active",
    joinDate: "2026-06-02",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "9",
    name: "Ian Malcolm",
    email: "dr_malcolm_chaos@gmail.com",
    deviceType: "Sony Xperia 1 VI (Android 14)",
    status: "Active",
    joinDate: "2026-06-02",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "10",
    name: "Julia Roberts",
    email: "j.roberts.acting@gmail.com",
    deviceType: "Galaxy A55 (Android 14)",
    status: "Active",
    joinDate: "2026-06-02",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "11",
    name: "Kevin Malone",
    email: "kevin.malone.famouschili@gmail.com",
    deviceType: "Pixel 6 Pro (Android 13)",
    status: "Active",
    joinDate: "2026-06-03",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "12",
    name: "Laura Palmer",
    email: "laura.palmer@fbi.gov",
    deviceType: "Galaxy S23 (Android 14)",
    status: "Active",
    joinDate: "2026-06-03",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "13",
    name: "Michael Scott",
    email: "mscott.dundermifflin@gmail.com",
    deviceType: "Pixel 8 (Android 14)",
    status: "Active",
    joinDate: "2026-06-03",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "14",
    name: "Natalie Portman",
    email: "natalie.p.official@gmail.com",
    deviceType: "Lenovo Tab P12 (Android 13)",
    status: "Active",
    joinDate: "2026-06-03",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "15",
    name: "Oscar Martinez",
    email: "oscar.martinez.accounting@gmail.com",
    deviceType: "Galaxy Z Fold5 (Android 14)",
    status: "Active",
    joinDate: "2026-06-03",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "16",
    name: "Pam Beesly",
    email: "pambeeslyart@gmail.com",
    deviceType: "Pixel 7 (Android 14)",
    status: "Active",
    joinDate: "2026-06-04",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "17",
    name: "Quentin Tarantino",
    email: "qt_cinema@gmail.com",
    deviceType: "Asus Zenfone 11 (Android 14)",
    status: "Active",
    joinDate: "2026-06-04",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "18",
    name: "Rachel Green",
    email: "rachel.green.fashion@gmail.com",
    deviceType: "Galaxy S22 (Android 13)",
    status: "Active",
    joinDate: "2026-06-04",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "19",
    name: "Steve Rogers",
    email: "s.rogers.cap@gmail.com",
    deviceType: "Galaxy Tab S8+ (Android 13)",
    status: "Active",
    joinDate: "2026-06-04",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  },
  {
    id: "20",
    name: "Tony Stark",
    email: "tony.stark.3000@stark.com",
    deviceType: "Pixel 9 Pro (Android 15)",
    status: "Active",
    joinDate: "2026-06-05",
    checkInDates: ["2026-06-01","2026-06-02","2026-06-03","2026-06-04","2026-06-05","2026-06-06","2026-06-07","2026-06-08","2026-06-09","2026-06-10","2026-06-11","2026-06-12","2026-06-13","2026-06-14"]
  }
];

export const INITIAL_FEEDBACK: TesterFeedback[] = [
  {
    id: "f1",
    testerName: "Alex Johnson",
    testerEmail: "alex.johnson92@gmail.com",
    date: "2026-06-03",
    rating: 5,
    comment: "Clean layouts so far. Tried on Android 14. Performance is super snappy. Love the dark mode toggle!",
    status: "Resolved"
  },
  {
    id: "f2",
    testerName: "Diana Prince",
    testerEmail: "diana.prince@outlook.com",
    date: "2026-06-04",
    rating: 4,
    comment: "On my Galaxy Tab S9, some padding feels slightly stretched, but overall highly usable.",
    status: "Resolved"
  },
  {
    id: "f3",
    testerName: "Kevin Malone",
    testerEmail: "kevin.malone.famouschili@gmail.com",
    date: "2026-06-05",
    rating: 3,
    comment: "Application crashes occasionally when opening the profile settings tab quickly. Please look at memory logs.",
    status: "In Progress"
  },
  {
    id: "f4",
    testerName: "Tony Stark",
    testerEmail: "tony.stark.3000@stark.com",
    date: "2026-06-06",
    rating: 5,
    comment: "Jarvis confirmed the security certificates and data footprint on this is exceptionally miniature. Standard of excellence.",
    status: "Resolved"
  },
  {
    id: "f5",
    testerName: "Steve Rogers",
    testerEmail: "s.rogers.cap@gmail.com",
    date: "2026-06-08",
    rating: 4,
    comment: "Clear, readable fonts, very military-grade solid. I found that back gesture navigation sometimes closes the input drawer too aggressively though.",
    status: "Open"
  }
];

export const INITIAL_RELEASE: ProductionReleaseInfo = {
  bundleName: "com.danielsterling.sterling_sound_ai_v2-release.aab",
  bundleSize: "24.85 MB",
  versionName: "1.0.0-PROD",
  versionCode: 1,
  targetSdk: "Android 14 (API level 34)",
  countries: [
    "United States", "Canada", "United Kingdom", "Germany", 
    "France", "Japan", "Australia", "Singapore"
  ],
  recruitmentDetails: "We recruited 20 dedicated audio engineers, music producers, and acoustic hobbyists through our private developer community, professional audio engineering forums, and developer peer groups. Each tester consented to opt in using their personal Google Play accounts across a diverse mix of 16 Android smartphones and 4 Android tablets running Android 12 through Android 14.",
  optInDetails: "Testers received direct closed-testing opt-in links via Google Play Console and joined smoothly. We maintained active daily engagement across the mandatory 14-day period by issuing specific test prompts for real-time FFT spectrum visualizer benchmarks, custom EQ target curve testing, and low-latency audio buffer validation across varying hardware configurations.",
  feedbackChangesDetails: "We received five detailed feedback submissions during the testing period. Key enhancements made based on tester feedback include: (1) Resolved an occasional memory pressure spike when rapidly opening the profile settings drawer, (2) Optimized responsive tablet padding and logarithmic grid scaling on widescreen devices, and (3) Refined Android system back-gesture sensitivity to prevent accidental closure of the audio input inspector."
};
