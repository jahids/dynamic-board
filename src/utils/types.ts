// Types for the Expo-focused Onboarding SDK

export type ScreenType = 'text' | 'fileUpload' | 'banner';

export interface OnboardingAction {
	type: 'button';
	label: string;
	color: string;
	background: string;
	target: string; // screen id or 'end'
}

export interface OnboardingContent {
	title: string;
	subtitle?: string;
	color: string;
	background: string;
	fontSize?: 'xl' | 'lg' | 'md' | 'sm';
	size?: 'xl' | 'lg' | 'md' | 'sm';
}

export interface OnboardingScreen {
	id: string;
	type: ScreenType;
	content: OnboardingContent;
	actions: OnboardingAction[];
}

export interface OnboardingData {
	_id: string;
	appId: string;
	screens: OnboardingScreen[];
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface ApiEnvelope {
	success: boolean;
	data?: OnboardingData;
	error?: { message?: string };
}

export type CollectedData = Record<
	string,
	{
		screenId: string;
		actionClicked: string;
		timestamp: string;
		fileUploaded?: string;
		fileMeta?: { name: string; type?: string; size?: number; uri?: string };
	}
>;

export interface OnboardingProps {
	appId: string;
	baseUrl?: string; // default http://192.168.0.105:3000/onboarding
	onFinish?: (data: CollectedData) => void;
}

export interface FetchOptions {
	baseUrl?: string;
	timeoutMs?: number;
}

export interface PickedFileResult {
	success: boolean;
	fileName?: string;
	error?: string;
}
