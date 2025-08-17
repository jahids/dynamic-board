import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingData } from './types';

const MEM = new Map<string, string>();
const TTL_MS = 60 * 60 * 1000; // 1 hour

function getExpiryKey(key: string) {
	return `${key}::exp`;
}

export async function setCachedConfig(key: string, data: OnboardingData): Promise<void> {
	const payload = JSON.stringify(data);
	const exp = (Date.now() + TTL_MS).toString();
	try {
		await AsyncStorage?.setItem(key, payload);
		await AsyncStorage?.setItem(getExpiryKey(key), exp);
	} catch {
		MEM.set(key, payload);
		MEM.set(getExpiryKey(key), exp);
	}
}

export async function getCachedConfig(key: string): Promise<OnboardingData | null> {
	try {
		const expStr = (await AsyncStorage?.getItem(getExpiryKey(key))) ?? MEM.get(getExpiryKey(key)) ?? '';
		const exp = Number(expStr || 0);
		if (!exp || Date.now() > exp) return null;
		const raw = (await AsyncStorage?.getItem(key)) ?? MEM.get(key);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

export async function clearCacheFor(key: string): Promise<void> {
	try {
		await AsyncStorage?.removeItem(key);
		await AsyncStorage?.removeItem(getExpiryKey(key));
	} catch {
		MEM.delete(key);
		MEM.delete(getExpiryKey(key));
	}
}
