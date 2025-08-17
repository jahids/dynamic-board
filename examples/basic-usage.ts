import { getOnboardingData, isOnboardingSuccess, getOnboardingErrorMessage } from '@myorg/onboarding-sdk';

// Basic usage
async function fetchOnboardingData() {
  try {
    const response = await getOnboardingData('my-app-id');
    
    if (isOnboardingSuccess(response)) {
      console.log('Onboarding data:', response.data);
      console.log('Number of screens:', response.data.screens.length);
      
      // Access screen data
      response.data.screens.forEach((screen, index) => {
        console.log(`Screen ${index + 1}:`, {
          id: screen.id,
          type: screen.type,
          title: screen.content.title,
          actions: screen.actions.length
        });
      });
    } else {
      console.error('Error fetching onboarding data:', getOnboardingErrorMessage(response));
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Usage with custom configuration
async function fetchWithCustomConfig() {
  const response = await getOnboardingData('my-app-id', {
    baseUrl: 'http://localhost:3000', // Override for local development
    timeout: 5000 // 5 second timeout
  });
  
  if (isOnboardingSuccess(response)) {
    console.log('Success:', response.data);
  } else {
    console.error('Error:', response.error);
  }
}

// Error handling examples
async function handleErrors() {
  const response = await getOnboardingData('invalid-app-id');
  
  if (!isOnboardingSuccess(response)) {
    switch (response.error?.code) {
      case 'INVALID_APP_ID':
        console.error('Invalid app ID provided');
        break;
      case 'NOT_FOUND':
        console.error('Onboarding data not found for this app');
        break;
      case 'NETWORK_ERROR':
        console.error('Network connection failed');
        break;
      case 'TIMEOUT':
        console.error('Request timed out');
        break;
      case 'SERVER_ERROR':
        console.error('Server error occurred');
        break;
      default:
        console.error('Unknown error:', response.error?.message);
    }
  }
}

// Export for use in other files
export {
  fetchOnboardingData,
  fetchWithCustomConfig,
  handleErrors
};

