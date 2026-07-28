import { Tester, FeedbackLog } from './types';

export const APP_CATEGORIES = [
  'Art & Design',
  'Auto & Vehicles',
  'Beauty',
  'Books & Reference',
  'Business',
  'Communication',
  'Dating',
  'Education',
  'Entertainment',
  'Events',
  'Finance',
  'Food & Drink',
  'Health & Fitness',
  'House & Home',
  'Lifestyle',
  'Maps & Navigation',
  'Medical',
  'Music & Audio',
  'News & Magazines',
  'Parenting',
  'Personalization',
  'Photography',
  'Productivity',
  'Shopping',
  'Social',
  'Sports',
  'Tools',
  'Travel & Local',
  'Video Players & Editors',
  'Weather'
];

export const GAME_CATEGORIES = [
  'Action',
  'Adventure',
  'Arcade',
  'Board',
  'Card',
  'Casino',
  'Casual',
  'Educational',
  'Music',
  'Puzzle',
  'Racing',
  'Role Playing',
  'Simulation',
  'Sports',
  'Strategy',
  'Trivia',
  'Word'
];

export const PLAY_STORE_TAGS = [
  'Productivity', 'Self-Improvement', 'Utilities', 'Indie', 'Offline-First', 'Widgets', 
  'Ad-Free', 'Privacy-Focused', 'Open-Source', 'Retro', 'Minimalist', 'Customizable',
  'Automation', 'Task-Manager', 'Financial-Planning', 'AI-Assistant', 'Education', 
  'Audio-Editor', 'PDF-Tool', 'Image-Editor', 'Note-Taking', 'Habit-Tracker', 'Multiplayer'
];

export const REGIONS = [
  {
    name: 'North America',
    countries: ['United States', 'Canada', 'Mexico']
  },
  {
    name: 'Europe & UK',
    countries: ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Poland', 'Switzerland']
  },
  {
    name: 'Asia Pacific',
    countries: ['Japan', 'South Korea', 'Australia', 'India', 'Singapore', 'Taiwan', 'New Zealand', 'Vietnam']
  },
  {
    name: 'Latin America',
    countries: ['Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru']
  },
  {
    name: 'Middle East & Africa',
    countries: ['South Africa', 'Saudi Arabia', 'United Arab Emirates', 'Egypt', 'Kenya', 'Nigeria']
  }
];

export const EMAIL_TEMPLATES = [
  {
    id: 'group_invite',
    subject: 'Action Required: Join the Google Testing Group for {AppName}',
    body: `Hello {TesterName},

Thank you for agreeing to test my new app, "{AppName}".

Google Play mandates that we run a continuous 14-day Closed Test with at least 20 active testers before releasing to production. To join my testing program, please follow these simple steps:

1. Join the Google Testing Group:
   Click the link below and select "Join group" with your Google Account ({TesterEmail}):
   https://groups.google.com/g/my-app-testing-group-{AppShort}

2. Opt-in on Google Play:
   After joining the group, click this link to register as an official tester:
   Android: https://play.google.com/store/apps/details?id=com.{AppDomain}.alpha
   Web Web: https://play.google.com/apps/testing/com.{AppDomain}.alpha

Please open the app daily and try out its main features. If you experience any bugs, please log them directly in the testing portal or email me back with screenshots!

Thank you so much!
{DeveloperName}`
  },
  {
    id: 'daily_checkin',
    subject: 'Quick Daily Check-in: {AppName} Closed Testing',
    body: `Hi {TesterName},

This is a quick, automated reminder for Day {DayIndex}/14 of the {AppName} Closed Test!

To help me lock down production approval from Google Play, please:
1. Open the app for 1 to 2 minutes.
2. Check if the latest updates are loading properly.
3. Submit any quick feedback in the App Tester feedback channel.

Our 20-tester status looks solid at the moment, but the Play Console requires continuous daily engagement!

Thanks a million,
{DeveloperName}`
  }
];

