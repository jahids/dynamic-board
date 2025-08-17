import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import OnboardingScreen from '../index.js';

export default function App() {
  const handleOnboardingComplete = (collectedData) => {
    console.log('Onboarding completed with data:', collectedData);
    // Here you can send the data to your backend API
    // Example: sendToBackend(collectedData);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <OnboardingScreen 
        onComplete={handleOnboardingComplete}
        // configUrl="https://your-api.com/onboarding-config" // Optional: use remote config
      />
    </SafeAreaView>
  );
}
