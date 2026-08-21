export interface AppMetadata {
  title: string;
  shortDescription: string;
  longDescription: string;
  appType: string;
  category: string;
  tags: string[];
  privacyPolicyUrl: string;
  privacyPolicyText: string;
}

export interface Tester {
  id: string;
  name: string;
  email: string;
  deviceType: string;
  status: 'Active' | 'Opted-In' | 'Pending';
  joinDate: string;
  checkInDates: string[];
}

export interface TesterFeedback {
  id: string;
  testerName: string;
  testerEmail: string;
  date: string;
  rating: number;
  comment: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface ReleaseAsset {
  id: string;
  name: string;
  url: string;
  size: number;
  width: number;
  height: number;
  validationStatus: 'valid' | 'invalid' | 'warning';
  type: 'icon' | 'feature' | 'screenshot_phone' | 'screenshot_tablet';
}

export interface ProductionReleaseInfo {
  bundleName: string;
  bundleSize: string;
  versionName: string;
  versionCode: number;
  targetSdk: string;
  countries: string[];
  recruitmentDetails: string;
  optInDetails: string;
  feedbackChangesDetails: string;
}
