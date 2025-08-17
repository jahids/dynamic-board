# Bless Dev - React Native Onboarding Package

A dynamic and customizable onboarding screen component for React Native Expo applications with multi-screen navigation and data collection.

## Features

- 🚀 Easy to integrate with React Native Expo
- 📱 Multi-screen onboarding flow with navigation
- 🔄 Supports both local JSON config and remote API endpoints
- ⚡ Built-in loading and error states
- 🎨 Dynamic screen rendering based on configuration
- 📊 Data collection and tracking throughout the flow
- 📁 File upload support with expo-document-picker
- 🎯 Progress indicator and screen navigation
- 📝 Comprehensive data logging on completion

## Installation

```bash
npm install bless-dev
```

or

```bash
yarn add bless-dev
```

## Usage

### Basic Usage (Local Config)

```javascript
import OnboardingScreen from 'bless-dev';

export default function App() {
  const handleOnboardingComplete = (collectedData) => {
    console.log('Onboarding completed:', collectedData);
    // Send data to your backend API here
  };

  return (
    <OnboardingScreen 
      onComplete={handleOnboardingComplete}
    />
  );
}
```

### Remote Configuration

You can also use a remote JSON endpoint for configuration:

```javascript
import OnboardingScreen from 'bless-dev';

export default function App() {
  return (
    <OnboardingScreen 
      configUrl="https://your-api.com/onboarding-config"
      onComplete={(data) => console.log('Completed:', data)}
    />
  );
}
```

### Data Collection

The component automatically collects data throughout the onboarding flow:

```javascript
import OnboardingScreen from 'bless-dev';

export default function App() {
  const handleComplete = (collectedData) => {
    // Example collected data structure:
    // {
    //   screen1: {
    //     screenId: "screen1",
    //     actionClicked: "Next",
    //     timestamp: "2024-01-01T12:00:00.000Z"
    //   },
    //   screen2: {
    //     screenId: "screen2", 
    //     actionClicked: "Continue",
    //     fileUploaded: "profile.jpg",
    //     timestamp: "2024-01-01T12:01:00.000Z"
    //   }
    // }
    
    // Send to your backend
    fetch('/api/onboarding-complete', {
      method: 'POST',
      body: JSON.stringify(collectedData)
    });
  };

  return <OnboardingScreen onComplete={handleComplete} />;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `configUrl` | `string` | `null` | Optional URL to fetch remote JSON configuration |
| `onComplete` | `function` | `null` | Callback function called when onboarding is complete |

## Configuration Format

The component expects JSON configuration in the following format:

```json
{
  "screens": [
    {
      "id": "screen1",
      "type": "text",
      "content": {
        "title": "Welcome to Our App!",
        "subtitle": "Let's get you started",
        "color": "#333333",
        "background": "#ffffff",
        "fontSize": "xl"
      },
      "actions": [
        {
          "type": "button",
          "label": "Next",
          "color": "#ffffff",
          "background": "#007AFF",
          "target": "screen2"
        }
      ]
    },
    {
      "id": "screen2",
      "type": "fileUpload",
      "content": {
        "title": "Upload Profile Picture",
        "subtitle": "This helps personalize your experience",
        "color": "#333333",
        "background": "#f8f9fa"
      },
      "actions": [
        {
          "type": "button",
          "label": "Skip",
          "color": "#666666",
          "background": "transparent",
          "target": "screen3"
        },
        {
          "type": "button",
          "label": "Continue",
          "color": "#ffffff",
          "background": "#28a745",
          "target": "screen3"
        }
      ]
    }
  ]
}
```

## Features

### Screen Types
- **text**: Simple text screens with title and subtitle
- **fileUpload**: File upload screens with document picker
- **banner**: Banner-style screens with custom styling

### Navigation
- Automatic screen navigation based on button targets
- Progress indicator showing current position
- Support for "end" target to complete onboarding

### Data Collection
- Tracks user interactions throughout the flow
- Collects file upload information
- Timestamps all actions
- Comprehensive data logging on completion

### File Upload
- Uses expo-document-picker for file selection
- Supports image files by default
- Shows upload confirmation
- Tracks uploaded file names

### Styling
- Dynamic styling based on configuration
- Customizable colors, backgrounds, and fonts
- Responsive design for all screen sizes
- Modern UI with smooth transitions

## Screen Types

### Text Screen
```json
{
  "type": "text",
  "content": {
    "title": "Welcome!",
    "subtitle": "Get started with our app",
    "color": "#333333",
    "background": "#ffffff",
    "fontSize": "xl"
  }
}
```

### File Upload Screen
```json
{
  "type": "fileUpload",
  "content": {
    "title": "Upload File",
    "subtitle": "Choose a file to upload",
    "color": "#333333",
    "background": "#f8f9fa"
  }
}
```

### Banner Screen
```json
{
  "type": "banner",
  "content": {
    "title": "🎉 Success!",
    "subtitle": "You've completed the setup",
    "background": "#28a745",
    "color": "#ffffff"
  }
}
```

## Requirements

- React Native >= 0.60.0
- Expo >= 40.0.0
- React >= 16.8.0
- expo-document-picker >= 10.0.0

## License

ISC

## Author

bless
