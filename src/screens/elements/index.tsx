import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import {
	Element,
	TextElement,
	ImageElement,
	ButtonElement,
	InputElement,
	FileUploadElement,
	MultiSelectElement,
	ProgressElement,
	CarouselElement,
	PermissionListElement,
	BannerElement,
} from '../../utils/types';

interface Ctx {
	values: Record<string, unknown>;
	setValue: (name: string, value: unknown) => void;
	onPress: () => void;
}

export function renderElement({ element, values, setValue, onPress }: { element: Element } & Ctx) {
	switch (element.type) {
		case 'text':
			return <TextEl el={element} />;
		case 'image':
			return <ImageEl el={element} />;
		case 'button':
			return <ButtonEl el={element} onPress={onPress} />;
		case 'input':
			return <InputEl el={element} values={values} setValue={setValue} />;
		case 'fileUpload':
			return <FileUploadEl el={element} setValue={setValue} />;
		case 'multiSelect':
			return <MultiSelectEl el={element} values={values} setValue={setValue} />;
		case 'progress':
			return <ProgressEl el={element} values={values} />;
		case 'carousel':
			return <CarouselEl el={element} />;
		case 'permissionList':
			return <PermissionListEl el={element} />;
		case 'banner':
			return <BannerEl el={element} />;
		default:
			return null;
	}
}

function TextEl({ el }: { el: TextElement }) {
	const variant = el.props.variant || 'body';
	const color = el.props.color || '#222222';
	const align = el.props.align || 'left';
	return <Text style={[styles[`text_${variant}`], { color, textAlign: align as any }]}>{el.props.text}</Text>;
}

function ImageEl({ el }: { el: ImageElement }) {
	const height = el.props.height ?? 180;
	return <Image source={{ uri: el.props.uri }} style={{ width: '100%', height, resizeMode: el.props.resizeMode || 'contain', borderRadius: 8 }} />;
}

function ButtonEl({ el, onPress }: { el: ButtonElement; onPress: () => void }) {
	const bg = el.props.background || '#007AFF';
	const color = el.props.color || '#ffffff';
	const size = el.props.size || 'md';
	return (
		<TouchableOpacity onPress={onPress} style={[styles.button, sizeStyles(size), { backgroundColor: bg }]}> 
			<Text style={[styles.buttonText, { color }]}>{el.props.label}</Text>
		</TouchableOpacity>
	);
}

function InputEl({ el, values, setValue }: { el: InputElement; values: Record<string, unknown>; setValue: (n: string, v: unknown) => void }) {
	const v = (values[el.props.name] as string) ?? '';
	return (
		<View>
			{el.props.label ? <Text style={styles.label}>{el.props.label}</Text> : null}
			<TextInput
				style={styles.input}
				placeholder={el.props.placeholder}
				keyboardType={el.props.keyboardType as any}
				value={v}
				onChangeText={(t: string) => setValue(el.props.name, t)}
			/>
		</View>
	);
}

function FileUploadEl({ el, setValue }: { el: FileUploadElement; setValue: (n: string, v: unknown) => void }) {
	const [fileName, setFileName] = React.useState<string | undefined>();
	const pick = async () => {
		try {
			// Lazy import to avoid requiring expo doc picker in web envs
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const DocumentPicker = require('expo-document-picker');
			const res = await DocumentPicker.getDocumentAsync({ type: el.props.accept?.join(',') || '*/*', copyToCacheDirectory: true });
			let asset: any | null = null;
			if (res?.assets?.length) asset = res.assets[0];
			else if (res?.type === 'success') asset = res;
			else if (res?.canceled || res?.type === 'cancel') return;
			if (asset) {
				const name = asset.name || asset.file?.name || 'Selected file';
				setFileName(name);
				setValue(el.props.name, { name: asset.name, type: asset.mimeType || asset.type, size: asset.size, uri: asset.uri });
			}
		} catch {}
	};
	return (
		<TouchableOpacity onPress={pick} style={[styles.button, { backgroundColor: '#007AFF' }]}>
			<Text style={[styles.buttonText, { color: '#fff' }]}>{fileName ? `✓ ${fileName}` : el.props.label || 'Choose File'}</Text>
		</TouchableOpacity>
	);
}

