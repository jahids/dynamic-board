import { OnboardingConfig, OnboardingResponse, OnboardingError, OnboardingData } from './types';

// Default configuration
const DEFAULT_CONFIG = {
  baseUrl: 'http://192.168.0.105:3000',
  timeout: 10000, // 10 seconds
};

// Error factory
function createError(code: OnboardingError['code'], message: string, details?: any): OnboardingError {
  return {
    code,
    message,
    details,
  };
}

// Validate appId
function validateAppId(appId: string): OnboardingError | null {
  if (!appId || typeof appId !== 'string') {
    return createError('INVALID_APP_ID', 'App ID must be a non-empty string');
  }
  
  if (appId.trim().length === 0) {
    return createError('INVALID_APP_ID', 'App ID cannot be empty or whitespace');
  }
  
  return null;
}

// Fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Main client function
export async function getOnboardingData(
  appId: string,
  config: Partial<OnboardingConfig> = {}
): Promise<OnboardingResponse> {
  // Validate appId
  const validationError = validateAppId(appId);
  if (validationError) {
    return {
      success: false,
      error: validationError,
    };
  }

  // Merge configuration
  const finalConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const url = `${finalConfig.baseUrl}/api/onboarding/${encodeURIComponent(appId)}`;

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
      finalConfig.timeout
    );

    if (!response.ok) {
      let error: OnboardingError;
      
      switch (response.status) {
        case 404:
          error = createError('NOT_FOUND', `Onboarding data not found for app ID: ${appId}`);
          break;
        case 400:
          error = createError('INVALID_APP_ID', `Invalid app ID: ${appId}`);
          break;
        case 500:
          error = createError('SERVER_ERROR', 'Internal server error');
          break;
        default:
          error = createError('SERVER_ERROR', `HTTP error: ${response.status}`);
      }
      
      return {
        success: false,
        error,
      };
    }

    const responseData = await response.json();
    
    // Handle the actual API response structure
    if (!responseData.success || !responseData.data) {
      return {
        success: false,
        error: createError('UNKNOWN', 'Invalid response format from server'),
      };
    }
    
    const data: OnboardingData = responseData.data;
    
    // Validate response structure
    if (!data || !Array.isArray(data.screens)) {
      return {
        success: false,
        error: createError('UNKNOWN', 'Invalid data format from server'),
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    let sdkError: OnboardingError;
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      sdkError = createError('NETWORK_ERROR', 'Network error - unable to connect to server');
    } else if (error instanceof Error && error.name === 'AbortError') {
      sdkError = createError('TIMEOUT', 'Request timeout');
    } else if (error instanceof SyntaxError) {
      sdkError = createError('UNKNOWN', 'Invalid JSON response from server');
    } else {
      sdkError = createError('UNKNOWN', `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return {
      success: false,
      error: sdkError,
    };
  }
}

// Utility function to check if response is successful
export function isOnboardingSuccess(response: OnboardingResponse): response is { success: true; data: OnboardingData } {
  return response.success && response.data !== undefined;
}

// Utility function to get error message
export function getOnboardingErrorMessage(response: OnboardingResponse): string {
  return response.error?.message || 'Unknown error occurred';
}
