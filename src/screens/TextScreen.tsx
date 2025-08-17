import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OnboardingAction, OnboardingContent } from '../utils/types';

interface Props {
	content: OnboardingContent;
	actions: OnboardingAction[];
	onAction: (action: OnboardingAction) => void;
}

export default function TextScreen({ content, actions, onAction }: Props) {
	return (
		<View style={[styles.container, { backgroundColor: content.background }]}>
			<View style={styles.center}>
				<Text style={[styles.title, { color: content.color }]}>{content.title}</Text>
				{content.subtitle ? (
					<Text style={[styles.subtitle, { color: content.color }]}>{content.subtitle}</Text>
				) : null}
			</View>
			<View style={styles.actions}>
				{actions.map((a, idx) => (
					<TouchableOpacity key={idx} style={[styles.button, { backgroundColor: a.background }]} onPress={() => onAction(a)}>
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
	title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
	subtitle: { fontSize: 16, textAlign: 'center' },
	actions: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 32 },
	button: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
	buttonText: { fontSize: 16, fontWeight: '600' },
});
