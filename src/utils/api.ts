import { ApiEnvelope, OnboardingData, FetchOptions } from './types';
import { getCachedConfig, setCachedConfig } from './cache';

const DEFAULT_BASE_URL = 'http://192.168.0.105:3000/onboarding';
const DEFAULT_TIMEOUT = 10000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	return new Promise((resolve, reject) => {
		const id = setTimeout(() => reject(new Error('timeout')), ms);
		promise
			.then((res) => {
				clearTimeout(id);
				resolve(res);
			})
			.catch((err) => {
				clearTimeout(id);
				reject(err);
			});
	});
}

export async function fetchOnboardingConfig(appId: string, options: FetchOptions = {}): Promise<OnboardingData> {
	const baseUrl = options.baseUrl || DEFAULT_BASE_URL;
	const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT;

	if (!appId || !appId.trim()) {
		throw new Error('Invalid appId');
	}

	// Try cache first
	const cacheKey = `${baseUrl}::${appId}`;
	const cached = await getCachedConfig(cacheKey);
	if (cached) return cached;

	const url = `${baseUrl}/${encodeURIComponent(appId)}`;
	try {
		const res = await withTimeout(fetch(url, { headers: { Accept: 'application/json' } }), timeoutMs);
		if (!('ok' in res) || !(res as Response).ok) {
			throw new Error(`HTTP ${(res as Response).status}`);
		}
		const json = (await (res as Response).json()) as ApiEnvelope;
		if (!json.success || !json.data) {
			throw new Error('Invalid response');
		}
		await setCachedConfig(cacheKey, json.data);
		return json.data;
	} catch (err) {
		// Fallback to local fakedb
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const local = require('../../assets/config/fakeDB.json');
		if (local && local.screens) {
			const fake: OnboardingData = {
				_id: 'local-fake',
				appId,
				screens: local.screens,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				__v: 0,
			};
			await setCachedConfig(cacheKey, fake);
			return fake;
		}
		throw err;
	}
}
