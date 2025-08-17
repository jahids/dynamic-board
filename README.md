# @myorg/onboarding-sdk

A TypeScript SDK for fetching onboarding data from backend APIs with React hooks support.

## Features

- 🚀 **TypeScript First** - Full TypeScript support with comprehensive type definitions
- 📡 **API Integration** - Fetch onboarding data from your backend API
- ⚛️ **React Hooks** - Built-in React hooks with caching and state management
- 🔧 **Configurable** - Custom base URL, timeouts, and error handling
- 📦 **Lightweight** - Minimal dependencies, tree-shakeable
- 🛡️ **Error Handling** - Comprehensive error handling with typed error codes
- ⚡ **Caching** - Built-in caching with configurable stale times
- 🎯 **Developer Friendly** - Clear API, good documentation, and examples

## Installation

```bash
npm install @myorg/onboarding-sdk
```

or

```bash
yarn add @myorg/onboarding-sdk
```

## Usage

### Basic Usage

```typescript
import { getOnboardingData, isOnboardingSuccess } from '@myorg/onboarding-sdk';

async function fetchOnboardingData() {
  const response = await getOnboardingData('my-app-id');
  
  if (isOnboardingSuccess(response)) {
    console.log('Onboarding data:', response.data);
    console.log('App ID:', response.data.appId);
    console.log('Screens:', response.data.screens.length);
  } else {
    console.error('Error:', response.error?.message);
  }
}
```

### With Custom Configuration

```typescript
import { getOnboardingData } from '@myorg/onboarding-sdk';

const response = await getOnboardingData('my-app-id', {
  baseUrl: 'http://localhost:3000', // Override for local development
  timeout: 5000 // 5 second timeout
});
```

### React Hook Usage

```typescript
import React from 'react';
import { useOnboarding } from '@myorg/onboarding-sdk';

function OnboardingComponent({ appId }: { appId: string }) {
  const { data, loading, error, refetch, isStale } = useOnboarding(appId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h2>Onboarding for {data.appId}</h2>
      {isStale && <p>Data may be stale</p>}
      <p>Screens: {data.screens.length}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Hook with Custom Options

```typescript
const { data, loading, error, refetch } = useOnboarding(appId, {
  enabled: true,
  refetchOnMount: true,
  staleTime: 2 * 60 * 1000, // 2 minutes
  cacheTime: 5 * 60 * 1000, // 5 minutes
});
```

## API Reference

### Functions

#### `getOnboardingData(appId: string, config?: OnboardingConfig): Promise<OnboardingResponse>`

Fetches onboarding data from the backend API.

**Parameters:**
- `appId` (required): The application ID to fetch onboarding data for
- `config` (optional): Configuration object with baseUrl and timeout

**Returns:** Promise that resolves to an `OnboardingResponse`

#### `isOnboardingSuccess(response: OnboardingResponse): boolean`

Type guard to check if the response was successful.

#### `getOnboardingErrorMessage(response: OnboardingResponse): string`

Extracts error message from response.

### React Hooks

#### `useOnboarding(appId: string, options?: UseOnboardingOptions): UseOnboardingResult`

React hook for fetching and caching onboarding data.

**Parameters:**
- `appId` (required): The application ID
- `options` (optional): Hook configuration options

**Returns:** Object with `data`, `loading`, `error`, `refetch`, and `isStale`

## Types

### OnboardingData

```typescript
interface OnboardingData {
  _id: string;
  appId: string;
  screens: OnboardingScreen[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
```

### OnboardingScreen

```typescript
interface OnboardingScreen {
  id: string;
  type: 'text' | 'fileUpload' | 'banner';
  content: OnboardingContent;
  actions: OnboardingAction[];
}
```

### OnboardingError

```typescript
interface OnboardingError {
  code: 'NETWORK_ERROR' | 'INVALID_APP_ID' | 'NOT_FOUND' | 'SERVER_ERROR' | 'TIMEOUT' | 'UNKNOWN';
  message: string;
  details?: any;
}
```

## Error Handling

The SDK provides comprehensive error handling with typed error codes:

- `NETWORK_ERROR`: Unable to connect to the server
- `INVALID_APP_ID`: Invalid or empty app ID provided
- `NOT_FOUND`: Onboarding data not found for the app ID
- `SERVER_ERROR`: Server returned an error
- `TIMEOUT`: Request timed out
- `UNKNOWN`: Unexpected error occurred

## Features

### Core Features
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **API Integration**: Fetch data from your backend API endpoint
- **React Hooks**: Built-in hooks with caching and state management
- **Error Handling**: Typed error codes and comprehensive error messages
- **Caching**: Configurable caching with stale time management
- **Configurable**: Custom base URLs, timeouts, and options

### Backend Integration
- **RESTful API**: Works with your existing `/api/onboarding/:appId` endpoint
- **Response Format**: Handles your API's `{ success: true, data: {...} }` format
- **Error Mapping**: Maps HTTP status codes to typed error codes
- **Timeout Support**: Configurable request timeouts

### React Integration
- **useOnboarding Hook**: Automatic data fetching and caching
- **Loading States**: Built-in loading state management
- **Error States**: Comprehensive error handling in React components
- **Refetch Support**: Manual data refresh capabilities
- **Stale Data Detection**: Know when data might be outdated

## Requirements

- Node.js >= 16.0.0
- React >= 16.8.0 (for hooks)
- TypeScript >= 4.9.0 (recommended)

## License

ISC

## Author

bless
