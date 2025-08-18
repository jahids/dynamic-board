declare module 'react-native' {
	export const View: any;
	export const Text: any;
	export const ActivityIndicator: any;
	export const StyleSheet: { create: (s: any) => any };
	export const TouchableOpacity: any;
	export const Alert: any;
	export const ScrollView: any;
	export const Image: any;
	export const TextInput: any;
}

declare module 'expo-document-picker' {
	export const getDocumentAsync: (...args: any[]) => Promise<any>;
}

declare module '@react-native-async-storage/async-storage' {
	const AsyncStorage: {
		setItem: (key: string, value: string) => Promise<void>;
		getItem: (key: string) => Promise<string | null>;
		removeItem: (key: string) => Promise<void>;
	};
	export default AsyncStorage;
}
