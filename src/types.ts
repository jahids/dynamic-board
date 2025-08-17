// TypeScript types for Onboarding SDK

export interface OnboardingAction {
  type: 'button';
  label: string;
  color: string;
  background: string;
  target: string;
}

export interface OnboardingContent {
  title: string;
  subtitle?: string;
  color: string;
  background: string;
  fontSize?: 'xl' | 'lg' | 'md' | 'sm';
  size?: 'xl' | 'lg' | 'md' | 'sm';
}

export interface OnboardingScreen {
  id: string;
  type: 'text' | 'fileUpload' | 'banner';
  content: OnboardingContent;
  actions: OnboardingAction[];
}

export interface OnboardingData {
  _id: string;
  appId: string;
  screens: OnboardingScreen[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OnboardingConfig {
  appId: string;
  baseUrl?: string;
  timeout?: number;
}

export interface OnboardingError {
  code: 'NETWORK_ERROR' | 'INVALID_APP_ID' | 'NOT_FOUND' | 'SERVER_ERROR' | 'TIMEOUT' | 'UNKNOWN';
  message: string;
  details?: any;
}

export interface OnboardingResponse {
  success: boolean;
  data?: OnboardingData;
  error?: OnboardingError;
}

// React Hook types
export interface UseOnboardingOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export interface UseOnboardingResult {
  data: OnboardingData | null;
  loading: boolean;
  error: OnboardingError | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}
