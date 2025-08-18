import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import {
	Action,
	AnalyticsAction,
	ApiAction,
	CollectedData,
	Element,
	FinishAction,
	NavigateAction,
	OnboardingConfig,
	OnboardingProps,
	OnboardingScreen,
	RequestPermissionAction,
	ToastAction,
	ValidateAction,
} from './utils/types';
import { fetchOnboardingConfig } from './utils/api';
import { ScreenRenderer } from './screens';

export default function Onboarding({ appId, baseUrl, onFinish }: OnboardingProps) {
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [config, setConfig] = React.useState<OnboardingConfig | null>(null);
	const [currentScreenId, setCurrentScreenId] = React.useState<string | null>(null);
	const [collected, setCollected] = React.useState<CollectedData>({ appId, values: {}, events: [] });

	React.useEffect(() => {
		let mounted = true;
		setLoading(true);
		setError(null);
		const fetchOptions = baseUrl ? { baseUrl } : {};
		fetchOnboardingConfig(appId, fetchOptions)
			.then((data) => {
				if (!mounted) return;
				setConfig(data);
				const start = pickStartScreenId(data);
				setCurrentScreenId(start);
			})
			.catch((e) => {
				if (!mounted) return;
				setError(e?.message || 'Failed to load onboarding');
			})
			.finally(() => {
				if (mounted) setLoading(false);
			});
		return () => {
			mounted = false;
		};
	}, [appId, baseUrl]);

	const recordEvent = React.useCallback((screenId: string, action: string, elementId?: string, meta?: Record<string, unknown>) => {
		setCollected((prev) => {
			const base = { screenId, action, timestamp: new Date().toISOString() } as { screenId: string; action: string; timestamp: string; elementId?: string; meta?: Record<string, unknown> };
			if (elementId) base.elementId = elementId;
			if (meta) base.meta = meta;
			return { ...prev, events: [...prev.events, base] };
		});
	}, []);

	const setValue = React.useCallback((name: string, value: unknown) => {
		setCollected((prev) => ({ ...prev, values: { ...prev.values, [name]: value as never } }));
	}, []);

	const getCurrentScreen = (): OnboardingScreen | null => {
		if (!config || !currentScreenId) return null;
		return config.screens.find((s) => s.id === currentScreenId) || null;
	};

	const processActions = async (screen: OnboardingScreen, element: Element | null, actions: Action[] | undefined) => {
		if (!actions || actions.length === 0) return;
		for (const a of actions) {
			if ((a as ValidateAction).type === 'validate') {
				const fields = (a as ValidateAction).fields || [];
				const missing = fields.filter((f) => {
					const v = collected.values[f];
					return v === undefined || v === null || (typeof v === 'string' && v.trim().length === 0);
				});
				if (missing.length) {
					recordEvent(screen.id, 'validate_failed', element?.id, { missing });
					continue;
				}
				recordEvent(screen.id, 'validate_ok', element?.id, { fields });
				continue;
			}
			if ((a as AnalyticsAction).type === 'analytics') {
				recordEvent(screen.id, (a as AnalyticsAction).event, element?.id);
				continue;
			}
			if ((a as ApiAction).type === 'api') {
				const api = a as ApiAction;
				try {
					const url = template(api.request.url, { baseUrl: baseUrl ?? '', appId });
					const res = await fetch(url, {
						method: api.request.method,
						headers: api.request.headers,
						body: api.request.body ? JSON.stringify(api.request.body) : undefined,
					} as RequestInit);
					if (!res.ok) throw new Error(`HTTP ${res.status}`);
					recordEvent(screen.id, 'api_success', element?.id, { url });
					if (api.onSuccess) await processActions(screen, element, [api.onSuccess]);
				} catch (err) {
					recordEvent(screen.id, 'api_error', element?.id, { message: (err as Error).message });
					if (api.onError) await processActions(screen, element, [api.onError]);
				}
				continue;
			}
			if ((a as ToastAction).type === 'toast') {
				recordEvent(screen.id, 'toast', element?.id, { message: (a as ToastAction).message });
				continue;
			}
			if ((a as RequestPermissionAction).type === 'requestPermission') {
				recordEvent(screen.id, 'permission_requested', element?.id, { permissions: (a as RequestPermissionAction).permissions });
				continue;
			}
			if ((a as NavigateAction).type === 'navigate') {
				const target = (a as NavigateAction).target;
				const exists = config?.screens.some((s) => s.id === target);
				if (exists) setCurrentScreenId(target);
				recordEvent(screen.id, 'navigate', element?.id, { target });
				continue;
			}
			if ((a as FinishAction).type === 'finish') {
				const payload = { ...collected };
				recordEvent(screen.id, 'finish', element?.id);
				onFinish?.(payload);
				continue;
			}
		}
	};

	const onElementPress = async (element: Element) => {
		const screen = getCurrentScreen();
		if (!screen) return;
		await processActions(screen, element, element.actions);
	};

	if (loading) {
		return (
			<View style={styles.center}> 
				<ActivityIndicator size="large" color="#007AFF" />
				<Text style={styles.muted}>Loading onboarding...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.center}>
				<Text style={styles.error}>Error: {error}</Text>
			</View>
		);
	}

	if (!config || !config.screens.length || !currentScreenId) {
		return (
			<View style={styles.center}>
				<Text style={styles.muted}>No onboarding screens available</Text>
			</View>
		);
	}

	const current = config.screens.find((s) => s.id === currentScreenId)!;
	return (
		<ScreenRenderer
			config={config}
			screen={current}
			values={collected.values}
			setValue={setValue}
			onElementPress={onElementPress}
		/>
	);
}

const styles = StyleSheet.create({
	center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
	muted: { color: '#666', marginTop: 12 },
	error: { color: '#d32f2f' },
});

function pickStartScreenId(config: OnboardingConfig): string {
	const v = config.abTest?.[0]?.startScreen;
	if (v && config.screens.some((s) => s.id === v)) return v;
	return config.screens[0]?.id || '';
}

function template(input: string, vars: Record<string, string>): string {
	return input.replace(/\{\{(.*?)\}\}/g, (_, key) => vars[(key as string).trim()] ?? '');
}
