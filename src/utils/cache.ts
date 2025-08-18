// Caching disabled initially (no-op). Kept for future extension.
import { OnboardingConfig } from './types';

export async function setCachedConfig(_: string, __: OnboardingConfig): Promise<void> {
	return;
}

export async function getCachedConfig(_: string): Promise<OnboardingConfig | null> {
	return null;
}

export async function clearCacheFor(_: string): Promise<void> {
	return;
}
