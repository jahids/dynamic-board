// Main SDK exports

// Core client functions
export { 
  getOnboardingData, 
  isOnboardingSuccess, 
  getOnboardingErrorMessage 
} from './client';

// React hooks
export { useOnboarding } from './hooks';

// TypeScript types
export type {
  OnboardingData,
  OnboardingScreen,
  OnboardingAction,
  OnboardingContent,
  OnboardingConfig,
  OnboardingError,
  OnboardingResponse,
  UseOnboardingOptions,
  UseOnboardingResult,
} from './types';

// Default export for convenience
export { getOnboardingData as default } from './client';

