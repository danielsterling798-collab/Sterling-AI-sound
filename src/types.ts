export interface AppMetadata {
  title: string;
  shortDescription: string;
  longDescription: string;
  appType: 'Application' | 'Game';
  category: string;
  tags: string[];
}

export interface ContentRatingAnswers {
  violence: 'none' | 'mild' | 'moderate' | 'intense';
  sexuality: 'none' | 'mild' | 'moderate' | 'intense';
  language: 'none' | 'mild' | 'moderate';
  gambling: boolean;
  userInteraction: boolean;
}

export interface StoreAsset {
  id: string;
  name: string;
  url: string;
  size: number;
  width: number;
  height: number;
  validationStatus: 'pending' | 'valid' | 'invalid';
  validationError?: string;
  type?: 'icon' | 'feature' | 'screenshot_phone' | 'screenshot_tablet';
}

export interface Tester {
  id: string;
  name: string;
  email: string;
  deviceType: 'Android Phone' | 'Android Tablet' | 'Android emulator' | 'Wear OS' | 'ChromeOS';
  status: 'Invited' | 'Registered' | 'Opted-In' | 'Active' | 'Inactive';
  joinDate: string;
  checkInDates: string[]; // dates like "2026-06-10"
}

export interface FeedbackLog {
  id: string;
  testerName: string;
  testerEmail: string;
  date: string;
  rating: number; // 1-5
  comment: string;
  status: 'Open' | 'Resolved' | 'In Progress';
}

export interface ProductionRelease {
  bundleName: string;
  bundleSize: string;
  versionName: string;
  versionCode: number;
  targetSdk: string;
  countries: string[]; // list of country names
  recruitmentDetails: string;
  optInDetails: string;
  feedbackChangesDetails: string;
}

export interface AppPublishState {
  metadata: AppMetadata;
  contentRating: ContentRatingAnswers;
  assets: {
    icon: StoreAsset | null;
    feature: StoreAsset | null;
    screenshotsPhone: StoreAsset[];
    screenshotsTablet: StoreAsset[];
  };
  testers: Tester[];
  feedback: FeedbackLog[];
  release: ProductionRelease;
  currentStep: number; // For step-by-step guidance
  testingStartDate: string; // ISO date or "YYYY-MM-DD" describing when testing period began
}