export const INITIAL_TESTERS: Tester[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex.johnson92@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-01', checkInDates: Array.from({length: 10}, (_, i) => `2026-06-0${i+1}`) },
  { id: '2', name: 'Brianna Smith', email: 'bri.smith.dev@yahoo.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-01', checkInDates: Array.from({length: 10}, (_, i) => `2026-06-0${i+1}`) },
  { id: '3', name: 'Carlos Mendez', email: 'carlos.mendez.99@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-01', checkInDates: Array.from({length: 9}, (_, i) => `2026-06-0${i+1}`) },
  { id: '4', name: 'Diana Prince', email: 'diana.prince@outlook.com', deviceType: 'Android Tablet', status: 'Active', joinDate: '2026-06-01', checkInDates: Array.from({length: 10}, (_, i) => `2026-06-0${i+1}`) },
  { id: '5', name: 'Evan Wright', email: 'evan.wright.codes@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-01', checkInDates: Array.from({length: 8}, (_, i) => `2026-06-0${i+1}`) },
  { id: '6', name: 'Fiona Gallagher', email: 'fiona.g.chicago@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-02', checkInDates: Array.from({length: 9}, (_, i) => `2026-06-0${i+2}`) },
  { id: '7', name: 'George Costanza', email: 'vandelay.ind@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-02', checkInDates: Array.from({length: 9}, (_, i) => `2026-06-0${i+2}`) },
  { id: '8', name: 'Hannah Abbott', email: 'hannah.abbott@hogwarts.net', deviceType: 'Android Tablet', status: 'Active', joinDate: '2026-06-02', checkInDates: Array.from({length: 9}, (_, i) => `2026-06-0${i+2}`) },
  { id: '9', name: 'Ian Malcolm', email: 'dr_malcolm_chaos@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-02', checkInDates: Array.from({length: 7}, (_, i) => `2026-06-0${i+2}`) },
  { id: '10', name: 'Julia Roberts', email: 'j.roberts.acting@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-02', checkInDates: Array.from({length: 9}, (_, i) => `2026-06-0${i+2}`) },
  { id: '11', name: 'Kevin Malone', email: 'kevin.malone.famouschili@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-03', checkInDates: Array.from({length: 8}, (_, i) => `2026-06-0${i+3}`) },
  { id: '12', name: 'Laura Palmer', email: 'laura.palmer@fbi.gov', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-03', checkInDates: Array.from({length: 8}, (_, i) => `2026-06-0${i+3}`) },
  { id: '13', name: 'Michael Scott', email: 'mscott.dundermifflin@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-03', checkInDates: Array.from({length: 8}, (_, i) => `2026-06-0${i+3}`) },
  { id: '14', name: 'Natalie Portman', email: 'natalie.p.official@gmail.com', deviceType: 'Android Tablet', status: 'Active', joinDate: '2026-06-03', checkInDates: Array.from({length: 8}, (_, i) => `2026-06-0${i+3}`) },
  { id: '15', name: 'Oscar Martinez', email: 'oscar.martinez.accounting@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-03', checkInDates: Array.from({length: 8}, (_, i) => `2026-06-0${i+3}`) },
  { id: '16', name: 'Pam Beesly', email: 'pambeeslyart@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-04', checkInDates: Array.from({length: 7}, (_, i) => `2026-06-0${i+4}`) },
  { id: '17', name: 'Quentin Tarantino', email: 'qt_cinema@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-04', checkInDates: Array.from({length: 7}, (_, i) => `2026-06-0${i+4}`) },
  { id: '18', name: 'Rachel Green', email: 'rachel.green.fashion@gmail.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-04', checkInDates: Array.from({length: 7}, (_, i) => `2026-06-0${i+4}`) },
  { id: '19', name: 'Steve Rogers', email: 's.rogers.cap@gmail.com', deviceType: 'Android Tablet', status: 'Active', joinDate: '2026-06-04', checkInDates: Array.from({length: 7}, (_, i) => `2026-06-0${i+4}`) },
  { id: '20', name: 'Tony Stark', email: 'tony.stark.3000@stark.com', deviceType: 'Android Phone', status: 'Active', joinDate: '2026-06-05', checkInDates: Array.from({length: 6}, (_, i) => `2026-06-0${i+5}`) }
];

export const INITIAL_FEEDBACKS: FeedbackLog[] = [
  { id: 'f1', testerName: 'Alex Johnson', testerEmail: 'alex.johnson92@gmail.com', date: '2026-06-03', rating: 5, comment: 'Clean layouts so far. Tried on Android 14. Performance is super snappy. Love the dark mode toggle!', status: 'Resolved' },
  { id: 'f2', testerName: 'Diana Prince', testerEmail: 'diana.prince@outlook.com', date: '2026-06-04', rating: 4, comment: 'On my Galaxy Tab S9, some padding feels slightly stretched, but overall highly usable.', status: 'Resolved' },
  { id: 'f3', testerName: 'Kevin Malone', testerEmail: 'kevin.malone.famouschili@gmail.com', date: '2026-06-05', rating: 3, comment: 'Application crashes occasionally when opening the profile settings tab quickly. Please look at memory logs.', status: 'In Progress' },
  { id: 'f4', testerName: 'Tony Stark', testerEmail: 'tony.stark.3000@stark.com', date: '2026-06-06', rating: 5, comment: 'Jarvis confirmed the security certificates and data footprint on this is exceptionally miniature. Standard of excellence.', status: 'Resolved' },
  { id: 'f5', testerName: 'Steve Rogers', testerEmail: 's.rogers.cap@gmail.com', date: '2026-06-08', rating: 4, comment: 'Clear, readable fonts, very military-grade solid. I found that back gesture navigation sometimes closes the input drawer too aggressively though.', status: 'Open' }
];
