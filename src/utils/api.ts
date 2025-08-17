import { ApiEnvelope, OnboardingData, FetchOptions } from './types';

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

function buildUrl(baseUrl: string, appId: string): string {
	const trimmed = baseUrl.replace(/\/+$/, '');
	const encodedId = encodeURIComponent(appId);
	// If baseUrl already ends with the appId, use as-is
	if (trimmed.endsWith(`/${encodedId}`)) return trimmed;
	return `${trimmed}/${encodedId}`;
}

export async function fetchOnboardingConfig(appId: string, options: FetchOptions = {}): Promise<OnboardingData> {
	const baseUrl = options.baseUrl || DEFAULT_BASE_URL;
	const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT;

	if (!appId || !appId.trim()) {
		throw new Error('Invalid appId');
	}

	const url = buildUrl(baseUrl, appId);
	try {
		const res = await withTimeout(fetch(url, { headers: { Accept: 'application/json' } }), timeoutMs);
		if (!('ok' in res) || !(res as Response).ok) {
			throw new Error(`HTTP ${(res as Response).status}`);
		}
		const json = (await (res as Response).json()) as ApiEnvelope;
		if (!json.success || !json.data || !Array.isArray(json.data.screens)) {
			throw new Error('Invalid response');
		}
		return json.data;
	} catch (err) {
		// Fallback to local fakedb when network/format error occurs
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
			console.warn('[onboarding-sdk] Falling back to bundled fakeDB.json due to error:', (err as Error)?.message);
			return fake;
		}
		throw err;
	}
}
