// Caching disabled initially (no-op). Kept for future extension.
import { OnboardingData } from './types';

export async function setCachedConfig(_: string, __: OnboardingData): Promise<void> {
	return;
}

export async function getCachedConfig(_: string): Promise<OnboardingData | null> {
	return null;
}

export async function clearCacheFor(_: string): Promise<void> {
	return;
}
