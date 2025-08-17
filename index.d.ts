import { ComponentType } from 'react';

export interface OnboardingScreenProps {
  configUrl?: string;
  onComplete?: (data: any) => void;
}

export const OnboardingScreen: ComponentType<OnboardingScreenProps>;

declare const _default: ComponentType<OnboardingScreenProps>;
export default _default;