function MultiSelectEl({ el, values, setValue }: { el: MultiSelectElement; values: Record<string, unknown>; setValue: (n: string, v: unknown) => void }) {
	const selected = (values[el.props.name] as string[]) || [];
	const toggle = (opt: string) => {
		const next = selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt];
		setValue(el.props.name, next);
	};
	return (
		<View>
			{el.props.label ? <Text style={styles.label}>{el.props.label}</Text> : null}
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
				{el.props.options.map((opt) => (
					<TouchableOpacity key={opt} onPress={() => toggle(opt)} style={[styles.chip, selected.includes(opt) ? styles.chipActive : undefined]}>
						<Text style={styles.chipText}>{opt}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}

function ProgressEl({ el, values }: { el: ProgressElement; values: Record<string, unknown> }) {
	// Minimal linear progress representation using a view
	const val = resolveExprNumber(el.props.valueExpr, values) ?? 0;
	const max = el.props.max ?? 100;
	const pct = Math.max(0, Math.min(1, val / max));
	return (
		<View style={styles.progressBar}>
			<View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
		</View>
	);
}

function CarouselEl({ el }: { el: CarouselElement }) {
	// Simple static carousel placeholder: stack first slide
	const slide = el.props.slides[0];
	return (
		<View>
			{slide?.image ? <Image source={{ uri: slide.image }} style={{ width: '100%', height: 140, borderRadius: 8 }} /> : null}
			{slide?.caption ? <Text style={{ marginTop: 8, textAlign: 'center' }}>{slide.caption}</Text> : null}
		</View>
	);
}

function PermissionListEl({ el }: { el: PermissionListElement }) {
	return (
		<View>
			{el.props.items.map((it) => (
				<View key={it.permission} style={{ marginBottom: 12 }}>
					<Text style={styles.h3}>{it.title}</Text>
					{it.subtitle ? <Text style={{ color: '#666' }}>{it.subtitle}</Text> : null}
				</View>
			))}
		</View>
	);
}

function BannerEl({ el }: { el: BannerElement }) {
	return (
		<View style={[styles.banner, { backgroundColor: el.props.background }]}>
			<Text style={[styles.bannerTitle, { color: el.props.color }]}>{el.props.title}</Text>
			{el.props.subtitle ? <Text style={[styles.bannerSubtitle, { color: el.props.color }]}>{el.props.subtitle}</Text> : null}
		</View>
	);
}

function resolveExprNumber(expr: string, values: Record<string, unknown>): number | undefined {
	try {
		const parts = expr.split('.');
		let ref: any = values;
		for (const p of parts) ref = ref?.[p];
		if (typeof ref === 'number') return ref;
		if (typeof ref === 'string') {
			const n = Number(ref);
			if (!isNaN(n)) return n;
		}
		return undefined;
	} catch {
		return undefined;
	}
}

function sizeStyles(size: string) {
	switch (size) {
		case 'sm':
			return { paddingVertical: 8, paddingHorizontal: 12 };
		case 'lg':
			return { paddingVertical: 14, paddingHorizontal: 22 };
		case 'xl':
			return { paddingVertical: 16, paddingHorizontal: 26 };
		default:
			return { paddingVertical: 12, paddingHorizontal: 18 };
	}
}

const styles = StyleSheet.create({
	label: { marginBottom: 6, color: '#222', fontWeight: '600' },
	input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#fff' },
	button: { borderRadius: 12, alignItems: 'center' },
	buttonText: { fontWeight: '700' },
	chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', marginRight: 8, marginBottom: 8 },
	chipActive: { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' },
	chipText: { color: '#111827' },
	progressBar: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 999, overflow: 'hidden' },
	progressFill: { height: '100%', backgroundColor: '#007AFF' },
	text_h1: { fontSize: 28, fontWeight: '800' },
	text_h2: { fontSize: 24, fontWeight: '700' },
	text_h3: { fontSize: 20, fontWeight: '700' },
	text_body: { fontSize: 16 },
	text_caption: { fontSize: 13, color: '#6b7280' },
	h3: { fontSize: 18, fontWeight: '700' },
	banner: { padding: 16, borderRadius: 12, alignItems: 'center' },
	bannerTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
	bannerSubtitle: { fontSize: 14, textAlign: 'center' },
});


