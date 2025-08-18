// Types for the new multi-element, screen-based Onboarding SDK

// Element Types
export type ElementType =
	| 'text'
	| 'image'
	| 'button'
	| 'input'
	| 'fileUpload'
	| 'multiSelect'
	| 'progress'
	| 'carousel'
	| 'permissionList'
|	'banner';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type AlignOption = 'left' | 'center' | 'right' | 'stretch';

// Element Props
export interface TextProps {
	text: string;
	variant?: TextVariant;
	color?: string;
	align?: AlignOption;
}

export interface ImageProps {
	uri: string;
	height?: number;
	resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

export interface ButtonProps {
	label: string;
	background?: string;
	color?: string;
	size?: ButtonSize;
	leadingIcon?: string;
}

export interface InputProps {
	label: string;
	name: string;
	placeholder?: string;
	keyboardType?:
		| 'default'
		| 'number-pad'
		| 'decimal-pad'
		| 'numeric'
		| 'email-address'
		| 'phone-pad';
	required?: boolean;
}

export interface FileUploadProps {
	label: string;
	name: string;
	accept?: string[];
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface MultiSelectProps {
	label: string;
	name: string;
	options: string[];
}

export interface ProgressProps {
	valueExpr: string; // e.g. "progress.profile"
	max?: number;
}

export interface CarouselSlide {
	image: string;
	caption?: string;
}

export interface CarouselProps {
	autoplay?: boolean;
	interval?: number;
	slides: CarouselSlide[];
}

export interface PermissionListItem {
	permission: string;
	title: string;
	subtitle?: string;
}

export interface PermissionListProps {
	items: PermissionListItem[];
}

export interface BannerProps {
	title: string;
	subtitle?: string;
	background: string;
	color: string;
}

// Element Union
export interface BaseElement<T extends ElementType, P> {
	id: string;
	type: T;
	props: P;
	actions?: Action[];
}

export type TextElement = BaseElement<'text', TextProps>;
export type ImageElement = BaseElement<'image', ImageProps>;
export type ButtonElement = BaseElement<'button', ButtonProps>;
export type InputElement = BaseElement<'input', InputProps>;
export type FileUploadElement = BaseElement<'fileUpload', FileUploadProps>;
export type MultiSelectElement = BaseElement<'multiSelect', MultiSelectProps>;
export type ProgressElement = BaseElement<'progress', ProgressProps>;
export type CarouselElement = BaseElement<'carousel', CarouselProps>;
export type PermissionListElement = BaseElement<'permissionList', PermissionListProps>;
export type BannerElement = BaseElement<'banner', BannerProps>;

export type Element =
	| TextElement
	| ImageElement
	| ButtonElement
	| InputElement
	| FileUploadElement
	| MultiSelectElement
	| ProgressElement
	| CarouselElement
	| PermissionListElement
	| BannerElement;

// Actions
export interface NavigateAction { type: 'navigate'; target: string }
export interface ValidateAction { type: 'validate'; fields: string[] }
export interface AnalyticsAction { type: 'analytics'; event: string }
export interface ApiAction {
	type: 'api';
	request: {
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		url: string; // may contain templates like {{baseUrl}}
		body?: Record<string, unknown>;
		headers?: Record<string, string>;
	};
	onSuccess?: Action;
	onError?: ToastAction | NavigateAction;
}
export interface ToastAction { type: 'toast'; message: string }
export interface RequestPermissionAction { type: 'requestPermission'; permissions: string[] }
export interface FinishAction { type: 'finish' }

export type Action =
	| NavigateAction
	| ValidateAction
	| AnalyticsAction
	| ApiAction
	| ToastAction
	| RequestPermissionAction
	| FinishAction;

// Screen
export interface ScreenLayout {
	scroll?: boolean;
	padding?: number;
	align?: AlignOption;
}

export interface ScreenBackground { color?: string }

export interface OnboardingScreen {
	id: string;
	name?: string;
	layout?: ScreenLayout;
	background?: ScreenBackground;
	elements: Element[];
}

// Theme
export interface Theme {
	colors?: {
		primary?: string;
		background?: string;
		text?: string;
		muted?: string;
		success?: string;
		danger?: string;
	};
	fonts?: {
		heading?: string;
		body?: string;
	};
}

// AB Test
export interface AbTestVariant { variant: string; weight: number; startScreen: string }

// Root Config
export interface OnboardingConfigMeta { ttlSeconds?: number; updatedAt?: string }

export interface OnboardingConfig {
	appId: string;
	configId?: string;
	version?: number;
	locale?: string;
	meta?: OnboardingConfigMeta;
	theme?: Theme;
	abTest?: AbTestVariant[];
	screens: OnboardingScreen[];
}

// Fetching
export interface ApiEnvelope<T> {
	success: boolean;
	data?: T;
	error?: { message?: string };
}

export interface FetchOptions {
	baseUrl?: string;
	timeoutMs?: number;
}

// Props and Collected Data
export interface OnboardingProps {
	appId: string;
	baseUrl?: string; // e.g. http://192.168.0.105:3000/onboarding
	onFinish?: (data: CollectedData) => void;
}

export type CollectedValue =
	| string
	| number
	| boolean
	| string[]
	| { name: string; type?: string; size?: number; uri?: string }
	| null;

export interface CollectedDataEvent {
	screenId: string;
	elementId?: string;
	action: string;
	timestamp: string;
	meta?: Record<string, unknown>;
}

export interface CollectedData {
	appId: string;
	configId?: string;
	values: Record<string, CollectedValue>;
	events: CollectedDataEvent[];
}

export interface PickedFileResult {
	success: boolean;
	fileName?: string;
	error?: string;
}
