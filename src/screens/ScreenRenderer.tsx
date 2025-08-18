import { View, ScrollView, StyleSheet } from 'react-native';
import { Element, OnboardingConfig, OnboardingScreen } from '../utils/types';
import { renderElement } from './elements';

interface Props {
	config: OnboardingConfig;
	screen: OnboardingScreen;
	values: Record<string, unknown>;
	setValue: (name: string, value: unknown) => void;
	onElementPress: (element: Element) => void;
}

export default function ScreenRenderer({ config, screen, values, setValue, onElementPress }: Props) {
	const Container: any = screen.layout?.scroll ? ScrollView : View;
	const padding = screen.layout?.padding ?? 16;
	const align = screen.layout?.align ?? 'stretch';
	const bgColor = screen.background?.color ?? config.theme?.colors?.background ?? '#FFFFFF';

	return (
		<Container style={[styles.container, { backgroundColor: bgColor }]} contentContainerStyle={screen.layout?.scroll ? { padding } : undefined}>
			<View style={[styles.inner, { padding, alignItems: mapAlignToFlex(align) }]}>
				{screen.elements.map((el) => (
					<View key={el.id} style={styles.block}>{renderElement({ element: el, values, setValue, onPress: () => onElementPress(el) })}</View>
				))}
			</View>
		</Container>
	);
}

function mapAlignToFlex(a: string | undefined) {
	switch (a) {
		case 'left':
			return 'flex-start';
		case 'right':
			return 'flex-end';
		case 'center':
			return 'center';
		default:
			return 'stretch';
	}
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	inner: { flexGrow: 1 },
	block: { marginBottom: 16 },
});


