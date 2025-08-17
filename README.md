# react-onboarding-sdk

Mobile-first, Expo-focused onboarding SDK for React Native apps. Fetches onboarding flows from your backend and renders professional screens with automatic navigation and data collection.

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

- The SDK fetches from `GET {baseUrl}/{appId}` and expects an envelope `{ success: boolean, data: OnboardingData }`
- If the network fails, it falls back to a local JSON config bundled with the package
- The SDK caches the last successful config using AsyncStorage for basic offline support

## Screen Types

- `text`: Title + subtitle with configurable colors
- `fileUpload`: Uses `expo-document-picker` to select a file; filename is stored
- `banner`: Large banner style with CTA buttons

## Collected Data Shape

```ts
{
  [screenId: string]: {
    screenId: string;
    actionClicked: string;
    timestamp: string;
    fileUploaded?: string;
  }
}
```

## Example Backend Response

```json
{
  "success": true,
  "data": {
    "_id": "68a16fed4fc91007bd28ff9f",
    "appId": "jakir-board",
    "screens": [ /* ... see your backend payload ... */ ],
    "createdAt": "2025-08-17T06:00:13.277Z",
    "updatedAt": "2025-08-17T06:00:13.277Z",
    "__v": 0
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
    TextScreen.tsx
    FileUploadScreen.tsx
    BannerScreen.tsx
  utils/
    api.ts
    cache.ts
    types.ts
assets/config/fakeDB.json
```

## Notes

- Ensure your app installs the peer dependencies listed above
- `baseUrl` can be omitted for production if your SDK bundles a default; override for local development
- Data is logged to the console on finish and returned via `onFinish`

## License

ISC
