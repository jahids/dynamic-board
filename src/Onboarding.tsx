import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import TextScreen from './screens/TextScreen';
import FileUploadScreen from './screens/FileUploadScreen';
import BannerScreen from './screens/BannerScreen';
import { CollectedData, OnboardingProps, OnboardingScreen } from './utils/types';
import { fetchOnboardingConfig } from './utils/api';

export default function Onboarding({ appId, baseUrl, onFinish }: OnboardingProps) {
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [screens, setScreens] = React.useState<OnboardingScreen[]>([]);
	const [index, setIndex] = React.useState(0);
	const [collected, setCollected] = React.useState<CollectedData>({});

	React.useEffect(() => {
		let mounted = true;
		setLoading(true);
		setError(null);
		const fetchOptions = baseUrl ? { baseUrl } : {};
		fetchOnboardingConfig(appId, fetchOptions)
			.then((data) => {
				if (!mounted) return;
				setScreens(data.screens || []);
				setIndex(0);
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

	const onAction = (action: { label: string; target: string }, fileName?: string) => {
		const current = screens[index]!;
		const entry = {
			screenId: current.id,
			actionClicked: action.label,
			timestamp: new Date().toISOString(),
			...(fileName ? { fileUploaded: fileName } : {}),
		};
		setCollected((prev) => ({ ...prev, [current.id]: entry }));

		if (action.target === 'end') {
			const finalData = { ...collected, [current.id]: entry };
			console.log('Onboarding finished. Collected data:', JSON.stringify(finalData, null, 2));
			onFinish?.(finalData);
			return;
		}
		const nextIndex = screens.findIndex((s) => s.id === action.target);
		if (nextIndex !== -1) {
			setIndex(nextIndex);
		}
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

	if (!screens.length) {
		return (
			<View style={styles.center}>
				<Text style={styles.muted}>No onboarding screens available</Text>
			</View>
		);
	}

	const current = screens[index]!;
	switch (current.type) {
		case 'text':
			return <TextScreen content={current.content} actions={current.actions} onAction={(a) => onAction(a)} />;
		case 'fileUpload':
			return <FileUploadScreen content={current.content} actions={current.actions} onAction={(a, f) => onAction(a, f)} />;
		case 'banner':
			return <BannerScreen content={current.content} actions={current.actions} onAction={(a) => onAction(a)} />;
		default:
			return (
				<View style={styles.center}>
					<Text style={styles.error}>Unknown screen type: {current.type}</Text>
				</View>
			);
	}
}

const styles = StyleSheet.create({
	center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
	muted: { color: '#666', marginTop: 12 },
	error: { color: '#d32f2f' },
});
