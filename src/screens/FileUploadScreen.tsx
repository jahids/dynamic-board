import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { OnboardingAction, OnboardingContent } from '../utils/types';

interface Props {
	content: OnboardingContent;
	actions: OnboardingAction[];
	onAction: (action: OnboardingAction, fileName?: string, fileMeta?: { name: string; type?: string; size?: number; uri?: string }) => void;
}

export default function FileUploadScreen({ content, actions, onAction }: Props) {
	const [fileName, setFileName] = React.useState<string | undefined>();
	const [fileMeta, setFileMeta] = React.useState<{ name: string; type?: string; size?: number; uri?: string } | undefined>();

	const pick = async () => {
		try {
			const res: any = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
			let asset: any | null = null;
			if (res?.assets?.length) {
				asset = res.assets[0];
			} else if (res?.type === 'success') {
				asset = res;
			} else if (res?.canceled || res?.type === 'cancel') {
				return;
			}

			if (asset) {
				const name = asset.name || asset.file?.name || 'Selected file';
				const uri = asset.uri;
				const size = asset.size;
				const type = asset.mimeType || asset.type;
				setFileName(name);
				setFileMeta({ name, type, size, uri });
				console.log('[onboarding-sdk] picked file:', { name, type, size, uri });
				Alert.alert('Selected', name);
			} else {
				Alert.alert('Error', 'No file selected');
			}
		} catch (e) {
			console.warn('[onboarding-sdk] document pick error:', (e as Error)?.message);
			Alert.alert('Error', 'Failed to pick document');
		}
	};

	const renderPreview = () => {
		if (!fileMeta) return null;
		const type = (fileMeta.type || '').toLowerCase();
		if (type.startsWith('video/')) {
			return <Text style={styles.previewNote}>🎬 Video selected: {fileMeta.name}</Text>;
		}
		if (type.startsWith('audio/')) {
			return <Text style={styles.previewNote}>🎵 Audio selected: {fileMeta.name}</Text>;
		}
		return <Text style={styles.previewNote}>📄 File selected: {fileMeta.name}</Text>;
	};

	return (
		<View style={[styles.container, { backgroundColor: content.background }]}>
			<View style={styles.center}>
				<Text style={[styles.title, { color: content.color }]}>{content.title}</Text>
				{content.subtitle ? (
					<Text style={[styles.subtitle, { color: content.color }]}>{content.subtitle}</Text>
				) : null}
				<TouchableOpacity style={styles.upload} onPress={pick}>
					<Text style={styles.uploadText}>{fileName ? `✓ ${fileName}` : '📁 Choose File'}</Text>
				</TouchableOpacity>
				{renderPreview()}
			</View>
			<View style={styles.actions}>
				{actions.map((a, idx) => (
					<TouchableOpacity key={idx} style={[styles.button, { backgroundColor: a.background }]} onPress={() => onAction(a, fileName, fileMeta)}>
						<Text style={[styles.buttonText, { color: a.color }]}>{a.label}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'space-between', padding: 20 },
	center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
	subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 16 },
	upload: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 12 },
	uploadText: { color: '#fff', fontWeight: '600' },
	previewNote: { marginTop: 8, color: '#666' },
	actions: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 32 },
	button: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
	buttonText: { fontSize: 16, fontWeight: '600' },
});
