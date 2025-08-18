# react-onboarding-sdk

Mobile-first, Expo-focused onboarding SDK for React Native apps. Fetches multi-element onboarding flows from your backend (or bundled JSON) and renders premium, minimal UI inspired by Apple’s design system.

## Installation

```bash
npm install react-onboarding-sdk
# peer deps expected in the host app
npm install react-native expo @react-native-async-storage/async-storage expo-document-picker
```

## Quick Start

```tsx
import { Onboarding } from 'react-onboarding-sdk';

export default function App() {
  return (
    <Onboarding
      appId="sample-app-id"
      baseUrl="http://192.168.0.105:3000/onboarding"
      onFinish={(collected) => console.log(collected)}
    />
  );
}
```

## Props

- `appId` (string, required): Application identifier used to fetch the onboarding config
- `baseUrl` (string, optional): Defaults to `http://192.168.0.105:3000/onboarding`. The SDK will call `GET {baseUrl}/{appId}`
- `onFinish` (function, optional): Called with all collected data when onboarding completes

## Data Flow

- The SDK fetches from `GET {baseUrl}/{appId}` and expects an envelope `{ success: boolean, data: OnboardingConfig }`
- If the network fails, it falls back to a bundled JSON at `assets/config/fakeDB.json`
- The renderer is schema-driven; each screen contains an array of elements (text, image, button, input, fileUpload, multiSelect, progress, carousel, permissionList, banner)

## Schema

High-level shape of the new config:

```ts
interface OnboardingConfig {
  appId: string;
  configId?: string;
  version?: number;
  locale?: string;
  meta?: { ttlSeconds?: number; updatedAt?: string };
  theme?: {
    colors?: { primary?: string; background?: string; text?: string; muted?: string; success?: string; danger?: string };
    fonts?: { heading?: string; body?: string };
  };
  abTest?: Array<{ variant: string; weight: number; startScreen: string }>;
  screens: Array<{
    id: string;
    name?: string;
    layout?: { scroll?: boolean; padding?: number; align?: 'left' | 'center' | 'right' | 'stretch' };
    background?: { color?: string };
    elements: Element[]; // see below
  }>;
}

type Element =
  | { id: string; type: 'text'; props: { text: string; variant?: 'h1'|'h2'|'h3'|'body'|'caption'; color?: string; align?: 'left'|'center'|'right'|'stretch' } }
  | { id: string; type: 'image'; props: { uri: string; height?: number; resizeMode?: 'cover'|'contain'|'stretch'|'center' } }
  | { id: string; type: 'button'; props: { label: string; background?: string; color?: string; size?: 'sm'|'md'|'lg'|'xl'; leadingIcon?: string }, actions?: Action[] }
  | { id: string; type: 'input'; props: { label: string; name: string; placeholder?: string; keyboardType?: string; required?: boolean } }
  | { id: string; type: 'fileUpload'; props: { label: string; name: string; accept?: string[]; size?: 'sm'|'md'|'lg'|'xl' } }
  | { id: string; type: 'multiSelect'; props: { label: string; name: string; options: string[] } }
  | { id: string; type: 'progress'; props: { valueExpr: string; max?: number } }
  | { id: string; type: 'carousel'; props: { autoplay?: boolean; interval?: number; slides: Array<{ image: string; caption?: string }> } }
  | { id: string; type: 'permissionList'; props: { items: Array<{ permission: string; title: string; subtitle?: string }> } }
  | { id: string; type: 'banner'; props: { title: string; subtitle?: string; background: string; color: string } };

type Action =
  | { type: 'navigate'; target: string }
  | { type: 'validate'; fields: string[] }
  | { type: 'analytics'; event: string }
  | { type: 'api'; request: { method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'; url: string; body?: object; headers?: Record<string,string> }, onSuccess?: Action, onError?: Action }
  | { type: 'toast'; message: string }
  | { type: 'requestPermission'; permissions: string[] }
  | { type: 'finish' };
```

## Collected Data Shape

```ts
interface CollectedDataEvent {
  screenId: string;
  elementId?: string;
  action: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

interface CollectedData {
  appId: string;
  configId?: string;
  values: Record<string, string | number | boolean | string[] | { name: string; type?: string; size?: number; uri?: string } | null>;
  events: CollectedDataEvent[];
}
```

## Example Backend Response

```json
{
  "success": true,
  "data": {
    "appId": "com.example.app",
    "configId": "cfg_2025_08_17_001",
    "version": 1,
    "locale": "en",
    "screens": [ /* see assets/config/fakeDB.json for a full example */ ]
  }
}
```

## Expo Compatibility

- Works in Expo Managed workflow (iOS/Android)
- No custom native modules beyond standard peer dependencies

## Project Structure

```
src/
  index.ts
  Onboarding.tsx
  screens/
    ScreenRenderer.tsx
    elements/
      index.tsx
  utils/
    api.ts
    cache.ts
    types.ts
assets/config/fakeDB.json
```

## Usage

```tsx
import { Onboarding } from 'react-onboarding-sdk';

export default function App() {
  return (
    <Onboarding
      appId="com.example.app"
      baseUrl="http://192.168.0.105:3000/onboarding"
      onFinish={(collected) => console.log('Collected', collected)}
    />
  );
}
```

- **appId**: used to fetch the JSON config from `GET {baseUrl}/{appId}`
- **onFinish**: called when an element triggers `{ type: 'finish' }` action; returns `CollectedData`

The SDK renders screens and elements strictly from the JSON schema. Styling follows a clean, minimal, system-font look suitable for iOS.

## License

ISC
