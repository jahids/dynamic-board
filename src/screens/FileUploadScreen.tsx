import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { OnboardingAction, OnboardingContent } from '../utils/types';

interface Props {
	content: OnboardingContent;
	actions: OnboardingAction[];
	onAction: (action: OnboardingAction, fileName?: string) => void;
}

export default function FileUploadScreen({ content, actions, onAction }: Props) {
	const [fileName, setFileName] = React.useState<string | undefined>();

	const pick = async () => {
		try {
			const res = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
			if (res.type === 'success') {
				setFileName(res.name);
				Alert.alert('Selected', res.name);
			}
		} catch (e) {
			Alert.alert('Error', 'Failed to pick document');
		}
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
			</View>
			<View style={styles.actions}>
				{actions.map((a, idx) => (
					<TouchableOpacity key={idx} style={[styles.button, { backgroundColor: a.background }]} onPress={() => onAction(a, fileName)}>
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
	actions: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 32 },
	button: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
	buttonText: { fontSize: 16, fontWeight: '600' },
});
